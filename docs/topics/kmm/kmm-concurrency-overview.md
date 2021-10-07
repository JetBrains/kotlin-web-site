[//]: # (title: Concurrency overview)

When you extend your development experience from Android to Kotlin Multiplatform Mobile, you will encounter a different state 
and concurrency model for iOS. This is a Kotlin/Native model. [Kotlin/Native](native-overview.md) 
is a technology for compiling Kotlin code to native binaries that can run without a virtual machine, for example on iOS. 

Having mutable memory available to multiple threads at the same time, if unrestricted, is known to be risky and prone to error. 
Languages like Java, C++, and Swift/Objective-C let multiple threads access the same state in an unrestricted way. Concurrency issues are unlike other programming issues in that they are 
often very difficult to reproduce. You may not see them locally while developing, and they may happen sporadically. 
And sometimes you can only see them in production under load.

In short, just because your tests pass, you can’t necessarily be sure that your code is OK.

Not all languages are designed this way. JavaScript simply does not 
allow you to access the same state concurrently. At the other end of the spectrum is Rust, with its
language-level management of concurrency and states, which makes it very popular. 

## Rules for state sharing 

Kotlin/Native introduces rules for sharing states between threads. These rules exist to prevent unsafe shared 
access to mutable states. If you come from a JVM background and write concurrent code, you may need to change the way 
you architect your data, but doing so will allow you to achieve the same results without risky side effects.

It is also important to point out that there are [ways to work around these rules](kmm-concurrent-mutability.md). 
The intent is to make working around these rules something that you rarely have to do, if ever.

There are just two simple rules regarding state and concurrency.

### Rule 1: Mutable state == 1 thread

If your state is mutable, only one thread can _see_ it at a time. Any regular class state that 
you would normally use in Kotlin is considered by the Kotlin/Native runtime as _mutable_. If you aren't using concurrency, 
Kotlin/Native behaves the same as any other Kotlin code, with the exception of [global state](#global-state).

```kotlin
data class SomeData(var count:Int)

fun simpleState(){
    val sd = SomeData(42)
    sd.count++
    println("My count is ${sd.count}") // It will be 43
}
```

If there's only one thread, you won’t have concurrency issues. Technically this is referred 
to as _thread confinement_, which means that you cannot change the UI from a background thread. Kotlin/Native's state rules 
formalize that concept for all threads.

### Rule 2: Immutable state == many threads

If a state can't be changed, multiple threads can safely access it.
In Kotlin/Native, _immutable_ doesn't mean everything is a `val`. It means _frozen state_.

## Immutable and frozen state

The example below is immutable by definition – it has 2 `val` elements, and both are of final immutable types.

```kotlin
data class SomeData(val s:String, val i:Int)
```

This next example may be immutable or mutable. It is not clear what `SomeInterface` will do internally at compile time. 
In Kotlin, it is not possible to determine deep immutability statically at compile time.

```kotlin
data class SomeData(val s:String, val i:SomeInterface)
```

Kotlin/Native needs to verify that some part of a state really is immutable at runtime. The runtime could simply go 
through the whole state and verify that each part is deeply immutable, but that would be inflexible. And if you needed 
to do that every time the runtime wanted to check mutability, there would be significant consequences for performance.

Kotlin/Native defines a new runtime state called _frozen_. Any instance of an object may be frozen. If an object is frozen:

1. You cannot change any part of its state. Attempting to do so will result in a runtime exception: `InvalidMutabilityException`. 
A frozen object instance is 100%, runtime-verified, immutable.
2. Everything it references is also frozen. All other objects it has a reference to are guaranteed to be frozen. This means that, 
when the runtime needs to determine whether an object can be shared with another thread, it only needs to check whether that object 
is frozen. If it is, the whole graph is also frozen and is safe to be shared.

The Native runtime adds an extension function `freeze()` to all classes. Calling `freeze()` will freeze an object, and everything 
referenced by the object, recursively.

```kotlin
data class MoreData(val strData: String, var width: Float)
data class SomeData(val moreData: MoreData, var count: Int)
//...
val sd = SomeData(MoreData("abc", 10.0), 0)
sd.freeze()
```

![Freezing state](freezing-state.png){animated="true"}

* `freeze()` is a one-way operation. You can't _unfreeze_ something.
* `freeze()` is not available in shared Kotlin code, but several libraries provide expect and actual declarations
 for using it in shared code. However, if you're using a concurrency library, like [`kotlinx.coroutines`](https://github.com/Kotlin/kotlinx.coroutines), it will 
likely freeze data that crosses thread boundaries automatically. 

`freeze` is not unique to Kotlin. You can also find it in [Ruby](https://www.honeybadger.io/blog/when-to-use-freeze-and-frozen-in-ruby/) and [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze).

## Global state

Kotlin allows you to define a state as globally available. If left simply mutable, the global state would violate [_Rule 1_](#rule-1-mutable-state-1-thread).  
To conform to Kotlin/Native's state rules, the global state has some special conditions. 
These conditions freeze the state or make it visible only to a single thread.

### Global `object`

Global `object` instances are frozen by default. This means that all threads can access them, but they are immutable. The following won't work.

```kotlin
object SomeState{
    var count = 0
    fun add(){
        count++ //This will throw an exception
    }
}
```

Trying to change `count` will throw an exception because `SomeState` is frozen (which means all of its data is frozen).

You can make a global object thread _local_, which will allow it to be mutable and give each thread a copy of its state. 
Annotate it with `@ThreadLocal`.

```kotlin
@ThreadLocal
object SomeState{
    var count = 0
    fun add(){
        count++ //👍
    }
}
```

If different threads read `count`, they'll get different values, because each thread has its own copy.

These global object rules also apply to companion objects.

```kotlin
class SomeState{
    companion object{
        var count = 0
        fun add(){
            count++ //This will throw an exception
        }
    }
}
```

### Global properties

Global properties are a special case. *They are only available to the main thread*, but they are mutable. Accessing them from 
other threads will throw an exception.

```kotlin
val hello = "Hello" //Only main thread can see this
```

You can annotate them with :

* `@SharedImmutable`, which will make them globally available but frozen.
* `@ThreadLocal`, which will give each thread its own mutable copy.

This rule applies to global properties with backing fields. Computed properties and global functions do not have the main 
thread restriction.

## Current and future models

Kotlin/Native's concurrency rules will require some adjustment in architecture design, but with the help of libraries and
 new best practices, day to day development is basically unaffected. In fact, adhering to Kotlin/Native's rules regarding 
multiplatform code will result in safer concurrency across the KMM application. You can try out the Kotlin/Native concurrency
model in [this hands-on tutorial](https://play.kotlinlang.org/hands-on/Kotlin%20Native%20Concurrency/).

In the KMM application, you have Android and iOS targets with different state rules. Some teams, generally ones working on 
larger applications, share code for very specific functionality, and often manage concurrency in the host platform. 
This will require explicit freezing of states returned from Kotlin, but otherwise, it is straightforward. 

A more extensive model, where concurrency is managed in Kotlin 
and the host communicates on its main thread to shared code, is simpler from a state management perspective. 
Concurrency libraries, like [`kotlinx.coroutines`](https://github.com/Kotlin/kotlinx.coroutines), 
will help automate freezing. You'll also be able to leverage the power of [coroutines](coroutines-overview.md) 
in your code and increase efficiency by sharing more code.

However, the current Kotlin/Native concurrency model has a number of deficiencies. For example, mobile developers are used to freely 
sharing their objects between threads, and they have already developed a number of approaches and architectural patterns to 
avoid data races while doing so. It is possible to write efficient applications that do not block the main thread using 
Kotlin/Native, but the ability to do so comes with a steep learning curve.

That's why we are working on creating a new memory manager and concurrency model for Kotlin/Native that will help us remove these 
drawbacks. Learn more about [where we are going with this](https://blog.jetbrains.com/kotlin/2020/07/kotlin-native-memory-management-roadmap/).

_This material was prepared by [Touchlab](https://touchlab.co/) for publication by JetBrains._
