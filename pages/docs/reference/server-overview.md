---
type: doc
layout: reference
category: "Introduction"
title: "Kotlin for Server Side"
---

# Using Kotlin for Server-side Development

Kotlin is a great fit for developing server-side applications, allowing you to write concise and expressive code while
maintaining full compatibility with existing Java-based technology stacks and a smooth learning curve:

 * **Expressiveness**: Kotlin's innovative language features, such as its support for [type-safe builders](/docs/reference/type-safe-builders.html)
   and [delegated properties](/docs/reference/delegated-properties.html), help build powerful and easy-to-use abstractions.
 * **Scalability**: Kotlin's support for [coroutines](/docs/reference/coroutines.html) helps build server-side applications
   that scale to massive numbers of clients with modest hardware requirements.
 * **Interoperability**: Kotlin is fully compatible with all Java-based frameworks, which lets you stay on your
   familiar technology stack while reaping the benefits of a more modern language.
 * **Migration**: Kotlin supports gradual, step by step migration of large codebases from Java to Kotlin. You can start
   writing new code in Kotlin while keeping older parts of your system in Java.
 * **Tooling**: In addition to great IDE support in general, Kotlin offers framework-specific tooling (for example,
   for Spring) in the plugin for IntelliJ IDEA Ultimate.
 * **Learning Curve**: For a Java developer, getting started with Kotlin is very easy. The automated Java to Kotlin converter included in the Kotlin plugin helps with the first steps. [Kotlin Koans](/docs/tutorials/koans.html) offer a guide through the key features of the language with a series of interactive exercises.

## Frameworks for Server-side Development with Kotlin

 * [Spring](https://spring.io) makes use of Kotlin's language features to offer [more concise APIs](https://spring.io/blog/2017/01/04/introducing-kotlin-support-in-spring-framework-5-0),
starting with version 5.0. The [online project generator](https://start.spring.io/#!language=kotlin) allows you to quickly generate a new project in Kotlin.

 * [Vert.x](http://vertx.io), a framework for building reactive Web applications on the JVM, offers [dedicated support](https://github.com/vert-x3/vertx-lang-kotlin)
for Kotlin, including [full documentation](http://vertx.io/docs/vertx-core/kotlin/).

 * [Ktor](https://github.com/kotlin/ktor) is a framework built by JetBrains for creating Web applications in Kotlin, making use of coroutines for high scalability and offering an easy-to-use and idiomatic API.

 * [kotlinx.html](https://github.com/kotlin/kotlinx.html) is a DSL that can be used to build HTML in a Web application.
It serves as an alternative to traditional templating systems such as JSP and FreeMarker.

 * [Micronaut](https://micronaut.io/) is a modern, JVM-based, full-stack framework for building modular, easily testable microservice and serverless applications. It comes with a lot of built-in, handy features.
 
 * [Javalin](https://javalin.io) is a very lightweight web framework for Kotlin and Java which supports WebSockets, HTTP2 and async requests.

 * The available options for persistence include direct JDBC access, JPA, as well as using NoSQL databases through their Java drivers.
For JPA, the [kotlin-jpa compiler plugin](/docs/reference/compiler-plugins.html#jpa-support) adapts
Kotlin-compiled classes to the requirements of the framework.

## Deploying Kotlin Server-side Applications

Kotlin applications can be deployed into any host that supports Java Web applications, including Amazon Web Services,
Google Cloud Platform and more.

To deploy Kotlin applications on [Heroku](https://www.heroku.com), you can follow the [official Heroku tutorial](https://devcenter.heroku.com/articles/getting-started-with-kotlin).

AWS Labs provides a [sample project](https://github.com/awslabs/serverless-photo-recognition) showing the use of Kotlin
for writing [AWS Lambda](https://aws.amazon.com/lambda/) functions.

Google Cloud Platform offers a series of tutorials for deploying Kotlin applications to GCP, both for [Ktor and App Engine](https://cloud.google.com/community/tutorials/kotlin-ktor-app-engine-java8) and [Spring and App engine](https://cloud.google.com/community/tutorials/kotlin-springboot-app-engine-java8). In addition
there is an [interactive code lab](https://codelabs.developers.google.com/codelabs/cloud-spring-cloud-gcp-kotlin) for deploying a Kotlin Spring application. 

## Users of Kotlin on the Server Side

[Corda](https://www.corda.net/) is an open-source distributed ledger platform, supported by major
banks, and built entirely in Kotlin.

[JetBrains Account](https://account.jetbrains.com/), the system responsible for the entire license sales and validation
process at JetBrains, is written in 100% Kotlin and has been running in production since 2015 with no major issues.


## Next Steps

* The [Creating Web Applications with Http Servlets](/docs/tutorials/httpservlets.html) and
[Creating a RESTful Web Service with Spring Boot](/docs/tutorials/spring-boot-restful.html) tutorials
show you how you can build and run very small Web applications in Kotlin.
* For a more in-depth introduction to the language, check out the [reference documentation](/docs/reference/index.html) on this site and
[Kotlin Koans](/docs/tutorials/koans.html).
* Micronaut also has a lot of well-detailed [guides](https://guides.micronaut.io/tags/kotlin.html), showing how you can build microservices in Kotlin.
