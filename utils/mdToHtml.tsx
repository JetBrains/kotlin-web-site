import { ComponentProps } from 'react';
import { useTextStyles } from '@rescui/typography';
import MD2Markdown from 'markdown-to-jsx';

export type MarkdownProps = ComponentProps<typeof MD2Markdown>;

export function Markdown(props: MarkdownProps) {
    const textCn = useTextStyles();
    const linkClass = textCn('rs-link');
    const overriddenClassNamesForTags = {
        a: {
            props: {
                className: linkClass
            }
        }
    };
    return <MD2Markdown
        {...props}
        options={{
            ...props.options,
            overrides: {
                ...props.options?.overrides,
                ...overriddenClassNamesForTags
            }
        }}
    />;
}
