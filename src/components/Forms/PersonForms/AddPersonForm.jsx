import React, { useState } from 'react';
import { showToast } from '../../Toast/toastService.js';
import '../Form.css';

const AddPersonForm = ({ onClose, onSubmit }) => {
    const [person, setPerson] = useState({
        name: '',
        coordinates: { x: '', y: '' },
        height: '',
        weight: '',
        hairColor: '',
        eyeColor: '',
        nationality: '',
        location: { x: '', y: '', z: '', name: '' }
    });

    const [errors, setErrors] = useState({});

    const colorOptions = ['GREEN', 'BLUE', 'ORANGE', 'BROWN'];
    const countryOptions = ['FRANCE', 'SPAIN', 'INDIA', 'THAILAND', 'SOUTH_KOREA'];

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
        // Валидация только если поле заполнено
        if (value !== '') {
            switch (field) {
                case 'name':
                    // Имя локации может быть пустым
                    break;
                case 'x':
                case 'y':
                case 'z':
                    if (isNaN(value)) {
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

        // Проверка location - если хотя бы одно поле заполнено
        const hasLocationData = person.location.x !== '' || person.location.y !== '' ||
            person.location.z !== '' || person.location.name !== '';

        if (hasLocationData) {
            // Если есть данные локации, проверяем что числовые поля - числа
            if (person.location.x !== '' && isNaN(person.location.x)) {
                newErrors.location_x = 'X локации должно быть числом';
                valid = false;
            }
            if (person.location.y !== '' && isNaN(person.location.y)) {
                newErrors.location_y = 'Y локации должно быть числом';
                valid = false;
            }
            if (person.location.z !== '' && isNaN(person.location.z)) {
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

        // Определяем, есть ли данные для локации
        const hasLocationData = person.location.x !== '' || person.location.y !== '' ||
            person.location.z !== '' || person.location.name !== '';

        const personData = {
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
            location: hasLocationData ? {
                x: person.location.x !== '' ? Number(person.location.x) : null,
                y: person.location.y !== '' ? Number(person.location.y) : null,
                z: person.location.z !== '' ? Number(person.location.z) : null,
                name: person.location.name || null
            } : null
        };

        console.log('Отправляемые данные Person:', JSON.stringify(personData, null, 2));

        try {
            const response = await fetch(`${import.meta.env.VITE_PERSON_SERVICE}/persons`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(personData),
            });

            if (response.status === 201) {
                const addedPerson = await response.json();
                showToast('Person успешно добавлен!', 'success');
                onSubmit(addedPerson);
                onClose();
                return;
            }

            const errorData = await response.json();

            if (response.status === 400) {
                showToast(errorData.message || 'Неверный запрос', 'error', 5000);
                return;
            }

            if (response.status === 422) {
                if (errorData.errors && typeof errorData.errors === 'object') {
                    const firstError = Object.entries(errorData.errors)[0];
                    showToast(`${firstError[0]}: ${firstError[1]}`, 'error', 5000);
                } else if (errorData.error === 'INVALID_ENUM_VALUE') {
                    showToast('Неверное значение enum. Проверьте выбранные опции.', 'error', 5000);
                } else {
                    showToast(errorData.message || 'Ошибка валидации', 'error', 5000);
                }
                return;
            }

            showToast('Произошла неожиданная ошибка', 'error');

        } catch (error) {
            console.error('Ошибка при добавлении Person:', error);
            showToast('Не удалось подключиться к серверу', 'error');
        }
    };

    return (
        <div className="form-overlay">
            <div className="form-container">
                <h2>Добавить нового Person</h2>
                <form onSubmit={handleSubmit}>
                    {/* Все поля формы остаются без изменений, только убираем checkbox для location */}
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

                    {/* Локация теперь всегда видима, без checkbox */}
                    <fieldset>
                        <legend>Локация (опционально)</legend>
                        <label>
                            Название:
                            <input
                                type="text"
                                value={person.location.name}
                                onChange={(e) => handleLocationChange('name', e.target.value)}
                            />
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

                    <button type="submit">Добавить Person</button>
                    <button type="button" onClick={onClose}>
                        Отмена
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddPersonForm;