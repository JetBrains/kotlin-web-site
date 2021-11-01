import React from 'react';

import {TeachTopMenu} from "../teach/components/teach-top-menu";
import {TeachCtaBlock} from "../teach/components/teach-cta-block";

import {QuotesSlider} from '@jetbrains/kotlin-web-site-ui/dist/quotesSlider';
import '@jetbrains/kotlin-web-site-ui/dist/quotesSlider.css';

import './style.scss'

export const WhyTeach = ({path}) => {
  return (
    <div className="teach-wrapper">
      <TeachTopMenu path={path}/>

      <div className="ktl-container">

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
                    25 of the top 100 universities in the Times Higher Education World University Rankings 2021 include
                    Kotlin in their courses. We know of 190 universities that teach Kotlin, which is almost twice as
                    many as
                    there were in 2020.
                  </p>

                  <p className="ktl-text-1 ktl-offset-bottom-m">
                    Kotlin is used to teach a variety of topics, including object-oriented and functional programming,
                    software engineering, introductory programming, mobile application development, concurrent
                    programming,
                    and scientific programming (Source: internal Teaching Kotlin Study).
                  </p>

                  <QuotesSlider quotes={[
                    {
                      title: 'Eamonn De Leastar, Waterford Institute of Technology',
                      text: 'On numerous courses, where we proceed through Java to Kotlin, we are considering a Kotlin-first approach.'
                    },
                    {
                      title: 'Eugeniy Tyumentcev, Omsk State University',
                      text: 'I teach Software Engineering with Kotlin. We also have a separate Android Development course. So I can teach in a language that students can use in other courses.'
                    },
                  ]}
                  />
                </div>

                <div className="quote-section__info">
                  <p className="ktl-hero ktl-offset-bottom-xs">25</p>
                  <p className="ktl-text-2 ktl-offset-bottom-s ktl-dimmed-text">
                    of the top 100 universities in the Times Higher Education World University Rankings 2021 include
                    Kotlin
                    in
                    their courses.
                  </p>

                  <a
                    href="https://docs.google.com/spreadsheets/d/1p77WHo--mxewmxINWMLaTPGXvnEr0JGxgSMcX6C0b_0/edit?usp=sharing"
                    target="_blank" className="ktl-text-2 ktl-link">
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

                  <p className="ktl-text-1 ktl-offset-bottom-m">
                    <ul>
                      <li className="ktl-offset-bottom-s">
                        — Kotlin is used by top companies such as Google, Twitter, Reddit, Netflix, Uber, BMW, Coursera,
                        Slack, and Trello, just to name a few.
                      </li>
                      <li className="ktl-offset-bottom-s">
                        — Kotlin has consistently ranked among the top 4 most-loved programming languages since 2018,
                        according to the <a className="rs-link"
                                            href="https://insights.stackoverflow.com/survey/2019#most-loved-dreaded-and-wanted">Stack
                        Overflow Developer Surveys.</a>
                      </li>

                      <li className="ktl-offset-bottom-s">
                        — Kotlin is one of the fastest-growing programming languages, ranking fourth in that category
                        in <a
                        className="rs-link" href="https://octoverse.github.com/">GitHub’s 2019 State of the Octoverse
                        survey.</a>
                      </li>

                      <li>
                        — Kotlin has the fastest growing language community. (<a className="rs-link"
                                                                                 href="https://developer-economics.cdn.prismic.io/developer-economics/dbf9f36f-a31a-440a-9c22-c599cc235fa4_20th+edition+-+State+of+the+developer+Nation.pdf">SlashData's
                        State of the Developer Nation 20th
                        edition, Q1 2021</a>)
                      </li>
                    </ul>
                  </p>

                  <QuotesSlider quotes={[
                    {
                      title: 'Ryan Stansifer, Florida Institute of Technology',
                      text: 'Students are happy to have the chance to program in something they may have heard about.'
                    },
                    {
                      title: 'Károly Machalik, University of Pannonia',
                      text: 'The students are so happy. They can produce useful software quickly.'
                    },
                  ]}
                  />
                </div>

                <div className="quote-section__info">
                  <p className="ktl-hero">4th</p>
                  <p className="ktl-text-2 ktl-offset-bottom-s ktl-dimmed-text">
                    most loved programming language in the 2019
                  </p>

                  <a href="https://insights.stackoverflow.com/survey/2019#most-loved-dreaded-and-wanted" target="_blank"
                     className="ktl-text-2 ktl-link">
                    <span className="rs-link">StackOverflow Developer Survey</span>
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
                    The first-choice language for Android development, Kotlin is also being adopted for teaching
                    multiplatform development for mobile, web, server-side programming, data science, and other computer
                    science topics.
                  </p>

                  <QuotesSlider quotes={[
                    {
                      title: 'Jacob Mass, University of Tartu',
                      text: 'Decrease in boilerplate helps us to quickly identify which fundamental Android concepts students are missing. The likelihood of issues arising due to some basic syntactic/language problems is lower, allowing students instead to focus on more fundamental software design matters.'
                    }
                  ]}
                  />
                </div>

                <div className="quote-section__info">
                  <p className="ktl-text-2 ktl-offset-bottom-s ktl-dimmed-text">
                    Android development will become increasingly Kotlin-first.
                  </p>

                  <a
                    href="https://android-developers.googleblog.com/2019/05/google-io-2019-empowering-developers-to-build-experiences-on-Android-Play.html"
                    target="_blank" className="ktl-text-2 ktl-link">
                    <span className="rs-link">Google I/O 2019</span>
                    <span>&nbsp;↗</span>
                  </a>
                </div>
              </div>
            </section>


            <section className="quote-section ktl-offset-bottom-xl ktl-with-anchor" id="easy-to-learn">
              <h3 className="ktl-h3 ktl-offset-bottom-s">
                Easy to learn
              </h3>

              <div className="quote-section__grid">
                <div className="quote-section__content">

                  <p className="ktl-text-1 ktl-offset-bottom-m">
                    Kotlin has a soft learning curve and builds on the students' previous programming experience. It is
                    simple to grasp for those with a Java or Python background.
                  </p>

                  <QuotesSlider quotes={[
                    {
                      title: 'San Skulrattanakulchai, Gustavus Adolphus College',
                      text: 'My students think Kotlin is an easy language to learn. Some students have adopted Kotlin as their main programming language. They use it as their language of choice when they can choose a language for completing an assignment or project.'
                    },
                    {
                      title: 'Scott Stanchfield, Johns Hopkins University',
                      text: 'Nearly all my students have picked up Kotlin quite easily and really loved it, as compared with Java.'
                    },
                    {
                      title: 'Enrico Denti, University of Bologna',
                      text: 'I appreciate Kotlin`s diffusion, its innovation while being able to ‘stay in the mainstream’ to soften the learning curve, the way it supports key concepts – in short, its clarity and cleanness.'
                    },
                  ]}
                  />
                </div>

                <div className="quote-section__info">
                  <p className="ktl-hero ktl-offset-bottom-xs">88%</p>
                  <p className="ktl-text-2 ktl-offset-bottom-s ktl-dimmed-text">
                    of students give positive feedback about learning Kotlin
                  </p>
                  <p className="ktl-text-2 ktl-dimmed-text">
                    (Source: internal Teaching Kotlin Study)
                  </p>
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
                    libraries. Java programs can also call Kotlin code without any overhead. Our helpful Java-to-Kotlin
                    converter makes it easy to migrate existing course materials. It also helps students quickly learn
                    the
                    syntax if they are already familiar with Java.
                  </p>

                  <QuotesSlider quotes={[
                    {
                      title: 'David Vaughn, University of Missouri–St. Louis',
                      text: 'Kotlin is faster to develop and comprehend what is happening; near 100% backwards compatibility makes it easy to show in Java and translate into Kotlin while still utilizing every available library from Java; Students seem to understand it fairly quickly.'
                    },
                    {
                      title: 'Paulo Pereira, Lisbon Superior Engineering Institute (ISEL)',
                      text: 'For the upcoming Introductory Programming course, we chose Kotlin, because we wanted a language that targets the JVM and seamlessly interoperates with its ecosystem: a stack of utmost importance to our market.'
                    },
                  ]}
                  />
                </div>

                <div className="quote-section__info">
                  <p className="ktl-text-2 ktl-offset-bottom-s ktl-dimmed-text">
                    Kotlin can also be compiled to JavaScript to run in the browser or on Node.js, or into a standalone
                    native binary targeting any major operating system.
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
                    <li className="ktl-offset-bottom-s">
                      <a href="https://kotlinlang.org/docs/js-get-started.html" target="_blank"
                         className="ktl-text-2 ktl-link">
                        <span className="rs-link">Kotlin/JS</span>
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

                  <QuotesSlider quotes={[
                    {
                      title: 'Alexey Mitsyuk, HSE university',
                      text: 'You are able to teach procedural programming for the very beginners without needing to describe classes. Thus, your course can be more consistent.'
                    },
                    {
                      title: 'Fernando Magno Quintão Pereira, Federal University of Minas Gerais',
                      text: 'Kotlin has strong support for object-oriented programming, and also support for functional programming.'
                    },
                    {
                      title: 'San Skulrattanakulchai, Gustavus Adolphus College',
                      text: 'My Kotlin students in fact understand OO concepts better than my Java students do.'
                    },
                  ]}
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
                    students' code. According to an internal Teaching Kotlin survey, Kotlin’s concise and expressive
                    syntax
                    is its most beloved feature among educators.
                  </p>

                  <p className="ktl-text-1 ktl-offset-bottom-m">
                    Kotlin promotes writing correct programs with static type checking and automatic memory management.
                    It
                    rules out null-pointer dereferences and has no explicit pointers or undetectable uninitialized
                    variables. Type safety and null safety are some of the most beloved features among Kotlin
                    instructors,
                    according to our internal Teaching Kotlin study.
                  </p>

                  <QuotesSlider quotes={[
                    {
                      title: 'Nick Efford, University of Leeds',
                      text: 'Kotlin`s compactness is my favorite feature. I’ve translated a few of my Java programming courseworks into Kotlin and noticed that code typically shrinks to 50% of its original size. As a teacher, I also get some benefit from being able to use less code when showing students how to do things.'
                    },
                    {
                      title: 'Zaid Altahat, Northwestern University, University of Wisconsin–Parkside',
                      text: 'Simple syntax. Less code to get more done. At the same time Kotlin has advanced topics such as coroutines.'
                    },
                    {
                      title: 'Mark Zaslavskiy, ITMO University',
                      text: 'One of Kotlin’s advantages is a good combination of strong typing and nullability.'
                    },
                    {
                      title: 'Jeffrey Paone, Colorado School of Mines',
                      text: 'Fewer runtime errors are Kotlin’s advantage. Null safety is my favorite Kotlin feature.'
                    },
                  ]}
                  />
                </div>

                <div className="quote-section__info">
                  <p className="ktl-text-2 ktl-offset-bottom-s ktl-dimmed-text">
                    Type safety and null safety are among the favorite features of Kotlin instructors
                  </p>
                  <p className="ktl-text-2 ktl-dimmed-text">
                    (Source: internal Teaching Kotlin Study)
                  </p>
                </div>
              </div>
            </section>

            <section className="quote-section ktl-offset-bottom-xl ktl-with-anchor" id="prepares-students-for-careers">
              <h3 className="ktl-h3 ktl-offset-bottom-s">
                Prepares students for careers
              </h3>

              <div className="quote-section__grid">
                <div className="quote-section__content">

                  <p className="ktl-text-1 ktl-offset-bottom-s">
                    Teaching professional software engineering practices improves students’ employment prospects. And
                    knowing that Kotlin is a marketable skill, students tend to be more enthusiastic about studying it.
                  </p>

                  <p className="ktl-text-1 ktl-offset-bottom-s">
                    Kotlin ranked fifth in the category of Most In-Demand Coding Languages Across the Globe from <a
                    herf="http://pages.hired.email/rs/289-SIY-439/images/2019-State-of-SoftwareEngineers-Report.pdf?mkt_tok=eyJpIjoiTW1ReVl6RTNZVE15WWpNMSIsInQiOiJ5ajJ4N0xSQ3lRRmFscU84b1FzNGhZXC9IM2ZXbElCcHordUljaGY4Sk00RmtYMU1DVFJWSk1zRFExa3Q5NUlocE9LZVRRd2k3dUJzOVBLeFFQY2d1aWc2NnZydjNsVm1tYzNnUjlwN2xCZWxReEU3YmROTDNIcjA1cHRNaHRlS0EifQ%3D%3D"
                    target="_blank" className="rs-link">Hired’s 2019 State of Software Engineers Report.</a>
                  </p>

                  <p className="ktl-text-1 ktl-offset-bottom-m">
                    Kotlin ranked third among programming languages that developers are planning on learning next,
                    according
                    to <a href="https://research.hackerrank.com/developer-skills/2020" target="_blank"
                          className="rs-link">HackerRank’s
                    2020 Developer Skills Report.</a>
                  </p>

                  <QuotesSlider quotes={[
                    {
                      title: 'Ted Herman, University of Iowa',
                      text: 'Employment prospects and how the language will be on the resume are things to look at when choosing a language to teach.'
                    },
                    {
                      title: 'Fernando Magno Quintão Pereira, Federal University of Minas Gerais',
                      text: 'Students like the language. It`s less verbose than Java, for instance, and has more market appeal than OCaml and ML.'
                    },
                  ]}
                  />
                </div>

                <div className="quote-section__info">
                  <p className="ktl-text-2 ktl-offset-bottom-s ktl-dimmed-text">
                    Kotlin job postings have increased by more than 1400% since 2017
                  </p>
                  <a href="https://insights.dice.com/2018/09/24/kotlin-jobs-meteoric-rise-android/" target="_blank"
                     className="ktl-text-2 ktl-link">
                    <span className="rs-link">Dice</span>
                    <span>&nbsp;↗</span>
                  </a>
                </div>
              </div>
            </section>

            <section className="quote-section ktl-offset-bottom-xl ktl-with-anchor" id="tooling-and-learning-materials">
              <h3 className="ktl-h3 ktl-offset-bottom-s">
                Tooling and Learning Materials
              </h3>

              <div className="quote-section__grid">
                <div className="quote-section__content">

                  <p className="ktl-text-1 ktl-offset-bottom-s">
                    The top tools of the profession are packaged with the language. IntelliJ IDEA Ultimate supports
                    Kotlin
                    as a first-class citizen and is free for educators and students. It offers great productivity
                    features,
                    such as smart code completion, code inspections, a visual debugger, and more.
                  </p>

                  <p className="ktl-text-1 ktl-offset-bottom-s">
                    The educational EduTools plugin is also available to help learn and teach Kotlin programming.
                    Educators
                    can use existing interactive courses or create custom ones, with hands-on assignments and practice
                    coding tasks. Integrated tests will automatically check the assignments and provide feedback.
                  </p>

                  <p className="ktl-text-1 ktl-offset-bottom-m">
                    Kotlin offers various teaching and learning resources, case studies, and community resources.
                  </p>

                  <QuotesSlider quotes={[
                    {
                      title: 'Alexander Nozik, Moscow Institute of Physics and Technology',
                      text: 'JetBrains equipped Kotlin with the best available tooling to simplify development.'
                    },
                    {
                      title: 'Mariusz Nowostawski, Norwegian University of Science and Technology',
                      text: 'Go for it! You will love it. The language is mature, the IDE support is fantastic, the documentation is great.'
                    },
                  ]}
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
                      <a href="https://plugins.jetbrains.com/plugin/10081-edutools" target="_blank"
                         className="ktl-text-2 ktl-link">
                        <span className="rs-link">EduTools plugin</span>
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
                      <a href="https://hyperskill.org/tracks/18" target="_blank" className="ktl-text-2 ktl-link">
                        <span className="rs-link">Kotlin Basics track on JetBrains Academy</span>
                        <span>&nbsp;↗</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="quote-section ktl-offset-bottom-xl ktl-with-anchor" id="open-source-community">
              <h3 className="ktl-h3 ktl-offset-bottom-s">
                Open Source Community
              </h3>

              <div className="quote-section__grid">
                <div className="quote-section__content">

                  <p className="ktl-text-1">
                    Open source at heart, Kotlin is a free language that runs on all major platforms. Kotlin is
                    supported
                    by, and evolves with the help of, its diverse and enthusiastic community, which includes over 200
                    Kotlin
                    User Groups all around the world, an active forum, Slack, Reddit, and Stack Overflow communities,
                    and
                    many other resources.
                  </p>
                </div>

                <div className="quote-section__info">
                  <ul className="ktl-text-2">
                    <li className="ktl-offset-bottom-s">
                      <a href="https://kotlinlang.org/user-groups/user-group-list.html" target="_blank"
                         className="ktl-text-2 ktl-link">
                        <span className="rs-link">200 Kotlin User Groups</span>
                        <span>&nbsp;↗</span>
                      </a>
                    </li>
                    <li className="ktl-offset-bottom-s">
                      <a href="https://surveys.jetbrains.com/s3/kotlin-slack-signup-educators" target="_blank"
                         className="ktl-text-2 ktl-link">
                        <span className="rs-link">Kotlinlang Slack workspace</span>
                        <span>&nbsp;↗</span>
                      </a>
                    </li>
                    <li className="ktl-offset-bottom-s">
                      <a href="https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw" target="_blank"
                         className="ktl-text-2 ktl-link">
                        <span className="rs-link">Kotlin YouTube channel</span>
                        <span>&nbsp;↗</span>
                      </a>
                    </li>
                    <li className="ktl-offset-bottom-s">
                      <a href="https://twitter.com/kotlin" target="_blank" className="ktl-text-2 ktl-link">
                        <span className="rs-link">Twitter</span>
                        <span>&nbsp;↗</span>
                      </a>
                    </li>
                    <li className="ktl-offset-bottom-s">
                      <a href="https://www.reddit.com/r/Kotlin/" target="_blank" className="ktl-text-2 ktl-link">
                        <span className="rs-link">Reddit</span>
                        <span>&nbsp;↗</span>
                      </a>
                    </li>
                    <li className="ktl-offset-bottom-s">
                      <a href="https://stackoverflow.com/questions/tagged/kotlin" target="_blank"
                         className="ktl-text-2 ktl-link">
                        <span className="rs-link">Stack Overflow</span>
                        <span>&nbsp;↗</span>
                      </a>
                    </li>
                    <li>
                      <a href="https://discuss.kotlinlang.org/" target="_blank" className="ktl-text-2 ktl-link">
                        <span className="rs-link">Forum</span>
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
              <li className="ktl-offset-bottom-s">
                <a href="#academically-recognized" className="ktl-text-2 ktl-link">
                  <span className="rs-link">Academically recognized</span>
                </a>
              </li>
              <li className="ktl-offset-bottom-s">
                <a href="#language-of-the-industry" className="ktl-text-2 ktl-link">
                  <span className="rs-link">Language of the industry</span>
                </a>
              </li>
              <li className="ktl-offset-bottom-s">
                <a href="#multiplatform" className="ktl-text-2 ktl-link">
                  <span className="rs-link">Multiplatform</span>
                </a>
              </li>
              <li className="ktl-offset-bottom-s">
                <a href="#easy-to-learn" className="ktl-text-2 ktl-link">
                  <span className="rs-link">Easy to learn</span>
                </a>
              </li>
              <li className="ktl-offset-bottom-s">
                <a href="#interoperable" className="ktl-text-2 ktl-link">
                  <span className="rs-link">Interoperable</span>
                </a>
              </li>
              <li className="ktl-offset-bottom-s">
                <a href="#supports-multiple-paradigms" className="ktl-text-2 ktl-link">
                  <span className="rs-link">Supports multiple paradigms</span>
                </a>
              </li>
              <li className="ktl-offset-bottom-s">
                <a href="#modern-concise-and-safe" className="ktl-text-2 ktl-link">
                  <span className="rs-link">Modern, concise, and safe</span>
                </a>
              </li>
              <li className="ktl-offset-bottom-s">
                <a href="#prepares-students-for-careers" className="ktl-text-2 ktl-link">
                  <span className="rs-link">Prepares students for careers</span>
                </a>
              </li>
              <li className="ktl-offset-bottom-s">
                <a href="#tooling-and-learning-materials" className="ktl-text-2 ktl-link">
                  <span className="rs-link">Tooling and Learning Materials</span>
                </a>
              </li>
              <li>
                <a href="#open-source-community" className="ktl-text-2 ktl-link">
                  <span className="rs-link">Open Source Community</span>
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