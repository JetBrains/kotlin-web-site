---
type: doc
layout: reference
category: "Syntax"
title: "Experimental API Markers"
---

# Experimental API Markers
> The annotations for marking and using experimental APIs (`@Experimental` and `@UseExperimental`) are *experimental* in Kotlin 1.3. See details [below](#experimental-status-of-experimental-api-markers).

The Kotlin standard library provides developers with a mechanism for creating and using _experimental_ APIs. This mechanism lets library authors inform users that certain components of their API, such as classes or functions, are unstable and are likely to change in the future. Such changes may require rewriting and recompiling the client code. To prevent potential compatibility issues, the compiler warns users of the experimental status of such APIs and may require them to give their explicit consent to use the API.

## Using experimental APIs

If a class or a function from a library is marked by its author as experimental, using it in your code will produce warnings or compilation errors unless you explicitly accept their experimental status. 
There are several ways to accept the experimental status of API elements; all of them are applicable without technical limitations. You are free to choose the way that you find best for your situation. 

### Propagating use

When you use an experimental API in the code intended for third-party use (a library), you can mark your API as experimental as well. To do this, annotate your declaration with the _experimental marker annotation_ of the API used in its body. This enables you to use the API elements annotated with this marker.

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
// library code
@Experimental
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION)
annotation class ShinyNewAPI            // Experimental API marker

@ShinyNewAPI                            
class NewClass                              // Experimental class
```
</div>

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
// client code
fun useNewClass( myObject: NewClass) { } // error: NewClass is experimental

@ShinyNewAPI
fun useWithPropagation() {  
    var myObject: NewClass  // OK: the function is marked as experimental
}

fun usePropagatingFunction() {
    useWithPropagation() // error: useWithPropagation() is experimental, acceptance is required
}
```
</div>

As you can see in this example, the annotated function appears to be a part of the `@ShinyNewAPI` experimental API. So, the described way of acceptance propagates the experimental status to the code that uses an experimental API; its clients will be required to accept it as well.
To use multiple experimental APIs, annotate the declaration with all their markers.

### Non-propagating use

In modules that don't provide their own API, such as application modules, you can use experimental APIs without propagating the experimental status to your code. In this case, mark your code with the [@UseExperimental(Marker::class)](/api/latest/jvm/stdlib/kotlin/-use-experimental/index.html) annotation specifying the marker annotation of the experimental API:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
// library code
@Experimental
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION)
annotation class ShinyNewAPI            // Experimental API marker

@ShinyNewAPI                            
class NewClass                              // Experimental class
```
</div>

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
//client code
@UseExperimental(ShinyNewAPI::class)
fun useWithoutPropagation() {                   // uses NewClass; doesn't expose the experimental status
    var myObject: NewClass
}

fun useNonPropagatingFunction() {
    useWithoutPropagation()                     // OK: useWithoutPropagation() is not experimental
}
```
</div>

When somebody calls the function `useWithoutPropagation()`, they won't be informed about the experimental API used in its body. 

### Module-wide use

If you don't want to annotate every usage of experimental APIs in your code, you can accept the experimental status for your whole module. Module-wide use of experimental APIs can be propagating and non-propagating as well:
* To accept and propagate the experimental status to your whole module, compile the module with the argument `-Xexperimental=org.foo.ShinyNewAPI`, where `org.foo.ShinyNewAPI` is the fully qualified name of the marker annotation. Note that in this case, _every declaration_ in the module becomes experimental. The use of the module requires the acceptance of its experimental status as well.
* To accept the experimental status without propagation, compile the module with the argument `Xuse-experimental`, specifying the marker of the API used in the module: `-Xuse-experimental=org.foo.ShinyNewApi`. Compiling with this argument has the same effect as every declaration in the module having the annotation`@UseExperimental(ShinyNewAPI::class)`.

If you build your module with Gradle, you can add arguments like this:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
compileKotlin {
    kotlinOptions {
        freeCompilerArgs += "-Xexperimental=org.foo.ShinyNewAPI"
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
import org.jetbrains.kotlin.gradle.tasks.KotlinCompile
// ...

val compileKotlin: KotlinCompile by tasks

compileKotlin.kotlinOptions.freeCompilerArgs += "-Xexperimental=org.foo.ShinyNewAPI"
```

</div>
</div>

For Maven, it would be:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```xml
<build>
<plugins>
    <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-compiler-plugin</artifactId>
        <version>3.3</version>
        <configuration>
            <source>1.8</source>
            <target>1.8</target>
            <forceJavacCompilerUse>true</forceJavacCompilerUse>
            <fork>true</fork>
            <compilerArgs>
                <arg>-Xexperimental=org.foo.ShinyNewAPI</arg>
            </compilerArgs>
        </configuration>
    </plugin>
</plugins>
</build>
```
</div>

To accept the usage of multiple experimental APIs on the module level, add one of the described arguments for each experimental API marker used in your module.

## Marking experimental API 

### Creating marker annotations

If you want to declare your module's API as experimental, create an annotation class to use as its _experimental marker_. This class must be annotated with [@Experimental](/api/latest/jvm/stdlib/kotlin/-experimental/index.html):

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
@Experimental
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION)
annotation class ShinyNewAPI
```
</div>

Experimental marker annotations must meet several requirements:
* `BINARY` [retention](/api/latest/jvm/stdlib/kotlin.annotation/-annotation-retention/index.html)
* No `EXPRESSION` and `FILE` among [targets](/api/latest/jvm/stdlib/kotlin.annotation/-annotation-target/index.html)
* No parameters.

A marker annotation can have one of two severity [levels](/api/latest/jvm/stdlib/kotlin/-experimental/-level/index.html) of informing about experimental API usage:
* `Experimental.Level.ERROR`. Acceptance is required. Otherwise, the code that uses marked API won't compile. This level is used by default.
* `Experimental.Level.WARNING`. Acceptance is not required. Without it, the compiler raises a warning.
To set the desired level, specify the `level` parameter of the `@Experimental` annotation.

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
@Experimental(level = Experimental.Level.WARNING)
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION)
annotation class ShinyNewAPI
```
</div>

If you publish several features in the experimental state, declare a marker for each. Separate markers make the use of experimental features safer for your clients: they'll be able to use only the features that they explicitly accept.

### Marking API elements

To mark an API element as experimental, annotate its declaration with your experimental marker annotation:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
@ShinyNewAPI
class Foo

@ShinyNewAPI
fun bar() {}
```
</div>

### Module-wide markers
If you consider all the APIs of your module experimental, you can mark the entire module as such. To build an experimental module, declare an experimental API marker and compile the module with the command line argument `-Xexperimental=org.foo.ShinyNewAPI`, where `org.foo.ShinyNewAPI` is the fully qualified name of the marker. Compiling with this argument has the same effect as every declaration in the module having the annotation `@ShinyNewAPI`. 

## Graduation of experimental API
Once your experimental API graduates and is released in its final state, remove its marker annotation from declarations so that clients can use it without restriction. However, you should leave the marker classes in the modules so that the existing client code remains compatible. To let the API users update their modules accordingly (remove the markers from their code and recompile), complete a deprecation cycle for the marker classes.

## Experimental status of experimental API markers
The described mechanism for marking and using experimental APIs is itself experimental in Kotlin 1.3. This means that in future releases it may be changed in ways that make it incompatible. To make the users of annotations `@Experimental` and `UseExperimental` aware of their experimental status, the compiler raises warnings when compiling the code with these annotations. To remove the warnings, specify the compiler argument `-Xuse-experimental=kotlin.Experimental`.
