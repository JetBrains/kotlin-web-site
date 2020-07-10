---
type: tutorial
layout: tutorial
title:  "Working with JavaScript libraries"
description: "A look at how we use JavaScript libraries with Kotlin/JS."
authors: Hadi Hariri 
date: 2017-02-27
showAuthorInfo: false
---

>__Warning__: this tutorial does not reflect all newest changes for Kotlin {{ site.data.releases.latest.version }}.
>To get started with writing modern Kotlin/JS projects, please see [Setting up a Kotlin/JS project](setting-up.html)
{:.note}
>

In this tutorial we'll see how to

* [Use dukat to interact with libraries](#using-dukat-to-generate-header-files-for-kotlin)
* [Use dynamic to interact with libraries](#using-dynamic)


## Using dukat to generate header files for Kotlin

The standard library provides us with a series of wrappers around DOM as well as functions to work with JavaScript, using static typing. What happens however
when we want to use a library such as jQuery? Kotlin does not have its own "header" files for all the different libraries available on the JavaScript ecosystem
however, TypeScript does. The [Definitely Typed repository](https://github.com/DefinitelyTyped/DefinitelyTyped/)  provides us with a very large selection of header files. 

Using the `dukat` tool we can convert any TypeScript declaration files to Kotlin. To install the tool we can use `npm`

```bash
npm -g install dukat
```

To convert a file we simply provide the input file, and optionally an output directory. The command below will convert the file `jquery.d.ts` in the current folder, which we've previously
 downloaded from the [Definitely Typed repository](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/types/jquery/jquery.d.ts) to the output folder `headers`:

```bash
dukat -d headers jquery.d.ts 
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
