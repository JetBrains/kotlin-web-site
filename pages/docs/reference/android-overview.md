---
type: doc
layout: reference
category: "Introduction"
title: "Kotlin for Android"
---

# Using Kotlin for Android Development

Kotlin is a great fit for developing Android applications, bringing all of the advantages of a modern language
to the Android platform without introducing any new restrictions:

  * **Compatibility**: Kotlin is fully compatible with JDK 6, ensuring that Kotlin applications can run on older
    Android devices with no issues. The Kotlin tooling is fully supported in Android Studio and compatible with the Android build system.
  * **Performance**: A Kotlin application runs as fast as an equivalent Java one, thanks to very similar bytecode structure.
    With Kotlin's support for inline functions, code using lambdas often runs even faster than the same code written in Java.
  * **Interoperability**: Kotlin is 100% interoperable with Java, allowing to use all existing Android libraries
    in a Kotlin application. This includes annotation processing, so databinding and Dagger work too.
  * **Footprint**: Kotlin has a very compact runtime library, which can be further reduced through the use of ProGuard.
    In a [real application](https://blog.gouline.net/kotlin-production-tales-62b56057dc8a), the Kotlin runtime adds
    only a few hundred methods and less than 100K to the size of the .apk file.
  * **Compilation Time**: Kotlin supports efficient incremental compilation, so while there's some additional overhead
    for clean builds, [incremental builds are usually as fast or faster than with Java](https://medium.com/keepsafe-engineering/kotlin-vs-java-compilation-speed-e6c174b39b5d).
  * **Learning Curve**: For a Java developer, getting started with Kotlin is very easy. The automated Java to Kotlin converter included in the Kotlin plugin
    helps with the first steps. [Kotlin Koans](/docs/tutorials/koans.html) offer a guide through the key features of the language with a series of interactive exercises.

## Kotlin for Android Case Studies

Kotlin has been successfully adopted by major companies, and a few of them have shared their experiences:

  * Pinterest has successfully [introduced Kotlin into their application](https://www.youtube.com/watch?v=mDpnc45WwlI), used by 150M people every month.
  * Basecamp's Android app is [100% Kotlin code](https://m.signalvnoise.com/how-we-made-basecamp-3s-android-app-100-kotlin-35e4e1c0ef12), and they report a huge
    difference in programmer happiness and great improvements in work quality and speed.
  * Keepsafe's App Lock app has also been [converted to 100% Kotlin](https://medium.com/keepsafe-engineering/lessons-from-converting-an-app-to-100-kotlin-68984a05dcb6),
    leading to a 30% decrease in source line count and 10% decrease in method count.

## Tools for Android Development

The Kotlin team offers a set of tools for Android development that goes beyond the standard language features:

 * [Kotlin Android Extensions](/docs/tutorials/android-plugin.html) is a compiler extension
that allows you to get rid of `findViewById()` calls in your code and to replace them with synthetic compiler-generated
properties.
 * [Anko](http://github.com/kotlin/anko) is a library providing a set of Kotlin-friendly wrappers around the Android
   APIs, as well as a DSL that lets you replace your layout .xml files with Kotlin code.

## Next Steps

* Download and install [Android Studio 3.0](https://developer.android.com/studio/index.html), which includes Kotlin support out of the box.
* Follow the [Getting Started with Android and Kotlin](/docs/tutorials/kotlin-android.html) tutorial
to create your first Kotlin application.
* For a more in-depth introduction, check out the [reference documentation](/docs/reference/index.html) on this site and
[Kotlin Koans](/docs/tutorials/koans.html).
* Another great resource is [Kotlin for Android Developers](https://leanpub.com/kotlin-for-android-developers),
a book that guides you step by step through the process of creating a real Android application in Kotlin.
 * Check out Google's [sample projects written in Kotlin](https://developer.android.com/samples/index.html?language=kotlin).
