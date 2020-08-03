import React from 'react';
import {Button, Paper, Typography} from '@material-ui/core';
import {createMuiTheme, makeStyles, ThemeProvider} from '@material-ui/core/styles'
import Box from "@material-ui/core/Box";

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
        background: theme.palette.primary.light,
    },
    mainGrid: {
        height: '100vh',
        display: 'grid',
        placeItems: 'center',
    },
    loginContainer: {
        width: 'clamp(0ch, 95%, 46ch)',
        background: '#F5F5F5',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    oAuthContainer: {
        display: 'flex',
        alignItems: 'center',
        padding: '10px',
        marginBottom: '30px',
        textTransform: 'none',
        textDecoration: 'none',
    },
    oAuthText: {
        color: theme.palette.primary.main,
        fontSize: '1rem',
        paddingLeft: '10px',
    },
    googleLogo: {
        height: '30px',
        width: '30px',
    }

}));

function Login() {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Box className={classes.mainGrid}>
                <Paper className={classes.loginContainer} elevation={3}>
                    <Typography variant="h2" gutterBottom className={classes.title}>
                        cTrace
                    </Typography>
                    <Button variant="contained" className={classes.oAuthContainer} href="/api/login/" >
                        <img alt="google logo" src="https://cdn.discordapp.com/attachments/473705436793798676/738834931219693588/google.png" className={classes.googleLogo} />
                        <Typography variant="h6" className={classes.oAuthText}>
                            Sign in with Google
                        </Typography>
                    </Button>
                </Paper>
            </Box>
        </div>
)
}

export default function Index() {
    return(
        <ThemeProvider theme={theme}>
            <Login />
        </ThemeProvider>
    )
}