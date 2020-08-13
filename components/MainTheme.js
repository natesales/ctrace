import {createMuiTheme, makeStyles, ThemeProvider} from '@material-ui/core/styles'

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

export default theme