import React, { FC, useCallback, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import { TeachMapMarker } from './teach-map-marker';
import styles from './teach-map.module.css';
import { mapSettings } from './map-settings';
import { ErrorBoundary } from 'react-error-boundary';

export interface University {
    id: string;
    title: string;
    location: string;
    courses: { name: string; url: string }[];
    geo: { lat: number; lng: number };
}

interface TeachMapProps {
    className?: string;
    universities: University[];
}

export const TeachMap: FC<TeachMapProps> = ({ className, universities }) => {
    const [activeId, setActiveId] = useState<string>('');

    const handleChildClick = useCallback((key: string) => {
        setActiveId(key);
    }, []);

    const handleClose = useCallback(() => {
        setActiveId('');
    }, []);

    return (
        <ErrorBoundary fallback={<div>Map is unavailable</div>}>
            <div className={`${styles.map} ${className ? className : ''}`}>
                <GoogleMapReact
                    bootstrapURLKeys={{ key: mapSettings.key }}
                    defaultCenter={mapSettings.defaultCenter}
                    defaultZoom={mapSettings.defaultZoom}
                    options={mapSettings.options}
                    onChildClick={handleChildClick}
                >
                    {universities.map((item) => (
                        <TeachMapMarker
                            key={item.id}
                            lat={item.geo.lat}
                            lng={item.geo.lng}
                            university={item}
                            showTooltip={item.id === activeId}
                            onClose={handleClose}
                        />
                    ))}
                </GoogleMapReact>
            </div>
        </ErrorBoundary>
    );
};
