import { useTextStyles } from '@rescui/typography';

import styles from './cta-block.module.css';
import { Button } from '@rescui/button';
import cn from 'classnames';

const CtaBlock = () => {
    const textCn = useTextStyles();

    return (
        <section className={styles.wrapper} data-testid={'cta-block'}>
            <div className="ktl-layout ktl-layout--center">
                <h2 className={cn(textCn('rs-h1'), styles.title)} data-testid="cta-block-title">Try Compose Multiplatform</h2>

                <p className={cn(textCn('rs-text-1'), styles.text)} data-testid="cta-block-subtitle">
                    Develop stunning shared&nbsp;UIs for&nbsp;Android, iOS, desktop, and web.
                </p>

                <Button
                    href="/docs/multiplatform/compose-multiplatform-getting-started.html"
                    size="l"
                    mode="rock"
                    className={styles.button}
                    data-testid="cta-block-button"
                >
                    Get started
                </Button>
            </div>
        </section>
    );
};

export default CtaBlock;
