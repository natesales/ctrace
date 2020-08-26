import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import { makeStyles } from "@material-ui/core";

// Just in case
const useStyles = makeStyles(theme => ({}))

export default function LocationTable(props) {
    const classes = useStyles();

    return (
        <React.Fragment>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>Locations</Typography>
            
            <Table size="small" >
                <TableHead>
                    <TableRow>
                        <TableCell  >Name</TableCell>
                        <TableCell  >Max occupancy</TableCell>
                        <TableCell  >Current occupancy</TableCell>
                    </TableRow>
                </TableHead>
                {
                    (props.locations === undefined || props.locations === null) ? null :
                        <TableBody>
                            {props.locations.map((location) => (
                                <TableRow key={location.name}>
                                    <TableCell  >{location.name}</TableCell>
                                    <TableCell  >{location.max_occupancy}</TableCell>
                                    <TableCell  >{location.current_occupancy}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                }
            </Table>

            {(props.locations === undefined || props.locations === null) ? <div style={{display: 'flex', justifyContent: 'center', paddingTop: '10px'}}> <CircularProgress /> </div> : null}
        </React.Fragment>
    );
}
