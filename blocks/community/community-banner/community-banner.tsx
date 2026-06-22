import React, { FC } from 'react';
import classNames from 'classnames';

import styles from './community-banner.module.css';
import Image from 'next/image';
import communityBanner from '../../../public/images/community/community-banner.png';

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
                <Image src={communityBanner} width={476} alt={'Community Banner Image'} sizes="476px" />
            </div>
        </div>
    );
};
