import React, {useEffect, useRef, useState} from "react"
import {Box, IconButton, InputBase, Paper, Snackbar, Typography} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import {makeStyles, ThemeProvider} from "@material-ui/core/styles"
import {SpeedDial, SpeedDialAction, SpeedDialIcon} from "@material-ui/lab/"
import Navbar from "@components/Navbar";
import LocationCard from "@components/LocationCard";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import SearchIcon from "@material-ui/icons/Search"
import {fetchUser} from "../lib/user";
import {ReactSortable} from "react-sortablejs";
import theme from "@components/MainTheme"

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
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        maxHeight: "467px",
        position: "relative",
        top: "190px",
        borderRadius: "10px",
        [theme.breakpoints.down(864)]: {
            maxHeight: "none",
        },
        [theme.breakpoints.down("xs")]: {
            top: "175px",
        },
    },
    cardFlex: {
        flex: "1 1 410px",
        maxHeight: "100%",
        borderRadius: "10px",
        background: theme.palette.primary.light,
        [theme.breakpoints.down(864)]: {
            width: "100%",
        },
    },
    cardContainer: {
        maxHeight: "410px",
        [theme.breakpoints.down(864)]: {
            maxHeight: "none", //TODO: Decide if this is a good idea.
            marginBottom: "0px",
        },
        overflow: "scroll",
        "&::-webkit-scrollbar": {
            width: "5px",
        },
        "&::-webkit-scrollbar-track": {
            background: "#636363",
        },
        "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#fff",
            borderRadius: "20px",
        },
        scrollbarWidth: "thin",
        overflowX: "hidden",
        scrollbarColor: "#fff #636363"
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
        "&:hover": {
            backgroundColor: "#9B9B9B",
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
    }

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
    const [isLoading, setIsLoading] = useState(false);
    const [showResponseSnackbar, setShowResponseSnackbar] = useState(false);
    const [responseSnackbarBody, setResponseSnackbarBody] = useState("");
    const [responseSnackbarType, setResponseSnackbarType] = useState("");
    const [searchState, setSearchState] = useState("");
    const [editPinnedLocations, setEditPinnedLocations] = useState(false);
    const [showFreePeriodSnackbar, setShowFreePeriodSnackbar] = useState(true); //To be changed after testing.
    const [canAddPinnedLocation, setCanAddPinnedLocation] = useState(true);
    const [pinnedPlacesLength, setPinnedPlacesLength] = useState(0)

    const mounted = useRef(); // Used to update userState after re-fetching /me. Not perfect but react seems to only work well this way.
    useEffect(() => {
        if (!mounted.current) {
            // Just after the component as mounted.
            mounted.current = true;
        } else {
            // Just after the component has updated.
            if (userState !== props.user) {
                setUserState(props.user)
                setIsLoading(false);
            }
        }
    });

    // Handle the response snackbar. Takes a message and a success boolean.
    const handleResponseSnackbarOpen = (success, body) => {
        setResponseSnackbarBody(body);
        setResponseSnackbarType(() => {
            if (success) {
                return "success";
            } else {
                return "error"
            }
        })
        setShowResponseSnackbar(true);

    }

    // Calls /checkin when needed.
    const handleLocationEnter = (event) => {
        setIsLoading(true);
        let locationId;
        if (event.target.parentElement.id !== "") {
            locationId = event.target.parentElement.id
        } else {
            locationId = event.currentTarget.id
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
                handleResponseSnackbarOpen(data.success, data.message)
            })
            .then(props.handleUserUpdate)
            .catch(error => handleResponseSnackbarOpen(false, data.message));
    }

    // Calls /checkout when needed.
    const handleLocationLeave = (event) => {
        setIsLoading(true);
        let locationId;
        if (event.target.parentElement.id !== "") {
            locationId = event.target.parentElement.id
        } else {
            locationId = event.currentTarget.id
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
            .catch(error => handleResponseSnackbarOpen(false, data.message));

        // TODO: if (!response.success) { show fail dialog }
    }

    // Redirects you to login if the user doesn't exist yet.
    // TODO: See whether this is a good idea, as the user could maybe (?) return null for not login-related reasons.
    if (userState == null) {
        window.location.href = "/api/login";
    }

    // Sets the shown places and the pinned places assuming the /me route has been returned and the user is not null.
    useEffect(() => {
        setShownPlaces(
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

                const result = {
                    key: place._id,
                    place: place,
                    isEntered: isEntered,
                    showButton: showButton,
                    isDisplayed: true,
                    handleLocationEnter: handleLocationEnter,
                    handleLocationLeave: handleLocationLeave,
                }

                return (
                    result
                )
            }));

        setPinnedPlaces(
            userState.pinned_locations !== null ?
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

                    const result = {
                        key: place._id,
                        place: place,
                        isEntered: isEntered,
                        showButton: showButton,
                        isDisplayed: true,
                        handleLocationEnter: handleLocationEnter,
                        handleLocationLeave: handleLocationLeave,
                    }

                    return (
                        result
                    )
                })
                :
                []
        )
    }, [userState])

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
                    return (newState)
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
                    return (newState)
                })
            }
        }
    }

    useEffect(() => {
        if (pinnedPlaces != null) {
            if (pinnedPlaces.length !== pinnedPlacesLength) {
                setPinnedPlacesLength(pinnedPlaces.length)
                setPinnedPlaces(prevState => {
                    return (prevState.filter((v, i, a) => prevState.findIndex(t => (t.key === v.key)) === i))
                })
            }
        }
    }, [pinnedPlaces])

    async function handlePinnedLocation() {

        if (editPinnedLocations) {
            setEditPinnedLocations(prevState => {
                return (
                    !prevState
                )
            })

            if (pinnedPlaces !== null) {
                const pinned_locations = pinnedPlaces.map(place => {
                    return (place.key)
                })

                await fetch("/api/pin", {
                    method: "POST",
                    credentials: "include",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        "pinned_locations": pinned_locations,
                    }),
                }).then(response => response.json()).then(data => {
                    handleResponseSnackbarOpen(data.success, data.message)
                }).catch(error => handleResponseSnackbarOpen(false, data.message))
            }

        } else {
            setEditPinnedLocations(prevState => {
                return (
                    !prevState
                )
            })
        }


    }

    const handleResponseSnackbarClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setShowResponseSnackbar(false);
    };

    return (
        <div className={classes.root}>
            <Box className={classes.mainGrid}>
                <Paper className={classes.mainContainer} elevation={3}>
                    <Box className={classes.cardFlex}>
                        <Box className={classes.columnTitleBox}>
                            <Typography variant="h6" className={classes.columnTitleText}>
                                Pinned Locations
                            </Typography>
                            <IconButton aria-label="add a pinned location" className={classes.addPinnedButton} onClick={handlePinnedLocation}>
                                {editPinnedLocations ? <CloseIcon/> : <AddIcon/>}
                            </IconButton>
                        </Box>

                        {props.buttonLoadState ? null :
                            <Box className={classes.cardContainer} style={{margin: "0px 0px 10px 10px"}}>
                                {editPinnedLocations ?
                                    <React.Fragment>
                                        <Typography variant="h6" gutterBottom className={classes.columnTitleText}>
                                            Drag a location from the right to pin it.
                                        </Typography>
                                        <ReactSortable list={pinnedPlaces} setList={setPinnedPlaces} group={{name: "shared", put: canAddPinnedLocation}} style={{minHeight: "100px", width: "100%"}}>
                                            {pinnedPlaces.map(place => {
                                                return (
                                                    <LocationCard
                                                        key={place.key}
                                                        id={place.key}
                                                        place={place.place}
                                                        isEntered={place.isEntered}
                                                        showButton={place.showButton}
                                                        isDisplayed={place.isDisplayed}
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
                                                    handleLocationEnter={handleLocationEnter}
                                                    handleLocationLeave={place.handleLocationLeave}
                                                />
                                            )
                                        })}
                            </Box>}
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
                            </div>
                        </Box>
                        {props.buttonLoadState ? null :
                            <Box className={classes.cardContainer} id="test"
                                 style={{margin: "0px 0px 10px 10px", maxHeight: "calc(410px - 58px - 10px)"}}>
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
                                                    handleLocationEnter={place.handleLocationEnter}
                                                    handleLocationLeave={place.handleLocationLeave}
                                                />
                                            )
                                        })}
                            </Box>}

                        <Snackbar open={showResponseSnackbar} autoHideDuration={6000} onClose={handleResponseSnackbarClose}>
                            <Alert onClose={handleResponseSnackbarClose} severity={responseSnackbarType}>
                                {responseSnackbarBody}
                            </Alert>
                        </Snackbar>
                    </Box>
                </Paper>
            </Box>
        </div>
    )
}

export default function Home() {
    const classes = useStyles();

    const [userState, setUserState] = useState(null);
    const [loadingState, setLoadingState] = useState(true);
    const [buttonLoadState, setButtonLoadState] = useState(false);


    useEffect(() => {
        fetchUser().then(data => {
            setUserState(data)
        }).then(() => {
            setLoadingState(false);
        })
    }, [])

    const handleUserUpdate = () => {
        fetch("/api/me", {
            credentials: "include",
        }).then(response => response.json()).then((data) => {
            setUserState(data)
        });
    }

    return (
        <ThemeProvider theme={theme}>
            <Navbar/>
            {/*<LocationAlert/>*/}
            {loadingState ? <div>Loading...</div> :
                <HomePage user={userState} handleUserUpdate={handleUserUpdate} buttonLoadState={buttonLoadState}/>}
        </ThemeProvider>
    )
}