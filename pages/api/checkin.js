import dbConnect from '../../utils/dbConnect';
import Person from '../../models/Person';
import Location from '../../models/Location';
import auth0 from '../../lib/auth0'

export default auth0.requireAuthentication(async function handler(req, res) {

    const {user} = await auth0.getSession(req);

    const {method} = req;

    await dbConnect();

    switch (method) {
        case 'POST':
            const person = await Person.findOne({"uid": user.nickname});
            if (person == null) {
                return res.status(400).json({success: false});
            }

            // Check for already signed in
            if (person.log.length > 0 && !("time_out" in person.log[person.log.length - 1])) {
                return res.status(400).json({success: false, message: "You're already checked in!"});
            }

            // Check if the location doesn't exist
            const location = await Location.findOne({"_id": req.body.location});
            if (location == null) {
                return res.status(400).json({success: false, message: "Location doesn't exist"});
            }

            location.current_occupancy += 1;
            location.log.push({
                user: person._id,
                time_in: new Date(),
            })
            location.markModified('log')
            await location.save();

            // Push the new checkin
            const updated_person = await Person.update({uid: user.nickname}, {
                $push: {
                    log: {
                        location: req.body.location,
                        time_in: new Date(),
                    }
                }
            });

            if (!updated_person) {
                return res.status(400).json({success: false});
            }

            res.status(200).json({success: true, message: "Checked in to '" + location.name + "'"});
            break;
        default:
            res.status(400).json({success: false, message: "Default"});
            break
    }
})
