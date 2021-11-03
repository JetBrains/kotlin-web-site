import React from "react";

import YoutubePlayer from '@jetbrains/kotlin-web-site-ui/dist/youtubePlayer';

import {TeachCtaBlock} from "./components/teach-cta-block";
import {TeachTopMenu} from "./components/teach-top-menu";
import {TeachNumbers} from "./components/teach-numbers";
import {TeachQuotes} from "./components/teach-quotes";

import '@jetbrains/kotlin-web-site-ui/dist/topMenu.css';
import '@jetbrains/kotlin-web-site-ui/dist/typography.css';
import '@jetbrains/kotlin-web-site-ui/dist/grid.css';
import '@jetbrains/kotlin-web-site-ui/dist/youtubePlayer.css';

import '@rescui/typography';

import './style.scss';
import {SubscriptionForm} from './components/subscription-form';
import {TeachMap} from './components/teach-map/teach-map.jsx';

const Teach = (props) => {

  const {countriesCount, universitiesCount, path} = props;

  return (
    <div className="teach-wrapper">
      <TeachTopMenu path={path}/>
      <section className="ktl-container ktl-offset-top-xl">
        <h1 className="ktl-hero ktl-offset-bottom-xxl">
          Kotlin is suitable for teaching a wide range of&nbsp;computer science courses
        </h1>

        <div className="teach-top-mobile-buttons">
          <a href="https://surveys.jetbrains.com/s3/kotlin-slack-signup-educators"
             className="kto-button kto-button_theme_dark kto-button_size_s kto-button_mode_primary">
            <img src="/assets/images/ktl-component/teach/icons/teach-slack-icon.svg"
                 className="teach-button-icon teach-button-icon_small" alt="Slack icon"/>
            Join Educators Сommunity
          </a>

          <a href="/why-teach-kotlin.html" target="_blank"
             className="kto-button kto-button_size_s kto-button_mode_outline">
            Why Teach Kotlin&nbsp;→
          </a>
        </div>

        <div className="teach-features ktl-row">
          <div className="ktl-col-12 ktl-col-sm-4">
            <div className="teach-feature">
              <div className="teach-feature__icon ktl-offset-bottom-m">
                <img src="/assets/images/ktl-component/teach/icons/teach-multiplatform-icon.svg" alt="Multiplatform"/>
              </div>

              <div className="teach-feature__content">
                <div className="ktl-h3 ktl-offset-bottom-s">Multiplatform</div>

                <div className="ktl-text-2">
                  The first-choice language for Android development, Kotlin is also being adopted for teaching
                  multiplatform
                  development for mobile, web, server-side programming, data science, and other computer science topics.
                </div>
              </div>
            </div>
          </div>

          <div className="ktl-col-12 ktl-col-sm-4">
            <div className="teach-feature">
              <div className="teach-feature__icon ktl-offset-bottom-m">
                <img src="/assets/images/ktl-component/teach/icons/teach-academically-recognized-icon.svg"
                     alt="Academically recognized"/>
              </div>

              <div className="teach-feature__content">
                <div className="ktl-h3 ktl-offset-bottom-s">Academically recognized</div>

                <div className="ktl-text-2">
                  25 of the top 100 universities in the Times Higher Education World University Rankings 2021 include
                  Kotlin
                  in their courses.
                </div>
              </div>
            </div>
          </div>

          <div className="ktl-col-12 ktl-col-sm-4">
            <div className="teach-feature">
              <div className="teach-feature__icon ktl-offset-bottom-m">
                <img src="/assets/images/ktl-component/teach/icons/teach-popular-icon.svg"
                     alt="Language of the industry"/>
              </div>

              <div className="teach-feature__content">
                <div className="ktl-h3 ktl-offset-bottom-s">Language of the industry</div>

                <div className="ktl-text-2">
                  Kotlin is used by top companies such as Google, Twitter, Reddit, Netflix, Uber, BMW, Coursera, Slack,
                  and
                  Trello, just to name a few.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="ktl-offset-top-l">
          <div className="teach-top-buttons">
            <a href="https://surveys.jetbrains.com/s3/kotlin-slack-signup-educators" target="_blank"
               className="kto-button kto-button_theme_dark kto-button_size_l kto-button_mode_primary">
              <img src="/assets/images/ktl-component/teach/icons/teach-slack-icon.svg" className="teach-button-icon"
                   alt="Slack icon"/>
              Join Educators Сommunity
            </a>

            <a href="why-teach-kotlin.html" className="kto-button kto-button_size_l kto-button_mode_outline">
              Why Teach Kotlin&nbsp;→
            </a>
          </div>
        </div>
      </section>

      <section className="teach-universities ktl-offset-top-xxl">
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
                <TeachNumbers countriesCount={countriesCount} universitiesCount={universitiesCount} />
              </div>
            </div>
          </div>

          <div className="teach-universities__logos ktl-offset-top-m">
            <div className="teach-logos">
              <div className="teach-logos__logo">
                <img className="teach-logos_stanford" src="/assets/images/ktl-component/teach/universities/stanford.png"
                     alt="Stanford University"/>
              </div>
              <div className="teach-logos__logo">
                <img className="teach-logos_hopkins" src="/assets/images/ktl-component/teach/universities/hopkins.png"
                     alt="Johns Hopkins University"/>
              </div>
              <div className="teach-logos__logo">
                <img className="teach-logos_cambridge"
                     src="/assets/images/ktl-component/teach/universities/cambridge.png" alt="University of Cambridge"/>
              </div>
              <div className="teach-logos__logo">
                <img className="teach-logos_imperial" src="/assets/images/ktl-component/teach/universities/imperial.png"
                     alt="Imperial College London"/>
              </div>
              <div className="teach-logos__logo">
                <img className="teach-logos_chicago" src="/assets/images/ktl-component/teach/universities/uchicago.png"
                     alt="The University of Chicago"/>
              </div>
            </div>
          </div>

          <TeachMap />

          <div className="teach-universities__bottom ktl-offset-top-m">
            <div className="ktl-row">
              <div className="ktl-col-12 ktl-col-sm-8 ktl-col-sm-offset-2">
                <p className="ktl-text-2 ktl-offset-bottom-m">
                  If you would like to feature your university and Kotlin course, please get in touch with us at <a
                  href="mailto:education@kotlinlang.org" className="rs-link">education@kotlinlang.org.</a><br/> We’ll
                  send a Kotlin T-shirt for you and stickers for your students.
                </p>
                <a
                  href="courses.html" className="kto-button kto-button_size_l kto-button_mode_outline">
                  All universities
                </a>
              </div>
            </div>
          </div>

          <div className="teach-universities__mobile-button">
            <a
              href="https://docs.google.com/spreadsheets/d/1p77WHo--mxewmxINWMLaTPGXvnEr0JGxgSMcX6C0b_0/edit?usp=sharing"
              target="_blank" className="kto-button kto-button_size_s kto-button_mode_outline">
              Learn more&nbsp;→
            </a>
          </div>
        </div>
      </section>


      <section className="teach-resources ktl-offset-top-xxl">
        <div className="ktl-container">
          <div className="teach-resources__top ktl-offset-bottom-xl">
            <img className="teach-resources__top-image"
                 src="/assets/images/ktl-component/teach/icons/education-main.png" alt="Kotlin resources"/>
            <h2 className="ktl-h1">
              Start Teaching Kotlin<br/> with These Resources
            </h2>
          </div>
          <ul className="teach-links">
            <li>
              <p className="ktl-h4 ktl-offset-bottom-xs">Get started</p>
              <ul className="teach-list">
                <li className="teach-list__item">
                  <a href="/docs/getting-started.html" target="_blank">
                    <span className="rs-link">Getting started</span>
                  </a>
                </li>
                <li className="teach-list__item">
                  <a href="/docs/basic-syntax.html" target="_blank">
                    <span className="rs-link">Basics</span>
                  </a>
                </li>
                <li className="teach-list__item">
                  <a href="https://play.kotlinlang.org/" target="_blank">
                    <span className="rs-link">Playground</span>
                  </a>
                </li>
                <li className="teach-list__item">
                  <a href="https://hyperskill.org/tracks/18" target="_blank">
                    <span className="rs-link">Kotin Basics track on JetBrains Academy</span>
                    <span>↗</span>
                  </a>
                </li>
                <li className="teach-list__item">
                  <a href="/docs/books.html" target="_blank">
                    <span className="rs-link">Recommended reading</span>
                  </a>
                </li>
              </ul>
            </li>

            <li>
              <p className="ktl-h4 ktl-offset-bottom-xs">Study materials</p>
              <ul className="teach-list">
                <li className="teach-list__item">
                  <a
                    href="https://docs.google.com/document/d/1XIJaV3zhn-tJhDc_6Kr00lmTo5zCBuES3Yt67wX752M/edit"
                    target="_blank">
                    <span className="rs-link">Kotlin curriculum for beginners</span>
                    <span>↗</span>
                  </a>
                </li>
                <li className="teach-list__item">
                  <div className="ktl-text-2 ktl-dimmed-text">Atomic kotlin:</div>
                  <ul className="teach-list teach-sublist">
                    <li className="teach-list__item">
                      <a href="https://www.atomickotlin.com/exercises/" target="_blank">
                        <span className="rs-link">Hands-on exercises</span>
                        <span>↗</span>
                      </a>
                    </li>
                    <li className="teach-list__item">
                      <a href="https://github.com/svtk/AtomicKotlinCourse" target="_blank">
                        <span className="rs-link">Course project</span>
                        <span>↗</span>
                      </a>
                    </li>
                    <li className="teach-list__item">
                      <a href="https://www.jetbrains.com/help/education/educator-start-guide.html" target="_blank">
                        <span className="rs-link">Educator start guide</span>
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
                <li className="teach-list__item">
                  <a
                    href="https://www.jetbrains.com/community/education/#students" target="_blank">
                      <span className="rs-link">
                        Free educational IntelliJ IDEA Ultimate licenses
                      </span>
                    <span>↗</span>
                  </a>
                </li>
                <li className="teach-list__item">
                  <a
                    href="https://plugins.jetbrains.com/plugin/10081-edutools" target="_blank">
                      <span className="rs-link">
                        EduTools plugin
                      </span>
                    <span>↗</span>
                  </a>
                </li>
                <li className="teach-list__item">
                  <a
                    href="https://kotlinlang.org/docs/mixing-java-kotlin-intellij.html#converting-an-existing-java-file-to-kotlin-with-j2k"
                    target="_blank">
                      <span className="rs-link">
                        Java-to-Kotlin converter
                      </span>
                    <span>↗</span>
                  </a>
                </li>
                <li className="teach-list__item">
                  <a href="https://www.jetbrains.com/code-with-me/" target="_blank">
                      <span className="rs-link">
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
                <li className="teach-list__item">
                  <a target="_blank"
                     href="https://www.oreilly.com/library/view/introduction-to-kotlin/9781491964125/">
                      <span className="rs-link">
                        Introduction to Kotlin Programming
                      </span>
                    <span>↗</span>
                  </a>
                </li>
                <li className="teach-list__item">
                  <a target="_blank"
                     href="https://www.oreilly.com/library/view/advanced-kotlin-programming/9781491964149/">
                    <span className="rs-link">Advanced Kotlin</span>
                    <span>↗</span>
                  </a>
                </li>
                <li className="teach-list__item">
                  <a target="_blank"
                     href="https://www.coursera.org/learn/kotlin-for-java-developers">
                      <span className="rs-link">
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
                <li className="teach-list__item">
                  <a
                    href="/docs/android-overview.html" target="_blank">
                    <span className="rs-link">Documentation</span>
                  </a>
                </li>
                <li className="teach-list__item">
                  <div className="ktl-text-2 ktl-dimmed-text">Recommended by Google's Android Developer Relations
                    team:
                  </div>
                  <ul className="teach-list teach-sublist">
                    <li className="teach-list__item">
                      <a href="https://developer.android.com/teach" target="_blank">
                        <span className="rs-link">Android Development Resources for Educators</span>
                        <span>↗</span>
                      </a>
                    </li>
                    <li className="teach-list__item">
                      <a href="https://developer.android.com/teach#for-instructors-teaching-a-course" target="_blank">
                        <span className="rs-link">Android Development with Kotlin curriculum</span>
                        <span>↗</span>
                      </a>
                    </li>
                    <li className="teach-list__item">
                      <a href="https://drive.google.com/file/d/1zFlIaXXEfGAB0ExVCcwjPXox7rucvV_M/view" target="_blank">
                        <span className="rs-link">Learning materials</span>
                        <span>↗</span>
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
            <li>
              <p className="ktl-h4 ktl-offset-bottom-xs">Practice Kotlin by solving problems</p>
              <ul className="teach-list">
                <li className="teach-list__item">
                  <a target="_blank"
                     href="https://play.kotlinlang.org/koans/overview">
                    <span className="rs-link">Koans</span>
                  </a>
                </li>
                <li className="teach-list__item">
                  <a target="_blank"
                     href="https://kotlinlang.org/lp/kotlin-heroes/">
                    <span className="rs-link">Kotlin Heroes</span>
                    <span>↗</span>
                  </a>
                </li>
                <li className="teach-list__item">
                  <a target="_blank"
                     href="https://www.youtube.com/watch?v=o4emra1xm88&list=PLlFc5cFwUnmwfLRLvIM7aV7s73eSTL005">
                    <span className="rs-link">Idiomatic Kotlin: Solving Advent of Code Puzzles</span>
                    <span>↗</span>
                  </a>
                </li>
              </ul>
            </li>
            <ul>
              <p className="ktl-h4 ktl-offset-bottom-xs">
                Slack
              </p>
              <p className="ktl-text-2 ktl-offset-bottom-xs ktl-dimmed-text">
                The #education Slack channel is a place to meet fellow educators and the Kotlin team. We post news and
                announcements there, and you can ask your questions and share your teaching experience.
              </p>
              <a href="https://surveys.jetbrains.com/s3/kotlin-slack-signup-educators" target="_blank">
                <span className="rs-link">Request to join</span>
                <span>↗</span>
              </a>
            </ul>
            <li>
              <p className="ktl-h4 ktl-offset-bottom-xs">Connect with us</p>
              <ul className="teach-list">
                <li className="teach-list__item">
                  <a target="_blank" href="mailto:education@kotlinlang.org">
                    <span className="rs-link">Email us</span>
                  </a>
                </li>
                <li className="teach-list__item">
                  <a target="_blank" href="https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw">
                    <span className="rs-link">YouTube channel</span>
                    <span>↗</span>
                  </a>
                </li>
                <li className="teach-list__item">
                  <a href="https://www.youtube.com/watch?v=aM-L5_tiVAI&list=PLlFc5cFwUnmzT4cgLOGJYGnY6j0W2xoFA"
                     target="_blank">
                    <span className="rs-link">Educational webinars</span>
                    <span>↗</span>
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </section>

      <section className="ktl-container ktl-offset-top-xxl teach-subscription-section">
          <SubscriptionForm />
      </section>

      <section className="teach-video ktl-offset-top-xxl">
        <div className="ktl-container">
          <div className="ktl-row">
            <div className="ktl-col">
              <YoutubePlayer id={"MQPeEOf3G7A"}/>
            </div>
          </div>
        </div>
      </section>

      <section className="ktl-container ktl-offset-top-xxl">
        <div className="ktl-row">
          <div className="ktl-col-12 ktl-col-md-10 ktl-col-md-offset-1">
            <TeachQuotes/>
          </div>
        </div>
      </section>

      <section className="ktl-offset-top-xxl">
        <TeachCtaBlock/>
      </section>
    </div>
  )
    ;
}

export default Teach;
