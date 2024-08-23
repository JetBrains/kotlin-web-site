[//]: # (title: Kotlin language features and proposals)
[//]: # (description: Learn about the lifecycle of Kotlin features. 
The page contains the full list of Kotlin language features and design proposals.)

JetBrains evolves the Kotlin language according to the [Kotlin language evolution principles](kotlin-evolution-principles.md),
guided by pragmatic design. 
You can find the list of language feature proposals and their statuses.

## Kotlin language features lifecycle

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

## List of Kotlin language features and design proposals

> This table contains Kotlin language features and proposals starting from Kotlin 1.7.0.
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

* KEEP proposal: [statics.md](https://github.com/Kotlin/KEEP/blob/statics/proposals/statics.md)
* YouTrack issue: [KT-11968](https://youtrack.jetbrains.com/issue/KT-11968)

</td>
</tr>

<tr filter="exploration-and-design">
<td>

**Exploration and design**

</td>
<td>

**Collection literals**

* KEEP proposal: [collection-literals.md](https://github.com/KyLeggiero/KEEP/blob/collection-literals/proposals/collection-literals.md)
* YouTrack issue: [KT-43871](https://youtrack.jetbrains.com/issue/KT-43871)

</td>
</tr>

<tr filter="exploration-and-design">
<td>

**Exploration and design**

</td>
<td>

**Union types for errors and exceptions**

* KEEP proposal: Not defined
* YouTrack issue: [KT-7128](https://youtrack.jetbrains.com/issue/KT-7128)

</td>
</tr>

<tr filter="exploration-and-design">
<td>

**Exploration and design**

</td>
<td>

**Name-based destructuring**

* KEEP proposal: Not defined
* YouTrack issue: [KT-19627](https://youtrack.jetbrains.com/issue/KT-19627)

</td>
</tr>

<tr filter="exploration-and-design">
<td>

**Exploration and design**

</td>
<td>

**Support immutability (multifield value classes)**

* KEEP proposal: Not defined
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

* KEEP proposal: [explicit-backing-fields.md](https://github.com/Kotlin/KEEP/blob/explicit-backing-fields-re/proposals/explicit-backing-fields.md)
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

* KEEP proposal: [context-parameters.md](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md)
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

* KEEP proposal: [guards.md](https://github.com/Kotlin/KEEP/blob/guards/proposals/guards.md)
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

* KEEP proposal: [guards.md#exhaustiveness](https://github.com/Kotlin/KEEP/blob/guards/proposals/guards.md#exhaustiveness)
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

* KEEP proposal: [subclass-opt-in-required.md](https://github.com/Kotlin/KEEP/blob/master/proposals/subclass-opt-in-required.md)
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

* KEEP proposal: [break-continue-in-inline-lambdas.md](https://github.com/Kotlin/KEEP/blob/master/proposals/break-continue-in-inline-lambdas.md)
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

* KEEP proposal: [references-to-java-synthetic-properties.md](https://github.com/Kotlin/KEEP/blob/master/proposals/references-to-java-synthetic-properties.md)
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

* KEEP proposal: [enum-entries.md](https://github.com/Kotlin/KEEP/blob/master/proposals/enum-entries.md)
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

* KEEP proposal: [data-objects.md](https://github.com/Kotlin/KEEP/blob/master/proposals/data-objects.md)
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

* KEEP proposal: [open-ended-ranges.md](https://github.com/kotlin/KEEP/blob/open-ended-ranges/proposals/open-ended-ranges.md)
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

* KEEP proposal: [definitely-non-nullable-types.md](https://github.com/Kotlin/KEEP/blob/master/proposals/definitely-non-nullable-types.md)
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

* KEEP proposal: [context-receivers.md](https://github.com/Kotlin/KEEP/blob/master/proposals/context-receivers.md)
* YouTrack issue: [KT-10468](https://youtrack.jetbrains.com/issue/KT-10468)

</td>
</tr>

</table>
</chunk>

<!-- END OF REVOKED BLOCK -->

</tab>

<tab id="exploration-and-design" title="Exploration and design">

<include include-id="source" use-filter="empty,exploration-and-design" src="kotlin-language-features-and-proposals.md"/>

</tab>

<tab id="keep-preparation" title="KEEP discussion">

<include include-id="source" use-filter="empty,keep" src="kotlin-language-features-and-proposals.md"/>

</tab>

<tab id="in-preview" title="In preview">

<include include-id="source" use-filter="empty,in-preview" src="kotlin-language-features-and-proposals.md"/>

</tab>

<tab id="stable" title="Stable">

<include include-id="source" use-filter="empty,stable" src="kotlin-language-features-and-proposals.md"/>

</tab>

<tab id="revoked" title="Revoked">

<include include-id="source" use-filter="empty,revoked" src="kotlin-language-features-and-proposals.md"/>

</tab>
</tabs>