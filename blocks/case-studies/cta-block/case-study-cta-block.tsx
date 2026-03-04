import { useTS } from '@jetbrains/kotlin-web-site-ui/out/components/breakpoints-v2';
import { Button } from '@rescui/button';
import { useTextStyles } from '@rescui/typography';
import cn from 'classnames';
import styles from './case-study-cta-block.module.css';

interface CaseStudyCtaBlockProps {
    url: string;
}

export const CaseStudyCtaBlock = ({ url }: CaseStudyCtaBlockProps) => {
    const isTS = useTS();
    const textCn = useTextStyles();

    return (
        <section className="ktl-layout ktl-layout--center">
            <div className={styles.wrapper}>
                <img
                    src="/images/multiplatform/hero/logo.svg"
                    alt="Kotlin Multiplatform"
                    className={styles.logo}
                />
                <p className={cn(textCn('rs-subtitle-2', { hardness: 'hard' }), styles.title)}>
                    Create your first app with Kotlin&nbsp;Multiplatform
                </p>
                <Button href={url} size={isTS ? 'm' : 'l'}>
                    Get started
                </Button>
            </div>
        </section>
    );
};
