import { Theme } from '@material-ui/core';
import { controlDarkTheme, controlLightTheme } from '../../values';



// helper
export const changeWindowsBackground = (theme : Theme) : void => {
    // Set Theme propertys of html and body tag 
    const htmlStyle = (document.getElementsByTagName("HTML")[0] as HTMLElement).style;
    htmlStyle.backgroundColor = theme.palette.background.default;

    const bodyStyle = document.body.style;
    bodyStyle.backgroundColor = theme.palette.background.default;
    bodyStyle.margin = "0px";
}


// States
export type ThemeState = {
    theme : Theme
};

// Actions
export const SET_THEME = "SET_THEME";
export const setTheme = (value : Theme) : TypedAction<Theme> => {
    return { type:SET_THEME, value}
};

export const TOGGLE_THEME = "TOGGLE_THEME";
export const toggleTheme = () : EmptyAction => {
    return { type: TOGGLE_THEME };
}

// State
export const initialThemeState = {
    theme : controlDarkTheme
};


// Reducer
export const themeReducer = (state = initialThemeState, action : any) => {
    switch(action.type)
    {
        case SET_THEME:
            changeWindowsBackground(action.theme);
            return Object.assign({}, state, { theme : action.theme });

        case TOGGLE_THEME:
            const theme = state.theme.palette.type === "dark" ? controlLightTheme : controlDarkTheme;
            changeWindowsBackground(theme);
            return Object.assign({}, state, { theme });

        default:
            return state;
    }
};