import React, {FC} from 'react';
import classNames from 'classnames';
import Image from 'next/image';

import styles from './community-keep-in-touch-card.module.css'

export interface CommunityKeepInTouchCardProps {
    icon: string;
    title: string;
    description: string;
    link: string;
}

export const CommunityKeepInTouchCard: FC<CommunityKeepInTouchCardProps> = ({icon, title, description, link}) => {

    return (
        <a href={link} target="_blank" rel="noreferrer noopener" className={classNames(styles.card)}>
            <div className={classNames(styles.icon)}>
                <Image src={icon} alt={title}/>
            </div>

            <div className={classNames(styles.bottom)}>
                <div className={classNames(styles.title)}>
                    <div className="ktl-h3">
                        {title}
                    </div>
                </div>
                <div className={classNames(styles.description, 'ktl-offset-top-xs')}>
                    <div className="ktl-text-1 ktl-dimmed-text">
                        {description}
                    </div>
                </div>
            </div>
        </a>
    )
}
