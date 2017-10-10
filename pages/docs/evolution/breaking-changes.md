---
type: doc
layout: reference
category: "Language Evolution"
title: "Kotlin Version Compatibility and Breaking Changes"
toc: true
---

# Breaking Change Policy 


## `1` Intro
This document contains definitions and policies adhered to by the Kotlin
language designers & [committee](language-committee.html) with regards to version compatibility and
languages changes.


## `2` Summary of the Policy

This policy is to set the expectations for Kotlin users, what they can
rely on:

`2.1` Users' binaries and source code won't break on compiler updates (with some caveats in a really small % of the cases)

`2.2` If something is deprecated, there
will be a migration path:

`2.2.1` Users will be informed in a timely fashion
 (exact timeline will be defined on a case-by-case basis).

`2.2.2` Users should have enough time to migrate
    comfortably.

`2.2.3` Users won't have to do much by hand (the
    tooling will help along).




## `3` Basic principles of this policy

`3.1` We care about pragmatics, not formality.

`3.2` Breaking existing code is generally undesirable
    and should be avoided.

`3.2.1` Binary incompatibilities for the JVM are
    generally a lot harder to address on the user side, so the users
    should never be required to fix them.

`3.2.2` Source incompatibilities are easier to
    address, especially with the help of automated tools, but they
    still introduce significant inconvenience and should be generally
    avoided.

`3.3` Sometimes incompatible changes are needed
    for the long-term benefit of the language and its users, and we are
    willing to make those changes, after careful consideration and
    justification.

`3.3.1` *Example*: bugs and underspecified behaviors
    in kotlinc and kotlin-stdlib may require incompatible fixes, and it
    is often better to fix them (formally, breaking compatibility) than
    carry them around indefinitely.

`3.3.2` *Example*: some language improvements that
    many users will benefit from may introduce subtle changes that do
    not harm most of the code out there.

`3.3.2` *Example*: legacy features that are no longer
    considered a good practice should be phased out (very) gradually.

`3.4` To be pragmatically beneficial, such changes
    should go through a graceful deprecation cycle, where the user is
    never stuck with a large number of migration issues to be addressed
    manually.

`3.5` Those issues that have to be addressed manually
 should be highlighted for the user by the tooling.

`3.6` Any change that deprecates or breaks
compatibilty for a feature or API needs to be reviewed by the Kotlin
Language Committee following the
[review procedure](/process/index.html).


## `4` How breaking changes can be introduced and dealt with

`4.1` Small changes that virtually no users will
    encounter can normally be made right away (still require committee
    [review](#3-6)).

`4.1.1` When unsure about the full risk/impact of
    a change:

*   Implement the change in a preview build.
*   Try on large bodies of code available to us.
*   Fall back to [deprecation procedure](#5) if needed.

`4.2` Behavior changing bug fixes in kotlinc:

`4.2.1` Good code did not compile due to a bug can be
    fixed right away.

`4.2.2` Bad code compiled due to a bug, but always
    failed at runtime can be fixed right away.

`4.2.3` Bad code compiled due to a bug, and worked
    reasonably, must follow the deprecation policy spelled out in
    [Paragraph 5](#5).


`4.3` Bug fixes and contract refinement in the
 kotlin-stdlib require publishing a release note one version in advance.

`4.4` Retiring language features & kotlin-stdlib APIs
    must follow the deprecation policies spelled out in
    [Paragraph 5](#5) and [Paragraph 6](#6).



## `5` Deprecation procedures for language features

Deprecation is closely related to versioning, for versioning scheme
we defer to the existing
[versioning policy](https://kotlinlang.org/docs/reference/compatibility.html).

`5.1` Before any changes are made, the upcoming
    change along with its rationale and the deprecation/migration plan
    need to be announced to the Kotlin Community.

`5.2` Release a version (call it N.M) that reports
    deprecation warnings for the feature:

`5.2.1` Provide and describe a replacement for
    deprecated constructs as part of the warning.

`5.2.3` Allow to disable the warnings in settings,
    or promote them to errors.

`5.2.4` Along with this version, provide automated
    migration aids (e.g. in the IDE).

`5.3` Allow a long enough period of time for
    migration, the exact time will be based on the impact and complexity
    of the change as discussed during the Kotlin Language Committee
    [review](/process/index.html).

`5.4` In the version N.M+1 or N+1, report errors for
 previously deprecated cases.

`5.4.1` In the release notes, repeat the information
    about the deprecation plan.

`5.4.2` Allow to demote the errors to warnings through
    settings.

`5.4.3` Keep migration aids available.

`5.4` In the version N.M+2 or N+1, report errors for
    the deprecated feature.

`5.4.1` In the release notes, declare the feature as
    discontinued.

`5.4.2` If possible, keep a compatibility mode that
    does not support new features, but allows the deprecated one as in
    version N.M+1 or N+1.X.

`5.4.3` Migration aids can be removed from the
    compiler at this point.

`5.5` A version that supports automated migration
    must be maintained and kept available for download. Such tools can
    be retired after support period of a few years, and the retirement
    must be announced at least 1 year in advance.

`5.6` Backward compatibility modes in the compiler
    (through -language-version and -api-version) are supported for a few
    years and their retirement must be announced at least 1 year in
    advance.



## `6` Deprecation procedure for the Standard Library

`6.1` Version N: Mark the declarations as
`@Deprecated(level = WARNING)`

`6.1.1` Provide reasonable ReplaceWith if possible,
    or custom migration aids if needed.

`6.1.2` Provide an optional support dependency that
    exposes the same API.

`6.2` Version N+1: Mark the declarations as
`@Deprecated(level = ERROR)`

`6.3` Version N+2: Mark the declarations as
`@Deprecated(level = HIDDEN)`

`6.3.1`  *Note*: for inline functions, complete
     removal is sometimes possible at this point.



## `7` The scope of this policy


### `7.1` In scope

`7.1.1` Language: syntax, static checks, execution
    semantics of language constructs.

`7.1.2` The interop subsystem of the language: how
    Java declarations are seen from Kotlin, and how Kotlin declarations
    are seen from Java.

`7.1.3` Compatibility of binary artifacts produced by
 kotlinc with one another and with Java binaries

`7.1.4` Standard library: API and contracts of the
    declarations in kotlin-stdlib (and its  extensions such as for JRE
    7 & 8).

`7.1.5` CLI parameters of the compiler except for the
    -X keys.

`7.1.6` Language Feature, Syntax & API Migration
 tools.

`7.1.7` KDoc syntax.


### `7.2` Out of scope

`7.2.1` Build tools and plugins for them (e.g. Gradle
    support).

`7.2.2` IDE and static analysis tools (other than the
    compiler).

`7.2.3` Java2Kotlin converter and other source code
    manipulation tools.

`7.2.4` Experimental language features & APIs.

`7.2.5` APIs and contracts of libraries other than the
    standard library.

`7.2.6` API of the compiler.

`7.2.7` Scripting support and Compiler REPL loop.

`7.2.8` dokka (docs generation tool).

`7.2.9` Internal packages of the standard library.

`7.2.10` kotlin-reflect - until it graduates from the
    experimental status.

`7.2.11` kotlin-script-runtime - until it graduates
    from the experimental status.

## `8` Different requirements for different platforms

### `8.1` Kotlin/JVM

No additional requirements on deprecation/breaking changes.

### `8.2` Kotlin/JS

`8.2.1` Binary compatibility is not guaranteed for the
JS world, because everything is usually built from sources.

### `8.3` Kotlin/Native

`8.3.1` Until Kotlin/Native reaches an official
    release, no compatibility guarantees are given for Kotlin/Native.

`8.3.2` After Kotlin/Native reaches the official
    release, the binary compatibility guarantees should be considered
    for Kotlin/Native, but as long as it is mostly focused on statically
    linked programs, the importance of binary compatibility is
    relatively low (compared to Kotlin/JVM).


## `9` Examples: issues & non-issues

Notation: NC — new compiler, OC — old compiler.

### `9.1` Binary Change, issues

`9.1.1` A binary produced from unchanged code with NC
    fails where the one produced by OC worked.

*Examples of failures*: linkage error, runtime exceptions not
        present in previous versions, deadlocks, race conditions

### `9.2` Binary Change, non-issues

`9.2.1` A binary compiled with NC may be rejected by
    OC, when it relies on new language features unsupported in OC.

`9.2.2` A binary compiled against a newer version of
    kotlin-stdlib fails when an older version of kotlin-stdlib is
    supplied at runtime.

`9.2.3` Adding generic parameters to existing
    declarations does not change the ABI on the JVM (due to erasure).

`9.2.4` Changes to signatures of functions marked
    @InlineOnly are not changing the ABI on the JVM.

`9.2.5` Adding supertypes to existing library
classes/interfaces.

### `9.3` Source Change, issues

`9.3.1` Sources that compiled with OC don't compile
    with NC against the same classpath.

`9.3.2` Unchanged sources compile with NC, but their
    behavior changes in a way significant for contract-abiding use
    cases.

### `9.4` Source Change, non-issues

`9.4.1` Code compilable with NC fails to compile with
    OC (e.g. due to new language features supported in NC).

`9.4.2` The code breaks only if the user alters the
    build configuration or compiler settings explicitly (i.e. in
    addition to advancing the compiler version).

### `9.5` Library Change, issues

`9.5.1` Making a contract on existing API more strict
    than it used to be in a previous version.

### `9.5` Library Change, non-issues

`9.5.2` Relaxing a contract on existing APIs.

`9.5.3` Clarification for unspecified behaviors.

`9.5.4` Changes in hashCode() are not breaking
    changes.

`9.5.5` Changes in toString() on other than Boolean,
    Numeric, and String types are not breaking changes.

`9.5.6` Improper loading of two different versions of
    stdlib at runtime.


### `9.6` Performance changes

We recognize that runtime performance and bytecode size are important
metrics, and will make reasonable effort to keep them in a good shape,
but we don't consider every slowdown (e.g. in edge cases or in very cold
code) and every extra byte in the classfile a breaking change.


## `10` Examples of subtle issues

Banishing the changes listed in this section may pose significant
problems for language evolution.

`10.1` Changes in type inference and overload
    resolution algorithms.

`10.1.1` It's reasonable to assume that overloads of
    the same function are generally intended to do the same thing. So,
    though undesirable, a change in overload resolution that causes a
    different overload to be selected, may be acceptable. We encourage
    our users to follow this principle when defining overloaded
    functions.

`10.1.2` Some improvements in the language (such as
    type inference, for example) may result in more precise static types
    known for some expressions. This may cause changes in overload
    resolution [as stated above](#10-1-1), or even in type
    signatures of declarations when return types are inferred from
    bodies.

`10.1.3` some innocuous-looking changes in the source
    code, done by the user, may cause similar effects. We encourage our
    users to specify return types explicitly on public APIs to ensure
    their stability and binary compatibility.

`10.1.4` Other improvements in type inference may
    cause edge cases to break or change their results, but it's often
    tolerable to introduce such changes.


`10.2` Changes in private/synthetic JVM signatures
generated by the compiler.

While generally an implementation detail that we would like to change,
in exceptional cases when some users may rely heavily on such
declarations, extra care will be required in introducing the changes.

`10.3` Moving classes from one JAR to another.

This may be required by the platform (e.g. JVM does not allow split
packages, and the "kotlin" package has historically been split across
multiple jars) or other circumstances (popular verification tools, like
ProGuard, rejecting duplicate classes, etc). A reasonable migration
strategy has to be worked out in each individual case, and some pain on
the user end may be inevitable.

`10.4` Compatibility with the future.

In the case of unsigned arithmetic and value types for Kotlin, we know
that Java is going to add them some time in the future, and our present
version will be incompatible with their version (e.g. the API that
expects a Kotlin UInt won't take Java UInt, and vice versa). If we
retarget new libraries against the new JVM types, their old clients will
break. This is a matter of choosing a trade-off and a reasonable
deprecation/migration policy.


`10.5` Compatibility of mental models.

Kotlin unsigned integers will be signed for Java clients, and the
programmer that works with the same API in the Java code will be
surprised by getting different result. While an undesirable situation,
this is sometimes inevitable, and should not be considered a breaking
change (it does not fall under the intuitive definition of one anyway).

`10.6` Interop compatibility vs improvements.

*Example*: Android SDK needs to introduce nullability annotations,
which will likely break source compatibility for many users. We still
want to do it, but devise a migration mechanism that will first report
future issues as warnings, and let the users migrate.

## `11` Changes to this policy

`11.1` Changes to this policy need to be approved by
    the Kotlin Language Committee.

`11.2` Any proposed change needs to be published as
    a GitHub pull request; providing a reasonable time to allow for
     comments on the change by the Kotlin Community.

