import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Switcher from '@rescui/switcher';
import ISO6391 from 'iso-639-1';
import { ModeSelect, SelectOption } from './mode-select';
import { EventCard } from './event-card';
import styles from './event-list.module.css';
import { communityEvents } from './community-events';
import { CommunityEvent } from './community-event';
import cn from 'classnames';
import Button from '@rescui/button';

interface EventType {
    value: string;
    label: string;
}

const upcomingEvent: EventType = {
    value: 'upcoming',
    label: 'Upcoming',
};

const pastEvent: EventType = {
    value: 'past',
    label: 'Past',
};

const materialTypes = {
    examples: 'Examples',
    slides: 'Slides',
    video: 'Video',
    pdf: 'PDF',
    article: 'Article',
};

const defaultOption: SelectOption = {
    id: 'all',
    label: 'All',
};

export function CommunityAddEvent(props) {
    return (
        <Button
            target="_blank"
            mode="outline"
            href="https://github.com/JetBrains/kotlin-web-site/#community-events"
            {...props}
        >
        Add New Event ↗
        </Button>
    );
}

export const EventList = () => {
    const router = useRouter();
    const [eventMode, setMode] = useState<string>(upcomingEvent.value);
    const [language, setLanguage] = useState<SelectOption>(defaultOption);
    const [material, setMaterial] = useState<SelectOption>(defaultOption);

    useEffect(() => {
        setMode(router.query.time === pastEvent.value ? pastEvent.value : upcomingEvent.value);
    }, [router.query]);

    const switchMode = useCallback(
        (value: string) => {
            if (value === pastEvent.value) {
                router.push({
                    query: { time: pastEvent.value },
                });
            } else {
                router.push({});
            }
            setMaterial(defaultOption);
        },
        [router]
    );

    const events = useMemo(() => {
        return communityEvents
            .filter((event) => (eventMode === upcomingEvent.value ? event.isUpcoming() : !event.isUpcoming()))
            .sort(sortBy(eventMode === upcomingEvent.value ? 'desc' : 'asc'));
    }, [eventMode]);

    const visibleEvents = useMemo(() => {
        return events.filter((event) => {
            let visible = true;

            if (language.id !== defaultOption.id && event.lang !== language.id) {
                visible = false;
            }

            if (material.id !== defaultOption.id && (!event?.content || !event.content[material.id])) {
                visible = false;
            }

            return visible;
        });
    }, [events, language, material]);

    const visibleLanguages: SelectOption[] = useMemo(() => {
        const arr = events
            .map((event) => event.lang)
            .filter((value, index, array) => array.indexOf(value) === index)
            .map((id) => ({ id: id, label: ISO6391.getName(id) || id }));
        arr.sort((a, b) => a.label.localeCompare(b.label));
        arr.unshift(defaultOption);

        return arr;
    }, [events]);

    useEffect(() => {
        setLanguage(defaultOption);
    }, [visibleLanguages]);

    const visibleMaterials: SelectOption[] = useMemo(() => {
        const allValues: { [key: string]: SelectOption } = events.reduce((dict, event) => {
            if (event?.content) {
                for (let materialKey in event.content) {
                    if (materialTypes[materialKey] && !dict[materialKey]) {
                        dict[materialKey] = { id: materialKey, label: materialTypes[materialKey] };
                    }
                }
            }

            return dict;
        }, {});

        const arr = Object.values(allValues);
        return arr.length ? [defaultOption, ...arr] : [];
    }, [events]);

    useEffect(() => {
        setMaterial(defaultOption);
    }, [visibleMaterials]);

    return (
        <div className={styles.wrapper}>
            <div className={'ktl-layout ktl-layout--center'}>
                <h1 className={'ktl-h1'}>Events</h1>

                <div className={styles.actions}>
                    <div>
                        <Switcher
                            mode={'rock'}
                            value={eventMode}
                            onChange={switchMode}
                            options={[upcomingEvent, pastEvent]}
                        />
                        <CommunityAddEvent className={styles.add}/>
                    </div>


                    <div className={styles.selects}>
                        {!!visibleMaterials.length && (
                            <ModeSelect
                                options={visibleMaterials}
                                value={material}
                                label={'Material'}
                                onSelect={setMaterial}
                                className={styles.select}
                            />
                        )}

                        <ModeSelect
                            options={visibleLanguages}
                            value={language}
                            label={'Language'}
                            onSelect={setLanguage}
                            className={cn(styles.select, styles.selectEnd)}
                        />
                    </div>
                </div>

                {visibleEvents.length ? (
                    <div className={styles.list}>
                        {visibleEvents.map((communityEvent) => (
                            <EventCard key={communityEvent.id} event={communityEvent} />
                        ))}
                    </div>
                ) : (
                    <div className={cn('ktl-t1', styles.empty)}>No Events Found</div>
                )}
            </div>
        </div>
    );
};

function sortBy(direction: 'asc' | 'desc') {
    return ({ endDate: first }: CommunityEvent, { endDate: second }: CommunityEvent) => {
        if (first === second) {
            return 0;
        }

        if (direction === 'asc') {
            return first < second ? 1 : -1;
        } else {
            return first < second ? -1 : 1;
        }
    };
}
