---
type: tutorial
layout: tutorial
title:  "Calling JavaScript from Kotlin"
description: "A look at how to work with JavaScript from Kotlin"
authors: Hadi Hariri 
date: 2016-10-07
showAuthorInfo: false
---

When targeting JavaScript with Kotlin, we can interoperate by 

* Calling Kotlin from JavaScript
* Calling JavaScript from Kotlin

This tutorial is going to cover the second case. For more information about the first scenario please see 

* [Kotlin to JavaScript](../kotlin-to-javascript/kotlin-to-javascript.html)
* [Working with Modules](../working-with-modules/working-with-modules.html)

If you're new to working with Kotlin and JavaScript, it's recommended you read the previous tutorials first to get a 
better understanding of how things work under the covers.

What we'll see in this tutorial is how to

* [Use Standard Library Function to emit JavaScript](#using-standard-library-functions)
* [Work with strongly-typed libraries](#working-with-strongly-typed-libraries)
* [Invoke a member that does not exist in Kotlin](#invoking-javascript-only-members)
* [Create mappings with Dynamic and Native](#creating-mappings-with-native)

## Using Standard Library Functions

The Standard Library comes with a function named `js` which allows us to emit JavaScript easily from Kotlin. 

```kotlin
fun main(args: Array<String>) {

    js("alert('Hello from Kotlin')")

}
```

The code above would emit a JavaScript message dialog as soon as the main function is executed. It's important to note that this is not merely an `eval`. The JavaScript 
code is verified to be valid and injected into the generated code. 

## Working with Strongly-Typed Libraries

Kotlin standard library ships with a series of headers for interacting with JavaScript libraries such as jQuery[1]. 

For the case of jQuery, we can use the `jq` standard library function. This allows us to write jQuery directly without having to resort to invoking it using
inline JavaScript. 


```kotlin
fun main(args: Array<String>) {
    jq("#message").html("Hello from Kotlin")
}
```

which would set the HTML of the `div` with id `message`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Sample</title>
</head>
<body>
<div id="message">
</div>
    <script type="text/javascript" src="src/jquery-3.1.1.min.js"></script>
    <script type="text/javascript" src="src/kotlin.js"></script>
    <script type="text/javascript" src="src/main.js"></script>
</body>
</html>
```

## Invoking JavaScript-only members

There are cases in which we want to invoke some method that only exists in JavaScript. For instance, let's assume we want to use the [DataTables](https://datatables.net/) jQuery plugin that creates a grid out of a table. This plugin requires
us to invoke `Datatable()` on a DOM table element. 

```javascript
    $('#table').DataTable();
```

If we were to try and do this using our `jq()` function, the code wouldn't compile

```kotlin
fun main(args: Array<String>) {
    jq("#table").DataTable()
}
```

and we'd get an unresolved reference 

![Unresolved Reference]({{ url_for('tutorial_img', filename='javascript/calling-javascript-from-kotlin/unresolved-reference.png')}})

In such cases, we can use the `asDynamic()` function to cast the return type `jq` to [dynamic](https://kotlinlang.org/docs/reference/dynamic-type.html). This will then satisfy the compiler. 

```kotlin
fun main(args: Array<String>) {
    jq("#table").asDynamic().DataTable()
}
```

At runtime, the call will be mapped to the same member invocation. 


```javascript
var workingWithJavaScript = function (Kotlin) {
  'use strict';
  var _ = Kotlin.defineRootPackage(null, /** @lends _ */ {
    main_kand9s$: function (args) {
      $('#table').DataTable(); // <-- LITERAL TRANSLATION  
    }
  });
  Kotlin.defineModule('workingWithJavaScript', _);
  _.main_kand9s$([]);
  return _;
}(kotlin);
```

## Creating mappings with Native

In the above scenario, `DataTable()` was transpiled to the same member name in JavaScript. What happens however when we want to map to something different? In fact, we're doing this with `jq` itself. 
If we notice the output of the code above, we see the `jq` has been transpiled to `$`. How does this happen?

Kotlin allows us to map a function to something else in JavaScript by annotating it using the `@native` annotation. If we look at the standard library, we can see that the `jq` function has the following definition


```kotlin
@native("$")
public fun jq(selector: String): JQuery = JQuery();
@native("$")
public fun jq(selector: String, context: Element): JQuery = JQuery();
@native("$")
public fun jq(callback: () -> Unit): JQuery = JQuery();
@native("$")
public fun jq(obj: JQuery): JQuery = JQuery();
@native("$")
public fun jq(el: Element): JQuery = JQuery();
@native("$")
public fun jq(): JQuery = JQuery();
```

Using a combination of `dynamic` and `native` we can use third-party libraries that are available in JavaScript for which we do not currently have strongly-typed header definitions. 




[1] At some point these headers might be separated out into their own library as part of the [Kotlinx project](https://github.com/kotlin/)

