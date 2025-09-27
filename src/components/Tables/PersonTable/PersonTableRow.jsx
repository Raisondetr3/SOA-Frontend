import React from 'react';
import './PersonTable.css';
import editIcon from '../../../assets/edit-icon.svg';
import deleteIcon from '../../../assets/delete-icon.svg';

function PersonTableRow({ person, index, handleEdit, handleDelete }) {
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU');
    };

    const formatLocation = (location) => {
        if (!location || !location.name) return 'N/A';
        return `${location.name} (${location.x}, ${location.y}, ${location.z})`;
    };

    const getColorClass = (color) => {
        const colorClasses = {
            'GREEN': 'color-green',
            'BLUE': 'color-blue',
            'ORANGE': 'color-orange',
            'BROWN': 'color-brown'
        };
        return colorClasses[color] || '';
    };

    const getCountryClass = (country) => {
        const countryClasses = {
            'FRANCE': 'country-france',
            'SPAIN': 'country-spain',
            'INDIA': 'country-india',
            'THAILAND': 'country-thailand',
            'SOUTH_KOREA': 'country-korea'
        };
        return countryClasses[country] || '';
    };

    return (
        <div className={`person-table-row ${index % 2 === 0 ? 'even' : 'odd'}`}>
            <div className="person-name">{person.name || 'N/A'}</div>
            <div>
                {person.coordinates
                    ? `(${person.coordinates.x}, ${person.coordinates.y})`
                    : 'N/A'}
            </div>
            <div>{formatDate(person.creationDate)}</div>
            <div>{person.height || 'N/A'}</div>
            <div>{person.weight || 'N/A'}</div>
            <div>
                <span className={`color-badge ${getColorClass(person.hairColor)}`}>
                    {person.hairColor || 'N/A'}
                </span>
            </div>
            <div>
                <span className={`color-badge ${getColorClass(person.eyeColor)}`}>
                    {person.eyeColor || 'N/A'}
                </span>
            </div>
            <div>
                <span className={`country-badge ${getCountryClass(person.nationality)}`}>
                    {person.nationality || 'N/A'}
                </span>
            </div>
            <div className="location-info">{formatLocation(person.location)}</div>
            <div className="action-icons">
                <img
                    src={editIcon}
                    alt="Edit"
                    onClick={() => handleEdit(person)}
                    title="Редактировать"
                />
                <img
                    src={deleteIcon}
                    alt="Delete"
                    onClick={() => handleDelete(person.id)}
                    title="Удалить"
                />
            </div>
        </div>
    );
}

export default PersonTableRow;