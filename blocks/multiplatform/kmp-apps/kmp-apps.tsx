import cn from 'classnames';
import { createTextCn } from '@rescui/typography';
import Img from 'next/image';

import styles from './kmp-apps.module.css';
import kmpAppsImage from './images/kmp-apps.webp';

import { useMS } from '@jetbrains/kotlin-web-site-ui/out/components/breakpoints-v2';

export const KMPApps = () => {
    const textCn = createTextCn('dark');
    const isMS = useMS();

    return (
        <div id="kmp-apps" className={cn(styles.section, 'ktl-layout ktl-layout--center')}>
            <div className={styles.wrapper}>
                <h2 className={cn(textCn(isMS ? 'rs-h3' : 'rs-h2'), styles.title)}>
                    KMP presence among the top 10K apps doubled year over year.
                </h2>
                <div className={styles.imageWrapper}>
                    <Img
                        src={kmpAppsImage}
                        alt="KMP apps"
                        className={styles.image}
                    />
                </div>
            </div>
        </div>
    );
};
