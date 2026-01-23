import cn from 'classnames';
import React from 'react';
import { useTextStyles } from '@rescui/typography';
import styles from './text-section.module.css';

interface TextSectionProps {
    title: string;
    children: React.ReactNode;
}

export const TextSection: React.FC<TextSectionProps> = ({ title, children }) => {
    const textCn = useTextStyles();

    return (
        <div data-testid="feature-item">
            <h3 className={cn(textCn('rs-h2'), styles.title)} data-testid="feature-title">
                {title}
            </h3>

            <p className={cn(textCn('rs-text-2', {hardness: "average"}), styles.text)} data-testid="feature-description">
                {children}
            </p>
        </div>
    );
};
