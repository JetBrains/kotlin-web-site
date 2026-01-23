---
id: "case-study-baidu"
slug: "baidu"
title: "Baidu"
country: "China"
size: "45500"
industry: "Internet, Artificial intelligence, Cloud computing"
coverImg: /images/case-studies/content/baidu-cover.png
---
<div class="rs-subtitle-2 wt-subtitle-2_flow">
<a href="https://www.baidu.com" class="wt-link" target="_blank" rel="noreferrer noopener">Baidu ↗</a>  is a leading artificial intelligence company with a strong internet infrastructure, and it is the world's largest Chinese-language search engine. Baidu also launched the Wonder App (App Store), an app targeted at younger users. The Wonder App uses Kotlin Multiplatform Mobile technology to unify the business logic of multiple modules, covering multiple core business scenarios while retaining the excellent user experience of the native UI. The integration of Multiplatform Mobile technology has truly unified the business logic for both iOS and Android development, reducing the cost of checking and maintaining it, and significantly improving productivity.
</div>

### About Wonder by Baidu

<a href="https://apps.apple.com/cn/app/wonder-%E5%B9%B4%E8%BD%BB%E4%BA%BA%E7%9A%84%E5%AE%9D%E8%97%8Fapp/id1526110789" class="wt-link" rel="noopener noreferrer" target="_blank">Wonder App  ↗</a>, an app targeted at younger users. In terms of functionality, Wonder focuses primarily on two key modules: Efficiency and Entertainment. The Efficiency module includes educational functionality as well as service tools for daily life, intended for the app to become a one-stop shop for all the users' needs. The Entertainment module aggregates current trending topics on a feed within the app. The app also provides users with entertainment media such as novels, games, comics, and videos, creating a pan-entertainment platform for young users.


### The problem of inconsistent business logic

Several modules in the Wonder App have complex business logic, involving RESTful API requests, JSON data parsing, SQLite storage, KV storage, cache processing, etc. At the same time, the target user group of the Wonder App is relatively young and has high expectations for the app’s user experience (e.g. app interactions such as gestures and animations). Initially, we used Kotlin and Swift to develop the app with the traditional native app development approach. As the complexity of the project increased and the size of the team grew, some of the following key issues emerged:

* Inconsistencies in the app experience
    * The experiences of developers developing for two different platforms (iOS and Android) on the same business logic differed greatly and caused data inconsistency.
    * Inconsistent use of the business logic, coupled with poor communication and other issues, led to the inability to align and synchronize modification points in a timely manner.

* The high cost of verifying the use of the business logic
    * The work of the iOS and Android developers using the same business logic needed to be independently checked for correct usage.

* High upgrade and maintenance costs
    * Because the UI code has not been properly decoupled from the business logic code, this makes reusing the business logic code complicated, disrupts unit testing, and increases the circular dependency between components.
    * Every time the business logic changes, this has to be communicated to both the iOS and Android developers repeatedly, who then make the necessary changes separately.

The complex and inconsistent business logic of the iOS and Android platforms led to increasing maintenance costs for the app.

### Why we introduced Kotlin Multiplatform Mobile

In the iterative process of app development, we've been trying to improve our workflow and explore various feasible technical solutions to minimize the maintenance costs caused by the inconsistent usage of the business logic.

Efforts to fix these problems in the development workflow:
* Verbally emphasizing to both iOS and Android developers that they should follow the business logic (e.g. with data structures, class names), but this was not effective.
* Code migration across development languages, arranging for developers who were familiar with both programming languages we use (Swift and Kotlin) to perform cross-platform code migration and translate the same programming ideas, but the overhead for doing so was very high.
* Introducing some lower-level language or tool, such as C/C++ or a different cross-platform framework.

But these attempts either have a high learning threshold or cost, are ineffective, or end up with an app experience that falls short of expectations. None of these efforts really solve the problems caused by inconsistent business logic in iOS and Android development. What we really needed was a technology that reduced the cost of writing and maintaining the same business logic code for different platforms, while retaining the flexibility and benefits of native app development.

![Baidu App Architevtire](/images/case-studies/content/baidu-1.png)

Kotlin Multiplatform Mobile is based on the idea of sharing the logic of your iOS and Android apps while keeping the native UX, which aligned precisely with our goals. That's why we ultimately started using Kotlin Multiplatform Mobile technology in the Wonder App!

### The process of migrating to Kotlin Multiplatform Mobile

#### Building the infrastructure

In the first half of 2021, our team started to research Kotlin Multiplatform Mobile technology, and initially ran through and checked the basic development pattern of Kotlin Multiplatform Mobile according to the official [Kotlin documentation](https://kotlinlang.org/docs/multiplatform-mobile-getting-started.html). At the same time, the team began internally evaluating the technical feasibility and preliminary plans with the existing app.

In the early stages, we did not rush into using Kotlin Multiplatform Mobile technology directly for building any business modules. We first wanted to learn and get a feel for it, and during this process think about how to combine it with the special qualities of Baidu's own business strategy. We were also focused on minimizing rebuilding as much as possible and on fully utilizing the unique **[platform-specific](https://kotlinlang.org/docs/multiplatform-connect-to-apis.html)** implementation of Kotlin Multiplatform (e.g. the  `expect`/`actual` feature). Additionally, we wanted to use the capabilities of the excellent multiplatform Open Source frameworks that we've slowly begun introducing into our project, such as [SQLDelight](https://github.com/cashapp/sqldelight), [Stately](https://github.com/touchlab/Stately), [Kotlin Serialization](https://github.com/Kotlin/kotlinx.serialization), [kotlinx-datetime](https://github.com/Kotlin/kotlinx-datetime), [krypto](https://github.com/korlibs/krypto), etc., for building infrastructure, as this would support our complex and dynamic business logic in the future.

![Baidu App Infrastructure](/images/case-studies/content/baidu-2.png)

#### Unifying the business logic of the Wonder App

In November 2021, we developed and launched the first feature in the Wonder App using Kotlin Multiplatform Mobile technology – the "Surf" channel.

![The Wonder "Surf" channel](/images/case-studies/content/baidu-3.png)

As an initial experiment in a real business scenario, we only unified the data model, RESTful API requests, JSON data parsing, and KV caching logic in the data layer in order to minimize the impact on the app’s existing functionality.

During the subsequent development process, we tried to apply the MVI design pattern to unify part of the interface logic, so that the low-level data, the processing logic, and the UI processing logic would be unified across both the iOS and Android apps. The functional experiences of both the iOS and the Android app were aligned to a certain extent, and the amount of shared code greatly increased, which significantly reduced the development and maintenance costs.

In addition, we internally developed a series of Gradle plugins based on the Kotlin Multiplatform Mobile project, integrating and streamlining the complex configuration of Kotlin Multiplatform Mobile modules, binary product releases, the framework's interactive configuration, etc. As a result, the Kotlin Multiplatform Mobile modules can now easily interact with the technology and business components we have built on both iOS and Android, reducing the necessity to rebuild various elements.

### Benefits

Currently, the Wonder App uses Kotlin Multiplatform Mobile technology to unify the business logic of multiple modules, covering multiple core business scenarios while retaining the excellent user experience of the native UI. The integration of Kotlin Multiplatform Mobile technology has truly unified the business logic for both iOS and Android development, reducing the cost of checking and maintaining it, and significantly improving productivity.

![Baidu picture](/images/case-studies/content/baidu-4.png)

We also set up a Kotlin Multiplatform Mobile team responsible for the development of the unified business logic in the Wonder App. They collaborate with the existing iOS, Android, and frontend teams to ensure alignment across different platforms. At the same time, we continue to monitor the latest developments in Kotlin Multiplatform Mobile technology in order to optimize the performance and quality of functional modules developed with Kotlin Multiplatform Mobile, and continuously improve the common infrastructure capabilities based on Kotlin Multiplatform Mobile in the Wonder App.

### Problems encountered when using Kotlin Multiplatform Mobile

**Debugging problems on the iOS platform**

When using Android Studio to execute Kotlin Multiplatform Mobile code compiled on iOS in a single step, it can be difficult to find the values of variables. Also, we can currently only debug by printing logs. As the iOS project grows, the compilation speed also slows down gradually, which can impact the efficiency of iOS debugging.

*ℹ️ [Learn more about the Xcode-Kotlin plugin](https://github.com/touchlab/xcode-kotlin) , which brings a smoother development and integration experience for iOS developers using shared Kotlin code.*

**Kotlin Native multithreading issues**

Kotlin Native has a very strict memory model for object sharing between multiple threads, requiring all variables shared between multiple threads to be frozen. In the early stages of researching Kotlin Multiplatform Mobile technology, we were often stumped by the crashes caused by `InvalidMutabilityException`. [The New Memory Manager](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/NEW_MM.md) is said to optimize such problems, and we hope the Kotlin team will fix this issue soon.

*ℹ️ [Learn more about the new Kotlin/Native memory manager](https://blog.jetbrains.com/kotlin/2021/08/try-the-new-kotlin-native-memory-manager-development-preview/) , which  lifts the existing restrictions on object sharing between threads and provides fully leak-free concurrent programming primitives that are safe and don’t require any special management or annotations from the developers.*

**iOS framework volume problem**

Kotlin Multiplatform Mobile requires a lightweight built-in runtime for when the app is first connected to the Kotlin Multiplatform Mobile module. Even if nothing is done after connecting, it can still take up 2MB in volume, so users should be aware of that.

We also implemented the same logic (data entity field definitions and JSON parsing) using native Swift and Kotlin Multiplatform Mobile during development, and compared the LinkMap files after archiving. We found out that if we use the [Kotlin Serialization](https://github.com/Kotlin/kotlinx.serialization) annotation to automate JSON parsing, the volume of the framework generated by Kotlin Multiplatform Mobile will be several times larger than that of Swift!

I hope the issues raised above will help other developers who want to use or are currently using Kotlin Multiplatform Mobile technology, and I hope that the Kotlin team can gradually fix the problems mentioned above.

### Conclusion

In conclusion, using Kotlin Multiplatform Mobile technology in the Wonder App has resulted in the unification of the data layer, enabled us to use one set of Kotlin code for both iOS and Android development, unified the business logic of key features, and ensured the consistency in experiences on both ends. In the future, we will also apply Kotlin multiplatform technology in more widely known Baidu mobile application products such as [Baidu](http://mo.baidu.com/). We’d like to thank the Kotlin team for all their contributions, and wish them all the best for the continued development of Kotlin multiplatform technology!

### Contacts

<a href="https://github.com/yuanguozheng" class="wt-link" target="_blank" rel="noreferrer noopener">Yuan Guozheng</a>, Mobile Software Engineer at Baidu


<a href="https://medium.com/@yuanguozheng/kmm-in-wonder-app-from-baidu-d5073caf8156" class="wt-link" rel="noopener noreferrer" target="_blank">Original article  ↗</a>