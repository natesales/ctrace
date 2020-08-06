import React, {useEffect, useState} from "react"
import {Box, IconButton, InputBase, Paper, Typography} from '@material-ui/core';
import {createMuiTheme, makeStyles, ThemeProvider} from '@material-ui/core/styles'
import Navbar from "@components/Navbar";
import LocationCard from "@components/LocationCard";
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search'
import LocationAlert from "@components/LocationAlert";
import {useFetchUser, fetchUser} from "../lib/user";
import QrCode from 'qrcode-reader';
import {ReactSortable} from "react-sortablejs";

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
            maxHeight: 'none',
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

function HomePage(props) {
    const classes = useStyles();

    useEffect(() => {
    }, []);

    const handleLocationEnter = (event) => {
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
            .then(data => console.log(data))
            .then(props.handleUserUpdate)
            .catch(error => {
                console.log(error);
            });

    }

    const handleLocationLeave = (event) => {
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
            .then(data => console.log(data))
            .then(props.handleUserUpdate)
            .catch(error => {
                console.log(error)
            });
    }


    if (props.user == null) {
        console.log("User not signed in.") // TODO: Redirect to login
    }

    const places = props.user.locations;

    const [shownPlaces, setShownPlaces] = useState(
        places.map(place => {
            let isEntered = false;
            let showButton = true;

            if (props.user.current_location != null) {
                showButton = false;
                if (place._id === props.user.current_location._id) {
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

    const [pinnedPlaces, setPinnedPlaces] = useState(
        props.user.pinned_locations !== null ?
            props.user.pinned_locations.map(place => {
                let isEntered = false;
                let showButton = true;

                if (props.user.current_location != null) {
                    showButton = false;
                    if (place._id === props.user.current_location._id) {
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
    );

    const [searchState, setSearchState] = useState('');
    const [editPinnedLocations, setEditPinnedLocations] = useState(false);

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
                                <AddIcon/>
                            </IconButton>
                        </Box>

                        {props.buttonLoadState ? null :
                            <Box className={classes.cardContainer} style={{margin: '0px 0px 10px 10px'}}>
                                {editPinnedLocations ?
                                    <ReactSortable list={pinnedPlaces} setList={setPinnedPlaces} group={{name: 'shared'}} style={{height: '100%', width: '100%'}}>
                                        {pinnedPlaces}
                                    </ReactSortable>
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
            console.log(userState)
        })
    }, [])

    const handleUserUpdate = () => {
        setLoadingState(true);

        fetch('/api/me', {
            credentials: 'include',
        }).then(response => response.json()).then(data => setUserState(data)).then(() => {
            setLoadingState(false)
        })

        console.log('updated!', userState)
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
                            .catch(error => {
                                console.log(error);
                            });
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