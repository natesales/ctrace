import dbConnect from "../../utils/dbConnect";
import Person from "../../models/Person";
import Location from "../../models/Location"
import auth0 from "../../lib/auth0";

export default auth0.requireAuthentication(async function handler(req, res) {
    const {user} = await auth0.getSession(req);
    const {method} = req;
    await dbConnect();

    switch (method) {
        case "POST":
            const person = await Person.findOne({"uid": user.nickname});
            if (person == null) {
                return res.status(400).json({success: false, message: "Person object not found"});
            }

            if (req.body.time_in !== null) {
                person.log[person.log.length - 1]["time_in"] = req.body.time_in;
            }

            if (req.body.time_out !== null) {
                person.log[person.log.length - 1]["time_out"] = req.body.time_out;
                const location = await Location.findOne({_id: person.log[person.log.length - 1].location })
                location.current_occupancy -= 1;
                await location.save();
            }

            // TODO: Maybe add person.hasEdited = true; so we can record the change was made
            // Push the update to the database
            person.markModified('log');
            await person.save();

            res.status(200).json({success: true, message: "Time updated to " + req.body.time_in + req.body.time_out });
            break;
        default:
            res.status(400).json({success: false, message: "Default"});
            break
    }
});
