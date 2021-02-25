import { useStateSelector } from "./root-reducer";
import { useDispatch } from "react-redux";

/**
 * Verwaltet den Wert hinter state.global.cacheState
 * @return [
 *      value GlobalCacheState aktueller Wert,
 *      setValue (x : GlobalCacheState) => void
 * ]
 */
export const useGlobalCacheState = () : [GlobalCacheState, (x : GlobalCacheState) => void] => {
    const value = useStateSelector(state => state.global.cacheState);
    const dispatch = useDispatch();

    return [value, (x : GlobalCacheState) => dispatch(setGlobalCacheState(x))];
};

export const useAuthMode = () : [
    AuthMode, 
    (mode : AuthMode) => void] => 
{
    const authMode = useStateSelector(state => state.global.authMode);
    const dispatch = useDispatch();

    return [
        authMode,
        (mode : AuthMode) => dispatch(setGlobalAuthMode(mode)),
    ];
}

export const useSaveAuthMode = () : [
    boolean, 
    (value : boolean) => void
] => 
{
    const val = useStateSelector(state => state.global.saveAuthMode);
    const dispatch = useDispatch();

    return [
        val, 
        (value : boolean) => dispatch(saveAuthMode(value))
    ];
}

// Actions
export const SET_GLOBAL_CACHE_STATE = "SET_GLOBAL_CACHE_STATE";
export const setGlobalCacheState = (value : GlobalCacheState) : TypedAction<GlobalCacheState> => {
    return { type:SET_GLOBAL_CACHE_STATE, value}
};

export const SET_GLOBAL_AUTH_MODE = "SET_GLOBAL_AUTH_MODE";
export const setGlobalAuthMode = (value : AuthMode) : TypedAction<AuthMode> => {
    return { type:SET_GLOBAL_AUTH_MODE, value}
};

export const SAVE_AUTH_MODE = "SAVE_AUTH_MODE";
export const saveAuthMode = (value : boolean) : TypedAction<boolean> => {
    return { type:SAVE_AUTH_MODE, value}
};

// Types
export enum GlobalCacheState {
    Nothing,
    PreAuth,
    PostAuth,
    Complete,
}

export enum AuthMode {
    Pin = "pin",
    Credentials = "credentials",
}

export type GlobalState = {
    cacheState : GlobalCacheState ;
    authMode : AuthMode ;
    saveAuthMode : boolean ;
};


export const initialGlobalState = {
    cacheState : GlobalCacheState.Nothing,
    authMode : AuthMode.Credentials,
    saveAuthMode : false,
};



// Reducer
export const globalReducer = (state : GlobalState = initialGlobalState, action : any) => {
    switch(action.type)
    {
        case SET_GLOBAL_CACHE_STATE:
            return {...state, cacheState : action.value};

        case SET_GLOBAL_AUTH_MODE:
            return {...state, authMode : action.value};

        case SAVE_AUTH_MODE:
            return {...state, saveAuthMode : action.value};

        default:
            return state;
    }
};
