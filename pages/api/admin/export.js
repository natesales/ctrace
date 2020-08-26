import dbConnect from "../../../utils/dbConnect";
import Location from "../../../models/Location";
import Person from "../../../models/Person";
import stringify from "csv-stringify";
import strftime from "strftime";

function getLocationName(id, locations) {
    for (const location in locations) {
        if (locations[location]._id.toString() === id) {
            return locations[location].name;
        }
    }
}

export default async function handler(req, res) {
    try {
        const {method} = req

        await dbConnect()

        switch (method) {
            case "GET":
                const locations = await Location.find({});

                let export_object = [["Name", "Location", "Time In", "Time Out"]];

                for await (const person of Person.find()) {
                    for (const entry in person.log) {
                        const location_name = await getLocationName(person.log[entry].location, locations);
                        console.log(location_name)
                        export_object.push([person.name, location_name, strftime("%I:%M %p %B %d, %Y", new Date(person.log[entry].time_in)), person.log[entry].time_out ? strftime("%I:%M %p %B-%d-%Y", new Date(person.log[entry].time_in)) : "Not checked out"])
                    }
                }

                stringify(export_object, function (err, output) {
                    res.setHeader("Content-Disposition", "inline; filename=\"cTrace-Export-" + strftime("%I-%M-%p-%B-%d-%Y") + "-.csv\"")
                    res.status(200).send(Buffer.from(output));
                });

                break
            default:
                res.status(400).json({success: false})
                break
        }
    } catch (error) {
        console.error(error);
        res.status(error.status || 500).end(error.message)
    }
    
}
