[//]: # (title: Get started with Kotlin \(experimental\))

> This page is experimental.

Kotlin is a modern programming language that makes many developers happier.
It's concise, safe, and interoperable. Pick it up and start building powerful applications immediately.

> If you are at the very beginning and Kotlin is your first programming language, you can start with these [learning materials](learning-materials-overview.md).
>
{type="note"}

## Create your powerful application with Kotlin

<tabs>

<tab title="Backend app">

Kotlin makes server-side development easy and concise, whether you have lots of backend experience or none.

Here we will help you with your first steps in developing Kotlin server-side applications.

1. Install the [latest version of IntelliJ IDEA Ultimate](https://www.jetbrains.com/idea/download/).

2. Create a project using one of the following frameworks:

   * **Spring** – a mature family of frameworks with an established ecosystem that is used by millions of developers worldwide. Spring provides verified tools for everyday usage, from database interaction to security. [Use the tutorial](https://spring.io/guides/tutorials/spring-webflux-kotlin-rsocket/) to get started with Spring.
   * **Ktor** – a lightweight framework for those who value freedom in making architectural decisions. It is 100% Kotlin native and does not force you to use any specific libraries – develop backend apps however you want. [Go through our hands-on tutorial](https://play.kotlinlang.org/hands-on/Creating%20a%20WebSocket%20Chat%20with%20Ktor/01_introduction) to get started.

3. Use Kotlin libraries in your application:
   * The [Kotlin standard library](https://kotlinlang.org/api/latest/jvm/stdlib/) offers a lot of useful things such as [collections](collections-overview.md). Try to solve [these business tasks](https://github.com/kotlin-hands-on/kotlin-collections-taxipark) using collections.
   * To go more in-depth with Kotlin and Ktor, you can make your application asynchronous with [kotlinx.coroutines](coroutines-guide.md).
   * Take a look at the [Exposed](https://github.com/JetBrains/Exposed) library, which is designed to save messages and add a database to your application.

   Learn more about [adding dependencies](gradle.md#configuring-dependencies).

4. Use [third-party libraries](https://blog.jetbrains.com/kotlin/2020/11/server-side-development-with-kotlin-frameworks-and-libraries/) to get more capabilities:
   * [jdbi](https://jdbi.org/#_kotlin), [jooq](https://www.jooq.org/doc/3.0/manual/getting-started/jooq-and-kotlin/), [JPA with Spring Data](https://spring.io/guides/tutorials/spring-boot-kotlin/#_persistence_with_jpa) to access databases from Kotlin code.
   * [Kotest](https://kotest.io/) – a testing library with support for Kotlin multiplatform projects.
   * [graphql-kotlin](https://expediagroup.github.io/graphql-kotlin/docs/getting-started.html) to work with GraphQL.

5. Learn more Kotlin for server-side:
   * [Write your first unit test](jvm-test-using-junit.md)
   * [Mix Kotlin and Java code in your application](mixing-java-kotlin-intellij.md).
   * [Add dependencies using Gradle](gradle.md).
   * Learn how Kotlin is used for server-side development in [DoorDash](https://kotlinlang.org/lp/server-side/case-studies/doordash), [Atlassian](https://www.youtube.com/watch?v=4GkoB4hZUnw), [Amazon](https://talkingkotlin.com/qldb/?_ga=2.194721837.1273405507.1615277998-602697560.1599818467) and [many other companies](https://kotlinlang.org/lp/server-side/case-studies/).

6. Join the Kotlin server-side community:
   * **Slack**: [get an invite](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) and join the [#getting-started](https://kotlinlang.slack.com/archives/C0B8MA7FA), [#server](https://kotlinlang.slack.com/archives/C0B8RC352), [#spring](https://kotlinlang.slack.com/archives/C0B8ZTWE4), or [#ktor](https://kotlinlang.slack.com/archives/C0A974TJ9) channels.
   * **StackOverflow**: subscribe to the [“kotlin”](https://stackoverflow.com/questions/tagged/kotlin), ["spring-kotlin"](https://stackoverflow.com/questions/tagged/spring-kotlin), or ["ktor"](https://stackoverflow.com/questions/tagged/ktor) tags.

7. Follow Kotlin on [Twitter](https://twitter.com/kotlin), [Reddit](https://www.reddit.com/r/Kotlin/), and [Youtube](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw), and don't miss any important ecosystem updates.

If you've encountered any difficulties or problems, report an issue to our [issue tracker](https://youtrack.jetbrains.com/issues/KT).

</tab>

<tab title="Cross-platform mobile app">

Here you'll learn how to develop and improve your cross-platform mobile application using Kotlin Multiplatform Mobile (KMM).

1. [Install Android Studio and set up your environment](https://kotlinlang.org/docs/mobile/setup.html).

2. Create your first KMM application:

   * To start from scratch, [create a basic KMM application with the project wizard](https://kotlinlang.org/docs/mobile/create-first-app.html).
   * If you have an existing Android application and want to make it cross-platform, complete the [Make your Android application work on iOS](https://kotlinlang.org/docs/mobile/integrate-in-existing-app.html) tutorial.
   * If you prefer real-life examples, clone and play with an existing project, for example the networking and data storage project from the [hands-on tutorial](https://play.kotlinlang.org/hands-on/Networking%20and%20Data%20Storage%20with%20Kotlin%20Multiplatfrom%20Mobile/01_Introduction) or any [KMM sample](https://kotlinlang.org/docs/mobile/samples.html).

3. Use a wide set of Kotlin libraries to implement the required business logic only once in the shared module:
   * The powerful [Kotlin standard library](https://kotlinlang.org/api/latest/jvm/stdlib/).
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
   * Learn how KMM is used at [Netflix](https://netflixtechblog.com/netflix-android-and-ios-studio-apps-kotlin-multiplatform-d6d4d8d25d23), [VWWare](https://kotlinlang.org/lp/mobile/case-studies/vmware/), [Yandex](https://kotlinlang.org/lp/mobile/case-studies/yandex/), and [many other companies](https://kotlinlang.org/lp/mobile/case-studies/).
   * Learn more about [Kotlin Multiplatform](mpp-intro.md).

6. Join the Kotlin Multiplatform community:

   * **Slack**: [get an invite](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) and join the [#getting-started](https://kotlinlang.slack.com/archives/C0B8MA7FA) and [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) channels.
   * **StackOverflow**: Subscribe to the [“kotlin-multiplatform” tag](https://stackoverflow.com/questions/tagged/kotlin-multiplatform).

7. Follow Kotlin on [Twitter](https://twitter.com/kotlin), [Reddit](https://www.reddit.com/r/Kotlin/), and [Youtube](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw), and don't miss any important ecosystem updates.

If you've encountered any difficulties or problems, report an issue to our [issue tracker](https://youtrack.jetbrains.com/issues/KT).

</tab>

<tab title="Frontend web app">

Kotlin provides an ability to transpile your Kotlin code, the Kotlin standard library, and any compatible dependencies to JavaScript.

Here you'll learn how to develop and improve your frontend web application using [Kotlin/JS](js-overview.md).

1. Install the [latest version of IntelliJ IDEA](http://www.jetbrains.com/idea/download/index.html).

2. Create your first frontend web application:

   * To start from scratch, [create a basic browser application with the IntelliJ IDEA project wizard](js-project-setup.md).
   * If you prefer more robust examples, complete the [Building Web Applications with React and Kotlin/JS hands-on](https://play.kotlinlang.org/hands-on/Building%20Web%20Applications%20with%20React%20and%20Kotlin%20JS/01_Introduction) tutorial. It includes a sample project that can serve as a good starting point for your own projects, and contains useful snippets and templates.

3. Use Kotlin libraries in your application:

   * The powerful [Kotlin standard library](https://kotlinlang.org/api/latest/jvm/stdlib/).
   * The [kotlinx.browser](browser-api-dom.md) library for accessing browser-specific functionality, including typical top-level objects such as document and window.
   * The [kotlinx.html](typesafe-html-dsl.md) library for generating DOM elements using statically-typed HTML builders.
   * [Ktor](https://ktor.io/) for networking.

   Learn more about [adding dependencies](js-project-setup.md#dependencies).

4. Use third-party libraries to get more capabilities to take full advantage of Kotlin’s concepts, expressive power, and conciseness:

   * [KVision](https://kvision.io/) – an object-oriented web framework for Kotlin/JS.
   * [fritz2](https://www.fritz2.dev/) – an extremely lightweight, high-performance, independent library for building reactive web apps in Kotlin that are heavily dependent on coroutines and flows.
   * [Kotlin wrappers](https://github.com/JetBrains/kotlin-wrappers) – provide convenient abstractions and deep integrations for one of the most popular JavaScript frameworks. Kotlin wrappers also provide support for a select number of adjacent technologies like react-redux, react-router, or styled-components. Interoperability with the JavaScript ecosystem means that you can also use third-party React components and component libraries.

5. Learn more about Kotlin for frontend web development:

   * The [new Kotlin/JS IR compiler](js-ir-compiler.md) (currently with [Alpha](components-stability.md) stability).
   * [Using dependencies from npm](using-packages-from-npm.md).
   * [Using Kotlin code from JavaScript](js-to-kotlin-interop.md).

6. Join the Kotlin frontend web community:

   * **Slack**: [get an invite](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) and join the [#getting-started](https://kotlinlang.slack.com/archives/C0B8MA7FA) and [#javascript](https://kotlinlang.slack.com/archives/C0B8L3U69) channels.
   * **StackOverflow**: subscribe to the [“kotlin-js” tag](https://stackoverflow.com/questions/tagged/kotlin-js).

7. Follow Kotlin on [Twitter](https://twitter.com/kotlin), [Reddit](https://www.reddit.com/r/Kotlin/), and [Youtube](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw), and don't miss any important ecosystem updates.

If you've encountered any difficulties or problems, report an issue to our [issue tracker](https://youtrack.jetbrains.com/issues/KT).

</tab>

</tabs>
