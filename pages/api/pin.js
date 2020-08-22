import dbConnect from "../../utils/dbConnect";
import Person from "../../models/Person";
import auth0 from "../../lib/auth0";

export default auth0.requireAuthentication(async function handler(req, res) {
    const {user} = await auth0.getSession(req);
    await dbConnect();

    const {method} = req;

    switch (method) {
        case 'POST':
            const person = await Person.findOne({"uid": user.nickname});
            if (person == null) {
                return res.status(400).json({success: false, message: "Person with this UID doesn't exist"});
            }

            //Add the pinned locations, should be in an array of object ids in string format.
            await Person.findOneAndUpdate({uid: user.nickname}, {pinned_locations: req.body.pinned_locations}, {new: true})
                .then(() => {
                    res.status(200).json({success: true, message: "Updated your pinned locations."})
                })
                .catch(error => {
                    res.status(400).json({success: false, message: error.message});
                });

            break;
        default:
            res.status(400).json({success: false});
            console.log('Response was default');
            break;
    }

})