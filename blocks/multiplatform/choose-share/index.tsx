import { ChooseShareWhat } from '../choose-share-what';

import styles from './choose-share.module.css';

export function ChooseShare() {
    return (
        <div className={styles.wrap}>
            <ChooseShareWhat />
        </div>
    );
}