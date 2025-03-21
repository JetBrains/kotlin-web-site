[//]: # (title: Kotlin for server side)

Kotlin is a great fit for developing server-side applications. It allows you to write concise and expressive code while
maintaining full compatibility with existing Java-based technology stacks, all with a smooth learning curve:

* **Expressiveness**: Kotlin's innovative language features, such as its support for [type-safe builders](type-safe-builders.md)
  and [delegated properties](delegated-properties.md), help build powerful and easy-to-use abstractions.
* **Scalability**: Kotlin's support for [coroutines](coroutines-overview.md) helps build server-side applications
  that scale to massive numbers of clients with modest hardware requirements.
* **Interoperability**: Kotlin is fully compatible with all Java-based frameworks, so you can use your
  familiar technology stack while reaping the benefits of a more modern language.
* **Migration**: Kotlin supports gradual migration of large codebases from Java to Kotlin. You can start
  writing new code in Kotlin while keeping older parts of your system in Java.
* **Tooling**: In addition to great IDE support in general, Kotlin offers framework-specific tooling (for example,
  for Spring and Ktor) in the plugin for IntelliJ IDEA Ultimate.
* **Learning Curve**: For a Java developer, getting started with Kotlin is very easy. The automated Java-to-Kotlin converter
  included in the Kotlin plugin helps with your first steps. [Kotlin Koans](koans.md) guide you through key language features
  with a series of interactive exercises. Kotlin-specific frameworks like [Ktor](https://ktor.io/) offer
  a simple, straightforward approach without the hidden complexities of larger frameworks.

## Frameworks for server-side development with Kotlin

Here are some examples of the server-side frameworks for Kotlin:

* [Spring](https://spring.io) makes use of Kotlin's language features to offer [more concise APIs](https://spring.io/blog/2017/01/04/introducing-kotlin-support-in-spring-framework-5-0),
  starting with version 5.0. The [online project generator](https://start.spring.io/#!language=kotlin) allows you to quickly generate a new project in Kotlin.

* [Ktor](https://github.com/kotlin/ktor) is a framework built by JetBrains for creating Web applications in Kotlin, making use of coroutines for high scalability and offering an easy-to-use and idiomatic API.

* [Quarkus](https://quarkus.io/guides/kotlin) provides first class support for using Kotlin. The framework is open source and maintained by Red Hat. Quarkus was built from the ground up for Kubernetes and provides a cohesive full-stack framework by leveraging a growing list of hundreds of best-of-breed libraries.

* [Vert.x](https://vertx.io), a framework for building reactive Web applications on the JVM, offers [dedicated support](https://github.com/vert-x3/vertx-lang-kotlin)
  for Kotlin, including [full documentation](https://vertx.io/docs/vertx-core/kotlin/).

* [kotlinx.html](https://github.com/kotlin/kotlinx.html) is a DSL that can be used to build HTML in Web applications.
  It serves as an alternative to traditional templating systems such as JSP and FreeMarker.

* [Micronaut](https://micronaut.io/) is a modern JVM-based full-stack framework for building modular, easily testable microservices and serverless applications. It comes with a lot of useful built-in features.

* [http4k](https://http4k.org/) is the functional toolkit with a tiny footprint for Kotlin HTTP applications, written in pure Kotlin. The library is based on the "Your Server as a Function" paper from Twitter and represents modeling both HTTP servers and clients as simple Kotlin functions that can be composed together.

* [Javalin](https://javalin.io) is a very lightweight web framework for Kotlin and Java which supports WebSockets, HTTP2, and async requests.

* The available options for persistence include direct JDBC access, JPA, and using NoSQL databases through their Java drivers.
  For JPA, the [kotlin-jpa compiler plugin](no-arg-plugin.md#jpa-support) adapts
  Kotlin-compiled classes to the requirements of the framework.
  
> You can find more frameworks at [https://kotlin.link/](https://kotlin.link/resources).
>
{style="note"}

## Deploying Kotlin server-side applications

Kotlin applications can be deployed into any host that supports Java Web applications, including Amazon Web Services,
Google Cloud Platform, and more.

To deploy Kotlin applications on [Heroku](https://www.heroku.com), you can follow the [official Heroku tutorial](https://devcenter.heroku.com/articles/getting-started-with-kotlin).

AWS Labs provides a [sample project](https://github.com/awslabs/serverless-photo-recognition) showing the use of Kotlin
for writing [AWS Lambda](https://aws.amazon.com/lambda/) functions.

Google Cloud Platform offers a series of tutorials for deploying Kotlin applications to GCP, both for [Ktor and App Engine](https://cloud.google.com/community/tutorials/kotlin-ktor-app-engine-java8) and [Spring and App engine](https://cloud.google.com/community/tutorials/kotlin-springboot-app-engine-java8). In addition,
there is an [interactive code lab](https://codelabs.developers.google.com/codelabs/cloud-spring-cloud-gcp-kotlin) for deploying a Kotlin Spring application.

## Products that use Kotlin on the server side

[Corda](https://www.corda.net/) is an open-source distributed ledger platform that is supported by major
banks and built entirely in Kotlin.

[JetBrains Account](https://account.jetbrains.com/), the system responsible for the entire license sales and validation
process at JetBrains, is written in 100% Kotlin and has been running in production since 2015 with no major issues.

[Chess.com](https://www.chess.com/) is a website dedicated to chess and the millions of players around the world 
who love the game. Chess.com uses Ktor for the seamless configuration of multiple HTTP clients.

Engineers at [Adobe](https://blog.developer.adobe.com/streamlining-server-side-app-development-with-kotlin-be8cf9d8b61a) use Kotlin for server-side app development and Ktor for prototyping in the Adobe Experience 
Platform, which enables organizations to centralize and standardize customer data before applying data science and machine learning.

[OpenSea](https://opensea.io/os2) is the one-stop shop for everything onchain. Tokens and NFTs, all on one platform. OpenSea uses Kotlin to power the entire backend.

## Next steps

* For a more in-depth introduction to the language, check out the Kotlin documentation on this site and [Kotlin Koans](koans.md).
* Explore how to [build asynchronous server applications with Ktor](https://ktor.io/docs/server-create-a-new-project.html), a framework that uses Kotlin coroutines.
* Watch a webinar ["Micronaut for microservices with Kotlin"](https://micronaut.io/2020/12/03/webinar-micronaut-for-microservices-with-kotlin/) and 
  explore a detailed [guide](https://guides.micronaut.io/latest/micronaut-kotlin-extension-fns.html) 
  showing how you can use [Kotlin extension functions](extensions.md#extension-functions) in the Micronaut framework.
* http4k provides the [CLI](https://toolbox.http4k.org) to generate fully formed projects, and a [starter](https://start.http4k.org) repo to generate an entire CD pipeline using GitHub, Travis, and Heroku with a single bash command.
* Want to migrate from Java to Kotlin? Learn how to perform [typical tasks with strings in Java and Kotlin](java-to-kotlin-idioms-strings.md).


