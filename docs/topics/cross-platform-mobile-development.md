[//]: # (title: What is cross-platform mobile development?)

[//]: # (description: Cross-platform mobile development helps you save much time and effort. See why many developers have already switched to technology that is cost efficient.)

Nowadays, many companies are facing the challenge of needing to build mobile apps for multiple platforms, specifically for both Android and iOS. This is why cross-platform mobile development solutions have emerged as one of the most popular software development trends.

According to Statista, there were 3.48 million mobile apps available on the Google Play Store and 2.22 million apps on the App Store in the first quarter of 2021, with Android and iOS now accounting for [99% of the worldwide mobile operating system market](https://gs.statcounter.com/os-market-share/mobile/worldwide).

How do you go about creating a mobile app that can reach Android and iOS audiences? In this article, you will find out why more and more mobile engineers are choosing a cross-platform, or multiplatform, mobile development approach.

## Cross-platform mobile development: definition and solutions

Multiplatform mobile development is an approach that allows you to build a single mobile application that runs smoothly on several operating systems. In cross-platform apps, some or even all of the source code can be shared. This means that developers can create and deploy mobile assets that work on both Android and iOS without having to recode them for each individual platform.

### Different approaches to mobile app development

There are four main ways to create an application for both Android and iOS.

#### 1. Separate native apps for each operating system

When creating native apps, developers build an application for a particular operating system and rely on tools and programming languages designed specifically for one platform: Kotlin or Java for Android, Objective-C or Swift for iOS.

These tools and languages give you access to the features and capabilities of a given OS and allow you to craft responsive apps with intuitive interfaces. But if you want to reach both Android and iOS audiences, you will have to create separate applications, and that takes a lot of time and effort.

#### 2. Progressive web apps (PWAs)

Progressive web apps combine the features of mobile apps with solutions used in web development. Roughly speaking, they offer a mix of a website and a mobile application. Developers build PWAs using web technologies, such as JavaScript, HTML, CSS, and WebAssembly.

Web applications do not require separate bundling or distribution and can be published online. They are accessible via the browser on your computer, smartphone, and tablet, and don't need to be installed via Google Play or the App Store.

The drawback here is that a user cannot utilize all of their device's functionality, for example, contacts, calendars, the phone, and other assets, which results in a limited user experience. In terms of app performance, native apps have the lead.

#### 3. Cross-platform apps 

As mentioned earlier, multiplatform apps are designed to run identically on different mobile platforms. Cross-platform frameworks allow you to write shareable and reusable code for the purpose of developing these apps.

This approach has several benefits, such as efficiency with respect to both time and cost. We'll take a closer look at the pros and cons of cross-platform mobile development in a later section.

#### 4. Hybrid apps

When browsing websites and forums, you may notice that some people use the terms _"cross-platform mobile development"_ and _"hybrid mobile development"_ interchangeably. Doing so, however, is not entirely accurate.

When it comes to cross-platform apps, mobile engineers can write code once and then reuse it on different platforms. Hybrid app development, on the other hand, is an approach that combines native and web technologies. It requires you to embed code written in a web development language like HTML, CSS, or JavaScript into a native app. You can do this with the help of frameworks, such as Ionic Capacitor and Apache Cordova, using additional plugins to get access to the native functionalities of platforms.

The only similarity between cross-platform and hybrid development is code shareability. In terms of performance, hybrid applications are not on par with native apps. Because hybrid apps deploy a single code base, some features are specific to a particular OS and don't function well on others.

### Native or cross-platform app development: a longstanding debate

[The debate around native and cross-platform development](native-and-cross-platform.md) remains unresolved in the tech community. Both of these technologies are in constant evolution and come with their own benefits and limitations.

Some experts still prefer native mobile development over multiplatform solutions, identifying the stronger performance and better user experience of native apps as some of the most important benefits.

However, many modern businesses need to reduce the time to market and the cost of per platform development while still aiming to have a presence both on Android and iOS. This is where cross-platform development frameworks like [Kotlin Multiplatform Mobile](https://kotlinlang.org/lp/multiplatform/) can help, as David Henry and Mel Yahya, a pair of senior software engineers from Netflix, [note](https://netflixtechblog.com/netflix-android-and-ios-studio-apps-kotlin-multiplatform-d6d4d8d25d23):

> The high likelihood of unreliable network connectivity led us to lean into mobile solutions 
> for robust client side persistence and offline support. The need for fast product delivery 
> led us to experiment with a multiplatform architecture. Now we're taking this one step further 
> by using Kotlin Multiplatform to write platform agnostic business logic once in Kotlin 
> and compiling to a Kotlin library for Android and a native Universal Framework for iOS.
>
{type="tip"}

## Is cross-platform mobile development right for you?

Choosing a mobile development approach that is right for you depends on many factors, like business requirements, objectives, and tasks. Like any other solution, cross-platform mobile development has its pros and cons.

### Benefits of cross-platform development 

There are plenty of reasons businesses choose this approach over other options.

#### 1. Reusable code

With cross-platform programming, mobile engineers don't need to write new code for every operating system. Using a single codebase allows developers to cut down on time spent doing repetitive tasks, such as API calls, data storage, data serialization, and analytics implementation.

In our Kotlin Multiplatform survey from Q3-Q4 2021, we asked the Kotlin community about the parts of code they were able to share between different platforms.

![Parts of code Kotlin Multiplatform Mobile users can share between platforms](survey-results-q1-q2-22.png){width=700}

#### 2. Time savings

Due to code reusability, cross-platform applications require less code, and when it comes to coding, less code is more. Time saved is because you do not have to write as much code. Additionally, with fewer lines of code, there are fewer places for bugs to emerge, resulting in less time spent testing and maintaining your code.

#### 3. Effective resource management

Building separate applications is expensive. Having a single codebase helps you effectively manage your resources. Both your Android and your iOS development teams can learn how to write and use shared code.

#### 4. Attractive opportunities for developers

Many mobile engineers view modern cross-platform technologies as desirable elements in a product's tech stack. Developers may get bored at work due to repetitive and routine tasks, such as JSON parsing. However, new technologies and tasks can bring back their excitement, motivation, and joy for work tasks. This means that having a modern tech stack can actually simplify the hiring process for your mobile team.

#### 5. Opportunity to reach wider audiences

You don't have to choose between different platforms. Since your app is compatible with multiple operating systems, you can satisfy the needs of both Android and iOS audiences and maximize your reach.

#### 6. Quicker time to market and customization

Since you don't need to build different apps for different platforms, you can develop and launch your product much faster. What's more, if your application needs to be customized or transformed, it will be easier for programmers to make small changes to specific parts of your codebase. This will also allow you to be more responsive to user feedback.

### Challenges of a cross-platform development approach

All solutions come with their own limitations. What issues might you encounter with cross-platform programming? Some individuals in the tech community argue that multiplatform development still struggles with glitches related to performance. Furthermore, project leads might have fears that their aim to optimize the development process will have a negative impact on the user experience of an application. However, with improvements to the technologies, cross-platform solutions are becoming increasingly stable, adaptable, and flexible.

In our [Kotlin Multiplatform survey from Q1-Q2 2021](https://blog.jetbrains.com/kotlin/2021/10/multiplatform-survey-q1-q2-2021/), we asked survey participants whether they were satisfied with the quality of their apps after adopting Kotlin Multiplatform Mobile. When asked whether they were satisfied with their apps' performance, binary size, and appearance, as many as 98.3% of respondents answered positively.

![How are users satisfied with the quality of their app after Kotlin Multiplatform Mobile adoption?](survey-results-q1-q2-21.png){width=700}

Another concern is the inability to seamlessly support the native features of applications. Nevertheless, if you're building a multiplatform app that needs to access platform-specific APIs, you can use Kotlin's [expected and actual declarations](multiplatform-expect-actual.md). They allow you to define in common code that you "expect" to be able to call the same function across multiple platforms and provide the "actual" implementations, which can interact with any platform-specific libraries thanks to Kotlin interoperability with Java and Objective-C/Swift.

These issues raise the question of whether the end-user will notice a difference between native and cross-platform apps.

As modern multiplatform frameworks continue to evolve, they increasingly allow mobile engineers to craft a native-like experience. If an application is well written, the user will not be able to notice the difference. However, the quality of your product will heavily depend on the cross-platform app development tools you choose.

## The most popular cross-platform solutions

[The most popular cross-platform frameworks](cross-platform-frameworks.md) include Flutter, React Native, and Kotlin Multiplatform Mobile. Each of these frameworks has its own capabilities and strengths. Depending on the tool you use, your development process and the outcome may vary.

### Flutter

Flutter is a cross-platform development framework that was created by Google and uses the Dart programming language. Flutter supports native features, such as location services, camera functionality, and hard drive access. If you need to create a specific app feature that's not supported in Flutter, you can write platform-specific code using the [Platform Channel technology](https://brightmarbles.io/blog/platform-channel-in-flutter-benefits-and-limitations/).

Apps built with Flutter need to share all of their UX and UI layers, which is why they may not always feel 100% native. One of the best things about this framework is its Hot Reload feature, which allows developers to make changes and view them instantly.

This framework may be the best option in the following situations:

* You want to share UI components between your apps but you want your applications to look close to native.
* The app is expected to put a heavy load on CPU/GPU.
* You need to develop an MVP application.

Among the most popular apps built with Flutter are Google Ads, Xianyu by Alibaba, eBay Motors, and Hamilton.

### React Native

Facebook introduced React Native in 2015 as an open-source framework designed to help mobile engineers build hybrid native/cross-platform apps. It's based on ReactJS – a JavaScript library for building user interfaces. In other words, it uses JavaScript to build mobile apps for Android and iOS systems.

React Native provides access to several third-party UI libraries with ready-to-use components, helping mobile engineers save time during the development process. Like Flutter, it allows you to see all your changes immediately, thanks to the Fast Refresh feature.

You should consider using React Native for your app in the following cases:

* Your application is relatively simple and is expected to be lightweight.
* The development team is fluent in JavaScript or React.

Applications built with React Native include Facebook, Instagram, Skype, and Uber Eats.

### Kotlin Multiplatform Mobile

Kotlin Multiplatform Mobile is an SDK for cross-platform mobile development provided by JetBrains. It allows you to create Android and iOS apps with shared logic. Its key benefits include:

* Smooth integration with existing projects.
* Full control over the UI, along with the ability to use the latest UI frameworks, such as SwiftUI and Jetpack Compose.
* Easy access to Android and iOS SDKs without any restrictions.

> Share the logic of your iOS and Android apps. Get started with [Kotlin Multiplatform](https://www.jetbrains.com/help/kotlin-multiplatform-dev/multiplatform-getting-started.html).
>
{type="note"}

Global companies and start-ups alike have already leveraged Kotlin Multiplatform Mobile to optimize and accelerate their mobile development efforts. The benefits of this approach are apparent from the stories of the companies that have already adopted it.

* The development team from the award-winning to-do list app Todoist started using Kotlin Multiplatform Mobile to synchronize their app's sorting logic on multiple platforms, and in doing so they combined the benefits of creating cross-platform and native apps. You can learn more about their experience in this [video](https://www.youtube.com/watch?v=z-o9MqN86eE).
* The introduction of Kotlin Multiplatform allowed Philips to [become faster at implementing new features](https://kotlinlang.org/lp/multiplatform/case-studies/philips) and increased the interaction between their Android and iOS developers.
* Shopify was able to use Kotlin Multiplatform to [share an astounding 95% of their code](https://shopify.engineering/managing-native-code-react-native), which also delivered a significant performance improvement. Similarly, the startup company Down Dog is using Kotlin Multiplatform to [increase the development speed for the apps](https://kotlinlang.org/lp/multiplatform/case-studies/down-dog) by maximizing the amount of code shared between all the platforms: JVM, Native, and JS.

## Conclusion

As cross-platform development solutions continue to evolve, their limitations have begun to pale in comparison to the benefits they provide. A variety of technologies are available on the market, all suited to different sets of workflows and requirements.  Each of the tools discussed in this article offers extensive support for teams thinking about giving cross-platform a try. 

Ultimately, carefully considering your specific business needs, objectives, and tasks, and developing clear goals that you want to achieve with your app, will help you identify the best solution for you.
