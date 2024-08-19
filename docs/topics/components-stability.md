[//]: # (title: Stability of Kotlin components)

The Kotlin language and toolset are divided into many components such as the compilers for the JVM, JS and Native targets,
the Standard Library, various accompanying tools and so on.
Many of these components were officially released as **Stable**, which means that they are evolved 
in the backward-compatible way following the [principles of _Comfortable Updates_ and _Keeping the Language Modern_](kotlin-evolution-principles.md).

Following the _Feedback Loop_ principle, we release many things early for the community to try out, 
so a number of components are not yet released as **Stable**.
Some of them are very early stage, some are more mature. 
We mark them as **Experimental**, **Alpha** or **Beta** depending on how quickly each component is evolving
and how much risk the users are taking when adopting it.

## Stability levels explained

Here's a quick guide to these stability levels and their meaning:

**Experimental** means "try it only in toy projects":
  * We are just trying out an idea and want some users to play with it and give feedback. If it doesn't work out, we may drop it any minute.

**Alpha** means "use at your own risk, expect migration issues": 
  * We intend to productize this idea, but it hasn't reached its final shape yet.

**Beta** means "you can use it, we'll do our best to minimize migration issues for you": 
  * It's almost done, user feedback is especially important now.
  * Still, it's not 100% finished, so changes are possible (including ones based on your own feedback).
  * Watch for deprecation warnings in advance for the best update experience.

We collectively refer to _Experimental_, _Alpha_ and _Beta_ as **pre-stable** levels.

<a name="stable"></a>
**Stable** means "use it even in most conservative scenarios":
  * It's done. We will be evolving it according to our strict [backward compatibility rules](https://kotlinfoundation.org/language-committee-guidelines/).

Please note that stability levels do not say anything about how soon a component will be released as Stable. Similarly, they do not indicate how much a component will be changed before release. They only say how fast a component is changing and how much risk of update issues users are running.

## GitHub badges for Kotlin components

The [Kotlin GitHub organization](https://github.com/Kotlin) hosts different Kotlin-related projects.
Some of them we develop full-time, while others are side projects.

Each Kotlin project has two GitHub badges describing its stability and support status:

* **Stability** status. This shows how quickly each project is evolving and how much risk the users are taking when adopting it.
  The stability status completely coincides with the [stability level of the Kotlin language features and its components](#stability-levels-explained):
    * ![Experimental stability level](https://kotl.in/badges/experimental.svg){type="joined"} stands for **Experimental**
    * ![Alpha stability level](https://kotl.in/badges/alpha.svg){type="joined"} stands for **Alpha**
    * ![Beta stability level](https://kotl.in/badges/beta.svg){type="joined"} stands for **Beta**
    * ![Stable stability level](https://kotl.in/badges/stable.svg){type="joined"} stands for **Stable**

* **Support** status. This shows our commitment to maintaining a project and helping users to solve their problems.
  The level of support is unified for all JetBrains products.  
  [See the JetBrains Open Source document for details](https://github.com/JetBrains#jetbrains-on-github).

## Stability of subcomponents

A stable component may have an experimental subcomponent, for example:
* a stable compiler may have an experimental feature;
* a stable API may include experimental classes or functions;
* a stable command-line tool may have experimental options.

We make sure to document precisely which subcomponents are not stable.
We also do our best to warn users where possible and ask to opt in explicitly 
to avoid accidental usages of features that have not been released as stable.

## Current stability of Kotlin components

> By default, all new components are in the Experimental status.
> 
{type="note"}

### Kotlin compiler

| **Component**                                                       | **Status** | **Status since version** | **Comment** |
|---------------------------------------------------------------------|------------|--------------------------|-------------|
| Kotlin/JVM                                                          | Stable     | 2.0.0                    |             |
| Kotlin/Native                                                       | Stable     | 2.0.0                    |             |
| Kotlin/JS                                                           | Stable     | 2.0.0                    |             |
| Kotlin/Wasm                                                         | Alpha      | 1.9.20                   |             |
| [Analysis API](https://kotlin.github.io/analysis-api/index_md.html) | Stable     |                          |             |

### Core compiler plugins

| **Component**                                    | **Status**   | **Status since version** | **Comment** |
|--------------------------------------------------|--------------|--------------------------|-------------|
| [All-open](all-open-plugin.md)                   | Stable       |                          |             |
| [No-arg](no-arg-plugin.md)                       | Stable       |                          |             |
| [SAM-with-receiver](sam-with-receiver-plugin.md) | Stable       |                          |             |
| [kapt](kapt.md)                                  | Stable       |                          |             |
| [Lombok](lombok.md)                              | Experimental | 1.5.20                   |             |
| [Power-assert](power-assert.md)                  | Experimental | 2.0.0                    |             |

### Kotlin libraries

| **Component**         | **Status** | **Status since version** | **Comment** |
|-----------------------|------------|--------------------------|-------------|
| kotlin-stdlib         | Stable     | 1.0                      |             |
| kotlinx-coroutines    | Stable     |                          |             |
| kotlinx-serialization | Stable     |                          |             |
| kotlin-reflect (JVM)  | Beta       | 1.0                      |             |
| kotlinx-datetime      | Alpha      |                          |             |
| kotlinx-io            | Alpha      |                          |             |

### Kotlin Multiplatform 

| **Component**                                    | **Status**   | **Status since version** | **Comment**                                                                |
|--------------------------------------------------|--------------|--------------------------|----------------------------------------------------------------------------|
| Kotlin Multiplatform                             | Stable       | 1.9.20                   |                                                                            |
| cinterop klib binaries                           | Beta         | 1.3                      |                                                                            |
| Kotlin Multiplatform plugin for Android Studio   | Beta         | 0.8.0                    | [Versioned separately from the language](multiplatform-plugin-releases.md) |

### Kotlin/Native

| **Component**                                | **Status**   | **Status since version** | **Comment**                                                                |
|----------------------------------------------|--------------|--------------------------|----------------------------------------------------------------------------|
| Kotlin/Native Runtime                        | Stable       | 1.9.20                   |                                                                            |
| Kotlin/Native memory manager                 | Stable       | 1.9.20                   |                                                                            |
| Kotlin/Native interop with C and Objective-C | Beta         | 1.3                      |                                                                            |
| klib binaries                                | Stable       | 1.9.20                   | Not including cinterop klibs, see below                                    |
| CocoaPods integration                        | Stable       | 1.9.20                   |                                                                            |

> For details about Kotlin/Native targets support, refer to [](native-target-support.md).

### Language tools

| **Component**                         | **Status**   | **Status since version** | **Comment**                                    |
|---------------------------------------|--------------|--------------------------|------------------------------------------------|
| Scripting syntax and semantics        | Alpha        | 1.2                      |                                                |
| Scripting embedding and extension API | Beta         | 1.5                      |                                                |
| Scripting IDE support                 | Beta         |                          | Available since IntelliJ IDEA 2023.1 and later |
| CLI scripting                         | Alpha        | 1.2                      |                                                |

## Language features and design proposals

For language features and new design proposals, see [](kotlin-language-features-and-proposals.md).