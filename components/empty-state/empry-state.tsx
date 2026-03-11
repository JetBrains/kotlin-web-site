import cn from 'classnames';
import { useTextStyles } from '@rescui/typography';
import styles from './empty-state.module.css';
import mascot from './mascot-empty-state.svg';

export const EmptyState: React.FC<{
    text?: string;
}> = ({
          text = 'Nothing matches your current filters.\r\nTry adjusting them to see more options.'
      }) => {

    const textCn = useTextStyles();
    return (
        <div className={styles.wrapper}>
            <img className={styles.image} src={mascot.src} alt="" />
            <p className={cn(textCn('rs-text-2'), styles.text)}>{text}</p>
        </div>
    );
};