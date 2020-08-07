---
type: doc
layout: reference
category: "JavaScript"
title: "JavaScript DCE"
---

# JavaScript Dead Code Elimination (DCE)

The Kotlin/JS Gradle plugin includes a [_dead code elimination_](https://wikipedia.org/wiki/Dead_code_elimination) (_DCE_) tool.
Dead code elimination is often also called _tree shaking_. It reduces the size or the resulting JavaScript code by
removing unused properties, functions, and classes.

Unused declarations can appear in cases like:

* A function is inlined and never gets called directly (which happens always except for a few situations).
* A module uses a shared library. Without DCE, parts of the library that you don't use are still included in the resulting bundle.
  For example, the Kotlin standard library contains functions for manipulating lists, arrays, char sequences,
  adapters for DOM, and so on. All of this functionality would require about 1.3 MB as a JavaScript file. A simple "Hello, world" application only requires
  console routines, which is only few kilobytes for the entire file.

The Kotlin/JS Gradle plugin handles DCE automatically when you build a production bundle, for example by using the `browserProductionWebpack` task. Development bundling tasks don't include DCE.

## Excluding declarations from DCE

Sometimes you may need to keep a function or a class in the resulting JavaScript code even if you don't use it in your module,
for example, if you're going to use it in the client JavaScript code.

To keep certain declarations from elimination, add the `dceTask` block to your Gradle build script and
list the declarations as arguments of the `keep` function. An argument must be the declaration's fully qualified name
with the module name as a prefix: `moduleName.dot.separated.package.name.declarationName`

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
kotlin.target.browser {
    dceTask {
        keep 'myKotlinJSModule.org.example.getName', 'myKotlinJSModule.org.example.User'
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
kotlin.target.browser {
    dceTask {
        keep("myKotlinJSModule.org.example.getName", "myKotlinJSModule.org.example.User" )
    }
}
```

</div>
</div>

Note that unless specified otherwise the names of functions with parameters are [mangled](js-to-kotlin-interop.html#jsname-annotation)
in the generated JavaScript code. To keep such functions from elimination, use the mangled names in the `keep` arguments.
