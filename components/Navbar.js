import {AppBar, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import CropFreeIcon from "@material-ui/icons/CropFree";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import Box from "@material-ui/core/Box";
import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {createMuiTheme, ThemeProvider} from '@material-ui/core/styles';

const theme = createMuiTheme({
    palette: {
        primary: {
            light: "#636363",
            main: "#575757",
            dark: "#202020",
            contrastText: "#fff",
        },
        secondary: {
            light: "#fff",
            main: "#969696",
            dark: "#6E6E6E",
            contrastText: "#000"
        }
    }
});

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

                <input id="qrCodeInput" type="file" onChange={props.handleQRCode} style={{display: "none"}}/>

                <IconButton edge="end" className={classes.profileButton} color="inherit" aria-label="menu" htmlFor="qrCodeInput" component="label">
                    <CropFreeIcon/>
                </IconButton>

                <IconButton edge="end" className={classes.profileButton} color="inherit" aria-label="menu">
                    <AccountCircleIcon/>
                </IconButton>
            </Toolbar>
        </AppBar>
    )
}

export default function Navbar(props) {
    return (
        <ThemeProvider theme={theme}>
            <Nav handleQRCode={props.handleQRCode}/>
        </ThemeProvider>
    )
}