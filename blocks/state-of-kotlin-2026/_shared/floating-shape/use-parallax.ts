import { RefObject, useEffect, useRef } from 'react';
import { useTL } from '@jetbrains/kotlin-web-site-ui/out/components/breakpoints-v2';


export type ParallaxAnchor = 'self' | 'page';

type Shape = {
    element: HTMLElement;
    /** how far, in px, the shape lags the page over one viewport of scrolling */
    depth: number;
    anchor: ParallaxAnchor;
    /** distance from the top of the document to the middle of the shape's layout box */
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
    /*
     * The page keeps growing after the first paint — lazy images arrive, the charts lay
     * themselves out — and each of those pushes the shapes below it down. Watching the body
     * catches that; `resize` on its own would leave them measured against a stale layout.
     */
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

/**
 * Registers the returned ref's element with the shared parallax loop. The ref is simply never
 * registered where the effect isn't wanted: below the desktop breakpoints, where the travel
 * would amount to a few px on a shape the design has already shrunk, and whenever the visitor
 * has asked for reduced motion.
 */
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
