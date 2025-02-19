//frontend/src/components/Sidebar.js
import React from 'react';
import { auth } from "../firebaseConfig";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import '../components/Sidebar.css';

const Sidebar = ({ activeSection, setActiveSection, user, addressHistory }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/login");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <div className="app-logo">📍</div>
                <h1 className="app-name">Address Lookup</h1>
            </div>
            
            <nav className="sidebar-nav">
                <button 
                    className={`nav-item ${activeSection === "dashboard" ? "active" : ""}`}
                    onClick={() => setActiveSection("dashboard")}
                >
                    <span className="nav-icon">🏠</span>
                    Dashboard
                </button>
                <button 
                    className={`nav-item ${activeSection === "history" ? "active" : ""}`}
                    onClick={() => setActiveSection("history")}
                >
                    <span className="nav-icon">📜</span>
                    History
                    {addressHistory.length > 0 && (
                        <span className="history-badge">{addressHistory.length}</span>
                    )}
                </button>
            </nav>

            <div className="sidebar-footer">
                <div className="user-info">
                    <span className="user-avatar">👤</span>
                    <span className="user-email">{user?.email}</span>
                </div>
                <button onClick={handleLogout} className="logout-button">
                    <span className="nav-icon">🚪</span>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;