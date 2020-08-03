import dbConnect from '../../utils/dbConnect';
import Person from '../../models/Person';
import Location from '../../models/Location';

export default async function handler(req, res) {
    const {method} = req

    await dbConnect()

    switch (method) {
        case 'POST':
            const person = await Person.findOne({"uid": req.body.uid});
            if (person == null) {
                return res.status(400).json({success: false});
            }

            if (person.current_location !== null) {
                return res.status(400).json({success: false, message: "You're already checked in!"});
            }

            const location = await Location.findOne({"_id": req.body.location});
            if (location == null) {
                return res.status(400).json({success: false, message: "Location not found"});
            }

            const updated_person = await Person.updateOne({"uid": req.body.uid}, {
                current_location: {
                    location: req.body.location,
                    time_in: Date.now()
                }
            });

            if (!updated_person) {
                return res.status(400).json({success: false});
            }

            res.status(200).json({success: true, message: "Checked in to '" + location.name + "'"});
            break
        default:
            res.status(400).json({success: false});
            break
    }
}
