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
    heroCylinder: { src: `${IMAGES}/hero-cylinder.webp`, width: 1067, height: 1090 }
} satisfies Record<string, Shape>;
