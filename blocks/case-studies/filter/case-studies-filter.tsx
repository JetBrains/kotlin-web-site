import React, { useCallback, useId, useMemo, useState } from 'react';
import Switcher from '@rescui/switcher';
import Checkbox from '@rescui/checkbox';
import { createTextCn } from '@rescui/typography';
import '@jetbrains/kotlin-web-site-ui/out/components/layout';
import styles from './case-studies-filter.module.css';

export const CaseStudiesFilter: React.FC = () => {
    const darkTextCn = createTextCn('dark');
    // Case study type switcher
    const typeOptions = useMemo(
        () => [
            { value: 'all', label: 'All' },
            { value: 'kotlin-multiplatform', label: 'Kotlin Multiplatform' },
            { value: 'server-side', label: 'Server-side' },
        ], []
    );
    const [type, setType] = useState<string>('all');
    const onTypeChange = useCallback((value: string) => setType(value), []);

    // Code shared across (checkboxes)
    const codeSharedOptions = useMemo(
        () => [
            { id: 'android', label: 'Android' },
            { id: 'ios', label: 'iOS' },
            { id: 'desktop', label: 'Desktop' },
            { id: 'frontend', label: 'Frontend' },
            { id: 'backend', label: 'Backend' },
        ], []
    );
    const [codeShared, setCodeShared] = useState<string[]>([]);
    const toggleCodeShared = useCallback((id: string) => {
        setCodeShared((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    }, []);

    // UI Technology (checkboxes)
    const uiTechOptions = useMemo(
        () => [
            { id: 'built-with-compose-multiplatform', label: 'Built with Compose Multiplatform' },
        ], []
    );
    const [uiTech, setUiTech] = useState<string[]>([]);
    const toggleUiTech = useCallback((id: string) => {
        setUiTech((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    }, []);

    // for accessibility ids
    const typeTitleId = useId();
    const codeSharedTitleId = useId();
    const uiTechTitleId = useId();

    return (
        <section data-testid="case-studies-filter" aria-label="Case Studies Filter" className={styles.wrapper}>
            <div className={'ktl-layout ktl-layout--center'}>
                <h2 className={styles.title}>
                    <span className={darkTextCn('rs-h4')}>Filters</span>
                </h2>
                <div className={styles.inner}>
                    {/* Case study type */}
                    <div className={`${styles.group} ${styles.groupType}`} role="group" aria-labelledby={typeTitleId} data-test="filter-type">
                        <h3 id={typeTitleId} className={styles.groupTitle}><span className={darkTextCn('rs-h4')}>Case study type</span></h3>
                        <div className={styles.switcherSmall}>
                            <Switcher mode={'rock'} value={type} onChange={onTypeChange} options={typeOptions} />
                        </div>
                    </div>

                    {/* Code shared across */}
                    <div className={styles.group} role="group" aria-labelledby={codeSharedTitleId} data-test="filter-code-shared">
                        <h3 id={codeSharedTitleId} className={styles.groupTitle}><span className={darkTextCn('rs-h4')}>Code shared across</span></h3>
                        <div className={styles.checkboxes}>
                            {codeSharedOptions.map((opt) => {
                                const id = `code-shared-${opt.id}`;
                                const checked = codeShared.includes(opt.id);
                                return (
                                    <Checkbox
                                        key={opt.id}
                                        checked={checked}
                                        onChange={() => toggleCodeShared(opt.id)}
                                        mode="classic"
                                        size="m"
                                    >
                                        {opt.label}
                                    </Checkbox>
                                );
                            })}
                        </div>
                    </div>

                    {/* UI technology */}
                    <div className={styles.group} role="group" aria-labelledby={uiTechTitleId} data-test="filter-ui-technology">
                        <h3 id={uiTechTitleId} className={styles.groupTitle}><span className={darkTextCn('rs-h4')}>UI technology</span></h3>
                        <div className={styles.checkboxes}>
                            {uiTechOptions.map((opt) => {
                                const id = `ui-tech-${opt.id}`;
                                const checked = uiTech.includes(opt.id);
                                return (
                                    <Checkbox
                                        key={opt.id}
                                        checked={checked}
                                        onChange={() => toggleUiTech(opt.id)}
                                        mode="classic"
                                        size="m"
                                    >
                                        {opt.label}
                                    </Checkbox>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
