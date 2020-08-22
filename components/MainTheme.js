import {createMuiTheme, makeStyles, ThemeProvider} from '@material-ui/core/styles'

// BASIC BLACK AND WHITE 🖤🤍⬛⬜
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

// PURPLE OVERLOAD 👾🔮
// const theme = createMuiTheme({
//     palette: {
//         primary: {
//             light: "#810FC2",
//             main: "#540A80",
//             dark: "#220433",
//             contrastText: "#fff",
//         },
//         secondary: {
//             light: "#904FC2",
//             main: "#2A0540",
//             dark: "#220433",
//             contrastText: "#fff"
//         }
//     }
// });

export default theme