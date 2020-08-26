import React, {useEffect, useState} from "react";
import clsx from "clsx";
import {makeStyles, ThemeProvider} from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import {AppBar, Box, Container, Divider, Drawer, Grid, Paper, Snackbar, Toolbar, Typography} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import NumberCard from "./NumberCard";
import theme from "@components/MainTheme";
import SideNav from "./SideNav";
import CloseIcon from "@material-ui/icons/Close"
import LocationTable from "./LocationTable";
import CircularProgress from "@material-ui/core/CircularProgress";
import NewLocationForm from "./NewLocationForm";

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {"cTrace Dashboard"}
            {/*<Link color="inherit" href="https://material-ui.com/">*/}
            {/*    Your Website*/}
            {/*</Link>{" "}*/}
            {/*{new Date().getFullYear()}*/}
            {/*{"."}*/}
        </Typography>
    );
}

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        background: "#c3c3c3", // TODO: Why doesnt this work?
    },
    toolbar: {
        paddingRight: 24, // keep right padding when drawer closed
    },
    toolbarIcon: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: "0 8px",
        ...theme.mixins.toolbar,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
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
    drawerPaper: {
        position: "relative",
        whiteSpace: "nowrap",
        width: drawerWidth,
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerPaperClose: {
        overflowX: "hidden",
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up("sm")]: {
            width: theme.spacing(9),
        },
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

    const [open, setOpen] = useState(false);
    const [exportDialogOpen, setExportDialogOpen] = useState(false);
    const [locations, setLocations] = useState(null);

    useEffect(() => {
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
    }, [])

    const handleDrawerOpen = () => {
        setOpen(true);
    };
    const handleDrawerClose = () => {
        setOpen(false);
    };

    return (
        <div className={classes.root}>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={exportDialogOpen}
                onClose={() => setExportDialogOpen(false)}
                autoHideDuration={3000}
                message="Location spreadsheet has been exported"
                action={
                    <React.Fragment>
                        <IconButton size="small" aria-label="close" color="inherit" onClick={() => setExportDialogOpen(false)}>
                            <CloseIcon/>
                        </IconButton>
                    </React.Fragment>
                }
            />

                <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)}>
                    <Toolbar className={classes.toolbar}>
                        <IconButton
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
                            cTrace Dashboard
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Drawer
                    variant="permanent"
                    classes={{
                        paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
                    }}
                    open={open}
                >
                    <div className={classes.toolbarIcon}>
                        <IconButton onClick={handleDrawerClose}>
                            <ChevronLeftIcon/>
                        </IconButton>
                    </div>
                    <Divider/>
                    <SideNav exportOnClickHandler={() => setExportDialogOpen(true)}/>
                    <Divider/>
                </Drawer>
                <main className={classes.content}>
                    <div className={classes.appBarSpacer}/>
                    <Container maxWidth="lg" className={classes.container}>
                        <Grid container spacing={3}>
                            {(locations === null) ? <CircularProgress/> : <NumberCard title="Locations" subtitle="places" value={locations.length}/>}
                            <Grid item xs={12}>
                                <Paper className={classes.paper} elevation={3}>
                                    <LocationTable locations={locations}/>
                                </Paper>
                            </Grid>
                        </Grid>

                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Paper className={classes.paper} elevation={3}>
                                    <NewLocationForm/>
                                </Paper>
                            </Grid>
                        </Grid>

                        <Box pt={4}>
                            <Copyright/>
                        </Box>
                    </Container>
                </main>
        </div>
    );
}

export default function Dashboard() {
    return (
        <ThemeProvider theme={theme}>
            <UnThemedDashboard />
        </ThemeProvider>
    )
}