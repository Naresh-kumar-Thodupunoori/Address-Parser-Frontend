//frontend/src/components/SocietyTable.js
import React from 'react';
import './SocietyTable.css';

const SocietyTable = ({ data }) => {
    const formattedData = Array.isArray(data) ? data : [data];
    
    return (
        <div className="table-container">
            <table className="styled-table">
                <thead>
                    <tr>
                        <th>Society Name</th>
                        <th>Block</th>
                        <th>Flat</th>
                    </tr>
                </thead>
                <tbody>
                    {formattedData.length > 0 && formattedData[0] ? (
                        formattedData.map((item, index) => (
                            <tr key={index}>
                                <td>{item.societyName}</td>
                                <td>{item.block || 'N/A'}</td>
                                <td>{item.flat || 'N/A'}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">No data available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default SocietyTable;
