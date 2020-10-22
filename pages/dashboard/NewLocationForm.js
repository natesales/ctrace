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

export default function NewLocationForm(props) {
    const classes = useStyles();

    const [name, setName] = useState("");
    const [maxOccupancy, setMaxOccupancy] = useState("");

    const handleNewLocation = (event) => {
        event.preventDefault();
        console.log(name, maxOccupancy)
        fetch("/api/admin/location", {
            method: "POST",
            // TODO: Authenticate this
            // credentials: "include",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                isDelete: false,
                "name": name,
                "max_occupancy": Number(maxOccupancy)
            }),
        }).then(response => response.json()).then(() => {
            setName("");
            setMaxOccupancy("");
            props.updateLocations();
        }) // TODO: Open snackbar

        .catch(error => {
            console.log(error)
        })
    }

    return (
        <React.Fragment>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>Add a location</Typography>

            <form className={classes.root} noValidate autoComplete="off" onSubmit={handleNewLocation}>

                <TextField id="name-entry" label="Name" value={name} InputLabelProps={{shrink: true}} onChange={(event) => setName(event.target.value)}/>
                <TextField id="max-occupancy-entry" label="Max occupancy" type="number" value={maxOccupancy} InputLabelProps={{shrink: true}} onChange={(event) => setMaxOccupancy(event.target.value)}/>
                {/*TODO: Make this a flexbox or something nice for formatting*/}
                <br/>
                <br/>
                <Button type="submit" variant="contained" color="primary" className={classes.button} startIcon={<AddIcon/>}>Add</Button>
            </form>
        </React.Fragment>
    )
}
