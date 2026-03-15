import { ComponentProps } from 'react';
import { useTextStyles } from '@rescui/typography';
import MD2Markdown from 'markdown-to-jsx';
import YoutubePlayer from '@jetbrains/kotlin-web-site-ui/out/components/youtube-player';

export type MarkdownProps = ComponentProps<typeof MD2Markdown>;

export function Markdown(props: MarkdownProps) {
    const textCn = useTextStyles();
    const linkClass = textCn('rs-link');
    const overriddenClassNamesForTags = {
        a: {
            props: {
                className: linkClass
            }
        },
        YoutubePlayer: {
            component: YoutubePlayer
        }
    };
    return <MD2Markdown
        {...props}
        options={{
            ...props.options,
            overrides: {
                ...overriddenClassNamesForTags,
                ...props.options?.overrides,
            }
        }}
    />;
}
