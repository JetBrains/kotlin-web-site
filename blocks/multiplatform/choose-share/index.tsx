import { ChooseShareWhat } from '../choose-share-what';
import { ChooseShareWhere } from '../choose-share-where';

import styles from './choose-share.module.css';

export function ChooseShare() {
    return (
        <div className={styles.wrap}>
            <ChooseShareWhat className={styles.what} />
            <ChooseShareWhere className={styles.where} />
        </div>
    );
}