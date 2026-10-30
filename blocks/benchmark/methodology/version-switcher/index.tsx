import React, { useCallback } from 'react';
import { useRouter } from 'next/router';
import { Switcher } from '@rescui/switcher';
import { useMS } from '@jetbrains/kotlin-web-site-ui/out/components/breakpoints-v2';

import styles from './version-switcher.module.css';
import { methodologyTitle, methodologyUrl, methodologyVersions } from '../versions';

const OPTIONS = methodologyVersions.map((methodology) => ({
    label: methodologyTitle(methodology),
    value: methodology.version,
}));

interface MethodologyVersionSwitcherProps {
    version: number;
}

export function MethodologyVersionSwitcher({ version }: MethodologyVersionSwitcherProps) {
    const router = useRouter();
    const size = useMS() ? 's' : 'm';

    const handleChange = useCallback(
        (value: number) => {
            if (value !== version) router.push(methodologyUrl(value));
        },
        [router, version]
    );

    // A single version needs no navigation; the switcher appears once a second one is published.
    if (OPTIONS.length < 2) return null;

    return (
        <div className={styles.versionSwitcher} data-testid="methodology-version-switcher">
            <Switcher
                mode="rock"
                theme="dark"
                size={size}
                value={version}
                onChange={handleChange}
                options={OPTIONS}
                data-e2e="methodology-version-switcher"
            />
        </div>
    );
}
