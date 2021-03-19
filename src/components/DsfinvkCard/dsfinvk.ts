export type DsfinvkProcessType = 
    "Kassenbeleg-V1" | 
    "Bestellung-V1" | 
    "SonstigerVorgang";

export type DsfinvkReceiptType = 
    "Beleg" | 
    "AVTransfer" | 
    "AVBestellung" | 
    "AVTraining" | 
    "AVBelegstorno" | 
    "AVBelegabbruch" | 
    "AVSachbezug" | 
    "AVRechnung" | 
    "AVSonstige" ;

export type DsfinvkPaymentType = "Bar" | "Unbar";

export type TseSigAlgo = 
    "ecdsa-plain-SHA224" |
    "ecdsa-plain-SHA256" |
    "ecdsa-plain-SHA384" |
    "ecdsa-plain-SHA512" |
    "ecdsa-plain-SHA3_224" |
    "ecdsa-plain-SHA3_256" |
    "ecdsa-plain-SHA3_384" |
    "ecdsa-plain-SHA3_512" |
    "ecsdsa-plain-SHA224" |
    "ecsdsa-plain-SHA256" |
    "ecsdsa-plain-SHA384" |
    "ecsdsa-plain-SHA512" |
    "ecsdsa-plain-SHA3_224" |
    "ecsdsa-plain-SHA3_256" |
    "ecsdsa-plain-SHA3_384" |
    "ecsdsa-plain-SHA3_512" ;


export interface DsfinvkQrCodeData {
    rawData : string;

    version : "V0";
    clientId : string;
    processType : DsfinvkProcessType;
    processData : string;
    transactionNumber : number;
    signatureCounter : number;
    startTime : string;
    logTime : string;
    sigAlg : string;
    logTimeFormat : string;
    signature : string;
    publicKey : string;
}

export interface DsfinvkData {
    rawData : string;

    version : "V0";
    clientId : string;
    processType : DsfinvkProcessType;
    processData : DsfinvkProcessData;
    transactionNumber : number;
    signatureCounter : number;
    startTime : Date;
    logTime : Date;
    sigAlg : string;
    logTimeFormat : string;
    signature : string;
    publicKey : string;
}

export interface DsfinvkProcessData {
    rawData : string;
    type : DsfinvkReceiptType ;
    vat : DsfinvkProcessDataVat ;
    payment : DsfinvkPaymentItem[];
}

export interface DsfinvkProcessDataVat {
    vat1 : number;
    vat2 : number;
    vat3 : number;
    vat4 : number;
    vat5 : number;
}

export interface DsfinvkPaymentItem {
    rawData : string;
    total : number;
    type : DsfinvkPaymentType;
    currency : string;
}

export const DsfinvkRegex = /(V0);([A-Za-z0-9'()+,-./:=?]+);(Kassenbeleg-V1);(.*);(\d+);(\d+);(.*);(.*);(.*);(.*);(.*);(.*)/;

export function isDsfinvkData(text : string){
    return text.match(DsfinvkRegex);
}

export function getDsfinvkQrData(text : string) : DsfinvkQrCodeData | undefined {
    const data = text.match(DsfinvkRegex);
    if(!data)
        return undefined;

    return {
        rawData : text,

        version : "V0",
        clientId : data[2],
        processType : "Kassenbeleg-V1",
        processData : data[4],
        transactionNumber : parseInt(data[5]),
        signatureCounter : parseInt(data[6]),
        startTime : data[7],
        logTime : data[8],
        sigAlg : data[9],
        logTimeFormat : data[10],
        signature : data[11],
        publicKey : data[12],
    };
}

export function getDsfinvkData(data : string | DsfinvkQrCodeData | undefined) : DsfinvkData | undefined {
    if(!data)
        return undefined;

    if(typeof(data) === "string")
        return getDsfinvkData(getDsfinvkQrData(data));

    return {
        rawData : data.rawData,

        version : "V0",
        clientId : data.clientId,
        processType : data.processType,
        processData : getDsfinvkProcessData(data.processData),
        transactionNumber : data.transactionNumber,
        signatureCounter : data.signatureCounter,
        startTime : new Date(data.startTime),
        logTime : new Date(data.logTime),
        sigAlg : (data.sigAlg as TseSigAlgo) ?? "ecdsa-plain-SHA384",
        logTimeFormat : data.logTimeFormat,
        signature : data.signature,
        publicKey : data.publicKey,
    };
}

export const DsfinvkProcessDataRegex = /(\w+)\^(\d+\.\d\d)_(\d+\.\d\d)_(\d+\.\d\d)_(\d+\.\d\d)_(\d+\.\d\d)\^(.*)/;

export function getDsfinvkProcessData(data : string) : DsfinvkProcessData {
    const result = data.match(DsfinvkProcessDataRegex);
    if(!result)
        return {
            rawData : data,
            type : "Beleg",
            vat : { vat1 : 0.0, vat2 : 0.0, vat3 : 0.0, vat4 : 0.0, vat5 : 0.0},
            payment : [{rawData: "0.00:Bar",type : "Bar", total : 0.0, currency : "EUR"}]
        };

    return {
        rawData : data,
        type : result[1] as DsfinvkReceiptType,
        vat : {
            vat1 : parseFloat(result[2]),
            vat2 : parseFloat(result[3]),
            vat3 : parseFloat(result[4]),
            vat4 : parseFloat(result[5]),
            vat5 : parseFloat(result[6]),
        },
        payment : getDsfinvkPaymentData(result[7]),
    }
}

export function getDsfinvkPaymentData(data : string) : DsfinvkPaymentItem[] {
    if(!data)
        return [];
    
    return data.split("_").map(getDsfinvkPaymentItem);
}

export const DsfinvkPaymentItemRegex = /(\d+\.\d\d):(Bar|Unbar):?(\w\w\w)?/;

export function getDsfinvkPaymentItem(data : string) : DsfinvkPaymentItem {
    const result = data.match(DsfinvkPaymentItemRegex);
    if(!result)
        return {rawData : data, total : 0.0, type : "Bar", currency : "EUR"};
    
    return {
        rawData : data,
        total : parseFloat(result[1]),
        type : result[2] === "Unbar" ? "Unbar" : "Bar",
        currency : result.length > 3 ? result[3] : "EUR"
    };
}



export async function isValidDsfinvkSignature(data : string | DsfinvkData | DsfinvkQrCodeData | undefined) : Promise<boolean> {
    if(!data)
        return false;

    if(typeof(data) === "string")
        return await isValidDsfinvkSignature(getDsfinvkData(data));

    const processData = typeof(data.processData) === "string" 
        ? data.processData 
        : data.processData.rawData;

    const {signature, publicKey, sigAlg} = data;

    const enc = new TextEncoder();
    const encoded = enc.encode(processData);

    const pub1 = base64ToArrayBuffer(publicKey)

    try{
        const key = await window.crypto.subtle.importKey(
            "raw", 
            pub1,
            { name : "ECDSA", namedCurve : "P-384"},
            false,
            []);

        const result = await window.crypto.subtle.verify(
            {
                name : "ECDSA",
                hash : { name : "SHA-384"}
            },
            key,
            base64ToArrayBuffer(signature),
            encoded
        );
    
        return result;
    }catch(e){
        console.log(e);
        return false;
    }
}

function base64ToArrayBuffer(base64 : string) {
    const bin = window.atob(base64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0, strLen = bin.length; i < strLen; i++) {
        bytes[i] = bin.charCodeAt(i);
    }
    return bytes;
}