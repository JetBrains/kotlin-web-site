import { memo, useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { useInView } from 'react-intersection-observer';
import lottie, { AnimationItem } from 'lottie-web/build/player/lottie_svg';

import initialData from './option3.json';

import styles from './mascot.module.css';

type MascotAnimationProps = {
    className?: string;
};

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function createAnimation(node: Element, animationData: Record<string, unknown>): [AnimationItem, () => Promise<void>] {
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

function MascotContent({ className, onFinish }: MascotAnimationProps & { onFinish: () => void }) {
    const mascotNode = useRef<HTMLSpanElement>(null);
    const { ref: inViewRef, inView } = useInView();

    useEffect(() => {
        let animation: AnimationItem;
        const node = mascotNode.current;
        let isStarted = false;

        function done() {
            if (isStarted) onFinish();
        }

        let cancelable: (body: () => Promise<void>) => ReturnType<typeof body> = (body) => body();

        async function playAnimation() {
            await sleep(1000);

            await cancelable(async () => {
                let play: ReturnType<typeof createAnimation>[1];
                [animation, play] = createAnimation(node, initialData);
                isStarted = true;
                await play();
            });

            await cancelable(async () => {
                let play: ReturnType<typeof createAnimation>[1];
                const [secondData] = await Promise.all([import('./option4.json'), sleep(5000)]);
                [animation, play] = createAnimation(node, secondData);
                await play();
            });

            done();
        }

        if (node && inView) {
            playAnimation();
            return () => {
                animation?.destroy();
                cancelable = async () => {};
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

export default memo(function Mascot(props: MascotAnimationProps) {
    const [isComplete, setComplete] = useState(false);
    return isComplete ? null : <MascotContent {...props} onFinish={() => setComplete(true)} />;
});
