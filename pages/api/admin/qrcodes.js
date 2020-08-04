import dbConnect from '../../../utils/dbConnect';
import Location from '../../../models/Location';
import QRCode from 'qrcode';
import dotenv from 'dotenv';

dotenv.config();

export default async function handler(req, res) {
    const {method} = req;

    await dbConnect();

    switch (method) {
        case 'GET':
            let qrcodes = [];

            for await (const location of Location.find()) {
                const name = location.name;
                const image = await QRCode.toDataURL(process.env.BASE_URL + "?loc=" + location._id);

                qrcodes.push({
                    name: name,
                    image: image
                })
            }

            res.status(200).json({success: true, data: qrcodes});
            break;
        default:
            res.status(400).json({success: false});
            break
    }
}
