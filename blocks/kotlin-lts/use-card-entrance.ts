import { useEffect, useRef } from 'react';

export function useCardEntrance<T extends HTMLElement>() {
    const ref = useRef<T>(null);

    useEffect(() => {
        const grid = ref.current;
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

        if (!grid || reducedMotion.matches || !('IntersectionObserver' in window) || !grid.animate) return;

        const animations = new Set<Animation>();
        const observer = new IntersectionObserver(
            (entries) => {
                entries.filter((entry) => entry.isIntersecting).forEach((entry, index) => {
                    observer.unobserve(entry.target);
                    if (reducedMotion.matches) return;

                    // Content stays visible by default, including without JavaScript or observer support.
                    const animation = entry.target.animate(
                        [
                            { opacity: 0, transform: 'translateY(16px)' },
                            { opacity: 1, transform: 'translateY(0)' },
                        ],
                        {
                            duration: 520,
                            delay: index * 70,
                            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
                            fill: 'backwards',
                        }
                    );
                    animations.add(animation);
                    animation.onfinish = () => animations.delete(animation);
                });
            },
            { threshold: 0, rootMargin: '0px 0px 32px 0px' }
        );

        Array.from(grid.children).forEach((card) => observer.observe(card));

        const stop = () => {
            observer.disconnect();
            animations.forEach((animation) => animation.cancel());
            animations.clear();
        };
        const onMotionChange = () => {
            if (reducedMotion.matches) stop();
        };
        reducedMotion.addEventListener('change', onMotionChange);

        return () => {
            stop();
            reducedMotion.removeEventListener('change', onMotionChange);
        };
    }, []);

    return ref;
}
