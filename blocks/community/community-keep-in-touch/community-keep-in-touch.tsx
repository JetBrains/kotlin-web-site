import React, {FC} from 'react';
import {CommunityKeepInTouchCard} from "../../../components/community/community-keep-in-touch-card/community-keep-in-touch-card";
import classNames from 'classnames';

import styles from './community-keep-in-touch.module.css';

import {CommunityKeepInTouchCardProps} from '../../../components/community/community-keep-in-touch-card/community-keep-in-touch-card'

interface CommunityKeepInTouchProps {
    links: CommunityKeepInTouchCardProps[]
}

export const CommunityKeepInTouch: FC<CommunityKeepInTouchProps> = ({links}) => {
    return (
        <div className={classNames(styles.wrapper)}>
            <section className="ktl-container">
                <h2 className="ktl-h1">Keep in Touch</h2>
                <div className={classNames(styles.grid, 'ktl-offset-top-l')}>
                    {links.map(link => (
                        <CommunityKeepInTouchCard
                            icon={link.icon}
                            title={link.title}
                            description={link.description}
                            link={link.link}
                        />
                    ))}
                </div>
                <div className={classNames(styles.resources, 'ktl-offset-top-l')}>
                    <h3 className="ktl-h3">Other resources:</h3>
                    <a href="https://kotlin.link/" target="_blank" rel="noreferrer noopener"
                       className="ktl-text-1 rs-link rs-link_external">Awesome Kotlin</a>
                </div>

            </section>
        </div>
    )
}
