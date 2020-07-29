---
type: doc
layout: reference
title: "Share code on all platforms"
---

# Share code on all platforms

If you have business logic that is common for all platforms, you don’t need to write the same code for each platform – 
just share it in the common source set.

![Code shared for all platforms]({{ url_for('asset', path='images/reference/mpp/flat-structure.png') }})

All platform-specific source sets depend on the common source set by default. You don’t need to specify any `dependsOn` 
relations manually for default source sets, such as `jvmMain`, `macosX64Main`, and others. 

If you add a custom source set and want to use dependencies of `commonMain` and reference its declarations, add the 
`dependsOn` relation with `commonMain`. 

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode="groovy" data-highlight-only>

```groovy
kotlin {
    sourceSets {
        //...
        desktopMain {
            dependsOn(commonMain)
        }
    }
}
```

</div>
</div>
 
<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode="kotlin" data-highlight-only>

```kotlin
kotlin{
    sourceSets {
        //...
        val desktopMain by creating {
           dependsOn(commonMain)
        }
    }
}
```

</div>
</div>
 
If you need to access platform-specific APIs from the shared code, use the Kotlin mechanism of expected and actual 
declarations (ADD LINK).

You can also share code on multiple platforms (ADD LINK), but not all.
