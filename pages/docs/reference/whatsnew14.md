---
type: doc
layout: reference
title: "What's New in Kotlin 1.4"
---

# What's New in Kotlin 1.4

## Language features and improvements

### SAM conversions for Kotlin interfaces

Before Kotlin 1.4, you could apply SAM (Single Abstract Method) conversions only [when working with Java methods and Java
interfaces from Kotlin](java-interop.html#sam-conversions). From now on, you can use SAM conversions for Kotlin interfaces as well.
To do so, mark a Kotlin interface explicitly as functional with the `fun` modifier.

SAM conversion applies if you pass a lambda as an argument when an interface with only one single abstract method is expected
as a parameter. In this case, the compiler automatically converts the lambda to an instance of the class that implements the abstract member function.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.4">

```kotlin
fun interface IntPredicate {
   fun accept(i: Int): Boolean
}

val isEven = IntPredicate { it % 2 == 0 }

fun main(){
   println("Is 7 even? - ${isEven.accept(7)}")
}
```

</div>

Learn more about [Kotlin functional interfaces and SAM conversions](fun-interfaces.html).

## Explicit API mode

Kotlin compiler offers _explicit API mode_ for library authors. In this mode, the compiler performs additional checks that
help make the library’s API clearer and more consistent. It adds the following requirements for declarations exposed
to the library’s public API:

* Visibility modifiers are required for declarations if the default visibility exposes them to the public API.
This helps ensure that no declarations are exposed to the public API unintentionally.
* Explicit type specifications are required for properties and functions that are exposed to the public API.
This guarantees that API users are aware of the types of API members they use.

Depending on your configuration, these explicit APIs can produce errors (_strict_ mode) or warnings (_warning_ mode).
Certain kinds of declarations are excluded from such checks for the sake of readability and common sense:

* primary constructors
* properties of data classes
* property getters and setters
* `override` methods

Explicit API mode analyzes only the production sources of a module.

To compile your module in the explicit API mode, add the following lines to your Gradle build script:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin {    
    // for strict mode
    explicitApi() 
    // or
    explicitApi = 'strict'
    
    // for warning mode
    explicitApiWarning()
    // or
    explicitApi = 'warning'
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
kotlin {    
    // for strict mode
    explicitApi() 
    // or
    explicitApi = ExplicitApiMode.Strict
    
    // for warning mode
    explicitApiWarning()
    // or
    explicitApi = ExplicitApiMode.Warning
}
```

</div>
</div>

When using the command-line compiler, switch to explicit API mode by adding  the `-Xexplicit-api` compiler option
with the value `strict` or `warning`.

<div class="sample" markdown="1" mode="shell" theme="idea">

```bash
-Xexplicit-api={strict|warning}
```

</div>

For more details about the explicit API mode, see the [KEEP](https://github.com/Kotlin/KEEP/blob/master/proposals/explicit-api-mode.md). 

## New compiler

### Unified back-ends and extensibility

In Kotlin, we have three back-ends that generate executables: Kotlin/JVM, Kotlin/JS, and Kotlin/Native. Kotlin/JVM and Kotlin/JS 
don't share much code since they were developed independently. However, Kotlin/Native is based on a new 
infrastructure built around an internal representation (IR) for Kotlin code. 

Now we are migrating Kotlin/JVM and Kotlin/JS to the same IR. As a result, all three back-ends
share much logic and have a unified pipeline. This allows implementing most features, optimizations, and bugfixes 
only once for all platforms.

A common back-end infrastructure also opens the door for multiplatform compiler extensions. You will be able to plug into the 
pipeline and add custom processing and transformations that will automatically work for all platforms. 

In Kotlin 1.4, we do not provide a public API for such extensions yet, but we are working closely with our partners, 
including JetPack Compose, who are already building their compiler plugins using our new back-end.

Now you can opt into using the new JVM IR back-end, where we've already fixed many bugs.

Specify an additional compilation option in your Gradle build script:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
kotlinOptions.useIR = true
```

</div>

When using the command-line compiler, add the compilation option `-Xuse-ir`.

> You can use code compiled by the new JVM IR back-end only if you've enabled the new back-end. Otherwise, you will get an error.
> Considering this, we don't recommend that library authors switch to the new back-end in production.
{:.note}

You can also opt into using the new JS IR back-end (ADD LINK).

## Kotlin/Native

### Simplified management of CocoaPods dependencies

Previously, once you integrated your project with the dependency manager CocoaPods, you could build an iOS, macOS, watchOS, 
or tvOS part of your project only in Xcode, separate from other parts of your multiplatform project. These other parts could 
be built in Intellij IDEA. 

Moreover, every time you added a dependency on an Objective-C library stored in CocoaPods (Pod library), you had to switch 
from IntelliJ IDEA to Xcode, call `pod install`, and run the Xcode build there. 

Now you can manage Pod dependencies right in Intellij IDEA while enjoying the benefits it provides for working with code, 
such as code highlighting and completion. You can also build the whole Kotlin project with Gradle, without having to 
switch to Xcode. This means you only have to go to Xcode when you need to write Swift/Objective-C code or run your application 
on a simulator or device.

Now you can also work with Pod libraries stored locally.

Depending on your needs, you can add dependencies between:
* A Kotlin project and Pod libraries stored remotely in the CocoaPods repository or stored locally on your machine.
* A Kotlin Pod (Kotlin project used as a CocoaPods dependency) and an Xcode project with one or more targets.

Complete the initial configuration, and when you add a new dependency to `cocoapods`, just re-import the project in IntelliJ IDEA. 
The new dependency will be added automatically. No additional steps are required.

Learn [how to add dependencies](native/cocoapods.html).
