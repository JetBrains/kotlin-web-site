import { ArrowLeftIcon, ArrowRightIcon } from '@rescui/icons';
import { Button } from '@rescui/button';
import React, { useState, useEffect, useCallback, FC } from 'react';
import cn from 'classnames';
import Img from 'next/image';
import { useML} from '@jetbrains/kotlin-web-site-ui/out/components/breakpoints-v2';

import styles from './custom-carousel.module.css';

const ANIMATION_DURATION = 300;
const AUTO_SLIDE_INTERVAL = 5000;

const calculateIndex = (current, delta, total) =>
    (current + delta + total) % total;

type Slide = {
    image: ImgSrc;
    description: React.ReactNode;
}

type CustomCarouselProps = {
    slides: Slide[];
};

export const CustomCarousel: FC<CustomCarouselProps> = ({ slides }) => {
    const isML = useML();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const numberOfElements = slides.length;

    const goToSlide = useCallback(
        index => {
            if (isAnimating) return;

            setIsAnimating(true);
            setCurrentSlide(index);

            setTimeout(() => {
                setIsAnimating(false);
            }, ANIMATION_DURATION);
        },
        [isAnimating]
    );

    const nextSlide = useCallback(() => {
        goToSlide(calculateIndex(currentSlide, 1, numberOfElements));
    }, [currentSlide, numberOfElements, goToSlide]);

    const prevSlide = useCallback(() => {
        goToSlide(calculateIndex(currentSlide, -1, numberOfElements));
    }, [currentSlide, numberOfElements, goToSlide]);

    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide();
        }, AUTO_SLIDE_INTERVAL);

        return () => clearInterval(timer);
    }, [nextSlide]);

    return (
        <div className={styles.customCarousel}>
            <div className={styles.slides}>
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={cn(styles.slide, {
                            [styles.slideActive]: index === currentSlide,
                            [styles.slidePrev]:
                                index === calculateIndex(currentSlide, -1, numberOfElements)
                        })}
                    >
                        <Img src={slide.image} alt="" className={styles.image} />
                    </div>
                ))}
            </div>

            <div className={styles.controls}>
                <div className={styles.textContainer}>
                    <div className={styles.textWrapper}>
                        {slides.map((slide, index) => (
                            <div
                                key={index}
                                className={cn(styles.text, {
                                    [styles.textActive]: index === currentSlide,
                                    [styles.textPrev]:
                                        index === calculateIndex(currentSlide, -1, numberOfElements)
                                })}
                            >
                                {slide.description}
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.buttons}>
                    <Button
                        icon={<ArrowLeftIcon />}
                        mode="outline"
                        theme="dark"
                        size={isML ? 'm' : 'l'}
                        onClick={prevSlide}
                    />
                    <Button
                        icon={<ArrowRightIcon />}
                        mode="outline"
                        theme="dark"
                        size={isML ? 'm' : 'l'}
                        onClick={nextSlide}
                    />
                </div>
            </div>
        </div>
    );
};
