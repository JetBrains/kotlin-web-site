import type { Warning } from './site';
import type { ThemeName } from './themes';

export type RichText = {
    text: string;
    bold?: true;
    italic?: true;
    code?: true;
    color?: string;
    href?: string;
}[];

/**
 * Banner background images of one image-based call-out color, read from the page's
 * `<COLOR> L/M/S Banner` properties: one image per breakpoint size.
 */
export interface CalloutBanners {
    large?: string;
    medium?: string;
    small?: string;
}

export type ContentNode = { id: string } & (
    | {
          kind: 'section';
          theme: ThemeName;
          scheme: 'light' | 'dark';
          hero: boolean;
          implicit?: true;
          banners?: CalloutBanners;
          children: ContentNode[];
      }
    | {
          /** A call-out nested inside another one: rendered as a card that keeps its background to itself. */
          kind: 'callout';
          theme: ThemeName;
          scheme: 'light' | 'dark';
          banners?: CalloutBanners;
          children: ContentNode[];
      }
    | { kind: 'heading'; level: 1 | 2 | 3 | 4; text: RichText }
    | { kind: 'paragraph'; text: RichText }
    | { kind: 'grid'; columns: { id: string; ratio: number; children: ContentNode[] }[] }
    | { kind: 'button'; label: string; href?: string; external: boolean }
    | { kind: 'image'; src: string; alt: string; caption?: RichText }
    | { kind: 'divider' }
    | { kind: 'gallery'; views: GalleryView[] }
    | { kind: 'accordion'; items: AccordionItem[] }
    | { kind: 'list'; ordered: boolean; items: ListItem[] }
    | { kind: 'unsupported'; blockType: string; notionUrl: string }
);

export interface GalleryCard {
    id: string;
    href?: string;
    external: boolean;
    image?: { src: string; alt: string };
    eyebrow?: string;
    title?: string;
    tags: string[];
    relations: string[];
    meta: string[];
}

export interface GalleryView {
    id: string;
    name: string;
    layout: 'cards' | 'logos';
    preview: boolean;
    size: 'small' | 'medium' | 'large';
    columns: 2 | 3 | 4;
    imageFit: 'cover' | 'contain';
    cards: GalleryCard[];
}

export interface AccordionItem {
    id: string;
    title: RichText;
    children: ContentNode[];
}

/** One bulleted or numbered list item; nested blocks (including sublists) are its children. */
export interface ListItem {
    id: string;
    text: RichText;
    children: ContentNode[];
}

export interface CustomCss {
    blockId: string;
    css: string;
}

export interface NormalizedPage {
    id: string;
    path: string;
    title: string;
    description?: string;
    nodes: ContentNode[];
    customCss: CustomCss[];
    warnings: Warning[];
}
