import { InputLabel } from "@material-ui/core";
import { FormControl } from "@material-ui/core";
import { Select } from "@material-ui/core";
import { FormHelperText } from "@material-ui/core";
import { MenuItem } from "@material-ui/core";
import { List, ListItem, Slider, Typography } from "@material-ui/core";
import * as React from "react";
import styled from "styled-components";
import { BarcodeDetector, getBarcode } from "./utils";

declare global {
    interface Window {
        BarcodeDetector: BarcodeDetector;
    }
}

// async function getScanningDevices(){
//     const deviceItems = await navigator.mediaDevices.enumerateDevices();

//     const videoDevices = deviceItems.filter((x) => x.kind === "videoinput" && !(x.label?.includes("front")));



//     return videoDevices;
// }


const ContainerDiv = styled.div`
    width: calc(min(75%, 500px));
    margin-top: calc(min(10%, 12vw));
    margin-bottom: 24px;
`;

export interface BarcodeDetectionProps {
    className?: string;
    code: string | null;
    onChangeCode(code: string | null): void;
}

export function BarcodeDetection(props: BarcodeDetectionProps) {
    const { className, code, onChangeCode } = props;

    const videoRef = React.useRef<HTMLVideoElement>(null);
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const [devices, setDevices] = React.useState<MediaDeviceInfo[]>([]);
    const [selectedDevice, setSelectedDevice] = React.useState<string>("");
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

        const height = (canvasRef.current.height =
            videoRef.current.videoHeight);
        const width = (canvasRef.current.width = videoRef.current.videoWidth);

        const context = canvasRef.current.getContext("2d");
        if (!context) return;

        context.drawImage(videoRef.current, 0, 0, width, height);
        const imageData = context.getImageData(0, 0, width, height);
        const barcode = await getBarcode(imageData);

        if (barcode) onChangeCode(barcode);
    };

    const loadDevices = async () => {
        const deviceItems = await navigator.mediaDevices.enumerateDevices();

        console.log(deviceItems);

        setDevices(deviceItems.filter((x) => x.kind === "videoinput"));
    }

    const handleUserMedia = async (videoConstraint : MediaTrackConstraints ) => {
        if (!videoRef.current) return;

        try {

            const mediaStream = videoRef.current?.srcObject as MediaStream;
            if(mediaStream){
                mediaStream.getTracks().forEach(track => {
                    console.log("stop stream ", mediaStream, " and track ", track);
                    track.stop();
                });
                videoRef.current.pause();
            }

            const constraint = {
                video: videoConstraint
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraint);

            await gotStream(stream);
        }catch(e){
            console.log(e);
        }
    };

    const gotStream = async (stream : MediaStream) => {
        if (!videoRef.current) return;        

        console.log("play stream ", stream);

        videoRef.current.srcObject = stream;
        videoRef.current.play();

        setHelpText("Scannen Sie einen QR-Code");
    }

    const handleDeviceChange = (event: React.ChangeEvent<{name?: string | undefined; value: unknown;}>) => {
        const id = event.target.value as string;
        setSelectedDevice(id);

        if(id) {
            navigator.mediaDevices.enumerateDevices().then(devices => {

                const foundedItem = devices.find(x => x.deviceId === id);
                console.log("selected deviceId ", foundedItem, " and possible devices ", devices);
                handleUserMedia({deviceId: {exact : foundedItem?.deviceId}});
            });
        }
           
    }

    React.useEffect(() => {
        loadDevices();
        handleUserMedia({facingMode : "environment"});
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
            <FormControl>
                <InputLabel shrink >
                    Kamera
                </InputLabel>
                <Select
                    labelId="demo-simple-select-placeholder-label-label"
                    id="demo-simple-select-placeholder-label"
                    displayEmpty
                    value={selectedDevice}
                    onChange={(evt) => handleDeviceChange(evt)}
                >
                    <MenuItem value="">
                        None
                    </MenuItem>
                    {devices.map((device, index) => (
                        <MenuItem key={device.deviceId || `Camera ${index}`} value={device.deviceId || `Camera ${index}`}>
                            {device.label || `Camera ${index}`}
                        </MenuItem>
                    ))}
                </Select>
                <FormHelperText>Wählen Sie die gewünschte Kamera aus</FormHelperText>
            </FormControl>

            <ContainerDiv className={className}>
                <canvas
                    ref={canvasRef}
                    style={{ width: "100%", display: code ? "block" : "none" }}
                />
                <video
                    ref={videoRef}
                    style={{ width: "100%", display: code ? "none" : "block" }}
                />
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
                ) : (
                    helpText
                )}
            </Typography>
        </>
    );
}
