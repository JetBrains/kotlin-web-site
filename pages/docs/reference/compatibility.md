---
type: doc
layout: reference
category: "Compatibility"
title: "Compatibility"
---

# Compatibility

This page describes compatibility guarantees for different versions and subsystems of Kotlin. 

## Compatibility glossary

Compatibility means answering the question: for given two versions of Kotlin (for example, 1.2 and 1.1.5), can the code written for one version be used with another version? The list below explains the compatibility modes of different pairs of versions. Note that a version is older if it has a smaller version number (even if it was released later than the version with a larger version number). We use OV for "Older Version", and NV for "Newer Version". 

- **C** - Full **C**ompatibility
  - Language
    - no syntax changes (*modulo bugs*\*)
    - new warnings/hints may be added or removed
  - API (`kotlin-stdlib-*`, `kotlin-reflect-*`)
    - no API changes
    - deprecations with level `WARNING` may be added/removed
  - Binaries (ABI)
    - runtime: binaries can be used interchangeably
    - compilation: binaries can be used interchangeably
- **BCLA** - **B**ackward **C**ompatibility for the **L**anguage and **A**PI
  - Language
    - syntax deprecated in OV may be removed in NV
    - other than that, all code compilable in OV is compilable by in NV (modulo bugs*)
    - new syntax may be added in NV
    - some restrictions of OV may be lifted in NV 
    - new warnings/hints may be added or removed
  - API (`kotlin-stdlib-*`, `kotlin-reflect-*`)
    - new APIs may be added
    - deprecations with level `WARNING` may be added/removed
    - deprecations with level `WARNING` may be elevated to level `ERROR` or `HIDDEN` in NV
- **BCB** - **B**ackward **C**ompatibility for **B**inaries
  - Binaries (ABI)
    - runtime: NV-binaries can be used  everywhere where OV binaries worked
    - NV compiler: code compilable against OV binaries is compilable against NV binaries
    - OV compiler may not accept NV binaries (e.g. those that exhibit newer language features or APIs)
- **BC** - Full **B**ackward **C**ompatibility
  - BC = BCLA & BCB
- **EXP** - Experimental feature
  - see [below](#experimental-features)
- **NO** - No compatibility guarantees
  - we'll do our best to offer smooth migration, but can give no guarantees
  - migration is planned individually for every incompatible subsystem 

---

\* No changes *modulo bugs* means that if an important bug is found (e.g. in the compiler diagnostics or elsewhere), a fix for it may introduce a breaking change, but we are always very careful with such changes.

## Compatibility guarantees for Kotlin releases

**Kotlin for JVM**:
  - patch version updates (e.g. 1.1.X) are fully compatible;
  - minor version updates (e.g. 1.X) are backwards compatible.

| Kotlin    | 1.0 | 1.0.X | 1.1 | 1.1.X | ... | 2.0 |
|----------:|:---:|:-----:|:---:|:-----:|:---:|:---:|
| **1.0**   | -   | C     | BC  | BC    | ... | ?   |
| **1.0.X** | C   | -     | BC  | BC    | ... | ?
| **1.1**   | BC  | BC    | -   | C     | ... | ?
| **1.1.X** | BC  | BC    | C   | -     | ... | ?
| **...**   | ... | ...   | ... | ...   | ... | ... |
| **2.0**   | ?   | ?     | ?   | ?     | ... | - 

**Kotlin for JS**: starting with Kotlin 1.1, both patch and minor version updates provide backward compatibility for the language and API (BCLA), but no BCB.  

| Kotlin    | 1.0.X | 1.1  | 1.1.X | ... | 2.0 |
|----------:|:-----:|:----:|:-----:|:---:|:---:|
| **1.0.X** | -     |  EXP | EXP   | ... | EXP |
| **1.1**   | EXP   |  -   | BCLA  | ... | ?
| **1.1.X** | EXP   | BCLA | -     | ... | ?
| **...**   | ...   | ...  | ...   | ... | ... |
| **2.0**   | EXP   | ?    | ?     | ... | - 

**Kotlin Scripts**: both patch and minor version updates provide backward compatibility for the language and API (BCLA), but no BCB.

## Compatibility across platforms
 
Kotlin is available for several platforms (JVM/Android, JavaScript and the upcoming native platforms). Every platform has its own peculiarities (e.g. JavaScript has no proper integers), so we have to adapt the language accordingly. Our goal is to provide reasonable code portability without sacrificing too much.
  
Every platform may feature specific language extensions (such as platform types for JVM and dynamic types for JavaScript) or restrictions (e.g. some overloading-related restrictions on  the JVM), but the core language remains the same. 

The Standard Library provides a core API available on all platforms, and we strive to make these APIs work in the same way on every platform. Along with these, the Standard Library provides platform-specific extensions (e.g. `java.io` for JVM, or `js()` for JavaScript), plus some APIs that can be called uniformly, but work differently (such as regular expressions for JVM and JavaScript).    

## Experimental features

Experimental features, such as coroutines in Kotlin 1.1, have exemption from the compatibility modes listed above. Such features require an opt-in to use without compiler warning. Experimental features are at least backwards compatible for patch version updates, but we do not guarantee any compatibility for minor version updates (migration aids will be provided where possible).    

| Kotlin    | 1.1 | 1.1.X | 1.2 | 1.2.X | 
|----------:|:---:|:-----:|:---:|:-----:|
| **1.1**   | -   | BC    | NO  | NO  
| **1.1.X** | BC  | -     | NO  | NO
| **1.2**   | NO  | NO    | -   | BC 
| **1.2.X** | NO  | NO    | BC  | - 

## EAP builds

We publish Early Access Preview (EAP) builds to special channels where early adopters from the community can try them out and give us feedback. Such builds provide no compatibility guarantees whatsoever (although we do our best to keep them reasonably compatible with releases and with each other). Quality expectations for such builds are also much lower than for releases. Beta builds also fall under this category.

**IMPORTANT NOTE**: all binaries compiled by EAP builds for 1.X (e.g. 1.1.0-eap-X) are **rejected by release builds of the compiler**. We don't want any code compiled by pre-release versions to be kept around after a stable version is released. This does not concern EAPs of patch versions (e.g. 1.1.3-eap-X), these EAPs produce builds with stable ABI. 

## Compatibility modes

When a big team is migrating onto a new version, it may appear in a "inconsistent state" at some point, when some developers have already updated, and others haven't. To prevent the former from writing and committing code that others may not be able to compile, we provide the following command line switches (also available in the IDE and [Gradle](https://kotlinlang.org/docs/reference/using-gradle.html#compiler-options)/[Maven](https://kotlinlang.org/docs/reference/using-maven.html#specifying-compiler-options)):   

- `-language-version X.Y` - compatibility mode for Kotlin language version X.Y, reports errors for all language features that came out later.
- `-api-version X.Y` - compatibility mode for Kotlin API version X.Y, reports errors for all code using newer APIs from the Kotlin Standard Library (including the code generated by the compiler).

## Binary compatibility warnings

If you use the NV Kotlin compiler and have the OV standard library or the OV reflection library in the classpath, it can be a sign that the project is misconfigured.
To prevent unexpected problems during compilation or at runtime, we suggest either updating the dependencies to NV, or specifying the API version / language version arguments explicitly.
Otherwise the compiler detects that something can go wrong and reports a warning.

For example, if OV = 1.0 and NV = 1.1, you can observe one of the following warnings:

```
Runtime JAR files in the classpath have the version 1.0, which is older than the API version 1.1. 
Consider using the runtime of version 1.1, or pass '-api-version 1.0' explicitly to restrict the 
available APIs to the runtime of version 1.0.
```

This means that you're using the Kotlin compiler 1.1 against the standard or reflection library of version 1.0. This can be handled in different ways:
* If you intend to use the APIs from the 1.1 Standard Library, or language features that depend on those APIs, you should upgrade the dependency to the version 1.1.
* If you want to keep your code compatible with the 1.0 standard library, you can pass `-api-version 1.0`.
* If you've just upgraded to Kotlin 1.1 but can not use new language features yet (e.g. because some of your teammates may not have upgraded), you can pass `-language-version 1.0`, which will restrict all APIs and language features to 1.0.

```
Runtime JAR files in the classpath should have the same version. These files were found in the classpath:
    kotlin-reflect.jar (version 1.0)
    kotlin-stdlib.jar (version 1.1)
Consider providing an explicit dependency on kotlin-reflect 1.1 to prevent strange errors
Some runtime JAR files in the classpath have an incompatible version. Consider removing them from the classpath
```

This means that you have a dependency on libraries of different versions, for example the 1.1 standard library and the 1.0 reflection library. To prevent subtle errors at runtime, we recommend you to use the same version of all Kotlin libraries. In this case, consider adding an explicit dependency on the 1.1 reflection library.

```
Some JAR files in the classpath have the Kotlin Runtime library bundled into them. 
This may cause difficult to debug problems if there's a different version of the Kotlin Runtime library in the classpath. 
Consider removing these libraries from the classpath
```

This means that there's a library in the classpath which does not depend on the Kotlin standard library as a Gradle/Maven dependency, but is distributed in the same artifact with it (i.e. has it _bundled_). Such a library may cause issues because standard build tools do not consider it an instance of the Kotlin standard library, thus it's not subject to the dependency version resolution mechanisms, and you can end up with several versions of the same library in the classpath. Consider contacting the authors of such a library and suggesting to use the Gradle/Maven dependency instead.
