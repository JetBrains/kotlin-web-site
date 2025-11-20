import { useState } from 'react';
import cn from 'classnames';

import { useTextStyles } from '@rescui/typography';
import { Chip, ChipList } from '@rescui/chip-list';

import styles from './choose-to-share.module.css';

const ContentSwitcher = ({ index, children }) => {
    return children[index];
};

export function ChooseToShare() {
    const textCn = useTextStyles();
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <div className={cn(styles.chooseToShare, 'ktl-layout', 'ktl-layout--center')}>
            <h2 className={cn(styles.title, textCn('rs-h1'))}>Choose what to share</h2>
            <ChipList
                size={'l'}
                alignItems={'center'}
                compact={ true}
                value={activeIndex}
                onChange={v => setActiveIndex(v)}
                className="rs-docs-offset-top-12"
            >
                <Chip>Both logic and UI</Chip>
                <Chip>Logic with native&nbsp;UI</Chip>
                <Chip>Piece of logic</Chip>
            </ChipList>

            <ContentSwitcher index={activeIndex}>
                <div>First</div>
                <div>Second</div>
                <div>Third</div>
            </ContentSwitcher>
        </div>
    );
}