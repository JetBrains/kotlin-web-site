---
id: "case-study-expedia"
slug: "expedia"
title: "Expedia"
country: "USA"
size: "20 000+"
industry: "Online travel shopping"
---

<a href="https://en.wikipedia.org/wiki/Expedia_Group" class="wt-link" target="_blank" rel="noreferrer noopener">Expedia Group ↗</a> is the world’s travel platform. We help knock down the barriers to travel, making it easier, more enjoyable, more attainable and more accessible. We are here to bring the world within reach for customers and partners around the globe. We leverage our platform and technology capabilities across an extensive portfolio of businesses and brands to orchestrate the movement of people and the delivery of travel experiences on both a local and global basis.

## The technology stack at Expedia Group

The JVM is the primary technology stack used by the backend services at Expedia Group. The individual teams can choose their technology stack outside of the JVM, but since most libraries are Java-based, most of the backend stack is JVM-based as well. With the microservice architecture, there are currently hundreds of [Spring Boot](https://spring.io/projects/spring-boot) apps powering various parts of the customer experience.

Some teams within Expedia began experimenting with Kotlin on the server side in late 2017. Thanks to the 
expressiveness of the language, Kotlin quickly gained popularity among developers, and many greenfield projects started adopting it. Soon after, Kotlin became part of the core technology stack. It has also now become the language of choice for developing the new GraphQL services. Kotlin adoption is growing steadily at Expedia, and it is used to power a number of services including [GraphQL](https://graphql.org/), REST, and [gRPC](https://grpc.io)-based APIs.

## Why Kotlin?

Expedia adopted Kotlin because of its [null-safety](https://kotlinlang.org/docs/reference/null-safety.html) compiler guarantees, the conciseness of the language, and its full Java interoperability. Interoperability with Java made a gradual Kotlin integration possible without having to fully rewrite applications. Migrating existing Java applications to Kotlin generally followed the path of introducing Kotlin data classes first and then gradually migrating the rest of the source code. Java interoperability also allowed Expedia to easily integrate Kotlin applications with Java libraries and fully utilize the existing JVM ecosystem.

[Kotlin Coroutines](https://kotlinlang.org/docs/reference/coroutines-overview.html) were a critical factor in the wide adoption of the language. They allow developers to write fully asynchronous code in an imperative way, which leads to more readable and maintainable code. The Spring Framework is used heavily at Expedia, and starting with version 5.2 it introduced interoperability between WebFlux and coroutines. For the engineers at Expedia, this was a game-changer that made it possible to leverage the Spring and Reactive stack in a more imperative way.

## GraphQL with Kotlin
![Dariusz quotation](/images/case-studies/content/expedia-1.png)

[GraphQL](https://graphql.org/) was created to address the needs of mobile clients – it provides a single API for all the clients to integrate with that allows them to selectively ask for the data they need and that can be modified without breaking any of the existing clients. When Expedia started modernizing its frontend stack, they decided to move toward GraphQL and build a single API gateway to power all frontend applications. In order to streamline the development experience and ensure that the code is a single source of truth for the APIs, Expedia applies Kotlin’s powerful reflection library to generate the GraphQL schema directly from the source code.
 
### “We believe that the ability to generate your GraphQL schemas directly from the source is useful functionality that can benefit the open-source community, so we open-sourced the resulting libraries as graphql-kotlin to help developers run GraphQL in Kotlin.” Dariusz Kuc, Principal Software Engineer

Over time, the [graphql-kotlin](https://github.com/ExpediaGroup/graphql-kotlin) libraries grew to provide additional functionality, including a Spring Boot autoconfiguration library that eliminates all the boilerplate code needed to configure and run a GraphQL server. As a result, developers can simply write functions that return data classes, and the graphql-kotlin libraries will automatically convert them to a valid GraphQL schema and start a reactive Spring Boot web application.

At KotlinConf 2019, Dariusz Kuc and Guillaume Scheibel talked about how to utilize the power of Spring Boot together with [graphql-kotlin](https://expediagroup.github.io/graphql-kotlin/docs/getting-started.html). Watch the video:

<iframe width="600" height="300" src="https://www.youtube.com/embed/7YJyPXjLdug" frameborder="0" allow="accelerometer; 
autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## The shift to Kotlin Coroutines

Expedia started the development of the new GraphQL services using Spring MVC, which relies on a blocking servlet threading model. While it worked, blocking threads was not the most efficient use of hardware resources. Since GraphQL services return data from some downstream services and data stores, whenever there is a dependency on a slow resource, underlying threads end up blocked as they wait for the data to arrive. Reactive frameworks allow you to process the data in a non-blocking way and are a good tool for approaching this problem. 
 
Expedia’s first attempt with reactive frameworks was with RxJava, which helped to parallelize the downstream calls. While it worked for simple things, there were several issues that arose. Developers attempted to use traditional imperative programming models within the reactive paradigm. They were using incorrect operators or causing some unintended side effects. As a result, due to the different programming models, additional training was required, which slowed down the onboarding process of new developers. 

That’s why, when Spring announced full interop between their reactive WebFlux framework and Kotlin coroutines, Expedia quickly switched. Thanks to the imperative programming model of Kotlin Coroutines, it was much easier for developers to learn and use it effectively. Coroutines quickly became the preferred way to write highly performant asynchronous code.  

### “Thanks to Kotlin’s conciseness and support for imperative programming style for writing fully asynchronous code, the resulting code is much more readable and maintainable. “ Dariusz Kuc, Principal Software Engineer

## Summary

In short, the following features make Kotlin an attractive programming language at Expedia:

* **Conciseness.** The expressiveness of the language results in concise code, making it possible to write less code with fewer mistakes.
* **Null-safety.** This extra safety feature is built into Kotlin’s compiler, resulting in fewer issues with dereferencing null values.
* **Java-interoperability.** The fact that you can leverage the Java ecosystem, with all its frameworks and libraries, is a serious productivity booster! You also don’t have to rewrite the Java application fully in Kotlin –  you can introduce Kotlin code gradually into your Java project and migrate slowly.  
* **Kotlin Coroutines.** These offer an easy way to master the asynchronous code with an imperative programming model. The fact that Coroutines support was added to the Spring Framework made it even easier to take advantage of this feature.
