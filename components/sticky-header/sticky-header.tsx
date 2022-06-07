import React, { FC } from 'react';

import styles from './sticky-header.module.css';

interface Props {
    children: React.ReactNode;
}

export const StickyHeader: FC<Props> = ({ children }) => {
    return <div className={styles.stickyHeader}>{children}</div>;
};
