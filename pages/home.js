import "date-fns";
import React, {useEffect, useRef, useState} from "react";
import {Box, IconButton, InputBase, Paper, Snackbar, Typography, useMediaQuery} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import {makeStyles, ThemeProvider} from "@material-ui/core/styles";
import Navbar from "@components/Navbar";
import LocationCard from "@components/LocationCard";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import SearchIcon from "@material-ui/icons/Search";
import {ReactSortable} from "react-sortablejs";
import theme from "@components/MainTheme";
import LocationAlert from "@components/LocationAlert";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import {Dialog, DialogActions, DialogContent, DialogTitle, Button} from "@material-ui/core";
import {MuiPickersUtilsProvider, KeyboardDateTimePicker} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import CustomTimePicker from "@components/CustomTimePicker"

// Styles for use on the page.
const useStyles = makeStyles((theme) => ({
    root: {
        height: "100vh",
        background: theme.palette.primary.main,
    },
    mainGrid: {
        height: "100vh",
        display: "flex",
        justifyContent: "center",
    },
    mainContainer: {
        width: "clamp(0px, 95%, 840px)",
        background: theme.palette.primary.light,
        color: "#fff",
        position: "relative",
        top: "80px",
        borderRadius: "10px",
        [theme.breakpoints.down(864)]: {
            maxHeight: "none !important",
        },
        [theme.breakpoints.down("xs")]: {
            top: "65px",
        },
    },
    cardFlex: {
        flex: "1 1 410px",
        maxHeight: "500px !important",
        borderRadius: "10px",
        background: theme.palette.primary.light,
        [theme.breakpoints.down(864)]: {
            maxHeight: "none !important",
            width: "100%",
        },
    },
    cardContainer: {
        maxHeight: "495px",
        [theme.breakpoints.down(864)]: {
            maxHeight: "none !important",
            marginBottom: "0px",
        },
        overflow: "scroll",
        "&::-webkit-scrollbar": {
            width: "5px",
        },
        "&::-webkit-scrollbar-track": {
            background: theme.palette.primary.light,
        },
        "&::-webkit-scrollbar-thumb": {
            backgroundColor: theme.palette.secondary.light,
            borderRadius: "20px",
        },
        scrollbarWidth: "thin",
        overflowX: "hidden",
        scrollbarColor: theme.palette.secondary.light + theme.palette.primary.light,
    },
    columnTitleBox: {
        display: "flex",
        justifyContent: "space-between",
        margin: "10px",
        alignItems: "center"
    },
    columnTitleText: {
        fontSize: "14px",
    },
    addPinnedButton: {
        padding: "2px",
        color: theme.palette.primary.contrastText,
    },
    searchContainer: {
        height: "58px",
        display: "flex",
        alignItems: "center",
        margin: "10px",
    },
    search: {
        position: "relative",
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.palette.secondary.main,
        opacity: 0.6,
        "&:hover": {
            opacity: '1'
        },
        width: "100%",
        height: "80%",
    },
    searchIcon: {
        padding: theme.spacing(0, 1),
        height: "100%",
        position: "absolute",
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    inputRoot: {
        color: "inherit",
        width: "100%",
    },
    inputInput: {
        padding: theme.spacing(1.7, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(3)}px)`,
        transition: theme.transitions.create("width"),
        width: "100%",
    },
    placeList: {
        listStyleType: "none",
        padding: 0,
        margin: 0
    },
    columns: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
    },
    currentLocationFlex: {
        display: "flex",
        justifyContent: "space-between",
        margin: "10px",
        alignItems: "center"
    },
    currentLocationCardContainer: {
        width: "100%",
        flex: "1 1 410px",
    },
    currentLocationTitleBox: {
        width: "100%",
        paddingBottom: "4.5px",
    },
    currentLocationTitleText: {
        fontSize: "16px",
    },
    LocationAlertContainer: {},
    timeEditFlex: {
        display: "flex",
        flexDirection: "column",
    },
}));

// Alert component for returning a success/error message at the bottom of the screen.
function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

// Main home page component.
function HomePage(props) {
    // Imports styles. Access using classes.style-name.
    const classes = useStyles();

    // Big bad stateful stuff. Reasonably well labeled.
    const [userState, setUserState] = useState(props.user);
    const [shownPlaces, setShownPlaces] = useState(null);
    const [pinnedPlaces, setPinnedPlaces] = useState(null);
    const [showResponseSnackbar, setShowResponseSnackbar] = useState(false);
    const [responseSnackbarBody, setResponseSnackbarBody] = useState("");
    const [responseSnackbarType, setResponseSnackbarType] = useState("");
    const [searchState, setSearchState] = useState("");
    const [editPinnedLocations, setEditPinnedLocations] = useState(false);
    const [pinnedPlacesLength, setPinnedPlacesLength] = useState(0);
    const [showTimeDialog, setShowTimeDialog] = useState(false);
    const fullScreen = useMediaQuery(theme.breakpoints.down('321'));
    const [timeDialogEnterTime, setTimeDialogEnterTime] = useState(new Date())
    const [timeDialogExitTime, setTimeDialogExitTime] = useState(props.initTime)
    const [timeDialogEnterError, setTimeDialogEnterError] = useState(false)
    const [timeDialogExitError, setTimeDialogExitError] = useState(false)

    const mounted = useRef(); // Used to update userState after re-fetching /me. Not perfect but react seems to only work well this way.
    useEffect(() => {
        if (!mounted.current) {
            // Just after the component as mounted.
            mounted.current = true;
        } else {
            // Just after the component has updated.
            if (userState !== props.user) {
                setUserState(props.user)
            }
        }
    });

    const handleTimeDialog = (event, reason) => {
        if (reason == "backdropClick") {
            setShowTimeDialog(false)
            setTimeDialogEnterTime(userState.time_in)
            setTimeDialogExitTime(props.initTime)
            setTimeDialogEnterError(false)
            setTimeDialogExitError(false)
        } else {
            if (showTimeDialog) {
                // console.log(timeDialogExitTime, 'Dialog exit time')
                // console.log(props.initTime, 'initTime from props')
                if (!timeDialogEnterError && !timeDialogExitError) {
                    setShowTimeDialog(false)

                    if (new Date(timeDialogEnterTime).getTime() !== new Date(userState.time_in).getTime() || 
                    new Date(timeDialogExitTime).getMinutes() !== new Date(props.initTime).getMinutes()
                    ) {
                        fetch("/api/change", {
                            method: "POST",
                            credentials: "include",
                            headers: {"Content-Type": "application/json"},
                            body: JSON.stringify({
                                "time_in": new Date(timeDialogEnterTime).getTime() !== new Date(userState.time_in).getTime() ? timeDialogEnterTime : null,
                                "time_out": new Date(timeDialogExitTime).getMinutes() !== new Date(props.initTime).getMinutes() ? timeDialogExitTime : null,
                            }),
                        })
                            .then(response => response.json())
                            .then(data => {
                                handleResponseSnackbarOpen(data.success, data.message);
                            })
                            .then(props.handleUserUpdate)
                            .catch(error => {
                                handleResponseSnackbarOpen(false, error.message);
                                console.log(error);
                            });
                    }
                }
                
            } else {
                setShowTimeDialog(true)
            }
        }
    }

    const handleDialogEnterTimeChange = (date) => {
        // console.log(date, '<-- Enter Time')
        if (date !== timeDialogEnterTime) {
            if (date.getTime() > new Date(userState.time_in).getTime() || date.getTime() > new Date(timeDialogExitTime).getTime()) {
                setTimeDialogEnterError(true)
            } else {
                setTimeDialogEnterError(false)
                setTimeDialogEnterTime(date);
            }
        }
    }

    const handleDialogExitTimeChange = (date) => {
        // console.log(date, '<-- Exit Time')
        if (date !== timeDialogExitTime) {
            if (date.getTime() > new Date(props.initTime).getTime() || date.getTime() < new Date(timeDialogEnterTime).getTime()) {
                setTimeDialogExitError(true)
            } else {
                setTimeDialogExitError(false)
                setTimeDialogExitTime(date);
            }
        }
    }

    const handleTimeDialogFormatError = (name) => {
        if (name === "enter") {
            setTimeDialogEnterError(true)
        } else if (name === "exit") {
            setTimeDialogExitError(true)
        }
    }

    // Handle the response snackbar. Takes a message and a success boolean.
    const handleResponseSnackbarOpen = (success, body) => {
        setResponseSnackbarBody(body);
        setResponseSnackbarType(() => {
            if (success) {
                return "success";
            } else {
                return "error";
            }
        })
        setShowResponseSnackbar(true);

    }

    // Calls /checkin when needed.
    const handleLocationEnter = (event) => {
        let locationId;
        if (event.target.parentElement.id !== "") {
            locationId = event.target.parentElement.id;
        } else {
            locationId = event.currentTarget.id;
        }

        fetch("/api/checkin", {
            method: "POST",
            credentials: "include",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                "location": locationId,
            }),
        })
            .then(response => response.json())
            .then(data => {
                handleResponseSnackbarOpen(data.success, data.message);
            })
            .then(props.handleUserUpdate)
            .catch(error => {
                handleResponseSnackbarOpen(false, data.message);
                console.log(error);
            });
    }

    // Calls /checkout when needed.
    const handleLocationLeave = (event) => {
        let locationId;
        if (event.target.parentElement.id !== "") {
            locationId = event.target.parentElement.id;
        } else {
            locationId = event.currentTarget.id;
        }

        fetch("/api/checkout", {
            method: "POST",
            credentials: "include",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                "location": locationId,
            }),
        })
            .then(response => response.json())
            .then(data => handleResponseSnackbarOpen(data.success, data.message))
            .then(props.handleUserUpdate)
            .catch(error => {
                    handleResponseSnackbarOpen(false, data.message)
                    console.log(error);
                }
            );
    }

    function checkLocations(state_ref) {
        if (state_ref === "userState") {
            return (
                userState.locations.map(place => {
                    let isEntered = false;
                    let showButton = true;

                    if (userState.current_location != null) {
                        showButton = false;
                        if (place._id === userState.current_location._id) {
                            isEntered = true;
                            showButton = true;
                        }
                    }

                    return {
                        key: place._id,
                        place: place,
                        isEntered: isEntered,
                        showButton: showButton,
                        isDisplayed: true,
                        handleLocationEnter: handleLocationEnter,
                        handleLocationLeave: handleLocationLeave,
                    };
                })
            )
        } else if (state_ref === "pinnedPlaces") {
            return (
                userState.pinned_locations.map(place => {
                    let isEntered = false;
                    let showButton = true;

                    if (userState.current_location != null) {
                        showButton = false;
                        if (place._id === userState.current_location._id) {
                            isEntered = true;
                            showButton = true;
                        }
                    }

                    return {
                        key: place._id,
                        place: place,
                        isEntered: isEntered,
                        showButton: showButton,
                        isDisplayed: true,
                        handleLocationEnter: handleLocationEnter,
                        handleLocationLeave: handleLocationLeave,
                    };
                })
            )
        }


    }

    // Sets the shown places and the pinned places assuming the /me route has been returned and the user is not null.
    useEffect(() => {
        // console.log(userState);

        setTimeDialogEnterTime(new Date(userState.time_in))
        setTimeDialogExitTime(new Date(props.initTime))

        setShownPlaces(
            checkLocations("userState")
        );

        setPinnedPlaces(
            userState.pinned_locations !== null ? checkLocations("pinnedPlaces") : []
        )
    }, [userState]);

    // Handles searching. Replaces each list, and breaks the page if you edit the pinned locations while searching.
    function handleSearch(event) {
        setSearchState(event.target.value);
        let search_string = event.target.value.toUpperCase();

        for (let i = 0; i < shownPlaces.length; i++) {
            const place_name = shownPlaces[i].place.name;
            if (place_name.toUpperCase().indexOf(search_string) > -1) {
                setShownPlaces(prevState => {
                    let newState = prevState;
                    newState[i] = {
                        key: newState[i].key,
                        place: newState[i].place,
                        isEntered: newState[i].isEntered,
                        showButton: newState[i].showButton,
                        isDisplayed: true,
                        handleLocationEnter: newState[i].handleLocationEnter,
                        handleLocationLeave: newState[i].handleLocationLeave,
                    }
                    return newState;
                })
            } else {
                setShownPlaces(prevState => {
                    let newState = prevState;
                    newState[i] = {
                        key: newState[i].key,
                        place: newState[i].place,
                        isEntered: newState[i].isEntered,
                        showButton: newState[i].showButton,
                        isDisplayed: false,
                        handleLocationEnter: newState[i].handleLocationEnter,
                        handleLocationLeave: newState[i].handleLocationLeave,
                    }
                    return newState;
                })
            }
        }
    }

    useEffect(() => {
        if (pinnedPlaces != null) {
            if (pinnedPlaces.length !== pinnedPlacesLength) {
                setPinnedPlacesLength(pinnedPlaces.length)
                setPinnedPlaces(prevState => {
                    return (prevState.filter((v, i) => prevState.findIndex(t => (t.key === v.key)) === i))
                })
                if (editPinnedLocations) {
                    handlePinnedLocation(false)
                }
            }
        }
    }, [pinnedPlaces]);

    async function handlePinnedLocation(changeEdit) {

        // console.log(pinnedPlaces)

        if (changeEdit) {
            if (editPinnedLocations) {
                setEditPinnedLocations(prevState => {
                    return !prevState;
                });

                if (pinnedPlaces !== null) {
                    const pinned_locations = pinnedPlaces.map(place => {
                        return place.key;
                    });

                    await fetch("/api/pin", {
                        method: "POST",
                        credentials: "include",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify({
                            "pinned_locations": pinned_locations,
                        }),
                    }).then(response => response.json()).then(data => {
                        handleResponseSnackbarOpen(data.success, data.message)
                    }).catch(error => {
                        handleResponseSnackbarOpen(false, data.message);
                        console.log(error);
                    });
                }

            } else {
                setEditPinnedLocations(prevState => {
                    return !prevState;
                });
            }
        } else {

            if (pinnedPlaces !== null) {
                const pinned_locations = pinnedPlaces.map(place => {
                    return place.key;
                });

                await fetch("/api/pin", {
                    method: "POST",
                    credentials: "include",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        "pinned_locations": pinned_locations,
                    }),
                }).then(response => response.json()).then(data => {
                    handleResponseSnackbarOpen(data.success, data.message)
                }).catch(error => {
                    handleResponseSnackbarOpen(false, data.message);
                    console.log(error);
                });
            }
        }


    }

    const handlePinnedLocationDelete = (event) => {
        const id = event.currentTarget.id;

        setPinnedPlaces(prevState => {
            return prevState.filter((location) => {
                return location.key !== id;
            });
        });

        handlePinnedLocation(false);
    }

    const handleResponseSnackbarClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setShowResponseSnackbar(false);
    };

    return (
        <div className={classes.root} style={{position:  showTimeDialog && fullScreen ? "fixed" : "initial"}}>
            {userState.current_location ? 
            <Dialog
                fullScreen={fullScreen}
                open={showTimeDialog}
                onClose={handleTimeDialog}
                aria-labelledby="time-dialog-title"
            >
                <DialogTitle id="time-dialog-title">Enter a new time.</DialogTitle>
                <DialogContent>              
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <Box className={classes.timeEditFlex}>
                            <CustomTimePicker
                                label="Change enter time"
                                fullScreen={fullScreen}
                                userState={userState}
                                value={timeDialogEnterTime}
                                onChange={handleDialogEnterTimeChange}
                                error={timeDialogEnterError}
                                errorMessage={"Future entrance times are not allowed."}
                                // handleFormatError={handleTimeDialogFormatError}
                                format="yyyy/MM/dd hh:mm a"
                            />
                            <CustomTimePicker
                                label="Change exit time"
                                fullScreen={fullScreen}
                                userState={userState}
                                value={timeDialogExitTime}
                                onChange={handleDialogExitTimeChange}
                                error={timeDialogExitError}
                                errorMessage={"Future exit times are not allowed."}
                                // handleFormatError={handleTimeDialogFormatError}
                                format="yyyy/MM/dd hh:mm a"
                            />
                        </Box>
                    </MuiPickersUtilsProvider>
                </DialogContent>
                <DialogActions>
                    <Button autoFocus onClick={() => {
                            setShowTimeDialog(false)
                            setTimeDialogEnterTime(userState.time_in)
                            setTimeDialogExitTime(props.initTime)
                            setTimeDialogEnterError(false)
                            setTimeDialogExitError(false)
                        }}>
                        Cancel
                    </Button>
                    <Button autoFocus id={userState.current_location._id}  onClick={handleTimeDialog} color="primary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog> 
            :
            null}



            <Box className={classes.mainGrid}>
                {userState.current_location ? null :
                    <Box className={classes.LocationAlertContainer}>
                        <LocationAlert/>
                    </Box>
                }
                <Paper className={classes.mainContainer} elevation={3} style={{marginTop: userState.current_location ? "0px" : "115px", maxHeight: userState.current_location ? "671px" : "557px"}}>
                    {userState.current_location ?
                        <Box className={classes.currentLocationFlex}>
                            <Box className={classes.currentLocationTitleBox}>
                                <Typography variant="h6" className={classes.currentLocationTitleText}>
                                    Current Location
                                </Typography>
                                <Box className={classes.currentLocationCardContainer}>
                                    <LocationCard
                                        key={userState.current_location.id}
                                        place={userState.current_location}
                                        isEntered={true}
                                        showButton={true}
                                        showTimeButton={true}
                                        handleTimeDialog={handleTimeDialog}
                                        isDisplayed={true}
                                        canDelete={false}
                                        isCurrent={true}
                                        handleLocationEnter={handleLocationEnter}
                                        handleLocationLeave={handleLocationLeave}
                                    />
                                </Box>
                            </Box>
                        </Box> : null}
                    <Box className={classes.columns}>
                        <Box className={classes.cardFlex}>
                            <Box className={classes.columnTitleBox}>
                                <Typography variant="h6" className={classes.columnTitleText}>
                                    Pinned Locations
                                </Typography>
                                <IconButton aria-label="add a pinned location" className={classes.addPinnedButton} onClick={() => {
                                    handlePinnedLocation(true)
                                }}>
                                    {editPinnedLocations ? <CloseIcon/> : <AddIcon/>}
                                </IconButton>
                            </Box>
                            <Box className={classes.cardContainer} style={{margin: "0px 0px 10px 10px", height: "490px !important"}}>
                                {editPinnedLocations ?
                                    <React.Fragment>
                                        <Typography variant="h6" gutterBottom className={classes.columnTitleText}>
                                            Drag a location from the right to pin it.
                                        </Typography>
                                        <ReactSortable list={pinnedPlaces} setList={setPinnedPlaces} group={{name: "shared"}} style={{minHeight: "100px", width: "100%"}} onAdd={() => {
                                            handlePinnedLocation(false)
                                        }}>
                                            {pinnedPlaces.map(place => {
                                                return (
                                                    <LocationCard
                                                        key={place.key}
                                                        id={place.key}
                                                        place={place.place}
                                                        isEntered={place.isEntered}
                                                        showButton={place.showButton}
                                                        isDisplayed={place.isDisplayed}
                                                        canDelete={true}
                                                        handleDelete={handlePinnedLocationDelete}
                                                        handleLocationEnter={place.handleLocationEnter}
                                                        handleLocationLeave={place.handleLocationLeave}
                                                    />
                                                )
                                            })}
                                        </ReactSortable>
                                    </React.Fragment>
                                    :

                                    pinnedPlaces == null ? null :
                                        pinnedPlaces.map(place => {
                                            return (
                                                <LocationCard
                                                    key={place.key}
                                                    id={place.key}
                                                    place={place.place}
                                                    isEntered={place.isEntered}
                                                    showButton={place.showButton}
                                                    isDisplayed={place.isDisplayed}
                                                    canDelete={false}
                                                    handleLocationEnter={handleLocationEnter}
                                                    handleLocationLeave={place.handleLocationLeave}
                                                />
                                            )
                                        })}
                            </Box>
                        </Box>
                        <Box className={classes.cardFlex}>
                            <Box className={classes.columnTitleBox} style={{height: "28px"}}>
                                <Typography variant="h6" className={classes.columnTitleText}>
                                    Location Search
                                </Typography>
                            </Box>
                            <Box className={classes.searchContainer}>
                                <div className={classes.search}>
                                    <div className={classes.searchIcon}>
                                        <SearchIcon/>
                                    </div>
                                    <InputBase
                                        placeholder="Search…"
                                        classes={{
                                            root: classes.inputRoot,
                                            input: classes.inputInput,
                                        }}
                                        inputProps={{"aria-label": "search"}}
                                        onChange={handleSearch}
                                        value={searchState}
                                    />
                                    {/* TODO: Add a close icon to the search
                                    <div className={classes.closeSearchIcon}>
                                        <CloseIcon />
                                    </div> */}
                                </div>
                            </Box>
                            <Box className={classes.cardContainer}
                                 style={{margin: "0px 0px 10px 10px", maxHeight: "calc(495px - 58px - 10px)"}}>
                                {editPinnedLocations ?
                                    <ReactSortable list={shownPlaces} setList={setShownPlaces} group={{name: "shared", pull: "clone", put: false}} sort={false}>
                                        {shownPlaces.map(place => {
                                            return (

                                                <LocationCard
                                                    key={place.key}
                                                    id={place.key}
                                                    place={place.place}
                                                    isEntered={place.isEntered}
                                                    showButton={place.showButton}
                                                    isDisplayed={place.isDisplayed}
                                                    canDelete={false}
                                                    handleLocationEnter={place.handleLocationEnter}
                                                    handleLocationLeave={place.handleLocationLeave}
                                                />
                                            )
                                        })}
                                    </ReactSortable>
                                    :

                                    shownPlaces == null ? null :
                                        shownPlaces.map(place => {
                                            return (
                                                <LocationCard
                                                    key={place.key}
                                                    id={place.key}
                                                    place={place.place}
                                                    isEntered={place.isEntered}
                                                    showButton={place.showButton}
                                                    isDisplayed={place.isDisplayed}
                                                    canDelete={false}
                                                    handleLocationEnter={place.handleLocationEnter}
                                                    handleLocationLeave={place.handleLocationLeave}
                                                />
                                            )
                                        })}
                            </Box>

                            <Snackbar open={showResponseSnackbar} autoHideDuration={6000} onClose={handleResponseSnackbarClose}>
                                <Alert onClose={handleResponseSnackbarClose} severity={responseSnackbarType}>
                                    {responseSnackbarBody}
                                </Alert>
                            </Snackbar>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </div>
    )
}

export default function Home() {
    const [userState, setUserState] = useState(null);
    const [loadingState, setLoadingState] = useState(true);
    
    const initTime = new Date();
    
    useEffect(() => {
        fetch("/api/me", {
            credentials: "include",
        }).then(response => response.json()
        ).then(data => {
            data.error === "not_authenticated" ? window.location.href = "/api/login?returnTo=/home" : setUserState(data)
        }).catch(error => {
            console.log(error)
        })
    }, [])

    useEffect(() => {
        if (userState !== null) {
            setLoadingState(false)
        }
    }, [userState])

    const handleUserUpdate = () => {
        fetch("/api/me", {
            credentials: "include",
        }).then(response => response.json()).then((data) => {
            data.status === 401 ? window.location.href = "/api/login?returnTo=/home" : setUserState(data)
        });
    }

    return (
        <ThemeProvider theme={theme}>
            {loadingState ? null : <Navbar user={userState}/>}
            {loadingState ? <Grid container justify="center">
                    <CircularProgress/>
                </Grid> :
                <HomePage user={userState} handleUserUpdate={handleUserUpdate} initTime={initTime}/>}
        </ThemeProvider>
    )
}