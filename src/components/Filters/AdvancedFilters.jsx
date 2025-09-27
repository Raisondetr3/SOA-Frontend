import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Filter, X } from 'lucide-react';
import SearchBar from '../SearchBar/SearchBar';
import './AdvancedFilters.css';

const AdvancedFilters = ({ onFiltersChange, onSortChange }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeFilters, setActiveFilters] = useState({});
    const [searchName, setSearchName] = useState('');
    const [sortFields, setSortFields] = useState([]);
    const [localFilters, setLocalFilters] = useState({
        coordinatesX: { operator: 'eq', value: '' },
        coordinatesY: { operator: 'eq', value: '' },
        height: { operator: 'eq', value: '' },
        weight: { operator: 'eq', value: '' },
        hairColor: '',
        eyeColor: '',
        nationality: '',
        locationName: ''
    });

    const colorOptions = ['', 'GREEN', 'BLUE', 'ORANGE', 'BROWN'];
    const countryOptions = ['', 'FRANCE', 'SPAIN', 'INDIA', 'THAILAND', 'SOUTH_KOREA'];
    const operatorOptions = {
        number: [
            { value: 'eq', label: '=' },
            { value: 'ne', label: '≠' },
            { value: 'gt', label: '>' },
            { value: 'gte', label: '≥' },
            { value: 'lt', label: '<' },
            { value: 'lte', label: '≤' }
        ]
    };

    const handleSortChange = (field) => {
        if (!field) {
            setSortFields([]);
            onSortChange('');
            return;
        }

        const existingIndex = sortFields.findIndex(f =>
            f === field || f === `-${field}` || `-${f}` === field
        );

        if (existingIndex >= 0) {
            const newFields = sortFields.filter((_, i) => i !== existingIndex);
            setSortFields(newFields);
            onSortChange(newFields.join(','));
        } else {
            const newFields = [...sortFields, field];
            setSortFields(newFields);
            onSortChange(newFields.join(','));
        }
    };

    useEffect(() => {
        const filters = {...activeFilters};
        if (searchName) {
            filters['name[like]'] = searchName;
        } else {
            delete filters['name[like]'];
        }
        onFiltersChange(filters);
    }, [searchName]);

    const applyFilters = () => {
        const filters = {};

        if (searchName) {
            filters['name[like]'] = searchName;
        }

        if (localFilters.coordinatesX.value) {
            const key = localFilters.coordinatesX.operator === 'eq'
                ? 'coordinates.x'
                : `coordinates.x[${localFilters.coordinatesX.operator}]`;
            filters[key] = localFilters.coordinatesX.value;
        }

        if (localFilters.coordinatesY.value) {
            const key = localFilters.coordinatesY.operator === 'eq'
                ? 'coordinates.y'
                : `coordinates.y[${localFilters.coordinatesY.operator}]`;
            filters[key] = localFilters.coordinatesY.value;
        }

        if (localFilters.height.value) {
            const key = localFilters.height.operator === 'eq'
                ? 'height'
                : `height[${localFilters.height.operator}]`;
            filters[key] = localFilters.height.value;
        }

        if (localFilters.weight.value) {
            const key = localFilters.weight.operator === 'eq'
                ? 'weight'
                : `weight[${localFilters.weight.operator}]`;
            filters[key] = localFilters.weight.value;
        }

        if (localFilters.hairColor) {
            filters.hairColor = localFilters.hairColor;
        }

        if (localFilters.eyeColor) {
            filters.eyeColor = localFilters.eyeColor;
        }

        if (localFilters.nationality) {
            filters.nationality = localFilters.nationality;
        }

        if (localFilters.locationName) {
            filters['location.name[like]'] = localFilters.locationName;
        }

        setActiveFilters(filters);
        onFiltersChange(filters);
    };

    const clearAllFilters = () => {
        setSearchName('');
        setLocalFilters({
            coordinatesX: { operator: 'eq', value: '' },
            coordinatesY: { operator: 'eq', value: '' },
            height: { operator: 'eq', value: '' },
            weight: { operator: 'eq', value: '' },
            hairColor: '',
            eyeColor: '',
            nationality: '',
            locationName: ''
        });
        setActiveFilters({});
        onFiltersChange({});
    };

    const handleNumberFilterChange = (field, type, value) => {
        setLocalFilters(prev => ({
            ...prev,
            [field]: {
                ...prev[field],
                [type]: value
            }
        }));
    };

    const getActiveFilterCount = () => {
        const extendedFiltersCount = Object.keys(activeFilters).filter(key => key !== 'name[like]').length;
        return extendedFiltersCount;
    };

    return (
        <div className="filters-container">
            <div className="advanced-filters">
                <div className="basic-filters">
                    <SearchBar
                        placeholder="Поиск по имени..."
                        onSearch={setSearchName}
                    />

                    <button
                        className="filter-toggle"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        <Filter size={16}/>
                        Расширенные фильтры
                        {getActiveFilterCount() > 0 && (
                            <span className="filter-badge">{getActiveFilterCount()}</span>
                        )}
                        {isExpanded ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                    </button>

                    {isExpanded && (
                        <>
                            <button
                                className="apply-filters-btn"
                                onClick={applyFilters}
                            >
                                Применить фильтры
                            </button>

                            {(getActiveFilterCount() > 0 || searchName) && (
                                <button
                                    className="clear-filters-btn"
                                    onClick={clearAllFilters}
                                >
                                    <X size={16}/>
                                    Очистить все
                                </button>
                            )}
                        </>
                    )}
                </div>

                {isExpanded && (
                    <div className="extended-filters">
                        <div className="filter-group">
                            <h4>Числовые фильтры</h4>

                            <div className="filter-row">
                                <label>Координата X:</label>
                                <select
                                    value={localFilters.coordinatesX.operator}
                                    onChange={(e) => handleNumberFilterChange('coordinatesX', 'operator', e.target.value)}
                                    className="operator-select"
                                >
                                    {operatorOptions.number.map(op => (
                                        <option key={op.value} value={op.value}>{op.label}</option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    value={localFilters.coordinatesX.value}
                                    onChange={(e) => handleNumberFilterChange('coordinatesX', 'value', e.target.value)}
                                    className="filter-input"
                                    placeholder="Значение"
                                />
                            </div>

                            <div className="filter-row">
                                <label>Координата Y:</label>
                                <select
                                    value={localFilters.coordinatesY.operator}
                                    onChange={(e) => handleNumberFilterChange('coordinatesY', 'operator', e.target.value)}
                                    className="operator-select"
                                >
                                    {operatorOptions.number.map(op => (
                                        <option key={op.value} value={op.value}>{op.label}</option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    value={localFilters.coordinatesY.value}
                                    onChange={(e) => handleNumberFilterChange('coordinatesY', 'value', e.target.value)}
                                    className="filter-input"
                                    placeholder="Значение (max: 626)"
                                    max="626"
                                />
                            </div>

                            <div className="filter-row">
                                <label>Рост:</label>
                                <select
                                    value={localFilters.height.operator}
                                    onChange={(e) => handleNumberFilterChange('height', 'operator', e.target.value)}
                                    className="operator-select"
                                >
                                    {operatorOptions.number.map(op => (
                                        <option key={op.value} value={op.value}>{op.label}</option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    value={localFilters.height.value}
                                    onChange={(e) => handleNumberFilterChange('height', 'value', e.target.value)}
                                    className="filter-input"
                                    placeholder="Значение"
                                />
                            </div>

                            <div className="filter-row">
                                <label>Вес:</label>
                                <select
                                    value={localFilters.weight.operator}
                                    onChange={(e) => handleNumberFilterChange('weight', 'operator', e.target.value)}
                                    className="operator-select"
                                >
                                    {operatorOptions.number.map(op => (
                                        <option key={op.value} value={op.value}>{op.label}</option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={localFilters.weight.value}
                                    onChange={(e) => handleNumberFilterChange('weight', 'value', e.target.value)}
                                    className="filter-input"
                                    placeholder="Значение"
                                />
                            </div>
                        </div>

                        <div className="filter-group">
                            <h4>Категории</h4>

                            <div className="filter-row">
                                <label>Цвет волос:</label>
                                <select
                                    value={localFilters.hairColor}
                                    onChange={(e) => setLocalFilters(prev => ({...prev, hairColor: e.target.value}))}
                                    className="filter-select-full"
                                >
                                    <option value="">Все</option>
                                    {colorOptions.slice(1).map(color => (
                                        <option key={color} value={color}>{color}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="filter-row">
                                <label>Цвет глаз:</label>
                                <select
                                    value={localFilters.eyeColor}
                                    onChange={(e) => setLocalFilters(prev => ({...prev, eyeColor: e.target.value}))}
                                    className="filter-select-full"
                                >
                                    <option value="">Все</option>
                                    {colorOptions.slice(1).map(color => (
                                        <option key={color} value={color}>{color}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="filter-row">
                                <label>Национальность:</label>
                                <select
                                    value={localFilters.nationality}
                                    onChange={(e) => setLocalFilters(prev => ({...prev, nationality: e.target.value}))}
                                    className="filter-select-full"
                                >
                                    <option value="">Все</option>
                                    {countryOptions.slice(1).map(country => (
                                        <option key={country} value={country}>{country}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="filter-row">
                                <label>Название локации:</label>
                                <input
                                    type="text"
                                    value={localFilters.locationName}
                                    onChange={(e) => setLocalFilters(prev => ({...prev, locationName: e.target.value}))}
                                    className="filter-input-full"
                                    placeholder="Поиск по названию..."
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="sort-panel">
                <label>Сортировка:</label>
                <div className="sort-options">
                    <button
                        className={`sort-btn ${sortFields.includes('name') ? 'active asc' : sortFields.includes('-name') ? 'active desc' : ''}`}
                        onClick={() => handleSortChange(sortFields.includes('name') ? '-name' : 'name')}
                    >
                        Имя {sortFields.includes('name') ? '↑' : sortFields.includes('-name') ? '↓' : ''}
                    </button>
                    <button
                        className={`sort-btn ${sortFields.includes('weight') ? 'active asc' : sortFields.includes('-weight') ? 'active desc' : ''}`}
                        onClick={() => handleSortChange(sortFields.includes('weight') ? '-weight' : 'weight')}
                    >
                        Вес {sortFields.includes('weight') ? '↑' : sortFields.includes('-weight') ? '↓' : ''}
                    </button>
                    <button
                        className={`sort-btn ${sortFields.includes('height') ? 'active asc' : sortFields.includes('-height') ? 'active desc' : ''}`}
                        onClick={() => handleSortChange(sortFields.includes('height') ? '-height' : 'height')}
                    >
                        Рост {sortFields.includes('height') ? '↑' : sortFields.includes('-height') ? '↓' : ''}
                    </button>
                    <button
                        className={`sort-btn ${sortFields.includes('creationDate') ? 'active asc' : sortFields.includes('-creationDate') ? 'active desc' : ''}`}
                        onClick={() => handleSortChange(sortFields.includes('creationDate') ? '-creationDate' : 'creationDate')}
                    >
                        Дата {sortFields.includes('creationDate') ? '↑' : sortFields.includes('-creationDate') ? '↓' : ''}
                    </button>
                    {sortFields.length > 0 && (
                        <button className="clear-sort-btn" onClick={() => handleSortChange('')}>
                            Сбросить
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdvancedFilters;