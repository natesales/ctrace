import dbConnect from "../../utils/dbConnect";
import Person from "../../models/Person";
import auth0 from "../../lib/auth0";

export default auth0.requireAuthentication(async function handler(req, res) {
    const {user} = await auth0.getSession(req);
    const {method} = req;
    await dbConnect();

    switch (method) {
        case "POST":
            if (!(req.body.direction === "time_in" || req.body.direction === "time_out")) {
                return res.status(400).json({success: false, message: "direction must be either \"time_in\" or \"time_out\""})
            }

            const person = await Person.findOne({"uid": user.nickname});
            if (person == null) {
                return res.status(400).json({success: false, message: "Person object not found"});
            }

            // Update the last location's direction key with the new time
            person.log[person.log.length - 1][req.body.direction] = req.body.time;
            // TODO: Maybe add person.hasEdited = true; so we can record the change was made
            // Push the update to the database
            person.markModified('log');
            await person.save();

            res.status(200).json({success: true, message: "Time updated to " + req.body.time});
            break;
        default:
            res.status(400).json({success: false, message: "Default"});
            break
    }
});
