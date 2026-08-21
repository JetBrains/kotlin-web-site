import React, { FC, useCallback, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import { MeetupsMapMarker } from './meetups-map-marker';
import styles from './meetups-map.module.css';
import { settings } from '../../../static/js/util/map-settings';

export interface AnniversaryMeetupEntity extends AnniversaryMeetup {
    id: string;
}

interface MeetupsMapProps {
    meetups: AnniversaryMeetupEntity[];
}

export const MeetupsMap: FC<MeetupsMapProps> = ({ meetups }) => {
    const [activeId, setActiveId] = useState('');

    const handleChildClick = useCallback((key: string) => {
        setActiveId(key);
    }, []);

    return (
        <div className={styles.map}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: settings.key }}
                defaultCenter={settings.defaultCenter}
                defaultZoom={settings.defaultZoom}
                options={settings.options}
                onChildClick={handleChildClick}
            >
                {meetups.map((meetup) => (
                    <MeetupsMapMarker
                        key={meetup.id}
                        lat={meetup.position.lat}
                        lng={meetup.position.lng}
                        meetup={meetup}
                        showTooltip={meetup.id === activeId}
                        onClose={handleChildClick}
                    />
                ))}
            </GoogleMapReact>
        </div>
    );
};
