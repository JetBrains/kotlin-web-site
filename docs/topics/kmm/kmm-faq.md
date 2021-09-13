[//]: # (title: FAQ)

### What is KMM?

_KMM (Kotlin Multiplatform Mobile)_ is an SDK for cross-platform mobile development. With KMM, you can develop 
multiplatform mobile applications and share parts of your applications between Android and iOS, such as core layers, 
business logic, presentation logic, and more.

KMM uses the [multiplatform abilities of Kotlin](multiplatform.md) and the features 
designed for mobile development, such as CocoaPods integration and the [Android Studio Plugin](#what-is-the-kmm-plugin).

You may want to watch this introductory [video](https://www.youtube.com/watch?v=mdN6P6RI__k), in which Kotlin Developer 
Advocate Ekaterina Petrova explains in detail what Kotlin Multiplatform Mobile is and how you can use it in your projects. 
Together with Ekaterina you'll set up an environment and prepare for creating your first cross-platform mobile application with KMM.

### What is the KMM plugin?

The _[Kotlin Multiplatform Mobile (KMM) plugin](https://plugins.jetbrains.com/plugin/14936-kotlin-multiplatform-mobile)_
for Android Studio helps you develop applications that work on both Android and iOS. 

With the KMM Plugin, you can:
* Run, test, and debug the iOS part of your application on iOS targets straight from Android Studio.
* Quickly create a new multiplatform project.
* Add a multiplatform module into an existing project.

The KMM plugin works only on macOS. This is because iOS simulators, per the Apple requirement, can run only on macOS 
but not on any other operating systems, such as Microsoft Windows or Linux.

The good news is that you can work with KMM projects on Android even without the KMM plugin. If you are going to work 
with shared code or Android-specific code, you can work on any operating system supported by Android Studio.

### What is Kotlin/Native and how does it relate to KMM?

_[Kotlin/Native](native-overview.md)_ is a technology for compiling Kotlin code to native 
binaries, which can run without a virtual machine. It consists of an [LLVM](https://llvm.org/)-based backend for the 
Kotlin compiler and a native implementation of the Kotlin standard library.

Kotlin/Native is primarily designed to allow compilation for platforms where virtual machines are not desirable or 
possible, such as embedded devices and iOS. It is particularly suitable for situations when the developer needs to produce 
a self-contained program that does not require an additional runtime or virtual machine. And that is exactly the case with 
iOS development.

Shared code, written in Kotlin, is compiled to JVM bytecode for Android with Kotlin/JVM and to native binaries for iOS 
with Kotlin/Native. It makes the integration with KMM seamless on both platforms.
![Kotlin/Native and Kotlin/JVM binaries](kotlin-native-and-jvm-binaries.png)

### What are the plans for KMM?

KMM is one of the focus areas of the [Kotlin roadmap](roadmap.md). To see which parts we’re 
working on right now, check out the [roadmap details](roadmap.md#roadmap-details). 
Most of the recent KMM changes affect the **Kotlin Multiplatform** and **Kotlin/Native** sections.

### Can I run an iOS application on Microsoft Windows or Linux?

If you want to write iOS-specific code and run an iOS application on a simulated or real device, use a Mac with a macOS
([use the KMM plugin for it](#what-is-the-kmm-plugin)). This is because iOS simulators can run only on macOS, per 
the Apple requirement, but cannot run on other operating systems, such as Microsoft Windows or Linux.

If you are going to work with shared code or Android-specific code, you can work on any operating system supported by Android Studio.

### Where can I get complete examples to play with?

* [Curated samples](kmm-samples.md)
* Several [hands-on tutorials](https://play.kotlinlang.org/hands-on/overview)

### In which IDE should I work on my cross-platform app?

You can work in [Android Studio](https://developer.android.com/studio). Android Studio allows the use of the 
[KMM plugin](#what-is-the-kmm-plugin), which is a part of the KMM ecosystem. Enable the KMM plugin in Android Studio 
if you want to write iOS-specific code and launch an iOS application on a simulated or real device. The KMM plugin can be used only on macOS.

Most of our adopters use Android Studio. However, if there is any reason for you not to use it, there is another option: 
you can use [IntelliJ IDEA](https://www.jetbrains.com/idea/download). IntelliJ IDEA provides the ability to create 
a multiplatform mobile application from the Project Wizard, but you won’t be able to launch an iOS application from the IDE.

### How can I write concurrent code in KMM projects?

You can learn how to work with [concurrency](kmm-concurrency-overview.md) on the documentation portal.

Working with concurrent code in KMM projects might not seem straightforward, as different memory management approaches 
are used in Kotlin/JVM and Kotlin/Native. The current approach for Kotlin/Native has some 
[limitations](native-concurrency.md). The new Kotlin/Native memory management model is on 
the [roadmap](https://blog.jetbrains.com/kotlin/2020/07/kotlin-native-memory-management-roadmap) and the team is working 
on a solution for it.

### How can I speed up my KMM module compilation for iOS?
See these [tips for improving Kotlin/Native compilation times](native-improving-compilation-time.md).
