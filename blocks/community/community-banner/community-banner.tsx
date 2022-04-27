import React, {FC} from "react";
import classNames from 'classnames';

import styles from './community-banner.module.css';
import communityBanner from '../../../public/images/community/community-banner.png';
import {Image} from "../../../components/image/image";

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
                <Image src={communityBanner.src} width={communityBanner.width} height={communityBanner.height} alt="Community banner image" />
            </div>
        </div>
    );
};
