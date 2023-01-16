import React, { FC, useCallback, useMemo, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import { KugMapMarker } from './kug-map-marker';
import styles from './kug-map.module.css';
import { settings } from '../../../static/js/util/map-settings';

interface KugMap {
    userGroupData: UserGroupsData;
}

export interface UserGroupEntity extends UserGroup {
    id: string;
}

export const KugMap: FC<KugMap> = ({ userGroupData }) => {
    const [activeId, setActiveId] = useState('');
    const userGroups: UserGroupEntity[] = useMemo(() => {
        const groups: UserGroupEntity[] = [];

        userGroupData.forEach((region) =>
            region.groups.map((group: UserGroup) => {
                if (!!group?.position) {
                    groups.push({
                        ...group,
                        id: `${group.name}-${group.country}-${group.url}`,
                    });
                }
            })
        );

        return groups;
    }, [userGroupData]);

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
                {userGroups.map((group) => (
                    <KugMapMarker
                        key={group.id}
                        lat={group.position.lat}
                        lng={group.position.lng}
                        group={group}
                        showTooltip={group.id === activeId}
                        onClose={handleChildClick}
                    />
                ))}
            </GoogleMapReact>
        </div>
    );
};
