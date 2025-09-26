import React, { useState } from 'react';
import OptionModal from './OptionModal';
import { showToast } from '../Toast/toastService.js';
import './SelectableButton.css';

function SelectableButton({ label, options, onSubmit }) {
    const [isModalOpen, setModalOpen] = useState(false);

    const toggleModal = () => {
        setModalOpen(!isModalOpen);
    };

    const handleOptionSelect = async (option) => {
        setModalOpen(false);
        try {
            await onSubmit(option);
        } catch (error) {
            console.error(error);
            showToast(`Произошла ошибка: ${error.message}`, 'error');
        }
    };

    return (
        <div className="selectable-button-container">
            <button className="selectable-button" onClick={toggleModal}>
                {label}
            </button>
            {isModalOpen && <OptionModal options={options} onSelect={handleOptionSelect} onClose={toggleModal} />}
        </div>
    );
}

export default SelectableButton;