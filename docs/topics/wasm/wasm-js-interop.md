[//]: # (title: Interoperability with JavaScript)

Kotlin/Wasm allows you to use both JavaScript code in Kotlin and Kotlin code in JavaScript.

As with [Kotlin/JS](js-overview.md), the Kotlin/Wasm compiler also has interoperability with JavaScript. If you are 
familiar with Kotlin/JS interoperability, you can notice that Kotlin/Wasm interoperability is similar. However,
there are key differences to consider.

> Kotlin/Wasm is [Alpha](components-stability.md). It may be changed at any time. Use it in scenarios before production. 
> We would appreciate your feedback on it in [YouTrack](https://youtrack.jetbrains.com/issue/KT-56492).
>
{type="note"}

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
* [Types](wasm-js-interop.md#type-correspondence) are restricted, similar to `external fun`.

The Kotlin compiler puts the code string into a function in the generated JavaScript file and imports it into WebAssembly format.
The Kotlin compiler doesn't verify these JavaScript snippets.
If there are JavaScript syntax errors, they are reported when you run your JavaScript code.

> The `@JsFun` annotation has similar functionality and will likely be deprecated.
>
{type="note"}

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

## Type correspondence

Kotlin/Wasm allows only certain types in signatures of JavaScript interop declarations.
These limitations apply uniformly to declarations with `external`, `= js("code")` or `@JsExport`.

See how Kotlin types correspond to Javascript types:

| Kotlin                                      | JavaScript                        |
|---------------------------------------------|-----------------------------------|
| `Byte`, `Short`, `Int`, `Char`              | `Number`                          |
| `Float`, `Double`,                          | `Number`                          |
| `Long`,                                     | `BigInt`                          |
| `Boolean`,                                  | `Boolean`                         |
| `String`,                                   | `String`                          |
| `Unit` in return position                   | `undefined`                       |
| Function type, for example `(String) → Int` | Function                          |
| `JsAny` and subtypes                        | Any JavaScript value              |
| `JsReference`                               | Opaque reference to Kotlin object |
| Other types                                 | Not supported                     |

You can use nullable versions of these types as well.

### JsAny type

JavaScript values are represented in Kotlin using the `JsAny` type and its subtypes.

The standard library provides representation for some of these types:
* Package `kotlin.js`:
    * `JsAny`
    * `JsBoolean`, `JsNumber`, `JsString`
    * `JsArray`
    * `Promise`
* Package `org.khronos.webgl`:
    * Typed arrays, like `Int8Array`
    * WebGL types
* Packages `org.w3c.dom.*`:
    * DOM API types

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

The Kotlin `try-catch` expression can't catch JavaScript exceptions.

If you try to use a JavaScript `try-catch` expression to catch Kotlin/Wasm exceptions, it looks like a
generic `WebAssembly.Exception` without directly accessible messages and data.

## Kotlin/Wasm and Kotlin/JS interoperability differences
<a name="differences"></a>

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
| **Exception handling**  | Can't catch JavaScript exceptions.                                                                                                                                                                                  | Can catch JavaScript `Error` via the `Throwable` type. It can catch any JS exception using the `dynamic` type.                                      |
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
{type="note"}
