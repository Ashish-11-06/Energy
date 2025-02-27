import React from 'react';
import '../Pages/TrackStatus.css'; // Import the CSS file for styling

const approvals = [
    { text: 'connectivity approval', status: 'green' },
    { text: 'NOC from SLDC', status: 'yellow' },
    { text: 'nodal agency registration', status: 'red' },
    { text: 'government order / approval', status: 'yellow'},
    { text: 'connectivity agreement /', status: 'yellow'},
    { text: 'Discom open access approval', status: 'yellow'},
    { text: 'wheeling banking agreement', status: 'yellow'},
    { text: 'commissioning approval', status:'yellow' },
];

const StatusApproval = () => {
    return (
        <div className="status-approval">
            <div className="header">
                <h1>Status of Approval</h1>
            </div>
            <div className="approvals">
                {approvals.map((approval, index) => (
                    <div key={index} className="approval-item">
                        <span className={`status-dot ${approval.status}`}></span>
                        <span className="approval-text">{approval.text}</span>
                        <button className="update-button">update status</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StatusApproval;