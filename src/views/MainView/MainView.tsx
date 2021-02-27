import * as React from "react";
import { useCurrentCode } from "../../store";
import { BarcodeDetection } from "../../components";


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
        </div>
    );
};
