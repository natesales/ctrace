import dbConnect from '../../../utils/dbConnect';
import Location from '../../../models/Location';

export default async function handler(req, res) {
    const {method} = req;

    await dbConnect();

    switch (method) {
        case 'POST':
            const location = await Location.findOne({"name": req.body["name"]});
            if (location !== null) {
                return res.status(400).json({success: false, message: "Location with this name already exists"});
            }

            const location_create = await Location.create({
                name: req.body["name"],
                max_occupancy: req.body["max_occupancy"],
            });

            if (location_create) {
                res.status(200).json({success: true});
            } else {
                res.status(200).json({success: false});
            }

            break;
        default:
            res.status(400).json({success: false});
            break
    }
}
