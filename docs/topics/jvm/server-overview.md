[//]: # (title: Backend development with Kotlin)

Kotlin is a great fit for developing server-side applications. It allows you to write concise and expressive code while
maintaining full compatibility with existing Java-based technology stacks.

## Get started

Kotlin supports gradual migration of large codebases from Java to Kotlin. You can start
writing tests or new production code in Kotlin while keeping other parts of your project in Java.

Configure your Java project to work with Kotlin and make use of the automated Java-to-Kotlin converter
included in IntelliJ IDEA:

<a href="mixing-java-kotlin-intellij.md"><img src="backend-get-started-button.svg" width="350" alt="Introduce Kotlin to your Java project" style="block"/></a>

## Explore frameworks

Kotlin is fully compatible with all Java-based frameworks, so you can use your familiar technology stack while
benefiting from Kotlin syntax. In addition to great IDE support in general, Kotlin offers framework-specific tooling,
for example, for Spring and Ktor plugins, in IntelliJ IDEA Ultimate.

### Spring

[Spring](https://spring.io) makes use of Kotlin's language features to offer more concise APIs.
The [online project generator](https://start.spring.io/#!language=kotlin) allows you to quickly generate a new project in Kotlin.

<a href="jvm-get-started-spring-boot.md"><img src="spring-get-started-button.svg" width="350" alt="Get started with Spring Boot and Kotlin" style="block"/></a>

### Ktor

[Ktor](https://github.com/kotlin/ktor) is a framework built by JetBrains for creating web applications in Kotlin, making use of coroutines for
high scalability and offering an easy-to-use and idiomatic API.

<a href="https://ktor.io/docs/server-create-a-new-project.html"><img src="ktor-get-started-button.svg" width="350" alt="Create a new Ktor project" style="block"/></a>

Here are some other examples of the backend frameworks for Kotlin:

| Framework                                              | Description                                                                                                                                                                                                                                                                                   |
|--------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [Quarkus](https://quarkus.io/guides/kotlin)            | Provides first-class support for using Kotlin. The framework is open source and maintained by Red Hat. Quarkus was built from the ground up for Kubernetes and provides a cohesive full-stack framework by leveraging a growing list of hundreds of best-of-breed libraries.                  |
| [Vert.x](https://vertx.io)                             | A framework for building reactive Web applications on the JVM, offers [dedicated support](https://github.com/vert-x3/vertx-lang-kotlin) for Kotlin, including [integration of Kotlin coroutines](https://vertx.io/docs/vertx-lang-kotlin-coroutines/kotlin/).                                 |
| [kotlinx.html](https://github.com/kotlin/kotlinx.html) | A DSL that can be used to build HTML in Web applications. It serves as an alternative to traditional templating systems such as JSP and FreeMarker.                                                                                                                                           |
| [Micronaut](https://micronaut.io/)                     | A modern JVM-based full-stack framework for building modular, easily testable microservices and serverless applications. It comes with a lot of useful built-in features.                                                                                                                     |
| [http4k](https://http4k.org/)                          | The functional toolkit with a tiny footprint for Kotlin HTTP applications, written in pure Kotlin. The library is based on the "Your Server as a Function" paper from Twitter and represents modeling both HTTP servers and clients as simple Kotlin functions that can be composed together. |
| [Javalin](https://javalin.io)                          | A very lightweight web framework for Kotlin and Java which supports WebSockets, HTTP2, and async requests.                                                                                                                                                                                    |

## Add plugins

Kotlin offers several compiler plugins that simplify server-side development by adapting the language to the requirements
of various frameworks and improving the testing experience:

* **[`all-open`](all-open-plugin.md)** automatically makes classes and their members `open` when used with specific
  annotations. This is particularly useful for frameworks like Spring that require classes to be non-final.
  
  For Spring, you can use a special [`kotlin-spring`](all-open-plugin.md#spring-support) plugin,
  which is a wrapper on top of `all-open`. It helps to specify Spring annotations automatically.
* **[`no-arg`](no-arg-plugin.md)** generates an additional zero-argument constructor for classes with specific annotations.
  This allows Java Persistence API (JPA) to instantiate classes that otherwise wouldn't have a default constructor.

  You can also use a special [`kotlin-jpa`](no-arg-plugin.md#jpa-support) plugin, which is a wrapper on top of `no-arg`.
  It helps to specify no-arg annotations automatically.
* **[`power-assert`](power-assert.md)** improves the debugging experience by providing detailed failure messages with
  contextual information for assertions, showing intermediate values, and helping you understand why a test failed.

## Deploy your applications

Kotlin applications can be deployed into any host that supports Java Web applications, including Amazon Web Services,
Google Cloud Platform, and more.

AWS provides an [SDK for Kotlin](https://docs.aws.amazon.com/sdk-for-kotlin/latest/developer-guide/home.html)
for interacting with AWS services. For serverless deployments, see [AWS Lambda code examples for Kotlin](https://docs.aws.amazon.com/sdk-for-kotlin/latest/developer-guide/kotlin_lambda_code_examples.html).

With Ktor, you can publish Kotlin applications to different cloud providers. Follow Ktor tutorials to learn more about
deploying to [Google App Engine](https://ktor.io/docs/google-app-engine.html) and other services.

Spring applications are also compatible with most popular cloud providers. See how to [deploy Spring Boot applications to the cloud](https://docs.spring.io/spring-boot/how-to/deployment/cloud.html).

## Next steps

* Learn how to [test your Java Maven project with Kotlin and JUnit](jvm-test-using-junit.md).
* Explore how to [build asynchronous server applications with Ktor](https://ktor.io/docs/server-create-a-new-project.html).
* Watch a webinar [Micronaut for microservices with Kotlin](https://micronaut.io/2020/12/03/webinar-micronaut-for-microservices-with-kotlin/)
  and explore a detailed [guide](https://guides.micronaut.io/latest/micronaut-kotlin-extension-fns.html) 
  showing how you can use [Kotlin extension functions](extensions.md#extension-functions) in the Micronaut framework.
* http4k provides the [CLI-enabled toolbox](https://toolbox.http4k.org) to generate fully formed project templates,
  and a web-based [project wizard](https://toolbox.http4k.org/project) to bootstrap a working http4k application with 
  selected backend, modules, and build tooling.
