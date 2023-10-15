import React from "react";

import '@jetbrains/kotlin-web-site-ui/out/components/typography';
import '@jetbrains/kotlin-web-site-ui/out/components/grid';
import YoutubePlayer from '@jetbrains/kotlin-web-site-ui/out/components/youtube-player';

import {TeachCtaBlock} from "./components/teach-cta-block";
import {TeachTopMenu} from "./components/teach-top-menu";
import {TeachNumbers} from "./components/teach-numbers";
import {TeachQuotes} from "./components/teach-quotes";

import '@rescui/typography';

import './style.scss';
import {SubscriptionForm} from './components/subscription-form';
import {TeachMap} from './components/teach-map/teach-map.jsx';
import {SlackIcon} from "@rescui/icons";
import Button from "@rescui/button";
import { TeachLaunchCourse } from "./components/teach-launch-course";

import { useTextStyles } from '@rescui/typography';

const Teach = (props) => {

  const {countriesCount, universitiesCount, path} = props;
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

                  <Button mode="outline" href="why-teach-kotlin.html" className="teach-cta-block-button">
                      Why Teach Kotlin&nbsp;→
                  </Button>
              </div>

              <div className="teach-features ktl-row ktl-offset-top-l">
                  <div className="ktl-col-12 ktl-col-md-4">
                      <div className="teach-feature">
                          <div className="teach-feature__icon ktl-offset-bottom-m">
                              <img
                                  src="/assets/images/ktl-component/teach/icons/teach-academically-recognized-icon.svg"
                                  alt="Academically recognized"
                              />
                          </div>

                          <div className="teach-feature__content">
                              <div className="ktl-h3 ktl-offset-bottom-s">Academically recognized</div>

                              <div className="ktl-text-2">
                                  Over 300 of the world’s top universities include Kotlin in various computer science courses (as of June 2023).
                              </div>
                          </div>
                      </div>
                  </div>

                  <div className="ktl-col-12 ktl-col-md-4">
                      <div className="teach-feature">
                          <div className="teach-feature__icon ktl-offset-bottom-m">
                              <img
                                  src="/assets/images/ktl-component/teach/icons/teach-popular-icon.svg"
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
                                  src="/assets/images/ktl-component/teach/icons/teach-multiplatform-icon.svg"
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

              <div className="ktl-offset-top-l">
                  <div className="teach-top-buttons">
                      <Button
                          size="l"
                          icon={<SlackIcon />}
                          href="https://surveys.jetbrains.com/s3/kotlin-slack-signup-educators"
                          target="_blank"
                          rel="noopener"
                          className="teach-cta-block-button"
                      >
                          Join Educators Сommunity
                      </Button>

                      <Button size="l" mode="outline" href="why-teach-kotlin.html" className="teach-cta-block-button">
                          Why Teach Kotlin&nbsp;→
                      </Button>
                  </div>
              </div>
          </section>

          <section
              className="teach-universities ktl-offset-top-xxl ktl-with-anchor"
              id="kotlin-courses-around-the-world"
          >
              <div className="ktl-layout ktl-layout--center">
                  <div className="teach-universities__top">
                      <div className="universities-top">
                          <div className="universities-top__title">
                              <h2 className="ktl-h1">
                                  <a
                                      href="#kotlin-courses-around-the-world"
                                      className="kto-anchor-link kto-anchor-link--small"
                                  >
                                      Kotlin Courses Around the World
                                  </a>
                              </h2>

                              <p className="ktl-text-1 ktl-offset-top-l">
                                  Explore our interactive map with links to university courses that
                                  <br /> include Kotlin.
                              </p>
                          </div>

                          <h2 className="ktl-h1 universities-top__title-mobile">
                              Kotlin is taught at {universitiesCount} universities
                          </h2>

                          <div className="universities-top__numbers">
                              <TeachNumbers countriesCount={countriesCount} universitiesCount={universitiesCount} />
                          </div>
                      </div>
                  </div>

                  <div className="teach-universities__logos ktl-offset-top-m">
                      <div className="teach-logos">
                          <div className="teach-logos__logo">
                              <img
                                  className="teach-logos_hopkins"
                                  src="/assets/images/ktl-component/teach/universities/harvard.jpg"
                                  alt="Harvard University"
                              />
                          </div>
                          <div className="teach-logos__logo">
                              <img
                                  className="teach-logos_cambridge"
                                  src="/assets/images/ktl-component/teach/universities/cambridge.png"
                                  alt="University of Cambridge"
                              />
                          </div>
                          <div className="teach-logos__logo">
                              <img
                                  className="teach-logos_stanford"
                                  src="/assets/images/ktl-component/teach/universities/stanford.png"
                                  alt="Stanford University"
                              />
                          </div>
                          <div className="teach-logos__logo">
                              <img
                                  className="teach-logos_imperial"
                                  src="/assets/images/ktl-component/teach/universities/imperial.png"
                                  alt="Imperial College London"
                              />
                          </div>
                          <div className="teach-logos__logo">
                              <img
                                  className="teach-logos_chicago"
                                  src="/assets/images/ktl-component/teach/universities/uchicago.png"
                                  alt="The University of Chicago"
                              />
                          </div>
                      </div>
                  </div>

                  <TeachMap className="teach-map__wrapper" />

                  <div className="teach-universities__bottom ktl-offset-top-m">
                      <div className="ktl-row">
                          <div className="ktl-col-12 ktl-col-sm-8 ktl-col-sm-offset-2">
                              <p className="ktl-text-2 ktl-offset-bottom-m">
                                  To add your university’s Kotlin course to the map, contact us at
                                  {' '}
                                  <a href="mailto:education@kotlinlang.org" className="rs-link">
                                      education@kotlinlang.org.
                                  </a>
                                  <br />We’ll send you a Kotlin T-shirt and stickers for your students.
                              </p>
                              <Button size="l" mode="outline" href="courses.html">
                                  All universities
                              </Button>
                          </div>
                      </div>
                  </div>

                  <div className="teach-universities__mobile-button">
                      <Button mode="outline" href="courses.html">
                          Learn more&nbsp;→
                      </Button>
                  </div>
              </div>
          </section>

          <section className="teach-resources ktl-offset-top-xxl ktl-with-anchor" id="start-teaching-kotlin">
              <div className="ktl-layout ktl-layout--center">
                  <div className="teach-resources__top ktl-offset-bottom-xl">
                      <img
                          className="teach-resources__top-image"
                          src="/assets/images/ktl-component/teach/icons/education-main.png"
                          alt="Kotlin resources"
                      />
                      <h2 className="ktl-h1">
                          <a href="#start-teaching-kotlin" className="kto-anchor-link kto-anchor-link--small">
                              Start Teaching Kotlin
                              <br /> with These Resources
                          </a>
                      </h2>
                  </div>
                  <ul className="teach-links">
                      <li className="teach-links__first-list">
                          <p className="ktl-h4 ktl-offset-bottom-xs">Get started</p>
                          <ul className="teach-list">
                              <li className="teach-list__item">
                                  <a href="/docs/kotlin-tour-welcome.html" className={textCn('rs-link', {external: true})}>
                                      Tour of Kotlin
                                  </a>
                              </li>
                              <li className="teach-list__item">
                                  <a href="https://plugins.jetbrains.com/plugin/21067-kotlin-onboarding-introduction" className={textCn('rs-link', {external: true})} target="_blank">
                                      Kotlin Onboarding
                                  </a>
                              </li>
                              <li className="teach-list__item">
                                  <a href="https://drive.google.com/drive/folders/1nN3LuyEfmBaSDZpnb4VA9kDuLakmVXH1" className={textCn('rs-link', {external: true})} target="_blank">
                                      Programming in Kotlin course materials
                                  </a>
                              </li>

                              <li className="teach-list__item">
                                  <div className="ktl-text-2 ktl-dimmed-text">Atomic Kotlin:</div>
                                  <ul className="teach-list teach-sublist">
                                      <li className="teach-list__item">
                                          <a
                                              href="https://www.atomickotlin.com/exercises/"
                                              target="_blank"
                                              rel="noopener"
                                              className={textCn('rs-link', {external: true})}
                                          >
                                              Hands-on exercises
                                          </a>
                                      </li>
                                      <li className="teach-list__item">
                                          <a
                                              href="https://github.com/svtk/AtomicKotlinCourse"
                                              target="_blank"
                                              rel="noopener"
                                              className={textCn('rs-link', {external: true})}
                                          >
                                              Course project
                                          </a>
                                      </li>
                                      <li className="teach-list__item">
                                          <a
                                              href="https://www.jetbrains.com/help/education/educator-start-guide.html"
                                              target="_blank"
                                              rel="noopener"
                                              className={textCn('rs-link', {external: true})}
                                          >
                                              Educator start guide
                                          </a>
                                      </li>
                                  </ul>
                              </li>

                              <li className="teach-list__item">
                                  <a
                                      href="https://docs.google.com/document/d/1XIJaV3zhn-tJhDc_6Kr00lmTo5zCBuES3Yt67wX752M/edit"
                                      target="_blank"
                                      className={textCn('rs-link', {external: true})}
                                  >
                                      Kotlin curriculum for beginners
                                  </a>
                              </li>

                              <li className="teach-list__item">
                                  <a
                                      href="https://hyperskill.org/tracks?category=4&utm_source=jbkotlin_hs&utm_medium=referral&utm_campaign=kotlinlang-education&utm_content=button_1&utm_term=22.03.23"
                                      target="_blank"
                                      rel="noopener"
                                      className={textCn('rs-link', {external: true})}
                                  >
                                      Kotlin tracks by JetBrains Academy
                                  </a>
                              </li>
                          </ul>
                      </li>

                      <li className="teach-links__second-list">
                          <p className="ktl-h4 ktl-offset-bottom-xs">Tools</p>
                          <ul className="teach-list">
                              <li className="teach-list__item">
                                  <a
                                      href="https://www.jetbrains.com/community/education/#students"
                                      target="_blank"
                                      rel="noopener"
                                      className={textCn('rs-link', {external: true})}
                                  >
                                      Free educational licenses for students and teachers
                                  </a>
                              </li>
                              <li className="teach-list__item">
                                  <a
                                      href="https://plugins.jetbrains.com/plugin/10081-jetbrains-academy"
                                      target="_blank"
                                      rel="noopener"
                                      className={textCn('rs-link', {external: true})}
                                  >
                                      JetBrains Academy plugin
                                  </a>
                              </li>
                              <li className="teach-list__item">
                                  <a
                                      href="/docs/mixing-java-kotlin-intellij.html#converting-an-existing-java-file-to-kotlin-with-j2k"
                                      target="_blank"
                                      className={textCn('rs-link', {external: true})}
                                  >
                                      Java-to-Kotlin converter
                                  </a>
                              </li>
                              <li className="teach-list__item">
                                  <a href="https://www.jetbrains.com/code-with-me/"
                                     target="_blank"
                                     rel="noopener"
                                     className={textCn('rs-link', {external: true})}>
                                      Code With Me
                                  </a>
                              </li>
                          </ul>
                      </li>

                      <li className="teach-links__third-list">
                          <p className="ktl-h4 ktl-offset-bottom-xs">Online Courses</p>
                          <ul className="teach-list">
                              <li className="teach-list__item">
                                  <a
                                      target="_blank"
                                      rel="noopener"
                                      href="https://www.oreilly.com/library/view/introduction-to-kotlin/9781491964125/"
                                      className={textCn('rs-link', {external: true})}>
                                      Introduction to Kotlin Programming
                                  </a>
                              </li>
                              <li className="teach-list__item">
                                  <a
                                      target="_blank"
                                      rel="noopener"
                                      href="https://www.oreilly.com/library/view/advanced-kotlin-programming/9781491964149/"
                                      className={textCn('rs-link', {external: true})}
                                  >
                                      Advanced Kotlin
                                  </a>
                              </li>
                              <li className="teach-list__item">
                                  <a
                                      target="_blank"
                                      rel="noopener"
                                      href="https://www.coursera.org/learn/kotlin-for-java-developers"
                                      className={textCn('rs-link', {external: true})}
                                  >
                                      Programming Kotlin for Java Developers
                                  </a>
                              </li>
                          </ul>
                      </li>

                      <li className="teach-links__fourth-list">
                          <p className="ktl-h4 ktl-offset-bottom-xs">Android in Kotlin</p>
                          <ul className="teach-list">
                              <li className="teach-list__item">
                                  <a href="https://developer.android.com/courses/android-basics-compose/course"
                                     target="_blank"
                                     className={textCn('rs-link', {external: true})}>
                                      Android Basics with Compose course
                                  </a>
                              </li>

                              <li className="teach-list__item">
                                  <a href="https://developer.android.com/teach"
                                     target="_blank"
                                     className={textCn('rs-link', {external: true})}>
                                      Android Development with Kotlin course
                                  </a>
                              </li>
                          </ul>
                      </li>

                      <li className="teach-links__fifth-list">
                          <p className="ktl-h4 ktl-offset-bottom-xs">Practice Kotlin</p>
                          <ul className="teach-list">
                              <li className="teach-list__item">
                                  <a href="https://play.kotlinlang.org/koans/overview"
                                     className={textCn('rs-link')}>
                                      Koans
                                  </a>
                              </li>
                              <li className="teach-list__item">
                                  <a href="https://kotlinlang.org/lp/kotlin-heroes/"
                                     className={textCn('rs-link')}>
                                      Kotlin Heroes
                                  </a>
                              </li>
                              <li className="teach-list__item">
                                  <a
                                      href="/docs/advent-of-code.html"
                                      className={textCn('rs-link')}
                                  >
                                      Solve Advent of Code Puzzles
                                  </a>
                              </li>
                          </ul>
                      </li>
                  </ul>
              </div>
          </section>

          <section className="ktl-layout ktl-layout--center ktl-offset-top-xxl teach-subscription-section">
              <SubscriptionForm />
          </section>

          <section className="teach-video ktl-offset-top-xxl">
              <div className="ktl-layout ktl-layout--center">
                  <div className="ktl-row">
                      <div className="ktl-col">
                          <YoutubePlayer
                              mode={1}
                              id="PLlFc5cFwUnmzT4cgLOGJYGnY6j0W2xoFA"
                              previewImgSrc="https://img.youtube.com/vi/CQlBQ5tfbHE/maxresdefault.jpg"
                          />
                      </div>
                  </div>
              </div>
          </section>

          <section className="ktl-layout ktl-layout--center ktl-offset-top-xxl">
              <div className="ktl-row">
                  <div className="ktl-col-12 ktl-col-md-10 ktl-col-md-offset-1">
                      <TeachQuotes />
                  </div>
              </div>
          </section>

          <section className="ktl-offset-top-xxl">
              <TeachCtaBlock />
          </section>
      </div>
  );
}

export default Teach;
