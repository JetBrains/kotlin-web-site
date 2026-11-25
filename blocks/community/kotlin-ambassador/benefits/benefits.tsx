import cn from 'classnames';

import { useTextStyles } from '@rescui/typography';

import styles from './benefits.module.css';

const BENEFITS = [
    {
        id: 'bigger-stage',
        title: 'A bigger stage for your work',
        description: 'Reach more developers by sharing your articles, talks, videos, and projects through official Kotlin channels.'
    },
    {
        id: 'kotlin-team',
        title: 'Connect with the Kotlin team',
        description:
            'Join quarterly sessions to discuss Kotlin’s direction and technical decisions. Bring your ideas, ask questions, and share feedback from your community.'
    },
    {
        id: 'peers',
        title: 'A community of peers',
        description: 'Connect with fellow Kotlin Ambassadors around the world, exchange experiences, and find people to collaborate with.'
    },
    {
        id: 'kotlinconf',
        title: 'Join us at KotlinConf',
        description: 'Get free KotlinConf tickets to learn, share, and meet the community in person.'
    },
    {
        id: 'subscription',
        title: 'Complimentary JetBrains subscription',
        description: 'Receive a free annual personal JetBrains subscription to support your work.'
    }
] as const;

export function Benefits() {
    const textCn = useTextStyles();

    return (
        <section className={styles.benefits} data-testid="kotlin-ambassador-benefits">
            <div className={cn('ktl-layout-v2', 'ktl-layout--center', styles.content)}>
                <h2 className={cn(textCn('rs-h2'), styles.title)} data-testid="kotlin-ambassador-benefits-title">
                    Benefits &amp; perks
                </h2>
                <div className={styles.grid} data-testid="kotlin-ambassador-benefits-grid">
                    {BENEFITS.map((benefit) => (
                        <div className={styles.card} key={benefit.id} data-testid="kotlin-ambassador-benefit-card">
                            <h3 className={cn(textCn('rs-h3'), styles.cardTitle)}>{benefit.title}</h3>
                            <p className={cn(textCn('rs-text-1', { hardness: 'hard' }), styles.cardText)}>
                                {benefit.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
