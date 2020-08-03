import dbConnect from '../../utils/dbConnect';
import Person from '../../models/Person';
import auth0 from '../../lib/auth0'

export default auth0.requireAuthentication(async function handler(req, res) {

    const {user} = auth0.getSession(req);

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

            // TODO: This isn't setting time_out
            // Set the time_out
            const updated_person = await Person.findOne({uid: req.body.uid}).then(async function (doc) {
                let entry = doc.log[doc.log.length - 1];
                entry["time_out"] = Date.now();
                await doc.save();
                console.log(entry);
            });

            console.log(updated_person);

            if (!updated_person) {
                return res.status(400).json({success: false});
            }

            res.status(200).json({success: true});
            break
        default:
            res.status(400).json({success: false});
            break
    }
})
