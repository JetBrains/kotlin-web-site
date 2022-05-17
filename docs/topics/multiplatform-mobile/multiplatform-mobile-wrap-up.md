[//]: # (title: Wrap up your project)

<microformat>
    <p>This is a part of the <strong>Getting started with Kotlin Multiplatform Mobile</strong> tutorial. Before proceeding, make sure you've completed previous steps:</p>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="multiplatform-mobile-setup.md">Set up environment</a><br/><img src="icon-2-done.svg" width="20" alt="Second step"/> <a href="multiplatform-mobile-create-first-app.md">Create your first cross-platform app</a><br/><img src="icon-3-done.svg" width="20" alt="Third step"/> <a href="multiplatform-mobile-dependencies.md">Add dependencies</a><br/><img src="icon-4-done.svg" width="20" alt="Fourth step"/> <a href="multiplatform-mobile-update-app.md">Upgrade your app</a><br/><img src="icon-5.svg" width="20" alt="Fifth step"/> <strong>Wrap up your project</strong></p>
</microformat>

You've created your first Multiplatform Mobile app that works both on iOS and Android. Now you know how
to set up the environment for cross-platform mobile development, create a project in Android Studio, run your app on devices,
and expand its functionality.

Once you've gained some experience with Kotlin Multiplatform Mobile, you can take a look at some advanced topics and solve
particular cross-platform mobile development tasks:

## Dive deep into Kotlin Multiplatform Mobile

* [Make your Android app cross-platform](multiplatform-mobile-integrate-in-existing-app.md)
* [Publish your mobile application to app stores](multiplatform-mobile-publish-apps.md)
* [Learn the theory behind the mobile project structure](multiplatform-mobile-understand-project-structure.md)
* [Check out the list of sample projects](multiplatform-mobile-samples.md)
* [Introduce cross-platform mobile development to your team](multiplatform-mobile-introduce-your-team.md)

## Hands-on labs

Hands-on labs are long-form tutorials that help you get to know a technology by guiding you through
a self-contained project related to a specific topic.

* [Kotlin Multiplatform Hands-on: Networking and Data Storage](https://play.kotlinlang.org/hands-on/Networking%20and%20Data%20Storage%20with%20Kotlin%20Multiplatfrom%20Mobile/)
  guides you through the process of building a simple application for Android and iOS. Business logic and data
  access layers are implemented once in the shared module, while the UI of both applications are native. The
  application uses Ktor as an HTTP client for retrieving data, the `kotlinx.serialization` library to deserialize JSON
  responses into objects of entity classes, `kotlinx.coroutines` to write asynchronous code, and SQLDelight to generate
  the Kotlin code from SQL queries to create a type-safe database API.

* [Building a Full Stack Web App with Kotlin Multiplatform](https://play.kotlinlang.org/hands-on/Full%20Stack%20Web%20App%20with%20Kotlin%20Multiplatform/)
  teaches the concepts behind building an application that targets Kotlin/JVM and Kotlin/JS by building a client-server
  application that makes use of shared code, serialization, and other multiplatform paradigms. It also provides a brief
  introduction to working with Ktor both as a server- and client-side framework.

## Get help

* **Kotlin Slack**. Get an [invite](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) and join the [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) channel
* **Kotlin issue tracker**. [Report a new issue](https://youtrack.jetbrains.com/newIssue?project=KT)