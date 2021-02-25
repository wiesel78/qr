import * as React from "react";

// views
import { HeaderView, MainView } from './views';
import { ViewAreaContent, ViewAreaFillDiv, ViewAreaHeader, ViewAreaHeaderContent } from "./components";

// router
import { Route } from "react-router-dom";
import { ConnectedRouter } from 'connected-react-router';
import {  MainPath } from "./values";

// Store Imports
import { Provider } from 'react-redux';
import { store, history, changeWindowsBackground, useStateSelector } from './store';

// Theme Imports
import { ThemeProvider } from 'styled-components';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { StylesProvider } from '@material-ui/styles';


changeWindowsBackground(store.getState().theme.theme);


const ManagedApp = () => {
    return (
        <ViewAreaHeaderContent>
            <ViewAreaHeader>
                <HeaderView />
            </ViewAreaHeader>
            <ViewAreaContent>
                <ViewAreaFillDiv>
                    <Route exact path={MainPath}>
                        <MainView />
                    </Route>
                </ViewAreaFillDiv>
            </ViewAreaContent>
        </ViewAreaHeaderContent>
    );
};

const ThemedApp: React.FC = () => {

    const themeState = useStateSelector(state => state.theme);

    return (
        <ThemeProvider theme={themeState.theme}>
        <MuiThemeProvider theme={themeState.theme} >
        <StylesProvider injectFirst>
            <ManagedApp />
        </StylesProvider>
        </MuiThemeProvider>
        </ThemeProvider>
    );
};

const RoutedApp: React.FC = () => {
    return (
        <ConnectedRouter history={history}>
            <ThemedApp />
        </ConnectedRouter>
    );
};

const App: React.FC = () => {

    return (
        <Provider store={store}>
            <RoutedApp />
        </Provider> 
    );
};

export default App;
