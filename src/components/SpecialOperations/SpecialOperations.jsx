import React, { useState } from 'react';
import ActionButton from '../ActionControls/ActionButton.jsx';
import SelectableButton from '../ActionControls/SelectableButton.jsx';
import DemographyModal from './DemographyModal';
import { showToast } from '../Toast/toastService.js';
import './SpecialOperations.css';

function SpecialOperations() {
    const [showDemographyModal, setShowDemographyModal] = useState(false);

    // Операции с Person
    const handleDeleteByHairColor = async (hairColor) => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_PERSON_SERVICE}/persons/hair-color/${hairColor}`,
                { method: 'DELETE' }
            );

            if (response.status === 204) {
                showToast(`Person с цветом волос ${hairColor} успешно удален`, 'success');
            } else if (response.status === 404) {
                showToast(`Не найдено Person с цветом волос ${hairColor}`, 'warning');
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
                showToast('В базе данных нет Person', 'warning');
            } else {
                const error = await response.json();
                showToast(error.message || 'Ошибка при получении данных', 'error');
            }
        } catch (error) {
            console.error(error);
            showToast('Ошибка соединения с сервером', 'error');
        }
    };

    const handleGetByNationalityLessThan = async (nationality) => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_PERSON_SERVICE}/persons/nationality-less-than/${nationality}`
            );

            if (response.ok) {
                const persons = await response.json();
                if (persons.length > 0) {
                    showToast(
                        `Найдено ${persons.length} Person с nationality < ${nationality}`,
                        'info',
                        5000
                    );
                    // Можно добавить отображение списка в модальном окне
                    console.log('Найденные persons:', persons);
                } else {
                    showToast(`Нет Person с nationality < ${nationality}`, 'info');
                }
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
            {/* Кнопка демографии выделена отдельно */}
            <div className="demography-button-wrapper">
                <button
                    className="demography-button"
                    onClick={() => setShowDemographyModal(true)}
                >
                    Демография
                </button>
            </div>

            {/* Остальные операции в ряд */}
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

                <SelectableButton
                    label="Фильтр по nationality <"
                    options={['FRANCE', 'SPAIN', 'INDIA', 'THAILAND', 'SOUTH_KOREA']}
                    onSubmit={handleGetByNationalityLessThan}
                />
            </div>

            {showDemographyModal && (
                <DemographyModal onClose={() => setShowDemographyModal(false)} />
            )}
        </div>
    );
}

export default SpecialOperations;