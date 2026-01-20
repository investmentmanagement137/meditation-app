import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, LayoutDashboard, Sparkles } from 'lucide-react';

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
                    <span className="nav-label">Dash</span>
                </NavLink>

                <NavLink
                    to="/my-ai"
                    className={({ isActive }) =>
                        `nav-item ${isActive ? 'active' : ''}`
                    }
                >
                    <Sparkles size={24} />
                    <span className="nav-label">My AI</span>
                </NavLink>
            </div>
        </nav>
    );
};

export default BottomNavigation;
