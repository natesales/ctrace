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
        margin: '12px 0 8px 0'
    },
    timeEditFlex: {
        display: "flex",
        flexDirection: 'column',
        width: '100%',
    },
    containerRoot: {
        display: "flex",
        flexDirection: "column"
    },
    dialogTitle: {
        paddingBottom: '5px',
    },
    topForm: {
        marginTop: '0px !important',
    }
}))

export default function ExportDialog(props) {
    const classes = useStyles();

    const [ startTime, setStartTime ] = useState(new Date());
    const [ endTime, setEndTime ] = useState(new Date());
    const [ uid, setUID ] = useState(null);
    const [ uid15, setUID15 ] = useState('');

    const handleUserIDExport = async (is15) => {
        if (is15) {
            // console.log(uid15);
            window.location = "/api/admin/export?uid15=" + uid15 + "&is15=true"
        } else {
            // console.log(uid);
            window.location = "/api/admin/export?uid=" + uid + "&is15=false"
        }
    }

    const handleTimeExport = () => {
        window.location = "/api/admin/export?start_time=" + startTime.getTime() + "&end_time=" + endTime.getTime();
    }

    return (
        <Dialog open={props.open} onClose={props.handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title" className={classes.dialogTitle}>Export Options</DialogTitle>
            <DialogContent>
                <DialogContentText className={classes.formTitle, classes.topForm}>
                    Sort by User:  (leave empty for all records)
                </DialogContentText>
                <div className={classes.formLine}>
                    <TextField
                        margin="dense"
                        variant="outlined"
                        id="uid"
                        label="User ID"
                        type="text"
                        className={classes.formText}
                        value={uid}
                        onChange={(event) => {
                            if (event.target.value !== '') {
                                setUID(event.target.value)
                            } else {
                                setUID(null)
                            }
                        }}
                    />
                    <Button onClick={() => {handleUserIDExport(false)}} variant="contained" color="primary">Export</Button>
                </div>
                {/* <DialogContentText className={classes.formTitle}>
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
                        value={uid15}
                        onChange={(event) => {setUID15(event.target.value)}}
                    />
                    <Button onClick={() => {handleUserIDExport(true)}} variant="contained" color="primary">Export</Button>
                </div> */}
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
                        <Button onClick={handleTimeExport} variant="contained" color="primary">Export</Button>
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