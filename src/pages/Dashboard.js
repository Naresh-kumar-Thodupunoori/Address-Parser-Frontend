import React, { useState, useEffect } from "react";
import { auth } from "../firebaseConfig";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import AddressForm from "../components/AddressForm";
import SocietyTable from "../components/SocietyTable";
import "./Dashboard.css";

const Dashboard = () => {
    const navigate = useNavigate();
    const [parsedAddresses, setParsedAddresses] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser) {
                navigate("/login");
            } else {
                setUser(currentUser);
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    const addParsedAddress = (newData) => {
        setParsedAddresses((prevData) => [...prevData, newData]);
    };

    const handleLogout = async () => {
        await signOut(auth);
        localStorage.removeItem("auth");
        navigate("/login");
    };

    if (!user) return <h2>Loading...</h2>;

    return (
        <div className="dashboard-container">
            <div className="dashboard-card">
                <button className="logout-button" onClick={handleLogout}>
                    Logout
                </button>
                <h1 className="dashboard-title">Welcome, {user.email}!</h1>
                <AddressForm setParsedData={addParsedAddress} />
                <SocietyTable data={parsedAddresses} />
            </div>
        </div>
    );
};

export default Dashboard;
