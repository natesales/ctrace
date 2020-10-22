import dbConnect from "../../../utils/dbConnect";
import Location from "../../../models/Location";
import Person from "../../../models/Person";
import stringify from "csv-stringify";
import strftime from "strftime";

function getLocationName(id, locations) {
    for (const location in locations) {
        if (locations[location]._id.toString() === id) {
            return locations[location].name;
        } else {
            return "Deleted Location";
        }
    }
}

export default async function handler(req, res) {
    if (process.env.ADMIN_ENABLED) {
        try {
            const {method} = req
            
            const uid = req.query.uid;
            const is15 = req.query.is15;
            const start_time = req.query.start_time;
            const end_time = req.query.end_time;

            console.log(uid);

            await dbConnect()

            switch (method) {
                case "GET":
                    const locations = await Location.find({});

                    let export_object = [["Name", "Location", "Time In", "Time Out"]];

                    if (uid !== undefined && uid !== 'null') {
                        if (is15 === 'true') {
                            // console.log(uid);
                            // const person = await Person.findOne({'uid': uid});
                            // if (person !== null) {
                            //     const people = await Person.find({});
                            //     for (const entry in person.log) {
                            //         if (new Date(entry.time_out).getTime() - new Date(entry.time_in).getTime() >= 840000) { 
                            //             const mainLocation = getLocationName(entry.location, locations)
                            //             for (const other in people) {
                            //                 for (const otherEntry in other.log) {
                            //                     if (getLocationName(otherEntry.location, locations) === mainLocation && new Date(entry.time_in).getTime() <= new Date(otherEntry.time_out).getTime() && new Date(entry.time_out).getTime() >= new Date(otherEntry.time_in).getTime()) {
                            //                         export_object.push([other.uid, mainLocation, strftime("%I:%M %p %B %d, %Y", new Date(other.log[entry].time_in)), other.log[entry].time_out ? strftime("%I:%M %p %B %d, %Y", new Date(other.log[entry].time_out)) : "Not checked out"])
                            //                     }
                            //                 }
                            //             }
                            //             export_object.push([person.uid, mainLocation, strftime("%I:%M %p %B %d, %Y", new Date(person.log[entry].time_in)), person.log[entry].time_out ? strftime("%I:%M %p %B %d, %Y", new Date(person.log[entry].time_out)) : "Not checked out"])
                            //         }

                            //         // const location_name = getLocationName(person.log[entry].location, locations);
                            //         // console.log(location_name)
                            //         // export_object.push([person.uid, location_name, strftime("%I:%M %p %B %d, %Y", new Date(person.log[entry].time_in)), person.log[entry].time_out ? strftime("%I:%M %p %B %d, %Y", new Date(person.log[entry].time_out)) : "Not checked out"])
                            //     }
                            // } else {
                            //     res.redirect('/dashboard');
                            //     break;
                            // }
                        } else {
                            // console.log(uid);
                            const person = await Person.findOne({'uid': uid});
                            if (person !== null) {
                                for (const entry in person.log) {
                                    const location_name = getLocationName(person.log[entry].location, locations);
                                    // console.log(location_name)
                                    export_object.push([person.uid, location_name, strftime("%I:%M %p %B %d, %Y", new Date(person.log[entry].time_in)), person.log[entry].time_out ? strftime("%I:%M %p %B %d, %Y", new Date(person.log[entry].time_out)) : "Not checked out"])
                                }
                            } else {
                                // res.redirect('/dashboard');
                                break;
                            }
                        }
                    } else if (start_time !== undefined && end_time !== undefined) {
                        for await (const person of Person.find()) {
                            for (const entry in person.log) {
                                const location_name = getLocationName(person.log[entry].location, locations);
                                const time_in = new Date(person.log[entry].time_in);
                                const time_out = person.log[entry].time_out ? new Date(person.log[entry].time_out) : null;
                                if (time_in >= start_time && (time_out <= end_time || time_out == null)) {
                                    export_object.push([person.uid, location_name, strftime("%I:%M %p %B %d, %Y", new Date(person.log[entry].time_in)), person.log[entry].time_out ? strftime("%I:%M %p %B %d, %Y", new Date(person.log[entry].time_out)) : "Not checked out"])
                                }
                            }
                        }
                    } else {
                        for await (const person of Person.find()) {
                            for (const entry in person.log) {
                                const location_name = getLocationName(person.log[entry].location, locations);
                                // console.log(location_name)
                                export_object.push([person.uid, location_name, strftime("%I:%M %p %B %d, %Y", new Date(person.log[entry].time_in)), person.log[entry].time_out ? strftime("%I:%M %p %B %d, %Y", new Date(person.log[entry].time_out)) : "Not checked out"])
                            }
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
    } else {
        res.status(400).json({success: false})
    }
}
