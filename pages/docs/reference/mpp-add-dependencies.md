---
type: doc
layout: reference
title: "Add dependencies"
---

# Add dependencies

To add a dependency on a library, set the dependency of the required [type](#dependency-types) (for example, `implementation`) in the 
`dependencies` block of the source sets DSL.

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode="groovy" data-highlight-only>

```groovy
kotlin {
    sourceSets {
        commonMain {
            dependencies {
                implementation 'com.example:my-library:1.0'
            }
        }
    }
}
```

</div>
</div>
 
<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode="kotlin" data-highlight-only>

```kotlin
kotlin {
    sourceSets {
        val commonMain by getting {
            dependencies {
                implementation("com.example:my-library:1.0")
            }
        }
    }
}
```

</div>
</div>

## Dependency types

Choose the dependency type based on your requirements.

<table>
<tr>
<th>Type</th>
<th>Description</th>
<th>When to use</th>
</tr>
<tr>
<td><code>api</code></td>
<td>Used both during compilation and at runtime and is exported to library consumers.</td>
<td>If any type from a dependency is used in the public API of the current module, use an <code>api</code> dependency.
</td>
</tr>
<tr>
<td><code>implementation</code></td>
<td>Used during compilation and at runtime for the current module, but is not exposed for compilation of other modules 
depending on the one with the implementation dependency.</td>
<td>
<p>Use for dependencies needed for the internal logic of a module.</p> 
<p>If a module is an endpoint application which is not published, use <code>implementation</code> dependencies instead 
of <code>api</code> dependencies.</p>
</td>
</tr>
<tr>
<td><code>compileOnly</code></td>
<td>Used for compilation of the current module and is not available at runtime nor during compilation of other modules.</td>
<td>Use for APIs which have a third-party implementation available at runtime.</td>
</tr>
<tr>
<td><code>runtimeOnly</code></td>
<td>Available at runtime but is not visible during compilation of any module.</td>
<td></td>
</tr>
</table>

## Dependency on a standard library

A dependency on a standard library (`stdlib`) in each source set is added automatically. The version 
of the standard library is the same as the version of the `kotlin-multiplatform` plugin.

For platform-specific source sets, the corresponding platform-specific variant of the library is used, while a common standard 
library is added to the rest. The Kotlin Gradle plugin will select the appropriate JVM standard library depending on 
the `kotlinOptions.jvmTarget` setting.

If you declare a standard library dependency explicitly (for example, if you need a different version), the Kotlin Gradle 
plugin won’t override it or add a second standard library. 

If you do not need a standard library at all, you can add the opt-out flag to the `gradle.properties`:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
kotlin.stdlib.default.dependency=false
```

</div>

## Set a dependency on a kotlinx library

If you use a kotlinx library and need a platform-specific dependency, you can use platform-specific variants 
of libraries with suffixes such as `-jvm` or `-js`, for example, `kotlinx-coroutines-core-jvm`.  

If you use a multiplatform library and need to depend on the shared code, set the dependency only once in the shared 
source set. Use the library base artifact name, such as `kotlinx-coroutines-core` or `ktor-client-core`. 

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode="groovy" data-highlight-only>

```groovy
kotlin {
    sourceSets {
        commonMain {
            dependencies {
                implementation'org.jetbrains.kotlinx:kotlinx-coroutines-core:{{ site.data.releases.latest.coroutines.version }}'
            }
        }
        jvmMain {
            dependencies {
                implementation 'org.jetbrains.kotlinx:kotlinx-coroutines-core-jvm:{{ site.data.releases.latest.coroutines.version }}'
            }
        }
    }
}
```

</div>
</div>
 
<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode="kotlin" data-highlight-only>

```kotlin
kotlin {
    sourceSets {
        val commonMain by getting {
            dependencies {
                implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:{{ site.data.releases.latest.coroutines.version }}")
            }
        }
        val jvmMain by getting {
            dependencies {
                implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core-jvm:{{ site.data.releases.latest.coroutines.version }}")
            }
        }
    }
}

```

</div>
</div>
 
## Set dependencies at the top level

Alternatively, you can specify the dependencies at the top level with the configuration names following the pattern 
`<sourceSetName><DependencyType>`. This is helpful for some Gradle built-in dependencies, like `gradleApi()`, `localGroovy()`, 
or `gradleTestKit()`, which are not available in the source sets dependency DSL.

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode="groovy" data-highlight-only>

```groovy
dependencies {
    commonMainImplementation 'com.example:my-library:1.0'
}

```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode="kotlin" data-highlight-only>

```kotlin
dependencies {
    "commonMainImplementation"("com.example:my-library:1.0")
  }

```

</div>
</div> 
 
