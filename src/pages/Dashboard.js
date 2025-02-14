import React, { useState } from 'react';
import AddressForm from '../components/AddressForm';
import SocietyTable from '../components/SocietyTable';
import './Dashboard.css';

const Dashboard = () => {
    const [parsedAddresses, setParsedAddresses] = useState([]);
    
    const addParsedAddress = (newData) => {
        setParsedAddresses(prevData => [...prevData, newData]);
    };
    
    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Society Dashboard</h1>
            <AddressForm setParsedData={addParsedAddress} />
            <SocietyTable data={parsedAddresses} />
        </div>
    );
};

export default Dashboard;
