[//]: # (title: Get started with Kotlin)

[Kotlin](https://kotlinlang.org) is a modern but already mature programming language aimed to make developers happier.
It’s concise, safe, interoperable with Java and other languages, and provides many ways to reuse code between multiple platforms for productive programming.

Pick it up to start building powerful applications!

## Learn Kotlin fundamentals

* If you're already familiar with one or more programming languages and want to learn Kotlin, start with these [Kotlin learning materials](learning-materials-overview.md).
* If Kotlin is your first programming language, we recommend starting with the [Atomic Kotlin book](https://www.atomickotlin.com/atomickotlin/)
or signing up for the free [Kotlin Basics track](https://hyperskill.org/tracks/18) on JetBrains Academy.

## Create your powerful application with Kotlin
 
<tabs>

<tab title="Backend app">

Here is how you can take the first steps in developing Kotlin server-side applications.

1. **Install the [latest version of IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html).**

2. **Create your first backend application:**
   
   * To start from scratch, [create a basic JVM application with the IntelliJ IDEA project wizard](jvm-get-started.md).
   * If you prefer more robust examples, choose one of the frameworks below and create a project:

   <table width="100%" >
   <tr>
      <th>Spring</th>
      <th>Ktor</th>
   </tr>
   <tr>
   <td width="50%">
     A mature family of frameworks with an established ecosystem that is used by millions of developers worldwide.
   <br/>
   <ul>
      <li><a href="jvm-spring-boot-restful.md">Create a RESTful web service with Spring Boot</a>.</li>
      <li><a href="https://spring.io/guides/tutorials/spring-boot-kotlin/">Build web applications with Spring Boot and Kotlin</a>.</li>
      <li><a href="https://spring.io/guides/tutorials/spring-webflux-kotlin-rsocket/">Use Spring Boot with Kotlin and RSocket</a>.</li>
   </ul>
   </td>
   <td width="50%">
      A lightweight framework for those who value freedom in making architectural decisions.
   <ul>
      <li><a href="https://ktor.io/docs/creating-http-apis.html">Create HTTP APIs with Ktor</a>.</li>
      <li><a href="https://ktor.io/docs/creating-web-socket-chat.html">Create a WebSocket chat with Ktor</a>.</li>
      <li><a href="https://ktor.io/docs/creating-interactive-website.html">Create an interactive website with Ktor</a>.</li>
      <li><a href="https://ktor.io/docs/heroku.html">Publish server-side Kotlin applications: Ktor on Heroku</a>.</li>
   </ul>
   
   </td>
   </tr>
   </table>

3. **Use Kotlin and third-party libraries in your application**. Learn more about [adding library and tool dependencies to your project](gradle.md#configuring-dependencies).
   * The [Kotlin standard library](https://kotlinlang.org/api/latest/jvm/stdlib/) offers a lot of useful things such as [collections](collections-overview.md) or [coroutines](coroutines-guide.md).
   * Take a look at the following [third-party frameworks, libs and tools for Kotlin](https://blog.jetbrains.com/kotlin/2020/11/server-side-development-with-kotlin-frameworks-and-libraries/).

4. **Learn more about Kotlin for server-side:**
   * [How to write your first unit test](jvm-test-using-junit.md).
   * [How to mix Kotlin and Java code in your application](mixing-java-kotlin-intellij.md).

5. **Join the Kotlin server-side community:**
   * ![Slack](slack.svg){width=25}{type="joined"} Slack: [get an invite](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) and join the [#getting-started](https://kotlinlang.slack.com/archives/C0B8MA7FA), [#server](https://kotlinlang.slack.com/archives/C0B8RC352), [#spring](https://kotlinlang.slack.com/archives/C0B8ZTWE4), or [#ktor](https://kotlinlang.slack.com/archives/C0A974TJ9) channels.
   * ![StackOverflow](stackoverflow.svg){width=25}{type="joined"} StackOverflow: subscribe to the [“kotlin”](https://stackoverflow.com/questions/tagged/kotlin), ["spring-kotlin"](https://stackoverflow.com/questions/tagged/spring-kotlin), or ["ktor"](https://stackoverflow.com/questions/tagged/ktor) tags.

6. **Follow Kotlin** on ![Twitter](twitter.svg){width=25}{type="joined"} [Twitter](https://twitter.com/kotlin), ![Reddit](reddit.svg){width=25}{type="joined"} [Reddit](https://www.reddit.com/r/Kotlin/), and ![YouTube](youtube.svg){width=25}{type="joined"} [Youtube](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw), and don't miss any important ecosystem updates.

If you've encountered any difficulties or problems, report an issue to our [issue tracker](https://youtrack.jetbrains.com/issues/KT).

</tab>

<tab title="Cross-platform mobile app">

Here you'll learn how to develop and improve your cross-platform mobile application using [Kotlin Multiplatform Mobile (KMM)](https://kotlinlang.org/lp/mobile/).

1. **[Set up your environment for cross-platform development](kmm-setup.md).**

2. **Create your first KMM application:**

   * To start from scratch, [create a basic KMM application with the project wizard](kmm-create-first-app.md).
   * If you have an existing Android application and want to make it cross-platform, complete the [Make your Android application work on iOS](kmm-integrate-in-existing-app.md) tutorial.
   * If you prefer real-life examples, clone and play with an existing project, for example the networking and data storage project from the [hands-on tutorial](https://play.kotlinlang.org/hands-on/Networking%20and%20Data%20Storage%20with%20Kotlin%20Multiplatfrom%20Mobile/01_Introduction) or any [KMM sample](kmm-samples.md).

3. **Use a wide set of multiplatform libraries** to implement the required business logic only once in the shared module. Learn more about [adding dependencies](kmm-add-dependencies.md).
   
   |Library|Details|
   |-------|-------| 
   | Ktor |  [Docs](https://ktor.io/docs/client.html).| 
   | Serialization |  [Docs](serialization.md) and [sample](https://play.kotlinlang.org/hands-on/Networking%20and%20Data%20Storage%20with%20Kotlin%20Multiplatfrom%20Mobile/04_Creating_a_data_model).|
   | Coroutines |  [Docs](kmm-concurrency-overview.md) and [sample](kmm-concurrency-and-coroutines.md).|
   | DateTime | [Docs](https://github.com/Kotlin/kotlinx-datetime#readme).|
   | SQLDelight | Third-party library. [Docs](https://cashapp.github.io/sqldelight/) and [sample](kmm-configure-sqldelight-for-data-storage.md ).|
   
   > You can also find a multiplatform library in the [community-driven list](https://libs.kmp.icerock.dev/).
   > 
   {type="tip"}

4. **Learn more about KMM:**
   * Learn more about [Kotlin Multiplatform](mpp-intro.md).
   * Look through [KMM samples on GitHub](kmm-samples.md).
   * [Create and publish a multiplatform library](mpp-create-lib.md).
   * Learn how KMM is used at [Netflix](https://netflixtechblog.com/netflix-android-and-ios-studio-apps-kotlin-multiplatform-d6d4d8d25d23), [VWWare](https://kotlinlang.org/lp/mobile/case-studies/vmware/), [Yandex](https://kotlinlang.org/lp/mobile/case-studies/yandex/), and [many other companies](https://kotlinlang.org/lp/mobile/case-studies/).

5. **Join the Kotlin Multiplatform community:**

   * ![Slack](slack.svg){width=25}{type="joined"} Slack: [get an invite](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) and join the [#getting-started](https://kotlinlang.slack.com/archives/C0B8MA7FA) and [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) channels.
   * ![StackOverflow](stackoverflow.svg){width=25}{type="joined"} StackOverflow: Subscribe to the [“kotlin-multiplatform” tag](https://stackoverflow.com/questions/tagged/kotlin-multiplatform).

6. **Follow Kotlin** on ![Twitter](twitter.svg){width=25}{type="joined"} [Twitter](https://twitter.com/kotlin), ![Reddit](reddit.svg){width=25}{type="joined"} [Reddit](https://www.reddit.com/r/Kotlin/), and ![YouTube](youtube.svg){width=25}{type="joined"} [Youtube](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw), and don't miss any important ecosystem updates.

If you've encountered any difficulties or problems, report an issue to our [issue tracker](https://youtrack.jetbrains.com/issues/KT).

</tab>

<tab title="Frontend web app">

Kotlin provides an ability to transpile your Kotlin code, the Kotlin standard library, and any compatible dependencies to JavaScript.

Here you'll learn how to develop and improve your frontend web application using [Kotlin/JS](js-overview.md).

1. **Install the [latest version of IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html).**

2. **Create your first frontend web application:**

   * To start from scratch, [create a basic browser application with the IntelliJ IDEA project wizard](js-project-setup.md).
   * If you prefer more robust examples, complete the [Building Web Applications with React and Kotlin/JS](https://play.kotlinlang.org/hands-on/Building%20Web%20Applications%20with%20React%20and%20Kotlin%20JS/01_Introduction) hands-on tutorial. It includes a sample project that can serve as a good starting point for your own projects, and contains useful snippets and templates.

3. **Use libraries in your application.** Learn more about [adding dependencies](js-project-setup.md#dependencies).  
    
   |Library | Details |
   |--------|---------|
   |[stdlib](https://kotlinlang.org/api/latest/jvm/stdlib/) | The Kotlin standard library included in all projects by default. |
   |[kotlinx.browser](browser-api-dom.md)| The Kotlin library for accessing browser-specific functionality, including typical top-level objects such as document and window. |
   |[kotlinx.html](typesafe-html-dsl.md) | The Kotlin library for generating DOM elements using statically-typed HTML builders.|
   |[Ktor](https://ktor.io/) | The Kotlin multiplatform library for networking. |
   |[KVision](https://kvision.io/) | A third-party object-oriented web framework for Kotlin/JS.|
   |[fritz2](https://www.fritz2.dev/)| A third-party lightweight, high-performance, independent library for building reactive web apps in Kotlin that are heavily dependent on coroutines and flows.|
   |[Doodle](https://nacular.github.io/doodle/) | A third-party vector-based UI framework that uses browser's capabilities to draw user interfaces.|
   |[Compose for Web](https://jb.gg/compose-web) | Brings [Google’s Jetpack Compose UI toolkit](https://developer.android.com/jetpack/compose) to the browser. A _Technology Preview_ is currently available.|
   |[kotlin-wrappers](https://github.com/JetBrains/kotlin-wrappers) | Provide convenient abstractions and deep integrations for one of the most popular JavaScript frameworks. Kotlin wrappers also provide support for a number of adjacent technologies like `react-redux`, `react-router`, or `styled-components`. |

4. **Learn more about Kotlin for frontend web development:**

   * The [new Kotlin/JS IR compiler](js-ir-compiler.md) (currently with [Beta](components-stability.md) stability).
   * [Using dependencies from npm](using-packages-from-npm.md).
   * [Using Kotlin code from JavaScript](js-to-kotlin-interop.md).

5. **Join the Kotlin frontend web community:**

   * ![Slack](slack.svg){width=25}{type="joined"} Slack: [get an invite](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) and join the [#getting-started](https://kotlinlang.slack.com/archives/C0B8MA7FA) and [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) channels.
   * ![StackOverflow](stackoverflow.svg){width=25}{type="joined"} StackOverflow: subscribe to the [“kotlin-js” tag](https://stackoverflow.com/questions/tagged/kotlin-js).

6. **Follow Kotlin** on ![Twitter](twitter.svg){width=25}{type="joined"} [Twitter](https://twitter.com/kotlin), ![Reddit](reddit.svg){width=25}{type="joined"} [Reddit](https://www.reddit.com/r/Kotlin/), and ![YouTube](youtube.svg){width=25}{type="joined"} [Youtube](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw), and don't miss any important ecosystem updates.

If you've encountered any difficulties or problems, report an issue to our [issue tracker](https://youtrack.jetbrains.com/issues/KT).

</tab>

<tab title="Android app">

* If you want to start using Kotlin for Android development, read [Google’s recommendation for getting started with Kotlin on Android](https://developer.android.com/kotlin/get-started).

* If you're new to Android and want to learn to create applications with Kotlin, check out [this Udacity course](https://www.udacity.com/course/developing-android-apps-with-kotlin--ud9012).

Follow Kotlin on ![Twitter](twitter.svg){width=25}{type="joined"} [Twitter](https://twitter.com/kotlin), ![Reddit](reddit.svg){width=25}{type="joined"} [Reddit](https://www.reddit.com/r/Kotlin/), and ![YouTube](youtube.svg){width=25}{type="joined"} [Youtube](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw), and don't miss any important ecosystem updates.

</tab>

<tab title="Multiplatform library">

Support for multiplatform programming is one of Kotlin’s key benefits. It reduces time spent writing and maintaining the same code for different platforms while retaining the flexibility and benefits of native programming.

Here you'll learn how to develop and publish a multiplatform library:

1. **Install the [latest version of IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html).**

2. **Create a multiplaform library:**

   * To start from scratch, [create a basic project](mpp-create-lib.md).
   * If you prefer more robust examples, complete the [Create and publish a multiplatform library](multiplatform-library.md) tutorial. It shows how to create a multiplatform library for JVM, JS, and Native platforms, test it and publish to a local Maven repository.
   * Build a full stack web application using [this hands-on](https://play.kotlinlang.org/hands-on/Full%20Stack%20Web%20App%20with%20Kotlin%20Multiplatform/01_Introduction).

3. **Use libraries in your application.** Learn more about [adding dependencies on libraries](mpp-add-dependencies.md).

   |Library|Details|
   |-------|-------|
   | Ktor |  [Docs](https://ktor.io/docs/) and [sample](https://play.kotlinlang.org/hands-on/Full%20Stack%20Web%20App%20with%20Kotlin%20Multiplatform/03_A_Simple_API_Server).| 
   | Serialization |  [Docs](serialization.md) and [sample](https://play.kotlinlang.org/hands-on/Full%20Stack%20Web%20App%20with%20Kotlin%20Multiplatform/01_Introduction).|
   | Coroutines |  [Docs](coroutines-overview.md).|
   | DateTime | [Docs](https://github.com/Kotlin/kotlinx-datetime#readme).|
   
   > You can also find a multiplatform library in the [community-driven list](https://libs.kmp.icerock.dev/).
   >
   {type="tip"}

4. **Learn more about Kotlin Multiplatform programming:**

   * [Introduction to Kotlin Multiplatform](mpp-intro.md).
   * [Kotlin Multiplatform supported platforms](mpp-supported-platforms.md).
   * [Kotlin Multiplatform programming benefits](multiplatform.md).

5. **Join the Kotlin Multiplatform community:**

   * ![Slack](slack.svg){width=25}{type="joined"} Slack: [get an invite](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) and join the [#getting-started](https://kotlinlang.slack.com/archives/C0B8MA7FA) and [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) channels.
   * ![StackOverflow](stackoverflow.svg){width=25}{type="joined"} StackOverflow: Subscribe to the [“kotlin-multiplatform” tag](https://stackoverflow.com/questions/tagged/kotlin-multiplatform).

6. **Follow Kotlin** on ![Twitter](twitter.svg){width=25}{type="joined"} [Twitter](https://twitter.com/kotlin), ![Reddit](reddit.svg){width=25}{type="joined"} [Reddit](https://www.reddit.com/r/Kotlin/), and ![YouTube](youtube.svg){width=25}{type="joined"} [Youtube](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw), and don't miss any important ecosystem updates.

If you've encountered any difficulties or problems, report an issue to our [issue tracker](https://youtrack.jetbrains.com/issues/KT).

</tab>

</tabs>

## Is anything missing?

If anything is missing or seems confusing on this page, please [share your feedback](https://surveys.hotjar.com/d82e82b0-00d9-44a7-b793-0611bf6189df).
