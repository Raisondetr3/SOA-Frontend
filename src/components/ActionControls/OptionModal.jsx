import React from 'react';
import arrowDown from '../../assets/arrow-down.svg';
import OptionItem from './OptionItem';
import './OptionModal.css';

function OptionModal({ options, onClose, onSelect }) {
    return (
        <div className="option-modal">
            <div className="option-modal-header">
                <span>Выберите значение</span>
                <img
                    src={arrowDown}
                    alt="Close"
                    onClick={onClose}
                />
            </div>
            <div className="option-modal-content">
                {options.map((option, index) => (
                    <OptionItem key={index} label={option} onClick={() => onSelect(option)} />
                ))}
            </div>
        </div>
    );
}

export default OptionModal;
