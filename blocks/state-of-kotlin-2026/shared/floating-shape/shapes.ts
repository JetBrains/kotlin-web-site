export type Shape = {
    src?: string;
    width: number;
    height: number;
};

const IMAGES = '/images/state-of-kotlin-2026';

export const SHAPES = {
    heroGradient: { width: 2328, height: 1807 },
    heroTriangle: { src: `${IMAGES}/hero-triangle.webp`, width: 917, height: 912 },
    heroHollowCylinder: { src: `${IMAGES}/hero-hollow-cylinder.webp`, width: 953, height: 982 },
    heroCylinder: { src: `${IMAGES}/hero-cylinder.webp`, width: 1067, height: 1090 },
    sphere: { src: `${IMAGES}/deco-sphere.webp`, width: 414, height: 411 },
    cylinder: { src: `${IMAGES}/deco-cylinder.webp`, width: 445, height: 412 },
    pentagon: { src: `${IMAGES}/deco-pentagon.webp`, width: 461, height: 434 },
    cube: { src: `${IMAGES}/deco-cube.webp`, width: 439, height: 391 },
    hollowCylinder: { src: `${IMAGES}/deco-hollow-cylinder.webp`, width: 402, height: 416 },
    triangle: { src: `${IMAGES}/deco-triangle.webp`, width: 415, height: 413 },
} satisfies Record<string, Shape>;
