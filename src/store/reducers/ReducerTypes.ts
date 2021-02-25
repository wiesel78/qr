// Actiontypes
declare interface EmptyAction {
    type : string;
}

declare type TextAction = EmptyAction & {
    text : string;
};

declare interface TypedAction<T> extends EmptyAction {
    value : T;
} 
