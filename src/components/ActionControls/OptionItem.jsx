import React from 'react';
import './OptionItem.css';

function OptionItem({ label, onClick }) {
    return (
        <button className="option-item" onClick={onClick}>
            {label}
        </button>
    );
}

export default OptionItem;
