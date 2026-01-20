import { ComponentProps } from 'react';
import MD2Markdown from 'markdown-to-jsx';

type Props = ComponentProps<typeof MD2Markdown>;

export function Markdown(props: Props) {
    return <MD2Markdown {...props} />;
}
