import React from 'react';
import './PersonTable.css';

function PersonTableHeader() {
    return (
        <div className="person-table-header">
            <div>ID</div>
            <div>Name</div>
            <div>Coordinates</div>
            <div>Creation Date</div>
            <div>Height</div>
            <div>Weight</div>
            <div>Hair Color</div>
            <div>Eye Color</div>
            <div>Nationality</div>
            <div>Location</div>
            <div>Actions</div>
        </div>
    );
}

export default PersonTableHeader;