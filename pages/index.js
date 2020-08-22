import React from "react";
import {Button, Paper, Typography} from "@material-ui/core";
import {makeStyles, ThemeProvider} from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import theme from "@components/MainTheme";

const useStyles = makeStyles((theme) => ({
    root: {
        height: "100vh",
        background: theme.palette.primary.light,
    },
    mainGrid: {
        height: "100vh",
        display: "grid",
        placeItems: "center",
    },
    loginContainer: {
        width: "clamp(0ch, 95%, 43ch)",
        background: "#F5F5F5",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "400px",
    },
    oAuthContainer: {
        display: "flex",
        alignItems: "start",
        justifyContent: "flex-start",
        padding: "10px",
        marginBottom: "30px",
        textTransform: "none",
        textDecoration: "none",
        width: "70%",
    },
    oAuthText: {
        color: theme.palette.primary.main,
        fontSize: "1.2rem",
        paddingLeft: "10px",
    },
    googleLogo: {
        height: "30px",
        width: "30px",
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
                    <Button variant="contained" className={classes.oAuthContainer} href="/api/login?redirectTo=/home">
                        <img alt="google logo" src="https://cdn.discordapp.com/attachments/473705436793798676/738834931219693588/google.png" className={classes.googleLogo}/>
                        <Typography variant="h6" className={classes.oAuthText}>
                            Sign in with Google
                        </Typography>
                    </Button>
                    <Button variant="contained" className={classes.oAuthContainer} href="/api/login?redirectTo=/home">
                        <img alt="veracross logo" src="https://cdn.discordapp.com/attachments/473705436793798676/746652562538889216/iu.png" className={classes.googleLogo}/>
                        <Typography variant="h6" className={classes.oAuthText}>
                            Sign in with Veracross
                        </Typography>
                    </Button>
                </Paper>
            </Box>
        </div>
    )
}

export default function Index() {
    return (
        <ThemeProvider theme={theme}>
            <Login/>
        </ThemeProvider>
    )
}