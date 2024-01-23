import { memo, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { useInView } from 'react-intersection-observer';
import { AnimationItem, LottiePlayer } from 'lottie-web/build/player/lottie_svg';

import styles from './mascot.module.css';

type MascotProps = {
    className?: string;
};

const ANIMATION_INITIAL_DELAY = 1500 as const;
const ANIMATION_AFTER_DELAY = 7000 as const;

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function createAnimation(
    lottie: LottiePlayer,
    node: Element,
    animationData: Record<string, unknown>
): [AnimationItem, () => Promise<void>] {
    const animation = lottie.loadAnimation({
        container: node,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        animationData,
    });

    const animationComplete = new Promise((resolve) => {
        function done() {
            animation.removeEventListener('complete', done);
            resolve(null);
        }

        animation.addEventListener('complete', done);
    });

    return [
        animation,
        async () => {
            animation.play();
            await animationComplete;
            animation.destroy();
        },
    ];
}

function MascotContent({ className, onFinish }: MascotProps & { onFinish: () => void }) {
    const mascotNode = useRef<HTMLSpanElement>(null);
    const { ref: inViewRef, inView } = useInView();

    useEffect(() => {
        const node = mascotNode.current;

        let animation: AnimationItem;
        let play: ReturnType<typeof createAnimation>[1];

        let wasOnceStarted = false;

        function done() {
            if (wasOnceStarted) onFinish();
        }

        let cancelable: (body: () => Promise<void>) => ReturnType<typeof body> = (body) => body();

        async function playAnimation() {
            const [lottie, initialData] = await Promise.all([
                import('lottie-web/build/player/lottie_svg').then((l) => l.default),
                import('./option3.json'),
                sleep(ANIMATION_INITIAL_DELAY),
            ]);

            await cancelable(async () => {
                [animation, play] = createAnimation(lottie, node, initialData);
                wasOnceStarted = true;
                await play();
            });

            await cancelable(async () => {
                const [afterData] = await Promise.all([import('./option4.json'), sleep(ANIMATION_AFTER_DELAY)]);
                [animation, play] = createAnimation(lottie, node, afterData);
                await play();
            });

            done();
        }

        if (node && inView) {
            playAnimation();
            return () => {
                cancelable = async () => {};
                animation?.destroy();
                done();
            };
        }
    }, [mascotNode.current, inView]);

    return (
        <div ref={inViewRef} className={cn(styles.container, className)}>
            <span ref={mascotNode} className={styles.animation} />
        </div>
    );
}

export default memo(function Mascot(props: MascotProps) {
    const [isComplete, setComplete] = useState(false);
    return isComplete ? null : <MascotContent {...props} onFinish={() => setComplete(true)} />;
});
