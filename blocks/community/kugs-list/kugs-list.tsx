import React, { FC, useMemo } from 'react';
import classnames from 'classnames';
import kugsLogo from '../../../public/images/community/kugs-logo.svg';
import styles from './kugs-list.module.css';
import { Svg } from 'react-optimized-image';
import { useTextStyles } from '@rescui/typography';

interface KugsListProps {
    userGroupData: UserGroupsData;
}

export const KugsList: FC<KugsListProps> = ({ userGroupData }) => {
    const textCn = useTextStyles();

    const countUserGroups = useMemo(() => {
        let counter = 0;
        userGroupData.forEach((group) => (counter += group.groups.length));
        return counter;
    }, [userGroupData]);

    const userGroupsByRegion = useMemo(() => {
        const sortedUserGroupsByRegion = [];

        userGroupData.forEach((group) => {
            const uniqueRegions = new Set();
            group.groups.forEach((item) => uniqueRegions.add(item.country));
            const sortedUniqueRegions = Array.from(uniqueRegions).sort();

            const regionWithCountries = sortedUniqueRegions.map((region) => ({
                name: region,
                cities: group.groups.filter((groupItem) => groupItem.country === region),
            }));

            sortedUserGroupsByRegion.push({
                name: group.section,
                countries: regionWithCountries,
            });
        });
        return sortedUserGroupsByRegion;
    }, [userGroupData]);

    // If there are more than 6 cities in a country, allow to break the list to the next column
    // If cities list is large, it should start on the new column
    const countryClassName = (country) =>
        classnames(
            styles.countrySingle,
            country.cities.length > 6 && styles.canBreak,
            country.cities.length > 12 && styles.newColumn
        );

    return (
        <div className={styles.wrapper}>
            <h2 className={classnames(styles.title, 'ktl-hero ktl-offset-bottom-l')}>
                <Svg className={styles.logo} src={kugsLogo} />
                {countUserGroups} KUGs around the world
            </h2>
            <ul className={classnames(styles.list, textCn('rs-text-3'))}>
                {userGroupsByRegion.map((region) => (
                    <li key={region.name} className={classnames(styles.region)}>
                        <h2 className="ktl-h2 ktl-offset-bottom-m">{region.name}</h2>
                        <ul className={classnames(styles.countriesList)}>
                            {region.countries.map((country) => (
                                <li key={country.name} className={countryClassName(country)}>
                                    <h3 className="ktl-h4">{country.name}</h3>
                                    <ul className={classnames(styles.citiesList, 'ktl-offset-top-xs')}>
                                        {country.cities.map((city) => (
                                            <li key={city.name}>
                                                <a
                                                    href={city.url}
                                                    className={classnames('rs-link', styles.kugLink)}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {city.name}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
};
