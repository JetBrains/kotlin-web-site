---
type: doc
layout: reference
category: "Syntax"
title: "Opt-in Requirements"
---

# Opt-in Requirements

> The opt-in requirement annotations `@RequiresOptIn` and `@OptIn` are *experimental*. 
> See the usage details [below](#experimental-status-of-the-opt-in-requirements).
{:.note} 

> `@RequireOptIn` and `@OptIn` annotations were introduced in 1.3.70 to replace previously used `@Experimental` and `@UseExperimental`;
> at the same time, `-Xopt-in` compiler option replaced `-Xuse-experimental`.
{:.note} 


The Kotlin standard library provides a mechanism for requiring and giving explicit consent for using certain elements of APIs.
This mechanism lets library developers inform users of their APIs about specific conditions that require opt-in,
for example, if an API is in the experimental state and is likely to change in the future. 

To prevent potential issues, the compiler warns users of such APIs about these conditions and
requires them to opt in before using the API.

## Opting in to using API

If a library author marks a declaration from a library's API as [_requiring opt-in_](#requiring-opt-in-for-api),
you should give an explicit consent for using it in your code. 
There are several ways to opt in to such APIs, all applicable without technical limitations.
You are free to choose the way that you find best for your situation. 

### Propagating opt-in

When you use an API in the code intended for third-party use (a library), you can propagate its opt-in requirement to your API as well.
To do this, annotate your declaration with the [_opt-in requirement annotation_](#opt-in-requirement-annotations) of the API used in its body.
This enables you to use the API elements marked with this annotation.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
// library code
@RequiresOptIn(message = "This API is experimental. It may be changed in the future without notice.")
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION)
annotation class MyDateTime // Opt-in requirement annotation

@MyDateTime                            
class DateProvider // A class requiring opt-in
```

</div>

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
// client code
fun getYear(): Int {  
    val dateProvider: DateProvider // Error: DateProvider requires opt-in
    // ...
}

@MyDateTime
fun getDate(): Date {  
    val dateProvider: DateProvider // OK: the function requires opt-in as well
    // ...
}

fun displayDate() {
    println(getDate()) // error: getDate() requires opt-in
}
```

</div>

As you can see in this example, the annotated function appears to be a part of the `@MyDateTime` API.
So, such an opt-in propagates the opt-in requirement to the client code; its clients will see the same warning message
and be required to consent as well.
To use multiple APIs that require opt-in, mark the declaration with all their opt-in requirement annotations.

### Non-propagating use

In modules that don't expose their own API, such as applications, you can opt in to using APIs without propagating
the opt-in requirement to your code. In this case, mark your declaration with [@OptIn](/api/latest/jvm/stdlib/kotlin/-opt-in/index.html)
 passing the opt-in requirement annotation as its argument:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
// library code
@RequiresOptIn(message = "This API is experimental. It may be changed in the future without notice.")
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION)
annotation class MyDateTime // Opt-in requirement annotation

@MyDateTime                            
class DateProvider // A class requiring opt-in
```

</div>

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
//client code
@OptIn(MyDateTime::class)
fun getDate(): Date { // Uses DateProvider; doesn't propagate the opt-in requirement
    val dateProvider: DateProvider
    // ...
}

fun displayDate() {
    println(getDate()) // OK: opt-in is not required
}
```

</div>

When somebody calls the function `getDate()`, they won't be informed about the opt-in requirements for APIs used in its body. 

To use an API that requires opt-in in all functions and classes in a file, add the file-level annotation `@file:OptIn`
to the top of the file before the package specification and imports.

<div class="sample" markdown="1" theme="idea" data-highlight-only>
 
 ```kotlin
 //client code
 @file:OptIn(MyDateTime::class)
 ```
 
 </div>

### Module-wide opt-in

If you don't want to annotate every usage of APIs that require opt-in, you can opt in to them for your whole module.
To opt in to using an API in a module, compile it with the argument `-Xopt-in`,
specifying the fully qualified name of the opt-in requirement annotation of the API you use: `-Xopt-in=org.mylibrary.OptInAnnotation`.
Compiling with this argument has the same effect as if every declaration in the module had the annotation`@OptIn(OptInAnnotation::class)`.

If you build your module with Gradle, you can add arguments like this:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
compileKotlin {
    kotlinOptions {
        freeCompilerArgs += "-Xopt-in=org.mylibrary.OptInAnnotation"
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
tasks.withType<KotlinCompile>().all {
    kotlinOptions.freeCompilerArgs += "-Xopt-in=org.mylibrary.OptInAnnotation"
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
            useExperimentalAnnotation('org.mylibrary.OptInAnnotation')
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
        languageSettings.useExperimentalAnnotation("org.mylibrary.OptInAnnotation")
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
                    <arg>-Xopt-in=org.mylibrary.OptInAnnotation</arg>                    
                </args>
            </configuration>
        </plugin>
    </plugins>
</build>
```

</div>

To opt in to multiple APIs on the module level, add one of the described arguments for each opt-in requirement marker used in your module.

## Requiring opt-in for API 

### Opt-in requirement annotations

If you want to require explicit consent to using your module's API, create an annotation class to use as an _opt-in requirement annotation_.
This class must be annotated with [@RequiresOptIn](/api/latest/jvm/stdlib/kotlin/-requires-opt-in/index.html):

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
@RequiresOptIn
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION)
annotation class MyDateTime
```

</div>

Opt-in requirement annotations must meet several requirements:
* `BINARY` [retention](/api/latest/jvm/stdlib/kotlin.annotation/-annotation-retention/index.html)
* No `EXPRESSION` and `FILE` among [targets](/api/latest/jvm/stdlib/kotlin.annotation/-annotation-target/index.html)
* No parameters.

An opt-in requirement can have one of two severity [levels](/api/latest/jvm/stdlib/kotlin/-requires-opt-in/-level/index.html):
* `RequiresOptIn.Level.ERROR`. Opt-in is mandatory. Otherwise, the code that uses marked API won't compile. Default level.
* `RequiresOptIn.Level.WARNING`. Opt-in is not mandatory, but advisable. Without it, the compiler raises a warning.

To set the desired level, specify the `level` parameter of the `@RequiresOptIn` annotation.

Additionally, you can provide a `message` to inform API users about special condition of using the API. 
The compiler will show it to users that use the API without opt-in.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
@RequiresOptIn(level = RequiresOptIn.Level.WARNING, message = "This API is experimental. It can be incompatibly changed in the future.")
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION)
annotation class ExperimentalDateTime
```

</div>

If you publish multiple independent features that require opt-in, declare an annotation for each.
This makes the use of API safer for your clients: they can use only the features that they explicitly accept.
This also lets you remove the opt-in requirements from the features independently.

### Marking API elements

To require an opt-in to using an API element, annotate its declaration with an opt-in requirement annotation:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
@MyDateTime
class DateProvider

@MyDateTime
fun getTime(): Time {}
```

</div>


## Opt-in requirements for experimental APIs

If you use opt-in requirements for features in the experimental state, carefully handle the API graduation to avoid 
breaking the client code.

Once your experimental API graduates and is released in a stable state, remove its opt-in requirement annotations from declarations.
The clients will be able to use them without restriction. However, you should leave the annotation classes in modules so that 
the existing client code remains compatible.

To let the API users update their modules accordingly (remove the annotations 
from their code and recompile), mark the annotations as [`@Deprecated`](/api/latest/jvm/stdlib/kotlin/-deprecated/index.html)
and provide the explanation in the deprecation message.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
@Deprecated("This opt-in requirement is not used anymore. Remove its usages from your code.")
@RequiresOptIn
annotation class ExperimentalDateTime
```

</div>

## Experimental status of the opt-in requirements

The opt-in requirement mechanism is experimental in Kotlin 1.3.
This means that in future releases it may be changed in ways that make it incompatible.

To make the users of annotations `@OptIn` and `@RequiresOptIn` aware of their experimental status,
the compiler raises warnings when compiling the code with these annotations:

```This class can only be used with the compiler argument '-Xopt-in=kotlin.RequiresOptIn'```

 To remove the warnings, add the compiler argument `-Xopt-in=kotlin.RequiresOptIn`.
