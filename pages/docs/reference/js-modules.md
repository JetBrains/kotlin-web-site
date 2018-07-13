---
type: doc
layout: reference
category: "JavaScript"
title: "JavaScript Modules"
---

# JavaScript Modules

Kotlin allows you to compile your Kotlin projects to JavaScript modules for popular module systems. Here is
the list of available options:

1. Plain. Don't compile for any module system. As usual, you can access a module by its name in the global scope.
   This option is used by default.
2. [Asynchronous Module Definition (AMD)](https://github.com/amdjs/amdjs-api/wiki/AMD), which is in particular
   used by require.js library.
3. [CommonJS](http://wiki.commonjs.org/wiki/Modules/1.1) convention, widely used by node.js/npm
   (`require` function and `module.exports` object)
4. Unified Module Definitions (UMD), which is compatible with both *AMD* and *CommonJS*, and works as "plain"
   when neither *AMD* nor *CommonJS* is available at runtime.


## Choosing the Target Module System

Choosing the target module system depends on your build environment:

### From IntelliJ IDEA

Setup per module:
Open File -> Project Structure..., find your module in Modules and select "Kotlin" facet under it. Choose appropriate
module system in "Module kind" field.

Setup for the whole project:
Open File -> Settings, select "Build, Execution, Deployment" -> "Compiler" -> "Kotlin compiler". Choose appropriate
module system in "Module kind" field.


### From Maven

To select module system when compiling via Maven, you should set `moduleKind` configuration property, i.e. your
`pom.xml` should look like this:

``` xml
<plugin>
    <artifactId>kotlin-maven-plugin</artifactId>
    <groupId>org.jetbrains.kotlin</groupId>
    <version>${kotlin.version}</version>
    <executions>
        <execution>
            <id>compile</id>
            <goals>
                <goal>js</goal>
            </goals>
        </execution>
    </executions>
    <!-- Insert these lines -->
    <configuration>
        <moduleKind>commonjs</moduleKind>
    </configuration>
    <!-- end of inserted text -->
</plugin>
```

Available values are: `plain`, `amd`, `commonjs`, `umd`.


### From Gradle

To select module system when compiling via Gradle, you should set `moduleKind` property, i.e.

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` groovy
compileKotlin2Js.kotlinOptions.moduleKind = "commonjs"
```
</div>

Available values are similar to Maven.


## `@JsModule` annotation

To tell Kotlin that an `external` class, package, function or property is a JavaScript module, you can use `@JsModule`
annotation. Consider you have the following CommonJS module called "hello":

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` javascript
module.exports.sayHello = function(name) { alert("Hello, " + name); }
```
</div>

You should declare it like this in Kotlin:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` kotlin
@JsModule("hello")
external fun sayHello(name: String)
```
</div>


### Applying `@JsModule` to packages

Some JavaScript libraries export packages (namespaces) instead of functions and classes.
In terms of JavaScript, it's an object that has members that *are* classes, functions and properties.
Importing these packages as Kotlin objects often looks unnatural.
The compiler allows to map imported JavaScript packages to Kotlin packages, using the following notation:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` kotlin
@file:JsModule("extModule")
package ext.jspackage.name

external fun foo()

external class C
```
</div>

where the corresponding JavaScript module is declared like this:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` javascript
module.exports = {
    foo:  { /* some code here */ },
    C:  { /* some code here */ }
}
```
</div>

Important: files marked with `@file:JsModule` annotation can't declare non-external members.
The example below produces compile-time error:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` kotlin
@file:JsModule("extModule")
package ext.jspackage.name

external fun foo()

fun bar() = "!" + foo() + "!" // error here
```
</div>

### Importing deeper package hierarchies

In the previous example the JavaScript module exports a single package.
However, some JavaScript libraries export multiple packages from within a module.
This case is also supported by Kotlin, though you have to declare a new `.kt` file for each package you import.

For example, let's make our example a bit more complicated:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` javascript
module.exports = {
    mylib: {
        pkg1: {
            foo: function() { /* some code here */ },
            bar: function() { /* some code here */ }
        },
        pkg2: {
            baz: function() { /* some code here */ }
        }
    }
}
```
</div>

To import this module in Kotlin, you have to write two Kotlin source files:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
@file:JsModule("extModule")
@file:JsQualifier("mylib.pkg1")
package extlib.pkg1

external fun foo()

external fun bar()
```
</div>

and

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
@file:JsModule("extModule")
@file:JsQualifier("mylib.pkg2")
package extlib.pkg2

external fun baz()
```
</div>

### `@JsNonModule` annotation

When a declaration has `@JsModule`, you can't use it from Kotlin code when you don't compile it to a JavaScript module.
Usually, developers distribute their libraries both as JavaScript modules and downloadable `.js` files that you
can copy to project's static resources and include via `<script>` element. To tell Kotlin that it's ok
to use a `@JsModule` declaration from non-module environment, you should put `@JsNonModule` declaration. For example,
given JavaScript code:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
``` javascript
function topLevelSayHello(name) { alert("Hello, " + name); }
if (module && module.exports) {
    module.exports = topLevelSayHello;
}
```
</div>

can be described like this:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
@JsModule("hello")
@JsNonModule
@JsName("topLevelSayHello")
external fun sayHello(name: String)
```
</div>


### Notes

Kotlin is distributed with `kotlin.js` standard library as a single file, which is itself compiled as an UMD module, so
you can use it with any module system described above. Also it is available on NPM as [`kotlin` package](https://www.npmjs.com/package/kotlin)


