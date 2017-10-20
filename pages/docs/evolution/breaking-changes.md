---
type: doc
layout: reference
category: "Language Evolution"
title: "Kotlin Version Compatibility and Breaking Changes"
toc: true
---

<!--
WHY THIS FILE HAS MANUALLY EDITABLE PARAGRAPH NUMBERS

There will be external links to these paragraphs, and one needs a very good reason to change the numbering. Generally, it's only OK to add paragraphs to this file in such a way that the numbering of the existing paragraphs does not change  
-->

# Backwards Incompatible Changes and Deprecation Guidelines


## `1` Intro
This document contains definitions and policies with regards to version compatibility and languages changes. The Kotlin language designers & [committee](language-committee.html) use it as guidelines to consult with when making design decisions. 

## `2` Kotlin language evolution  

`2.1` **Our creed**. Kotlin is and should remain a modern language for industry. We care about pragmatics, not formality.

`2.1.1` This means that we have to reconcile moving fast (which sometimes requires breaking things) and keeping the design stable enough to be pragmatically usable. We are balancing between two priorities: **the long-term health of the language** and **the short-term comfort of its users**. Both are very important, and trade-offs are to be made carefully.  

`2.1` **Keeping the language modern**. We recognize that languages accumulate legacy over time. Our goal is to keep the Kotlin language fit and modern by cleaning this legacy up. Obsolete things should be eventually dropped, and bugs should be fixed. We are willing to make such changes after careful consideration and justification.

`2.1.1` *NOTE*: Keeping all the legacy around forever would mean that every language design decision made must be proven to be 100% correct and never require future fixes. In practice, it would hinder language evolution a lot, so we want to be able to move faster knowing that we can make mistakes and fix them in the future. This being said, we recognize that our mistakes cause our users pain, so we try to avoid them to the best of our abilities.   

`2.1.1` *Example*: bugs and underspecified/accidental behaviors
    in `kotlinc` and `kotlin-stdlib` may require incompatible fixes, and it
    is often better to fix them (formally, breaking compatibility) than
    carry them around indefinitely.

`2.1.2` *Example*: some language improvements that
    many users will benefit from may introduce subtle changes that do
    not harm most of the code out there.

`2.1.3` *Example*: legacy features that are no longer
    considered a good practice should be phased out (very) gradually.

`2.1.4` *Example*: mechanisms that became irrelevant over time due to some changes in the environment should also be phased out.

`2.3` **Pragmatic usefulness**. We also recognize that backwards incompatible changes in the language are distracting developers from their primary focus and should be generally avoided. When necessary, to be pragmatically beneficial, such changes should go through a graceful deprecation cycle, where the user is never stuck with a large number of migration issues to be addressed manually. 

`2.4.1` Users' binaries and source code shouldn't break unexpectedly or frequently on compiler updates. 

`2.4.2` If a backwards incompatible change inconveniences many users of the language considerably, it makes the change highly questionable, so only an exceptional need can justify it.  

`2.4.3` Backwards incompatible changes should be introduced through a deprecation when possible. 

`2.4.4` The tooling should provide means of detection and migration: users shouldn't be required to do much by hand.

`2.4.4` Users should be informed about such changes in a timely fashion (exact timeline is to be defined on a case-by-case basis). In particular, users should have enough time to migrate comfortably.

`2.6.1` *NOTE*: Binary incompatibilities for the JVM are generally a lot harder to address on the user side, so requiring the  users to fix them should be avoided.
 
`2.7` Any change that deprecates or breaks
compatibility for a language feature or standard API needs to be reviewed by the [Kotlin
Language Committee](language-committee.html) following the
[review procedure](/change-review-process.html).

## `3` Types of incompatible changes and corresponding guidelines

`3.1` Small fixes that virtually no users will
    encounter can normally be made right away (still require committee
    [review](#2.4)).

`3.1.1` When unsure about the full risk/impact of
    a change:

*   Implement the change in a preview build.
*   Try on large bodies of code available to us.
*   Fall back to [deprecation procedure](#4) if needed.

`3.2` Behavior-changing bug fixes in `kotlinc`:

`3.2.1` Good code did not compile due to a bug can be
    fixed right away.

`3.2.2` Bad code compiled due to a bug, but always
    failed at runtime can be fixed right away.

`3.2.3` Bad code compiled due to a bug, and worked
    reasonably, must follow the deprecation policy spelled out in
    [Paragraph 4](#4).


`3.3` Bug fixes and contract refinement in the
 `kotlin-stdlib` require publishing a release note one version in advance.

`3.4` Retiring language features & `kotlin-stdlib` APIs
    must follow the deprecation policies spelled out in
    [Paragraph 4](#4) and [Paragraph 5](#5).



## `4` Deprecation procedures for language features

Deprecation is closely related to versioning, for versioning scheme
we refer to the existing [versioning policy](../reference/compatibility.html).

`4.1` Before any changes are made, the upcoming
    change along with its rationale and the deprecation/migration plan
    need to be announced to the Kotlin community, 
    preview builds of the compiler and standard library should be made available.

`4.2` Release a version (call it N.M) that reports
    deprecation warnings for the feature:

`4.2.1` Provide and describe a replacement for
    deprecated constructs as part of the warning.

`4.2.2` Allow to disable the warnings in settings,
    or promote them to errors.

`4.2.3` Along with this version, provide automated
    migration aids (e.g. in the IDE).

`4.3` Allow a long enough period of time for
    migration, the exact time will be based on the impact and complexity
    of the change as discussed during the Kotlin Language Committee
    [review](/process/index.html).

`4.4` In the version N.M+1 or N+1, report errors for
 previously deprecated cases.

`4.4.1` In the release notes, repeat the information
    about the deprecation plan.

`4.4.2` Allow to demote the errors to warnings through
    settings.

`4.4.3` Keep migration aids available.

`4.5` In the version N.M+2 or N+1, report errors for
    the deprecated feature.

`4.5.1` In the release notes, declare the feature as
    discontinued.

`4.5.2` If possible, keep a compatibility mode that
    does not support new features, but allows the deprecated one as in
    version N.M+1 or N+1.X.

`4.5.3` Migration aids can be removed from the
    compiler at this point.

`4.6` A version that supports automated migration
    must be maintained and kept available for download. Such tools can
    be retired after support period of a few years, and the retirement
    must be announced at least 1 year in advance.

`4.7` Backward compatibility modes in the compiler
    (through -language-version and -api-version) are supported for a few
    years and their retirement must be announced at least 1 year in
    advance.

## `5` Deprecation procedure for the Standard Library

`5.1` Version N: Mark the declarations as
`@Deprecated(level = WARNING)`

`5.1.1` Provide reasonable ReplaceWith if possible,
    or custom migration aids if needed.

`5.1.2` Provide an optional support dependency that
    exposes the same API.

`5.2` Version N+1: Mark the declarations as
`@Deprecated(level = ERROR)`

`5.3` Version N+2: Mark the declarations as
`@Deprecated(level = HIDDEN)`

`5.3.1`  *Note*: for inline functions, complete
     removal is sometimes possible at this point.



## `6` The scope of this policy

### `5.5` In scope

`5.5.1` Language: syntax, static checks, execution
    semantics of language constructs.

`5.5.2` The interop subsystem of the language: how
    Java declarations are seen from Kotlin, and how Kotlin declarations
    are seen from Java.

`5.5.3` Compatibility of binary artifacts produced by
 kotlinc with one another and with Java binaries

`5.5.4` Standard library: API and contracts of the
    declarations in kotlin-stdlib (and its  extensions such as for JRE
    7 & 8).

`5.5.5` CLI parameters of the compiler except for the
    -X keys.

`5.5.6` Language Feature, Syntax & API Migration
 tools.

`5.5.7` KDoc syntax.


### `5.6` Out of scope

`5.6.1` Build tools and plugins for them (e.g. Gradle
    support).

`5.6.2` IDE and static analysis tools (other than the
    compiler).

`5.6.3` Java2Kotlin converter and other source code
    manipulation tools.

`5.6.4` Experimental language features & APIs.

`5.6.5` APIs and contracts of libraries other than the
    standard library.

`5.6.6` API of the compiler.

`5.6.7` Scripting support and Compiler REPL loop.

`5.6.8` dokka (docs generation tool).

`5.6.9` Internal packages of the standard library.

`5.6.10` kotlin-reflect - until it graduates from the
    experimental status.

`5.6.11` kotlin-script-runtime - until it graduates
    from the experimental status.

## `5.7` Different requirements for different platforms

### `5.8` Kotlin/JVM

No additional requirements on deprecation/breaking changes.

### `5.9` Kotlin/JS

`5.9.1` Binary compatibility is not guaranteed for the
JS world, because everything is usually built from sources.

### `5.10` Kotlin/Native

`5.10.1` Until Kotlin/Native reaches an official
    release, no compatibility guarantees are given for Kotlin/Native.

`5.10.2` After Kotlin/Native reaches the official
    release, the binary compatibility guarantees should be considered
    for Kotlin/Native, but as long as it is mostly focused on statically
    linked programs, the importance of binary compatibility is
    relatively low (compared to Kotlin/JVM).


## `5.11` Examples: issues & non-issues

Notation: NC — new compiler, OC — old compiler.

### `5.12` Binary Change, issues

`5.12.1` A binary produced from unchanged code with NC
    fails where the one produced by OC worked.

*Examples of failures*: linkage error, runtime exceptions not
        present in previous versions, deadlocks, race conditions

### `5.13` Binary Change, non-issues

`5.13.1` A binary compiled with NC may be rejected by
    OC, when it relies on new language features unsupported in OC.

`5.13.2` A binary compiled against a newer version of
    kotlin-stdlib fails when an older version of kotlin-stdlib is
    supplied at runtime.

`5.13.3` Adding generic parameters to existing
    declarations does not change the ABI on the JVM (due to erasure).

`5.13.4` Changes to signatures of functions marked
    @InlineOnly are not changing the ABI on the JVM.

`5.13.5` Adding supertypes to existing library
classes/interfaces.

### `5.14` Source Change, issues

`5.14.1` Sources that compiled with OC don't compile
    with NC against the same classpath.

`5.14.2` Unchanged sources compile with NC, but their
    behavior changes in a way significant for contract-abiding use
    cases.

### `5.15` Source Change, non-issues

`5.15.1` Code compilable with NC fails to compile with
    OC (e.g. due to new language features supported in NC).

`5.15.2` The code breaks only if the user alters the
    build configuration or compiler settings explicitly (i.e. in
    addition to advancing the compiler version).

### `5.16` Library Change, issues

`5.16.1` Making a contract on existing API more strict
    than it used to be in a previous version.

### `5.17` Library Change, non-issues

`5.17.1` Relaxing a contract on existing APIs.

`5.17.2` Clarification for unspecified behaviors.

`5.17.3` Changes in hashCode() are not breaking
    changes.

`5.17.4` Changes in toString() on other than Boolean,
    Numeric, and String types are not breaking changes.

`5.17.5` Improper loading of two different versions of
    stdlib at runtime.


### `5.18` Performance changes

We recognize that runtime performance and bytecode size are important
metrics, and will make reasonable effort to keep them in a good shape,
but we don't consider every slowdown (e.g. in edge cases or in very cold
code) and every extra byte in the classfile a breaking change.


## `6` Examples of subtle issues

Banishing the changes listed in this section may pose significant
problems for language evolution.

`6.1` Changes in type inference and overload
    resolution algorithms.

`6.1.1` It's reasonable to assume that overloads of
    the same function are generally intended to do the same thing. So,
    though undesirable, a change in overload resolution that causes a
    different overload to be selected, may be acceptable. We encourage
    our users to follow this principle when defining overloaded
    functions.

`6.1.2` Some improvements in the language (such as
    type inference, for example) may result in more precise static types
    known for some expressions. This may cause changes in overload
    resolution [as stated above](#10.1.1), or even in type
    signatures of declarations when return types are inferred from
    bodies.

`6.1.3` some innocuous-looking changes in the source
    code, done by the user, may cause similar effects. We encourage our
    users to specify return types explicitly on public APIs to ensure
    their stability and binary compatibility.

`6.1.4` Other improvements in type inference may
    cause edge cases to break or change their results, but it's often
    tolerable to introduce such changes.


`6.2` Changes in private/synthetic JVM signatures
generated by the compiler.

While generally an implementation detail that we would like to change,
in exceptional cases when some users may rely heavily on such
declarations, extra care will be required in introducing the changes.

`6.3` Moving classes from one JAR to another.

This may be required by the platform (e.g. JVM does not allow split
packages, and the "kotlin" package has historically been split across
multiple jars) or other circumstances (popular verification tools, like
ProGuard, rejecting duplicate classes, etc). A reasonable migration
strategy has to be worked out in each individual case, and some pain on
the user end may be inevitable.

`6.4` Compatibility with the future.

In the case of unsigned arithmetic and value types for Kotlin, we know
that Java is going to add them some time in the future, and our present
version will be incompatible with their version (e.g. the API that
expects a Kotlin UInt won't take Java UInt, and vice versa). If we
retarget new libraries against the new JVM types, their old clients will
break. This is a matter of choosing a trade-off and a reasonable
deprecation/migration policy.


`6.5` Compatibility of mental models.

Kotlin unsigned integers will be signed for Java clients, and the
programmer that works with the same API in the Java code will be
surprised by getting different result. While an undesirable situation,
this is sometimes inevitable, and should not be considered a breaking
change (it does not fall under the intuitive definition of one anyway).

`6.6` Interop compatibility vs improvements.

*Example*: Android SDK needs to introduce nullability annotations,
which will likely break source compatibility for many users. We still
want to do it, but devise a migration mechanism that will first report
future issues as warnings, and let the users migrate.

## `7` Changes to this policy

`7.1` Changes to this policy need to be approved by
    the Kotlin Language Committee.

`7.2` Any proposed change needs to be published as
    a GitHub pull request; providing a reasonable time to allow for
     comments on the change by the Kotlin Community.

