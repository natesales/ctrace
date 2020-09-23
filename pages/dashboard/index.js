import React, {useEffect, useState} from "react";
import {makeStyles, ThemeProvider} from "@material-ui/core/styles";
import {AppBar, Box, Container, Grid, Paper, Toolbar, Typography} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import theme from "@components/MainTheme";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import LocationTable from "./LocationTable";
import GetAppIcon from "@material-ui/icons/GetApp";
import NewLocationForm from "./NewLocationForm";

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        background: "#c3c3c3",
    },
    toolbarIcon: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: "0 8px",
        ...theme.mixins.toolbar,
    },
    menuButton: {
        marginRight: 36,
    },
    menuButtonHidden: {
        display: "none",
    },
    title: {
        flexGrow: 1,
    },
    appBarSpacer: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        height: "100vh",
        overflow: "auto",
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
    },
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


function UnThemedDashboard() {
    const classes = useStyles();

    const [locations, setLocations] = useState(null);

    useEffect(() => {
        getLocations();
    }, [])

    const getLocations = () => {
        fetch("/api/admin/locations", {
            method: "GET",
            // TODO: Authenticate this
            // credentials: "include",
            headers: {"Content-Type": "application/json"},
        }).then(response => response.json())
            .then(response => {
                console.log(response)
                setLocations(response.data.locations)
            })
            .catch(error => {
                console.log(error)
            })
    }

    return (
        <div className={classes.root}>
            <AppBar position="absolute" className={classes.appBar}>
                <Toolbar className={classes.toolbar}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="export spreadsheet"
                        onClick={() => {
                            window.location = "/api/admin/export"
                        }}
                        className={classes.menuButton}
                    >
                        <GetAppIcon/>
                    </IconButton>

                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="show qr codes"
                        onClick={() => {
                            window.location = "/dashboard/qrcodes"
                        }}
                        className={classes.menuButton}
                    >
                        <PhotoCameraIcon/>
                    </IconButton>
                    <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                        cTrace Dashboard
                    </Typography>
                </Toolbar>
            </AppBar>
            <main className={classes.content}>
                <div className={classes.appBarSpacer}/>
                <Container maxWidth="lg" className={classes.container}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Paper className={classes.paper} elevation={3}>
                                <NewLocationForm/>
                            </Paper>
                        </Grid>

                        <Grid item xs={12}>
                            <Paper className={classes.paper} elevation={3}>
                                <LocationTable locations={locations}/>
                            </Paper>
                        </Grid>
                    </Grid>

                    <Box pt={4}>
                        <Typography variant="body2" color="textSecondary" align="center">
                            {"cTrace Dashboard"}
                            {/*<Link color="inherit" href="https://material-ui.com/">*/}
                            {/*    Your Website*/}
                            {/*</Link>{" "}*/}
                            {/*{new Date().getFullYear()}*/}
                            {/*{"."}*/}
                        </Typography>
                    </Box>
                </Container>
            </main>
        </div>
    );
}

export default function Dashboard() {
    return (
        <ThemeProvider theme={theme}>
            <UnThemedDashboard/>
        </ThemeProvider>
    )
}