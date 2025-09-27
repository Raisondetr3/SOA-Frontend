import React, { useState } from 'react';
import ActionButton from '../ActionControls/ActionButton.jsx';
import SelectableButton from '../ActionControls/SelectableButton.jsx';
import DemographyModal from './DemographyModal';
import { showToast } from '../Toast/toastService.js';
import './SpecialOperations.css';

function SpecialOperations() {
    const [showDemographyModal, setShowDemographyModal] = useState(false);

    const handleDeleteByHairColor = async (hairColor) => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_PERSON_SERVICE}/persons/hair-color/${hairColor}`,
                { method: 'DELETE' }
            );

            if (response.status === 204) {
                showToast(`Person с цветом волос ${hairColor} успешно удален`, 'success');
            } else if (response.status === 404) {
                showToast(`Не найден Person с цветом волос ${hairColor}`, 'warning');
            } else {
                const error = await response.json();
                showToast(error.message || 'Ошибка при удалении', 'error');
            }
        } catch (error) {
            console.error(error);
            showToast('Ошибка соединения с сервером', 'error');
        }
    };

    const handleGetMaxName = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_PERSON_SERVICE}/persons/max-name`);

            if (response.ok) {
                const person = await response.json();
                showToast(
                    `Person с максимальным именем: ${person.name} (ID: ${person.id})`,
                    'info',
                    5000
                );
            } else if (response.status === 404) {
                showToast('Не нашлось ни 1 Person', 'warning');
            } else {
                const error = await response.json();
                showToast(error.message || 'Ошибка при получении данных', 'error');
            }
        } catch (error) {
            console.error(error);
            showToast('Ошибка соединения с сервером', 'error');
        }
    };

    return (
        <div className="special-operations-container">
            <div className="demography-button-wrapper">
                <button
                    className="demography-button"
                    onClick={() => setShowDemographyModal(true)}
                >
                    Демография
                </button>
            </div>

            <div className="operations-row">
                <SelectableButton
                    label="Удалить по цвету волос"
                    options={['GREEN', 'BLUE', 'ORANGE', 'BROWN']}
                    onSubmit={handleDeleteByHairColor}
                />

                <ActionButton
                    label="Person с максимальным именем"
                    onClick={handleGetMaxName}
                />
            </div>

            {showDemographyModal && (
                <DemographyModal onClose={() => setShowDemographyModal(false)} />
            )}
        </div>
    );
}

export default SpecialOperations;