---
id: "case-study-doordash"
slug: "doordash"
title: "DoorDash"
country: "USA, San Francisco"
size: "3000+"
industry: "Food delivery service"
---

<a href="https://en.wikipedia.org/wiki/DoorDash" class="wt-link" target="_blank" rel="noreferrer noopener">DoorDash ↗</a> uses Kotlin for all their backend services and infrastructure. Hundreds of engineers work with Kotlin across a massive system spanning multiple repos.

Two years ago, they made the bold move to split their existing legacy Python monolith into multiple backend services, which they developed in Kotlin. This upgrade resulted in tremendous improvements:

* Better software performance.
* Сleaner code.
* Easier code reviews.

Another great thing about Kotlin is that people coming from Java, Golang, and Python find it really easy to get started.

![Zohaib quotation](/images/case-studies/content/doordash-1.png)

## About DoorDash

San Francisco-based on demand logistics platform DoorDash deals with customers who order food, merchants who prepare food for customers, and “Dashers” who deliver the food to the customer’s door.

By the end of November 2020, DoorDash had achieved $1.9 billion in revenue and it’s one of the most anticipated IPOs in 2020.

### “We are serving millions of users every day, delivering their orders with a very intricate, well-knitted solution.Our Kotlin services are handling requests from several complex logistic systems in order to weave together a seamless on-demand food delivery experience for the customers.”

## Why Kotlin?

DoorDash had a Python monolith system backend that worked satisfactorily but wasn’t going to keep up with the projected scaling. So DoorDash started to look into the options available for making a more scalable solution.

A special internal committee evaluated the choices available, such as Python 3 (with async IO), Java, Golang, and Kotlin in combination with gRPC to see which would best fit the company’s needs. The performance achieved with Python wasn’t sufficient. Golang performed great but at that time it wasn’t suited to complex business logic. The JVM appeared to be the most attractive landscape in terms of libraries, tooling, and frameworks, but almost all the developers were concerned about Java’s ceremonial constructs and bloated code.

Kotlin looked promising with its clean syntax and support for coroutines. It was easy to read, understand, and maintain. Kotlin also allowed developers with existing JVM experience to draw on their existing knowledge while building on top of solid frameworks that were well-documented and battle-tested.

## Building up in the JVM ecosystem

The DoorDash software backend now consists of two types of services: “backend for frontend” (BFF) services that act as stateless proxies, and internal services that run on Kotlin and gRPC and are accessible only through BFF. The BFF uses Kotlin either with SpringBoot or Micronaut. In such a system, gRPC servers are capable of writing end-to-end suspendable code without descending into callback hell. This significantly improves performance.

Kotlin also allowed the team to use the rich Java library ecosystem and build solid services with complete instrumentation and maximum visibility. 

The common backend stack means that developers can write shared libraries for services and the BFF. In DoorDash, Kroto+ is used to generate the coroutine-friendly client and server code. Building on top of Netty, they were able to add libraries like Lettuce (for Redis), R2DBC (for Postgres), and Micrometer (for instrumentation). These libraries provide the foundation for out-of-the-box coroutine reactor extensions. There was some work done to glue them together, including adding interceptors, extension methods, and dependency injection, but the ecosystem quickly reached a stable state.

### “Writing interoperable code between libraries can get tricky. Thanks to Kotlin’s extensions system, we ended up writing additional extensions to weave these constructs together and still write some delightful code.” 

## Favourite feature

### “Nullability and safety is our favorite feature due to the guarantees it can put on the code. Yes, interoperability with Java might still have some nuances, but as long as you have written your code inside Kotlin it’s a lifesaver (almost all of our business logic is in Kotlin).”

Other favourite features at DoorDash:

* **Extension Functions** is a lifesaver and an answer to utility classes. If used right they make code look simpler and more pleasant to read. 
* **Data classes** are something that POJOs or DTOs (Data Transfer Objects) were always missing. Already having the capability to do `copy` and `equals` simplifies daily chores that would have been some IDE-generated junk or a Lombok hack. 
* **Function blocks** that look like bodies. This is probably the most heavily used feature in the DoorDash codebase. From caching to instrumentation, it is easy to write nice, well-indented blocks that look like function bodies instead of callback lambdas. 
* **Coroutines** are last but not least. At DoorDash there is a deep love of coroutines. Coroutines let you write regular straightforward code and manage the code generation for continuations under the hood. This keeps stack traces simpler for coroutine code, reducing cognitive load. 

## Summary
With Kotlin, DoorDash was able to achieve its scaling goals and improve overall system performance. Perfect Java compatibility and coroutines were the main reasons behind this transformational success. Kotlin was a good middle ground for people coming from Java, Golang, and Python. It was easy for them to quickly catch up and start writing good, maintainable code in Kotlin.
