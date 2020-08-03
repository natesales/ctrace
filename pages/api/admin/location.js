import dbConnect from '../../../utils/dbConnect';
import Location from '../../../models/Location';

export default async function handler(req, res) {
    const {method} = req

    await dbConnect()

    switch (method) {
        case 'POST':
            const location = await Location.findOne({"name": req.body["name"]});
            if (location.length == null) {
                return res.status(400).json({success: false});
            }

            Location.insertOne({
                name: req.body["name"],
                max_occupancy: req.body["max_occupancy"]
            })

            // TODO: Check if this actually succeed and return as success variable
            res.status(200).json({success: true});
            break
        default:
            res.status(400).json({success: false})
            break
    }
}
