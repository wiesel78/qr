import { Typography } from '@material-ui/core';
import * as React from 'react';
import styled from 'styled-components';
import { BarcodeDetector, getBarcode } from './utils';


declare global {
    interface Window {
        BarcodeDetector : BarcodeDetector
    }
}

const ContainerDiv = styled.div`
    width: calc(min(75%, 500px));
    margin-top: calc(min(10%, 12vw));
    margin-bottom: 24px;
`;

export interface BarcodeDetectionProps {
    className?: string;
    code: string | null;
    onChangeCode(code : string | null) : void;
}

export function BarcodeDetection(props : BarcodeDetectionProps) {
    const {
        className, 
        code, onChangeCode
    } = props;
    
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const [helpText, setHelpText] = React.useState("");
    const [
        checkInterval,
        setCheckInterval,
    ] = React.useState<NodeJS.Timeout | null>(null);

    const checkForQrCode = async () => {
        if (
            !canvasRef.current ||
            !videoRef.current ||
            videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA
        ) {
            return;
        }

        const height = (canvasRef.current.height = videoRef.current.videoHeight);
        const width = (canvasRef.current.width = videoRef.current.videoWidth);

        const context = canvasRef.current.getContext("2d");
        if (!context) return;

        context.drawImage(videoRef.current, 0, 0, width, height);
        const imageData = context.getImageData(0, 0, width, height);
        const barcode = await getBarcode(imageData);
        
        if(barcode)
            onChangeCode(barcode);
    };

    const handleUserMedia = async () => {
        if (!videoRef.current) return;

        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: "environment",
            },
            audio: false,
        });

        videoRef.current.srcObject = stream;
        videoRef.current.play();

        setHelpText("Scannen Sie einen QR-Code");
    };

    React.useEffect(() => {
        handleUserMedia();
    }, []);

    React.useEffect(() => {
        if (!code) {
            const interv = setInterval(() => checkForQrCode(), 250);
            setCheckInterval(interv);

            return () => {
                if (checkInterval) clearInterval(checkInterval);
            };
        }
        if (!checkInterval) return;

        clearInterval(checkInterval);

        return () => {};
    }, [code]);

    return (
        <>
            <ContainerDiv className={className}>
                <canvas ref={canvasRef} style={{ width: "100%", display : code ? "block" : "none" }} />
                <video ref={videoRef} style={{ width: "100%", display : code ? "none" : "black" }} />
            </ContainerDiv>

            <Typography
                color="textPrimary"
                style={{ display: code ? "none" : "block" }}
            >
                {code ? (
                    <a
                        href={code ?? ""}
                        target="_blank"
                        style={{ color: "cornflowerblue" }}
                    >
                        {code}
                    </a>
                ) : 
                    helpText
                }
            </Typography>
        </>
    );
}