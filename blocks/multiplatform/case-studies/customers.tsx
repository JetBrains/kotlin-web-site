import CustomerLogoMarqueeSection from '../../../components/customer-logo-marquee';

import logos from '../../../components/customer-logo-marquee/multiplatform-logos';

import styles from './customers.module.css';

export function CustomerLogos() {
    return <CustomerLogoMarqueeSection className={styles.logos} items={logos} />;
}