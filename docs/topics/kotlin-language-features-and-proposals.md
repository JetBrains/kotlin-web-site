[//]: # (title: Kotlin language features and proposals)
[//]: # (description: Kotlin language features and design proposals.)

JetBrains evolves the Kotlin language according to the [Kotlin language evolution principles](kotlin-evolution-principles.md).
The evolution of Kotlin is driven by the pragmatic principles of language design. 
You can find the list of language feature proposals and their statuses.

## Kotlin language features lifecycle

The Kotlin language feature can have one of the following statuses:

* **Exploration and design**. We are considering the introduction of a new feature to the language.
  This involves discussing how it would integrate with existing features, gathering use cases, 
  and assessing its potential impact.
  We need feedback from users on the problems this feature would solve and the use cases it addresses.
  Estimating how often these use cases and problems occur would also be beneficial.
  Typically, ideas are documented as YouTrack issues, where the discussion continues.

* **KEEP discussion**. We are fairly certain that the feature should be added to the language.
  We aim to specify motivation, use-cases, design, and other important details in a document called _KEEP_. 
  We expect feedback from users to focus on discussing all the information provided in the KEEP.

* **In preview**. A feature prototype is ready, and you can enable it using a feature-specific compiler option.
  We seek feedback on your experience with the feature, including how easily it integrates into your codebase,
  how it interacts with existing code, and any IDE support issues or suggestions.
  The feature's design may change significantly, or it could be completely revoked based on feedback. When feature is 
  _in preview_, it has one of the [stability levels](components-stability.md#stability-levels-explained).

* **Stable**. The language feature is now a first-class citizen in the Kotlin language.
  We guarantee its backward compatibility and tooling support.

* **Revoked**. We have revoked the proposal and will not implement the feature in the Kotlin language.
  We may revoke a feature that is _in preview_ if it does not fit the language.

## Kotlin language features and design proposals

> This table contains Kotlin language features and proposals starting from 1.7.0.
>
{type="note"}

<tabs>
<tab id="all-proposals" title="All">

<!-- <include include-id="all-proposals" src="all-proposals.xml"/> -->

<chunk id="source">
<table header-style="left">

<!-- EXPLORATION AND DESIGN BLOCK -->

<tr filter="exploration-and-design">
<td>

**Exploration and design**

</td>
<td>

**Kotlin statics and static extensions**

* KEEP documents: [proposal: statics.md](https://github.com/Kotlin/KEEP/blob/statics/proposals/statics.md), [discussion: KEEP-348](https://github.com/Kotlin/KEEP/issues/348)
* YouTrack issue: [KT-11968](https://youtrack.jetbrains.com/issue/KT-11968)

</td>
</tr>

<tr filter="exploration-and-design">
<td>

**Exploration and design**

</td>
<td>

**Collection literals**

* KEEP documents: [proposal: collection-literals.md](https://github.com/KyLeggiero/KEEP/blob/collection-literals/proposals/collection-literals.md), [discussion: KEEP-112](https://github.com/Kotlin/KEEP/issues/112)
* YouTrack issue: [KT-43871](https://youtrack.jetbrains.com/issue/KT-43871)

</td>
</tr>

<tr filter="exploration-and-design">
<td>

**Exploration and design**

</td>
<td>

**Union types for errors and exceptions**

* KEEP documents: Not defined
* YouTrack issue: [KT-7128](https://youtrack.jetbrains.com/issue/KT-7128)

</td>
</tr>

<tr filter="exploration-and-design">
<td>

**Exploration and design**

</td>
<td>

**Name-based destructuring**

* KEEP documents: Not defined
* YouTrack issue: [KT-19627](https://youtrack.jetbrains.com/issue/KT-19627)

</td>
</tr>

<tr filter="exploration-and-design">
<td>

**Exploration and design**

</td>
<td>

**Support immutability (multifield value classes)**

* KEEP documents: Not defined
* YouTrack issue: [KT-1179](https://youtrack.jetbrains.com/issue/KT-1179)

</td>
</tr>

<!-- END OF EXPLORATION AND DESIGN BLOCK -->

<!-- KEEP DISCUSSION BLOCK -->

<tr filter="keep">
<td>

**KEEP discussion**

</td>
<td>

**Explicit backing fields: both `public` and `private` type for the same property**

* KEEP documents: [proposal: explicit-backing-fields.md](https://github.com/Kotlin/KEEP/blob/explicit-backing-fields-re/proposals/explicit-backing-fields.md), [discussion: KEEP-278](https://github.com/Kotlin/KEEP/issues/278)
* YouTrack issue: [KT-14663](https://youtrack.jetbrains.com/issue/KT-14663)
* Target version: Not defined

</td>
</tr>

<tr filter="keep">
<td>

**KEEP discussion**

</td>
<td>

**Context parameters: support for context-dependent declarations**

* KEEP documents: [proposal: context-parameters.md](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md), [discussion: KEEP-278](https://github.com/Kotlin/KEEP/issues/278)
* YouTrack issue: [KT-14663](https://youtrack.jetbrains.com/issue/KT-10468)
* Target version: Not defined

</td>
</tr>

<tr filter="keep">
<td>

**KEEP discussion**

</td>
<td>

**Guard conditions in when-with-subject**

* KEEP documents: [proposal: guards.md](https://github.com/Kotlin/KEEP/blob/guards/proposals/guards.md), [discussion: KEEP-371](https://github.com/Kotlin/KEEP/issues/371)
* YouTrack issue: [KT-13626](https://youtrack.jetbrains.com/issue/KT-13626)
* Target version: 2.1.0

</td>
</tr>
<tr filter="keep">
<td>

**KEEP discussion**

</td>
<td>

**Improved exhaustiveness checking in the `when` block**

* KEEP documents: [proposal: guards.md](https://github.com/Kotlin/KEEP/blob/guards/proposals/guards.md#exhaustiveness), [discussion: KEEP-371](https://github.com/Kotlin/KEEP/issues/371)
* YouTrack issue: [KT-63696](https://youtrack.jetbrains.com/issue/KT-63696)
* Target version: 2.1.0

</td>
</tr>
<tr filter="keep">
<td>

**KEEP discussion**

</td>
<td>

**Stabilized `@SubclassOptInRequired`**

* KEEP documents: [proposal: subclass-opt-in-required.md](https://github.com/Kotlin/KEEP/blob/master/proposals/subclass-opt-in-required.md), [discussion: KEEP-320](https://github.com/Kotlin/KEEP/issues/320)
* YouTrack issue: [KT-54617](https://youtrack.jetbrains.com/issue/KT-54617)
* Target version: 2.1.0

</td>
</tr>
<tr filter="keep">
<td>

**KEEP discussion**

</td>
<td>

**Non-local `break` and `continue`**

* KEEP documents: [proposal: break-continue-in-inline-lambdas.md](https://github.com/Kotlin/KEEP/blob/master/proposals/break-continue-in-inline-lambdas.md), [discussion KEEP-326](https://github.com/Kotlin/KEEP/issues/326)
* YouTrack issue: [KT-1436](https://youtrack.jetbrains.com/issue/KT-1436)
* Target version: 2.1.0

</td>
</tr>

<tr filter="keep">
<td>

**KEEP discussion**

</td>
<td>

**Java synthetic property references**

* KEEP documents: [proposal: references-to-java-synthetic-properties.md](https://github.com/Kotlin/KEEP/blob/master/proposals/references-to-java-synthetic-properties.md), [discussion KEEP-328](https://github.com/Kotlin/KEEP/issues/328)
* YouTrack issue: [KT-8575](https://youtrack.jetbrains.com/issue/KT-8575)
* Target version: 2.1.0

</td>
</tr>

<!-- END OF KEEP DISCUSSION BLOCK -->

<!-- IN PREVIEW BLOCK -->



<!-- END OF IN PREVIEW BLOCK -->

<!-- STABLE BLOCK -->

<tr filter="stable">
<td>

**Stable**

</td>
<td>

**`Enum.entries`: performant replacement of the `Enum.values()`**

* KEEP documents: [proposal: enum-entries.md](https://github.com/Kotlin/KEEP/blob/master/proposals/enum-entries.md), [discussion: KEEP-283](https://github.com/Kotlin/KEEP/issues/283)
* YouTrack issue: [KT-48872](https://youtrack.jetbrains.com/issue/KT-48872)
* Target version: 2.0.0

</td>
</tr>

<tr filter="stable">
<td>

**Stable**

</td>
<td>

**Data objects**

* KEEP documents: [proposal: data-objects.md](https://github.com/Kotlin/KEEP/blob/master/proposals/data-objects.md), [discussion: KEEP-317](https://github.com/Kotlin/KEEP/issues/317)
* YouTrack issue: [KT-4107](https://youtrack.jetbrains.com/issue/KT-4107)
* Target version: 1.9.0

</td>
</tr>

<tr filter="stable">
<td>

**Stable**

</td>
<td>

**RangeUntil operator `..<`**

* KEEP documents: [proposal: open-ended-ranges.md](https://github.com/kotlin/KEEP/blob/open-ended-ranges/proposals/open-ended-ranges.md), [discussion: KEEP-314](https://github.com/Kotlin/KEEP/issues/314)
* YouTrack issue: [KT-15613](https://youtrack.jetbrains.com/issue/KT-15613)
* Target version: 1.7.20

</td>
</tr>

<tr filter="stable">
<td>

**Stable**

</td>
<td>

**Definitely non-nullable types**

* KEEP documents: [proposal: definitely-non-nullable-types.md](https://github.com/Kotlin/KEEP/blob/master/proposals/definitely-non-nullable-types.md), [discussion: KEEP-268](https://github.com/Kotlin/KEEP/issues/268)
* YouTrack issue: [KT-26245](https://youtrack.jetbrains.com/issue/KT-26245)
* Target version: 1.7.0

</td>
</tr>

<!-- END OF STABLE BLOCK -->

<!-- REVOKED BLOCK -->

<tr filter="revoked">
<td>

**Revoked**

</td>
<td>

**Context receivers**

* KEEP documents: [context-receivers.md](https://github.com/Kotlin/KEEP/blob/master/proposals/context-receivers.md), [discussion: KEEP-259](https://github.com/Kotlin/KEEP/issues/259)
* YouTrack issue: [KT-10468](https://youtrack.jetbrains.com/issue/KT-10468)

</td>
</tr>

</table>
</chunk>

<!-- END OF REVOKED BLOCK -->

</tab>

<tab id="exploration-and-design" title="Exploration and design">

<include include-id="source" use-filter="empty,exploration-and-design" src="evolution.md"/>

</tab>

<tab id="keep-preparation" title="KEEP discussion">

<include include-id="source" use-filter="empty,keep" src="evolution.md"/>

</tab>

<tab id="pilot-version" title="In preview">

<include include-id="source" use-filter="empty,pilot" src="evolution.md"/>

</tab>

<tab id="stable" title="Stable">

<include include-id="source" use-filter="empty,stable" src="evolution.md"/>

</tab>

<tab id="revoked" title="Revoked">

<include include-id="source" use-filter="empty,revoked" src="evolution.md"/>

</tab>
</tabs>