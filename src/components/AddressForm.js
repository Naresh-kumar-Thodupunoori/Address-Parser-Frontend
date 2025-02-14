import React, { useState } from 'react';
import { checkServiceability } from '../services/api';

const AddressForm = ({ setParsedData }) => {
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [address, setAddress] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await checkServiceability({ latitude, longitude, address });
        setParsedData(result);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Latitude" value={latitude} onChange={(e) => setLatitude(e.target.value)} required />
            <input type="text" placeholder="Longitude" value={longitude} onChange={(e) => setLongitude(e.target.value)} required />
            <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
            <button type="submit">Check</button>
        </form>
    );
};

export default AddressForm;
