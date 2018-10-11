---
type: tutorial
layout: tutorial
title:  "Debugging Kotlin in browser"
date: 2017-07-31
showAuthorInfo: false
---

This tutorial shows how to debug a Kotlin/JS project build by Gradle.
If you are using Maven or IDEA, the recipes would be similar.

Before reading this tutorial, please, look through
[Kotlin and JavaScript for Gradle tutorial](http://kotlinlang.org/docs/tutorials/javascript/getting-started-gradle/getting-started-with-gradle.html).


## Generating source map

To debug Kotlin sources in the browser, you should tell the compiler to generate source map file.
Add following lines to the Gradle configuration:

<div class="sample" markdown="1" theme="idea" mode="groovy">

``` groovy
compileKotlin2Js {
    kotlinOptions.sourceMap = true
    kotlinOptions.sourceMapEmbedSources = "always"

    // remaining configuration options
} 
```

</div>

Now, if you rebuild the project, you should see both `.js` and `.js.map` files generated.


## Debugging in Chrome DevTools

To debug Kotlin in Google Chrome, you should use DevTools.
Please, read the [official documentation](https://developer.chrome.com/devtools) to learn
how to open and use DevTools.

Now, if you open DevTools, you should see both JavaScript and Kotlin files in Sources tab,
as shown in the picture below.

![Debugging in Chrome DevTools]({{ url_for('tutorial_img', filename='javascript/debugging-javascript/chrome-devtools.png')}})

Note that you can open folders in the Source tab and see sources of libraries you are using in your project,
including Kotlin standard library (`kotlin.js`).
This, however, requires that libraries are compiled with source maps enabled,
as well as sources embedded into source maps.
So the good practice is: if you share a library for Kotlin/JS, please, include source map into distribution.
