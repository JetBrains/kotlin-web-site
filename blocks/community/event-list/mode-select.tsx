import React, { FC, useCallback, useState } from 'react';
import { DropdownMenu, MenuItem } from '@rescui/dropdown-menu';
import Button from '@rescui/button';
import { DownIcon } from '@rescui/icons';
import styles from './mode-select.module.css';
import cn from 'classnames';

export interface SelectOption {
    id: string;
    label: string;
}

interface ModeSelectProps {
    label: string;
    options: SelectOption[];
    value: SelectOption;
    className?: string;
    onSelect: (value: SelectOption) => void;
}

export const ModeSelect: FC<ModeSelectProps> = ({ label, value, options, className, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleIsOpen = useCallback(() => setIsOpen((s) => !s), [setIsOpen]);
    const handleSelect = useCallback(
        (value) => {
            onSelect(value);
            toggleIsOpen();
        },
        [onSelect, toggleIsOpen]
    );

    return (
        <div className={cn(styles.wrapper, className)}>
            <div className={'ktl-text-2'}>{label}:</div>

            <DropdownMenu
                isOpen={isOpen}
                onRequestClose={() => setIsOpen(false)}
                trigger={
                    <Button
                        onClick={toggleIsOpen}
                        mode={'clear'}
                        icon={<DownIcon />}
                        iconPosition={'right'}
                        className={styles.button}
                    >
                        {value.label}
                    </Button>
                }
            >
                {options.map((option) => (
                    <MenuItem key={option.id} selected={option.id === value.id} onClick={() => handleSelect(option)}>
                        {option.label}
                    </MenuItem>
                ))}
            </DropdownMenu>
        </div>
    );
};
