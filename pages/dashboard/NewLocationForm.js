import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import React, {useState} from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";

const useStyles = makeStyles((theme) => ({
    root: {
        "& .MuiTextField-root": {
            margin: theme.spacing(1),
            width: "25ch",
        },
    },
}));

export default function NewLocationForm() {
    const classes = useStyles();

    const [name, setName] = useState(null);
    const [maxOccupancy, setMaxOccupancy] = useState(undefined);

    return (
        <React.Fragment>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>Add a location</Typography>

            <form className={classes.root} noValidate autoComplete="off" onSubmit={() => {
                fetch("/api/admin/location", {
                    method: "POST",
                    // TODO: Authenticate this
                    // credentials: "include",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        "name": name,
                        "max_occupancy": maxOccupancy
                    }),
                }).then(response => response.json()).then(() => {
                    document.getElementById("name-entry").value = "";
                    document.getElementById("max-occupancy-entry").value = "";
                }); // TODO: Open snackbar
            }}>

                <TextField id="name-entry" label="Name" InputLabelProps={{shrink: true}} onChange={() => setName(document.getElementById("name-entry").value)}/>
                <TextField id="max-occupancy-entry" label="Max occupancy" type="number" InputLabelProps={{shrink: true}} onChange={() => setMaxOccupancy(document.getElementById("max-occupancy-entry").value)}/>
                {/*TODO: Make this a flexbox or something nice for formatting*/}
                <br/>
                <br/>
                <Button type="submit" variant="contained" color="primary" className={classes.button} startIcon={<AddIcon/>}>Add</Button>
            </form>
        </React.Fragment>
    )
}
