---
type: tutorial
layout: tutorial
title:  "Working with JavaScript"
description: "A look at how we can interact with the DOM as well as using JavaScript libraries"
authors: Hadi Hariri 
date: 2017-02-27
showAuthorInfo: false
---


In this tutorial we'll see how to

* [Interact with the DOM](#interacting-with-the-dom)
* [Use kotlinx.html to generate HTML](#using-kotlinxhtml)
* [Use ts2kt to interact with libraries](#using-ts2kt-to-generate-header-files-for-kotlin)
* [Use dynamic to interact with libraries](#using-dynamic)



## Interacting with the DOM

The Kotlin standard library provides a series of wrappers around the JavaScript API for interacting with documents. The main component we'd usually access is the variable `document`. Given we have access to this, we can simply read and write to the corresponding properties. For instance, to set the background of the page we can do


<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
document.bgColor = "FFAA12" 
```
</div>

The DOM also provides us a way to retrieve a specific element by ID, name, class name, tag name and so on. All returned elements are of type `NodeList`, and to access members we need to cast them to the specific type of element. The code below shows how we could access an input
element on the page:

<div class="sample" markdown="1" theme="idea" mode="xml">
```html
<body>
    <input type="text" name="email" id="email"/>
    <script type="text/javascript" src="scripts/kotlin.js"></script>
    <script type="text/javascript" src="scripts/domInteraction.js"></script>
</body>
```
</div>

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
val email = document.getElementById("email") as HTMLInputElement
email.value = "hadi@jetbrains.com"
```
</div>

An important note is to make sure that the scripts are located before the ``body`` tag is closed. Placing them at the top means that the scripts would be loaded before the DOM is fully available.

Much like we reference an input element, we can access other elements on the page, casting them to the appropriate types. 

## Using kotlinx.html

The [kotlinx.html library](http://www.github.com/kotlin/kotlinx.html) provides the ability to generate DOM using statically typed HTML builders.
The library is available when targeting the JVM as well as JavaScript. To use the library we need to include the corresponding
dependency. In the case of Gradle this would be 

<div class="sample" markdown="1" theme="idea" mode="groovy">
```groovy
repositories {
    mavenCentral()
    maven {
        url  "http://dl.bintray.com/kotlin/kotlinx.html/"
    }
}

dependencies {
    compile 'org.jetbrains.kotlinx:kotlinx-html-js:0.6.1'
    compile "org.jetbrains.kotlin:kotlin-stdlib-js:$kotlin_version"
}
```
</div>

For more information about configuring Gradle to target JavaScript please see [Getting Started with Gradle](getting-started-gradle/getting-started-with-gradle.html).

Once the dependency is included, we can access the different interfaces provided to generate DOM. The code below will add a new ```span``` tag with the text ```Hello``` inside a ```div``` on the
`window.load` event.

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
import kotlin.browser.*
import kotlinx.html.*
import kotlinx.html.dom.*

fun printHello() {
    window.onload = {
        document.body!!.append.div {
            span {
                +"Hello"
            }
        }
    }
}
```
</div>

## Using ts2kt to generate header files for Kotlin

The standard library provides us with a series of wrappers around DOM as well as functions to work with JavaScript, using static typing. What happens however
when we want to use a library such as jQuery? Kotlin does not have its own "header" files for all the different libraries available on the JavaScript ecosystem
however, TypeScript does. The [Definitely Typed repository](https://github.com/DefinitelyTyped/DefinitelyTyped/)  provides us with a very large selection of header files. 

Using the tool `ts2kt` (TypeScript to Kotlin) we can convert any `d.ts` files to Kotlin. To install the tool we can use `npm`

```bash
npm -g install ts2kt
```

To convert a file we simply provide the input file, and optionally an output directory. The command below will convert the file `jquery.d.ts` in the current folder, which we've previously
 downloaded from the [Definitely Typed repository](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/types/jquery/jquery.d.ts) to the output folder `headers`:

```bash
ts2kt -d headers jquery.d.ts 
```

Once we have the file generated, we can simply include it in our project and use it:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
jQuery("#area").hover { window.alert("Hello!") }
```
</div>

Note that ```jQuery``` needs to be included in the corresponding HTML:

<div class="sample" markdown="1" theme="idea" mode="xml">
```html
<script type="text/javascript" src="js/jquery.js"></script>

<!-- other script files ....  -->
```
</div>

### Header files under the covers 

The header files merely contain function declarations for functionality that is defined at runtime. For instance, we could define a ```jQuery``` function like so

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
@JsName("$")
public external fun jQuery(selector: String): JQuery
```
</div>

The above code indicates that the function is defined externally. The ```@JsName("$")``` annotation allows us to map the name at runtime to ```$```. 
For more details on external declarations, please refer to the [JavaScript interop documentation](/docs/reference/js-interop.html#external-modifier).

Note that the type systems of TypeScript and Kotlin do not match exactly, so you may need to edit the generated headers in case
you encounter difficulties with using the APIs from Kotlin.


## Using Dynamic 

While the above solution works well for situations in which we have a corresponding header file (be this something we've defined ourselves or converted from a TypeScript header), often times
we need to work with some library that does not have a header. For instance, let's say we want to use a jQuery plugin, that allows us to convert an HTML table to a nice looking navigable grid.

The way in which we'd use this from JavaScript would be to call ```dataTable()``` on the corresponding ```<table>``` element

<div class="sample" markdown="1" theme="idea" mode="xml">
```html
<table id="data" class="display" cellspacing="0" width="100%">
    <thead>
    <tr>
        <th>Name</th>
        <th>Position</th>
        <th>Office</th>
        <th>Age</th>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>Tiger Nixon</td>
        <td>System Architect</td>
        <td>Edinburgh</td>
        <td>61</td>
    </tr>
    <tr>
        <td>Garrett Winters</td>
        <td>Accountant</td>
        <td>Tokyo</td>
        <td>63</td>
    </tr>
    <tr>
        <td>Ashton Cox</td>
        <td>Junior Technical Author</td>
        <td>San Francisco</td>
        <td>66</td>
    </tr>
    
      . . . 
    
    </tbody>
</table>
```
</div>

we would invoke the following in JavaScript

<div class="sample" markdown="1" theme="idea" mode="js">
```javascript
$("#data").dataTable()
```
</div>

How would we do this from Kotlin given that the function ```dataTable()``` does not exist, and calling it would give a compiler error?

In situations like this we can use the ```dynamic``` type, which allows us to work with dynamic types when targeting JavaScript. The following
variable is declared as ```dynamic``` meaning that whatever we invoke on it will not result in a compile-time error:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
val myObject: dynamic = null

{ ... }

myObject.callAnything()
```
</div>

The above code compiles. However, it will produce a runtime error if the object is not properly initialised before use or if ```callAnything()``` is not
 defined at runtime.
 
The standard library defines a function named [`asDynamic()`](/api/latest/jvm/stdlib/kotlin.js/as-dynamic.html) which casts a value to the dynamic type.
Given our previous example where we used jQuery to work with DOM elements, we can now combine this with `asDynamic()` to then invoke `dataTable()` on the result:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
$("#data").asDynamic().dataTable()
```
</div>

It is important to understand that just like in the case of `callAnything()`, the `dataTable()` function must exist at runtime. In our case, we need to make
sure that the corresponding script file for our plugin is included:

<div class="sample" markdown="1" theme="idea" mode="xml">
```html
<script type="text/javascript" src="js/jquery.js"></script>
<script type="text/javascript" src="js/jquery.dataTables.js"></script>

<!-- other script files ....  -->
```
</div>

For more information about ```dynamic``` see the [reference documentation](../../reference/dynamic-type.html).
