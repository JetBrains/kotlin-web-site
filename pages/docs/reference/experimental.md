---
type: doc
layout: reference
category: "Syntax"
title: "Experimental API Markers"
---

# Experimental API Markers

> The annotations for marking experimental APIs (`@RequiresOptIn`) and opting in to using them (`@OptIn`) are *experimental* in Kotlin 1.3.
> See details [below](#experimental-status-of-the-opt-in-annotations).
{:.note}

The Kotlin standard library provides developers with a mechanism for creating and using _experimental_ APIs. 
This mechanism lets library authors inform users that certain components of their API, such as classes or functions, 
are unstable and likely to change in the future. Such changes may require rewriting and recompiling the client code.
To prevent potential compatibility issues, the compiler warns users about the experimental status of such APIs and
requires them to opt in before using the API.

## Experimental API opt-in

If a declaration from a library is marked by its author as [experimental](#marking-experimental-api),
you should explicitly opt in to get able to use it in your code. 
There are several ways to opt in to the experimental APIs, all applicable without technical limitations.
You are free to choose the way that you find best for your situation. 

### Propagating opt-in

When you use an experimental API in the code intended for third-party use (a library), you can mark your API experimental as well.
To do this, annotate your declaration with the [_experimental marker annotation_](#marking-experimental-api) of the API used in its body.
This enables you to use the API elements annotated with this marker.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
// library code
@RequiresOptIn
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION)
annotation class ExperimentalDateTime // Experimental API marker

@ExperimentalDateTime                            
class DateProvider // Experimental class, requires opt-in
```

</div>

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
// client code
fun getYear(): Int {  
    val dateProvider: DateProvider // Error: DateProvider requires opt-in
    // ...
}

@ExperimentalDateTime
fun getDate(): Date {  
    val dateProvider: DateProvider // OK: the function is marked as experimental
    // ...
}

fun displayDate() {
    println(getDate()) // error: getDate() is experimental, opt-in is required
}
```

</div>

As you can see in this example, the annotated function appears to be a part of the `@ExperimentalDateTime` experimental API.
So, such an opt-in acceptance propagates the experimental status to client code; its clients will be required to opt in as well.
To use multiple experimental APIs, annotate the declaration with all their markers.

### Non-propagating use

In modules that don't expose their own API, such as applications, you can opt in to experimental APIs without propagating
the experimental status to your code. In this case, mark your code with the [@OptIn(Marker::class)](/api/latest/jvm/stdlib/kotlin/-opt-in/index.html)
annotation specifying the marker annotation of the experimental API:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
// library code
@RequiresOptIn
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION)
annotation class ExperimentalDateTime // Experimental API marker

@ExperimentalDateTime                            
class DateProvider // Experimental class
```

</div>

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
//client code
@OptIn(ExperimentalDateTime::class)
fun getDate(): Date { // Uses DateProvider; doesn't expose the experimental status
    val dateProvider: DateProvider
    // ...
}

fun displayDate() {
    println(getDate()) // OK: getDate() is not experimental; opt-in is not required
}
```

</div>

When somebody calls the function `getDate()`, they won't be informed about the experimental API used in its body. 

To use an experimental API in all functions and classes in a file, add the file-level annotation `@file:OptIn`
to the top of the file before the package specification and imports.

<div class="sample" markdown="1" theme="idea" data-highlight-only>
 
 ```kotlin
 //client code
 @file:OptIn(ExperimentalDateTime::class)
 ```
 
 </div>

### Module-wide opt-in

If you don't want to annotate every usage of experimental APIs in your code, you can opt in to them for your whole module.
To opt in to using an experimental API in a module, compile it with the argument `-Xopt-in`,
specifying the fully qualified name of the experimental API marker: `-Xopt-in=org.mylibrary.ExperimentalMarker`.
Compiling with this argument has the same effect as if every declaration in the module had the annotation`@OptIn(ExperimentalMarker::class)`.

If you build your module with Gradle, you can add arguments like this:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
compileKotlin {
    kotlinOptions {
        freeCompilerArgs += "-Xopt-in=org.mylibrary.ExperimentalMarker"
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
tasks.withType<KotlinCompile>().all {
    kotlinOptions.freeCompilerArgs += "-Xopt-in=org.mylibrary.ExperimentalMarker"
}
```

</div>
</div>

If your Gradle module is a multiplatform module, use the `useExperimentalAnnotation` method:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
sourceSets {
    all {
        languageSettings {
            useExperimentalAnnotation('org.mylibrary.ExperimentalMarker')
        }
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
sourceSets {
    all {
        languageSettings.useExperimentalAnnotation("org.mylibrary.ExperimentalMarker")
    }
}
```

</div>
</div>

For Maven, it would be:

<div class="sample" markdown="1" mode="xml" theme="idea" data-highlight-only>

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <version>${kotlin.version}</version>
            <executions>...</executions>
            <configuration>
                <args>
                    <arg>-Xopt-in=org.mylibrary.ExperimentalMarker</arg>                    
                </args>
            </configuration>
        </plugin>
    </plugins>
</build>
```

</div>

To opt in to multiple experimental APIs on the module level, add one of the described arguments for each experimental API marker used in your module.

## Marking experimental API 

### Creating marker annotations

If you want to declare your module's API as experimental and require an opt-in for using it, create an annotation class to use as an _experimental marker_.
This class must be annotated with [@RequiresOptIn](/api/latest/jvm/stdlib/kotlin/-requires-opt-in/index.html):

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
@RequiresOptIn
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION)
annotation class ExperimentalDateTime
```

</div>

Experimental marker annotations must meet several requirements:
* `BINARY` [retention](/api/latest/jvm/stdlib/kotlin.annotation/-annotation-retention/index.html)
* No `EXPRESSION` and `FILE` among [targets](/api/latest/jvm/stdlib/kotlin.annotation/-annotation-target/index.html)
* No parameters.

A marker annotation can have one of two severity [levels](/api/latest/jvm/stdlib/kotlin/-requires-opt-in/-level/index.html)
of informing about opt-in requirement:
* `RequiresOptIn.Level.ERROR`. Opt-in is mandatory. Otherwise, the code that uses marked API won't compile. Default level.
* `RequiresOptIn.Level.WARNING`. Opt-in is not mandatory, but advisable. Without it, the compiler raises a warning.

To set the desired level, specify the `level` parameter of the `@RequiresOptIn` annotation.

Additionally, you can provide a `message` that the compiler will show when somebody uses the experimental API without opt-in.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
@RequiresOptIn(level = RequiresOptIn.Level.WARNING, message = "This is an experimental declaration. It can be incompatibly changed in future.")
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION)
annotation class ExperimentalDateTime
```

</div>

If you publish several features in the experimental state, declare a marker for each.
Separate markers make the use of experimental features safer for your clients: they can use only the features that they explicitly accept.
This also lets you graduate the features to stable independently.

### Marking API elements

To mark an API element as experimental, annotate its declaration with your experimental marker annotation:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
@ExperimentalDateTime
class DateProvider

@ExperimentalDateTime
fun getTime(): Time {}
```

</div>


## Graduation of experimental API

Once your experimental API graduates and is released in a stable state, remove its marker annotations from declarations 
so that the clients can use it without restriction. However, you should leave the marker classes in modules so that 
the existing client code remains compatible.

To let the API users update their modules accordingly (remove the markers 
from their code and recompile), mark the annotations as [`@Deprecated`](/api/latest/jvm/stdlib/kotlin/-deprecated/index.html)
and provide the explanation in its message.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
@Deprecated("This experimental API marker is not used anymore. Remove its usages from your code.")
@RequiresOptIn
annotation class ExperimentalDateTime
```

</div>

## Experimental status of the opt-in annotations

The described mechanism for marking experimental APIs and opting in to them is itself experimental in Kotlin 1.3.
This means that in future releases it may be changed in ways that make it incompatible.

To make the users of annotations `@OptIn` and `@RequiresOptIn` aware of their experimental status,
the compiler raises warnings when compiling the code with these annotations:

```This class can only be used with the compiler argument '-Xopt-in=kotlin.RequiresOptIn'```

 To remove the warnings, add the compiler argument `-XoptIn=kotlin.OptIn`.
