import React, { useState } from 'react';
import { showToast } from '../Toast/toastService.js';
import './DemographyModal.css';

function DemographyModal({ onClose }) {
    const [hairColorStats, setHairColorStats] = useState(null);
    const [nationalityEyeStats, setNationalityEyeStats] = useState(null);

    const [selectedHairColor, setSelectedHairColor] = useState('GREEN');
    const [selectedNationality, setSelectedNationality] = useState('FRANCE');
    const [selectedEyeColor, setSelectedEyeColor] = useState('GREEN');

    const colorOptions = ['GREEN', 'BLUE', 'ORANGE', 'BROWN'];
    const countryOptions = ['FRANCE', 'SPAIN', 'INDIA', 'THAILAND', 'SOUTH_KOREA'];

    const getHairColorPercentage = async () => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_DEMOGRAPHY_SERVICE}/demography/hair-color/${selectedHairColor}/percentage`
            );

            if (response.ok) {
                const data = await response.json();
                setHairColorStats(data);
                showToast('Статистика успешно получена', 'success');
            } else {
                const error = await response.json();
                showToast(error.message || 'Ошибка получения статистики', 'error');
            }
        } catch (error) {
            console.error(error);
            showToast('Ошибка соединения с сервером', 'error');
        }
    };

    const getNationalityEyeColorStats = async () => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_DEMOGRAPHY_SERVICE}/demography/nationality/${selectedNationality}/eye-color/${selectedEyeColor}`
            );

            if (response.ok) {
                const data = await response.json();
                setNationalityEyeStats(data);
                showToast('Статистика успешно получена', 'success');
            } else {
                const error = await response.json();
                showToast(error.message || 'Ошибка получения статистики', 'error');
            }
        } catch (error) {
            console.error(error);
            showToast('Ошибка соединения с сервером', 'error');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="demography-modal">
                <div className="modal-header">
                    <h2>Демографическая статистика</h2>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>

                <div className="modal-content">
                    {/* Статистика по цвету волос */}
                    <div className="stat-section">
                        <h3>Процент людей по цвету волос</h3>
                        <div className="control-group">
                            <select
                                value={selectedHairColor}
                                onChange={(e) => setSelectedHairColor(e.target.value)}
                                className="select-input"
                            >
                                {colorOptions.map(color => (
                                    <option key={color} value={color}>{color}</option>
                                ))}
                            </select>
                            <button
                                onClick={getHairColorPercentage}
                                className="action-button-small"
                            >
                                Получить %
                            </button>
                        </div>

                        {hairColorStats && (
                            <div className="stat-result">
                                <p><strong>Цвет волос:</strong> {hairColorStats.hairColor}</p>
                                <p><strong>Процент:</strong> {hairColorStats.percentage.toFixed(2)}%</p>
                                <p><strong>Количество:</strong> {hairColorStats.colorCount} из {hairColorStats.totalCount}</p>
                            </div>
                        )}
                    </div>

                    {/* Статистика по национальности и цвету глаз */}
                    <div className="stat-section">
                        <h3>Количество по национальности и цвету глаз</h3>
                        <div className="control-group">
                            <select
                                value={selectedNationality}
                                onChange={(e) => setSelectedNationality(e.target.value)}
                                className="select-input"
                            >
                                {countryOptions.map(country => (
                                    <option key={country} value={country}>{country}</option>
                                ))}
                            </select>
                            <select
                                value={selectedEyeColor}
                                onChange={(e) => setSelectedEyeColor(e.target.value)}
                                className="select-input"
                            >
                                {colorOptions.map(color => (
                                    <option key={color} value={color}>{color}</option>
                                ))}
                            </select>
                            <button
                                onClick={getNationalityEyeColorStats}
                                className="action-button-small"
                            >
                                Получить
                            </button>
                        </div>

                        {nationalityEyeStats && (
                            <div className="stat-result">
                                <p><strong>Национальность:</strong> {nationalityEyeStats.nationality}</p>
                                <p><strong>Цвет глаз:</strong> {nationalityEyeStats.eyeColor}</p>
                                <p><strong>Количество:</strong> {nationalityEyeStats.eyeColorCount}</p>
                                <p><strong>Всего в национальности:</strong> {nationalityEyeStats.totalNationalityCount}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DemographyModal;