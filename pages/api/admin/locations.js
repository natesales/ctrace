import dbConnect from "../../../utils/dbConnect";
import Location from "../../../models/Location";

export default async function handler(req, res) {
    const {method} = req;

    await dbConnect();

    switch (method) {
        case 'GET':
            const locations = await Location.find();
            res.status(200).json({success: true, data: {locations: locations}});
            break;

        default:
            res.status(400).json({success: false});
            break
    }
}
