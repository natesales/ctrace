import React, {useEffect, useState, useRef} from "react"
import {Box, IconButton, InputBase, Paper, Typography, Snackbar} from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import {createMuiTheme, makeStyles, ThemeProvider} from '@material-ui/core/styles'
import {SpeedDial, SpeedDialIcon, SpeedDialAction} from '@material-ui/lab/'
import Navbar from "@components/Navbar";
import LocationCard from "@components/LocationCard";
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import SearchIcon from '@material-ui/icons/Search'
import LocationAlert from "@components/LocationAlert";
import {useFetchUser, fetchUser} from "../lib/user";
import QrCode from 'qrcode-reader';
import {ReactSortable} from "react-sortablejs";
import theme from "@components/MainTheme"

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100vh',
        background: theme.palette.primary.main,
    },
    mainGrid: {
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
    },
    mainContainer: {
        width: 'clamp(0px, 95%, 840px)',
        background: theme.palette.primary.light,
        color: '#fff',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        maxHeight: '467px',
        position: 'relative',
        top: '190px',
        borderRadius: '10px',
        [theme.breakpoints.down(864)]: {
            maxHeight: 'none',
        },
        [theme.breakpoints.down('xs')]: {
            top: '175px',
        },
    },
    cardFlex: {
        flex: '1 1 410px',
        maxHeight: '100%',
        borderRadius: '10px',
        background: theme.palette.primary.light,
        [theme.breakpoints.down(864)]: {
            width: '100%',
        },
    },
    cardContainer: {
        maxHeight: '410px',
        [theme.breakpoints.down(864)]: {
            maxHeight: 'none', //TODO: Decide if this is a good idea.
            marginBottom: '0px',
        },
        overflow: 'scroll',
        '&::-webkit-scrollbar': {
            width: '5px',
        },
        '&::-webkit-scrollbar-track': {
            background: '#636363',
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#fff',
            borderRadius: '20px',
        },
        scrollbarWidth: 'thin',
        overflowX: 'hidden',
        scrollbarColor: '#fff #636363'
    },
    columnTitleBox: {
        display: 'flex',
        justifyContent: 'space-between',
        margin: '10px',
        alignItems: 'center'
    },
    columnTitleText: {
        fontSize: '14px',
    },
    addPinnedButton: {
        padding: '2px',
        color: theme.palette.primary.contrastText,
    },
    searchContainer: {
        height: '58px',
        display: 'flex',
        alignItems: 'center',
        margin: '10px',
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: theme.palette.secondary.main,
        '&:hover': {
            backgroundColor: '#9B9B9B',
        },
        width: '100%',
        height: '80%',
    },
    searchIcon: {
        padding: theme.spacing(0, 1),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
        width: '100%',
    },
    inputInput: {
        padding: theme.spacing(1.7, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(3)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
    },
    placeList: {
        listStyleType: 'none',
        padding: 0,
        margin: 0
    }

}));

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

function HomePage(props) {
    const classes = useStyles();
    
    const [ userState, setUserState ] = useState(props.user);
    const [ shownPlaces, setShownPlaces ] = useState(null);
    const [ pinnedPlaces, setPinnedPlaces ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(false);
    const [ showResponseSnackbar, setShowResponseSnackbar ] = useState(false);
    const [ responseSnackbarBody, setResponseSnackbarBody ] = useState('');
    const [ responseSnackbarType, setResponseSnackbarType ] = useState('');
    const [ searchState, setSearchState ] = useState('');
    const [ editPinnedLocations, setEditPinnedLocations ] = useState(false);
    const [ showFreePeriodSnackbar, setShowFreePeriodSnackbar ] = useState(true); //To be changed after testing.

    const mounted = useRef();
    useEffect(() => {
    if (!mounted.current) {
        // do componentDidMount logic
        mounted.current = true;
    } else {
        if (userState !== props.user) {
        setUserState(props.user)
        setIsLoading(false);

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
        
                    const result = <LocationCard
                        key={place._id}
                        place={place}
                        isEntered={isEntered}
                        showButton={showButton}
                        isDisplayed={true}
                        handleLocationEnter={handleLocationEnter}
                        handleLocationLeave={handleLocationLeave}
                    />;
        
                    return (
                        result
                    )
                })
            )

        
        }
    }
    });

    const handleResponseSnackbarOpen = (success, body) => {
        setResponseSnackbarBody(body);
        setResponseSnackbarType(() => {
            if (success) {
                return 'success';
            } else {
                return 'error'
            }
        })
        setShowResponseSnackbar(true);

    }

    const handleLocationEnter = (event) => {
        setIsLoading(true);
        let locationId;
        if (event.target.parentElement.id !== "") {
            locationId = event.target.parentElement.id
        } else {
            locationId = event.currentTarget.id
        }

        fetch('/api/checkin', {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                "location": locationId,
            }),
        })
            .then(response => response.json())
            .then(data => {handleResponseSnackbarOpen(data.success, data.message)})
            .then(props.handleUserUpdate)
            .catch(error => handleResponseSnackbarClose(false, data.message));

            // TODO: if (!response.success) { show fail dialog }
    }

    const handleLocationLeave = (event) => {
        setIsLoading(true);
        let locationId;
        if (event.target.parentElement.id !== "") {
            locationId = event.target.parentElement.id
        } else {
            locationId = event.currentTarget.id
        }

        fetch('/api/checkout', {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                "location": locationId,
            }),
        })
            .then(response => response.json())
            .then(data => handleResponseSnackbarOpen(data.success, data.message))
            .then(props.handleUserUpdate)
            .catch(error => handleResponseSnackbarClose(false, data.message));

        // TODO: if (!response.success) { show fail dialog }
    }


    if (userState == null) {
        window.location.href = '/api/login';
        // TODO: Redirect to login
    }

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
    
                const result = <LocationCard
                    key={place._id}
                    place={place}
                    isEntered={isEntered}
                    showButton={showButton}
                    isDisplayed={true}
                    handleLocationEnter={handleLocationEnter}
                    handleLocationLeave={handleLocationLeave}
                />;
    
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

                const result = <LocationCard
                    key={place._id}
                    place={place}
                    isEntered={isEntered}
                    showButton={showButton}
                    isDisplayed={true}
                    handleLocationEnter={handleLocationEnter}
                    handleLocationLeave={handleLocationLeave}
                />;

                return (
                    result
                )
            })
            :
            []
        )
    }, [userState])

    function handleSearch(event) {
        setSearchState(event.target.value);
        let search_string = event.target.value.toUpperCase();

        for (let i = 0; i < shownPlaces.length; i++) {
            const place_name = shownPlaces[i].props.place.name;
            if (place_name.toUpperCase().indexOf(search_string) > -1) {
                setShownPlaces(prevState => {
                    let newState = prevState;
                    newState[i] = <LocationCard
                        key={newState[i].props.place._id}
                        place={newState[i].props.place}
                        isEntered={newState[i].props.isEntered}
                        showButton={newState[i].props.showButton}
                        isDisplayed={true}
                        handleLocationEnter={handleLocationEnter}
                        handleLocationLeave={handleLocationLeave}
                    />;

                    return (newState)
                })
            } else {
                setShownPlaces(prevState => {
                    let newState = prevState;
                    newState[i] = <LocationCard
                        key={newState[i].props.place._id}
                        place={newState[i].props.place}
                        isEntered={newState[i].props.isEntered}
                        showButton={newState[i].props.showButton}
                        isDisplayed={false}
                        handleLocationEnter={handleLocationEnter}
                        handleLocationLeave={handleLocationLeave}
                    />;
                    return (newState)
                })
            }
        }
    }

    const handlePinnedLocation = () => {
        setEditPinnedLocations(prevState => {
            return (
                !prevState
            )
        })

    }

    const handleResponseSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
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
                                {editPinnedLocations ? <CloseIcon /> : <AddIcon/>}
                            </IconButton>
                        </Box>

                        {props.buttonLoadState ? null :
                            <Box className={classes.cardContainer} style={{margin: '0px 0px 10px 10px'}}>
                                {editPinnedLocations ?
                                    <React.Fragment>
                                        <Typography variant="h6" gutterBottom className={classes.columnTitleText}>
                                            Drag a location from the right to pin it.
                                        </Typography>                                    
                                        <ReactSortable list={pinnedPlaces} setList={setPinnedPlaces} group={{name: 'shared'}} style={{minHeight: '100px', width: '100%'}}>
                                            {pinnedPlaces}
                                        </ReactSortable>
                                    </React.Fragment>
                                    :
                                    pinnedPlaces}
                            </Box>}
                    </Box>
                    <Box className={classes.cardFlex}>
                        <Box className={classes.columnTitleBox} style={{height: '28px'}}>
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
                                    inputProps={{'aria-label': 'search'}}
                                    onChange={handleSearch}
                                    value={searchState}
                                />
                            </div>
                        </Box>
                        {props.buttonLoadState ? null :
                            <Box className={classes.cardContainer} id="test"
                                 style={{margin: '0px 0px 10px 10px', maxHeight: 'calc(410px - 58px - 10px)'}}>
                                {editPinnedLocations ?
                                    <ReactSortable list={shownPlaces} setList={setShownPlaces} group={{name: 'shared', pull: 'clone', put: false}} sort={false} onEnd={(event) => {
                                        for (let i = 0; i < pinnedPlaces.length; i++) {
                                            if (pinnedPlaces[i].props.place._id === shownPlaces[event.oldIndex].props.place._id && i !== event.newIndex) {
                                                console.log('ALREWADY HERE')
                                                pinnedPlaces.splice(i, 1);
                                                break;
                                            }
                                        }

                                    }}>
                                        {shownPlaces}
                                    </ReactSortable>
                                    :
                                    shownPlaces}
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
        fetch('/api/me', {
            credentials: 'include',
        }).then(response => response.json()).then((data) => {setUserState(data)});
    }

    const handleQRCode = (event) => {
        if (event.currentTarget.files && event.currentTarget.files[0]) {
            const FR = new FileReader();

            FR.addEventListener("load", function (e) {
                const qr = new QrCode();
                qr.callback = function (error, result) {
                    if (error) {
                        console.log(error)
                        return;
                    }
                    const location_id = result["result"].split("?loc=")[1];
                    console.log(location_id);

                    if (!location_id) {
                        console.log("Checking in with location_id: ", location_id)
                        fetch('/api/checkin', {
                            method: 'POST',
                            credentials: 'include',
                            headers: {'Content-Type': 'application/json'},
                            body: JSON.stringify({
                                "location": location_id,
                            }),
                        })
                            .then(response => response.json())
                            .then(data => console.log(data))
                            .then(props.handleUserUpdate)
                            .catch(error => console.log(error));

                            // TODO: if (!response.success) { show fail dialog }
                    }
                }
                qr.decode(e.target.result);
            });

            FR.readAsDataURL(event.currentTarget.files[0]);
        } else {
            alert("Error uploading image.");
            throw new Error("Error uploading image.");
        }
    };


    return (
        <ThemeProvider theme={theme}>
            <Navbar handleQRCode={handleQRCode}/>
            <LocationAlert/>
            {loadingState ? <div>Loading...</div> :
                <HomePage user={userState} handleUserUpdate={handleUserUpdate} buttonLoadState={buttonLoadState}/>}
        </ThemeProvider>
    )
}