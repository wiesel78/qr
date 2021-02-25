import * as React from "react";
import { Drawer, List, ListItem, ListItemIcon, ListItemText, ListSubheader } from "@material-ui/core";
import { MoveToInbox } from '@material-ui/icons';
import { NavLink } from "react-router-dom";
import { useCodes } from "../../store";

export type SidebarProps = {
    onClose : any;
    open : boolean | undefined;
    variant : string;
}

export const Sidebar = ({ onClose, open, variant }: SidebarProps) => {

    const [codes] = useCodes();

    return (
        <Drawer anchor="left" open={open} onClose={onClose} >
            <List 
                style={{ width: "250px" }} 
                subheader={
                    <ListSubheader component="div" id="history-subheader">
                        History
                    </ListSubheader>
                }>
                {codes.map((code, index) => (
                    <ListItem component="a" key={code + index} href={code} target="_blank">
                        <ListItemText primary={code} primaryTypographyProps={{ color: "textPrimary" }} />
                    </ListItem>
                ))}
            </List>
        </Drawer>
    );
};