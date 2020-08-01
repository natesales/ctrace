import React, {useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import { Typography, IconButton, Paper, Grid, Container, Button, Box } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    placePaper: {
        height: '58px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '7px',
        marginRight: '5px',
    },
    locationName: {
        fontSize: '17px',
        margin: '10px 0px 5px, 10px',
        color: 'rgb(0, 0, 0, .87)',
    },
    locationPopulation: {
        fontSize: '12px',
        color: theme.palette.secondary.dark,
        opacity: '.87',
    },
    cardType: {
        margin: '8px',
    },
    actionButton: {
        margin: '8px',
    }
}));

export default function LocationCard(props) {
    const classes = useStyles();

    const [ isEntered, setIsEntered ] = useState(false);

    return (
        <Paper className={classes.placePaper}>
            <Box className={classes.cardType}>
                <Typography variant="h4" className={classes.locationName}>
                    {props.place.name}
                </Typography>
                <Typography variant="h6" className={classes.locationPopulation}>
                    Currently: {props.place.count} people
                </Typography>
            </Box>
            <Button variant="outlined" className={classes.actionButton}>
                Enter
            </Button>
        </Paper>
    )
}