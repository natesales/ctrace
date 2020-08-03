import dbConnect from '../../utils/dbConnect';
import Person from '../../models/Person';
import auth0 from '../../lib/auth0'

export default async function handler(req, res) {
    // auth0.requireAuthentication(
    // const {user} = auth0.getSession(req);

    const {method} = req;

    await dbConnect();

    switch (method) {
        case 'POST':
            const person = await Person.findOne({"uid": req.body.uid});
            if (person == null) {
                return res.status(400).json({success: false, message: "Person with this UID doesn't exist"});
            }

            // Check for not checked in
            if (person.log.length === 0 || "time_out" in person.log[person.log.length - 1]) {
                return res.status(400).json({success: false, message: "You're not checked in!"});
            }

            // Set the time_out
            const updated_person = await Person.findOne({uid: req.body.uid}).then(async function (doc) {
                let entry = doc.log[doc.log.length - 1];
                entry["time_out"] = Date.now();
                doc.markModified('log');
                await doc.save();
                console.log(entry);
            });

            console.log(updated_person);

            if (!updated_person) {
                return res.status(400).json({success: false});
            }

            res.status(200).json({success: true});
            break;
        default:
            res.status(400).json({success: false});
            break
    }
}
