import React, {useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import { Snackbar, Paper, Typography, Box } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    alertContainer: {
        marginTop: '56px',
    },
    alertTitle: {
        fontSize: '19px',
    },
    alertTime: {
        color: '#DEDEDE',
        fontSize: '15px',
    },
    alertInfo: {
        color: '#686868',
        fontSize: '11px',
    }
}));


export default function LocationAlert(props) {
    const classes = useStyles();

    return (
        <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
            open={true}
            key="top left"
            className={classes.alertContainer}
            message={
                <Box>
                    <Typography variant="h6" className={classes.alertTitle}>
                        You need to choose a location!
                    </Typography>
                    <Typography variant="h6" className={classes.alertTime}>
                        Current Free Period: 10:30 - 11:15
                    </Typography>
                    <Typography variant="h6" className={classes.alertInfo}>
                        Select a location to make this notification disappear.
                    </Typography>
                </Box>

            }

        />
    )
}