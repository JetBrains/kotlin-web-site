[//]: # (title: Interoperability with JavaScript)

Kotlin/Wasm allows you to use both JavaScript code in Kotlin and Kotlin code in JavaScript.

As with [Kotlin/JS](js-overview.md), the Kotlin/Wasm compiler also has interoperability with JavaScript. If you are 
familiar with Kotlin/JS interoperability, you can notice that Kotlin/Wasm interoperability is similar. However,
there are key differences to consider.

> Kotlin/Wasm is [Alpha](components-stability.md). It may be changed at any time. Use it in scenarios before production. 
> We would appreciate your feedback in [YouTrack](https://youtrack.jetbrains.com/issue/KT-56492).
>
{style="note"}

## Use JavaScript code in Kotlin

Learn how to use JavaScript code in Kotlin by using `external` declarations, functions with JavaScript code snippets, 
and the `@JsModule` annotation.

### External declarations

External JavaScript code is not visible in Kotlin by default.
To use JavaScript code in Kotlin, you can describe its API with `external` declarations.

#### JavaScript functions

Consider this JavaScript function: 

```javascript
function greet (name) {
    console.log("Hello, " + name + "!");
}
```

You can declare it in Kotlin as an `external` function:

```kotlin
external fun greet(name: String)
```

External functions don't have bodies, and you can call it as a regular Kotlin function:

```kotlin
fun main() {
    greet("Alice")
}
```

#### JavaScript properties

Consider this global JavaScript variable:

```javascript
let globalCounter = 0;
```

You can declare it in Kotlin using external `var` or `val` properties:

```kotlin
external var globalCounter: Int
```

These properties are initialized externally. The properties can't have `= value` initializers in Kotlin code.

#### JavaScript classes

Consider this JavaScript class:

```javascript
class Rectangle {
    constructor (height, width) {
        this.height = height;
        this.width = width;
    }

    area () {
        return this.height * this.width;
    }
}
```

You can use it in Kotlin as an external class:

```kotlin
external class Rectangle(height: Double, width: Double) : JsAny {
    val height: Double
    val width: Double
    fun area(): Double
}
```

All declarations inside the `external` class are implicitly considered external.

#### External interfaces

You can describe the shape of a JavaScript object in Kotlin. Consider this JavaScript function and what it returns:

```javascript
function createUser (name, age) {
    return { name: name, age: age };
}
```

See how its shape can be described in Kotlin with an `external interface User` type:

```kotlin
external interface User : JsAny {
    val name: String
    val age: Int
}

external fun createUser(name: String, age: Int): User
```

External interfaces don't have runtime type information and are a compile-time-only concept.
Therefore, external interfaces have some restrictions compared to regular interfaces:
* You can't use them on the right-hand side of `is` checks.
* You can't use them in class literal expressions (such as `User::class`).
* You can't pass them as reified type arguments.
* Casting with `as` to external interfaces always succeed.

#### External objects

Consider these JavaScript variables holding an object:

```javascript
let Counter = {
    value: 0,
    step: 1,
    increment () {
        this.value += this.step;
    }
};
```

You can use them in Kotlin as an external object:

```kotlin
external object Counter : JsAny {
    fun increment()
    val value: Int
    var step: Int
}
```

#### External type hierarchy

Similar to regular classes and interfaces, you can declare external declarations to extend other external classes and implement external interfaces.
However, you can't mix external and non-external declarations in the same type hierarchy.

### Kotlin functions with JavaScript code

You can add a JavaScript snippet to Kotlin/Wasm code by defining a function with `= js("code")` body:

```kotlin
fun getCurrentURL(): String =
    js("window.location.href")
```

If you want to run a block of JavaScript statements, surround your code inside the string with curly brackets `{}`:

```kotlin
fun setLocalSettings(value: String): Unit = js(
    """{
        localStorage.setItem('settings', value);
}"""
)
```

If you want to return an object, surround the curly brackets `{}` with parentheses `()`:

```kotlin
fun createJsUser(name: String, age: Int): JsAny =
    js("({ name: name, age: age })")
```

Kotlin/Wasm treats calls to the `js()` function in a special way, and the implementation has some restrictions:
* A `js()` function call must be provided with a string literal argument.
* A `js()` function call must be the only expression in the function body.
* The `js()` function is only allowed to be called from package-level functions.
* The function return type must be provided explicitly.
* [Types](#type-correspondence) are restricted, similar to `external fun`.

The Kotlin compiler puts the code string into a function in the generated JavaScript file and imports it into WebAssembly format.
The Kotlin compiler doesn't verify these JavaScript snippets.
If there are JavaScript syntax errors, they are reported when you run your JavaScript code.

> The `@JsFun` annotation has similar functionality and will likely be deprecated.
>
{style="note"}

### JavaScript modules

By default, external declarations correspond to the JavaScript global scope. If you annotate a Kotlin file with the
[`@JsModule` annotation](js-modules.md#jsmodule-annotation), then all external declarations within it are imported from the specified module.

Consider this JavaScript code sample:

```javascript
// users.mjs
export let maxUsers = 10;

export class User {
    constructor (username) {
        this.username = username;
    }
}
```

Use this JavaScript code in Kotlin with the `@JsModule` annotation:

```kotlin
// Kotlin
@file:JsModule("./users.mjs")

external val maxUsers: Int

external class User : JsAny {
    constructor(username: String)

    val username: String
}
```

### Array interoperability

You can copy JavaScript's `JsArray<T>` into Kotlin's native `Array` or `List` types; likewise, 
you can copy these Kotlin types to `JsArray<T>`.

To convert `JsArray<T>` to `Array<T>` or the other way around, use one of the available [adapter functions](https://github.com/Kotlin/kotlinx-browser/blob/dfbdceed314567983c98f1d66e8c2e10d99c5a55/src/wasmJsMain/kotlin/arrayCopy.kt).

Here's an example of conversion between generic types:

```kotlin
val list: List<JsString> =
    listOf("Kotlin", "Wasm").map { it.toJsString() }

// Uses .toJsArray() to convert List or Array to JsArray
val jsArray: JsArray<JsString> = list.toJsArray()

// Uses .toArray() and .toList() to convert it back to Kotlin types 
val kotlinArray: Array<JsString> = jsArray.toArray()
val kotlinList: List<JsString> = jsArray.toList()
```

Similar adapter functions are available for converting typed arrays to their Kotlin equivalents
(for example, `IntArray` and `Int32Array`). For detailed information and implementation,
see the [`kotlinx-browser` repository]( https://github.com/Kotlin/kotlinx-browser/blob/dfbdceed314567983c98f1d66e8c2e10d99c5a55/src/wasmJsMain/kotlin/arrayCopy.kt).

Here's an example of conversion between typed arrays:

```kotlin
import org.khronos.webgl.*

    // ...

    val intArray: IntArray = intArrayOf(1, 2, 3)
    
    // Uses .toInt32Array() to convert Kotlin IntArray to JavaScript Int32Array
    val jsInt32Array: Int32Array = intArray.toInt32Array()
    
    // Uses toIntArray() to convert JavaScript Int32Array back to Kotlin IntArray
    val kotlnIntArray: IntArray = jsInt32Array.toIntArray()
```

## Use Kotlin code in JavaScript

Learn how to use your Kotlin code in JavaScript by using the `@JsExport` annotation.

### Functions with the @JsExport annotation

To make a Kotlin/Wasm function available to JavaScript code, use the `@JsExport` annotation:

```kotlin
// Kotlin/Wasm

@JsExport
fun addOne(x: Int): Int = x + 1
```

Kotlin/Wasm functions marked with the `@JsExport` annotation are visible as properties on a `default` export of the generated `.mjs` module.
You can then use this function in JavaScript:

```javascript
// JavaScript

import exports from "./module.mjs"

exports.addOne(10)
```

The Kotlin/Wasm compiler is capable of generating TypeScript definitions from any `@JsExport` declarations in your Kotlin code. 
These definitions can be used by IDEs and JavaScript tools to provide code autocompletion, help with type-checks, and make it easier to consume Kotlin code from JavaScript and TypeScript.

The Kotlin/Wasm compiler collects any top-level functions marked with the `@JsExport` annotation and automatically generates TypeScript definitions in a `.d.ts` file.

To generate TypeScript definitions, in your `build.gradle.kts` file in the `wasmJs{}` block, add the `generateTypeScriptDefinitions()` function:

```kotlin
kotlin {
    wasmJs {
        binaries.executable()
        browser {
        }
        generateTypeScriptDefinitions()
    }
}
```

> Generating TypeScript declaration files in Kotlin/Wasm is [Experimental](components-stability.md#stability-levels-explained).
> It may be dropped or changed at any time.
>
{style="warning"}

## Type correspondence

Kotlin/Wasm allows only certain types in signatures of JavaScript interop declarations.
These limitations apply uniformly to declarations with `external`, `= js("code")` or `@JsExport`.

See how Kotlin types correspond to Javascript types:

| Kotlin                                                     | JavaScript                        |
|------------------------------------------------------------|-----------------------------------|
| `Byte`, `Short`, `Int`, `Char`, `UByte`, `UShort`, `UInt`, | `Number`                          |
| `Float`, `Double`,                                         | `Number`                          |
| `Long`, `ULong`,                                           | `BigInt`                          |
| `Boolean`,                                                 | `Boolean`                         |
| `String`,                                                  | `String`                          |
| `Unit` in return position                                  | `undefined`                       |
| Function type, for example `(String) -> Int`               | Function                          |
| `JsAny` and subtypes                                       | Any JavaScript value              |
| `JsReference`                                              | Opaque reference to Kotlin object |
| Other types                                                | Not supported                     |

You can use nullable versions of these types as well.

### JsAny type

JavaScript values are represented in Kotlin using the `JsAny` type and its subtypes.

The Kotlin/Wasm standard library provides representation for some of these types:
* Package `kotlin.js`:
    * `JsAny`
    * `JsBoolean`, `JsNumber`, `JsString`
    * `JsArray`
    * `Promise`

You can also create custom `JsAny` subtypes by declaring an `external` interface or class.

### JsReference type

Kotlin values can be passed to JavaScript as opaque references using the `JsReference` type.

For example, if you want to expose this Kotlin class `User` to JavaScript:

```kotlin
class User(var name: String)
```

You can use the `toJsReference()` function to create `JsReference<User>` and return it to JavaScript:

```kotlin
@JsExport
fun createUser(name: String): JsReference<User> {
    return User(name).toJsReference()
}
```

These references aren't directly available in JavaScript and behave like empty frozen JavaScript objects.
To operate on these objects, you need to export more functions to JavaScript using the `get()` method where you unwrap the 
reference value:

```kotlin
@JsExport
fun setUserName(user: JsReference<User>, name: String) {
    user.get().name = name
}
```

You can create a class and change its name from JavaScript:

```javascript
import UserLib from "./userlib.mjs"

let user = UserLib.createUser("Bob");
UserLib.setUserName(user, "Alice");
```

### Type parameters

JavaScript interop declarations can have type parameters if they have an upper bound of `JsAny` or its subtypes. For example:

```kotlin
external fun <T : JsAny> processData(data: JsArray<T>): T
```

## Exception handling

You can use Kotlin `try-catch` expression to catch JavaScript exceptions.
However, accessing specific details about the thrown value in Kotlin/Wasm isn’t possible by default.

You can configure the `JsException` type to include the original error message and stack trace from JavaScript.
To do so, add the following compiler option to your `build.gradle.kts` file:

```kotlin
kotlin {
    wasmJs {
        compilerOptions {
            freeCompilerArgs.add("-Xwasm-attach-js-exception")
        }
    }
}
```

This behavior depends on the `WebAssembly.JSTag` API, which is only available in certain browsers:

* **Chrome:** Supported from version 115
* **Firefox:** Supported from version 129
* **Safari:** Not yet supported

Here’s an example demonstrating this behavior:

```kotlin
external object JSON {
    fun <T: JsAny> parse(json: String): T
}

fun main() {
    try {
        JSON.parse("an invalid JSON")
    } catch (e: JsException) {
        println("Thrown value is: ${e.thrownValue}")
        // SyntaxError: Unexpected token 'a', "an invalid JSON" is not valid JSON

        println("Message: ${e.message}")
        // Message: Unexpected token 'a', "an invalid JSON" is not valid JSON

        println("Stacktrace:")
        // Stacktrace:

        // Prints the full JavaScript stack trace 
        e.printStackTrace()
    }
}
```

With the `-Xwasm-attach-js-exception` compiler option enabled, the `JsException` type provides specific details from the JavaScript error.
Without enabling this compiler option, `JsException` includes only a generic message stating that an exception was thrown while running JavaScript code.

If you try to use a JavaScript `try-catch` expression to catch Kotlin/Wasm exceptions, it looks like a
generic `WebAssembly.Exception` without directly accessible messages and data.

## Kotlin/Wasm and Kotlin/JS interoperability differences

Although Kotlin/Wasm interoperability shares similarities with Kotlin/JS interoperability, there are key differences to consider:

|                         | **Kotlin/Wasm**                                                                                                                                                                                                     | **Kotlin/JS**                                                                                                                                       |
|-------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|
| **External enums**      | Doesn't support external enum classes.                                                                                                                                                                              | Supports external enum classes.                                                                                                                     |
| **Type extensions**     | Doesn't support non-external types to extend external types.                                                                                                                                                        | Supports non-external types.                                                                                                                        |
| **`JsName` annotation** | Only has an effect when annotating external declarations.                                                                                                                                                           | Can be used to change names of regular non-external declarations.                                                                                   |
| **`js()` function**       | `js("code")` function calls are allowed as a single expression body of package-level functions.                                                                                                                     | The `js("code")` function can be called in any context and returns a `dynamic` value.                                                               |
| **Module systems**      | Supports ES modules only. There is no analog of the `@JsNonModule` annotation. Provides its exports as properties on the `default` object. Allows exporting package-level functions only.                           | Supports ES modules and legacy module systems. Provides named ESM exports. Allows exporting classes and objects.                                    |
| **Types**               | Applies stricter type restrictions uniformly to all interop declarations `external`, `= js("code")`, and `@JsExport`. Allows a select number of [built-in Kotlin types and `JsAny` subtypes](#type-correspondence). | Allows all types in `external` declarations. Restricts [types that can be used in `@JsExport`](js-to-kotlin-interop.md#kotlin-types-in-javascript). |
| **Long**                | Type corresponds to JavaScript `BigInt`.                                                                                                                                                                            | Visible as a custom class in JavaScript.                                                                                                            |
| **Arrays**              | Not supported in interop directly yet. You can use the new `JsArray` type instead.                                                                                                                                  | Implemented as JavaScript arrays.                                                                                                                   |
| **Other types**         | Requires `JsReference<>` to pass Kotlin objects to JavaScript.                                                                                                                                                      | Allows the use of non-external Kotlin class types in external declarations.                                                                         |
| **Exception handling**  | You can catch any JavaScript exception with the `JsException` and `Throwable` types.                                                                                                                                | Can catch JavaScript `Error` using the `Throwable` type. It can catch any JavaScript exception using the `dynamic` type.                            |
| **Dynamic types**       | Does not support the `dynamic` type. Use `JsAny` instead (see sample code below).                                                                                                                                   | Supports the `dynamic` type.                                                                                                                        |

> Kotlin/JS [dynamic type](dynamic-type.md) for interoperability with untyped or loosely typed objects is not
> supported in Kotlin/Wasm. Instead of `dynamic` type, you can use `JsAny` type:
>
> ```kotlin
> // Kotlin/JS
> fun processUser(user: dynamic, age: Int) {
>     // ...
>     user.profile.updateAge(age)
>     // ...
> }
>
> // Kotlin/Wasm
> private fun updateUserAge(user: JsAny, age: Int): Unit =
>     js("{ user.profile.updateAge(age); }")
>
> fun processUser(user: JsAny, age: Int) {
>     // ...
>     updateUserAge(user, age)
>     // ...
> }
> ```
>
{style="note"}

## Web-related browser APIs

The [`kotlinx-browser` library](https://github.com/kotlin/kotlinx-browser) is a standalone
library that provides JavaScript browser APIs, including:
* Package `org.khronos.webgl`:
  * Typed arrays, like `Int8Array`.
  * WebGL types.
* Packages `org.w3c.dom.*`:
  * DOM API types.
* Package `kotlinx.browser`:
  * DOM API global objects, like `window` and `document`.

To use the declarations from the `kotlinx-browser` library, add it as a dependency in your
project's build configuration file:

```kotlin
val wasmJsMain by getting {
    dependencies {
        implementation("org.jetbrains.kotlinx:kotlinx-browser:0.3")
    }
}
```
