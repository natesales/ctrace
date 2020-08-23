import {AppBar, IconButton, Paper, Toolbar, Typography, Avatar} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import CropFreeIcon from "@material-ui/icons/CropFree";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import Box from "@material-ui/core/Box";
import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {createMuiTheme, ThemeProvider} from '@material-ui/core/styles';
import theme from '@components/MainTheme'

const useStyles = makeStyles((theme) => ({
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        margin: 'auto',
    },
    appBar: {
        background: theme.palette.secondary.light,
        color: theme.palette.secondary.contrastText,
    },
    profilePhoto: {
        height: '30px',
        width: '30px',
    }
}));

function Nav(props) {
    const classes = useStyles();

    return (
        <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
                <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                    <MenuIcon/>
                </IconButton>
                <Typography variant="h6" className={classes.title}>
                    cTrace
                </Typography>

                <Avatar alt={props.user.google_info.nickname} src={props.user.google_info.picture} className={classes.profilePhoto} />
            </Toolbar>
        </AppBar>
    )
}

export default function Navbar(props) {
    return (
        <ThemeProvider theme={theme}>
            <Nav user={props.user} />
        </ThemeProvider>
    )
}