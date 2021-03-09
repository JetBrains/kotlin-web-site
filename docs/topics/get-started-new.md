[//]: # (title: Get started with Kotlin)

Kotlin is a modern programming language that makes developers happier.
It's concise, safe, and interoperable. Pick it up and create powerful applications immediately.

> If you are at the very beginning and Kotlin is your first programming language, we recommend that you start with [learning materials](learning-materials-overview.md).
>
{type="note"}

## Create your powerful application with Kotlin

<tabs>

<tab title="Backend app">

Kotlin makes server-side development easy and concise, no matter if you have no prior backend experience or an experienced server-side developer. 
Here we will help you with your first step in developing Kotlin server applications.

1. Install the [latest version of IntelliJ IDEA Ultimate](https://www.jetbrains.com/idea/download/)

2. Create the project using one of the following frameworks:

   * **Spring** – mature family of frameworks with the established ecosystem that is used by millions of developers worldwide. Spring provides verified tools for everyday usage from database interaction to security. [Use the tutorial](https://spring.io/guides/tutorials/spring-webflux-kotlin-rsocket/) to start with it.
   * **Ktor** – the lightweight framework for those who value freedom in making architectural decisions. 100% Kotlin native framework, which does not force you to use any specific libraries – develop backend apps in your way. [Go through our hands-on tutorial](https://play.kotlinlang.org/hands-on/Creating%20a%20WebSocket%20Chat%20with%20Ktor/01_introduction) to get started.

3. Use Kotlin libraries in your application:
   * Powerful [Kotlin standard library](https://kotlinlang.org/api/latest/jvm/stdlib/), for example, [collections](collections-overview.md).
   * To go more in-depth with Kotlin and Ktor, you can make your application asynchronous with [kotlinx.coroutines](coroutines-guide.md).
   * Take a look at the [Exposed](https://github.com/JetBrains/Exposed) library and use it to save messages and add a database to your application.

4. Use [third-party libraries](https://blog.jetbrains.com/kotlin/2020/11/server-side-development-with-kotlin-frameworks-and-libraries/) to get more capabilities:
   * [jdbi](https://jdbi.org/#_kotlin), [jooq](https://www.jooq.org/doc/3.0/manual/getting-started/jooq-and-kotlin/), [JPA with Spring Data](https://spring.io/guides/tutorials/spring-boot-kotlin/#_persistence_with_jpa) to access databases from Kotlin code.
   * [Kotest](https://kotest.io/) – a testing library with support for Kotlin multiplatform projects.
   * [graphql-kotlin](https://expediagroup.github.io/graphql-kotlin/docs/getting-started.html) to work with GraphQL.

5. Learn more Kotlin for server-side:
   * Write your first unit test TODO: add a link after merge PR.
   * [Mix Kotlin and Java code in your application](mixing-java-kotlin-intellij.md).
   * [Add dependencies using Gradle](gradle.md).
   * Learn how Kotlin is used for server-side development in [DoorDash](https://kotlinlang.org/lp/server-side/case-studies/doordash), [Atlassian](https://www.youtube.com/watch?v=4GkoB4hZUnw), [Amazon](https://talkingkotlin.com/qldb/?_ga=2.194721837.1273405507.1615277998-602697560.1599818467) and [many other](https://kotlinlang.org/lp/server-side/case-studies/).

6. Join the Kotlin server-side community:
   * **Slack**: [get an invite](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) and join [#getting-started](https://kotlinlang.slack.com/archives/C0B8MA7FA), [#server](https://kotlinlang.slack.com/archives/C0B8RC352), [#spring](https://kotlinlang.slack.com/archives/C0B8ZTWE4), or [#ktor](https://kotlinlang.slack.com/archives/C0A974TJ9) channels.
   * **StackOverflow**: Subscribe to the [“kotlin”](https://stackoverflow.com/questions/tagged/kotlin), ["spring-kotlin"](https://stackoverflow.com/questions/tagged/spring-kotlin), or ["ktor"](https://stackoverflow.com/questions/tagged/ktor) tags.

7. Follow Kotlin on [Twitter](https://twitter.com/kotlin), [Reddit](https://www.reddit.com/r/Kotlin/), [Youtube](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw) and don't miss the important ecosystem updates.

If you've encountered any difficulties or problems, report an issue to our [issue tracker](https://youtrack.jetbrains.com/issues/KT).

</tab>

<tab title="Cross-platform mobile app">

Here you'll learn how to develop and improve your cross-platform mobile application using Kotlin Multiplatform Mobile (KMM).

1. [Install Android Studio and set up your environment](https://kotlinlang.org/docs/mobile/setup.html).

2. Create your first KMM application:

    * To start from scratch, [create a basic KMM application with the project wizard](https://kotlinlang.org/docs/mobile/create-first-app.html).
    * If you have an existing Android application and want to make it cross-platform, complete the tutorial [Make your Android application work on iOS](https://kotlinlang.org/docs/mobile/integrate-in-existing-app.html).
    * If you prefer real-life examples, clone and play with an existing project –  the networking and data storage project from the [hands-on tutorial](https://play.kotlinlang.org/hands-on/Networking%20and%20Data%20Storage%20with%20Kotlin%20Multiplatfrom%20Mobile/01_Introduction) or any [KMM sample](https://kotlinlang.org/docs/mobile/samples.html). 
   
3. Use a wide set of Kotlin libraries to implement the required business logic only once in the shared module:
    * Powerful [Kotlin standard library](https://kotlinlang.org/api/latest/jvm/stdlib/).
    * Ktor for networking ([docs](https://ktor.io/) and [sample](https://kotlinlang.org/docs/mobile/use-ktor-for-networking.html)).
    * Serialization ([docs](serialization.md) and [sample](https://play.kotlinlang.org/hands-on/Networking%20and%20Data%20Storage%20with%20Kotlin%20Multiplatfrom%20Mobile/04_Creating_a_data_model)).
    * Coroutines for concurrency ([docs](https://kotlinlang.org/docs/mobile/concurrency-overview.html) and [sample](https://kotlinlang.org/docs/mobile/concurrency-and-coroutines.html)).
    * DateTime ([docs](https://github.com/Kotlin/kotlinx-datetime#readme)).
   
   Learn more about [adding dependencies](https://kotlinlang.org/docs/mobile/add-dependencies.html).

4. Use third-party libraries to get more capabilities:
    * [SQLDelight](https://cashapp.github.io/sqldelight/) for data storage ([sample](https://kotlinlang.org/docs/mobile/configure-sqldelight-for-data-storage.html)).
    * [Community-driven list of Kotlin Multiplatform libraries](https://libs.kmp.icerock.dev/).
   
5. Learn more Kotlin for KMM:
   * Look through [KMM samples on GitHub](https://kotlinlang.org/docs/mobile/samples.html).
   * [Create and publish a multiplatform library](mpp-create-lib.md).
   * Learn how KMM is used in [Netflix](https://netflixtechblog.com/netflix-android-and-ios-studio-apps-kotlin-multiplatform-d6d4d8d25d23), [VWWare](https://kotlinlang.org/lp/mobile/case-studies/vmware/), [Yandex](https://kotlinlang.org/lp/mobile/case-studies/yandex/) and [many other](https://kotlinlang.org/lp/mobile/case-studies/).
   * Learn more about [Kotlin Multiplatform](mpp-intro.md).

6. Join the Kotlin Multiplatform community:

    * **Slack**: [get an invite](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) and join [#getting-started](https://kotlinlang.slack.com/archives/C0B8MA7FA) and [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) channels.
    * **StackOverflow**: Subscribe to the [“kotlin-multiplatform” tag](https://stackoverflow.com/questions/tagged/kotlin-multiplatform).

7. Follow Kotlin on [Twitter](https://twitter.com/kotlin), [Reddit](https://www.reddit.com/r/Kotlin/), [Youtube](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw) and don't miss the important ecosystem updates.

If you've encountered any difficulties or problems, report an issue to our [issue tracker](https://youtrack.jetbrains.com/issues/KT).
   
</tab>

<tab title="Web frontend app">

Kotlin provides an ability to transpile your Kotlin code, the Kotlin standard library, and any compatible dependencies to JavaScript.

1. Install the [latest version of IntelliJ IDEA](http://www.jetbrains.com/idea/download/index.html).

2. Create your first web frontend application:

   * To start from scratch, [create a basic browser application with the IntelliJ IDEA project wizard](js-project-setup.md).
   * If you prefer more robust examples, complete the tutorial [Building Web Applications with React and Kotlin/JS hands-on](https://play.kotlinlang.org/hands-on/Building%20Web%20Applications%20with%20React%20and%20Kotlin%20JS/01_Introduction). It includes a sample project that can serve as a good starting point for your own projects, and contains useful snippets and templates.
   
3. Use Kotlin libraries in your application:

   * Powerful [Kotlin standard library](https://kotlinlang.org/api/latest/jvm/stdlib/).
   * The [kotlinx.browser](browser-api-dom.md) library for accessing browser-specific functionality, including typical top-level objects such as document and window.
   * The [kotlinx.html](typesafe-html-dsl.md) library for generating DOM elements using statically-typed HTML builders.
   * [Kotlin wrappers](https://github.com/JetBrains/kotlin-wrappers) for popular JavaScript libraries, such as [React](https://reactjs.org/), [Mocha](https://mochajs.org/), and [styled-components](https://www.styled-components.com/).
   * [Ktor](https://ktor.io/) for networking.
   
   Learn more about [adding dependencies](https://kotlinlang.org/docs/mpp-add-dependencies.html).

4. Use third-party libraries to get more capabilities to take full advantage of Kotlin concepts, its expressive power, and conciseness:
   
   * [KVision](https://kvision.io/)
   * [fritz2](https://www.fritz2.dev/)
   
5. Learn more Kotlin for web frontend development:
   
   * The [new Kotlin/JS IR compiler](js-ir-compiler.md) (currently with [Alpha](components-stability.md) stability)
   * [Using dependencies from npm](using-packages-from-npm.md).
   * [Using Kotlin code from JavaScript](/js-to-kotlin-interop.md).

6. Join the Kotlin web frontend community:

   * **Slack**: [get an invite](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) and join [#getting-started](https://kotlinlang.slack.com/archives/C0B8MA7FA) and [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) channels.
   * **StackOverflow**: Subscribe to the [“kotlin-js” tag](https://stackoverflow.com/questions/tagged/kotlin-js).

7. Follow Kotlin on [Twitter](https://twitter.com/kotlin), [Reddit](https://www.reddit.com/r/Kotlin/), [Youtube](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw) and don't miss the important ecosystem updates.

If you've encountered any difficulties or problems, report an issue to our [issue tracker](https://youtrack.jetbrains.com/issues/KT).

</tab>

</tabs>

