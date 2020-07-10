---
type: tutorial
layout: tutorial
title: "Your first coroutine with Kotlin"
description: "This tutorial walks us through setting up a project using coroutines, and writing code that uses them."
authors: Dmitry Jemerov
showAuthorInfo: false
---

Kotlin 1.1 introduced coroutines, a new way of writing asynchronous, non-blocking code (and much more). In this tutorial we will go through some basics of using Kotlin coroutines with the help of the `kotlinx.coroutines` library, which is a collection of helpers and wrappers for existing Java libraries.

## Setting up a project

### Gradle

In IntelliJ IDEA go to *File -> New > Project...*:

<img src="{{ url_for('tutorial_img', filename='coroutines-basic-jvm/new_gradle_project_jvm.png')}}"/>

Then follow the wizard steps. You'll have a `build.gradle` file created with Kotlin configured according to [this document](/docs/reference/using-gradle.html).
Make sure it's configured for Kotlin 1.3 or higher.

Since we'll be using the [`kotlinx.coroutines`](https://github.com/Kotlin/kotlinx.coroutines), let's add its recent version to our dependencies:

<div class="sample" markdown="1" theme="idea" mode="groovy">

```groovy
dependencies {
    ...
    implementation "org.jetbrains.kotlinx:kotlinx-coroutines-core:{{ site.data.releases.latest.coroutines.version }}"
}
```

</div>

This library is published to Bintray JCenter repository, so let us add it:

<div class="sample" markdown="1" theme="idea" mode="groovy">

```groovy
repositories {
    jcenter()
}
```

</div>

That's it, we are good to go and write code under `src/main/kotlin`.

### Maven

In IntelliJ IDEA go to *File -> New > Project...* and check the *Create from archetype* box:

<img src="{{ url_for('tutorial_img', filename='coroutines-basic-jvm/new_mvn_project_jvm.png')}}"/>

Then follow the wizard steps. You'll have a `pom.xml`  file created with Kotlin configured according to [this document](/docs/reference/using-maven.html).
Make sure it's configured for Kotlin 1.3 or higher.

<div class="sample" markdown="1" theme="idea" mode="xml" auto-indent="false">

```xml
<plugin>
    <groupId>org.jetbrains.kotlin</groupId>
    <artifactId>kotlin-maven-plugin</artifactId>
    ...
    <configuration>
        <args>
            <arg>-Xcoroutines=enable</arg>
        </args>
    </configuration>
</plugin>
```

</div>

Since we'll be using the [`kotlinx.coroutines`](https://github.com/Kotlin/kotlinx.coroutines), let's add its recent version to our dependencies:

<div class="sample" markdown="1" theme="idea" mode="xml" auto-indent="false">

```xml
<dependencies>
    ...
    <dependency>
        <groupId>org.jetbrains.kotlinx</groupId>
        <artifactId>kotlinx-coroutines-core</artifactId>
        <version>{{ site.data.releases.latest.coroutines.version }}</version>
    </dependency>
</dependencies>
```

</div>

This library is published to Bintray JCenter repository, so let us add it:

<div class="sample" markdown="1" theme="idea" mode="xml" auto-indent="false">

```xml
<repositories>
    ...
    <repository>
        <id>central</id>
        <url>http://jcenter.bintray.com</url>
    </repository>
</repositories>
```

</div>

That's it, we are good to go and write code under `src/main/kotlin`.

## My first coroutine

One can think of a coroutine as a light-weight thread. Like threads, coroutines can run in parallel, wait for each other and communicate.
The biggest difference is that coroutines are very cheap, almost free: we can create thousands of them, and pay very little in terms of performance.
True threads, on the other hand, are expensive to start and keep around. A thousand threads can be a serious challenge for a modern machine.

So, how do we start a coroutine? Let's use the `launch {}` function:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
launch {
    ...
}
```

</div>

This starts a new coroutine. By default, coroutines are run on a shared pool of threads. 
Threads still exist in a program based on coroutines, but one thread can run many coroutines, so there's no need for 
too many threads.

Let's look at a full program that uses `launch`:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.3">

```kotlin
import kotlinx.coroutines.*

fun main(args: Array<String>) {
//sampleStart
    println("Start")

    // Start a coroutine
    GlobalScope.launch {
        delay(1000)
        println("Hello")
    }

    Thread.sleep(2000) // wait for 2 seconds
    println("Stop")
//sampleEnd
}
```

</div>

Here we start a coroutine that waits for 1 second and prints `Hello`.

We are using the `delay()` function that's like `Thread.sleep()`, but better: it _doesn't block a thread_, but only suspends the coroutine itself.
The thread is returned to the pool while the coroutine is waiting, and when the waiting is done, the coroutine resumes on a free thread in the pool.

The main thread (that runs the `main()` function) must wait until our coroutine completes, otherwise the program ends before `Hello` is printed.

_Exercise: try removing the `sleep()` from the program above and see the result._

 If we try to use the same non-blocking `delay()` function directly inside `main()`, we'll get a compiler error:

> Suspend functions are only allowed to be called from a coroutine or another suspend function

This is because we are not inside any coroutine. We can use delay if we wrap it into `runBlocking {}` that starts a coroutine and waits until it's done:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
runBlocking {
    delay(2000)
}
```

</div>

So, first the resulting program prints `Start`, then it runs a coroutine through `launch {}`, then it runs another one through `runBlocking {}` and blocks until it's done, then prints `Stop`. Meanwhile the first coroutine completes and prints `Hello`. Just like threads, we told you :)

## Let's run a lot of them

Now, let's make sure that coroutines are really cheaper than threads. How about starting a million of them? Let's try starting a million threads first:

<div class="sample" markdown="1" theme="idea" data-highlight-only auto-indent="false">

```kotlin
val c = AtomicLong()

for (i in 1..1_000_000L)
    thread(start = true) {
        c.addAndGet(i)
    }

println(c.get())
```

</div>

This runs a 1'000'000 threads each of which adds to a common counter. My patience runs out before this program completes on my machine (definitely over a minute).

Let's try the same with coroutines:

<div class="sample" markdown="1" theme="idea" data-highlight-only auto-indent="false">

```kotlin
val c = AtomicLong()

for (i in 1..1_000_000L)
    GlobalScope.launch {
        c.addAndGet(i)
    }

println(c.get())
```

</div>

This example completes in less than a second for me, but it prints some arbitrary number, because some coroutines don't finish before `main()` prints the result. Let's fix that.

We could use the same means of synchronization that are applicable to threads (a `CountDownLatch` is what crosses my mind in this case), but let's take a safer and cleaner path.


## Async: returning a value from a coroutine

Another way of starting a coroutine is `async {}`. It is like `launch {}`, but returns an instance of `Deferred<T>`, which has an `await()` function that returns the result of the coroutine. `Deferred<T>` is a very basic [future](https://en.wikipedia.org/wiki/Futures_and_promises) (fully-fledged JDK futures are also supported, but here we'll confine ourselves to `Deferred` for now).


Let's create a million coroutines again, keeping their `Deferred` objects. Now there's no need in the atomic counter, as we can just return the numbers to be added from our coroutines:

<div class="sample" markdown="1" theme="idea" data-highlight-only auto-indent="false">

```kotlin
val deferred = (1..1_000_000).map { n ->
    GlobalScope.async {
        n
    }
}
```

</div>

All these have already started, all we need is collect the results:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
val sum = deferred.map { it.await().toLong() }.sum()
```

</div>

We simply take every coroutine and await its result here, then all results are added together by the standard library function `sum()`. But the compiler rightfully complains:

> Suspend functions are only allowed to be called from a coroutine or another suspend function

`await()` can not be called outside a coroutine, because it needs to suspend until the computation finishes, and only coroutines can suspend in a non-blocking way. So, let's put this inside a coroutine:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
runBlocking {
    val sum = deferred.map { it.await().toLong() }.sum()
    println("Sum: $sum")
}
```

</div>

Now it prints something sensible: `500000500000`, because all coroutines complete.

Let's also make sure that our coroutines actually run in parallel. If we add a 1-second `delay()` to each of the `async`'s, the resulting program won't run for 1'000'000 seconds (over 11,5 days):

<div class="sample" markdown="1" theme="idea" data-highlight-only auto-indent="false">

```kotlin
val deferred = (1..1_000_000).map { n ->
    GlobalScope.async {
        delay(1000)
        n
    }
}
```

</div>

This takes about 10 seconds on my machine, so yes, coroutines do run in parallel.

## Suspending functions

Now, let's say we want to extract our _workload_ (which is "wait 1 second and return a number") into a separate function:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun workload(n: Int): Int {
    delay(1000)
    return n
}
```

</div>

A familiar error pops up:

> Suspend functions are only allowed to be called from a coroutine or another suspend function

Let's dig a little into what it means. The biggest merit of coroutines is that they can _suspend_ without blocking a thread. The compiler has to emit some special code to make this possible, so we have to mark functions that _may suspend_ explicitly in the code. We use the `suspend` modifier for it:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
suspend fun workload(n: Int): Int {
    delay(1000)
    return n
}
```

</div>

Now when we call `workload()` from a coroutine, the compiler knows that it may suspend and will prepare accordingly:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
GlobalScope.async {
    workload(n)
}
```

</div>

Our `workload()` function can be called from a coroutine (or another suspending function), but _cannot_ be called from outside a coroutine. Naturally, `delay()` and `await()` that we used above are themselves declared as `suspend`, and this is why we had to put them inside `runBlocking {}`, `launch {}` or `async {}`.
