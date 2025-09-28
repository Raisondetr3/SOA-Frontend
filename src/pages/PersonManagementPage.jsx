import React, { useState } from 'react';
import Header from '../components/Headers/Header';
import PersonTable from '../components/Tables/PersonTable/PersonTable';
import AddPersonForm from '../components/Forms/PersonForms/AddPersonForm';
import EditPersonForm from '../components/Forms/PersonForms/EditPersonForm';
import SpecialOperations from '../components/SpecialOperations/SpecialOperations';
import AdvancedFilters from '../components/Filters/AdvancedFilters';
import { showToast } from '../components/Toast/toastService';
import './PersonManagementPage.css';

const PersonManagementPage = () => {
    const [persons, setPersons] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [personToEdit, setPersonToEdit] = useState(null);
    const [filters, setFilters] = useState({});
    const [sortBy, setSortBy] = useState('');
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const refreshTable = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    const handlePersonAdded = (newPerson) => {
        refreshTable();
        showToast('Person успешно добавлен!', 'success');
    };

    const handlePersonUpdated = (updatedPerson) => {
        refreshTable();
        showToast('Person успешно обновлен!', 'success');
    };

    const handleEditPerson = (person) => {
        setPersonToEdit(person);
        setShowEditForm(true);
    };

    const handleFiltersChange = (newFilters) => {
        setFilters(newFilters);
    };

    const handleSortChange = (sortField) => {
        setSortBy(sortField);
    };

    return (
        <div className="main-container">
            <Header />

            <div className="content-wrapper">
                <AdvancedFilters
                    onFiltersChange={handleFiltersChange}
                    onSortChange={handleSortChange}
                />

                <SpecialOperations onOperationComplete={refreshTable} />

                <div className="add-button-wrapper">
                    <button
                        className="add-button"
                        onClick={() => setShowAddForm(true)}
                    >
                        + Добавить Person
                    </button>
                </div>

                <PersonTable
                    persons={persons}
                    setPersons={setPersons}
                    filters={filters}
                    sortBy={sortBy}
                    refreshTrigger={refreshTrigger}
                    onEditPerson={handleEditPerson}
                />
            </div>

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