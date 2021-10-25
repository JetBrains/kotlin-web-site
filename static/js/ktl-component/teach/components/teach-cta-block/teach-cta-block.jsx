import React from 'react';

import {CtaBlock} from '@jetbrains/kotlin-web-site-ui/dist/ctaBlock';
import '@jetbrains/kotlin-web-site-ui/dist/ctaBlock.css';

export const TeachCtaBlock = () => {
  return (
    <React.Fragment>
      <CtaBlock
        mainTitle='Connect with us'
        topTitle='If you would like to introduce Kotlin into your classroom or have any questions about teaching or learning Kotlin'
      >
        <div className="teach-bottom-buttons">
          <a href="https://surveys.jetbrains.com/s3/kotlin-slack-signup-educators" target="_blank"
             className="kto-button kto-button_size_l kto-button_mode_contrast">
            Slack-channel&nbsp;→
          </a>
          <a href="mailto:education@kotlinlang.org"
             className="kto-button kto-button_size_l kto-button_mode_contrast">
            Email
          </a>
        </div>
      </CtaBlock>

    </React.Fragment>
  )
}