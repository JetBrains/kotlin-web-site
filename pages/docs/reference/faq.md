---
type: doc
layout: reference
category: FAQ
title: FAQ
---

# FAQ

### What is Kotlin?

Kotlin is an OSS statically typed programming language that targets the JVM, Android, JavaScript and Native. 
It’s developed by [JetBrains](http://www.jetbrains.com). The project started in 2010 and was open source from very early on. The first official 1.0 release was in February 2016. 

### What is the current version of Kotlin?

The currently released version is {{ data.releases.latest.version }}, published on {{ data.releases.latest.date }}.

### Is Kotlin free?

Yes. Kotlin is free, has been free and will remain free. It is developed under the Apache 2.0 license and the source code is available [on GitHub](https://github.com/jetbrains/kotlin).

### Is Kotlin an object-oriented language or a functional one?

Kotlin has both object-oriented and functional constructs. You can use it in both OO and FP styles, or mix elements of the two. 
With first-class support for features such as higher-order functions, function types and lambdas, Kotlin is a great choice if you’re doing or exploring functional programming.

### What advantages does Kotlin give me over the Java programming language?

Kotlin is more concise. Rough estimates indicate approximately a 40% cut in the number of lines of code. 
It’s also more type-safe, e.g. support for non-nullable types makes applications less prone to NPE’s. 
Other features including smart casting, higher-order functions, extension functions and lambdas with receivers provide 
the ability to write expressive code as well as facilitating creation of DSL.
 
### Is Kotlin compatible with the Java programming language?

Yes. Kotlin is 100% interoperable with the Java programming language and major emphasis has been placed on making sure that your existing codebase 
can interact properly with Kotlin. You can easily call Kotlin code from Java and Java code from Kotlin. This makes adoption
much easier and lower-risk. There’s also an automated Java-to-Kotlin converter built into the IDE that simplifies migration of existing code.

### What can I use Kotlin for?

Kotlin can be used for any kind of development, be it server-side, client-side web and Android. With Kotlin/Native currently 
in the works, support for other platforms such as embedded systems, macOS and iOS is coming. People are using Kotlin for mobile 
and server-side applications, client-side with JavaScript or JavaFX, and data science, just to name a few possibilities. 

### Can I use Kotlin for Android development?

Yes. Kotlin is supported as a first-class language on Android. There are hundreds of applications already using Kotlin 
for Android, such as Basecamp, Pinterest and more. For more information check out [the resource on Android development](/docs/reference/android-overview.html).

### Can I use Kotlin for server-side development?

Yes. Kotlin is 100% compatible with the JVM and as such you can use any existing frameworks such as Spring Boot, 
vert.x or JSF. In addition there are specific frameworks written in Kotlin such as [Ktor](http://github.com/kotlin/ktor). 
For more information check out [the resource on server-side development](/docs/reference/server-overview.html).

### Can I use Kotlin for web development?

Yes. In addition to using for backend web, you can also use Kotlin/JS for client-side web. Kotlin can use definitions from 
[DefinitelyTyped](http://definitelytyped.org) to get static typing for common JavaScript libraries, and it is compatible with existing module systems such as AMD and CommonJS. 
For more information check out [the resource on client-side development](/docs/reference/js-overview.html).

### Can I use Kotlin for desktop development?

Yes. You can use any Java UI framework such as JavaFx, Swing or other. 
In addition there are Kotlin specific frameworks such as [TornadoFX](https://github.com/edvin/tornadofx). 

### Can I use Kotlin for native development?

Yes. Kotlin/Native is available as a part of Kotlin project. It compiles Kotlin to native code that can run without a VM.
It is still in beta, but you can already try it on popular desktop and mobile platforms and even some IoT devices.
For more information, check out the [Kotlin/Native documentation](native-overview.html).

### What IDEs support Kotlin?

Kotlin is supported by all major Java IDEs including [IntelliJ IDEA](/docs/tutorials/jvm-get-started.html),
[Android Studio](https://developer.android.com/kotlin/get-started), [Eclipse](/docs/tutorials/getting-started-eclipse.html) and 
[NetBeans](http://plugins.netbeans.org/plugin/68590/kotlin). In addition, a [command line compiler](/docs/tutorials/command-line.html) 
is available and provides straightforward support for compiling and running applications.
  
### What build tools support Kotlin?

On the JVM side, the main build tools include [Gradle](/docs/reference/using-gradle.html), [Maven](/docs/reference/using-maven.html), 
[Ant](/docs/reference/using-ant.html), and [Kobalt](http://beust.com/kobalt/home/index.html). There are also some build tools available that target client-side JavaScript. 

### What does Kotlin compile down to?

When targeting the JVM, Kotlin produces Java compatible bytecode. When targeting JavaScript, Kotlin transpiles to ES5.1 and generates
code which is compatible with module systems including AMD and CommonJS. When targeting native, Kotlin will produce platform-specific code (via LLVM). 

### Which versions of JVM does Kotlin target?

Kotlin lets you choose the version of JVM for execution. By default, the Kotlin/JVM compiler produces Java 6 compatible bytecode.
If you want to make use of optimizations available in newer versions of Java, you can explicitly specify the target Java version from 8 to 13.
Note that in this case the resulting bytecode might not run on lower versions. 

### Is Kotlin hard?

Kotlin is inspired by existing languages such as Java, C#, JavaScript, Scala and Groovy. We've tried to ensure that Kotlin is easy to learn,
so that people can easily jump on board, reading and writing Kotlin in a matter of days. 
Learning idiomatic Kotlin and using some more of its advanced features can take a little longer, but overall it is not a complicated language.
 
### What companies are using Kotlin?
 
There are too many companies using Kotlin to list, but some more visible companies that have publicly declared usage of Kotlin, be this via blog posts, GitHub repositories or talks include 
[Square](https://medium.com/square-corner-blog/square-open-source-loves-kotlin-c57c21710a17), [Pinterest](https://www.youtube.com/watch?v=mDpnc45WwlI), [Basecamp](https://m.signalvnoise.com/how-we-made-basecamp-3s-android-app-100-kotlin-35e4e1c0ef12) or [Corda](https://docs.corda.net/releases/release-M9.2/further-notes-on-kotlin.html).
 
### Who develops Kotlin?

Kotlin is primarily developed by a team of engineers at JetBrains (current team size is 100+). The lead language designer is 
[Andrey Breslav](https://twitter.com/abreslav). In addition to the core team, there are also over 250 external contributors on GitHub. 

### Where can I learn more about Kotlin?

The best place to start is [this website](https://kotlinlang.org). From there you can download the compiler, 
[try it online](https://play.kotlinlang.org) as well as get access to resources, [reference documentation](/docs/reference/index.html)
and [tutorials](/docs/tutorials/index.html). 

### Are there any books on Kotlin?

There are already [a number of books](/docs/books.html) available for Kotlin, including [Kotlin in Action](https://www.manning.com/books/kotlin-in-action) which is by Kotlin team members Dmitry Jemerov and Svetlana Isakova, 
[Kotlin for Android Developers](https://leanpub.com/kotlin-for-android-developers) targeted at Android developers. 

### Are there any online courses available for Kotlin?

There are a few courses available for Kotlin, including a [Pluralsight Kotlin Course](https://www.pluralsight.com/courses/kotlin-getting-started) by Kevin Jones, 
an [O’Reilly Course](http://shop.oreilly.com/product/0636920052982.do) by Hadi Hariri and an [Udemy Kotlin Course](http://petersommerhoff.com/dev/kotlin/kotlin-beginner-tutorial/) by Peter Sommerhoff.

There are also many recordings of [Kotlin talks](http://kotlinlang.org/community/talks.html) available on YouTube and Vimeo. 

### Does Kotlin have a community?

Yes. Kotlin has a very vibrant community. Kotlin developers hang out on the [Kotlin forums](http://discuss.kotlinlang.org), 
[StackOverflow](http://stackoverflow.com/questions/tagged/kotlin) and more actively on the [Kotlin Slack](http://slack.kotlinlang.org) 
(with close to 30000 members as of April 2020). 

### Are there Kotlin events?
 
Yes. There are many User Groups and Meetups now focused exclusively around Kotlin. You can find [a list on the web site](/user-groups/user-group-list.html).
In addition there are community organised [Kotlin Nights](/community/events.html) events around the world.

### Is there a Kotlin conference?

Yes. The official annual [KotlinConf](https://kotlinconf.com/) is hosted by JetBrains.
It took place in San-Francisco in [2017](https://kotlinconf.com/2017/), Amsterdam in [2018](https://kotlinconf.com/2018/),
and Copenhagen in [2019](https://kotlinconf.com/2019/).
Kotlin is also being covered in different conferences worldwide. You can find a list of [upcoming talks on the web site](/community/talks.html?time=upcoming).

### Is Kotlin on social media?

Yes. The most active Kotlin account is [on Twitter](https://twitter.com/kotlin).

### Any other online Kotlin resources?

The web site has a bunch of [online resources](https://kotlinlang.org/community/), including [Kotlin Digests](https://kotlin.link) by community members, 
a [newsletter](http://www.kotlinweekly.net), a [podcast](https://talkingkotlin.com) and more.   

### Where can I get an HD Kotlin logo?

Logos can be downloaded [here](https://resources.jetbrains.com/storage/products/kotlin/docs/kotlin_logos.zip).
When using the logos, please follow simple rules in the `guidelines.pdf` inside the archive and [Kotlin brand usage guidelines](/foundation/guidelines.html).
