import React, { FC } from 'react';
import { UserGroupEntity } from './kug-map';
import cn from 'classnames';
import styles from './kug-map-marker.module.css';
import { KugMapTooltip } from './kug-map-tooltip';

interface KugMapMarkerProps {
    lat: number;
    lng: number;
    group: UserGroupEntity;
    showTooltip: boolean;
    onClose: (key: string) => void;
}

export const KugMapMarker: FC<KugMapMarkerProps> = ({ showTooltip, group, onClose }) => {
    return (
        <div className={cn(styles.marker, { [styles.active]: showTooltip })}>
            {showTooltip && <KugMapTooltip group={group} onClose={onClose} />}
        </div>
    );
};
