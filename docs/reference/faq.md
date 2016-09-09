---
type: doc
layout: reference
category: FAQ
title: FAQ
---

# FAQ

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

The core values behind the design of Kotlin make it

* Interoperable: Kotlin can be freely mixed with Java,
* Safe: statically check for common pitfalls (e.g., null pointer dereference) to catch errors at compile time,
* Toolable: enable precise and performant tools such as IDEs and build systems,
* "Democratic": make all parts of the language available to all developers (no policies are needed to restrict the use of some features to library writers or other groups of developers).

### How is it licensed?

Kotlin is an OSS language and is licensed under the Apache 2 OSS License. The IntelliJ Plug-in is also OSS.

It is hosted on GitHub and we happily accept contributors

### Where can I get an HD Kotlin logo?

Logos can be downloaded [here](https://resources.jetbrains.com/assets/products/kotlin/kotlin_logos.zip). Please follow simple rules in the `readme.txt` inside the archive.


### Is it Java Compatible?

Yes. The compiler emits Java byte-code. Kotlin can call Java, and Java can call Kotlin. See [Java interoperability](java-interop.html).

### Which minimum Java version is required for running Kotlin code?

Kotlin generates bytecode which is compatible with Java 6 or newer. This ensures that Kotlin can be used in environments such as Android, where Java 6 is the latest supported version.

### Is there tooling support?

Yes. There is an IntelliJ IDEA plugin that is available as an OSS project under the Apache 2 License. You can use Kotlin both
 in the [free OSS Community Edition and Ultimate Edition](http://www.jetbrains.com/idea/features/editions_comparison_matrix.html) of IntelliJ IDEA.

### Is there Eclipse support?

Yes. Please refer to the [tutorial](/docs/tutorials/getting-started-eclipse.html) for installation instructions.

### Is there a standalone compiler?

Yes. You can download the standalone compiler and other builds tools from the [release page on GitHub]({{site.data.releases.latest.url}})

### Is Kotlin a Functional Language?

Kotlin is an Object-Oriented language. However it has support for higher-order functions as well as lambda expressions and top-level functions. In addition, there are
a good number of common functional language constructs in the Kotlin Standard Library (such as map, flatMap, reduce, etc.). Also, there's no clear definition on what a Functional Language is so we couldn't say Kotlin is one.

### Does Kotlin support generics?

Kotlin supports generics. It also supports declaration-site variance and usage-site variance. Kotlin does not have wildcard types. Inline functions support reified type parameters.

### Are semicolons required?

No. They are optional.

### Why have type declarations on the right?

We believe it makes the code more readable. Besides, it enables some nice syntactic features. For instance, it is easy to leave type annotations out. Scala has also
proven pretty well this is not a problem.

### Will right-handed type declarations affect tooling?

No, they won't. We can still implement suggestions for variable names, etc.

### Is Kotlin extensible?

We are planning on making it extensible in a few ways: from inline functions to annotations and type loaders.

### Can I embed my DSL into the language?

Yes. Kotlin provides a few features that help along: Operator overloading, Custom Control Structures via inline functions, Infix function calls, Extension Functions, Annotations.

### What ECMAScript level does Kotlin for JavaScript support?

Currently at 5.

### Does the JavaScript back-end support module systems?

Yes. There are plans to provide at least CommonJS and AMD support.
