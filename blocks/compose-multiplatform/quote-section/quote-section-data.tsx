import React from 'react';
import cn from 'classnames';
import { createTextCn } from '@rescui/typography';

const textCnLight = createTextCn('dark');

export const quoteSectionData = [
  {
    id: 'alex-askerov',
    imageSrc: '/images/compose-multiplatform/quote-section/alex-askerov.jpeg',
    name: 'Alex Askerov',
    role: 'Mobile Tech Lead at Wrike',
    text: (
      <p>
          Wrike adopted Compose Multiplatform early, with CMP-powered features
          in production since its beta state. Today, our production apps feature
          Calendars, Boards, Dashboards, Charts, Timesheet Approvals and more –
          all done with CMP. It’s helping us deliver consistent, high-quality
          experiences across platforms while streamlining our development
          process. With the iOS version now reaching stability, we’re excited to
          see this technology mature and look forward to expanding its
          implementation.
      </p>
    )
  },
  {
    id: 'johannes-svensson',
    imageSrc:
      '/images/compose-multiplatform/quote-section/johannes-svensson.jpeg',
    name: 'Johannes Svensson',
    role: 'Android Developer at Instabee',
    text: (
      <>
        <p>
            Compose Multiplatform really simplified adding support for iOS. The
            level of shared code, without adding complexity, is staggering. It
            really streamlines app development and enables us to innovate and
            iterate at an insane speed.
        </p>
        <p
          className={cn(
            textCnLight('rs-text-2', { hardness: 'pale' })
          )}
        >
            Learn more about Instabee’s experience with Compose Multiplatform
            over the course of a year in this{' '}
            <a
              href="https://www.youtube.com/watch?v=HNFi7dw_mp8"
              className={textCnLight('rs-link', { external: true })}
              rel="noopener noreferrer"
              target="_blank"
            >
              video
            </a>
            .
        </p>
      </>
    )
  },
  {
    id: 'kashif-mehmood',
    imageSrc: '/images/compose-multiplatform/quote-section/kashif-mehmood.png',
    name: 'Kashif Mehmood',
    role: 'Mobile Engineering Lead at Markaz',
    text: (
      <p>
          Markaz is Pakistan’s second-largest e-commerce platform, with over 5
          million downloads and 1,000,000+ active users. It has consistently
          ranked in the top 10 on Google Play and top 15 on the Apple App Store.
          The app includes 100+ screens and is fully built with Compose
          Multiplatform, combining a shared UI with native integrations like
          camera, QR scanning, payments, native navigation, and analytics. The
          app is fully optimized to run on low-end devices and slow networks,
          making it accessible to people living in remote areas with olders
          devices. The app size remains under 10MB on Android and 137MB on iOS.
      </p>
    )
  },
  {
    id: 'suresh-maidaragi',
    imageSrc:
      '/images/compose-multiplatform/quote-section/suresh-maidaragi.png',
    name: 'Suresh Maidaragi',
    role: 'Mobile Platform Lead Engineer at Physics Wallah',
    text: (
      <>
        <p>
            Around 20% of our Physics Wallah App, which has more than 10M
            downloads on Google Play – including one of our largest features,
            Pitara – is built using Kotlin Multiplatform and Compose
            Multiplatform, sharing both UI and business logic across Android and
            iOS platforms. The rest of the app uses a combination of Jetpack
            Compose and XML. This shift has streamlined our development process
            and allowed us to unify Android and iOS engineers into a single
            Mobile team.
        </p>
        <p>
            We’ve also built our new Acadfly and Parent apps from the ground up
            using Compose Multiplatform. It is now our core mobile technology
            for building all new features and products from scratch.
        </p>
      </>
    )
  }
];
