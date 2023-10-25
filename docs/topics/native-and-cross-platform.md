[//]: # (title: Native and cross-platform app development: how to choose?)

[//]: # (description: When choosing between native and cross-platform app development, consider these six key things and pick the best solution for your next app.)

People spend much of their waking time on their mobile devices. They also [spend 4.8 hours per day on mobile applications](https://www.data.ai/en/insights/market-data/state-of-mobile-2022/), which makes them attractive to all kinds of businesses.

Mobile app development is constantly evolving, with new technologies and frameworks emerging every year. With various solutions on the market, it's often difficult to choose between them. You might have heard about the long-standing "native versus cross-platform" debate.

There are many factors to consider before building an app, such as development cost, time, and app functionality. This is especially true if you want to target both Android and iOS audiences. It may be challenging to decide which mobile development approach will be the best for your particular project. To help you choose between native and cross-platform app development, we've created a list of six essential things to keep in mind.

## What is native mobile app development?

Native mobile development means that you build an app for a particular mobile operating system – in most cases Android or iOS. While working on native applications, developers use specific programming languages and tools. For example, you can create a native Android application with Kotlin or Java, or build an app for iOS with Objective-C or Swift.

Here are the core benefits and limitations.

| **Benefits**                                                                                                                                                                                                                                                                                                            | **Limitations**                                                                                                                                                                                                  |
|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **High performance.** The core programming language and APIs used to build native apps make them fast and responsive.                                                                                                                                                                                                   | **High cost.** Native app development requires two separate teams with different sets of skills, which adds to the time and cost of the development process.                                                     |
| **Intuitive user experience.** Mobile engineers develop native apps using native SDKs, which makes the UI look consistent. The interfaces of native apps are designed to work well with a specific platform, which makes them feel like an integrated part of the device and provides a more intuitive user experience. | **Big development team.** Managing large teams of multiple specialists can be challenging. The more people you have working on one project, the greater the effort required for communication and collaboration. |
| **Access to the full feature set of a particular device.** Native apps built for a particular operating system have direct access to the device's hardware, such as camera, microphone, and GPS location support.                                                                                                       | **More errors in code.** More lines of code can leave more room for bugs.                                                                                                                                        |
| |**Risks of having different logic on Android and iOS apps.** With native app development, the code written for one mobile platform cannot be tailored to another platform. For instance, Android and iOS apps might show different prices for the same item because of a mistake in the way the discount is calculated.|

## What is cross-platform app development?

Cross-platform app development, also called multiplatform development, is the process of building mobile apps that are compatible with several operating systems. Instead of creating separate applications for iOS and Android, mobile engineers can share some or all of the source code between multiple platforms. This way, the applications will work the same on both iOS and Android.

There are various open-source frameworks for [cross-platform mobile app development](cross-platform-mobile-development.md) available today. Some of the most popular are Flutter, React Native, and Kotlin Multiplatform Mobile. Below are some of the key pros and cons.

|**Benefits**|**Limitations**|
| ---- | --- |
|**Shareable code.** Developers create a single codebase without the need to write new code for each OS.|**Performance issues.** Some developers argue that the performance of multiplatform applications is low compared to native apps.|
|**Faster development.** You don't need to write or test as much code, which can help you accelerate the development process.|**Difficult to access native features of mobile devices.** Building a cross-platform app that needs to access platform-specific APIs requires more effort.|
|**Cost-effectiveness.** The cross-platform solution can be a good option to consider for startups and companies with smaller budgets because it allows them to reduce development costs.|**Limited UI consistency.** With cross-platform development frameworks that allow you to share the UI, applications may look and feel less native.|
|**New work opportunities.** You can attract new talent to your team with modern cross-platform technologies in a product's tech stack. Many developers want to tackle new challenges at work, which is why new technologies and tasks tend to increase developers' motivation and enjoyment while working.|**Challenging hiring process.** It can be harder to find professionals who can build multiplatform apps, compared to native app developers. For example, while writing this article, we found about 2,400 Android developer jobs versus 348 Flutter developer vacancies on Glassdoor. However, this situation may change as cross-platform technologies continually evolve and attract more mobile engineers.|
|**Shared logic.** Because this approach involves using a single codebase, you can be sure that you have the same application logic on different platforms.| |  

These are just a few of the key advantages of cross-platform app development. You can learn more about its benefits and use cases from global companies in our article about [cross-platform mobile development](cross-platform-mobile-development.md). As for the challenges of the approach – we'll discuss those in the following section.

### Debugging some popular myths about cross-platform app development 

Multiplatform technology is constantly evolving. Some cross-platform development frameworks like [Kotlin Multiplatform Mobile](https://kotlinlang.org/lp/multiplatform/) provide the benefits of building both cross-platform and native apps and remove the limitations that are commonly associated with the approach.

#### 1. Cross-platform apps provide poorer performance than native apps.

Poor performance was long considered to be one of the main disadvantages of multiplatform applications. However, the performance and quality of your product largely depend on the tools you use to build the app. The latest cross-platform frameworks provide all the tools necessary to develop apps with a native-like user experience.

By using different compiler backends, [Kotlin](multiplatform.md#code-sharing-between-platforms) is compiled to platform formats – JVM bytecode for Android and native binaries for iOS. As a result, the performance of your shared code is the same as if you write them natively.

#### 2. Cross-platform frameworks are unsafe.

There's a common misconception that native apps are much more secure and reliable. However, modern cross-platform development tools allow developers to build safe apps that guarantee reliable data protection. Mobile engineers just need to [take additional measures to make their apps secure](https://appstronauts.co/blog/are-cross-platform-apps-as-fast-and-secure-as-native-apps/#:~:text=Unsecurity%20of%20cross%2Dplatform%20apps,a%20cross%2Dplatform%20app%27s%20code.).

#### 3. Cross-platform apps don't have access to all native functions of mobile devices.

It is true that not all cross-platform frameworks allow you to build apps with full access to the device's features. Nevertheless, some modern multiplatform frameworks can help you overcome this challenge. For example, Kotlin Multiplatform Mobile gives easy access to Android and iOS SDKs. It provides a [Kotlin mechanism of expected and actual declarations](multiplatform-expect-actual.md) to help you access the device's capabilities and features.  

#### 4. It can often be difficult to manage cross-platform projects.

In fact, it's the opposite. Cross-platform solutions help you more effectively manage resources. Your development teams can learn how to write and reuse shared code. Android and iOS developers can achieve high efficiency and transparency by interacting and sharing knowledge.

## Six key aspects to help you choose between cross-platform app development and the native approach

Now, let's take a look at important factors you need to consider when choosing between native and cross-platform solutions for mobile app development.

#### 1. The type and purpose of your future app

One of the first steps is understanding what app you will be building, including its features and purpose. A complex application with many features will require a lot of programming, especially if it's something new that doesn't have any existing templates.

How crucial is the user interface of your app? Are you looking for outstanding visuals or is the UI less important? Will it require any specific hardware functionality and access to camera and GPS location support? You need to make sure the mobile development approach you choose provides the necessary tools to build the app you need and provide a great user experience.

#### 2. Your team's experience in programming languages and tools

The developers on your team should have enough experience and expertise to work with particular frameworks. Pay close attention to what programming skills and languages the development tools require.

For example, developers need to know Objective-C or Swift to create native apps for iOS, and they need to know Kotlin or Java for Android. The cross-platform framework Flutter requires knowledge of Dart. If you use Kotlin Multiplatform Mobile, Kotlin syntax is easy for iOS developers to learn because it follows concepts similar to Swift.

#### 3. Long-term viability

When choosing between different approaches and frameworks, you need to be confident that the platform vendor will continue supporting it over the long term. You can dig into the details about the provider, the size of their community, and adoption by global companies. For example, Kotlin Multiplatform Mobile was developed by JetBrains, Flutter by Google, and React Native by Facebook. 

#### 4. Development cost and your budget

As mentioned above, different mobile development solutions and tools come with different expenses. Depending on how flexible your budget is, you can choose the right solution for your project.

#### 5. Adoption in the industry 

You can always find out what other experts in the tech community are saying about different approaches. Reddit, StackOverflow, and Google Trends are a few good resources. Just take a look at search trends for the following two terms: "native mobile development" versus "cross-platform mobile development". Many users are still interested in learning about native app development, but it also seems like the cross-platform approach is gaining popularity.

![Native mobile development in Google Trends](native-mobile-development.png){width=700}

![Cross-platform mobile development in Google Trends](cross-platform-mobile-development.png){width=700}

If a technology is widely used by professionals, it has a strong ecosystem, many libraries, and best practices from the tech community, which makes development faster.

#### 6. Visibility and learning resources

If you're considering trying cross-platform app development, one of the factors you should consider is how easy it is to find learning materials for the different multiplatform frameworks. Check their official documentation, books, and courses. Be sure they provide a [product roadmap](https://blog.jetbrains.com/kotlin/2022/06/what-to-expect-from-the-kotlin-team-in-202223/) with long-term plans.   

## When should you choose cross-platform app development?

Cross-platform solutions for mobile app development will save you time and effort when building applications for both Android and iOS.

In a nutshell, you should to opt for cross-platform solutions if:

* You need to build an app for both Android and iOS.
* You want to optimize development time.
* You want to have a single codebase for the app logic while keeping full control over UI elements. Not all cross-platform frameworks allow you to do this, but some, like Kotlin Multiplatform Mobile, provide this capability.
* You're eager to embrace a modern technology that continues to evolve.

> Share the logic of your iOS and Android apps. See [Kotlin Multiplatform Mobile](multiplatform-mobile-getting-started.md) in action.
>
{type="note"}

## When should you choose native app development?

There may be a few specific cases when it makes sense to choose native mobile development. You should choose this approach if:

* Your app is targeting one specific audience – either Android or iOS.
* The user interface is critical to your future application. However, even if you take the native approach, you can try using multiplatform mobile app development solutions that allow you to share app logic, but not the UI, for your project.
* Your team is equipped with highly skilled Android and iOS developers, but you don't have time to introduce new technologies.

### Takeaways

Keep in mind all the aspects described above, your project's goals, and the end user. Whether you're better off with native or cross-platform development depends on your unique needs. Each solution has its strengths and weaknesses. 

Nevertheless, keep an eye on what happens in the community. Knowing the latest mobile development trends will help you make the best choice for your project.



