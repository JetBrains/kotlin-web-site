---
type: doc
layout: reference
title: "What's New in Kotlin 1.4"
---

# What's New in Kotlin 1.4

## Explicit API mode

Kotlin compiler offers _explicit API mode_ for library authors. In this mode, the compiler performs additional checks that
help make the library’s API clearer and more consistent. It adds the following requirements for declarations exposed
to the library’s public API:

* Visibility modifiers are required for declarations if the default visibility exposes them to the public API.
This helps ensure that no declarations are exposed to the public API unintentionally.
* Explicit type specifications are required for properties and functions that are exposed to the public API.
This guarantees that API users are aware of the types of API members they use.

Depending on your configuration, these explicit APIs can produce errors (_strict_ mode) or warnings (_warning_ mode).
Certain kinds of declarations are excluded from such checks for the sake of readability and common sense:

* primary constructors
* properties of data classes
* property getters and setters
* `override` methods

Explicit API mode analyzes only the production sources of a module.

To compile your module in the explicit API mode, add the following lines to your Gradle build script:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
kotlin {    
    // for strict mode
    explicitApi() 
    // or
    explicitApi = 'strict'
    
    // for warning mode
    explicitApiWarning()
    // or
    explicitApi = 'warning'
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
kotlin {    
    // for strict mode
    explicitApi() 
    // or
    explicitApi = ExplicitApiMode.Strict
    
    // for warning mode
    explicitApiWarning()
    // or
    explicitApi = ExplicitApiMode.Warning
}
```

</div>
</div>

When using the command-line compiler, switch to explicit API mode by adding  the `-Xexplicit-api` compiler option
with the value `strict` or `warning`.

<div class="sample" markdown="1" mode="shell" theme="idea">

```bash
-Xexplicit-api={strict|warning}
```

</div>
