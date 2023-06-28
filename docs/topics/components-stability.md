[//]: # (title: Stability of Kotlin components)

The Kotlin language and toolset are divided into many components such as the compilers for the JVM, JS and Native targets, the Standard Library, various accompanying tools and so on.
Many of these components were officially released as **Stable** which means that they are evolved in the backward-compatible way following the [principles](kotlin-evolution.md) of _Comfortable Updates_ and _Keeping the Language Modern_.
Among such stable components are, for example, the Kotlin compiler for the JVM, the Standard Library, and Coroutines.

Following the _Feedback Loop_ principle we release many things early for the community to try out, so a number of components are not yet released as **Stable**.
Some of them are very early stage, some are more mature. We mark them as **Experimental**, **Alpha** or **Beta** depending on how quickly each component is evolving and how much risk the users are taking when adopting it. 

## Stability levels explained

Here's a quick guide to these stability levels and their meaning:

**Experimental** means "try it only in toy projects":
  * We are just trying out an idea and want some users to play with it and give feedback. If it doesn't work out, we may drop it any minute.

**Alpha** means "use at your own risk, expect migration issues": 
  * We decided to productize this idea, but it hasn't reached the final shape yet.

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
  [See the JetBrains Confluence document for details](https://confluence.jetbrains.com/display/ALL/JetBrains+on+GitHub).

## Stability of subcomponents

A stable component may have an experimental subcomponent, for example:
* a stable compiler may have an experimental feature;
* a stable API may include experimental classes or functions;
* a stable command-line tool may have experimental options.

We make sure to document precisely which subcomponents are not stable. We also do our best to warn users where possible and ask to opt in explicitly to avoid accidental usages of features that have not been released as stable.

## Current stability of Kotlin components

| **Component**                                     | **Status**   | **Status since version** | **Comment**                                                                       |
|---------------------------------------------------|--------------|--------------------------|-----------------------------------------------------------------------------------|
| Kotlin/JVM                                        | Stable       | 1.0                      |                                                                                   |
| Kotlin K2 (JVM)                                   | Alpha        | 1.7                      |                                                                                   |
| kotlin-stdlib (JVM)                               | Stable       | 1.0                      |                                                                                   |
| Coroutines                                        | Stable       | 1.3                      |                                                                                   |
| kotlin-reflect (JVM)                              | Beta         | 1.0                      |                                                                                   |
| Kotlin/JS (Classic back-end)                      | Stable       | 1.3                      | Deprecated from 1.8.0, read the [IR migration guide](js-ir-migration.md)          |
| Kotlin/JVM (IR-based)                             | Stable       | 1.5                      |                                                                                   |
| Kotlin/JS (IR-based)                              | Stable       | 1.8                      |                                                                                   |
| Kotlin/Native Runtime                             | Beta         | 1.3                      |                                                                                   |
| Kotlin/Native memory manager                      | Beta         | 1.7.20                   | Same stability level as Kotlin/Native                                             |
| klib binaries                                     | Beta         | 1.9.0                    |                                                                                   |
| Kotlin Multiplatform                              | Beta         | 1.7.20                   |                                                                                   |
| Kotlin/Native interop with C and Objective C      | Beta         | 1.3                      |                                                                                   |
| CocoaPods integration                             | Beta         | 1.3                      |                                                                                   |
| Kotlin Multiplatform Mobile plugin for Android Studio | Beta         | 0.5.2                    | [Versioned separately from the language](multiplatform-mobile-plugin-releases.md) |
| expect/actual language feature                    | Beta         | 1.2                      |                                                                                   |
| KDoc syntax                                       | Stable       | 1.0                      |                                                                                   |
| Dokka                                             | Beta         | 1.6                      |                                                                                   |
| Scripting syntax and semantics                    | Alpha        | 1.2                      |                                                                                   |
| Scripting embedding and extension API             | Beta         | 1.5                      |                                                                                   |
| Scripting IDE support                             | Beta         |                          | Available since IntelliJ IDEA 2023.1 and later                                    |
| CLI scripting                                     | Alpha        | 1.2                      |                                                                                   |
| Compiler Plugin API                               | Experimental | 1.0                      |                                                                                   |
| Serialization Compiler Plugin                     | Stable       | 1.4                      |                                                                                   |
| Serialization Core Library                        | Stable       | 1.0.0                    | Versioned separately from the language                                            |
| Inline classes                                    | Stable       | 1.5                      |                                                                                   |
| Unsigned arithmetic                               | Stable       | 1.5                      |                                                                                   |
| Contracts in stdlib                               | Stable       | 1.3                      |                                                                                   |
| User-defined contracts                            | Experimental | 1.3                      |                                                                                   |
| **All other experimental components, by default** | Experimental | N/A                      |                                                                                   |

*[The pre-1.4 version of this page is available here](components-stability-pre-1.4.md).*
