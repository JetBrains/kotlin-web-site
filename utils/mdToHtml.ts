/**
 * Very small markdown -> HTML for headers (#), paragraphs, bold (**text**) and links [text](url).
 * Safe subset suitable for our content. Extend if needed.
 */
export const mdToHtml = (md: string) => {
    let result = md;

    // Headers: # h1, ## h2, etc. (process before escaping since we allow HTML)
    result = result.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    result = result.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    result = result.replace(/^# (.+)$/gm, '<h2>$1</h2>'); // Using h2 for h1 to keep semantic structure

    // Bold: **text**
    result = result.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

    // Links: [text](url)
    result = result.replace(
        /\[([^\]]+?)\]\((https?:\/\/[^\s)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    );

    // Paragraphs: split by double newline and wrap non-header lines in <p>
    result = result
        .split(/\n\n+/)
        .map(block => {
            const trimmed = block.trim();
            if (!trimmed) return '';
            // Don't wrap if it's already a heading or other HTML tag
            if (trimmed.startsWith('<h') || trimmed.startsWith('<p>')) {
                return trimmed;
            }
            return `<p>${trimmed}</p>`;
        })
        .join('\n');

    return result;
};
