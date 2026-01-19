import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, LayoutDashboard } from 'lucide-react';

const BottomNavigation = () => {
    return (
        <nav className="bottom-navigation">
            <div className="nav-container">
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        `nav-item ${isActive ? 'active' : ''}`
                    }
                >
                    <Home size={24} />
                    <span className="nav-label">Home</span>
                </NavLink>

                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        `nav-item ${isActive ? 'active' : ''}`
                    }
                >
                    <LayoutDashboard size={24} />
                    <span className="nav-label">Dashboard</span>
                </NavLink>
            </div>
        </nav>
    );
};

export default BottomNavigation;
