type ImgSrc = import('next/image').StaticImageData;

declare module '*.yml' {
    const content: any
    export default content
}

declare module "*.md";

declare module '*.webm' {
    const src: string;
    export default src;
}

declare module '*.mp4' {
    const src: string;
    export default src;
}
