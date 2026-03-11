import React, { FC, useCallback, useState } from 'react';
import classNames from 'classnames';
import { useTextStyles } from '@rescui/typography';
import { Button } from '@rescui/button';
import { CodeHighlight } from '../../../components/code-highlight/code-highlight';

import styles from './index.module.css';
import { trackEvent } from '../../../utils/event-logger';

interface CopyCodeButtonProps {
    codeSample: string;
    label: string;
}

const CopyCodeButton: FC<CopyCodeButtonProps> = ({ codeSample, label }) => {
    const handleCopy = () => {
        trackEvent({
            eventAction: 'kt_server_side_code_snippet_copy',
            eventLabel: label,
        });
        navigator.clipboard.writeText(codeSample);
    };

    return (
        <Button size="xs" mode="rock" theme="dark" onClick={handleCopy} className={styles.copyButton}>
            Copy Kotlin code
        </Button>
    );
};

interface CustomSlideProps {
    codeSample: string;
    label: string;
}

const CustomSlide: FC<CustomSlideProps> = ({ codeSample, label }) => (
    <div className={styles.slide}>
        <CopyCodeButton codeSample={codeSample} label={label} />
        <CodeHighlight code={codeSample} className={styles.codeBlock} />
    </div>
);

interface FeatureSlideItem {
    id: string;
    icon: ImgSrc;
    title: React.ReactNode;
    description: React.ReactNode;
    codeSample: string;
}

interface FeaturesSwitcherProps {
    slides: FeatureSlideItem[];
    className?: string;
    onTab?: (label: string) => void
}

export const FeaturesSwitcher: FC<FeaturesSwitcherProps> = ({ slides, className, onTab }) => {
    const textCn = useTextStyles();
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

    const onSelect = useCallback((index: number, id: string) => {
        setCurrentSlideIndex(index);

        if (onTab) {
            onTab(id);
        }
    }, []);

    return (
        <div className={classNames(styles.slideshow, className)}>
            <div className={styles.slidesPanel}>
                <ul className={styles.slidesSwitcher}>
                    {slides.map((slide, i) => (
                        <li className={i === 0 ? '' : styles.offsettop12} key={slide.id}>
                            <button
                                type="button"
                                tabIndex={0}
                                onClick={() => onSelect(i, slide.id)}
                                className={classNames(styles.tab, i === currentSlideIndex ? styles.tabActive : '')}
                            >

                                <p className={classNames(textCn('rs-h3'), styles.tabTitle)}>{slide.title}</p>

                                { i === currentSlideIndex && (
                                    <p
                                        className={classNames(
                                            textCn('rs-text-2', {
                                                hardness: 'hard',
                                            }),
                                            styles.tabDescription
                                        )}
                                    >
                                        {slide.description}
                                    </p>
                                )}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className={styles.slides}>
                {slides.map((slide, i) => (
                    <div
                        key={slide.id}
                        className={classNames(
                            styles.slide,
                            i === currentSlideIndex || (currentSlideIndex === -1 && i === 0)
                                ? styles.slideVisible
                                : styles.slideHidden
                        )}
                    >
                        <CustomSlide key={slide.id} label={slide.title.toString()} {...slide} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FeaturesSwitcher;
