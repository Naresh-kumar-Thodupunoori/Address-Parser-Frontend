//frontend/src/components/SocietyTable.js
import React from 'react';
import './SocietyTable.css';

const SocietyTable = ({ data }) => {
    if (!data || (!Array.isArray(data) && !data.societyName)) {
        return null;
    }

    const formattedData = Array.isArray(data) ? data : [data];
    
    return (
        <div className="society-container">
            {formattedData.map((item, index) => (
                <div key={index} className="society-card">
                    <div className="society-grid">
                        <div className="society-field">
                            <label className="field-label">
                                SOCIETY NAME
                            </label>
                            <div className="field-value">
                                {item.societyName && item.societyName !== 'Error' ? item.societyName : 'N/A'}
                            </div>
                        </div>
                        <div className="society-field">
                            <label className="field-label">
                                FLAT NUMBER
                            </label>
                            <div className="field-value">
                                {item.flat || 'N/A'}
                            </div>
                        </div>
                        <div className="society-field">
                            <label className="field-label">
                                BLOCK NAME
                            </label>
                            <div className="field-value">
                                {item.block || 'N/A'}
                            </div>
                        </div>
                    </div>
                    <div className={`status-message ${
                        item.societyName === 'Error' || !item.societyName || item.societyName === 'N/A' 
                            ? 'status-error' 
                            : 'status-success'
                    }`}>
                        {item.societyName === 'Error' || !item.societyName || item.societyName === 'Not Serviceable'
                            ? 'Sorry! This address is a bad match! 🚫'
                            : 'OOH! Congrats! Address ✓'
                        }
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SocietyTable;