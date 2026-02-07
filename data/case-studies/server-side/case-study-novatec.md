---
id: "case-study-novatec"
slug: "novatec"
title: "Novatec"
country: "Germany"
size: "250+"
industry: "IT consulting and agile software development"
---
# About Novatec
Novatec is an owner-managed, medium-sized IT company that has led customers into the digital future for the last 25 years. This starts with a requirements analysis, proceeds to architectural and process recommendations, and continues above and beyond to the agile software development phase.
Their target customers are from the insurance, finance, manufacturing, automotive, and energy sectors. Together with them, Novatec explores how they can use BPM, IoT, robot-controlled process automation, mixed and augmented reality, and other innovations to improve processes and develop new products.

#### Project A
- 40 developers
- 11 million users worldwide
- 25 (micro) services written in Kotlin

#### Project B
- 20 developers
- 12K users
- 20 (micro) services written in Kotlin

#### Project C
- 8 developers
- 4 (micro) services written in Kotlin, and counting

## Intro
Novatec uses several different technologies depending on the project and the customer’s technology stack. **For the backend, they mostly develop JVM-based applications and try to use Kotlin whenever possible.** Projects range from a couple of applications running on premises at the customer's data center to several microservices running on public cloud providers available for millions of users around the world.

![Carlos quotation](/images/case-studies/content/novatec-1.png)

## Why Kotlin?
There was a common main reason why our teams introduced Kotlin into their projects: readability and conciseness compared to Java. The other reasons included:
- The ability to choose the kind of paradigm – functional or object-oriented – that best fits the problem.
- Reduced boilerplate because of standard library functions.
- Null-safety.
- Modern language features as coroutines, data classes, and nullable types.
We migrated our codebase gradually from Java to Kotlin and we are very happy with the result.

## Kotlin adoption: challenges and benefits
There were several approaches to introducing Kotlin to a project. We noticed some reluctancy from our customers at the beginning. They had some fears about introducing a new language to the project, which could slow them down. That's why we started gradually with writing tests so that all team members felt comfortable with Kotlin. We neither wanted nor expected that everybody could start writing idiomatic Kotlin at the beginning. We let people familiarize themselves with the syntax and how the language looks. Then we started writing a single new application in Kotlin in order to determine how it feels for the team. After that, everyone in the team was convinced that Kotlin was the way to go. Over the next couple of months everything new was written in Kotlin and old Java code was converted / re-written every time we touched the old code.

One of the strongest advantages of Kotlin is its interoperability with Java. You can mix Java and Kotlin in the same project, so you don't need an all-or-nothing approach. It was also astounding to see that most of the team members picked up the language quickly. After a very short time, they felt they were more productive and their code became more readable and concise.

More readable code is an advantage in itself – not only because there is less code overall, but also because the code is less cumbersome. In some applications, the build tool (Gradle) also uses Kotlin, so there is less context-switching.

Problems regarding nullability are discovered earlier which leads to quality improvements in the codebase. Thanks to the functions provided by the standard library, there are fewer dependencies on third-party libraries. Sometimes a functional approach is more fitting for solving the problem at hand, and that is very easy to implement with Kotlin.

**Kotlin won everybody over. It is simply much more efficient to code.**

## Favorite features
- Extension functions. We like the readability and flexibility they provide. We also like the fact that there is no performance penalty when using extension functions.
- Nullability. It is very efficient to have direct and fast feedback from the compiler when handling nullable values. This leads to more robust and understandable code as nullability is explicit.
- Data Classes. It is always pleasant to look at these kinds of classes. The class declaration is very clean and we can concentrate on the stuff that matters without all the boilerplate code that data classes take care of.
- Multiple classes and functions in a single file. This turned out to be an unexpected and surprisingly gratifying feature, as it allows for very quick prototyping and explorative coding which accelerates the implementation process for complex solutions.
- The standard library functions. There are a lot of useful functions in the standard library, which means you don't need to rely on third-party libraries. The functions for manipulating collections are pretty neat and easy to grasp.

## Kotlin tips
Do not abuse the great features Kotlin has to offer. Otherwise, the code could become cryptic and hard to understand. Use only the features that make sense and that really improve the readability of the code. Most of the time, a simple if-else is easier to read than some complicated function-chaining code.

Migration from Java to Kotlin can be done gradually, as the Kotlin interoperability with Java is great. You can mix Java and Kotlin code in the same project, so it is easy to migrate projects at a pace your team feels comfortable with. Another way to introduce Kotlin to a project is to write your unit tests with it, even if your production code is written in Java.

We also have noticed that Kotlin shines with reactive programming. The code is cleaner and more readable than with Java.
