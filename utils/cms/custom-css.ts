import type { CustomCss } from './content';

// The CSS is inserted as raw text into a <style> element, so only a closing tag can break out of it.
export function escapeStyleText(css: string): string {
    return css.replace(/<\/(style)/gi, '<\\/$1');
}

export function stylesheetFor(blocks: CustomCss[]): string {
    return blocks.map((block) => `/* b-${block.blockId} */\n${escapeStyleText(block.css)}`).join('\n\n');
}
