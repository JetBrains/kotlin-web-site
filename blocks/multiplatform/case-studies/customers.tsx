import CustomerLogoMarqueeSection from '../../../components/customer-logo-marquee';

import logos from '../../../components/customer-logo-marquee/server-side-logos';

export function CustomerLogos() {
    return <CustomerLogoMarqueeSection items={logos} />;
}