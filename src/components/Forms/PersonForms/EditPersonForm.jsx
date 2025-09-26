import React, { useState, useEffect } from 'react';
import { showToast } from '../../Toast/toastService.js';
import '../Form.css';

const EditPersonForm = ({ personData, onClose, onSubmit }) => {
    const [person, setPerson] = useState({
        name: '',
        coordinates: { x: '', y: '' },
        height: '',
        weight: '',
        hairColor: '',
        eyeColor: '',
        nationality: '',
        location: { x: '', y: '', z: '', name: '' },
        hasLocation: false
    });

    const [errors, setErrors] = useState({});

    const colorOptions = ['GREEN', 'BLUE', 'ORANGE', 'BROWN'];
    const countryOptions = ['FRANCE', 'SPAIN', 'INDIA', 'THAILAND', 'SOUTH_KOREA'];

    useEffect(() => {
        if (personData) {
            setPerson({
                name: personData.name || '',
                coordinates: {
                    x: personData.coordinates?.x !== undefined ? personData.coordinates.x : '',
                    y: personData.coordinates?.y !== undefined ? personData.coordinates.y : ''
                },
                height: personData.height || '',
                weight: personData.weight || '',
                hairColor: personData.hairColor || '',
                eyeColor: personData.eyeColor || '',
                nationality: personData.nationality || '',
                location: personData.location ? {
                    x: personData.location.x !== undefined ? personData.location.x : '',
                    y: personData.location.y !== undefined ? personData.location.y : '',
                    z: personData.location.z !== undefined ? personData.location.z : '',
                    name: personData.location.name || ''
                } : { x: '', y: '', z: '', name: '' },
                hasLocation: !!personData.location
            });
        }
    }, [personData]);

    const handleChange = (field, value) => {
        setPerson(prev => ({
            ...prev,
            [field]: value,
        }));
        validateField(field, value);
    };

    const handleCoordinatesChange = (field, value) => {
        setPerson(prev => ({
            ...prev,
            coordinates: {
                ...prev.coordinates,
                [field]: value,
            },
        }));
        validateCoordinatesField(field, value);
    };

    const handleLocationChange = (field, value) => {
        setPerson(prev => ({
            ...prev,
            location: {
                ...prev.location,
                [field]: value,
            },
        }));
        validateLocationField(field, value);
    };

    const validateField = (field, value) => {
        let errorMsg = '';
        switch (field) {
            case 'name':
                if (!value || value.trim() === '') {
                    errorMsg = 'Имя не может быть пустым';
                }
                break;
            case 'height':
                if (value !== '' && (isNaN(value) || Number(value) <= 0)) {
                    errorMsg = 'Рост должен быть больше 0';
                }
                break;
            case 'weight':
                if (value === '' || isNaN(value) || Number(value) <= 0) {
                    errorMsg = 'Вес должен быть больше 0';
                }
                break;
            case 'hairColor':
                if (!value) {
                    errorMsg = 'Цвет волос обязателен';
                }
                break;
            case 'eyeColor':
                if (!value) {
                    errorMsg = 'Цвет глаз обязателен';
                }
                break;
            case 'nationality':
                if (!value) {
                    errorMsg = 'Национальность обязательна';
                }
                break;
            default:
                break;
        }
        setErrors(prevErrors => ({
            ...prevErrors,
            [field]: errorMsg,
        }));
    };

    const validateCoordinatesField = (field, value) => {
        let errorMsg = '';
        switch (field) {
            case 'x':
                if (value === '' || isNaN(value)) {
                    errorMsg = 'X должно быть числом';
                }
                break;
            case 'y':
                if (value === '' || isNaN(value)) {
                    errorMsg = 'Y должно быть числом';
                } else if (Number(value) > 626) {
                    errorMsg = 'Y не может быть больше 626';
                }
                break;
            default:
                break;
        }
        setErrors(prevErrors => ({
            ...prevErrors,
            [`coordinates_${field}`]: errorMsg,
        }));
    };

    const validateLocationField = (field, value) => {
        let errorMsg = '';
        if (person.hasLocation) {
            switch (field) {
                case 'name':
                    if (!value || value.trim() === '') {
                        errorMsg = 'Название локации не может быть пустым';
                    }
                    break;
                case 'x':
                case 'y':
                case 'z':
                    if (value === '' || isNaN(value)) {
                        errorMsg = 'Должно быть числом';
                    }
                    break;
                default:
                    break;
            }
        }
        setErrors(prevErrors => ({
            ...prevErrors,
            [`location_${field}`]: errorMsg,
        }));
    };

    const validateAllFields = () => {
        let valid = true;
        let newErrors = {};

        if (!person.name || person.name.trim() === '') {
            newErrors.name = 'Имя не может быть пустым';
            valid = false;
        }

        if (person.coordinates.x === '' || isNaN(person.coordinates.x)) {
            newErrors.coordinates_x = 'X должно быть числом';
            valid = false;
        }

        if (person.coordinates.y === '' || isNaN(person.coordinates.y)) {
            newErrors.coordinates_y = 'Y должно быть числом';
            valid = false;
        } else if (Number(person.coordinates.y) > 626) {
            newErrors.coordinates_y = 'Y не может быть больше 626';
            valid = false;
        }

        if (person.weight === '' || isNaN(person.weight) || Number(person.weight) <= 0) {
            newErrors.weight = 'Вес должен быть больше 0';
            valid = false;
        }

        if (person.height !== '' && (isNaN(person.height) || Number(person.height) <= 0)) {
            newErrors.height = 'Рост должен быть больше 0';
            valid = false;
        }

        if (!person.hairColor) {
            newErrors.hairColor = 'Цвет волос обязателен';
            valid = false;
        }

        if (!person.eyeColor) {
            newErrors.eyeColor = 'Цвет глаз обязателен';
            valid = false;
        }

        if (!person.nationality) {
            newErrors.nationality = 'Национальность обязательна';
            valid = false;
        }

        if (person.hasLocation) {
            if (!person.location.name || person.location.name.trim() === '') {
                newErrors.location_name = 'Название локации не может быть пустым';
                valid = false;
            }
            if (person.location.x === '' || isNaN(person.location.x)) {
                newErrors.location_x = 'X локации должно быть числом';
                valid = false;
            }
            if (person.location.y === '' || isNaN(person.location.y)) {
                newErrors.location_y = 'Y локации должно быть числом';
                valid = false;
            }
            if (person.location.z === '' || isNaN(person.location.z)) {
                newErrors.location_z = 'Z локации должно быть числом';
                valid = false;
            }
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isValid = validateAllFields();
        if (!isValid) {
            showToast('Проверьте правильность заполнения полей', 'warning');
            return;
        }

        const updatedPersonData = {
            name: person.name,
            coordinates: {
                x: Number(person.coordinates.x),
                y: Number(person.coordinates.y)
            },
            height: person.height ? Number(person.height) : null,
            weight: Number(person.weight),
            hairColor: person.hairColor,
            eyeColor: person.eyeColor,
            nationality: person.nationality,
            location: person.hasLocation ? {
                x: Number(person.location.x),
                y: Number(person.location.y),
                z: Number(person.location.z),
                name: person.location.name
            } : null
        };

        try {
            const response = await fetch(`${import.meta.env.VITE_PERSON_SERVICE}/persons/${personData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedPersonData),
            });

            if (response.ok) {
                const updatedPerson = await response.json();
                showToast('Person успешно обновлен!', 'success');
                onSubmit(updatedPerson);
                onClose();
                return;
            }

            const errorData = await response.json();

            if (response.status === 404) {
                showToast('Person не найден', 'error');
                return;
            }

            if (response.status === 422) {
                if (errorData.errors && typeof errorData.errors === 'object') {
                    const firstError = Object.entries(errorData.errors)[0];
                    showToast(`${firstError[0]}: ${firstError[1]}`, 'error', 5000);
                } else {
                    showToast(errorData.message || 'Ошибка валидации', 'error', 5000);
                }
                return;
            }

            showToast('Произошла неожиданная ошибка', 'error');

        } catch (error) {
            console.error('Ошибка при обновлении Person:', error);
            showToast('Не удалось подключиться к серверу', 'error');
        }
    };

    return (
        <div className="form-overlay">
            <div className="form-container">
                <h2>Редактировать Person</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Имя: *
                        <input
                            type="text"
                            value={person.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            required
                        />
                        {errors.name && <span className="error">{errors.name}</span>}
                    </label>

                    <fieldset>
                        <legend>Координаты *</legend>
                        <label>
                            X:
                            <input
                                type="number"
                                value={person.coordinates.x}
                                onChange={(e) => handleCoordinatesChange('x', e.target.value)}
                                required
                            />
                            {errors.coordinates_x && <span className="error">{errors.coordinates_x}</span>}
                        </label>
                        <label>
                            Y (max: 626):
                            <input
                                type="number"
                                max="626"
                                value={person.coordinates.y}
                                onChange={(e) => handleCoordinatesChange('y', e.target.value)}
                                required
                            />
                            {errors.coordinates_y && <span className="error">{errors.coordinates_y}</span>}
                        </label>
                    </fieldset>

                    <label>
                        Рост:
                        <input
                            type="number"
                            min="1"
                            value={person.height}
                            onChange={(e) => handleChange('height', e.target.value)}
                        />
                        {errors.height && <span className="error">{errors.height}</span>}
                    </label>

                    <label>
                        Вес: *
                        <input
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={person.weight}
                            onChange={(e) => handleChange('weight', e.target.value)}
                            required
                        />
                        {errors.weight && <span className="error">{errors.weight}</span>}
                    </label>

                    <label>
                        Цвет волос: *
                        <select
                            value={person.hairColor}
                            onChange={(e) => handleChange('hairColor', e.target.value)}
                            required
                        >
                            <option value="">Выберите цвет волос</option>
                            {colorOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                        {errors.hairColor && <span className="error">{errors.hairColor}</span>}
                    </label>

                    <label>
                        Цвет глаз: *
                        <select
                            value={person.eyeColor}
                            onChange={(e) => handleChange('eyeColor', e.target.value)}
                            required
                        >
                            <option value="">Выберите цвет глаз</option>
                            {colorOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                        {errors.eyeColor && <span className="error">{errors.eyeColor}</span>}
                    </label>

                    <label>
                        Национальность: *
                        <select
                            value={person.nationality}
                            onChange={(e) => handleChange('nationality', e.target.value)}
                            required
                        >
                            <option value="">Выберите национальность</option>
                            {countryOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                        {errors.nationality && <span className="error">{errors.nationality}</span>}
                    </label>

                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={person.hasLocation}
                            onChange={(e) => handleChange('hasLocation', e.target.checked)}
                        />
                        Добавить локацию
                    </label>

                    {person.hasLocation && (
                        <fieldset>
                            <legend>Локация</legend>
                            <label>
                                Название: *
                                <input
                                    type="text"
                                    value={person.location.name}
                                    onChange={(e) => handleLocationChange('name', e.target.value)}
                                />
                                {errors.location_name && <span className="error">{errors.location_name}</span>}
                            </label>
                            <label>
                                X:
                                <input
                                    type="number"
                                    value={person.location.x}
                                    onChange={(e) => handleLocationChange('x', e.target.value)}
                                />
                                {errors.location_x && <span className="error">{errors.location_x}</span>}
                            </label>
                            <label>
                                Y:
                                <input
                                    type="number"
                                    step="0.01"
                                    value={person.location.y}
                                    onChange={(e) => handleLocationChange('y', e.target.value)}
                                />
                                {errors.location_y && <span className="error">{errors.location_y}</span>}
                            </label>
                            <label>
                                Z:
                                <input
                                    type="number"
                                    step="0.01"
                                    value={person.location.z}
                                    onChange={(e) => handleLocationChange('z', e.target.value)}
                                />
                                {errors.location_z && <span className="error">{errors.location_z}</span>}
                            </label>
                        </fieldset>
                    )}

                    <div className="form-buttons">
                        <button type="submit">Сохранить изменения</button>
                        <button type="button" onClick={onClose}>
                            Отмена
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPersonForm;