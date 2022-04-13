import React, {FC} from "react";
import classNames from 'classnames';
import Image from 'next/image';

import styles from './community-banner.module.css';
import communityBanner from '../../public/images/community-banner.png';

interface CommunityBannerProps {
    title: string;
    children: React.ReactNode
}

export const CommunityBanner: FC<CommunityBannerProps> = ({title, children}) => {
    return (
        <div className={classNames('ktl-container', styles.banner)}>
            <div className={styles.content}>
                <div className="ktl-hero">{title}</div>
                <div className={classNames('ktl-text-1', styles.text)}>
                    {children}
                </div>
            </div>
            <div className={styles.image}>
                <Image src={communityBanner} alt="Community banner image" />
            </div>
        </div>
    );
};
