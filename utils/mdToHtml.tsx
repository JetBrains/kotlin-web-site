import { ComponentProps } from 'react';
import MD2Markdown from 'markdown-to-jsx';

export type MarkdownProps = ComponentProps<typeof MD2Markdown>;

export function Markdown(props: MarkdownProps) {
    return <MD2Markdown {...props} />;
}
