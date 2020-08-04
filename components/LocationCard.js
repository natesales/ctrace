import React from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {Box, Button, Paper, Typography} from '@material-ui/core';

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

    return (
        <Paper className={classes.placePaper} style={{display: props.isDisplayed ? '' : 'none'}}>
            <Box className={classes.cardType}>
                <Typography variant="h4" className={classes.locationName}>
                    {props.place.name}
                </Typography>
                <Typography variant="h6" className={classes.locationPopulation}>
                    Currently: {props.place.current_occupancy} people
                </Typography>
            </Box>

            {props.showButton ?
                props.isEntered ?
                    <Button variant="outlined" className={classes.actionButton}>
                        Leave
                    </Button>
                    :
                    <Button variant="outlined" className={classes.actionButton}>
                        Enter
                    </Button>
                :
                null
            }
        </Paper>
    )
}