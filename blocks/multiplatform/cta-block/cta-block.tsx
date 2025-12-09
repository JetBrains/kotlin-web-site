import { useDL } from '@jetbrains/kotlin-web-site-ui/out/components/breakpoints-v2';
import { Button } from '@rescui/button';
import { useTextStyles } from '@rescui/typography';
import cn from 'classnames';
import Img from 'next/image';
import ctaGraphics from './images/cta-graphics.webp';
import styles from './cta-block.module.css';

export const CtaBlock = ({ url }: { url: string }) => {
    const isDL = useDL();
    const textCn = useTextStyles();
    return (
        <div className={styles.wrapper}>
            <section className="ktl-layout ktl-layout--center">
                <div className={styles.content} >
                <h2 className={cn(textCn('rs-h1'), styles.title)} data-testid={'cta-block-title'}>
                    Go cross-platform without compromises&nbsp;—<br />try Kotlin Multiplatform today.
                </h2>
                <Button className={cn(styles.button)} mode={'rock'} href={url} size={isDL ? 'l' : 'm'} data-testid={'cta-block-action'}>
                    Get Started
                </Button>
                    <Img src={ctaGraphics} alt="" className={styles.image} height={450} />
                </div>
            </section>
        </div>
    );
};
