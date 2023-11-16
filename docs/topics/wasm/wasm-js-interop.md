[//]: # (title: Interoperability with JavaScript)

Kotlin/Wasm allows you to both use JavaScript code from Kotlin and Kotlin code from JavaScript.

The [Kotlin/JS compiler](js-overview.md) already provides the ability to transpile your Kotlin code to JavaScript. The
Kotlin/Wasm interoperability with JavaScript is designed in a similar way, taking into account that JavaScript is a
dynamically typed language compared to Kotlin. Follow our guide to configure interoperability in your projects.

Remember that Kotlin/Wasm is in [Alpha](components-stability.md#stability-levels-explained), and some features
are not supported yet. We're planning to improve interoperability with JavaScript by implementing some of the missing
features or similar functionality.

## Use JavaScript code from Kotlin

### external modifier

To access JavaScript declarations defined in the global scope, mark them with the `external` modifier. Consider this
JavaScript code sample:

```javascript
// JavaScript

function consoleLogExample() {
    console.log("Hello");
}

let externalInt = 0;

let Counter = {
    value: 0,
    step: 1,
    increment() {
        this.value += this.step;
    }
};

class Rectangle {
    constructor(height, width) {
        this.height = height;
        this.width = width;
    }

    get area() {
        return this.calcArea();
    }

    calcArea() {
        return this.height * this.width;
    }
}
```

Here's how you can use this JavaScript code in Kotlin:

```kotlin
// Kotlin/Wasm

// Use external functions to call JS functions defined in global scope
external fun consoleLogExample(): Unit

// In addition to functions, you can have external top-level properties
external var externalInt: Int

// External objects
external object Counter {
    fun increment(): Unit
    val value: Int
    var step: Int
}

// External class
external class Rectangle(height: Double, width: Double) {
    val height: Double
    val width: Double
    val area: Double
    fun calcArea(): Double
}
```

See the full code in the example
project [Kotlin/Wasm browser](https://github.com/Kotlin/kotlin-wasm-examples/tree/main/browser-example).

> Some "external" Kotlin/JS features are not supported in Kotlin/Wasm:
> * Implementing or extending external types
> * External [enum classes](enum-classes.md)
>
{type="note"}

### @JsFun annotation

To include a small piece of JS code in your Kotlin/Wasm module, use the `@JsFun` annotation with external top-level
functions. The annotation argument should be a string with JS code that evaluates a function with a matching signature:

```kotlin
@JsFun("function count(x) { return x + 10; }")
external fun count(x: Int): Int
```

To make it shorter, use arrow syntax:

```kotlin
@JsFun("x => x + 10")
external fun count(x: Int): Int
```

The Kotlin compiler doesn't verify these JavaScript snippets and evaluates them as-is. Syntax errors, if any, will be
reported when running your JavaScript.

> These function expressions are evaluated only once, before the Wasm module is loaded. Do not rely on side effects as
> these expressions are not run if the function is not called.
>
{type="note"}

### @JsModule

To indicate that an `external` class, package, function, or property is a JavaScript module, use
the [`@JsModule` annotation](js-modules.md#jsmodule-annotation). Consider this JavaScript code sample:

```javascript
// jsModule.mjs
let maxUsers = 10;

function getActiveUsers() {
    return 10;
};

class User {
    constructor(maxUsers) {
        this.maxUsers = maxUsers;
    }
}

export {maxUsers, getActiveUsers, User};
```

Here's how you can use this JavaScript code in Kotlin:

```kotlin
// kotlin
@file:JsModule("./jsModule.mjs")

package example

external val maxUsers: Int
external fun getActiveUsers(): Int
external class User {
    constructor(username: String)
    val username : String
}
```

> Kotlin/Wasm supports ES modules only. That's why you can't use the `@JsNonModule` annotation.
>
{type="note"}

## Use Kotlin code from JavaScript

### @JsExport annotation

To make the Kotlin/Wasm declaration available from JavaScript, use the `@JsExport` annotation with external top-level
functions:

```kotlin
// Kotlin/Wasm

@JsExport
fun addOne(x: Int): Int = x + 1
```

Now you can use this function from JavaScript in the following way:

```javascript
// JavaScript

import exports from "module.mjs"
exports.addOne(10)
```

Functions marked at `@JsExport` are visible as properties on a `default` export of the generated `.mjs` module.
Kotlin types in JavaScript
In Kotlin/JS, values are implemented internally as JavaScript primitives and objects. They are passed to and from
JavaScript without wrapping or copying.

However, in Kotlin/Wasm, objects have a different representation and are not interchangeable with JavaScript. When you
pass a Kotlin object to JavaScript, it's considered as an empty opaque object by default.

The only thing you can do is store it and pass Kotlin objects back to Wasm. However, for primitive types, Kotlin/Wasm
can adapt these values so that they can be useful in JavaScript by either copying or wrapping. For efficiency purposes,
this is done statically. It's important that these special concrete types are present in function signatures. For
example:

```kotlin
external fun convertIntAndString(num: Int, text: String)
external fun convertAnyAndChars(num: Any, text: CharSequence)

// ...

convertIntAndString(10, "Hello") // Converts Int and String to JS Number and String

convertAnyAndChars(10, "Hello") // No conversion
                                // values are passed as opaque references to Wasm objects
```

## Kotlin types in JavaScript

### Supported types

See how Kotlin types are mapped to JavaScript ones:

| Kotlin                                               | JavaScript                         | Comments                                                                                                                                              |
|------------------------------------------------------|------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|
| `Byte`, `Short`, `Int`, `Char`                       | `Number`                           |                                                                                                                                                       |
| `Float`, `Double`                                    | `Number`                           |                                                                                                                                                       | 
| `Long`                                               | `BigInt`                           |                                                                                                                                                       |
| `Boolean`                                            | `Boolean`                          |                                                                                                                                                       |
| `String`                                             | `String`                           | String content is copied. In the future, the [stringref proposal](https://github.com/WebAssembly/stringref) could allow the zero-copy string interop. |
| `Unit`                                               | Undefined                          | Only when non-nullable and in functions returning position.                                                                                           |
| Function type, for example (`int`, `String`) → `Int` | Function reference                 | Parameters and return values of function types follow the same type of conversion rules.                                                              |
| `external interface`                                 | Any JS value with given properties |                                                                                                                                                       |
| `external class` or `external object`                | Corresponding JS class             |                                                                                                                                                       |
| Other Kotlin types                                   | Not supported                      | This includes type `Any`, arrays, the `Throwable` class, collections, and so on.                                                                      |
| Nullable `Type?`                                     | Type / `null` / undefined          |                                                                                                                                                       |
| Type parameters `<T : U>`                            | Same as the upper bound            | In interop declarations, only external types, like `JsAny`, are supported as upper bounds of type parameters.                                         |

## Exception handling

The Kotlin/Wasm `try-catch` expression can't catch the JavaScript exceptions.

If you try to use JavaScript `try-catch` expression to catch the Kotlin/Wasm exceptions, it'll look like a
generic `WebAssembly.Exception` without directly accessible messages and data.

## Workarounds for Kotlin/JS features non-supported in Kotlin/Wasm

### Dynamic type

Kotlin/JS [dynamic type](dynamic-type.md) used for interoperability with untyped or loosely typed objects is not
supported yet. In many cases, you can use external interfaces and the [`@JsFun`](#jsfun-annotation) annotation instead:

```kotlin
// Kotlin/JS

val user: dynamic
val age: Int = 0
user.profile.updateAge(age);

// Kotlin/Wasm

external interface User

@JsFun("(user, age) => user.profile.updateAge(age)")
external fun updateUserAge(user: User, age: Int)

val user: User
val age: Int = 0
updateUserAge(user, age);
```

### Inline JavaScript

The [`js()` function](js-interop.md#inline-javascript) used to inline JavaScript code to Kotlin code is not supported
yet. Use the [`@JsFun`](#jsfun-annotation) annotation instead:

```kotlin
// Kotlin/JS

fun jsTypeOf(obj: Any): String {
    return js("typeof obj")
}

// Kotlin/Wasm
@JsFun("(obj) => typeof obj")
external fun jsTypeOf(obj: SomeExternalInterfaceType): String
```

### Extending external interfaces and classes with non-external classes

[Extending JavaScript classes](js-interop.md#extend-javascript-classes)
and [using external interfaces](js-interop.md#external-interfaces) is not supported yet. Use
the [`@JsFun`](#jsfun-annotation) annotation instead:

```kotlin
external interface DataProcessor {
    fun processData(input: String): String
    fun processResult(input: String): String
}

class DataHandler(val handlerData: String) {
    fun processData(input: String): String = input + handlerData
    fun processResult(input: String): String = handlerData + input
}

@JsFun("(processData, processResult) => ({ processData, processResult })")
external fun createDataProcessor(
    processData: (String) -> String,
    processResult: (String) -> String
): DataProcessor

fun convertHandlerToProcessor(handler: DataHandler): DataProcessor =
    createDataProcessor(
        processData = { input -> handler.processData(input) },
        processResult = { input -> handler.processResult(input) }
    )
```