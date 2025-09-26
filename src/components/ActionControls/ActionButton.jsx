import React from 'react';
import './ActionButton.css';

function ActionButton({ label, onClick }) {
    return (
        <button className="action-button" onClick={onClick}>
            {label}
        </button>
    );
}

export default ActionButton;
