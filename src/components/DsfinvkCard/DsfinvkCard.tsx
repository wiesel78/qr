import { Box, Card, CardContent, CardHeader, CircularProgress, Typography } from '@material-ui/core';
import { Done, Error } from '@material-ui/icons';
import * as React from 'react';
import styled from 'styled-components';
import { DsfinvkData, DsfinvkProcessData, DsfinvkProcessDataVat, getDsfinvkData, isValidDsfinvkSignature } from './dsfinvk';

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

            {!!data?.vat?.vat1 && <DsfinvkCardProcessDataSubItem title="Brutto (Vat1 19%)"   data={data?.vat?.vat1.toFixed(2)} />}
            {!!data?.vat?.vat2 && <DsfinvkCardProcessDataSubItem title="Brutto (Vat2 7%)"    data={data?.vat?.vat2.toFixed(2)} />}
            {!!data?.vat?.vat3 && <DsfinvkCardProcessDataSubItem title="Brutto (Vat3 10.7%)" data={data?.vat?.vat3.toFixed(2)} />}
            {!!data?.vat?.vat4 && <DsfinvkCardProcessDataSubItem title="Brutto (Vat4 5.5%)"  data={data?.vat?.vat4.toFixed(2)} />}
            {!!data?.vat?.vat5 && <DsfinvkCardProcessDataSubItem title="Brutto (Vat5 0%)"    data={data?.vat?.vat5.toFixed(2)} />}
            
            <Box marginBottom={1}>
                <Typography color="textPrimary" variant="subtitle1">
                    Zahlungen
                </Typography>
                {data?.payment.map(payment => (
                    <Typography key={payment.rawData} color="textPrimary" variant="body1" component="p" style={{wordWrap:"break-word", fontFamily:"monospace"}}>
                        <span style={{width:"120px", marginRight:"16px"}}>{payment.type}</span> 
                        <span>{payment.total.toFixed(2)} </span>  
                        <span> {payment.currency ?? "EUR"}</span> 
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

    // const [isValid, setIsValid] = React.useState<boolean|undefined>(undefined);

    const data = getDsfinvkData(content ?? "");

    // const handleValidation = async () => {
    //     const result = await isValidDsfinvkSignature(content);

    //     setIsValid(result);
    // }

    // React.useEffect(() => {
    //     if(!content){
    //         setIsValid(undefined);
    //         return;
    //     }
        
    //     handleValidation();
    // }, [content]);

    return (
        <Card>
            <CardHeader title="Belegsignatur" subheader="DSFinV-K Signaturdaten" />
            <CardContent>
                {/* <Box>
                    {isValid === undefined ? (
                        <CircularProgress />
                    ) : (
                        isValid ? (
                            <Done />
                        ) : (
                            <Error />
                        )
                    )}
                </Box> */}
                <DsfinvkCardItem title="Client-ID" content={data?.clientId} />
                <DsfinvkCardItem title="Transaktionsnummer" content={data?.transactionNumber.toString()} />
                <DsfinvkCardItem title="Signaturzähler" content={data?.signatureCounter.toString()} />
                <DsfinvkCardItem title="Startzeit" content={`${data?.startTime.toLocaleTimeString()} ${data?.startTime.toLocaleDateString()}`} />
                <DsfinvkCardItem title="Endzeit" content={`${data?.logTime.toLocaleTimeString()} ${data?.logTime.toLocaleDateString()}`} />
                <DsfinvkCardItem title="Signatur-Algorithmus" content={data?.sigAlg} />
                <DsfinvkCardItem title="Zeitformat" content={data?.logTimeFormat} />
                <DsfinvkCardItem title="ProcessType" content={data?.processType} />
                <DsfinvkCardProcessDataItem title="ProcessData" data={data?.processData} />
                <DsfinvkCardItem title="Signatur" content={data?.signature} />
                <DsfinvkCardItem title="Public-Key" content={data?.publicKey} />
            </CardContent>
        </Card>
    );
}