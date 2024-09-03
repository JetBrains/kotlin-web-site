[//]: # (title: Kotlin evolution principles)

## Principles of pragmatic evolution

> _Language design is cast in stone,_
>
> _but this stone is reasonably soft,_
>
> _and with some effort we can reshape it later._
>                        
> _Kotlin Design Team_

Kotlin is designed to be a pragmatic tool for programmers. When it comes to language evolution, its pragmatic nature is captured by the following principles:

*   Keep the language modern over the years.
*   Stay in the constant feedback loop with the users.
*   Make updating to new versions comfortable for the users.

As this is key to understanding how Kotlin is moving forward, let's expand on these principles.

**Keeping the Language Modern**. We acknowledge that systems accumulate legacy over time. What had once been cutting-edge
technology can be hopelessly outdated today. We have to evolve the language to keep it relevant to the needs of the users
and up-to-date with their expectations. This includes not only adding new features, but also phasing out old ones that are
no longer recommended for production use and have altogether become legacy.

**Comfortable Updates**. Incompatible changes, such as removing things from a language, may lead to painful migration from
one version to the next if carried out without proper care. We will always announce such changes well in advance, mark things
as deprecated and provide automated migration tools _before the change happens_. By the time the language is changed we
want most of the code in the world to be already updated and thus have no issues migrating to the new version.

**Feedback Loop**. Going through deprecation cycles requires significant effort, so we want to minimize the number of
incompatible changes we'll be making in the future. Apart from using our best judgement, we believe that trying things out
in real life is the best way to validate a design. Before casting things in stone we want them battle-tested. This is why
we use every opportunity to make early versions of our designs available in production versions of the language, but in one
of the _pre-stable_ statuses: [Experimental, Alpha, or Beta](components-stability.md). Such features are not stable,
they can be changed at any time, and the users that opt into using them do so explicitly to indicate that they are ready
to deal with the future migration issues. These users provide invaluable feedback that we gather to iterate on the design
and make it rock-solid.

## Incompatible changes

If, upon updating from one version to another, some code that used to work doesn't work anymore,
it is an _incompatible change_ in the language (sometimes referred to as "breaking change").
There can be debates as to what "doesn't work anymore" means precisely in some cases, but it definitely includes the following:

* Code that compiled and ran fine is now rejected with an error (at compile or link time). 
    This includes removing language constructs and adding new restrictions.
* Code that executed normally is now throwing an exception.

The less obvious cases that belong to the "gray area" include handling corner cases differently, throwing an exception of a different type than before,
changing behavior observable only through reflection, changing in undocumented or undefined behavior, renaming binary artifacts, and others.
Sometimes such changes are crucial and affect migration experience dramatically, sometimes they are insignificant.

Some examples of what definitely isn't an incompatible change include:

*   Adding new warnings.
*   Enabling new language constructs or relaxing limitations for existing ones.
*   Changing private/internal APIs and other implementation details.

The principles of Keeping the Language Modern and Comfortable Updates suggest that incompatible changes are sometimes necessary,
but they should be introduced carefully. Our goal is to make the users aware of upcoming changes well in advance to let them migrate their code comfortably. 

Ideally, every incompatible change should be announced through a compile-time warning reported in the problematic code
(usually referred to as a _deprecation warning_) and accompanied by automated migration aids. 
So, the ideal migration workflow goes as follows:

*   Update to version A (where the change is announced) 
    *   See warnings about the upcoming change
    *   Migrate the code with the help of the tooling
*   Update to version B (where the change happens)
    *   See no issues at all

In practice, some changes can't be accurately detected at compile time, so no warnings can be reported,
but at least the users will be notified through Release notes of version A that a change is coming in version B.

### Dealing with compiler bugs

Compilers are complicated software, and despite the best effort of their developers, they have bugs.
The bugs that cause the compiler itself to fail or report spurious errors or generate obviously failing code,
though annoying and often embarrassing, are easy to fix, because the fixes do not constitute incompatible changes.
Other bugs may cause the compiler to generate incorrect code that does not fail:
for example, by missing some errors in the source or simply generating wrong instructions.
Fixes of such bugs are technically incompatible changes (some code used to compile fine, but now it won't anymore),
but we are inclined to fix them as soon as possible to prevent the bad code patterns from spreading across user code.
In our opinion, this serves the principle of Comfortable Updates,
because fewer users have a chance of encountering the issue.
Of course, this applies only to bugs that are found soon after appearing in a released version.

## Decision making

[JetBrains](https://jetbrains.com), the original creator of Kotlin, 
is driving its progress with the help of the community and in accord with the [Kotlin Foundation](https://kotlinfoundation.org/).

All changes to the Kotlin Programming Language are overseen by the [Lead Language Designer](https://kotlinfoundation.org/structure/) (currently Michail Zarečenskij).
The Lead Designer has the final say in all matters related to language evolution.
Additionally, incompatible changes to fully stable components have to be approved to by the [Language Committee](https://kotlinfoundation.org/structure/) designated 
under the [Kotlin Foundation](https://kotlinfoundation.org/structure/) (currently comprising Jeffrey van Gogh, Werner Dietl, and Michail Zarečenskij).

The Language Committee makes final decisions on what incompatible changes will be made and what exact measures should be taken to make user updates comfortable.
In doing so, it relies on a set of [Language committee guidelines](https://kotlinfoundation.org/language-committee-guidelines/).

## Language and tooling releases

Stable releases with versions, such as 2.0.0, are usually considered to be _language releases_ bringing major changes in the language.
Normally, we publish _tooling releases_, numbered x.x.**20** in between language releases. 

Tooling releases bring updates in the tooling (often including features), performance improvements, and bug fixes.
We try to keep such versions compatible with each other,
so changes to the compiler are mostly optimizations and warning additions/removals.
Pre-stable features may be added, removed, or changed at any time.

Language releases often add new features and may remove or change previously deprecated ones. 
Feature graduation from pre-stable to stable also happens in language releases.

### EAP builds

Before releasing stable versions of language and tooling releases, 
we publish a number of preview builds dubbed EAP (for "Early Access Preview") that let us iterate faster and gather feedback from the community.
EAPs of language releases usually produce binaries that will be later rejected by the stable compiler
to make sure that possible bugs in the binary format survive no longer than the preview period.
Final Release Candidates normally do not bear this limitation.

### Pre-stable features

According to the Feedback Loop principle described above, we iterate on our designs in the open and 
release versions of the language where some features have one of the _pre-stable_ statuses and _are supposed to change_. 
Such features can be added, changed or removed at any point and without warning. 
We do our best to ensure that pre-stable features can't be used accidentally by an unsuspecting user. 
Such features usually require some sort of explicit opt-in either in the code or in the project configuration.

A Kotlin language feature can have one of the following statuses:

* **Exploration and design**. We are considering the introduction of a new feature to the language.
  This involves discussing how it would integrate with existing features, gathering use cases,
  and assessing its potential impact.
  We need feedback from users on the problems this feature would solve and the use cases it addresses.
  Estimating how often these use cases and problems occur would also be beneficial.
  Typically, ideas are documented as YouTrack issues, where the discussion continues.

* **KEEP discussion**. We are fairly certain that the feature should be added to the language.
  We aim to provide a motivation, use-cases, design, and other important details in a document called a _KEEP_.
  We expect feedback from users to focus on discussing all the information provided in the KEEP.

* **In preview**. A feature prototype is ready, and you can enable it using a feature-specific compiler option.
  We seek feedback on your experience with the feature, including how easily it integrates into your codebase,
  how it interacts with existing code, and any IDE support issues or suggestions.
  The feature's design may change significantly, or it could be completely revoked based on feedback. When a feature is
  _in preview_, it has a [stability level](components-stability.md#stability-levels-explained).

* **Stable**. The language feature is now a first-class citizen in the Kotlin language.
  We guarantee its backward compatibility and that we'll provide tooling support.

* **Revoked**. We have revoked the proposal and will not implement the feature in the Kotlin language.
  We may revoke a feature that is _in preview_ if it is not a good fit for Kotlin.

[See the full list of Kotlin language proposals and their statuses](kotlin-language-features-and-proposals.md).

### Status of different components

Learn more about the [stability status of different components in Kotlin (such as Kotlin/JVM, JS, and Native compilers, various libraries)](components-stability.md)

## Libraries

A language is nothing without its ecosystem, so we pay extra attention to enabling smooth library evolution.

Ideally, a new version of a library can be used as a "drop-in replacement" for an older version. 
This means that upgrading a binary dependency should not break anything, 
even if the application is not recompiled (this is possible under dynamic linking). 

On the one hand, to achieve this, the compiler has to provide certain ABI stability guarantees under the constraints of separate compilation.
This is why every change in the language is examined from a binary compatibility standpoint.

On the other hand, a lot depends on the library authors being careful about which changes are safe to make. 
Thus, it's crucial that library authors understand how source changes affect compatibility
and follow certain best practices to keep both APIs and ABIs of their libraries stable.
Here are some assumptions that we make when considering language changes from the library evolution standpoint:

* Library code should always specify return types of public/protected functions and properties explicitly,
    thus never relying on type inference for public API. Subtle changes in type inference may cause return types to change inadvertently,
    leading to binary compatibility issues.
* Overloaded functions and properties provided by the same library should do essentially the same thing. 
    Changes in type inference may result in more precise static types to be known at call sites,
    causing changes in overload resolution.

Library authors can use the `@Deprecated` and [`@RequiresOptIn`](opt-in-requirements.md) annotations
to control the evolution of their API surface. Note that `@Deprecated(level=HIDDEN)`
can be used to preserve binary compatibility even for declarations removed from the API.

Also, by convention, packages named "internal" are not considered public API. 
All API residing in packages named "experimental" is considered pre-stable and can change at any moment.

We evolve the Kotlin Standard Library (`kotlin-stdlib`) for stable platforms according to the principles stated above.
Changes to the contracts for its API undergo the same procedures as changes in the language itself.

## Compiler options

Command line options accepted by the compiler are also a kind of public API, and they are subject to the same considerations.
Supported options (those that don't have the "-X" or "-XX" prefix) can be added only in language releases and should be properly deprecated before removing them.
The "-X" and "-XX" options are experimental and can be added and removed at any time.

## Compatibility tools

As legacy features get removed and bugs fixed, the source language changes, and old code that has not been properly migrated may not compile anymore.
The normal deprecation cycle allows a comfortable period of time for migration, 
and even when it's over and the change ships in a stable version, there's still a way to compile non-migrated code. 

### Compatibility options

We provide the `-language-version X.Y` and `-api-version X.Y` options that make a new version emulate the behavior of an old
one for compatibility purposes. To give you more time for migration, we [support](compatibility-modes.md) the development
for three previous language and API versions in addition to the latest stable one.

Actively maintained code bases can benefit from getting bug fixes ASAP, without waiting for a full deprecation cycle to complete.
Currently, such projects can enable the `-progressive` option and get such fixes enabled even in tooling releases.

All options are available in the command line as well as in [Gradle](gradle-compiler-options.md) and in [Maven](maven.md#specify-compiler-options).

### Evolving the binary format

Unlike sources that can be fixed by hand in the worst case, binaries are a lot harder to migrate, 
and this makes backwards compatibility crucial in the case of binaries.
Incompatible changes to binaries can make updates very uncomfortable and thus should be introduced with even more care than those in the source language syntax. 

For fully stable versions of the compiler, the default binary compatibility protocol is the following:

* All binaries are backwards compatible; that means a newer compiler can read older binaries (for example, 1.3 understands 1.0 through 1.2).
* Older compilers reject binaries that rely on new features (for example, the 1.0 compiler rejects binaries that use coroutines).
* Preferably (but we can't guarantee it), the binary format is mostly forwards compatible with the next language release, but not later ones 
  (in the cases when new features are not used, for example, 1.9 can understand most binaries from 2.0, but not 2.1).

This protocol is designed for comfortable updates as no project can be blocked from updating its dependencies even if it's using a slightly outdated compiler.

Note that not all target platforms have reached this level of stability, but Kotlin/JVM has.

#### Kotlin klib binaries

Kotlin klib binaries have reached the [Stable](components-stability.md#stability-levels-explained) level in Kotlin 1.9.20.
However, there are some compatibility details you need to keep in mind:

* klib binaries are backwards compatible starting with Kotlin 1.9.20. For example, the 2.0.x compiler can read binaries
  produced by the 1.9.2x compiler.
* Forward compatibility is _not_ guaranteed. For example, the 2.0.x compiler is _not_ guaranteed to read binaries produced
  by the 2.1.x compiler.

> The Kotlin cinterop klib binaries are still in [Beta](components-stability.md#stability-levels-explained).
> Currently, we cannot give specific compatibility guarantees between different Kotlin versions for cinterop klib binaries.
> 
{type="note"}
