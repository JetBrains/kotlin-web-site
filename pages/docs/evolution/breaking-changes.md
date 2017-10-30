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


## Intro
This document contains definitions and policies with regards to version compatibility and languages changes. The Kotlin language designers & [committee](language-committee.html) use it as guidelines to consult with when making design decisions. 

## `1` Kotlin language evolution  

`1.1` **Our creed**. Kotlin is and should remain a modern language for industry. We care about pragmatics, not formality.

`1.1.1` This means that we have to reconcile moving fast (which sometimes requires breaking things) and keeping the design stable enough to be pragmatically usable. We are balancing between two priorities: **the long-term health of the language** and **the short-term comfort of its users**. Both are very important, and trade-offs are to be made carefully.  

`1.2` **Keeping the language modern**. We recognize that languages accumulate legacy over time. Our goal is to keep the Kotlin language fit and modern by cleaning this legacy up. Obsolete things should be eventually dropped, and bugs should be fixed. We are willing to make such changes after careful consideration and justification.

`1.2.1` *NOTE*: Keeping all the legacy around forever would mean that every language design decision made must be proven to be 100% correct and never require future fixes. In practice, it would hinder language evolution a lot, so we want to be able to move faster knowing that we can make mistakes and fix them in the future. This being said, we recognize that our mistakes cause our users pain, so we try to avoid them to the best of our abilities.   

`1.2.2` *Example*: bugs and underspecified/accidental behaviors
    in `kotlinc` and `kotlin-stdlib` may require incompatible fixes, and it
    is often better to fix them (formally, breaking compatibility) than
    carry them around indefinitely.

`1.2.3` *Example*: some language improvements that
    many users will benefit from may introduce subtle changes that do
    not harm most of the code out there.

`1.2.4` *Example*: legacy features that are no longer
    considered a good practice should be phased out (very) gradually.

`1.2.5` *Example*: mechanisms that became irrelevant over time due to some changes in the environment should also be phased out.

`1.3` **Pragmatic usefulness**. We also recognize that backwards incompatible changes in the language are distracting developers from their primary focus and should be generally avoided. When necessary, to be pragmatically beneficial, such changes should go through a graceful deprecation cycle, where the user is never stuck with a large number of migration issues to be addressed manually. 

`1.3.1` Users' binaries and source code shouldn't break unexpectedly or frequently on compiler updates. 

`1.3.2` If a backwards incompatible change inconveniences many users of the language considerably, it makes the change highly questionable, so only an exceptional need can justify it.  

`1.3.3` Backwards incompatible changes should be introduced through a deprecation when possible. 

`1.3.4` The tooling should provide means of detection and migration: users shouldn't be required to do much by hand.

`1.3.5` Users should be informed about such changes in a timely fashion (exact timeline is to be defined on a case-by-case basis). In particular, users should have enough time to migrate comfortably.

`1.4` Any change that deprecates or breaks
compatibility for a language feature or standard API needs to be reviewed by the [Kotlin
Language Committee](language-committee.html) following the
[review procedure](/change-review-process.html).

## `2` Changes to this policy

`2.1` Changes to this policy need to be approved by
    the Kotlin Language Committee.

`2.2` Any proposed change needs to be published as
    a GitHub pull request; providing a reasonable time to allow for
     comments on the change by the Kotlin Community.

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

### `6.1` In scope

`6.1.1` Language: syntax, static checks, execution
    semantics of language constructs.

`6.1.2` The interop subsystem of the language: how
    Java declarations are seen from Kotlin, and how Kotlin declarations
    are seen from Java.

`6.1.3` Compatibility of binary artifacts produced by
 kotlinc with one another and with Java binaries

`6.1.4` Standard library: API and contracts of the
    declarations in kotlin-stdlib (and its  extensions such as for JRE
    7 & 8).

`6.1.5` CLI parameters of the compiler except for the
    -X keys.

`6.1.6` Language Feature, Syntax & API Migration
 tools.

`6.1.7` KDoc syntax.


### `6.2` Out of scope

`6.2.1` Build tools and plugins for them (e.g. Gradle
    support).

`6.2.2` IDE and static analysis tools (other than the
    compiler).

`6.2.3` Java2Kotlin converter and other source code
    manipulation tools.

`6.2.4` Experimental language features & APIs.

`6.2.5` APIs and contracts of libraries other than the
    standard library.

`6.2.6` API of the compiler.

`6.2.7` Scripting support and Compiler REPL loop.

`6.2.8` dokka (docs generation tool).

`6.2.9` Internal packages of the standard library.

`6.2.10` kotlin-reflect - until it graduates from the
    experimental status.

`6.2.11` kotlin-script-runtime - until it graduates
    from the experimental status.


## `8`. Examples: issues & non-issues

Notation: NC — new compiler, OC — old compiler.

### `8.1` Binary Change, issues

`8.1.1` A binary produced from unchanged code with NC
    fails where the one produced by OC worked.

*Examples of failures*: linkage error, runtime exceptions not
        present in previous versions, deadlocks, race conditions

### `8.2` Binary Change, non-issues

`8.2.1` A binary compiled with NC may be rejected by
    OC, when it relies on new language features unsupported in OC.

`8.2.2` A binary compiled against a newer version of
    kotlin-stdlib fails when an older version of kotlin-stdlib is
    supplied at runtime.

`8.2.3` Adding generic parameters to existing
    declarations does not change the ABI on the JVM (due to erasure).

`8.2.4` Changes to signatures of functions marked
    @InlineOnly are not changing the ABI on the JVM.

`8.2.5` Adding supertypes to existing library
classes/interfaces.

### `8.3` Source Change, issues

`8.3.1` Sources that compiled with OC don't compile
    with NC against the same classpath.

`8.3.2` Unchanged sources compile with NC, but their
    behavior changes in a way significant for contract-abiding use
    cases.

### `8.4` Source Change, non-issues

`8.4.1` Code compilable with NC fails to compile with
    OC (e.g. due to new language features supported in NC).

`8.4.2` The code breaks only if the user alters the
    build configuration or compiler settings explicitly (i.e. in
    addition to advancing the compiler version).

### `8.5` Library Change, issues

`8.5.1` Making a contract on existing API more strict
    than it used to be in a previous version.

### `8.6` Library Change, non-issues

`8.6.1` Relaxing a contract on existing APIs.

`8.6.2` Clarification for unspecified behaviors.

`8.6.3` Changes in hashCode() are not breaking
    changes.

`8.6.4` Changes in toString() on other than Boolean,
    Numeric, and String types are not breaking changes.

`8.6.5` Improper loading of two different versions of
    stdlib at runtime.


### `8.7` Performance changes

We recognize that runtime performance and bytecode size are important
metrics, and will make reasonable effort to keep them in a good shape,
but we don't consider every slowdown (e.g. in edge cases or in very cold
code) and every extra byte in the classfile a breaking change.


## Appendix `9` Examples of subtle issues

Banishing the changes listed in this section may pose significant
problems for language evolution.

`9.1` Changes in type inference and overload
    resolution algorithms.

`9.1.1` It's reasonable to assume that overloads of
    the same function are generally intended to do the same thing. So,
    though undesirable, a change in overload resolution that causes a
    different overload to be selected, may be acceptable. We encourage
    our users to follow this principle when defining overloaded
    functions.

`9.1.2` Some improvements in the language (such as
    type inference, for example) may result in more precise static types
    known for some expressions. This may cause changes in overload
    resolution [as stated above](#10.1.1), or even in type
    signatures of declarations when return types are inferred from
    bodies.

`9.1.3` some innocuous-looking changes in the source
    code, done by the user, may cause similar effects. We encourage our
    users to specify return types explicitly on public APIs to ensure
    their stability and binary compatibility.

`9.1.4` Other improvements in type inference may
    cause edge cases to break or change their results, but it's often
    tolerable to introduce such changes.


`9.2` Changes in private/synthetic JVM signatures
generated by the compiler.

While generally an implementation detail that we would like to change,
in exceptional cases when some users may rely heavily on such
declarations, extra care will be required in introducing the changes.

`9.3` Moving classes from one JAR to another.

This may be required by the platform (e.g. JVM does not allow split
packages, and the "kotlin" package has historically been split across
multiple jars) or other circumstances (popular verification tools, like
ProGuard, rejecting duplicate classes, etc). A reasonable migration
strategy has to be worked out in each individual case, and some pain on
the user end may be inevitable.

`9.4` Compatibility with the future.

In the case of unsigned arithmetic and value types for Kotlin, we know
that Java is going to add them some time in the future, and our present
version will be incompatible with their version (e.g. the API that
expects a Kotlin UInt won't take Java UInt, and vice versa). If we
retarget new libraries against the new JVM types, their old clients will
break. This is a matter of choosing a trade-off and a reasonable
deprecation/migration policy.


`9.5` Compatibility of mental models.

Kotlin unsigned integers will be signed for Java clients, and the
programmer that works with the same API in the Java code will be
surprised by getting different result. While an undesirable situation,
this is sometimes inevitable, and should not be considered a breaking
change (it does not fall under the intuitive definition of one anyway).

`9.6` Interop compatibility vs improvements.

*Example*: Android SDK needs to introduce nullability annotations,
which will likely break source compatibility for many users. We still
want to do it, but devise a migration mechanism that will first report
future issues as warnings, and let the users migrate.

