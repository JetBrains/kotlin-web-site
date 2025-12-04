import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';

export function useTabSectionScroll<T extends {
    id: string
}>(TABS_BLOCKS: T[], prefix: string, onChange: (index: number) => void) {
    const router = useRouter();

    const navigateToHash = useCallback(function navigateToHash(e) {
        e.preventDefault();
        const href = e?.target?.closest('[role="tab"]')?.href;
        if (href) router.replace(href, undefined);
    }, [router]);

    useEffect(() => {
        function handleHashChange(prefix: string) {
            const hash = globalThis?.location?.hash;

            if (!hash) return;

            const i = TABS_BLOCKS.findIndex(tab => hash === `#${prefix}${tab.id}`);

            if (i === -1) return;

            onChange(i);

            const id = `${prefix}${TABS_BLOCKS[i]?.id}`;
            const el = document.getElementById(id);
            const offset = el?.offsetTop ?? 0;
            if (offset) el?.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'center' });
        }

        const handle = () => handleHashChange(prefix);

        handle();

        window.addEventListener('hashchange', handle);
        return () => window.removeEventListener('hashchange', handle);
    }, [TABS_BLOCKS, prefix, onChange]);

    return navigateToHash;
}
