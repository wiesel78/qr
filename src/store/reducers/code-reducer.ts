import { useStateSelector } from "./root-reducer";
import { useDispatch } from "react-redux";


export const useCodes = () : [
    string[], 
    (value : string[]) => void
] => 
{
    const val = useStateSelector(state => state.code.codes);
    const dispatch = useDispatch();

    return [
        val, 
        (value : string[]) => dispatch(setCodes(value))
    ];
}


export const useCurrentCode = () : [
    string | null, 
    (value : string | null) => void
] => 
{
    const val = useStateSelector(state => state.code.currendCode);
    const dispatch = useDispatch();

    return [
        val, 
        (value : string | null) => dispatch(setCurrentCode(value))
    ];
}

// Actions
export const SET_CODES = "SET_CODES";
export const setCodes = (value : string[]) : TypedAction<string[]> => {
    return { type:SET_CODES, value}
};

export const SET_CURRENT_CODE = "SET_CURRENT_CODE";
export const setCurrentCode = (value : string | null) : TypedAction<string | null> => {
    return { type:SET_CURRENT_CODE, value}
};

export type CodeState = {
    codes : string[];
    currendCode : string | null;
};


export const initialCodeState = {
    codes : [],
    currendCode : null,
};



// Reducer
export const codeReducer = (state : CodeState = initialCodeState, action : any) => {
    switch(action.type)
    {
        case SET_CODES:
            return {...state, codes : action.value};
            
        case SET_CURRENT_CODE:
            const newState = {...state, currendCode : action.value};

            if(action.value && (!state.codes.length || state.codes[state.codes.length-1] !== action.value))
                return {...state, currendCode : action.value, codes : [...state.codes, action.value]};

            return newState;

        default:
            return state;
    }
};
