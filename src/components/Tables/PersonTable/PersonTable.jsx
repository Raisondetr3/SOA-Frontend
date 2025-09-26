import React, { useEffect, useState } from 'react';
import './PersonTable.css';
import PersonTableHeader from './PersonTableHeader';
import PersonTableRow from './PersonTableRow';
import EditPersonForm from '../../Forms/PersonForms/EditPersonForm';
import PaginationControls from '../../Pagination/PaginationControls';
import { showToast } from '../../Toast/toastService';

function PersonTable({ persons = [], setPersons, filters }) {
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);
    const [personToEdit, setPersonToEdit] = useState(null);

    useEffect(() => {
        fetchPersons(currentPage, filters);
    }, [currentPage, filters]);

    const fetchPersons = async (page, filters = {}) => {
        try {
            const params = new URLSearchParams({
                page: page,
                size: 10,
                ...filters
            });

            const response = await fetch(`${import.meta.env.VITE_PERSON_SERVICE}/persons`);
            const data = await response.json();

            setPersons(data.content || []);
            setCurrentPage(data.number || 0);
            setTotalPages(data.totalPages || 0);
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error);
            setPersons([]);
            showToast('Ошибка при загрузке данных', 'error');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Вы уверены, что хотите удалить эту запись?')) {
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_PERSON_SERVICE}/persons/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                showToast('Ошибка при удалении Person', 'error');
                return;
            }

            setPersons((prevPersons) => prevPersons.filter((person) => person.id !== id));
            showToast('Person успешно удалён', 'success');
        } catch (error) {
            console.error('Ошибка при удалении:', error);
            showToast('Ошибка при удалении Person', 'error');
        }
    };

    const handleEdit = (person) => {
        setPersonToEdit(person);
        setIsEditFormOpen(true);
    };

    const handleEditFormClose = () => {
        setIsEditFormOpen(false);
        setPersonToEdit(null);
    };

    const handlePersonUpdated = (updatedPerson) => {
        setIsEditFormOpen(false);
        setPersons((prevPersons) =>
            prevPersons.map((person) => (person.id === updatedPerson.id ? updatedPerson : person))
        );
        fetchPersons(currentPage, filters);
        showToast('Person успешно обновлён', 'success');
    };

    return (
        <div className="person-table-wrapper">
            <div className="person-table-container">
                <PersonTableHeader />
                {persons.length === 0 ? (
                    <div className="no-data">Не создано ни одного объекта</div>
                ) : (
                    persons.map((person, index) =>
                        person ? (
                            <PersonTableRow
                                key={person.id}
                                person={person}
                                index={index}
                                handleEdit={handleEdit}
                                handleDelete={handleDelete}
                            />
                        ) : (
                            <div key={index} className="person-table-row no-data">
                                Некорректные данные
                            </div>
                        )
                    )
                )}
            </div>
            {totalPages > 1 && (
                <PaginationControls
                    onPrevious={() => setCurrentPage(currentPage - 1)}
                    onNext={() => setCurrentPage(currentPage + 1)}
                    isFirstPage={currentPage === 0}
                    isLastPage={currentPage === totalPages - 1}
                />
            )}
            {isEditFormOpen && personToEdit && (
                <EditPersonForm
                    personData={personToEdit}
                    onClose={handleEditFormClose}
                    onSubmit={handlePersonUpdated}
                />
            )}
        </div>
    );
}

export default PersonTable;