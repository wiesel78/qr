import * as React from 'react';
import { ViewAreaWrapper } from './ViewAreaStyles';

export interface ViewAreaProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {

}

export const ViewArea = (props : React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => {
    return (
        <ViewAreaWrapper {...props} />
    );
};