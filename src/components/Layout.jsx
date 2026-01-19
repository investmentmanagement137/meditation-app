import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNavigation from './BottomNavigation';

const Layout = () => {
    return (
        <div className="main-layout">
            <div className="content-area">
                <Outlet />
            </div>
            <BottomNavigation />
        </div>
    );
};

export default Layout;
