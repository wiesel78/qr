import * as React from "react";
import { useCurrentCode } from "../../store";
import { BarcodeDetection, DsfinvkCard, isDsfinvkData } from "../../components";
import { Container, Link } from "@material-ui/core";


export const QrDataView = () => {
    const [code, setCode] = useCurrentCode();    

    return (
        <Container
            maxWidth="sm"
            style={{
                display: "flex",
                flexDirection: "column",
            }}
        >
            {code?.match(/(https?:\/\/[^\s]+)/) && (
                <Link href={code ?? ""} target="_blank" color="textPrimary">
                    {code ?? ""}
                </Link>
            )}

            {isDsfinvkData(code ?? "") && (
                <DsfinvkCard content={code ?? ""}/>
            )}

        </Container>
    );
};
