[//]: # (title: Asynchronous programming techniques)

For decades, as developers we are confronted with a problem to solve - how to prevent our applications from blocking. Whether 
we're developing desktop, mobile, or even server-side applications, we want to avoid having the user wait or what's worse cause 
bottlenecks that would prevent an application from scaling. 

There have been many approaches to solving this problem, including:

* [Threading](#threading)
* [Callbacks](#callbacks)
* [Futures, promises, and others](#futures-promises-and-others)
* [Reactive Extensions](#reactive-extensions)
* [Coroutines](#coroutines)

Before explaining what coroutines are, let's briefly review some of the other solutions.

## Threading

Threads are by far probably the most well-known approach to avoid applications from blocking.

```kotlin
fun postItem(item: Item) {
    val token = preparePost()
    val post = submitPost(token, item)
    processPost(post)
}

fun preparePost(): Token {
    // makes a request and consequently blocks the main thread
    return token
}
```

Let's assume in the code above that `preparePost` is a long-running process and consequently would block the user interface. What we can do is launch it in a separate thread. This would then
allow us to avoid the UI from blocking. This is a very common technique, but has a series of drawbacks:

* Threads aren't cheap. Threads require context switches which are costly.
* Threads aren't infinite. The number of threads that can be launched is limited by the underlying operating system. In server-side applications, this could cause a major bottleneck.
* Threads aren't always available. Some platforms, such as JavaScript do not even support threads
* Threads aren't easy. Debugging threads, avoiding race conditions are common problems we suffer in multi-threaded programming. 

## Callbacks

With callbacks, the idea is to pass one function as a parameter to another function, and have this one invoked once the process has completed.

```kotlin
fun postItem(item: Item) {
    preparePostAsync { token -> 
        submitPostAsync(token, item) { post -> 
            processPost(post)
        }
    }
}

fun preparePostAsync(callback: (Token) -> Unit) {
    // make request and return immediately 
    // arrange callback to be invoked later
}
```

This in principle feels like a much more elegant solution, but once again has several issues:

* Difficulty of nested callbacks. Usually a function that is used as a callback, often ends up needing its own callback. This leads to a series of nested callbacks which
lead to incomprehensible code. The pattern is often referred to as the titled christmas tree (brace represent branches of the tree).
* Error handling is complicated. The nesting model makes error handling and propagation of these somewhat more complicated. 

Callbacks are quite common in event-loop architectures such as JavaScript, but even there, generally people have moved away to using other approaches such as promises or reactive extensions.

## Futures, promises, and others

The idea behind futures or promises (there are also other terms these can be referred to depending on language/platform), is that when we make a call, we're promised 
that at some point it will return with an object called a Promise, which can then be operated on.

```kotlin
fun postItem(item: Item) {
    preparePostAsync() 
        .thenCompose { token -> 
            submitPostAsync(token, item)
        }
        .thenAccept { post -> 
            processPost(post)
        }
         
}

fun preparePostAsync(): Promise<Token> {
    // makes request an returns a promise that is completed later
    return promise 
}
```

This approach requires a series of changes in how we program, in particular

* Different programming model. Similar to callbacks, the programming model moves away from a top-down imperative approach to a compositional model with chained calls. Traditional program structures 
such as loops, exception handling, etc. usually are no longer valid in this model.
* Different APIs. Usually there's a need to learn a completely new API such as `thenCompose` or `thenAccept`, which can also vary across platforms.
* Specific return type. The return type moves away from the actual data that we need and instead returns a new type `Promise` which has to be introspected. 
* Error handling can be complicated. The propagation and chaining of errors aren't always straightforward.

## Reactive extensions

Reactive Extensions (Rx) were introduced to C# by [Erik Meijer](https://en.wikipedia.org/wiki/Erik_Meijer_(computer_scientist)). While it was definitely used on the .NET platform
it really didn't reach mainstream adoption until Netflix ported it over to Java, naming it RxJava. From then on, numerous ports have been provided for a variety of platforms including JavaScript (RxJS).

The idea behind Rx is to move towards what's called `observable streams` where by we now think of data as streams (infinite amounts of data) and these streams can be observed. In practical terms, Rx is simply 
the [Observer Pattern](https://en.wikipedia.org/wiki/Observer_pattern) with a series of extensions which allow us to operate on the data.

In approach it's quite similar to Futures, but one can think of a Future as returning a discrete element, whereby Rx returns a stream. However, similar to the previous, it also introduces 
a complete new way of thinking about our programming model, famously phrased as 

    "everything is a stream, and it's observable"
    
This implies a different way to approach problems and quite a significant shift from what we're using to when writing synchronous code. One benefit as opposed to Futures is that given its ported to 
so many platforms, generally we can find a consistent API experience no matter what we use it, be it C#, Java, JavaScript, or any other language where Rx is available.

In addition, Rx does introduce a somewhat nicer approach to error handling. 

## Coroutines 

Kotlin's approach to working with asynchronous code is using coroutines, which is the idea of suspendable computations, i.e. the idea that a function can suspend its execution at some point and resume later on. 

One of the benefits however of coroutines is that when it comes to the developer, writing non-blocking code is essentially the same as writing blocking code. The programming model
in itself doesn't really change. 

Take for instance the following code

```kotlin
fun postItem(item: Item) {
    launch {
        val token = preparePost()
        val post = submitPost(token, item)
        processPost(post)
    }
}

suspend fun preparePost(): Token {
    // makes a request and suspends the coroutine
    return suspendCoroutine { /* ... */ } 
}
```

This code will launch a long-running operation without blocking the main thread. The `preparePost` is what's called a 
`suspendable function`, thus the keyword `suspend` prefixing it. What this means as stated above, is that the function will 
execute, pause execution and resume at some point in time. 

* The function signature remains exactly the same. The only difference is `suspend` being added to it. The return type however is the type we want to be
returned.
* The code is still written as if we were writing synchronous code, top-down, without the need of any special syntax, beyond the use of a function called `launch` which essentially kicks-off
the coroutine (covered in other tutorials).
* The programming model and APIs remain the same. We can continue to use loops, exception handling, etc. and there's no need to learn a complete set of new APIs
* It is platform independent. Whether we targeting JVM, JavaScript or any other platform, the code we write is the same. Under the covers the compiler takes care of adapting it to each platform.

Coroutines are not a new concept, let alone invented by Kotlin. They've been around for decades and are popular in some other programming languages such as Go. What is important to note though
is that the way they're implemented in Kotlin, most of the functionality is delegated to libraries. In fact, beyond the `suspend` keyword, no other keywords are added to the language. This is somewhat different from
languages such as C# that have `async` and `await` as part of the syntax. With Kotlin, these are just library functions.

For more information regarding Coroutines and the different possibilities, check out the reference guide.
