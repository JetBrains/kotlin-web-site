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

* A function is inlined and never gets called directly (which happens always except for few situations).
* A module uses a shared library. Its parts that you don't use still get into the resulting bundle without DCE.
  For example, the Kotlin standard library contains functions for manipulating lists, arrays, char sequences,
  adapters for DOM, and so on. Altogether, they comprise about 1.3 mb file. A simple "Hello, world" application only requires
  console routines, which is only few kilobytes for the entire file.

Kotlin/JS Gradle plugin handles DCE automatically when you build a production bundle, for example, with `browserProductionWebpack` task.
The development bundling tasks don't include DCE.

## Excluding declarations from DCE

Sometimes you may need to keep a function or a class in the resulting JavaScript code even if you don't use it in your module,
for example, if you're going to use it in the client JavaScript code.

To keep certain declarations from elimination, add the `dceTask` block into the Gradle build script and
list the declarations as the arguments of the `keep` function. An argument must be the declaration's fully qualified name
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

Note that the names of functions with parameters are [mangled](js-to-kotlin-interop.html#jsname-annotation)
in the generated JavaScript code. To keep such functions from elimination, use the mangled names in the `keep` arguments.

## Known issue: DCE and ktor

In Kotlin {{ site.data.releases.latest.version }}, there is a known [issue](https://github.com/ktorio/ktor/issues/1339) 
of using [ktor](https://ktor.io/) in Kotlin/JS projects. In some cases, you may get a type error like `<something> is not a function` 
that comes from the `io.ktor:ktor-client-js:1.3.0` or `io.ktor:ktor-client-core:1.3.0` artifacts.
To avoid this issue, add the following DCE configuration:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
kotlin.target.browser {
    dceTask {
        keep 'ktor-ktor-io.\$\$importsForInline\$\$.ktor-ktor-io.io.ktor.utils.io'
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
        keep("ktor-ktor-io.\$\$importsForInline\$\$.ktor-ktor-io.io.ktor.utils.io")
    }
}
```

</div>
</div>
