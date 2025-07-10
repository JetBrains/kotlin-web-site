import React, { FC } from 'react';
import classNames from 'classnames';
import { useTextStyles } from '@rescui/typography';
import SwipeableViews from 'react-swipeable-views';
import { Button } from '@rescui/button';
import { CodeHighlight } from '../../../components/code-highlight/code-highlight';

import styles from './index.module.css';

interface FeatureSlideItem {
  id: string;
  icon: ImgSrc;
  title: React.ReactNode;
  description: React.ReactNode;
  codeSample: string;
}

interface CopyCodeButtonProps {
  codeSample: string;
}

const CopyCodeButton: FC<CopyCodeButtonProps> = ({ codeSample }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(codeSample);
  };

  return (
    <Button
      size="xs"
      mode="rock"
      theme="dark"
      onClick={handleCopy}
      className={styles.copyButton}
    >
      Copy Kotlin code
    </Button>
  );
};

interface FeatureCardProps {
  icon: ImgSrc;
  title: React.ReactNode;
  description: React.ReactNode;
  codeSample: string;
  className?: string;
}

const FeatureCard: FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  codeSample,
  className
}) => {
  const textCn = useTextStyles();

  return (
    <div className={classNames(styles.featureCard, className)}>
      <div className={styles.content}>
        <div className={styles.contentText}>
          <div className={styles.contentIcon}>
              <img className="" src={icon.src} alt="404"/>
          </div>
          <h3 className={classNames(textCn('rs-h3'), 'jb-offset-top-16')}>{title}</h3>
          <p
            className={classNames(
              textCn('rs-text-2', { hardness: 'hard' }),
              'jb-offset-top-8'
            )}
          >
            {description}
          </p>
        </div>
      </div>
      <div className={styles.imageWrapper}>
        <CopyCodeButton codeSample={codeSample} />
        <CodeHighlight code={codeSample} className={styles.codeBlock} />
      </div>
    </div>
  );
};

interface FeaturesCarouselProps {
  featuresData: FeatureSlideItem[];
  className?: string;
}

export const FeaturesCarousel: FC<FeaturesCarouselProps> = ({ featuresData, className }) => (
  <SwipeableViews className={classNames(styles.carousel, className)}>
    {featuresData.map(feature => (
      <FeatureCard
        className={styles.slide}
        key={feature.id}
        {...feature}
      />
    ))}
  </SwipeableViews>
);

export default FeaturesCarousel;
