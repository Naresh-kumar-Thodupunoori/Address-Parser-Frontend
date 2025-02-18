import React, { useState, useEffect } from "react";
import { auth } from "../firebaseConfig";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import AddressForm from "../components/AddressForm";
import SocietyTable from "../components/SocietyTable";
import "./Dashboard.css";

const Dashboard = () => {
    const navigate = useNavigate();
    const [addressHistory, setAddressHistory] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser) {
                navigate("/login");
            } else {
                setUser(currentUser);
                // Load saved history from localStorage
                const savedHistory = localStorage.getItem(`addressHistory_${currentUser.uid}`);
                if (savedHistory) {
                    setAddressHistory(JSON.parse(savedHistory));
                }
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    const handleAddressResult = (result) => {
        const newHistory = [{
            ...result,
            timestamp: new Date().toISOString(),
            id: Date.now()
        }, ...addressHistory];

        setAddressHistory(newHistory);

        // Save to localStorage
        if (user) {
            localStorage.setItem(`addressHistory_${user.uid}`, JSON.stringify(newHistory));
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate("/login");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    const clearHistory = () => {
        setAddressHistory([]);
        if (user) {
            localStorage.removeItem(`addressHistory_${user.uid}`);
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-content">
                <header className="dashboard-header">
                    <h1>Address Lookup Dashboard</h1>
                    <div className="user-controls">
                        <span>{user.email}</span>
                        <button onClick={handleLogout}>Logout</button>
                    </div>
                </header>

                <main>
                    <AddressForm onResult={handleAddressResult} />
                    
                    <section className="history-section">
                        <div className="history-header">
                            <h2>Lookup History</h2>
                            {addressHistory.length > 0 && (
                                <button onClick={clearHistory}>Clear History</button>
                            )}
                        </div>
                        
                        {addressHistory.length > 0 ? (
                            <SocietyTable data={addressHistory} />
                        ) : (
                            <p className="no-history">
                                No address lookups yet. Use the form above to search for addresses.
                            </p>
                        )}
                    </section>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;