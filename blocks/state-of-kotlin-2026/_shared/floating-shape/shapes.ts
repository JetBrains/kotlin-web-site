export type Shape = {
    src?: string;
    width: number;
    height: number;
};

const IMAGES = '/images/state-of-kotlin-2026';

export const SHAPES = {
    heroGradient: { width: 2328, height: 1807 },
    heroTriangle: { src: `${IMAGES}/hero-triangle.png`, width: 917, height: 912 },
    heroHollowCylinder: { src: `${IMAGES}/hero-hollow-cylinder.png`, width: 953, height: 982 },
    heroCylinder: { src: `${IMAGES}/hero-cylinder.png`, width: 1067, height: 1090 },
    sphere: { src: `${IMAGES}/deco-sphere.png`, width: 414, height: 411 },
    cylinder: { src: `${IMAGES}/deco-cylinder.png`, width: 445, height: 412 },
    pentagon: { src: `${IMAGES}/deco-pentagon.png`, width: 461, height: 434 },
    cube: { src: `${IMAGES}/deco-cube.png`, width: 439, height: 391 },
    hollowCylinder: { src: `${IMAGES}/deco-hollow-cylinder.png`, width: 402, height: 416 },
    triangle: { src: `${IMAGES}/deco-triangle.png`, width: 415, height: 413 },
} satisfies Record<string, Shape>;
