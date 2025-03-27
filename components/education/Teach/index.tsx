import React from 'react';
import { SlackIcon } from '@rescui/icons';
import Button from '@rescui/button';
import { useTextStyles } from '@rescui/typography';
import YoutubePlayer from '@jetbrains/kotlin-web-site-ui/out/components/youtube-player';

import { TeachCtaBlock } from './components/TeachCtaBlock';
import { TeachTopMenu } from './components/TeachTopMenu';
import { TeachNumbers } from './components/TeachNumbers';
import { TeachQuotes } from './components/TeachQuotes';
import { TeachMap } from './components/TeachMap';
import { TeachLaunchCourse } from './components/TeachLaunchCourse';
import { SubscriptionForm } from './components/SubscriptionForm';

import '@jetbrains/kotlin-web-site-ui/out/components/typography';
import '@jetbrains/kotlin-web-site-ui/out/components/grid';
import '@rescui/typography';
import './styles.module.scss';

interface TeachProps {
  path: string;
  countriesCount: number;
  universitiesCount: number;
}

export default function Teach({ path, countriesCount, universitiesCount }: TeachProps) {
  const textCn = useTextStyles();

  return (
    <div className="teach-wrapper" data-test="teach-index-page">
      <TeachTopMenu path={path} />
      <section className="ktl-layout ktl-layout--center ktl-offset-top-xl">
        <h1 className="ktl-hero ktl-offset-bottom-xxl">Teach Computer Science with&nbsp;Kotlin</h1>

        <TeachLaunchCourse />

        <div className="teach-top-mobile-buttons">
          <Button
            icon={<SlackIcon />}
            href="https://surveys.jetbrains.com/s3/kotlin-slack-signup-educators"
            target="_blank"
            rel="noopener"
            className="teach-cta-block-button"
          >
            Join Educators Сommunity
          </Button>

          <Button mode="outline" href="/education/why-teach-kotlin" className="teach-cta-block-button">
            Why Teach Kotlin&nbsp;→
          </Button>
        </div>

        <div className="teach-features ktl-row ktl-offset-top-l">
          <div className="ktl-col-12 ktl-col-md-4">
            <div className="teach-feature">
              <div className="teach-feature__icon ktl-offset-bottom-m">
                <img
                  src="/images/ktl-component/teach/icons/teach-academically-recognized-icon.svg"
                  alt="Academically recognized"
                />
              </div>

              <div className="teach-feature__content">
                <div className="ktl-h3 ktl-offset-bottom-s">Academically recognized</div>
                <div className="ktl-text-2">
                  Over 300 of the world's top universities include Kotlin in various computer science courses (as of June 2023).
                </div>
              </div>
            </div>
          </div>

          <div className="ktl-col-12 ktl-col-md-4">
            <div className="teach-feature">
              <div className="teach-feature__icon ktl-offset-bottom-m">
                <img
                  src="/images/ktl-component/teach/icons/teach-popular-icon.svg"
                  alt="Language of the industry"
                />
              </div>

              <div className="teach-feature__content">
                <div className="ktl-h3 ktl-offset-bottom-s">Language of the industry</div>
                <div className="ktl-text-2">
                  Kotlin is used by top companies such as Google, Amazon, Twitter, Reddit, Netflix,
                  Uber, Slack, just to name a few.
                </div>
              </div>
            </div>
          </div>

          <div className="ktl-col-12 ktl-col-md-4">
            <div className="teach-feature">
              <div className="teach-feature__icon ktl-offset-bottom-m">
                <img
                  src="/images/ktl-component/teach/icons/teach-multiplatform-icon.svg"
                  alt="Multiplatform"
                />
              </div>

              <div className="teach-feature__content">
                <div className="ktl-h3 ktl-offset-bottom-s">Multiplatform</div>
                <div className="ktl-text-2">
                  Kotlin is a top choice for teaching Android development. It is also being adopted for
                  teaching multiplatform development, web, server-side programming, data science, and
                  other computer science topics.
                </div>
              </div>
            </div>
          </div>
        </div>

        <TeachNumbers countriesCount={countriesCount} universitiesCount={universitiesCount} />
        <TeachMap />
        <TeachQuotes />
        <TeachCtaBlock />
        <SubscriptionForm />
      </section>
    </div>
  );
}