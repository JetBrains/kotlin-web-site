import React, { useEffect } from 'react';
import { initSearch, openPopup } from '../../static/js/com/search/search';

export const onSearch = openPopup;

export const Search = () => {
    useEffect(() => {
        initSearch();
    }, []);

    return (
        <div className="search-popup" tabIndex={1000}>
            <div className="search-popup__content">
                <div className="search-popup__controls">
                    <div className="search-popup__input" />
                    <div className="search-popup__close">
                        <div className="search-popup__close-icon-wrapper">
                            <div className="search-popup__close-icon" />
                        </div>
                        <div className="search-popup__close-text">esc</div>
                    </div>
                </div>
                <div className="search-popup__results" />
            </div>
        </div>
    );
};
