import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {Box, Button, IconButton, Paper, Typography} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import HistoryIcon from '@material-ui/icons/History';

const useStyles = makeStyles((theme) => ({
    placePaper: {
        height: '58px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '7px',
        marginRight: '5px',
        background: theme.palette.secondary.light,
    },
    locationName: {
        fontSize: '17px',
        margin: '10px 0px 5px, 10px',
        color: theme.palette.secondary.contrastText,
        opacity: ".87",
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        // maxWidth: "70px"
    },
    locationNameCurrent: {
        fontSize: '17px',
        margin: '10px 0px 5px, 10px',
        color: theme.palette.secondary.contrastText,
        opacity: ".87",
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        [theme.breakpoints.down('xs')]: {
            maxWidth: "104px"
        }
    },
    locationPopulation: {
        fontSize: '12px',
        color: theme.palette.secondary.contrastText,
        opacity: '.87',
    },
    cardType: {
        margin: '8px',
    },
    actionButton: {
        margin: '8px',
        color: theme.palette.secondary.contrastText,
    },
    trashButton: {
        marginRight: "5px",
    },
    timeButton: {
        marginRight: "5px",
    }
}));

export default function LocationCard(props) {
    const classes = useStyles();

    return (
        <Paper className={classes.placePaper} style={{display: props.isDisplayed ? '' : 'none'}} id={props.id}>
            <Box className={classes.cardType}>
                {props.isCurrent ? 
                <Typography variant="h4" className={classes.locationNameCurrent}>
                {props.place.name}
                </Typography> :
                <Typography variant="h4" className={classes.locationName}>
                    {props.place.name}
                </Typography>}
                <Typography variant="h6" className={classes.locationPopulation}>
                    {
                        (props.place.current_occupancy === 1)
                            ? <div>Currently: {props.place.current_occupancy} person</div>
                            : <div>Currently: {props.place.current_occupancy} people</div>
                    }
                </Typography>
            </Box>
            
            <div>
                {props.showTimeButton && !props.canDelete ?
                <IconButton className={classes.timeButton} onClick={props.handleTimeDialog} id={props.place._id}>
                    <HistoryIcon />
                </IconButton>
                :
                null}

                {props.showButton && !props.canDelete ?
                    props.isEntered ?
                        <Button variant="outlined" className={classes.actionButton} onClick={props.handleLocationLeave} id={props.place._id}>
                            Leave
                        </Button>
                        :
                        <Button variant="outlined" className={classes.actionButton} onClick={props.handleLocationEnter} id={props.place._id}>
                            Enter
                        </Button>
                    :
                    null
                }
            </div>
            

            {props.canDelete ?
                <IconButton className={classes.trashButton} onClick={props.handleDelete} id={props.place._id}>
                    <DeleteIcon/>
                </IconButton> : null}
        </Paper>
    )
}