import cn from 'classnames';

import { ColumnedFaq } from '../../../components/columned-faq/columned-faq';

import { FAQ_ITEMS } from './faq-data';
import styles from './faq.module.css';

export const FaqBlock = () => (
    <section className={cn(styles.wrapper, 'ktl-layout', 'ktl-layout--center')} data-testid="faq-block">
        <ColumnedFaq title="FAQ" items={FAQ_ITEMS} />
    </section>
);
