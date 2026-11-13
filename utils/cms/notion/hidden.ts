import { getText } from './record';

/**
 * Blocks that must never appear on the public site: those marked with the 🎛 / [hidden] convention and,
 * per the styling spec, every element with a brown background — brown is reserved for system messages.
 */
export function isHidden(block: Record<string, any>): boolean {
    const text = getText(block).trimStart();
    if (text.startsWith('🎛') || text.startsWith('[hidden]')) return true;

    return /^brown(_background)?$/i.test(block?.format?.block_color ?? '');
}
