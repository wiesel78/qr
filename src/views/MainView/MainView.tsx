import * as React from "react";
import jsQR from "jsqr";
import styled from "styled-components";
import { Typography } from "@material-ui/core";
import { setCodes, useCodes, useCurrentCode } from "../../store";

const ContainerDiv = styled.div`
    width:calc( min(75%, 500px) );
    margin-top:calc( min(10%,12vw) );
    margin-bottom: 24px;
`;

export const MainView = () => {
    
    const [code, setCode] = useCurrentCode();
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const [checkInterval, setCheckInterval] = React.useState<NodeJS.Timeout|null>(null);
    const [helpText, setHelpText] = React.useState<string>("");

    const checkForQrCode = () => {
        
        if (
            !canvasRef.current || !videoRef.current || 
            videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA
        ) {
            return;
        } 
        
        const height = canvasRef.current.height = videoRef.current.videoHeight;
        const width = canvasRef.current.width = videoRef.current.videoWidth;
        
        const context = canvasRef.current.getContext('2d');
        if(!context) return;

        context.drawImage(videoRef.current, 0, 0, width, height);
        const { data } = context.getImageData(0, 0, width, height);
        const code = jsQR(data, width, height);
        
        if (code && code.data.length > 1) {
            setCode(code.data);
        }
    }

    const handleUserMedia = async () => {
        if(!videoRef.current)
            return;

        const stream = await navigator
            .mediaDevices.getUserMedia({
                video: {
                    facingMode: 'environment' 
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
        if(!code) {
            const interv = setInterval(() => checkForQrCode(), 250);
            setCheckInterval(interv);
            
            return () => {
                if(checkInterval) clearInterval(checkInterval);
            };
        }
        if(!checkInterval) return;

        clearInterval(checkInterval);

        return () => {};
    }, [code]);

    return (
        <div style={{display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center"}}>
            <ContainerDiv style={{display:code ? "none" : "block"}}>
                <video ref={videoRef} style={{width:"100%"}} />
            </ContainerDiv>

            <Typography color="textPrimary" style={{display:code ? "none" : "block"}}>
                {helpText}
            </Typography>

            <ContainerDiv style={{display:code ? "block" : "none"}}>
                <canvas ref={canvasRef} style={{width:"100%"}}/>
            </ContainerDiv>

            <Typography color="textPrimary" style={{display:code ? "block" : "none"}}>
                <a href={code ?? ""} target="_blank" style={{color:"cornflowerblue"}}>{code}</a>
            </Typography>
        </div>
    );
};
