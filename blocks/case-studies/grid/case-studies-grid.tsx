import React from 'react';

import caseStudiesDataRaw from '../../../data/case-studies/case-studies.yml';
import { CaseStudyCard } from '../card/case-studies-card';
import styles from './case-studies-grid.module.css';

export const CaseStudiesGrid: React.FC = () => {
  return (
    <section data-testid="case-studies-grid" aria-label="Case Studies Grid">
      <h2>Case studies</h2>
      <div role="list" className={styles['masonry-tiles-container']}>
        {caseStudiesDataRaw.items.map((it) => (
          <div
            key={it.id}
            role="listitem"
            className={styles['masonry-tile']}
          >
            <CaseStudyCard item={{ ...it }} />
          </div>
        ))}
      </div>
    </section>
  );
};