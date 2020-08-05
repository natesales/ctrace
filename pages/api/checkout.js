import dbConnect from '../../utils/dbConnect';
import Person from '../../models/Person';
import auth0 from '../../lib/auth0'

export default auth0.requireAuthentication(async function handler(req, res) {
    const {user} = await auth0.getSession(req);

    const {method} = req;

    await dbConnect();

    switch (method) {
        case 'POST':
            const person = await Person.findOne({"uid": user.nickname});
            if (person == null) {
                return res.status(400).json({success: false, message: "Person with this UID doesn't exist"});
            }

            // Check for not checked in
            if (person.log.length === 0 || "time_out" in person.log[person.log.length - 1]) {
                return res.status(400).json({success: false, message: "You're not checked in!"});
            }

            // Set the time_out
            const person_to_update = await Person.findOne({uid: user.nickname})
            
            let entry = person_to_update.log[person_to_update.log.length - 1];
            entry["time_out"] = Date.now();
            person_to_update.markModified('log');
            await person_to_update.save();
            console.log(entry);

            console.log(person_to_update, 'Updated person');

            if (!person_to_update) {
                return res.status(400).json({success: false});
            }

            res.status(200).json({success: true});
            break;
        default:
            res.status(400).json({success: false});
            break
    }
})
