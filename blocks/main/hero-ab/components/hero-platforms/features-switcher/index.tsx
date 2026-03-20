import React, { FC, useCallback, useState } from 'react';
import classNames from 'classnames';
import { useTextStyles } from '@rescui/typography';
import { Button } from '@rescui/button';
import { CodeHighlight } from '@/components/code-highlight/code-highlight';

import styles from './index.module.css';

interface CustomSlideProps {
    codeSample: string;
    label: string;
}

const CustomSlide: FC<CustomSlideProps> = ({ codeSample, label }) => (
    <div className={styles.slide}>
        <Button size="m" mode="rock" theme="dark" href="/" className={styles.copyButton}>
            Learn more
        </Button>
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

                                {i === currentSlideIndex && (<img src={slide.icon.src} alt={`${slide.title} icon`} />)}

                                <p className={classNames(textCn('rs-h3'), styles.tabTitle)}>{slide.title}</p>

                                {i === currentSlideIndex && (
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
