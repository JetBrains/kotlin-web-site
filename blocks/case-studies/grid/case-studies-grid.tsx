import React from 'react';

export const CaseStudiesGrid: React.FC = () => {
    // Placeholder items; in future this could be driven by data files
    const items = [
        { id: 1, title: 'Company A', summary: 'Using Kotlin for server-side microservices.' },
        { id: 2, title: 'Company B', summary: 'Migrated Android app to Kotlin.' },
        { id: 3, title: 'Company C', summary: 'Kotlin Multiplatform for shared code.' }
    ];

    return (
        <section data-testid="case-studies-grid" aria-label="Case Studies Grid">
            <h2>Case studies</h2>
            <div role="list">
                {items.map((it) => (
                    <article key={it.id} role="listitem" aria-label={it.title}>
                        <h3>{it.title}</h3>
                        <p>{it.summary}</p>
                    </article>
                ))}
            </div>
        </section>
    );
};
