[//]: # (title: Use dependencies from npm)

In Kotlin/JS projects, all dependencies can be managed through the Gradle plugin. This includes Kotlin/Multiplatform
libraries such as `kotlinx.coroutines`, `kotlinx.serialization`, or `ktor-client`.

For depending on JavaScript packages from [npm](https://www.npmjs.com/), the Gradle DSL exposes an `npm` function that
lets you specify packages you want to import from npm. Let's consider the import of an NPM package called [`is-sorted`](https://www.npmjs.com/package/is-sorted).

The corresponding part in the Gradle build file looks as follows:

```kotlin
dependencies {
    // ...
    implementation(npm("is-sorted", "1.0.5"))
}
```

Because JavaScript modules are usually dynamically typed and Kotlin is a statically typed language, you need to provide
a kind of adapter. In Kotlin, such adapters are called _external declarations_. For the `is-sorted` package which offers
only one function, this declaration is small to write. Inside the source folder, create a new file called `is-sorted.kt`,
and fill it with these contents:

```kotlin
@JsModule("is-sorted")
@JsNonModule
external fun <T> sorted(a: Array<T>): Boolean
```

Please note that if you're using CommonJS as a target, the `@JsModule` and `@JsNonModule` annotations need to be adjusted
accordingly.

This JavaScript function can now be used just like a regular Kotlin function. Because we provided type information in the
header file (as opposed to simply defining parameter and return type to be `dynamic`), proper compiler support and
type-checking is also available.

```kotlin
console.log("Hello, Kotlin/JS!")
console.log(sorted(arrayOf(1,2,3)))
console.log(sorted(arrayOf(3,1,2)))
```

Running these three lines either in the browser or Node.js, the output shows that the call to `sorted` was properly mapped
to the function exported by the `is-sorted` package:

```kotlin
Hello, Kotlin/JS!
true
false
```

Because the JavaScript ecosystem has multiple ways of exposing functions in a package (for example through named or default
exports), other npm packages might need a slightly altered structure for their external declarations.

To learn more about how to write declarations, please refer to [Calling JavaScript from Kotlin](js-interop.md).