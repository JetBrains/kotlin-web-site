import { getText } from './record';

export function isHidden(block: Record<string, any>): boolean {
    const text = getText(block).trimStart();
    return text.startsWith('🎛') || text.startsWith('[hidden]');
}
