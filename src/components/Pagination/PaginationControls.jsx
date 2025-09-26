import React from 'react';
import './PaginationControls.css';

function PaginationControls({ onPrevious, onNext, isFirstPage, isLastPage }) {
    return (
        <div className="pagination-controls">
            {!isFirstPage && <button onClick={onPrevious} className="pagination-button">Назад</button>}
            {!isLastPage && <button onClick={onNext} className="pagination-button">Вперёд</button>}
        </div>
    );
}

export default PaginationControls;
