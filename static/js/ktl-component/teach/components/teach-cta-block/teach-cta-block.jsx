import React from 'react';

import {CtaBlock} from '@jetbrains/kotlin-web-site-ui/out/components/cta-block-v2';
import Button from '@rescui/button';
import './teach-cta-block.scss';

export const TeachCtaBlock = () => {
  return (
    <React.Fragment>
      <CtaBlock
        mainTitle='Connect with us'
        topTitle='If you would like to introduce Kotlin into your classroom or have any questions about teaching or learning Kotlin'
      >
        <div className="teach-cta-block-buttons">
          <Button size="l" mode="rock"
                  href="https://surveys.jetbrains.com/s3/kotlin-slack-signup-educators"
                  target="_blank" rel="noopener" className="teach-cta-block-button">Slack-channel&nbsp;→</Button>
          <Button size="l" mode="rock" href="mailto:education@kotlinlang.org" className="teach-cta-block-button">education@kotlinlang.org</Button>
        </div>
      </CtaBlock>

    </React.Fragment>
  )
}