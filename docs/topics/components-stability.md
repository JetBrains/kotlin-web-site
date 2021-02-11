[//]: # (title: Stability of Kotlin components)

The Kotlin language and toolset are divided into many components such as the compilers for the JVM, JS and Native targets, the Standard Library, various accompanying tools and so on. Many of these components were officially released as **Stable** which means that they are evolved in the backward-compatible way following the [principles](kotlin-evolution.md) of _Comfortable Updates_ and _Keeping the Language Modern_. Among such stable components are, for example, the Kotlin compiler for the JVM, the Standard Library, and Coroutines.

Following the _Feedback Loop_ principle we release many things early for the community to try out, so a number of components are not yet released as **Stable**. Some of them are very early stage, some are more mature. We mark them as **Experimental**, **Alpha** or **Beta** depending on how quickly each component is evolving and how much risk the users are taking when adopting it. 

## Stability levels explained

Here's a quick guide to these stability levels and their meaning:

**Experimental** means "try it only in toy projects":
  * We are just trying out an idea and want some users to play with it and give feedback. If it doesn't work out, we may drop it any minute.

**Alpha** means "use at your own risk, expect migration issues": 
  * We decided to productize this idea, but it hasn't reached the final shape yet.

**Beta** means "you can use it, we'll do our best to minimize migration issues for you": 
  * It’s almost done, user feedback is especially important now.
  * Still, it's not 100% finished, so changes are possible (including ones based on your own feedback).
  * Watch for deprecation warnings in advance for the best update experience.

We collectively refer to _Experimental_, _Alpha_ and _Beta_ as **pre-stable** levels.

<a name="stable"></a>
**Stable** means "use it even in most conservative scenarios":
  * It’s done. We will be evolving it according to our strict [backward compatibility rules](language-committee-guidelines.md).

Please note that stability levels do not say anything about how soon a component will be released as Stable. Similarly, they do not indicate how much a component will be changed before release. They only say how fast a component is changing and how much risk of update issues users are running.

## Stability of subcomponents

A stable component may have an experimental subcomponent, for example:
* a stable compiler may have an experimental feature;
* a stable API may include experimental classes or functions;
* a stable command-line tool may have experimental options.

We make sure to document precisely which subcomponents are not stable. We also do our best to warn users where possible and ask to opt in explicitly to avoid accidental usages of features that have not been released as stable.

## Current stability of Kotlin components

|**Component**|**Status**|**Status since version**|**Comment**|
| --- | --- | --- | --- |
Kotlin/JVM|Stable|1.0| |
kotlin-stdlib (JVM)|Stable|1.0| |
Coroutines|Stable|1.3| |
kotlin-reflect (JVM)|Beta|1.0| |
Kotlin/JS (Classic back-end)|Stable|1.3| |
Kotlin/JVM (IR-based)|Alpha|1.4| |
Kotlin/JS (IR-based)|Alpha|1.4| |
Kotlin/Native Runtime|Beta|1.3| |
KLib binaries|Alpha|1.4| |
KDoc syntax|Stable|1.0| |
dokka|Alpha|0.1| |
Kotlin Scripts (*.kts)|Beta|1.2| |
Kotlin Scripting APIs and custom hosts|Alpha|1.2| |
Compiler Plugin API|Experimental|1.0| |
Serialization Compiler Plugin|Stable|1.4| |
Serialization Core Library|Stable|1.0.0|Versioned separately from the language
Multiplatform Projects|Alpha|1.3| |
expect/actual language feature|Beta|1.2| |
Inline classes|Alpha|1.3| |
Unsigned arithmetics|Beta|1.3| |
Contracts in stdlib|Stable|1.3| |
User-defined contracts|Experimental|1.3| |
**All other experimental components, by default**|Experimental|N/A| |

*The pre-1.4 version of this page is available [here](components-stability-pre-1.4.md).*