[//]: # (title: FAQ)
[//]: # (description: Kotlin is a concise multiplatform programming language developed by JetBrains.)

### What is Kotlin?

Kotlin is an open-source statically typed programming language that targets the JVM, Android, JavaScript, Wasm, and Native. 
It's developed by [JetBrains](https://www.jetbrains.com). The project started in 2010 and was open source from very early on.
The first official 1.0 release was in February 2016. 

### What is the current version of Kotlin?

The currently released version is %kotlinVersion%, published on %kotlinReleaseDate%.  
You can find more information [on GitHub](https://github.com/jetbrains/kotlin).

### Is Kotlin free?

Yes. Kotlin is free, has been free and will remain free. It is developed under the Apache 2.0 license, and the source code
is available [on GitHub](https://github.com/jetbrains/kotlin).

### Is Kotlin an object-oriented language or a functional one?

Kotlin has both object-oriented and functional constructs. You can use it in both OO and FP styles, or mix elements of the two. 
With first-class support for features such as higher-order functions, function types, and lambdas, Kotlin is a great choice
if you're doing or exploring functional programming.

### What advantages does Kotlin give me over the Java programming language?

Kotlin is more concise. Rough estimates indicate approximately a 40% cut in the number of lines of code. 
It's also more type-safe – for example, support for non-nullable types makes applications less prone to NPE's. 
Other features including smart casting, higher-order functions, extension functions, and lambdas with receivers provide 
the ability to write expressive code as well as facilitating creation of DSL.
 
### Is Kotlin compatible with the Java programming language?

Yes. Kotlin is 100% interoperable with the Java programming language, and major emphasis has been placed on making sure
that your existing codebase can interact properly with Kotlin. You can easily [call Kotlin code from Java](java-to-kotlin-interop.md) and [Java code
from Kotlin](java-interop.md). This makes adoption much easier and lower-risk. There's also an automated [Java-to-Kotlin converter built
into the IDE](mixing-java-kotlin-intellij.md#converting-an-existing-java-file-to-kotlin-with-j2k) that simplifies migration of existing code.

### What can I use Kotlin for?

Kotlin can be used for any kind of development, be it server-side, client-side web, Android, or multiplatform library.
With Kotlin/Native currently in the works, support for other platforms such as embedded systems, macOS, and iOS.
People are using Kotlin for mobile and server-side applications, client-side with JavaScript or JavaFX, and data science,
just to name a few possibilities.

### Can I use Kotlin for Android development?

Yes. Kotlin is supported as a first-class language on Android. There are hundreds of applications already using Kotlin 
for Android, such as Basecamp, Pinterest and more. For more information, check out [the resource on Android development](android-overview.md).

### Can I use Kotlin for server-side development?

Yes. Kotlin is 100% compatible with the JVM, and as such you can use any existing frameworks such as Spring Boot, 
vert.x or JSF. In addition, there are specific frameworks written in Kotlin, such as [Ktor](https://github.com/kotlin/ktor). 
For more information, check out [the resource on server-side development](server-overview.md).

### Can I use Kotlin for web development?

Yes. For backend web development, Kotlin works well with frameworks such as [Ktor](https://ktor.io/) and [Spring](https://spring.io/), enabling you to build 
server-side applications efficiently. Additionally, you can use Kotlin/Wasm for client-side web development.
Learn how to [get started with Kotlin/Wasm](wasm-get-started.md).

### Can I use Kotlin for desktop development?

Yes. You can use any Java UI framework such as JavaFx, Swing or other. 
In addition, there are Kotlin-specific frameworks such as [TornadoFX](https://github.com/edvin/tornadofx). 

### Can I use Kotlin for native development?

Yes. Kotlin/Native is available as a part of Kotlin. It compiles Kotlin to native code that can run without a VM.
You can try it on popular desktop and mobile platforms and even some IoT devices.
For more information, check out the [Kotlin/Native documentation](native-overview.md).

### What IDEs support Kotlin?

Kotlin has full out-of-the-box support in [IntelliJ IDEA](https://www.jetbrains.com/idea/download/) and
[Android Studio](https://developer.android.com/kotlin/get-started)
with an official Kotlin plugin developed by JetBrains.

Other IDEs and code editors only have Kotlin community-supported plugins.

You can also try [Kotlin Playground](https://play.kotlinlang.org) for writing, running, and sharing 
Kotlin code in your browser.

In addition, a [command line compiler](command-line.md) is available, which provides straightforward support for compiling and running applications.
  
### What build tools support Kotlin?

On the JVM side, the main build tools include [Gradle](gradle.md), [Maven](maven.md), 
[Ant](ant.md), and [Kobalt](https://beust.com/kobalt/home/index.html). There are also some build tools available
that target client-side JavaScript. 

### What does Kotlin compile down to?

When targeting the JVM, Kotlin produces Java-compatible bytecode.

When targeting JavaScript, Kotlin transpiles to ES5.1 and generates
code which is compatible with module systems including AMD and CommonJS. 

When targeting native, Kotlin will produce platform-specific code (via LLVM). 

### Which versions of JVM does Kotlin target?

Kotlin lets you choose the version of JVM for execution. By default, the Kotlin/JVM compiler produces Java 8 compatible bytecode.
If you want to make use of optimizations available in newer versions of Java, you can explicitly specify the target Java
version from 9 to 23. Note that in this case the resulting bytecode might not run on lower versions.
Starting with [Kotlin 1.5](whatsnew15.md#new-default-jvm-target-1-8), the compiler does not support producing bytecode compatible with Java versions below 8.

### Is Kotlin hard?

Kotlin is inspired by existing languages such as Java, C#, JavaScript, Scala and Groovy. We've tried to ensure that
Kotlin is easy to learn, so that people can easily jump on board, reading and writing Kotlin in a matter of days. 
Learning idiomatic Kotlin and using some more of its advanced features can take a little longer, but overall it is not
a complicated language.  
For more information, check out [our learning materials](learning-materials-overview.md).
 
### What companies are using Kotlin?
 
There are too many companies using Kotlin to list, but some more visible companies that have publicly declared usage of
Kotlin, be this via blog posts, GitHub repositories or talks include 
[Square](https://medium.com/square-corner-blog/square-open-source-loves-kotlin-c57c21710a17), [Pinterest](https://www.youtube.com/watch?v=mDpnc45WwlI),
[Basecamp](https://signalvnoise.com/svn3/using-kotlin-to-make-android-apis-fun-again/), and [Corda](https://corda.net/blog/kotlin/).
 
### Who develops Kotlin?

Kotlin is developed by a team of engineers at [JetBrains (current team size is 100+)](https://www.jetbrains.com/).
The lead language designer is Michail Zarečenskij. In addition to the core team, there are also over 250 external contributors on GitHub. 

### Where can I learn more about Kotlin?

The best place to start is [our website](https://kotlinlang.org). 
To start with Kotlin, you can install one of the [official IDEs](kotlin-ide.md) or [try it online](https://play.kotlinlang.org).

### Are there any books on Kotlin?

There are a number of books available for Kotlin. Some of them we have reviewed and can recommend to start with. They are listed
on the [Books](books.md) page. For more books, see the community-maintained list at [kotlin.link](https://kotlin.link/). 

### Are any online courses available for Kotlin?

You can learn all the Kotlin essentials while creating working applications with the [Kotlin Core track](https://hyperskill.org/tracks?category=4&utm_source=jbkotlin_hs&utm_medium=referral&utm_campaign=kotlinlang-docs&utm_content=button_1&utm_term=22.03.23) by JetBrains Academy.

A few other courses you can take:
* [Pluralsight Course: Getting Started with Kotlin](https://www.pluralsight.com/courses/kotlin-getting-started) by Kevin Jones
* [O'Reilly Course: Introduction to Kotlin Programming](https://www.oreilly.com/library/view/introduction-to-kotlin/9781491964125/) by Hadi Hariri
* [Udemy Course: 10 Kotlin Tutorials for Beginneres](https://petersommerhoff.com/dev/kotlin/kotlin-beginner-tutorial/) by Peter Sommerhoff

You can also check out the other tutorials and content on our [YouTube channel](https://www.youtube.com/c/Kotlin).

### Does Kotlin have a community?

Yes! Kotlin has a very vibrant community. Kotlin developers hang out on the [Kotlin forums](https://discuss.kotlinlang.org), 
[StackOverflow](https://stackoverflow.com/questions/tagged/kotlin) and more actively on the [Kotlin Slack](https://slack.kotlinlang.org) 
(with close to 30000 members as of April 2020). 

### Are there Kotlin events?
 
Yes! There are many User Groups and Meetups now focused exclusively around Kotlin. You can find [a list on the website](https://kotlinlang.org/user-groups/user-group-list.html).
In addition, there are community-organized [Kotlin Nights](https://kotlinlang.org/community/events.html) events around the world.

### Is there a Kotlin conference?

Yes! [KotlinConf](https://kotlinconf.com/) is an annual conference hosted by JetBrains, which brings together developers, enthusiasts, 
and experts from around the world to share their knowledge and experience with Kotlin.

In addition to technical talks and workshops, KotlinConf also offers networking opportunities, community interactions, 
and social events where attendees can connect with fellow Kotliners and exchange ideas.
It serves as a platform for fostering collaboration and community building within the Kotlin ecosystem.

Kotlin is also being covered in different conferences worldwide. You can find a list of
[upcoming talks on the website](https://kotlinlang.org/community/talks.html?time=upcoming).

### Is Kotlin on social media?

Yes. 
Subscribe to the [Kotlin YouTube channel](https://www.youtube.com/c/Kotlin) and follow Kotlin [on Twitter](https://twitter.com/kotlin) or [on Bluesky](https://bsky.app/profile/kotlinlang.org).

### Any other online Kotlin resources?

The website has a bunch of [online resources](https://kotlinlang.org/community/), including [Kotlin Digests](https://kotlin.link) by community members, 
a [newsletter](http://kotlinweekly.net), a [podcast](https://talkingkotlin.com) and more.

### Where can I get an HD Kotlin logo?

Logos can be downloaded [here](https://resources.jetbrains.com/storage/products/kotlin/docs/kotlin_logos.zip).
When using the logos, please follow simple rules in the `guidelines.pdf` inside the archive and [Kotlin brand usage guidelines](https://kotlinfoundation.org/guidelines/).

For more information, check out the page about [Kotlin brand assets](kotlin-brand-assets.md).