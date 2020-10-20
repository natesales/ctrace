import React from "react";
import Table from "@material-ui/core/Table";
import Button from "@material-ui/core/Button";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import {makeStyles} from "@material-ui/core";

// Just in case
const useStyles = makeStyles(theme => ({}))

export default function LocationTable(props) {
    const classes = useStyles();

    const deleteLocation = (event) => {
        event.preventDefault();
        console.log(event.target.parentElement.id);
        fetch("/api/admin/location", {
            method: "POST",
            // TODO: Authenticate this
            // credentials: "include",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                isDelete: true,
                name: event.target.parentElement.id,
            }),
        }).then(response => response.json()).then(() => {
            props.updateLocations();
        })
    }

    return (
        <React.Fragment>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>Locations</Typography>

            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Max occupancy</TableCell>
                        <TableCell>Current occupancy</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                {
                    (props.locations === undefined || props.locations === null) ? null :
                        <TableBody>
                            {props.locations.map((location) => (
                                <TableRow key={location.name}>
                                    <TableCell>{location.name}</TableCell>
                                    <TableCell>{location.max_occupancy}</TableCell>
                                    <TableCell>{location.current_occupancy}</TableCell>
                                    <TableCell><Button variant="outlined" onClick={deleteLocation} id={location.name}>Delete</Button></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                }
            </Table>

            {(props.locations === undefined || props.locations === null) ? <div style={{display: 'flex', justifyContent: 'center', paddingTop: '10px'}}><CircularProgress/></div> : null}
        </React.Fragment>
    );
}
