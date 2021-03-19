import * as React from "react";
import { useCurrentCode } from "../../store";
import { BarcodeDetection } from "../../components";
import { Link } from "@material-ui/core";
import { QrDataView } from "../QrDataView/QrDataView";


export const MainView = () => {
    const [code, setCode] = useCurrentCode();

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <BarcodeDetection code={code} onChangeCode={setCode} />

            <QrDataView />            

        </div>
    );
};
