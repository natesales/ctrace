import dbConnect from '../../utils/dbConnect';
import Person from '../../models/Person';

export default async function handler(req, res) {
    const {method} = req

    await dbConnect()

    switch (method) {
        case 'POST':
            const person = await Person.find({"uid": req.body.uid});
            if (!person) {
                return res.status(400).json({success: false});
            }

            if (!person[0]["current_location"]) {
                return res.status(400).json({success: false, message: "You're not checked in anywhere!", db: person});
            }

            // TODO: Check if this actually succeed and return as success variable
            const db_response = await Person.updateOne({"uid": req.body.uid}, {
                current_location: null
            })

            res.status(200).json({success: true, resp: db_response});
            break
        default:
            res.status(400).json({success: false})
            break
    }
}
