import React, { useState } from "react";
import { makeStyles, Typography, Box } from "@material-ui/core"
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import CustomTimePicker from '@components/CustomTimePicker'
import {MuiPickersUtilsProvider, KeyboardDateTimePicker} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

// Just in case
const useStyles = makeStyles(theme => ({
    formLine: {
        display: 'flex',
        alignItems: 'center',
    },
    formText: {
        margin: '0 5px 0 0',
    },
    formTitle: {
        margin: '10px 0 2px 0'
    },
    timeEditFlex: {
        display: "flex",
        flexDirection: 'column',
        margin: 'auto',
    },
    containerRoot: {
        display: "flex",
        flexDirection: "column"
    }
}))

export default function ExportDialog(props) {
    const classes = useStyles();

    const [ startTime, setStartTime ] = useState(new Date());
    const [ endTime, setEndTime ] = useState(new Date());

    const handleUserChoice = () => {

    }

    return (
        <Dialog open={props.open} onClose={props.handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Export Options</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Choose how you want to export cTrace data.
                </DialogContentText>
                <DialogContentText className={classes.formTitle}>
                    Sort by User:
                </DialogContentText>
                <div className={classes.formLine}>
                    <TextField
                        margin="dense"
                        variant="outlined"
                        id="uid"
                        label="User ID"
                        type="text"
                        className={classes.formText}
                    />
                    <Button onClick={handleUserChoice} variant="contained" color="primary">Export</Button>
                </div>
                <DialogContentText className={classes.formTitle}>
                    Sort by all {'>'}15 min with User:
                </DialogContentText>
                <div className={classes.formLine}>
                    <TextField
                        margin="dense"
                        variant="outlined"
                        id="uid-15"
                        label="User ID"
                        type="text"
                        className={classes.formText}
                    />
                    <Button onClick={handleUserChoice} variant="contained" color="primary">Export</Button>
                </div>
                <DialogContentText className={classes.formTitle}>
                    Sort by time frame:
                </DialogContentText>
                <div className={classes.formLine}>
                    <Box className={classes.timeEditFlex}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <Box className={classes.containerRoot}>
                                <KeyboardDateTimePicker
                                    variant="dialog"
                                    margin="normal"
                                    id="time-picker"
                                    label={'Start Time'}
                                    onOpen={() => {window.scrollTo(0, 1)}}
                                    strictCompareDates={true}
                                    DialogProps={{fullScreen: props.fullScreen}}
                                    onChange={time => setStartTime(time)}
                                    value={startTime}
                                    format="yyyy/MM/dd hh:mm a"
                                    KeyboardButtonProps={{
                                        'aria-label': 'change time',
                                    }}
                                />
                                <KeyboardDateTimePicker
                                    variant="dialog"
                                    margin="normal"
                                    id="time-picker-2"
                                    label={'End Time'}
                                    onOpen={() => {window.scrollTo(0, 1)}}
                                    strictCompareDates={true}
                                    DialogProps={{fullScreen: props.fullScreen}}
                                    onChange={time => setEndTime(time)}
                                    value={endTime}
                                    format="yyyy/MM/dd hh:mm a"
                                    KeyboardButtonProps={{
                                        'aria-label': 'change time',
                                    }}
                                />
                            </Box>
                        </MuiPickersUtilsProvider>
                        <Button onClick={handleUserChoice} variant="contained" color="primary">Export</Button>
                    </Box>
                </div>
            </DialogContent>
            <DialogActions style={{marginTop: '20px'}}>
                <Button onClick={props.handleClose} color="primary" variant="outlined">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    )
}