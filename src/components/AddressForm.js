import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import {checkServiceability} from '../services/api'
import './AddressForm.css'

const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
    lat: 12.9716,  // Default center (Bangalore)
    lng: 77.5946
};
  
const AddressForm = ({ onResult }) => {
    const [address, setAddress] = useState('');
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [markerPosition, setMarkerPosition] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleMapClick = useCallback((e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        setLatitude(lat.toFixed(6));
        setLongitude(lng.toFixed(6));
        setMarkerPosition({ lat, lng });
    }, []);

    useEffect(() => {
        const lat = parseFloat(latitude);
        const lng = parseFloat(longitude);
        
        if (!isNaN(lat) && !isNaN(lng) && 
            lat >= -90 && lat <= 90 && 
            lng >= -180 && lng <= 180) {
            setMarkerPosition({ lat, lng });
        }
    }, [latitude, longitude]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!markerPosition) {
            alert('Please enter coordinates or select a location on the map');
            return;
        }
        
        setLoading(true);
        try {
            const result = await checkServiceability({
                latitude: markerPosition.lat,
                longitude: markerPosition.lng,
                address
            });
            if (typeof onResult === 'function') {
                onResult(result);
            }
        } catch (error) {
            console.error('Error checking serviceability:', error);
        }
        setLoading(false);
    };

    return (
        <div className="address-form-container">
            <form onSubmit={handleSubmit}>
                <div>
                    <h2>Enter Address</h2>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter your address"
                        required
                    />
                </div>

                <div>
                    <h2>Enter Latitude & Longitude</h2>
                    <div>
                        <div className="input-group">
                            <span className="input-icon">📍</span>
                            <input
                                type="text"
                                value={latitude}
                                onChange={(e) => setLatitude(e.target.value)}
                                placeholder="Enter latitude"
                                required
                            />
                        </div>
                        <div className="input-group">
                            <span className="input-icon">📍</span>
                            <input
                                type="text"
                                value={longitude}
                                onChange={(e) => setLongitude(e.target.value)}
                                placeholder="Enter longitude"
                                required
                            />
                        </div>
                    </div>
                </div>

                <div style={{ 
                    height: '400px', 
                    width: '100%', 
                    borderRadius: '8px', 
                    overflow: 'hidden',
                    border: '1px solid #ddd',
                    marginTop: '1rem',
                    marginBottom: '1rem'
                }}>
                    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
                        <GoogleMap
                            mapContainerStyle={containerStyle}
                            center={markerPosition || center}
                            zoom={12}
                            onClick={handleMapClick}
                        >
                            {markerPosition && (
                                <Marker position={markerPosition} />
                            )}
                        </GoogleMap>
                    </LoadScript>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{ opacity: loading ? 0.7 : 1 }}
                >
                    {loading ? 'Checking...' : 'Submit'}
                </button>
            </form>
        </div>
    );
};

export default AddressForm;