import React, {useState} from "react"
import { AppBar, Toolbar, Typography, IconButton, Paper, Grid, Container, Button, Box, InputBase } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles'
import Navbar from "components/Navbar";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import LocationCard from "components/LocationCard";
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search'
import LocationAlert from "components/LocationAlert";

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
        background: theme.palette.primary.light,
        [theme.breakpoints.down(864)]: {
            width: '100%',
        },
    },
    cardContainer: {
        margin: '10px',
        maxHeight: '410px',
        [theme.breakpoints.down(864)]: {
            maxHeight: 'none',
            marginBottom: '0px',
        },
        overflow: 'scroll',
        '&:-webkit-scrollbar': {
            width: '2px',
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
    },
    inputInput: {
        padding: theme.spacing(1.7, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(3)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
    },

}));

function HomePage() {
    const classes = useStyles();

    const [ places, setPlaces ] = useState(null);

    const placeinfo = {name: 'Upper School Library', count: '6'};

    return (
        <div className={classes.root}>
            <Navbar />
            <LocationAlert/>
            <Box className={classes.mainGrid}>
                <Paper className={classes.mainContainer} elevation={3}>
                    <Box className={classes.cardFlex}>
                        <Box className={classes.columnTitleBox}>
                            <Typography variant="h6" className={classes.columnTitleText}>
                                Pinned Locations
                            </Typography>
                            <IconButton aria-label="add a pinned location" className={classes.addPinnedButton}>
                                <AddIcon />
                            </IconButton>
                        </Box>
                        <Box className={classes.cardContainer}>
                            <LocationCard place={placeinfo} />
                        </Box>
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
                                    <SearchIcon />
                                </div>
                                <InputBase
                                    placeholder="Search…"
                                    classes={{
                                        root: classes.inputRoot,
                                        input: classes.inputInput,
                                    }}
                                    inputProps={{ 'aria-label': 'search' }}
                                />
                            </div>
                        </Box>
                        <Box className={classes.cardContainer}>

                        </Box>
                    </Box>
                </Paper>
            </Box>
        </div>
    )
}

export default function Home() {
    return (
        <ThemeProvider theme={theme}>
            <HomePage />
        </ThemeProvider>
    )
}