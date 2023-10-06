import React, { FC } from 'react';
import { KeepInTouchCard } from '../keep-in-touch-card/keep-in-touch-card';
import classNames from 'classnames';

import styles from './keep-in-touch.module.css';

import { KeepInTouchCardProps } from '../keep-in-touch-card/keep-in-touch-card';

interface KeepInTouchProps {
    links: KeepInTouchCardProps[];
}

export const KeepInTouch: FC<KeepInTouchProps> = ({ links }) => {
    return (
        <div className={classNames(styles.wrapper)}>
            <section className="ktl-layout ktl-layout--center">
                <h2 className="ktl-h1">Keep in Touch</h2>
                <div className={classNames(styles.grid, 'ktl-offset-top-l')}>
                    {links.map((link) => (
                        <KeepInTouchCard
                            key={link.title}
                            icon={link.icon}
                            title={link.title}
                            description={link.description}
                            link={link.link}
                        />
                    ))}
                </div>
                <div className={classNames(styles.resources, 'ktl-offset-top-l')}>
                    <h3 className="ktl-h3">Other resources:</h3>
                    <a
                        href="https://kotlin.link/"
                        target="_blank"
                        rel="noreferrer noopener"
                        className="rs-link rs-link_external ktl-text-1"
                    >
                        Awesome Kotlin
                    </a>
                </div>
            </section>
        </div>
    );
};
