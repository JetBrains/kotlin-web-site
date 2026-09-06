import { RefObject, useEffect, useRef } from 'react';
import { useTL } from '@jetbrains/kotlin-web-site-ui/out/components/breakpoints-v2';


export type ParallaxAnchor = 'self' | 'page';

type Shape = {
    element: HTMLElement;
    depth: number;
    anchor: ParallaxAnchor;
    centre: number;
};

const shapes = new Set<Shape>();
let frame = 0;
let resizeObserver: ResizeObserver | null = null;

function layoutCentre(element: HTMLElement): number {
    let top = 0;

    for (let node: HTMLElement | null = element; node; node = node.offsetParent as HTMLElement | null) {
        top += node.offsetTop;
    }

    return top + element.offsetHeight / 2;
}

function paint() {
    frame = 0;

    const viewport = window.innerHeight;
    const scrolled = window.scrollY;

    shapes.forEach((shape) => {
        const travelled = shape.anchor === 'page' ? scrolled : scrolled + viewport / 2 - shape.centre;

        const progress = Math.min(1, Math.max(-1, travelled / viewport));

        shape.element.style.setProperty('--sok-parallax-y', `${(progress * shape.depth).toFixed(2)}px`);
    });
}

function schedule() {
    if (!frame) {
        frame = requestAnimationFrame(paint);
    }
}

function remeasure() {
    shapes.forEach((shape) => {
        shape.centre = layoutCentre(shape.element);
    });
    schedule();
}

function connect() {
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', remeasure);
    resizeObserver = new ResizeObserver(remeasure);
    resizeObserver.observe(document.body);
}

function disconnect() {
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', remeasure);
    resizeObserver?.disconnect();
    resizeObserver = null;

    if (frame) {
        cancelAnimationFrame(frame);
        frame = 0;
    }
}

export function useParallax<T extends HTMLElement>(depth: number, anchor: ParallaxAnchor): RefObject<T> {
    const ref = useRef<T>(null);
    const isNarrow = useTL();

    useEffect(() => {
        const element = ref.current;

        if (!element || isNarrow || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return undefined;
        }

        const shape: Shape = { element, depth, anchor, centre: 0 };

        shapes.add(shape);

        if (shapes.size === 1) {
            connect();
        }

        remeasure();

        return () => {
            shapes.delete(shape);
            element.style.removeProperty('--sok-parallax-y');

            if (shapes.size === 0) {
                disconnect();
            }
        };
    }, [anchor, depth, isNarrow]);

    return ref;
}
