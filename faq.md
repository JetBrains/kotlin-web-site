---
layout: default
title: FAQ
---

## Common Questions

### What is Kotlin?

Kotlin is a statically typed language that targets the JVM and JavaScript. It is a general-purpose language intended for industry use.

It is developed by a team at JetBrains although it is an OSS language and has external contributors.

### Why a new language?

At JetBrains, we’ve been developing for the Java platform for a long time, and we know how good it is.
On the other hand, we know that the Java programming language has certain limitations and problems that are either impossible
or very hard to fix due to backward-compatibility issues. We know that Java is going to stand long,
but we believe that the community can benefit from a new statically typed JVM-targeted language free of the
legacy trouble and having the features so desperately wanted by the developers.


The main design goals behind this project are

* To create a Java-compatible language,
* That compiles at least as fast as Java,
* Make it safer than Java, i.e. statically check for common pitfalls such as null pointer dereference,
* Make it more concise than Java by supporting variable type inference, higher-order functions (closures), extension functions, mixins and first-class delegation, etc;
* And, keeping the useful level of expressiveness (see above), make it way simpler than the most mature competitor – Scala.

### How is it licensed?

Kotlin is an OSS language and is licensed under the Apache 2 OSS License. The IntelliJ Plug-in is also OSS.

It is hosted on GitHub and we happily accept contributors


### Is it Java Compatible?

Yes. The compiler emits Java byte-code. Kotlin can call Java, and Java can call Kotlin. See [Java interoperability]({% post_url docs/2013-11-15-java-interop %}).


### Is there tooling support?

Yes. There is an IntelliJ IDEA plugin that is available as an OSS project under the Apache 2 License. You can use Kotlin both
 in the [free OSS Community Edition and Ultimate Edition](http://www.jetbrains.com/idea/features/editions_comparison_matrix.html) of IntelliJ IDEA.

### Is there Eclipse support?

Not currently although we plan to provide it after the IntelliJ IDEA plugin. We're also eager and willing to help any member of the community that wants to
step up to the task!

### Is there a standalone compiler?

Yes. You can download the standalone compiler and other builds tools from the [release page on GitHub]({{site.latest_release_github_url}})

### Is Kotlin a Functional Language?

Kotlin is an Object-Orientated language. However it has support for high-order functions as well as function literals and top-level functions. In addition, there are
a good number of common functional language constructs in the standard Kotlin library (such as map, flatMap, reduce, etc.).

### Does Kotlin support generics?

Kotlin supports generics with runtime retention. It also supports declaration-site variance and usage-site variance. Kotlin also does not have wildcard types.

### Are semicolons required?

No. They are optional.

### Are curly braces required?

Yes.

### Why have type declarations on the right?

We believe it makes the code more readable. Besides, it enables some nice syntactic features, for instance, it is easy to leave type annotations out. Scala has also
proven pretty well this is not a problem.

### Will right-handed type declarations effect tooling?

No. It won't. We can still implement suggestions for variable names, etc.

### Is Kotlin extensible?

We are planning on making it extensible in a few ways: from inline functions to annotations, type loaders and language quotations.

### Can I embed my DSL into the language?

Yes. Kotlin provides a few features that help: Operator overloading, Custom Control Structures via inline functions, Infix function calls, Extension Functions, Annotations and
language quotations.

### What ECMAScript level does the JavaScript support?

Currently at 5.

### Does the JavaScript back-end support module systems?

Yes. There are plans to provide CommonJS and AMD support.


## Comparison to Java

### Some Java issues addressed in Kotlin

Kotlin fixes a series of issues that Java suffers from

* Null references are controlled by the type system.
* Full type information is retained at runtime
* No raw types
* Arrays in Kotlin are invariant
* Kotlin has high-order functions, a.k.a. closures
* Use-site variance without wildcards
* Kotlin does not have checked exceptions

### What Java has that Kotlin does not

* Checked exceptions
* Primitive types that are not objects
* Static members
* Non-private fields
* Type erasure
* Wildcard-types

### What Kotlin has that Java does not

* Function literals + Inline functions = performant custom control structures
* Null-safety
* Smart casts
* String templates
* Properties
* Primary constructors
* Mixins and First-class delegation
* Extension functions
* Type inference for variable and property types
* Singletons
* Declaration-site variance & Type projections
* Modules
* Range expressions
* Pattern matching
* Generic types retained at runtime
* Operator overloading
* Class objects

## Comparison to Scala

The two main design goals for Kotlin are:

* Make compilation at least as fast as Java
* Keep useful level of expressiveness while maintaining the language simple as possible

Taking this into account, if you are happy with Scala, you probably do not need Kotlin

### What Scala has that Kotlin does not

* Implicit conversions, parameters, etc
    * In Scala, sometimes it's very hard to tell what's happening in your code without using a debugger, because too many implicits get into the picture
    * To enrich your types with functions in Kotlin use Extension functions.
* Overridable type members
* Path-dependent types
* Existential types
    * Type projections are a very special case
* Complicated logic for initialization of traits
    * See Classes and Inheritance
* Custom symbolic operations
    * See Operator overloading
* Built-in XML
    * See Type-safe Groovy-style builders

Things that may be added to Kotlin later:

* Higher kinds
* Structural types
* Yield operator
* Actors
* Parallel collections
* .NET target


### What Kotlin has that Scala does not

* Zero-overhead null-safety
    * Scala has Option, which is a syntactic and run-time wrapper
* Smart casts
* Static extension functions
    * Instead of wrapping at runtime (with Scala 2.10, implicit value classes will fix the runtime overhead problem)
* Kotlin's Inline functions facilitate Nonlocal jumps
* String templates.
    * This feature will be supported in Scala 2.10
* First-class delegation. Also implemented via 3rd party plugin: Autoproxy
* Modules
