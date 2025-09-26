import React, { useState } from 'react';
import Header from '../components/Headers/Header';
import PersonTable from '../components/Tables/PersonTable/PersonTable';
import AddPersonForm from '../components/Forms/PersonForms/AddPersonForm';
import EditPersonForm from '../components/Forms/PersonForms/EditPersonForm';
import SpecialOperations from '../components/SpecialOperations/SpecialOperations';
import SearchBar from '../components/SearchBar/SearchBar';
import { showToast } from '../components/Toast/toastService';
import './PersonManagementPage.css';

const PersonManagementPage = () => {
    const [persons, setPersons] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [personToEdit, setPersonToEdit] = useState(null);
    const [filters, setFilters] = useState({
        name: '',
        hairColor: '',
        eyeColor: '',
        nationality: ''
    });

    const handlePersonAdded = (newPerson) => {
        setPersons(prev => [...prev, newPerson]);
        showToast('Person успешно добавлен!', 'success');
    };

    const handlePersonUpdated = (updatedPerson) => {
        setPersons(prev =>
            prev.map(person =>
                person.id === updatedPerson.id ? updatedPerson : person
            )
        );
        showToast('Person успешно обновлен!', 'success');
    };

    const handleEditPerson = (person) => {
        setPersonToEdit(person);
        setShowEditForm(true);
    };

    const handleNameSearch = (searchTerm) => {
        setFilters(prev => ({ ...prev, name: searchTerm }));
    };

    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({ ...prev, [filterName]: value }));
    };

    return (
        <div className="main-container">
            <Header />

            <div className="content-wrapper">
                {/* Поиск и фильтры */}
                <div className="filters-section">
                    <SearchBar
                        placeholder="Поиск по имени..."
                        onSearch={handleNameSearch}
                    />

                    <select
                        onChange={(e) => handleFilterChange('hairColor', e.target.value)}
                        className="filter-select"
                    >
                        <option value="">Все цвета волос</option>
                        <option value="GREEN">GREEN</option>
                        <option value="BLUE">BLUE</option>
                        <option value="ORANGE">ORANGE</option>
                        <option value="BROWN">BROWN</option>
                    </select>

                    <select
                        onChange={(e) => handleFilterChange('eyeColor', e.target.value)}
                        className="filter-select"
                    >
                        <option value="">Все цвета глаз</option>
                        <option value="GREEN">GREEN</option>
                        <option value="BLUE">BLUE</option>
                        <option value="ORANGE">ORANGE</option>
                        <option value="BROWN">BROWN</option>
                    </select>

                    <select
                        onChange={(e) => handleFilterChange('nationality', e.target.value)}
                        className="filter-select"
                    >
                        <option value="">Все национальности</option>
                        <option value="FRANCE">FRANCE</option>
                        <option value="SPAIN">SPAIN</option>
                        <option value="INDIA">INDIA</option>
                        <option value="THAILAND">THAILAND</option>
                        <option value="SOUTH_KOREA">SOUTH_KOREA</option>
                    </select>
                </div>

                {/* Специальные операции */}
                <SpecialOperations />

                {/* Кнопка добавления - перемещена прямо над таблицей */}
                <div className="add-button-wrapper">
                    <button
                        className="add-button"
                        onClick={() => setShowAddForm(true)}
                    >
                        + Добавить Person
                    </button>
                </div>

                {/* Таблица */}
                <PersonTable
                    persons={persons}
                    setPersons={setPersons}
                    filters={filters}
                    onEditPerson={handleEditPerson}
                />
            </div>

            {/* Модальные окна остаются без изменений */}
            {showAddForm && (
                <AddPersonForm
                    onClose={() => setShowAddForm(false)}
                    onSubmit={handlePersonAdded}
                />
            )}

            {showEditForm && personToEdit && (
                <EditPersonForm
                    personData={personToEdit}
                    onClose={() => {
                        setShowEditForm(false);
                        setPersonToEdit(null);
                    }}
                    onSubmit={handlePersonUpdated}
                />
            )}
        </div>
    );
};

export default PersonManagementPage;