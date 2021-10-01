import React from "react";
import {CtaBlock} from '@jetbrains/kotlin-web-site-ui/dist/ctaBlock';
import {QuotesSlider} from '@jetbrains/kotlin-web-site-ui/dist/quotesSlider';
import YoutubePlayer from '@jetbrains/kotlin-web-site-ui/dist/youtubePlayer';
import TopMenu from '@jetbrains/kotlin-web-site-ui/dist/topMenu';

import stanfordLogo from '../../page/education/universities/stanford.png';
import hopkinsLogo from '../../page/education/universities/hopkins.png';
import cambridgeLogo from '../../page/education/universities/cambridge.png';
import imperialLogo from '../../page/education/universities/imperial.png';
import chicagoLogo from '../../page/education/universities/uchicago.png';

import multiplatformIcon from './icons/teach-multiplatform-icon.svg';
import academicallyRecognizedIcon from './icons/teach-academically-recognized-icon.svg';
import industryIcon from './icons/teach-popular-icon.svg';
import slackIcon from './icons/teach-slack-icon.svg';
import resourcesIcon from './icons/education-main.png'

import '@jetbrains/kotlin-web-site-ui/dist/ctaBlock.css';
import '@jetbrains/kotlin-web-site-ui/dist/quotesSlider.css'
import '@jetbrains/kotlin-web-site-ui/dist/topMenu.css';
import '@jetbrains/kotlin-web-site-ui/dist/typography.css';
import '@jetbrains/kotlin-web-site-ui/dist/grid.css';
import '@jetbrains/kotlin-web-site-ui/dist/youtubePlayer.css';

import './style.scss';

const menuItems = [
  {
    url: '/education/',
    title: 'Overview'
  },
  {
    url: '/education/why-teach-kotlin.html',
    title: 'Why Teach Kotlin'
  },
  {
    url: '/education',
    title: 'List of Courses'
  },
];

const quotes = [
  {
    title: 'David Vaughn, University of Missouri–St. Louis',
    text: 'Kotlin is faster to develop and comprehend what is happening; near 100% backwards compatibility makes it easy to show in Java and translate into Kotlin while still utilizing every available library from Java; Students seem to understand it fairly quickly.'
  },
  {
    title: 'Title 2',
    text: 'Kotlin offers cleaner code, less violations of object-orientation, some patterns are idioms (object, extension functions, observers...)'
  },
  {
    title: 'Title 3',
    text: 'Kotlin offers cleaner code, less violations of object-orientation, some patterns are idioms (object, extension functions, observers...)'
  },
]

const Teach = (props) => {
  return (
    <div className="teach-wrapper">
      <TopMenu
        items={menuItems}
        homeUrl={'/'}
        title={'Teach'}
        activeIndex={0}
      >
        <a className="kto-button kto-button_theme_dark kto-button_size_s kto-button_mode_primary">
          <img src={slackIcon} className="teach-button-icon teach-button-icon_small" alt=""/>
          Join Ed-community
        </a>
      </TopMenu>

      <div className="ktl-container ktl-offset-top-xl">
        <div className="ktl-row ktl-offset-bottom-l">
          <div className="ktl-col">
            <h1 className="ktl-hero">
              Kotlin is suitable for teaching a wide range of&nbsp;computer science courses
            </h1>
          </div>
        </div>

        <div className="teach-top-mobile-buttons">
          <a className="kto-button kto-button_theme_dark kto-button_size_s kto-button_mode_primary">
            <img src={slackIcon} className="teach-button-icon teach-button-icon_small" alt=""/>
            Join Educators Сommunity
          </a>

          <a className="kto-button kto-button_size_s kto-button_mode_outline">
            Why Teach Kotlin →
          </a>
      </div>

      <div className="teach-features ktl-row">
        <div className="ktl-col-12 ktl-col-sm-4">

          <div className="ktl-teach-icon ktl-offset-bottom-m">
            <img src={multiplatformIcon} alt=""/>
          </div>

          <div className="ktl-text-1 ktl-offset-bottom-s">
            <a href="#" className="ktl-link teach-link">
              <span className="ktl-link">Multiplatform</span>
            </a>
          </div>

          <div className="ktl-text-2">
            The first-choice language for Android development, Kotlin is also being adopted for teaching multiplatform
            development for mobile, web, server-side programming, data science, and other computer science topics.
          </div>
        </div>
        <div className="ktl-col-12 ktl-col-sm-4">

          <div className="ktl-teach-icon ktl-offset-bottom-m">
            <img src={academicallyRecognizedIcon} alt=""/>
          </div>

          <div className="ktl-text-1 ktl-offset-bottom-s">
            <a href="#" className="ktl-link teach-link">
              <span className="ktl-link">Academically recognized</span>
            </a>
          </div>

          <div className="ktl-text-2">
            25 of the top 100 universities in the Times Higher Education World University Rankings 2021 include Kotlin
            in their courses.
          </div>
        </div>
        <div className="ktl-col-12 ktl-col-sm-4">

          <div className="ktl-teach-icon ktl-offset-bottom-m">
            <img src={industryIcon} alt=""/>
          </div>

          <div className="ktl-text-1 ktl-offset-bottom-s">
            <a href="#" className="ktl-link teach-link">
              <span className="ktl-link">Language of the industry</span>
            </a>
          </div>

          <div className="ktl-text-2">
            Kotlin is used by top companies such as Google, Twitter, Reddit, Netflix, Uber, BMW, Coursera, Slack, and
            Trello, just to name a few.
          </div>
        </div>
      </div>

      <div className="ktl-offset-top-m">
        <div className="teach-top-buttons">
          <a className="kto-button kto-button_theme_dark kto-button_size_l kto-button_mode_primary">
            <img src={slackIcon} className="teach-button-icon" alt=""/>
            Join Educators Сommunity
          </a>

          <a className="kto-button kto-button_size_l kto-button_mode_outline">
            Why Teach Kotlin →
          </a>
        </div>
      </div>
    </div>

  <div className="teach-universities ktl-offset-top-xxl">
    <div className="ktl-container">
      <div className="teach-universities__top">
        <div className="universities-top">
          <div className="universities-top__title">
            <h2 className="ktl-h1">
              Kotlin Courses Around the World
            </h2>

            <p className="ktl-text-1 ktl-offset-top-l">
              Explore our interactive map with links to university courses that<br/> include Kotlin.
            </p>
          </div>

          <div className="universities-top__numbers">
            <div className="teach-numbers">
              <div className="teach-number">
                <div className="teach-number__title">
                  <div className="ktl-hero">
                    40
                  </div>
                </div>
                <div className="teach-number__subtitle">
                  <div className="ktl-text-2">
                    countries
                  </div>
                </div>
              </div>
              <div className="teach-number">
                <div className="teach-number__title">
                  <div className="ktl-hero">
                    191
                  </div>
                </div>
                <div className="teach-number__subtitle">
                  <div className="ktl-text-2">
                    universities
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="teach-universities__logos ktl-offset-top-m">
        <div className="teach-logos">
          <div className="teach-logos__logo">
            <img className="teach-logos_stanford" src={stanfordLogo} alt=""/>
          </div>
          <div className="teach-logos__logo">
            <img className="teach-logos_hopkins" src={hopkinsLogo} alt=""/>
          </div>
          <div className="teach-logos__logo">
            <img className="teach-logos_cambridge" src={cambridgeLogo} alt=""/>
          </div>
          <div className="teach-logos__logo">
            <img className="teach-logos_imperial" src={imperialLogo} alt=""/>
          </div>
          <div className="teach-logos__logo">
            <img className="teach-logos_chicago" src={chicagoLogo} alt=""/>
          </div>
        </div>
      </div>

      <div className="teach-universities__bottom ktl-offset-top-m">
        <div className="ktl-row">
          <div className="ktl-col-12 ktl-col-sm-8 ktl-col-sm-offset-2">
            <p className="ktl-text-2 ktl-offset-bottom-m">
              If you would like to feature your university and Kotlin course, please get in touch with us at <a
              href="mailto:education@kotlinlang.org" className="ktl-link">education@kotlinlang.org.</a><br/> We’ll
              send a Kotlin T-shirt for you and stickers for your students.
            </p>

            <a className="kto-button kto-button_size_l kto-button_mode_outline">
              All universities →
            </a>
          </div>
        </div>
      </div>

      <div className="teach-universities__mobile-button">
        <a className="kto-button kto-button_size_l kto-button_mode_outline">
          Learn more →
        </a>
      </div>
    </div>
  </div>


  <div className="teach-resources ktl-offset-top-xxl">

    <div className="ktl-container">
      <div className="teach-resources__top ktl-offset-bottom-xl">
        <img className="teach-resources__top-image" src={resourcesIcon} alt=""/>
        <h2 className="ktl-h1">
          Start Teaching Kotlin<br/> with These Resources
        </h2>
      </div>
      <ul className="teach-links">
        <li>
          <p className="ktl-h4 ktl-offset-bottom-xs">Get started</p>
          <ul className="teach-list">
            <li>
              <a href="/docs/getting-started.html">
                <span className="ktl-link">Getting started</span>
              </a>
            </li>
            <li>
              <a href="/docs/basic-syntax.html">
                <span className="ktl-link">Basics</span>
              </a>
            </li>
            <li>
              <a href="https://play.kotlinlang.org/">
                <span className="ktl-link">Playground</span>
              </a>
            </li>
            <li>
              <a href="https://play.kotlinlang.org/">
                <span className="ktl-link">Kotin Basics track on JetBrains Academy</span>
                <span>↗</span>
              </a>
            </li>
            <li>
              <a href="/docs/books.html">
                <span className="ktl-link">Recommended reading</span>
              </a>
            </li>
          </ul>
        </li>

        <li>
          <p className="ktl-h4 ktl-offset-bottom-xs">Study materials</p>
          <ul className="teach-list">
            <li>
              <a
                href="https://docs.google.com/document/d/1XIJaV3zhn-tJhDc_6Kr00lmTo5zCBuES3Yt67wX752M/edit">
                <span className="ktl-link">Kotlin curriculum for beginners</span>
                <span>↗</span>
              </a>
            </li>
            <li>
              <div className="ktl-text-2 ktl-dimmed-text">Atomic kotlin:</div>
              <ul className="teach-list teach-sublist">
                <li>
                  <a href="">
                    <span className="ktl-link">Hands-on exercises</span>
                    <span>↗</span>
                  </a>
                </li>
                <li>
                  <a href="">
                    <span className="ktl-link">Course project</span>
                    <span>↗</span>
                  </a>
                </li>
                <li>
                  <a href="">
                    <span className="ktl-link">Educator start guide</span>
                    <span>↗</span>
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </li>

        <li>
          <p className="ktl-h4 ktl-offset-bottom-xs">Tools</p>
          <ul className="teach-list">
            <li>
              <a
                href="https://www.jetbrains.com/community/education/#students">
                      <span className="ktl-link">
                        Free educational IntelliJ IDEA Ultimate licenses
                      </span>
                <span>↗</span>
              </a>
            </li>
            <li>
              <a
                href="https://plugins.jetbrains.com/plugin/10081-edutools">
                      <span className="ktl-link">
                        EduTools plugin
                      </span>
                <span>↗</span>
              </a>
            </li>
            <li>
              <a
                href="https://kotlinlang.org/docs/mixing-java-kotlin-intellij.html#converting-an-existing-java-file-to-kotlin-with-j2k">
                      <span className="ktl-link">
                        Java-to-Kotlin converter
                      </span>
                <span>↗</span>
              </a>
            </li>
            <li>
              <a href="https://www.jetbrains.com/code-with-me/">
                      <span className="ktl-link">
                        Code With Me
                      </span>
                <span>↗</span>
              </a>
            </li>
          </ul>
        </li>

        <li>
          <p className="ktl-h4 ktl-offset-bottom-xs">Online Courses</p>
          <ul className="teach-list">
            <li>
              <a target="_blank"
                 href="https://www.oreilly.com/library/view/introduction-to-kotlin/9781491964125/">
                      <span className="ktl-link">
                        Introduction to Kotlin Programming
                      </span>
                <span>↗</span>
              </a>
            </li>
            <li>
              <a target="_blank"
                 href="https://www.oreilly.com/library/view/advanced-kotlin-programming/9781491964149/">
                <span className="ktl-link">Advanced Kotlin</span>
                <span>↗</span>
              </a>
            </li>
            <li>
              <a target="_blank"
                 href="https://www.coursera.org/learn/kotlin-for-java-developers">
                      <span className="ktl-link">
                        Programming Kotlin for Java Developers
                      </span>
                <span>↗</span>
              </a>
            </li>
          </ul>
        </li>

        <li>
          <p className="ktl-h4 ktl-offset-bottom-xs">Android in Kotlin</p>
          <ul className="teach-list">
            <li>
              <a
                href="/docs/android-overview.html">
                <span className="ktl-link">Documentation</span>
              </a>
            </li>
            <li>
              <div className="ktl-text-2 ktl-dimmed-text">Recommended by Google's Android Developer Relations team:</div>
              <ul className="teach-list teach-sublist">
                <li>
                  <a href="https://developer.android.com/teach">
                    <span className="ktl-link">Android Development Resources for Educators</span>
                    <span>↗</span>
                  </a>
                </li>
                <li>
                  <a href="https://developer.android.com/teach#for-instructors-teaching-a-course">
                    <span className="ktl-link">Android Development with Kotlin curriculum</span>
                    <span>↗</span>
                  </a>
                </li>
                <li>
                  <a href="https://drive.google.com/file/d/1zFlIaXXEfGAB0ExVCcwjPXox7rucvV_M/view">
                    <span className="ktl-link">Learning materials</span>
                    <span>↗</span>
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </li>
        <li>
          <p className="ktl-h4 ktl-offset-bottom-xs">Practice Kotlin by solving problems</p>
          <p>
            <ul className="teach-list">
              <li>
                <a target="_blank"
                   href="https://play.kotlinlang.org/koans/overview">
                  <span className="ktl-link">Koans</span>
                </a>
              </li>
              <li>
                <a target="_blank"
                   href="">
                  <span className="ktl-link">Kotlin Heroes</span>
                  <span>↗</span>
                </a>
              </li>
              <li>
                <a target="_blank"
                   href="">
                  <span className="ktl-link">Idiomatic Kotlin: Solving Advent of Code Puzzles</span>
                  <span>↗</span>
                </a>
              </li>
            </ul>
          </p>
        </li>
        <ul>
          <p className="ktl-h4 ktl-offset-bottom-xs">
            Slack
          </p>
          <p className="ktl-text-2 ktl-offset-bottom-xs ktl-dimmed-text">
            The #education Slack channel is a place to meet fellow educators and the Kotlin team. We post news and
            announcements there, and you can ask your questions and share your teaching experience.
          </p>
          <a href="">
            <span className="ktl-link">Request to join</span>
            <span>↗</span>
          </a>
        </ul>
        <li>
          <p className="ktl-h4 ktl-offset-bottom-xs">Connect with us</p>
          <ul className="teach-list">
            <li>
              <a target="_blank" href="mailto:education@kotlinlang.org">
                <span className="ktl-link">Email us</span>
              </a>
            </li>
            <li>
              <a target="_blank" href="https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw">
                <span className="ktl-link">YouTube channel</span>
                <span>↗</span>
              </a>
            </li>
            <li>
              <a>
                <span className="ktl-link">Educational webinars</span>
                <span>↗</span>
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>

  <div className="teach-video ktl-offset-top-xxl">
    <div className="ktl-container">
      <div className="ktl-row">
        <div className="ktl-col">
          <YoutubePlayer id={"MQPeEOf3G7A"}/>
        </div>
      </div>
    </div>
  </div>

  <div className="ktl-container ktl-offset-top-xxl">
    <div className="ktl-row">
      <div className="ktl-col-10 ktl-col-md-offset-1">
        <QuotesSlider quotes={quotes}/>
      </div>
    </div>
  </div>

  <div className="ktl-offset-top-xxl">
    <CtaBlock
      mainTitle='Connect with us'
      topTitle='If you would like to introduce Kotlin into your classroom or have any questions about teaching or learning Kotlin'
      content={
        <div className="teach-bottom-buttons">
          <a className="kto-button kto-button_size_l kto-button_mode_contrast">
            Slack-channel →
          </a>
          <a href="mailto:education@kotlinlang.org"
             className="kto-button kto-button_size_l kto-button_mode_contrast">
            Email
          </a>
        </div>
      }
    />
  </div>
</div>
)
  ;
}

export default Teach;
