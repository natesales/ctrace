import "date-fns";
import React, {useEffect, useRef, useState} from "react";
import {MuiPickersUtilsProvider, KeyboardDateTimePicker} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { Box } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles((theme) => ({
    errorMessage: {
        color: "red",
    },
    containerRoot: {
        display: "flex",
        flexDirection: "column"
    }
}))

export default function CustomTimePicker(props) {
    const classes = useStyles();

    return (
        <Box className={classes.containerRoot}>
            <KeyboardDateTimePicker
                variant="dialog"
                margin="normal"
                id={"time-picker"}
                label={props.label}
                onOpen={() => {window.scrollTo(0, 1)}}
                minDate={new Date(new Date().setDate(new Date().getDate() - 2))}
                maxDate={props.userState !== null && props.label === "Change enter time" ? new Date(props.userState.time_in) : new Date(new Date().getTime() + 40)}
                strictCompareDates={true}
                DialogProps={{fullScreen: props.fullScreen}}
                value={props.value}
                onChange={props.onChange}
                error={props.error}
                // onError={(error) => props.handleFormatError(error)}
                format={props.format}
                KeyboardButtonProps={{
                    'aria-label': 'change time',
                }}
            />

            {props.error ? <span className={classes.errorMessage}>{props.errorMessage}</span>
            : null}

        </Box>
        
    )
}