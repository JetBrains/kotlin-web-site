[//]: # (title: Backend development with Kotlin)

<web-summary>Build server applications with Kotlin using Spring, Ktor, and other backend frameworks</web-summary>

Kotlin is a great fit for developing server-side applications. With Kotlin, you can write concise and expressive code while
maintaining full compatibility with existing Java-based technology stacks.

## Get started

Kotlin supports gradual migration of large codebases from Java to Kotlin. You can start
writing tests or new production code in Kotlin while keeping other parts of your project in Java.

Configure your Java project to work with Kotlin and make use of the automated Java-to-Kotlin converter
included in IntelliJ IDEA:

<a href="mixing-java-kotlin-intellij.md"><img src="backend-get-started-button.svg" alt="Introduce Kotlin to your Java project" style="block"/></a>

## Explore frameworks

Kotlin is fully compatible with all Java-based frameworks, so you can use your familiar technology stack while
benefiting from Kotlin syntax. In addition to great IDE support, Kotlin offers framework-specific tooling,
such as support for Spring and Ktor in IntelliJ IDEA Ultimate.

### Spring

[Spring](https://spring.io) makes use of Kotlin's language features to offer more concise APIs.
The [online project generator](https://start.spring.io/#!language=kotlin) allows you to quickly generate a new project in Kotlin.

<a href="jvm-get-started-spring-boot.md"><img src="spring-get-started-button.svg" alt="Get started with Spring Boot and Kotlin" style="block"/></a>

### Ktor

[Ktor](https://github.com/kotlin/ktor) is a JetBrains framework for creating web applications in Kotlin.
It uses coroutines for high scalability and offers an easy-to-use idiomatic API.

<a href="https://ktor.io/docs/server-create-a-new-project.html"><img src="ktor-get-started-button.svg" alt="Create a new Ktor project" style="block"/></a>

### Other frameworks

Here are some other examples of the backend frameworks for Kotlin:

| Framework                                              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
|--------------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [Quarkus](https://quarkus.io/guides/kotlin)            | An open-sourced framework that provides first-class support for Kotlin. Quarkus was built from the ground up for Kubernetes and provides a cohesive full-stack framework by leveraging a growing list of hundreds of best-of-breed libraries.                                                                                                                                                                                                                                                   |
| [Vert.x](https://vertx.io)                             | A framework for building reactive web applications on the JVM. Vert.x offers [dedicated support](https://github.com/vert-x3/vertx-lang-kotlin) for Kotlin, including [integration of Kotlin coroutines](https://vertx.io/docs/vertx-lang-kotlin-coroutines/kotlin/).                                                                                                                                                                                                                            |
| [kotlinx.html](https://github.com/kotlin/kotlinx.html) | A DSL that can be used to build HTML in web applications. It serves as an alternative to traditional templating systems such as JSP and FreeMarker.                                                                                                                                                                                                                                                                                                                                             |
| [Micronaut](https://micronaut.io/)                     | A modern JVM-based full-stack framework for building modular, easily testable microservices and serverless applications. Watch a webinar [Micronaut for microservices with Kotlin](https://micronaut.io/2020/12/03/webinar-micronaut-for-microservices-with-kotlin/) and explore a detailed [guide](https://guides.micronaut.io/latest/micronaut-kotlin-extension-fns.html) showing how you can use [Kotlin extension functions](extensions.md#extension-functions) in the Micronaut framework. |
| [http4k](https://http4k.org/)                          | A functional toolkit with a small footprint for Kotlin HTTP applications, written in pure Kotlin. http4k provides the [CLI-enabled toolbox](https://toolbox.http4k.org) to generate fully formed project templates, and a web-based [project wizard](https://toolbox.http4k.org/project) to bootstrap a working http4k application with selected backend, modules, and build tooling.                                                                                                           |
| [Javalin](https://javalin.io)                          | A very lightweight web framework for Kotlin and Java which supports WebSockets, HTTP2, and async requests.                                                                                                                                                                                                                                                                                                                                                                                      |

## Deploy your applications

Kotlin applications can be deployed to any host that supports Java web applications, including Amazon Web Services (AWS),
Google Cloud Platform (GCP), and many others.

* **AWS** provides a dedicated [SDK for Kotlin](https://docs.aws.amazon.com/sdk-for-kotlin/latest/developer-guide/home.html)
  to interact with its services. For serverless deployments, you can refer to [AWS Lambda code examples for Kotlin](https://docs.aws.amazon.com/sdk-for-kotlin/latest/developer-guide/kotlin_lambda_code_examples.html).
* **Ktor** allows you to publish Kotlin applications to various cloud providers. For instance, you can follow Ktor tutorials
  to learn more about deploying to [Google App Engine](https://ktor.io/docs/google-app-engine.html) and other services.
* **Spring** applications are also compatible with most popular cloud providers. See how to deploy Spring Boot applications
  to the cloud in the [official Spring documentation](https://docs.spring.io/spring-boot/how-to/deployment/cloud.html).

## Next steps

* [Learn how to test your Java Maven project with Kotlin and JUnit](jvm-test-using-junit.md)
* [Explore how to build asynchronous server applications with Ktor](https://ktor.io/docs/server-create-a-new-project.html)
