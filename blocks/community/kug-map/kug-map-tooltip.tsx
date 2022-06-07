import React, { FC, useCallback } from 'react';
import styles from './kug-map-tooltip.module.css';
import { UserGroupEntity } from './kug-map';
import { CloseIcon } from '@rescui/icons';
import cn from 'classnames';
import { useTextStyles } from '@jetbrains/kotlin-web-site-ui/out/components/typography';

interface KugMapTooltipProps {
    group: UserGroupEntity;
    onClose: (key: string) => void;
}

export const KugMapTooltip: FC<KugMapTooltipProps> = ({ group, onClose }) => {
    const textCn = useTextStyles();
    const linkClass = textCn('rs-link', { hardness: 'hard', mode: 'rock' });

    const handleClick = useCallback(
        (event) => {
            event.stopPropagation();
            onClose('');
        },
        [onClose]
    );

    return (
        <div className={cn('ktl-text-3', styles.tooltip)}>
            <div className={styles.content}>
                <div>
                    <a href={group.url} target="_blank" rel="noopener noreferrer" className={linkClass}>
                        {group.name}
                    </a>
                    <div className={styles.appendix}>{group.country}</div>
                </div>

                <CloseIcon size="s" className={styles.closeIcon} onClick={handleClick} />
            </div>
        </div>
    );
};
