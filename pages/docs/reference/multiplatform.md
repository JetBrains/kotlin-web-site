---
type: doc
layout: reference
category: "Other"
title: "Multiplatform Projects"
---

# Multiplatform Projects

> Multiplatform projects are a new experimental feature in Kotlin 1.2. All of the language
and tooling features described in this document are subject to change in future Kotlin versions.
{:.note}

A Kotlin multiplatform project allows you to compile the same code to multiple target
platforms. At this time supported target platforms are the JVM and JS, with Native to be added later.

## Multiplatform Project Structure

A multiplatform project consists of three types of modules:

  * A _common_ module contains code that is not specific to any platform, as well as declarations
    without implementation of platform-dependent APIs. Those declarations allow common code to depend on 
    platform-specific implementations.
  * A _platform_ module contains implementations of platform-dependent declarations in the common module
    for a specific platform, as well as other platform-dependent code. A platform module is always
    an implementation of a single common module.
  * A regular module. Such modules target a specific platform and can either be dependencies of
    platform modules or depend on platform modules.
    
A common module can depend only on other common modules and libraries, including the common
version of the Kotlin standard library (`kotlin-stdlib-common`). Common modules contain only Kotlin
code, and not code in any other languages.

A platform module can depend on any modules and libraries available on the given platform
(including Java libraries in case of Kotlin/JVM and JS libraries for Kotlin/JS). Platform modules
targeting Kotlin/JVM can also contain code in Java and other JVM languages.

Compiling a common module produces a special _metadata_ file containing all the declarations in the
module. Compiling a platform module produces target-specific code (JVM bytecode or JS source code)
for the code in the platform module as well as the common module that it implements.

Therefore, each multiplatform library needs to be distributed as a set of artifacts - a common
.jar containing the metadata for common code, as well as platform specific .jars containing the
compiled implementation code for each platform.


## Setting Up a Multiplatform Project

As of Kotlin 1.2, multiplatform projects have to be built with Gradle; other build systems
are not supported. If you work with a multiplatform project in IDE, make sure that `Delegate IDE build/run actions to gradle` option is enabled and `Gradle Test Runner` is set for `Run tests using` option. Both options may be found here: _Settings > Build, execution, Deployment > Build Tools > Gradle > Runner_

To create a new multiplatform project in the IDE, select the "Kotlin (Multiplatform)" option
under "Kotlin" in the New Project dialog. This will create a project with three modules, a common one
and two platform ones for JVM and JS. To add additional modules, select one of the "Kotlin (Multiplatform)"
options under "Gradle" in the New Module dialog.

If you need to configure the project manually, use the following steps:

  * Add the Kotlin Gradle plugin to the buildscript classpath: `classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version"`
  * Apply the `kotlin-platform-common` plugin to the common module
  * Add the `kotlin-stdlib-common` dependency to the common module
  * Apply the `kotlin-platform-jvm`, `kotlin-platform-android`, and `kotlin-platform-js` plugins to the platform modules for JVM, Android, and JS, respectively
  * Add dependencies with `expectedBy` scope from the platform modules to the common module
  
The following example demonstrates a complete `build.gradle` file for a common module with Kotlin 1.2:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` groovy
buildscript {
    ext.kotlin_version = '{{ site.data.releases.latest.version }}'

    repositories {
        mavenCentral()
    }
    dependencies {
        classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version"
    }
}

apply plugin: 'kotlin-platform-common'

repositories {
    mavenCentral()
}

dependencies {
    compile "org.jetbrains.kotlin:kotlin-stdlib-common:$kotlin_version"
    testCompile "org.jetbrains.kotlin:kotlin-test-common:$kotlin_version"
}
```
</div>

And the example below shows a complete `build.gradle` for a JVM module. Pay special
attention to the `expectedBy` line in the `dependencies` block:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` groovy
buildscript {
    ext.kotlin_version = '{{ site.data.releases.latest.version }}'

    repositories {
        mavenCentral()
    }
    dependencies {
        classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version"
    }
}

apply plugin: 'kotlin-platform-jvm'

repositories {
    mavenCentral()
}

dependencies {
    compile "org.jetbrains.kotlin:kotlin-stdlib:$kotlin_version"
    expectedBy project(":")
    testCompile "junit:junit:4.12"
    testCompile "org.jetbrains.kotlin:kotlin-test-junit:$kotlin_version"
    testCompile "org.jetbrains.kotlin:kotlin-test:$kotlin_version"
}
```
</div>


## Platform-Specific Declarations

One of the key capabilities of Kotlin's multiplatform code is a way for common code to
depend on platform-specific declarations. In other languages, this can often be accomplished
by building a set of interfaces in the common code and implementing these interfaces in platform-specific
modules. However, this approach is not ideal in cases when you have a library on one of the platforms
that implements the functionality you need, and you'd like to use the API of this library directly
without extra wrappers. Also, it requires common declarations to be expressed as interfaces, which
doesn't cover all possible cases.

As an alternative, Kotlin provides a mechanism of _expected and actual declarations_.
With this mechanism, a common module can define _expected declarations_, and a platform module
can provide _actual declarations_ corresponding to the expected ones. 
To see how this works, let's look at an example first. This code is part of a common module:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` kotlin
package org.jetbrains.foo

expect class Foo(bar: String) {
    fun frob()
}

fun main(args: Array<String>) {
    Foo("Hello").frob()
}
```
</div>

And this is the corresponding JVM module:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` kotlin
package org.jetbrains.foo

actual class Foo actual constructor(val bar: String) {
    actual fun frob() {
        println("Frobbing the $bar")
    }
}
```
</div>

This illustrates several important points:

  * An expected declaration in the common module and its actual counterparts always
    have exactly the same fully qualified name.
  * An expected declaration is marked with the `expect` keyword; the actual declaration
    is marked with the `actual` keyword.
  * All actual declarations that match any part of an expected declaration need to be marked
    as `actual`.
  * Expected declarations never contain any implementation code.

Note that expected declarations are not restricted to interfaces and interface members.
In this example, the expected class has a constructor and can be created directly from common code.
You can apply the `expect` modifier to other declarations as well, including top-level declarations and
annotations:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` kotlin
// Common
expect fun formatString(source: String, vararg args: Any): String

expect annotation class Test

// JVM
actual fun formatString(source: String, vararg args: Any) =
    String.format(source, args)
    
actual typealias Test = org.junit.Test
```
</div>

The compiler ensures that every expected declaration has actual declarations in all platform
modules that implement the corresponding common module, and reports an error if any actual declarations are 
missing. The IDE provides tools that help you create the missing actual declarations.

If you have a platform-specific library that you want to use in common code while providing your own
implementation for another platform, you can provide a typealias to an existing class as the actual
declaration:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` kotlin
expect class AtomicRef<V>(value: V) {
  fun get(): V
  fun set(value: V)
  fun getAndSet(value: V): V
  fun compareAndSet(expect: V, update: V): Boolean
}

actual typealias AtomicRef<V> = java.util.concurrent.atomic.AtomicReference<V>
```
</div>

## Multiplatform tests

It is possible to write tests in a common project so that they will be compiled and run in each platform project. 
There are 4 annotations provided in `kotlin.test` package to markup tests in common code: `@Test`, `@Ignore`, 
`@BeforeTest` and `@AfterTest`.
In JVM platform these annotations are mapped to the corresponding JUnit 4 annotations, and in JS they are already 
available since 1.1.4 to support JS unit testing.

In order to use them you need to add a dependency on `kotlin-test-annotations-common` to your common module, on 
`kotlin-test-junit` to your JVM module, and on `kotlin-test-js` to the JS module.
