import { Box, Card, CardContent, CardHeader, Typography } from '@material-ui/core';
import * as React from 'react';
import styled from 'styled-components';
import { DsfinvkData, DsfinvkProcessData, DsfinvkProcessDataVat, getDsfinvkData } from './dsfinvk';

const Panel = styled.div`
    display:flex;
    flex:1 1 auto;
    flex-direction:column;
`;

function DsfinvkCardProcessDataSubItem({title, data} : {title? : string, data? : string}){
    return (
        <Box marginBottom={1}>
            <Typography color="textPrimary" variant="subtitle1">
                {title ?? ""}
            </Typography>
            <Typography color="textPrimary" variant="body1" component="p" style={{wordWrap:"break-word", fontFamily:"monospace"}}>
                {data ?? "/"}
            </Typography>
        </Box>
    );
}

function DsfinvkCardProcessDataItem({title, data} : {title? : string, data? : DsfinvkProcessData}){
    return (
        <Box marginBottom={3}>
            <Typography color="textPrimary" variant="h6">
                {title ?? ""}
            </Typography>

            <DsfinvkCardProcessDataSubItem title="Vorgangstyp" data={data?.type} />

            {!!data?.vat?.vat1 && <DsfinvkCardProcessDataSubItem title="Steuerumsatz (19%)" data={data?.vat?.vat1.toString()} />}
            {!!data?.vat?.vat2 && <DsfinvkCardProcessDataSubItem title="Steuerumsatz (7%)" data={data?.vat?.vat2.toString()} />}
            {!!data?.vat?.vat3 && <DsfinvkCardProcessDataSubItem title="Steuerumsatz (10.7%)" data={data?.vat?.vat3.toString()} />}
            {!!data?.vat?.vat4 && <DsfinvkCardProcessDataSubItem title="Steuerumsatz (5.5%)" data={data?.vat?.vat4.toString()} />}
            {!!data?.vat?.vat5 && <DsfinvkCardProcessDataSubItem title="Steuerumsatz (0%)" data={data?.vat?.vat5.toString()} />}
            
            <Box marginBottom={1}>
                <Typography color="textPrimary" variant="subtitle1">
                    Zahlungen
                </Typography>
                {data?.payment.map(payment => (
                    <Typography color="textPrimary" variant="body1" component="p" style={{wordWrap:"break-word", fontFamily:"monospace"}}>
                        <span style={{width:"100px", marginRight:"16px"}}>{payment.type}</span> 
                        <span>{payment.total}</span> 
                        <span>{payment.currency ?? "EUR"}</span> 
                    </Typography>
                ))}
            </Box>


        </Box>
    );
}

function DsfinvkCardItem({title, content} : {title? : string, content? : string}){
    return (
        <Box marginBottom={3}>
            <Typography color="textPrimary" variant="h6">
                {title ?? ""}
            </Typography>
            <Typography color="textPrimary" variant="body1" component="p" style={{wordWrap:"break-word", fontFamily:"monospace"}}>
                {content ?? ""}
            </Typography>
        </Box>
    );
}

export interface DsfinvkCardProps {
    className?: string;
    content : string;
}

export function DsfinvkCard(props : DsfinvkCardProps) {
    const {className, content} = props;

    const data = getDsfinvkData(content ?? "");

    return (
        <Card>
            <CardHeader title="Belegsignatur" subheader="DSFinV-K Signaturdaten"/>
            <CardContent>
                <DsfinvkCardItem title="Client-ID" content={data?.clientId} />
                <DsfinvkCardItem title="Transaktionsnummer" content={data?.transactionNumber.toString()} />
                <DsfinvkCardItem title="Signaturzähler" content={data?.signatureCounter.toString()} />
                <DsfinvkCardItem title="Startzeit" content={data?.startTime.toDateString()} />
                <DsfinvkCardItem title="Endzeit" content={data?.logTime.toDateString()} />
                <DsfinvkCardItem title="Signatur-Algorithmus" content={data?.sigAlg} />
                <DsfinvkCardItem title="Zeitformat" content={data?.logTimeFormat} />
                <DsfinvkCardItem title="ProcessType" content={data?.processType} />
                <DsfinvkCardProcessDataItem title="ProcessData" data={data?.processData} />
                <DsfinvkCardItem title="Signatur" content={data?.signature} />
                <DsfinvkCardItem title="Public-Key" content={data?.publicKey} />

                
                {/* <Typography color="textPrimary" variant="body2">
                    ProcessData
                </Typography>
                <Typography color="textPrimary" variant="body1">
                    {data?.processData ?? ""}
                </Typography> */}
            </CardContent>
        </Card>
    );
}