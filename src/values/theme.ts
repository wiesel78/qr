import { createMuiTheme, Theme } from '@material-ui/core/styles';
import blueGrey from '@material-ui/core/colors/blueGrey';
import grey from '@material-ui/core/colors/grey';
import red from '@material-ui/core/colors/red';
import cyan from '@material-ui/core/colors/cyan';

// dieses blau "#1a73e8"

const lightTheme = createMuiTheme({
    palette: {
        primary: {
            main: cyan["900"],
        },
        secondary: {
            main: blueGrey["600"],
        },
        error: {
            main: red["500"],
        },
        type: "light",
    },
});

const darkTheme = createMuiTheme({
    palette: {
        primary: {
            main: "#121212",
        },
        secondary: {
            main: grey["700"],
        },
        error: {
            main: red["500"],
        },
        background : {
            default: "#000",
            paper: grey["900"],
        },
        type: "dark",
    },
        
    overrides: {
        MuiSnackbarContent: {
            root: {
                color: 'white',         
            },
        },
    },
});

export const controlLightTheme: Theme = createMuiTheme(lightTheme);
export const controlDarkTheme: Theme = createMuiTheme(darkTheme);

export const controlDefaultTheme: Theme = controlDarkTheme;


export const isDarkTheme = (theme : Theme) : boolean => getTheme(theme).palette.type === 'dark';
export const getTheme = (theme : Theme) => theme || controlDefaultTheme;