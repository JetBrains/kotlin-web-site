[//]: # (title: Gradle)

Gradle is a build system that helps to automate and manage your building process. It downloads required dependencies,
packages your code, and prepares it for compilation. Learn about Gradle basics and specifics 
on the [Gradle website](https://docs.gradle.org/current/userguide/userguide.html).

You can set up your own project with [these instructions](gradle-configure-project.md) for different platforms 
or pass a small [step-by-step tutorial](get-started-with-jvm-gradle-project.md) that will show you how to create a simple backend 
"Hello World" application in Kotlin.

> You can find information about the compatibility of Kotlin, Gradle, and Android Gradle plugin versions [here](gradle-configure-project.md#apply-the-plugin).
> 
{style="tip"}

In this chapter, you can also learn about:
* [Compiler options and how to pass them](gradle-compiler-options.md).
* [Incremental compilation, caches support, build reports, and the Kotlin daemon](gradle-compilation-and-caches.md).
* [Support for Gradle plugin variants](gradle-plugin-variants.md).

## What's next?

Learn about:
* **Gradle Kotlin DSL**. The [Gradle Kotlin DSL](https://docs.gradle.org/current/userguide/kotlin_dsl.html) is a domain specific language 
  that you can use to write build scripts quickly and efficiently.
* **Annotation processing**. Kotlin supports annotation processing via the [Kotlin Symbol processing API](ksp-reference.md).
* **Generating documentation**. To generate documentation for Kotlin projects, use [Dokka](https://github.com/Kotlin/dokka);
  please refer to the [Dokka README](https://github.com/Kotlin/dokka/blob/master/README.md#using-the-gradle-plugin)
  for configuration instructions. Dokka supports mixed-language projects and can generate output in multiple
  formats, including standard Javadoc.
* **OSGi**. For OSGi support see the [Kotlin OSGi page](kotlin-osgi.md).
