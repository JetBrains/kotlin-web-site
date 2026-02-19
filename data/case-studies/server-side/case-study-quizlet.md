---
id: "case-study-quizlet"
slug: "quizlet"
title: "Quizlet"
country: "Quizlet is headquartered in San Francisco, CA, USA with additional offices in Denver, CO, USA and London, England, UK."
size: "150"
industry: "Consumer learning technology"
---

<a href="http://quizlet.com" target="_blank" rel="noreferrer noopener">Quizlet ↗</a> is a global learning platform that provides engaging study tools to help people practice and master whatever they are learning.

Every month, over 50 million students, teachers and everyday
people use Quizlet to study any subject imaginable for school,
work or as part of their personal interests. Combining cognitive
science and machine learning, Quizlet guides students through
adaptive study activities to confidently reach their learning
goals.

Quizlet is used in over 130 countries and is available in 19
languages. As the largest user-generated learning platform, people
can choose from over 400 million study sets on Quizlet or create
their own, and immediately begin studying across Quizlet’s
activities for free. In fact, over a billion questions are
answered on Quizlet each week.

Our Android app has over 10 million active installations as per the <a href="https://play.google.com/store/apps/details?id=com.quizlet.quizletandroid" target="_blank" rel="noopener noreferrer">Google Play Store ↗</a>. Our iOS app is a top 10 Education app on the App Store.

## Why Kotlin — Options for Shared Code

To power the unique use cases for our rapidly growing userbase, we had to go beyond simply querying a database, throwing things into a UI, picking a random element, and using String-comparisons to assess if a user answered a question correctly.

Quizlet began writing more advanced code:
- standardized analytics events to help track learning outcomes
- a context-dependent grading rule engine to go beyond simple string comparisons
- <a href="https://medium.com/tech-quizlet/spaced-repetition-for-all-cognitive-science-meets-big-data-in-a-procrastinating-world-59e4d2c8ede1" target="_blank" rel="noopener noreferrer">modeling the user’s brain to generate questions designed to help them retain information better</a>

## What were the Alternatives?

### Javascript

We originally decided to reuse the logic we had already written for our web codebase by sharing Javascript code:

![Quizlet Scheme](/images/case-studies/content/quizlet-1.png)

This was relatively straightforward to throw together on iOS using an official Apple framework called JavaScriptCore. <a href="https://developer.apple.com/documentation/javascriptcore" rel="noopener noreferrer" target="_blank">JavaScriptCore</a> powers Safari on iOS, is maintained by Apple, and behaves consistently across devices.

Initially, we attempted the same approach on Android using the official <a href="https://developer.android.com/reference/android/webkit/WebView#evaluateJavascript(java.lang.String,%20android.webkit.ValueCallback%3Cjava.lang.String%3E)" target="_blank" rel="noopener noreferrer">WebView::evaluateJavascript</a> API.
With this approach, we ran into several issues with performance, stability, and variance across manufacturer implementations. <a href="https://medium.com/tech-quizlet/comparison-shopping-searching-for-javascript-engines-for-android-bdc656538f2e" target="_blank" rel="noopener noreferrer">In a blog post from 2016</a>,
we detail how we evaluated several external third-party JavaScript engines before deciding on the <a href="https://github.com/eclipsesource/J2V8" target="_blank" rel="noopener noreferrer">J2V8</a> library for Android.

While web browsers are of course tailor-made to run JavaScript, relying on JavaScriptCore/J2V8 on iOS/Android raised significant issues:
- Relying on disk I/O to load the initial JS files, building and retaining a reference to an entire JavaScript context, and then having to marshal “real” objects to/from JavaScript in order to interact with the code resulted in huge performance issues and memory leaks
- Unlike actual native code, interacting with untyped objects that are passed to/from JavaScript contexts was disastrously error-prone, without any compile-time safety
- Since none of the shared code was being run in the standard mobile runtime, debuggability was also an issue once crashes inevitably occurred.
- On Android, the J2V8 library caused our APK size to almost double


All-told, these issues resulted in an ecosystem where frontend web developers might have felt did not feel comfortable consuming it (let alone writing it themselves).


Despite these issues, shared JavaScript allowed us to write our most critical business logic in one place, ship it across multiple platforms, and unblock our resource-constrained native mobile teams. Most importantly, we were able to do this without committing to writing our entire client with the same framework.

### Other Alternatives

We explored React Native, but were more constrained by rewriting our complex business logic than we were on being able to iterate rapidly on user interfaces. The tradeoffs to user and developer experience weren’t worth it.

We also explored shared code via C++/Rust/Go, but had already ran into debugging and marshalling issues with the JNI on Android with J2V8, and most of our frontend web code is written assuming this logic runs client-side which becomes tricky with these technologies.

## Deciding on Kotlin Multiplatform
What caught our attention was how Kotlin Multiplatform’s unique approach addresses many of the issues we had with the other methods of sharing code that we explored.

Namely
- performance
- error-proneness
- developer satisfaction

By generating actual Objective-C Frameworks, JavaScript files, and Java bytecode, Kotlin Multiplatform promises the ability to write code in Kotlin and have it run in each platform’s native runtime.

![Quizlet Scheme](/images/case-studies/content/quizlet-2.png)

### Benefits
Though it was excellent to see that Kotlin Multiplatform has well-supported <a href="https://ktor.io/" target="_blank" rel="noopener noreferrer">networking</a>, <a href="https://github.com/cashapp/sqldelight" target="_blank" rel="noopener noreferrer">persistence</a>, and <a href="https://github.com/Kotlin/kotlinx.serialization" target="_blank" rel="noopener noreferrer">serialization</a> libraries, none of these were necessary to support Quizlet’s shared business logic.

Kotlin Multiplatform eliminates the most problematic areas of our Shared JavaScript approach: the bridge layer and external runtime requirement. While other technologies (such as shared C++, Rust, or Go) might have foregone the external runtime requirement, they still rely on brittle bridging layers.

As mentioned earlier, the shared code interop area traditionally relies on manual type declarations, loss of type-safety, and a considerable performance hit when marshaling between types on mobile clients. Kotlin Multiplatform on the other hand, generates type-safe/null-safe code for our mobile clients. Our Android client can treat Kotlin Multiplatform code the same way it treats all Kotlin code. Our iOS client can safely create instances of Kotlin classes as if they were written in Objective-C.

Performance on both Android and iOS in key areas using shared code was drastically improved when compared to our previous Shared Javascript approach. On iOS, we had over 25x faster grading performance than using JavascriptCore. On Android, we had an average improvement of:

- 1.5s off of J2V8 initialization time,
- 50x faster performance when calling into the shared code due to bypassing data marshalling
- 5x faster runtime of shared code itself

APK size on Android dropped from 18MB to 10MB once we were able to remove the J2V8 runtime. Web bundle size increased by 30Kb after dead-code-elimination was applied, but that was acceptable.

Furthermore, Kotlin is a modern language, with established tooling, and great IDE support: It is after all, designed by an IDE company!

Quizlet’s Android, iOS, and backend engineers are more eager to write and maintain code written in Kotlin rather than JavaScript. After playing around with the interactive <a href="https://play.kotlinlang.org/byExample/overview" target="_blank">“Kotlin by Example” section on the Kotlin website</a>, even our frontend web engineers found themselves impressed by Kotlin.

### Pains
- Increasing Kotlin knowledge across our engineering organization (less of an issue now that we are also using Kotlin for backend services!)
- Developing workflows to publish, consume, and debug iOS and Web artifacts
- Missing Typescript definitions for enums in Kotlin 1.4’s new JS IR (<a href="https://youtrack.jetbrains.com/issue/KT-37916" target="_blank">although JetBrains is working on this!</a>)
- Navigating differences in Kotlin types on <a href="/docs/reference/js-to-kotlin-interop.html#representing-kotlin-types-in-javascript" target="_blank">JavaScript</a> and <a href="/docs/reference/native/objc_interop.html#mappings" target="_blank">iOS</a> when validating inputs
- Javascript not supporting ES6+ means that we have to use Kotlin DCE instead of standard webpack tree-shaking
- Having to pass through Objective-C to consume from Swift means that we lose access to features that both Kotlin and Swift support like “real” enums
- iOS exception handling is a little finicky because it requires manual handling

## Advice
### Clean interfaces are crucial.
Writing code with clear interface boundaries made it much easier to extract later. By isolating our vital business logic from regular application code, we were able to share this logic across applications.

### Aggressively validate inputs along the public API.
It’s easy for misunderstandings about the meanings of parameters to arise in a complex module. This is doubly true when the module is used by many people who may have never talked directly to each other. Aggressively validating for unexpected input, especially in a loosely-typed language like JavaScript, helps minimize issues due to miscommunication or under-documentation.

### Practice Test-Driven Development.
Test Driven Development (TDD) pays extra dividends with shared code. TDD is nearly always a great way to build software, but it is especially well-suited for shared modules with little dependence on external state.

Particularly with shared code, investing in TDD:

- Minimizes time spent debugging the final artifact within a host client, which tends to be more difficult than debugging purely native code.
- Minimizes the number of times we have to have to recompile/repackage shared code for inclusion into a client due to implementation errors. This multi-step processes can be awkward and takes more time than working entirely in a native environment.
- Gives us extra confidence in the shared code we write, preventing issues that have ripple effects across multiple host apps.

### Complex state machines and rule engines are ideal candidates.
Compared to user interfaces, persistence, or networking, state machines and rule engines are incredibly well-suited for shared code. This isn’t to say networking and persistence are bad candidates for shared code: they just have additional complications to work around.

By focusing our shared code efforts on code based around state management and control flow, we saved our engineering team countless person-hours with minimal time spent on cross-platform threading or concurrency concerns.

![](/images/case-studies/content/quizlet-3.svg)

<p>
  By generating actual Objective-C Frameworks, JavaScript files, and
  Java bytecode, Kotlin Multiplatform promises the ability to write
  code in Kotlin and have it run in each platform’s native runtime.
</p>

<p>Ankush Gupta, Staff Software Engineer, Quizlet</p>

## Contacts and Links

### Relevant Links

- Our blog post: <a href="https://medium.com/tech-quizlet/shared-code-at-quizlet-kotlin-multiplatform-2ee1b57646c?source=friends_link&amp;sk=f7c864464fe94552ed208e96b8a897f5" target="_blank" rel="noopener noreferrer">Shared Code at Quizlet: Deciding on Kotlin Multiplatform</a>
- Corresponding talk at droidcon San Francisco 2019: <a href="https://www.droidcon.com/media-detail?video=380848881" target="_blank" rel="noopener noreferrer">Powering Worldwide Learning with Kotlin Multiplatform</a>

### Contacts

Ankush Gupta,
Staff Software Engineer — <a href="mailto:ankush@quizlet.com">ankush@quizlet.com</a>
(<a href="https://twitter.com/ankushg" target="_blank" rel="noopener noreferrer">@ankushg</a> on Twitter)

Brandon Chinn,
Director of Engineering — <a href="mailto:brandon@quizlet.com">brandon@quizlet.com</a>
