[//]: # (title: Get started with Kotlin)

> If you are at the very beginning and Kotlin is your first programming language, we recommend you to start with [learning materials](learning-materials-overview.md).
>
{type="note"}

## Meet your goal with the Kotlin ecosystem

Select a tab with the relevant scenario.


<tabs>

<tab title="Backend application">

1. Install the [latest IntelliJ IDEA Ultimate](https://www.jetbrains.com/idea/download/)

2. Create the project using one of the following frameworks:

   * **Spring** – mature family of frameworks with established ecosystem, used by millions of developers worldwide. Spring provides verified tools for everyday usage from DB interaction to security. Use the [tutorial](https://spring.io/guides/tutorials/spring-webflux-kotlin-rsocket/) to start with it.
   * **Ktor**. Go through our [hands-on](https://play.kotlinlang.org/hands-on/Creating%20a%20WebSocket%20Chat%20with%20Ktor/01_introduction) to get started.

3. Leverage the power of the [Kotlin standard library](https://kotlinlang.org/api/latest/jvm/stdlib/), for example, [collections](https://kotlinlang.org/docs/collections-overview.html).

4. Use other Kotlin libraries in your application:
   * To go more in-depth with Kotlin and Ktor, you can make your application asynchronous with [kotlinx.coroutines](https://kotlinlang.org/docs/coroutines-guide.html).
   * Take a look at the [Exposed](https://github.com/JetBrains/Exposed) library and use it to save messages and add a database to your application.

5. Use [third-party libraries](https://blog.jetbrains.com/kotlin/2020/11/server-side-development-with-kotlin-frameworks-and-libraries/) to get more capabilities.
   
6. Learn more Kotlin for server-side:
   * [Write your first unit test](jvm-test-using-junit.html). TODO: wait for merge of the PR
   * [Mix Kotlin and Java code in your application](mixing-java-kotlin-intellij.md).
   * [Add dependencies using Gradle](gradle.md).

7. Join the Kotlin Multiplatform community:
   * **Slack**: get an [invite](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) and join [#getting-started](https://kotlinlang.slack.com/archives/C0B8MA7FA), [#server](https://kotlinlang.slack.com/archives/C0B8RC352), [#spring](https://kotlinlang.slack.com/archives/C0B8ZTWE4), or [#ktor](https://kotlinlang.slack.com/archives/C0A974TJ9) channels.
   * **StackOverflow**: Subscribe to the [“kotlin”](https://stackoverflow.com/questions/tagged/kotlin), ["spring-kotlin"](https://stackoverflow.com/questions/tagged/spring-kotlin), or ["ktor"](https://stackoverflow.com/questions/tagged/ktor) tags.
   * **YouTrack**: Report an issue to our [issue tracker](https://youtrack.jetbrains.com/issues/KT).

8. Follow Kotlin on:
   * [Twitter](https://twitter.com/kotlin)
   * [Reddit](https://www.reddit.com/r/Kotlin/)
   * [Youtube](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw)

</tab>

<tab title="Cross-platform mobile app">

Here you'll learn how to develop and improve your cross-platform mobile application using Kotlin Multiplatform Mobile (KMM).

1. [Install Android Studio and set up your environment](https://kotlinlang.org/docs/mobile/setup.html).
2. Create your first KMM application:

    * To start from scratch, [create a basic KMM application with the project wizard](https://kotlinlang.org/docs/mobile/create-first-app.html).
    * If you have an existing Android application and want to make it cross-platform, complete the tutorial [Make your Android application work on iOS](https://kotlinlang.org/docs/mobile/integrate-in-existing-app.html).
    * If you prefer real-life examples, clone and play with an existing project –  the networking and data storage project from the [hands-on tutorial](https://play.kotlinlang.org/hands-on/Networking%20and%20Data%20Storage%20with%20Kotlin%20Multiplatfrom%20Mobile/01_Introduction) or any [KMM sample](https://kotlinlang.org/docs/mobile/samples.html). 
   
3. Use the variety of Kotlin libraries to implement the needed business logic all in the shared module:
    * Powerful [Kotlin standard library](https://kotlinlang.org/api/latest/jvm/stdlib/).
    * Ktor for networking ([docs](https://ktor.io/) and [sample](https://kotlinlang.org/docs/mobile/use-ktor-for-networking.html)).
    * Serialization ([docs](https://kotlinlang.org/docs/serialization.html) and [sample](https://play.kotlinlang.org/hands-on/Networking%20and%20Data%20Storage%20with%20Kotlin%20Multiplatfrom%20Mobile/04_Creating_a_data_model)).
    * Coroutines for concurrency ([docs](https://kotlinlang.org/docs/mobile/concurrency-overview.html) and [sample](https://kotlinlang.org/docs/mobile/concurrency-and-coroutines.html)).
    * DateTime ([docs](https://github.com/Kotlin/kotlinx-datetime#readme))  
   
   Learn more about [adding dependencies](https://kotlinlang.org/docs/mobile/add-dependencies.html).

5. Use third-party libraries to get more capabilities:
    * [SQLDelight](https://cashapp.github.io/sqldelight/) for data storage ([sample](https://kotlinlang.org/docs/mobile/configure-sqldelight-for-data-storage.html))
    * [The community-driven list of Kotlin Multiplatform libraries](https://libs.kmp.icerock.dev/)
   
6. Learn more Kotlin for KMM:
   * Look through [KMM samples on GitHub](https://kotlinlang.org/docs/mobile/samples.html)
   * [Create and publish a multiplatform library]()
   * Learn how KMM is used in [Netflix](https://netflixtechblog.com/netflix-android-and-ios-studio-apps-kotlin-multiplatform-d6d4d8d25d23), [VWWare](https://kotlinlang.org/lp/mobile/case-studies/vmware/), [Yandex](https://kotlinlang.org/lp/mobile/case-studies/yandex/) and [many other](https://kotlinlang.org/lp/mobile/case-studies/)
   * Learn more about [Kotlin Multiplatform](https://kotlinlang.org/docs/mpp-intro.html)

7. Join the Kotlin Multiplatform community:

    * **Slack**: get an [invite](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) and join [#getting-started](https://kotlinlang.slack.com/archives/C0B8MA7FA) and [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) channels.
    * **StackOverflow**: Subscribe to the [“kotlin-multiplatform” tag](https://stackoverflow.com/questions/tagged/kotlin-multiplatform). 
    * **YouTrack**: Report an issue to our [issue tracker](https://youtrack.jetbrains.com/issues/KT).

8. Follow Kotlin on: 
    * [Twitter](https://twitter.com/kotlin)
    * [Reddit](https://www.reddit.com/r/Kotlin/)
    * [Youtube](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw)

</tab>

</tabs>

