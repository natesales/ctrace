import auth0 from "../../lib/auth0";
import dbConnect from "../../utils/dbConnect";
import Person from "../../models/Person";
import Location from "../../models/Location";
import mongoose from "mongoose";

export default auth0.requireAuthentication(async function me(req, res) {
    try {
        const {user} = await auth0.getSession(req);

        await dbConnect();

        const response = {google_info: user};

        const person = await Person.findOne({"uid": user.nickname});
        if (person === null) {
            const newPerson = new Person({
                _id: new mongoose.Types.ObjectId(),
                createdAt: new Date(),
                uid: user.nickname,
                name: user.name
            });

            newPerson.save((error) => {
                if (error) {
                    res.status(500).end(error.message)
                }
            });
        }

        if (person.log.length > 0 && !("time_out" in person.log[person.log.length - 1])) {
            // console.log("Found the checked in location")
            response.current_location = await Location.findById(person.log[person.log.length - 1].location);
        } else {
            response.current_location = null;
        }

        if (person.pinned_locations.length > 0) {
            response.pinned_locations = [];          

            response.pinned_locations = await Promise.all(person.pinned_locations.map(async (location) => {
                return await Location.findOne({_id: mongoose.Types.ObjectId(location)});
            }))
        } else {
            response.pinned_locations = null;
        }

        response.locations = await Location.find({});

        // console.log(response, 'RESPONSE FROM ME');
        res.json(response);
    } catch (error) {
        // console.error(error);
        res.status(error.status || 500).end(error.message);
    }
})