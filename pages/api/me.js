import auth0 from '../../lib/auth0'
import dbConnect from "../../utils/dbConnect";
import Person from "../../models/Person";
import Location from "../../models/Location"
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
                uid: user.nickname,
            });

            newPerson.save((error) => {

                if (error) {
                    res.status(500).end(error.message)
                }

            });
        } else {
            response.current_location = person.current_location;
            response.locations = await Location.find({})
        }

        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).end(error.message)
    }
})