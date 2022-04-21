import React, {FC} from "react";
import classnames from 'classnames';
import Button from '@rescui/button';
import Link from 'next/link'

import styles from './overview-bottom-link.module.css';

interface Props {
    title: string,
    buttonTitle: string,
    buttonLink: string,
    imageSrc: string,
    reversed?: boolean
}

export const OverviewBottomLink: FC<Props> = ({title, buttonTitle, buttonLink, imageSrc, reversed}) => {

    const rowClassName = classnames('ktl-row', reversed && 'ktl-row--reverse', styles.row)

    return (
        <div className={styles.wrapper}>
            <div className="ktl-container">
                <div className={rowClassName}>
                    <div className='ktl-col-12 ktl-col-sm-6'>
                        <h2 className={classnames('ktl-h1', styles.title)}>
                            {title}
                        </h2>
                        <Link href={buttonLink}>
                            <Button size="l" mode="outline">{buttonTitle}</Button>
                        </Link>
                    </div>
                    <div className='ktl-col-12 ktl-col-sm-6'>
                        <div className={styles.image}>
                            <img src={imageSrc} alt=""/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
