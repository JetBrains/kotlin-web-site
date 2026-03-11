
import styles from './hightlighed-bg.module.css';

export function HighlightedBg({children}) {
    return (
      <div className={styles.highlightedBg}>
          {children}
      </div>
    );
}