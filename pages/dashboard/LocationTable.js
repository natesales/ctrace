import React from "react";
import Link from "@material-ui/core/Link";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";

export default function LocationTable(props) {
    return (
        <React.Fragment>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>Locations</Typography>

            {/*TODO: Open an add modal onclick*/}
            <Link color="primary" href="#" onClick={() => console.log("TODO")}>
                <Typography>Add a new location</Typography>
            </Link>

            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Max occupancy</TableCell>
                        <TableCell>Current occupancy</TableCell>
                    </TableRow>
                </TableHead>
                {
                    (props.locations === null) ? <CircularProgress/> :
                        <TableBody>
                            {props.locations.map((location) => (
                                <TableRow key={location.name}>
                                    <TableCell>{location.name}</TableCell>
                                    <TableCell>{location.max_occupancy}</TableCell>
                                    <TableCell>{location.current_occupancy}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                }
            </Table>
        </React.Fragment>
    );
}
