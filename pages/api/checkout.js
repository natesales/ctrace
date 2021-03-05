import dbConnect from '../../utils/dbConnect';
import Person from '../../models/Person';
import Location from '../../models/Location';
import auth0 from '../../lib/auth0';

export default auth0.withApiAuthRequired(async function handler(req, res) {
    const {user} = await auth0.getSession(req, res);
    const user_id = user["sub"].split("|")[2];

    const {method} = req;

    await dbConnect();

    switch (method) {
        case 'POST':
            const time_marked = new Date()

            const person = await Person.findOne({"uid": user_id});
            if (person == null) {
                return res.status(400).json({success: false, message: "Person with this UID doesn't exist"});
            }

            // Check for not checked in
            if (person.log.length === 0 || "time_out" in person.log[person.log.length - 1]) {
                return res.status(400).json({success: false, message: "You're not checked in!"});
            }

            // Set the time_out
            await Person.findOne({uid: user_id}).then(async (doc) => {
                let entry = doc.log[doc.log.length - 1];
                entry["time_out"] = time_marked;
                doc.markModified('log');
                await doc.save();
            }).then(async () => {
                const location = await Location.findOne({_id: person.log[person.log.length - 1].location});
                location.current_occupancy -= 1;
                location.log[location.log.length - 1].time_out = time_marked;
                location.markModified("log")
                await location.save();
                res.status(200).json({success: true, message: "Checked out of '" + location.name + "'"})
            })

            break;
        default:
            res.status(400).json({success: false});
            break
    }
})
