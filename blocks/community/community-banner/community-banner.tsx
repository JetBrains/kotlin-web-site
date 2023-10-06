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
        <div className={classNames('ktl-layout', 'ktl-layout--center', styles.banner)} data-test="community-banner">
            <div className={styles.content}>
                <div className="ktl-hero" dangerouslySetInnerHTML={{ __html: title }} />
                <div className={classNames('ktl-text-1', styles.text)}>{children}</div>
            </div>
            <div className={styles.image}>
                <Img src={communityBanner} sizes={[476]} densities={[1, 2]} alt={'Community Banner Image'}/>
            </div>
        </div>
    );
};
