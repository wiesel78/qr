import React from 'react';
import styled from 'styled-components';

export const ViewAreaWrapper = styled.div<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>>`
    min-width:100vw;
    min-height:100vh;
    display:flex;
    flex-direction:column;
    position:relative;
` as React.FunctionComponent<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>>;

export const ViewAreaFillDiv = styled.div<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>>`
    flex-grow:1;
    display:flex;
    flex-direction:column;
    position:relative;
` as React.FunctionComponent<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>>;

export const ViewAreaFillArticle = styled.article`
    flex-grow:1;
    display:flex;
    flex-direction:column;
    position:relative;
`

export const ViewAreaFillSection = styled.section`
    flex-grow:1;
    display:flex;
    flex-direction:column;
    position:relative;
`

export const ViewAreaHeaderContent = styled.div`
    display: flex;
    flex-flow: column;
    height: 100%;
`;

export const ViewAreaHeader = styled.div`
    flex:0 1 auto;
`;

export const ViewAreaContent = styled.div`
    flex:1 1 auto;
`;
