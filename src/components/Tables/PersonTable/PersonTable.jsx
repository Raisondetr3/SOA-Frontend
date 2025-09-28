import React, { useEffect, useState } from 'react';
import './PersonTable.css';
import PersonTableHeader from './PersonTableHeader';
import PersonTableRow from './PersonTableRow';
import EditPersonForm from '../../Forms/PersonForms/EditPersonForm';
import PaginationControls from '../../Pagination/PaginationControls';
import { showToast } from '../../Toast/toastService';

function PersonTable({ persons = [], setPersons, filters, sortBy, refreshTrigger }) {
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);
    const [personToEdit, setPersonToEdit] = useState(null);

    useEffect(() => {
        fetchPersons(currentPage, filters, sortBy);
    }, [currentPage, filters, sortBy, refreshTrigger]);

    const fetchPersons = async (page, filters = {}, sortBy = '') => {
        try {
            const params = new URLSearchParams({
                page: page,
                size: 4
            });

            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== '') {
                    params.append('filter', `${key}=${value}`);
                }
            });

            if (sortBy) {
                if (sortBy.includes(',')) {
                    const sortFields = sortBy.split(',');
                    sortFields.forEach(field => {
                        if (field.trim()) {
                            params.append('sortBy', field.trim());
                        }
                    });
                } else {
                    params.append('sortBy', sortBy);
                }
            }

            const url = `${import.meta.env.VITE_PERSON_SERVICE}/persons?${params.toString()}`;
            console.log('Запрос к URL:', url);

            const response = await fetch(url);
            console.log('Response status:', response.status);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Полученные данные:', data);

            const totalPagesHeader = parseInt(response.headers.get('X-Total-Pages') || '1');
            const currentPageHeader = parseInt(response.headers.get('X-Current-Page') || '0');
            const totalElementsHeader = parseInt(response.headers.get('X-Total-Count') || '0');

            setPersons(data);
            setCurrentPage(currentPageHeader);
            setTotalPages(totalPagesHeader);
            setTotalElements(totalElementsHeader);

            console.log('Pagination info:', {
                totalPages: totalPagesHeader,
                currentPage: currentPageHeader,
                totalElements: totalElementsHeader,
                dataLength: data.length
            });
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

            fetchPersons(currentPage, filters, sortBy);
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

    const handlePersonUpdated = () => {
        setIsEditFormOpen(false);
        setPersonToEdit(null);
        fetchPersons(currentPage, filters, sortBy);
    };

    return (
        <div className="person-table-wrapper">
            <div className="person-table-container">
                <PersonTableHeader />
                {persons.length === 0 ? (
                    <div className="no-data">
                        {totalElements === 0 ? 'Не найдено ни одного объекта' : 'Загрузка...'}
                    </div>
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

            {totalElements > 0 && (
                <div className="pagination-info">
                    Показано {persons.length} из {totalElements} записей (страница {currentPage + 1} из {totalPages})
                </div>
            )}

            {totalPages > 1 && (
                <PaginationControls
                    onPrevious={() => setCurrentPage(Math.max(0, currentPage - 1))}
                    onNext={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                    isFirstPage={currentPage === 0}
                    isLastPage={currentPage >= totalPages - 1}
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