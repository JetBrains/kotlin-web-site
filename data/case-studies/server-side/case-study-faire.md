---
id: "case-study-faire"
slug: "faire"
title: "Faire"
country: "USA and Canada"
size: "50+"
industry: "Online wholesale marketplace"
---

Like most startups, at the beginning of its journey Faire was looking for an efficient solution to base its tech stack on. Having started with Java, a year in, the company started looking for other options, and opted for Kotlin. They now use Kotlin for their Android app and for the website backend, which successfully handles up to 1K requests per second.

The current backend repo has 788,020 lines of code within 6,078 Kotlin files, with roughly 45 engineers actively committing code and more onboarding every week.

We chatted with Jeff Gulbronson, a software engineer who has been with Faire since it was a year old, about Faire and why it chose Kotlin. The key benefits of Kotlin he identified were:

* Kotlin improves developers’ productivity thanks to its modern language features, and helps avoid common Java mistakes.
* Interop with Java makes it easy to use existing Java libraries.
* Easy to get started as a Java developer, making hiring easier.
* Using Kotlin makes the engineering team happier.

Let’s look at Faire’s journey together with Jeff.

## About Faire
Originating in the US, Faire is a wholesale marketplace that aims to help small and medium businesses (SMBs) to compete against the likes of Amazon and Walmart and chase their dreams.

The platform is backed by investors, such as Y Combinator, Sequoia Capital, and DST Global. At the end of 2020, Faire raised 170M at a 2.5B valuation and is now looking to expand into Europe.

![Jeff quotation](/images/case-studies/content/faire-1.png)

## Architecture Overview
Faire’s backend monolith is written entirely in Kotlin, as are the new services they create as they seek to replace the old monolith system. They make use of both traditional Java libraries, such as Hibernate for ORM, and Guice for dependency injection, as well as libraries written in Kotlin such as Wire for protocol buffers and OkHTTP for network requests. The architecture is standard – a MySQL database, Redis for caching, and then Amazon’s Simple Queue Service (SQS) to run jobs asynchronously.

![Faire_architecture](/images/case-studies/content/faire-2.png)

When an HTTP request comes in, it hits an external load balancer (an Amazon Elastic Load Balancer).

The request is routed to the Kubernetes cluster, where it arrives at an Nginx instance to see which service to route to.

The code is split into two main groups: web server and worker pods. Web server pods service incoming HTTP requests, and enqueue jobs. The jobs are handled by the worker pods, which also handle recurring tasks such as "Run this piece of code every day at 1 am".

MySQL is the primary data store, and Redis is used for caching. Faire uses an event-streaming service (Kinesis Firehose) to stream data into their data warehouse.

## Why Kotlin?
While Java was a fine language choice, Faire started looking for a programming language that would be more expressive and fix some of its shortcomings. Jeff worked with Kotlin at Square and had been exposed to how powerful it is. He suggested trying Kotlin and seeing if it would be a better fit for Faire to replace Java. 

Kotlin had full interop with the JVM, behaved similarly to Java, but cut down on the rough edges with features such as nullable types, object keyword, mutable vs immutable collections, and more.

### “We decided to switch because we liked the velocity of new Kotlin features, and felt the features available at the time made it worth switching to. The fact that the Java interop is first-tier made it extremely easy to introduce Kotlin to the codebase, as there was little to no risk if we decided to switch back to Java in the future.”

For Faire, Kotlin in many ways came across as a “better Java”, for Faire and they jumped into the migration process.

## Java to Kotlin Migration: Challenges and Benefits
The initial commit to add Kotlin was only a few files: one to convert a simple existing Java file to Kotlin, and then a couple of updates to the team’s Maven files to update the build system. 

They started the migration process by using the Java-to-Kotlin converter built into IntelliJ IDEA. Automated conversion isn’t perfect and requires some manual work to make the code fluent. There were cases where a Java `Integer` would be converted to a Kotlin `Int`, only for the team to find out that field is in fact nullable (sometimes in tests, other times in staging). 

Migration to Kotlin helped to reveal previously made assumptions about the nullability of different variables. In Java, extra validation would have to be added to call-sites to catch and prevent errors; with Kotlin, this work could be delegated by leveraging the type system and [relying on the compiler](https://kotlinlang.org/docs/reference/null-safety.html). This resulted in less boilerplate code for null checks and improved quality by eliminating human mistakes.

In early 2018 there weren't many other companies using Kotlin for the backend, so it was tough to find external resources for specific issues. Faire developers overcame these issues through trial and error. For example, Kotlin leans towards final by default, which in some cases conflicts with how Hibernate works. They eventually learned how to properly integrate with Java libraries and built up best practices, and as more of the code was converted to Kotlin, they saw fewer and fewer NPEs. 

### “Finally Kotlin let us use a modern language that new hires are happy to use. Really it's like ‘Java Next’, which I think is the sweet spot for server use cases.”

Today the community generates lots of helpful materials. But when it’s your first exposure to a technology, it can be tricky to navigate them. To get daily access to Kotlin news and discussions [join our community Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up). 

## Favorite features
### “Java Interop — it feels weird to call this a feature, but we would not have been able to migrate to Kotlin without it. I was extremely impressed by how thoughtful the language creators were around interop, which with the exception of a few nuances, made it extremely easy to migrate our codebase.”

* Data classes — data classes were a godsend in terms of debuggability (via `toString`), but also in terms of correctness (via `equals` and `hashCode`). On the server, the team is constantly creating small classes to move data around.
* Type system (including read-only collections) — Java libraries provided some of the features that Kotlin gives first-class support for. One such case is `ImmutableList` and `ImmutableSet` which are provided by Guava. Another is using the `@Nullable` and `@NotNull` annotations to document variables. Kotlin puts all of these into the type system with `List` vs `MutableList`, and `List` vs `List?`. Having first-class support for these in the type system means the language can offer support for them via the standard library, and it doesn’t feel like they’re hacked on to the language. Simply put, this makes the development experience much nicer and lets the language do more of the work.
* Lambda expressions and type inference — these deserve a special mention, they are again another godsend for us coming from Java (this was pre-Java 11, so no `var` keyword). Passing a function around in Java was a nightmare from a type system perspective, which meant we very rarely did it. And having to declare all types (even though IntelliJ IDEA helped) was a drag. With those two features combined, it feels like we can write the code we want (e.g. pass a lambda to a function to be invoked), as there is Java to resist it with its lack of functional support.

## Summary
Converting from Java to Kotlin was fun and easy for Faire thanks to the excellent interop between Java and Kotlin. It also brought an additional advantage to the startup in terms of recruiting. Being able to work in a more modern language was compelling to a lot of the developers. And for many it was a new opportunity to write Kotlin in a production environment. Eventually, Faire found almost all of its developers much happier and more productive.
