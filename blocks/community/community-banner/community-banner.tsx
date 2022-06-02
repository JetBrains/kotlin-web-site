import React, { FC } from 'react';
import classNames from 'classnames';

import styles from './community-banner.module.css';
import communityBanner from '../../../public/images/community/community-banner.png';
import { Img } from 'react-optimized-image';

interface CommunityBannerProps {
    title: string;
    children: React.ReactNode;
}

export const CommunityBanner: FC<CommunityBannerProps> = ({ title, children }) => {
    return (
        <div className={classNames('ktl-container', styles.banner)}>
            <div className={styles.content}>
                <div className="ktl-hero">{title}</div>
                <div className={classNames('ktl-text-1', styles.text)}>{children}</div>
            </div>
            <div className={styles.image}>
                <Img src={communityBanner} sizes={[720]} densities={[1, 2]} />
            </div>
        </div>
    );
};
