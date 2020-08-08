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
            const updated_person = await Person.findOne({uid: user.nickname}).then(async (doc) => {
                let entry = doc.log[doc.log.length - 1];
                entry["time_out"] = Date.now();
                doc.markModified('log');
                await doc.save();
                console.log(entry);
                
            });

            // if (!updated_person) {
            //     return res.status(400).json({success: false});
            // }

            //TODO: Fix the updated person so it actually responds with a good error. Also we need to insert the name below.

            res.status(200).json({success: true, message: 'Checked out of INSERT NAME HERE'});
            break;
        default:
            res.status(400).json({success: false});
            break
    }
})
