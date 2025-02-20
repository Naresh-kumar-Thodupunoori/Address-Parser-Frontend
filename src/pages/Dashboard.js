//frontend/src/pages/Dashboard.js
import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import SocietyTable from '../components/SocietyTable';
import { checkServiceability } from '../services/api';
import { saveAddressHistory, getAddressHistory, deleteAllAddressHistory } from '../services/firestore';
import './Dashboard.css';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '8px',
  marginTop: '20px',
  marginBottom: '20px'
};

const center = {
  lat: 12.9716,
  lng: 77.5946
};

const Sidebar = ({ activeSection, setActiveSection, user, addressHistory, handleLogout }) => {
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

const AddressForm = ({ onResult, isLoaded }) => {
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
    
    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
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
      
      // Save the input data with the result
      const resultWithInput = {
        ...result,
        inputData: {
          address,
          latitude: markerPosition.lat,
          longitude: markerPosition.lng
        }
      };
      
      if (typeof onResult === 'function') {
        onResult(resultWithInput);
      }
      
      // Only clear form if the API call was successful
      if (result && !result.error) {
        setAddress('');
        setLatitude('');
        setLongitude('');
        setMarkerPosition(null);
      }
    } catch (error) {
      console.error('Error checking serviceability:', error);
      alert('Error checking address. Please try again.');
    }
    setLoading(false);
  };

  if (!isLoaded) return <div>Loading map...</div>;

  return (
    <div className="address-form">
      <h2 className="form-title">Enter Address Details</h2>
      <form onSubmit={handleSubmit} className="form-content">
        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter your address"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Coordinates</label>
          <div className="coordinates-group">
            <input
              type="text"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              placeholder="Enter latitude"
              required
            />
            <input
              type="text"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              placeholder="Enter longitude"
              required
            />
          </div>
        </div>

        <div className="map-container">
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={markerPosition || center}
            zoom={12}
            onClick={handleMapClick}
          >
            {markerPosition && (
              <Marker position={markerPosition} />
            )}
          </GoogleMap>
        </div>
        
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Checking...' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

// component for history entries
const HistoryEntry = ({ item }) => {
  return (
    <div className="history-entry">
      <div className="history-input-info">
        <p>Lat: {item.inputData?.latitude.toFixed(5)}, Long: {item.inputData?.longitude.toFixed(5)}</p>
        {item.inputData?.address && <p>Address: {item.inputData.address}</p>}
      </div>
      <SocietyTable data={item} />
    </div>
  );
};

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [addressHistory, setAddressHistory] = useState([]);
  const [currentResult, setCurrentResult] = useState(null);
  
  const handleLogout = () => {
    console.log("Logout clicked");
  };

  useEffect(() => {
    const fetchHistory = async () => {
      const history = await getAddressHistory();
      setAddressHistory(history);
    };
    fetchHistory();
  }, []);

  const handleAddressResult = async (result) => {
    setCurrentResult(result);
    const historyItem = { ...result, timestamp: new Date().toISOString() };
    setAddressHistory([historyItem, ...addressHistory]);
    await saveAddressHistory(historyItem);
  };

  const handleClearHistory = async () => {
    await deleteAllAddressHistory();
    setAddressHistory([]);
  };

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <div className="dashboard">
        <Sidebar 
          activeSection={activeSection} 
          setActiveSection={setActiveSection} 
          user={{ email: "test123@gmail.com" }} 
          addressHistory={addressHistory} 
          handleLogout={handleLogout} 
        />
        <main className="main-content">
          <div className="content-header">
            <h2 className="page-title">
              {activeSection === "dashboard" ? "Address Lookup" : "History"}
            </h2>
            {activeSection === "history" && addressHistory.length > 0 && (
              <button onClick={handleClearHistory} className="clear-button">
                <span className="button-icon">🗑️</span> Delete All
              </button>
            )}
          </div>
          <div className="content-body">
            {activeSection === "dashboard" ? (
              <>
                <AddressForm onResult={handleAddressResult} isLoaded={true} />
                {currentResult && <SocietyTable data={currentResult} />}
              </>
            ) : (
              addressHistory.length > 0 ? (
                <div className="history-list">
                  {addressHistory.map((item) => (
                    <HistoryEntry key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <span className="empty-icon">📜</span>
                  <p>No lookup history available</p>
                </div>
              )
            )}
          </div>
        </main>
      </div>
    </LoadScript>
  );
};

export default Dashboard;