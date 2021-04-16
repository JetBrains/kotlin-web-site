[//]: # (title: Language Committee guidelines)

The Kotlin Language Committee has to approve every [incompatible change](kotlin-evolution.md#incompatible-changes) before it lands in a stable version. The committee determines whether the change is appropriate and motivated enough to be introduced and what deprecation procedures have to be carried out to ensure comfortable migration for end users.

These guidelines describe the process the Committee follows and the criteria used for decision making. We realize that these criteria can not be fully formalized and treat them as general guidelines, not a mechanical set of rules.

## Review process

Incompatible changes are submitted to the Language Committee by the [Lead Language Designer](kotlin-foundation.md). The Committee evaluates the implications of such changes, considering the following:
*   Substance: what is going to be changed
*   Impact: who will be affected by the change and in what ways
*   Motivation: why the change is needed
*   Detectability: can problematic code be automatically detected
*   Migration: to what extent can the code be migrated automatically

### Estimating impact

When in doubt, we inspect large bodies of code available to us and test the implementations in EAP builds to collect information about the expected impact of a change.

### Proposals

A proposal is usually written by a developer responsible for the change or the relevant subsystems. See the [Guide to submitting incompatible changes](submitting-incompatible-changes.md).

When an issue has all the necessary details, it can be scheduled for review by the Language Committee. Approved proposals are to be implemented by the development team and shipped in the appropriate stable release.

## Scope

Only features and components published as [Stable](components-stability.md#stability-levels-explained) are in the scope of Language Committee. Besides, the Language Committee's scope is limited to the following:
*   Language: syntax, static checks, execution semantics of language constructs
*   The interop subsystem of the language: how foreign declarations are seen from Kotlin, and how Kotlin declarations are seen from other languages
*   Compatibility of binary artifacts produced by kotlinc with one another and with other binaries (e.g. Java binaries)
*   Standard library: API and contracts of the declarations in kotlin-stdlib (and its extensions such as for `kotlin-stdlib-jdk7`)
*   CLI parameters of the compiler except for the `-X/-XX` keys
*   KDoc syntax

For example, the following matters are out of scope for the Language Committee:
*   Pre-stable language features & APIs
*   Build tools and plugins for them (e.g. Gradle support)
*   IDE and static analysis tools (other than the compiler)
*   Java2Kotlin converter and other source code manipulation tools
*   APIs and contracts of libraries other than the standard library
*   API of the compiler
*   Scripting support and Compiler REPL
*   Internal packages of the standard library

Also, see [Appendix A](#appendix-a-examples-of-non-issues) for examples of changes that are not considered to be compatibility issues.

## Migration aids and deprecation

Normally, incompatible changes to stable features only land in feature releases. We announce the changes in a previous release (it may be an incremental update to the previous feature release, but should allow enough time for users to migrate their code). 

The announcement is best done through compiler warnings, or in some cases IDE inspections and/or other tools. If places in the code that should be changed in advance to prevent compatibility issues in the future can be detected automatically, we announce the change and publish detection tools. 

If the necessary changes to user code can be automated, we publish a migration tool along with the announcement. Preferably, the IDE should suggest running the migration when it encounters deprecated constructs in the code.

When automatic detection and/or migration is not practically possible, we publish instructions on how user code should be adjusted.

### Insignificant changes

Some types of changes can be made without a deprecation cycle:
*   Small fixes that virtually no users will encounter can normally be made right away (but still require committee review)
*   Bugs causing compiler errors in good code can be fixed right away
*   Bugs causing bad code to compile, but always fail at runtime can be fixed right away

### Incompatible changes to the language

The typical deprecation cycle for an incompatible language change:
*   The change planned for version B is announced in release notes to a previous version A
    *   The compiler reports deprecation warnings (messages provide some guidance to possible replacements)
    *   Automated migration tools are available in the IDE
    *   For eligible changes, the `-progressive` flag enables the change before version B (e.g. in version A or an incremental update to it)
*   Version B ships with the change enabled (e.g. warnings turn into errors)
    *   Migrations aids are kept available in the IDE 
    *   Backward compatibility flags in the compiler (`-language-version` and `-api-version`) support the behavior of version A
*   Future versions can remove migration aids and compatibility flags, but a version capable of automated migration should be kept available for a reasonable amount of time

### Incompatible changes to the libraries

The typical deprecation cycle for libraries:
*   The change planned for version B is announced in release notes to a previous version A
    *   Relevant declarations are marked as `@Deprecated(level = WARNING)`
    *   Migration is automated through ReplaceWith or sometimes custom tooling
    *   In some cases an optional support dependency that exposes the same API is published
*   Version B marks the declarations as `@Deprecated(level = ERROR)`
*   Version C can mark the declarations as `@Deprecated(level = HIDDEN)`    
    *   Note: for inline functions, complete removal is sometimes possible at this point

## Changes to these guidelines

Changes to these guidelines need to be approved by the Kotlin Language Committee.

Any proposed change needs to be published in advance providing a reasonable time to allow for comments on the change by the Kotlin Community.

## Appendix A. Examples of non-issues

The following cases are not considered to be compatibility issues and thus are out of scope for the Language Committee.

### Changes related to binaries and translation
*   A binary compiled against kotlin-stdlib fails to link or run because kotlin-stdlib is absent or outdated (older version than used during compilation).
*   Adding generic parameters to existing declarations does not change the ABI on the JVM (due to erasure).
*   Changes to signatures of functions marked `@InlineOnly` are not changing the ABI on the JVM.
*   Adding supertypes to existing library classes/interfaces.

### Source language changes

*   Code compilable with a newer version fails to compile with an older version (e.g. due to usages of new language features).
*   The code breaks only if the user alters the build configuration or compiler settings explicitly (i.e. in addition to advancing the compiler version).

### Library changes

*   Relaxing a contract on existing APIs.
*   Clarification for unspecified behaviors.
*   Changes in `hashCode()` are not breaking changes.
*   Changes in `toString()` on other than `Boolean`, `Numeric`, and `String` types are not breaking changes.
*   Issues connected with loading of two different versions of the same library at runtime or link time.

### Changes affecting performance

We recognize that runtime performance and bytecode size are important metrics, and will make reasonable effort to keep them in a good shape, but we don't consider every slowdown (e.g. in edge cases or in very cold code) and every extra byte in the classfile a breaking change.

## Appendix B. Assumptions for pragmatic language evolution

We make decisions on language changes under the assumption that most user code is designed with the following considerations in mind. We do not optimize for smooth migration that disregards these considerations.

### Availability of the standard library

All Kotlin code should be linked and run against the Standard Library of at least the same version as specified by the `-api-version` upon compilation.

### Type inference and overload resolution algorithms

Improvements in type inference algorithms may result in more precise static types known for some expressions, this may cause changes in overload resolution and even in signatures of declarations that don't specify return types explicitly.

**Overloads of the same function should be intended to do the same thing**. Language improvements may cause a different overload to be selected in a new language version.

**Declarations sensitive to API/ABI stability (e.g. public APIs) should specify return types explicitly**. Language improvements may cause a different type to be inferred for a given body expression. Also, some innocuous-looking changes in the source code, done by the user, may cause similar effects. 

### Non-public API

**Internal declarations have no separate compilation guarantees**. While sometimes accessible from other languages (e.g. Java), declarations marked **internal** in Kotlin should not be called from outside the module they are declared in.

**Private and synthetic declarations should not be relied upon**. On some platforms, reflection has access to declarations marked private and synthetic. We do not provide any compatibility guarantees for code that relies on such access.

### Impedance mismatches across language boundaries

A Kotlin API exposed to another language may yield values that work in that language differently from Kotlin. For example, Kotlin's unsigned integers will look signed for Java clients, and the programmer that works with the same API in the Java code will be surprised by getting different result. While an undesirable situation, this is sometimes inevitable, and should not be considered a breaking change (it does not fall under the intuitive definition of one anyway).
