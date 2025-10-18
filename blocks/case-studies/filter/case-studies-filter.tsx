import cn from 'classnames';
import React from 'react';
import { useMM } from '@jetbrains/kotlin-web-site-ui/out/components/breakpoints';
import Switcher from '@rescui/switcher';
import Checkbox from '@rescui/checkbox';
import { createTextCn } from '@rescui/typography';
import styles from './case-studies-filter.module.css';
import { CasePlatform, CaseTypeSwitch, PlatformNames, Platforms } from '../case-studies';
import { useQueryState } from '../../../hooks';
import { parseCompose, parsePlatforms, parseType, serializeCompose, serializePlatforms, serializeType } from '../utils';

const caseTypeOptions: Array<{ value: CaseTypeSwitch, label: string }> = [
    { value: 'all', label: 'All' },
    { value: 'multiplatform', label: 'Kotlin Multiplatform' },
    { value: 'server-side', label: 'Server-side' }
];

export const CaseStudiesFilter: React.FC = () => {
    const darkTextCn = createTextCn('dark');
    const isMm = useMM();

    // State synchronized with URL
    const [type, setType] = useQueryState<CaseTypeSwitch>('type', parseType, serializeType);
    const [platforms, setPlatforms] = useQueryState<CasePlatform[]>('platforms', parsePlatforms, serializePlatforms);
    const [compose, setCompose] = useQueryState<boolean>('compose', parseCompose, serializeCompose);

    const togglePlatform = (id: CasePlatform) => {
        let nextPlatforms = platforms.includes(id)
            ? platforms.filter((x) => x !== id)
            : [...platforms, id];
        if (nextPlatforms.length === 0) {
            // If user unchecks all, reset to all selected
            nextPlatforms = [...Platforms];
        }
        setPlatforms(nextPlatforms);
    };

    const toggleCompose = () => {
        const nextCompose = !compose;
        setCompose(nextCompose, () => setType('multiplatform'));
    };

    const showKmpFilters = type === 'multiplatform' || type === 'all';

    return (
        <section className="ktl-layout ktl-layout--center" data-testid="case-studies-filter"
                 aria-label="Case Studies Filter">
            <div className={styles.content}>
                <div className={styles.group} role="group" aria-labelledby="case-study-type-title"
                     data-test="filter-type">
                    <h3 id="case-study-type-title" className={cn(styles.groupTitle, darkTextCn('rs-h4'))}>Case study
                        type</h3>
                    <Switcher mode="rock" value={type} onChange={setType} options={caseTypeOptions} compact={true}
                              size={isMm ? 's' : 'm'} />
                </div>

                {showKmpFilters && (
                    <div className={styles.group} role="group" aria-labelledby="code-shared-across-titile"
                         data-test="filter-code-shared">
                        <h3 id="code-shared-across-titile"
                            className={cn(styles.groupTitle, darkTextCn('rs-h4'))}>Code shared across</h3>
                        <div className={styles.checkboxes}>
                            {Platforms.map((platformId) =>
                                <Checkbox
                                    key={platformId}
                                    checked={platforms.includes(platformId)}
                                    onChange={() => togglePlatform(platformId)}
                                    mode="classic"
                                    size="m"
                                >
                                    {PlatformNames[platformId]}
                                </Checkbox>
                            )}
                        </div>
                    </div>
                )}

                {showKmpFilters && (
                    <div className={styles.group} role="group" aria-labelledby="ui-technology-title"
                         data-test="filter-ui-technology">
                        <h3 id="ui-technology-title"
                            className={cn(styles.groupTitle, darkTextCn('rs-h4'))}>UI&nbsp;technology</h3>
                        <div className={styles.checkboxes}>
                            <Checkbox
                                className={styles.checkbox}
                                checked={compose}
                                onChange={toggleCompose}
                                mode="classic"
                                size="m"
                            >
                                <span className={styles.composeLabel}>
                                    Built with Compose Multiplatform <img
                                    src="/images/case-studies/compose-multiplatform.svg" alt="" />
                                </span>
                            </Checkbox>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
};
