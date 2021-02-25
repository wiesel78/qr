import * as React from 'react';
import { AppBar, Toolbar, Typography, IconButton } from "@material-ui/core";
import { ControlCamera, Menu } from '@material-ui/icons';
import { useCurrentCode } from '../../store';

export type TopBarProps = {
    onMenuClick : (e:React.MouseEvent<HTMLElement, MouseEvent>) => void;
    onThemeClick : (e:React.MouseEvent<HTMLElement, MouseEvent>) => void;
    title : string;
    themeType : string;
}


export const TopBar = (props: TopBarProps) => {
    
    const [code, setCode] = useCurrentCode();
    

    return (
        <AppBar position="static">
            <Toolbar style={{ display: "flex" }}>
                <IconButton aria-label="Open menu" onClick={(e) => props.onMenuClick(e)} color="inherit">
                    <Menu />
                </IconButton>

                <Typography variant="h6" style={{flexGrow:1}}>
                    QR-Scanner
                </Typography>


                {code && (
                    <IconButton aria-label="Scan next QR-Code" onClick={() => setCode(null)} color="inherit">
                        <ControlCamera />
                    </IconButton>
                )}
            </Toolbar>
        </AppBar>
    );
}