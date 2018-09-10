---
type: doc
layout: reference
category: "JavaScript"
title: "Calling JavaScript from Kotlin"
---

# Calling JavaScript from Kotlin

Kotlin was designed for easy interoperation with Java platform. It sees Java classes as Kotlin classes, and
Java sees Kotlin classes as Java classes. However, JavaScript is a dynamically-typed language, which means
it does not check types in compile-time. You can freely talk to JavaScript from Kotlin via 
[dynamic](dynamic-type.html) types, but if you want the full power of Kotlin
type system, you can create Kotlin headers for JavaScript libraries.


## Inline JavaScript

You can inline some JavaScript code into your Kotlin code using the [js("...")](/api/latest/jvm/stdlib/kotlin.js/js.html) function.
For example:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` kotlin
fun jsTypeOf(o: Any): String {
    return js("typeof o")
}
```
</div>

The parameter of `js` is required to be a string constant. So, the following code is incorrect:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` kotlin
fun jsTypeOf(o: Any): String {
    return js(getTypeof() + " o") // error reported here
}
fun getTypeof() = "typeof"
```
</div>


## `external` modifier

To tell Kotlin that a certain declaration is written in pure JavaScript, you should mark it with `external` modifier.
When the compiler sees such a declaration, it assumes that the implementation for the corresponding class, function or
property is provided by the developer, and therefore does not try to generate any JavaScript code from the declaration.
This means that you should omit bodies of `external` declarations. For example:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` kotlin
external fun alert(message: Any?): Unit

external class Node {
    val firstChild: Node

    fun append(child: Node): Node

    fun removeChild(child: Node): Node

    // etc
}

external val window: Window
```
</div>

Note that `external` modifier is inherited by nested declarations, i.e. in `Node` class we do not put `external`
before member functions and properties.

The `external` modifier is only allowed on package-level declarations. You can't declare an `external` member of a non-`external` class.


### Declaring (static) members of a class

In JavaScript you can define members either on a prototype or a class itself. I.e.:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` javascript
function MyClass() { ... }
MyClass.sharedMember = function() { /* implementation */ };
MyClass.prototype.ownMember = function() { /* implementation */ };
```
</div>

There's no such syntax in Kotlin. However, in Kotlin we have `companion` objects. Kotlin treats companion objects
of `external` class in a special way: instead of expecting an object, it assumes members of companion objects
to be members of the class itself. To describe `MyClass` from the example above, you can write:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` kotlin
external class MyClass {
    companion object {
        fun sharedMember()
    }

    fun ownMember()
}
```
</div>


### Declaring optional parameters

An external function can have optional parameters.
How the JavaScript implementation actually computes default values for these parameters, is unknown to Kotlin,
thus it's impossible to use the usual syntax to declare such parameters in Kotlin.
You should use the following syntax:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` kotlin
external fun myFunWithOptionalArgs(x: Int,
    y: String = definedExternally,
    z: Long = definedExternally)
```
</div>

This means you can call `myFunWithOptionalArgs` with one required argument and two optional arguments (their
default values are calculated by some JavaScript code).


### Extending JavaScript classes

You can easily extend JavaScript classes as they were Kotlin classes. Just define an `external` class and
extend it by non-`external` class. For example:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` kotlin
external open class HTMLElement : Element() {
    /* members */
}

class CustomElement : HTMLElement() {
    fun foo() {
        alert("bar")
    }
}
```
</div>

There are some limitations:

1. When a function of external base class is overloaded by signature, you can't override it in a derived class.
2. You can't override a function with default arguments.

Note that you can't extend a non-external class by external classes.


### `external` interfaces

JavaScript does not have the concept of interfaces. When a function expects its parameter to support `foo`
and `bar` methods, you just pass objects that actually have these methods. You can use interfaces to express this
for statically-typed Kotlin, for example:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` kotlin
external interface HasFooAndBar {
    fun foo()

    fun bar()
}

external fun myFunction(p: HasFooAndBar)
```
</div>

Another use case for external interfaces is to describe settings objects. For example:

<div class="sample" markdown="1" theme="idea" data-highlight-only auto-indent="false">
``` kotlin
external interface JQueryAjaxSettings {
    var async: Boolean

    var cache: Boolean

    var complete: (JQueryXHR, String) -> Unit

    // etc
}

fun JQueryAjaxSettings(): JQueryAjaxSettings = js("{}")

external class JQuery {
    companion object {
        fun get(settings: JQueryAjaxSettings): JQueryXHR
    }
}

fun sendQuery() {
    JQuery.get(JQueryAjaxSettings().apply {
        complete = { (xhr, data) ->
            window.alert("Request complete")
        }
    })
}
```
</div>

External interfaces have some restrictions:

1. They can't be used on the right hand side of `is` checks.
2. `as` cast to external interface always succeeds (and produces a warning in compile-time).
3. They can't be passed as reified type arguments.
4. They can't be used in class literal expressions (i.e. `I::class`).
