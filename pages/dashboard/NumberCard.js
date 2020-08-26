import React from 'react';
import Typography from '@material-ui/core/Typography';
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import clsx from "clsx";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(2),
        display: "flex",
        overflow: "auto",
        flexDirection: "column",
    },
    fixedHeight: {
        height: 140,
    },
}));

export default function NumberCard(props) {
    const classes = useStyles();
    const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

    return (
        <Grid item xs="auto">
            <Paper className={fixedHeightPaper}>
                <Typography component="h2" variant="h6" color="primary" gutterBottom>{props.title}</Typography>
                <Typography component="p" variant="h4">{props.value}</Typography>
                <Typography color="textSecondary">{props.subtitle}</Typography>
            </Paper>
        </Grid>
    );
}
