import React from 'react';

import {TeachTopMenu} from "../teach/components/teach-top-menu";
import {TeachCtaBlock} from "../teach/components/teach-cta-block";

import QuotesSlider from '@jetbrains/kotlin-web-site-ui/out/components/quotes-slider';

import './style.scss'

import quotes from './quotes.json';


export const WhyTeach = ({path}) => {

  return (
    <div className="teach-wrapper">
      <TeachTopMenu path={path}/>

      <div className="ktl-layout ktl-layout--center">

        <div className="why-teach-grid ktl-offset-top-xl">
          <div className="why-teach-grid__content">

            <h1 className="ktl-h1 ktl-offset-bottom-xl">Why Teach Kotlin</h1>

            <section className="quote-section ktl-offset-bottom-xl ktl-with-anchor" id="academically-recognized">
              <h3 className="ktl-h3 ktl-offset-bottom-s">
                Academically recognized
              </h3>

              <div className="quote-section__grid">
                <div className="quote-section__content">

                  <p className="ktl-text-1 ktl-offset-bottom-s">
                    We know of over 300 universities that teach Kotlin in a variety of subjects, including object-oriented 
                    and functional programming, software development, introductory programming, mobile application development, 
                    concurrent programming, scientific programming, and more (Source: internal Teaching Kotlin Study, June 2023).
                  </p>

                  <QuotesSlider quotes={quotes.academicallyRecognized}
                  />
                </div>

                <div className="quote-section__info">
                  <p className="ktl-hero ktl-offset-bottom-xs">32</p>
                  <p className="ktl-text-2 ktl-offset-bottom-s ktl-dimmed-text">
                    of the top 100 universities in the Times Higher Education World University Rankings 2023 include
                    Kotlin
                    in
                    their courses.
                  </p>

                  <a
                    href="courses.html" className="ktl-text-2 ktl-link">
                    <span className="rs-link">List of universities</span>
                    <span>&nbsp;↗</span>
                  </a>
                </div>
              </div>
            </section>


            <section className="quote-section ktl-offset-bottom-xl ktl-with-anchor" id="language-of-the-industry">
              <h3 className="ktl-h3 ktl-offset-bottom-s">
                Language of the industry
              </h3>

              <div className="quote-section__grid">
                <div className="quote-section__content">

                  <div className="ktl-text-1 ktl-offset-bottom-m">
                    <ul className="rs-ul">
                      <li>
                        Kotlin is used by top companies such as Google, Amazon, Twitter, Reddit, Netflix, Uber, Slack, 
                        just to name a few.
                      </li>
                      <li>
                        Teaching professional software engineering practices improves students’ employment prospects. 
                        And knowing that Kotlin is a marketable skill, students tend to be more enthusiastic in studying it.
                      </li>
                      <li>
                        One out of every two developers is planning to adopt a new language.
                        Kotlin is one of the three top choices for next languages.
                        <a className="rs-link" href="https://www.jetbrains.com/lp/devecosystem-2022/" target="_blank">The
                        State of Developer Ecosystem 2022</a>
                      </li>
                      <li>
                        In 2020, Kotlin became the 2nd most popular language on the JVM.
                        <a
                        className="rs-link" href="https://snyk.io/blog/kotlin-overtakes-scala-and-clojure-to-become-the-2nd-most-popular-language-on-the-jvm/" 
                          target="_blank">Snyk.io JVM Ecosystem Report 2020
                        </a>
                      </li>
                    </ul>
                  </div>

                  <QuotesSlider quotes={quotes.languageOfTheIndustry}
                  />
                </div>

                <div className="quote-section__info">
                  <p className="ktl-text-2 ktl-offset-bottom-s ktl-dimmed-text">
                    Kotlin has consistently ranked among the hottest software engineering skills.
                  </p>

                  <a
                    href="https://hired.com/state-of-software-engineers/2023/"
                    target="_blank" className="ktl-text-2 ktl-link">
                    <span className="rs-link">Hired’s 2023 State of Software Engineers</span>
                    <span>&nbsp;↗</span>
                  </a>
                </div>
              </div>
            </section>

            <section className="quote-section ktl-offset-bottom-xl ktl-with-anchor" id="multiplatform">
              <h3 className="ktl-h3 ktl-offset-bottom-s">
                Multiplatform
              </h3>

              <div className="quote-section__grid">
                <div className="quote-section__content">

                  <p className="ktl-text-1 ktl-offset-bottom-m">
                    Kotlin is a top choice for teaching Android development. It is also being adopted for teaching 
                    multiplatform development, web, server-side programming, data science, and other computer science topics.
                  </p>

                  <QuotesSlider quotes={quotes.multiplatform}
                  />
                </div>

                <div className="quote-section__info">
                  <p className="ktl-text-2 ktl-offset-bottom-s ktl-dimmed-text">
                    The Kotlin Multiplatform Mobile and Compose Multiplatform frameworks
                    from JetBrains help developers share code between their Android and iOS apps.
                    These frameworks now offer experimental support for Kotlin compilation to WebAssembly.
                  </p>

                  <a
                    href="https://developers.googleblog.com/2023/05/bringing-kotlin-to-web.html"
                    target="_blank" className="ktl-text-2 ktl-link">
                    <span className="rs-link">Google for Developers blog, 2023</span>
                    <span>&nbsp;↗</span>
                  </a>
                </div>
              </div>
            </section>

            <section className="quote-section ktl-offset-bottom-xl ktl-with-anchor" id="interoperable">
              <h3 className="ktl-h3 ktl-offset-bottom-s">
                Interoperable
              </h3>

              <div className="quote-section__grid">
                <div className="quote-section__content">

                  <p className="ktl-text-1 ktl-offset-bottom-m">
                    Seamless interoperability with the JVM ecosystem means that Kotlin can rely on numerous existing
                    libraries. The Kotlin plugin bundles a Java to Kotlin converter (J2K) that automatically converts
                    Java files to Kotlin.
                  </p>

                  <QuotesSlider quotes={quotes.interoperable}
                  />
                </div>

                <div className="quote-section__info">
                  <p className="ktl-text-2 ktl-offset-bottom-s ktl-dimmed-text">
                    Kotlin can also be compiled into a standalone native binary targeting any major operating system.
                  </p>

                  <ul className="ktl-text-2">
                    <li className="ktl-offset-bottom-s">
                      <a
                        href="https://kotlinlang.org/docs/mixing-java-kotlin-intellij.html#converting-an-existing-java-file-to-kotlin-with-j2k"
                        target="_blank" className="ktl-text-2 ktl-link">
                        <span className="rs-link">Java-to-Kotlin converter</span>
                        <span>&nbsp;↗</span>
                      </a>
                    </li>
                    <li className="ktl-offset-bottom-s">
                      <a href="https://kotlinlang.org/docs/jvm-get-started.html" target="_blank"
                         className="ktl-text-2 ktl-link">
                        <span className="rs-link">Kotlin/JVM</span>
                        <span>&nbsp;↗</span>
                      </a>
                    </li>
                    <li>
                      <a href="https://kotlinlang.org/docs/native-get-started.html" target="_blank"
                         className="ktl-text-2 ktl-link">
                        <span className="rs-link">Kotlin/Native</span>
                        <span>&nbsp;↗</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="quote-section ktl-offset-bottom-xl ktl-with-anchor" id="supports-multiple-paradigms">
              <h3 className="ktl-h3 ktl-offset-bottom-s">
                Supports multiple paradigms
              </h3>

              <div className="quote-section__grid">
                <div className="quote-section__content">

                  <p className="ktl-text-1 ktl-offset-bottom-m">
                    Kotlin combines all the major programming paradigms in an elegant way, making it possible to use
                    functional, imperative, object-oriented, or procedural programming – all within the same language.
                    With
                    Kotlin’s support for coroutines, the concepts of concurrency and parallelism come naturally.
                  </p>

                  <QuotesSlider quotes={quotes.supportsMultipleParadigms}
                  />
                </div>

                <div className="quote-section__info">
                  <p className="ktl-text-2 ktl-dimmed-text">
                    Kotlin supports functional, imperative, object-oriented and procedural programming
                  </p>
                </div>
              </div>
            </section>

            <section className="quote-section ktl-offset-bottom-xl ktl-with-anchor" id="modern-concise-and-safe">
              <h3 className="ktl-h3 ktl-offset-bottom-s">
                Modern, concise, and safe
              </h3>

              <div className="quote-section__grid">
                <div className="quote-section__content">

                  <p className="ktl-text-1 ktl-offset-bottom-s">
                    Kotlin allows students to focus on expressing their ideas, as they don’t have to write as much
                    boilerplate code. Less code written also means less code to test and debug. This language design
                    makes
                    Kotlin a highly productive language, and it also simplifies grading homework and understanding the
                    students' code.
                  </p>

                  <p className="ktl-text-1 ktl-offset-bottom-m">
                    Kotlin promotes writing correct programs with static type checking and automatic memory management.
                    It rules out null-pointer dereferences and has no explicit pointers or undetectable uninitialized
                    variables. 
                  </p>

                  <QuotesSlider quotes={quotes.modernConciseAndSafe}
                  />
                </div>

                <div className="quote-section__info">
                  <p className="ktl-text-2 ktl-offset-bottom-s ktl-dimmed-text">
                    Type safety, null safety, and expressive syntax are among educators’ favorite Kotlin features.
                  </p>
                  <p className="ktl-text-2 ktl-dimmed-text">
                    (Source: an internal study on teaching Kotlin)
                  </p>
                </div>
              </div>
            </section>

            <section className="quote-section ktl-offset-bottom-xl ktl-with-anchor" id="tooling">
              <h3 className="ktl-h3 ktl-offset-bottom-s">
                Tooling
              </h3>

              <div className="quote-section__grid">
                <div className="quote-section__content">

                  <p className="ktl-text-1 ktl-offset-bottom-s">
                    Many of the top professional tools are packaged with the language. IntelliJ IDEA Ultimate supports
                    Kotlin
                    as a first-class citizen and is free for educators and students. It offers great productivity
                    features,
                    such as smart code completion, code inspections, a visual debugger, and more.
                  </p>

                  <p className="ktl-text-1 ktl-offset-bottom-s">
                    The educational JetBrains Academy plugin is also available to help learn and teach Kotlin programming.
                    Educators
                    can use existing interactive courses or create custom ones, with hands-on assignments and practice
                    coding tasks. Integrated tests will automatically check the assignments and provide feedback.
                  </p>

                  <p className="ktl-text-1 ktl-offset-bottom-m">
                    Kotlin offers various teaching and learning, and community resources.
                  </p>

                  <QuotesSlider quotes={quotes.toolingAndLearningMaterials}
                  />
                </div>

                <div className="quote-section__info">
                  <ul className="ktl-text-2">
                    <li className="ktl-offset-bottom-s">
                      <a href="https://www.jetbrains.com/community/education/#students" target="_blank"
                         className="ktl-text-2 ktl-link">
                        <span className="rs-link">Free IntelliJ IDEA Ultimate license</span>
                        <span>&nbsp;↗</span>
                      </a>
                    </li>
                    <li className="ktl-offset-bottom-s">
                      <a href="https://play.kotlinlang.org/" target="_blank" className="ktl-text-2 ktl-link">
                        <span className="rs-link">Playground</span>
                        <span>&nbsp;↗</span>
                      </a>
                    </li>
                    <li className="ktl-offset-bottom-s">
                      <a href="https://plugins.jetbrains.com/plugin/10081-jetbrains-academy" target="_blank"
                         className="ktl-text-2 ktl-link">
                        <span className="rs-link">JetBrains Academy plugin</span>
                        <span>&nbsp;↗</span>
                      </a>
                    </li>
                    <li className="ktl-offset-bottom-s">
                      <a href="https://www.jetbrains.com/code-with-me/" target="_blank" className="ktl-text-2 ktl-link">
                        <span className="rs-link">Code With Me</span>
                        <span>&nbsp;↗</span>
                      </a>
                    </li>
                    <li>
                      <a href="https://hyperskill.org/tracks?category=4&utm_source=jbkotlin_hs&utm_medium=referral&utm_campaign=kotlinlang-education&utm_content=button_1&utm_term=22.03.23" target="_blank" className="ktl-text-2 ktl-link">
                        <span className="rs-link">Kotlin tracks by JetBrains Academy</span>
                        <span>&nbsp;↗</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </section>
          </div>

          <div className="why-teach-grid__nav">
            <ul className="ktl-text-2 why-teach-nav">
              <li className="why-teach-nav__item">
                <a href="#academically-recognized" className="why-teach-nav__link">
                  <span className="rs-link">Academically recognized</span>
                </a>
              </li>
              <li className="why-teach-nav__item">
                <a href="#language-of-the-industry" className="why-teach-nav__link">
                  <span className="rs-link">Language of the industry</span>
                </a>
              </li>
              <li className="why-teach-nav__item">
                <a href="#multiplatform" className="why-teach-nav__link">
                  <span className="rs-link">Multiplatform</span>
                </a>
              </li>
              <li className="why-teach-nav__item">
                <a href="#interoperable" className="why-teach-nav__link">
                  <span className="rs-link">Interoperable</span>
                </a>
              </li>
              <li className="why-teach-nav__item">
                <a href="#supports-multiple-paradigms" className="why-teach-nav__link">
                  <span className="rs-link">Supports multiple paradigms</span>
                </a>
              </li>
              <li className="why-teach-nav__item">
                <a href="#modern-concise-and-safe" className="why-teach-nav__link">
                  <span className="rs-link">Modern, concise, and safe</span>
                </a>
              </li>
              <li className="why-teach-nav__item">
                <a href="#tooling" className="why-teach-nav__link">
                  <span className="rs-link">Tooling</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

      </div>

      <section className="ktl-offset-top-xxl">
        <TeachCtaBlock/>
      </section>
    </div>
  )
}

export default WhyTeach;
