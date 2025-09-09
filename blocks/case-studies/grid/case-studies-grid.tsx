import React from 'react';

import caseStudiesDataRaw from '../../../data/case-studies/case-studies.yml';
import { CaseStudyCard } from '../card/case-studies-card';

export const CaseStudiesGrid: React.FC = () => {

    return (
        <section data-testid="case-studies-grid" aria-label="Case Studies Grid" style={{ backgroundColor: '#f9f9f9' }}>
            <h2>Case studies</h2>
            {JSON.stringify(caseStudiesDataRaw, null, 2)}


            <div role="list">
                <hr />
                {caseStudiesDataRaw.items.map((it) => (
                        <CaseStudyCard
                            item={{ ...it }}
                        />
                ))}
            </div>
        </section>
    );
};