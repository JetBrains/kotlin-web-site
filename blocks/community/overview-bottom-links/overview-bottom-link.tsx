import React, { FC } from 'react';
import classnames from 'classnames';
import Button from '@rescui/button';
import Link from 'next/link';

import styles from './overview-bottom-link.module.css';

interface Props {
    children: React.ReactNode;
    buttonTitle: string;
    buttonLink: string;
}

export const OverviewBottomLink: FC<Props> = ({ children, buttonTitle, buttonLink }) => {
    return (
        <div className={styles.wrapper}>
            <div className="ktl-container">
                <div className="ktl-row">
                    <div className="ktl-col">
                        <h2 className={classnames('ktl-h1', styles.title)}>{children}</h2>
                        <Link href={buttonLink}>
                            <Button size="l" mode="outline">
                                {buttonTitle}
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
