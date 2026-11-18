import { useTextStyles } from '@rescui/typography';

import styles from './cta-block.module.css';
import { Button } from '@rescui/button';
import cn from 'classnames';

const CtaBlock = () => {
    const textCn = useTextStyles();

    return (
        <section className={styles.wrapper} data-testid={'cta-block'}>
            <div className="ktl-layout ktl-layout--center">
                <h2 className={cn(textCn('rs-h1'), styles.title)} data-testid="cta-block-title">
                    Build your first app
                </h2>

                <p className={cn(textCn('rs-text-1'), styles.text)} data-testid="cta-block-subtitle">
                    Follow the guide to launch your first Compose Multiplatform app.
                </p>

                <Button
                    href="/docs/multiplatform/compose-multiplatform-create-first-app.html"
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
