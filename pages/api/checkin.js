import dbConnect from '../../utils/dbConnect';
import Person from '../../models/Person';
import Location from '../../models/Location'

export default async function handler(req, res) {
    const {method} = req

    await dbConnect()

    switch (method) {
        case 'POST':
            const person = await Person.find({"uid": req.body.uid});
            if (person.length !== 1) {
                return res.status(400).json({success: false});
            }

            if (person[0]["current_location"]) {
                return res.status(400).json({success: false, message: "You're already checked in!"});
            }

            const location = await Location.findById(req.body.location);
            if (!location) {
                return res.status(400).json({success: false, message: "Location not found"});
            }

            // TODO: Check if this actually succeed and return as success variable
            await Person.updateOne({"uid": req.body.uid}, {
                current_location: {
                    location: req.body.location,
                    time_in: Date.now()
                }
            })

            res.status(200).json({success: true});
            break
        default:
            res.status(400).json({success: false})
            break
    }
}
