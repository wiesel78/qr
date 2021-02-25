import * as React from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from "react-router-dom";
import { toggleTheme, useStateSelector } from '../../store/reducers';
import { Sidebar, TopBar } from './';

export const HeaderView = ({}) => {

    const path = useLocation().pathname;
    const themeSelectore = useStateSelector(state => state.theme);
    const dispatch = useDispatch();
    const changeThemeHandler: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void = event => {
        dispatch(toggleTheme());
    };

    const [sidebarVisibility, setSidebarVisibility] = React.useState(false);

    const toggleSidebar = (open: boolean) => {
        setSidebarVisibility(open);
    };

    return (
        <div>
            <TopBar title={path}
                onMenuClick={() => toggleSidebar(!sidebarVisibility)}
                onThemeClick={changeThemeHandler}
                themeType={themeSelectore.theme.palette.type} />
            <Sidebar 
                open={sidebarVisibility} 
                onClose={() => toggleSidebar(false)} 
                variant="permanent"
            />
        </div>
    );
};