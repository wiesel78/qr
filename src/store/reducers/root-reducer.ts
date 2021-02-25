import { combineReducers } from 'redux';
import { connectRouter, RouterState } from 'connected-react-router';
import { themeReducer, ThemeState } from './theme-reducer';
import { globalReducer, GlobalState } from './global-reducer';
import { useSelector } from 'react-redux';
import { codeReducer, CodeState } from './code-reducer';


export type AppState = {
    theme : ThemeState;
    router : RouterState;
    global : GlobalState;  
    code : CodeState;
};

export const createRootReducer = (history : any) => combineReducers<AppState>({
    router : connectRouter(history),
    theme : themeReducer,
    global : globalReducer,
    code : codeReducer,
});


export function useStateSelector<T>(selector : (state : AppState) => T) {
    return useSelector(selector);
}