[//]: # (title: Language design evolution and proposals)

JetBrains evolves the Kotlin language according to the [Kotlin language evolution principles](kotlin-evolution-principles.md).
Kotlin language development is deeply influenced by the needs of its developer community. 
We actively consider feedback and value discussions on existing Kotlin Enhancement Proposals (_KEEP_)
as well as suggestions for new features, especially those supported by compelling use cases.

> We generally discourage contributions of entire KEEPs from individuals outside the Kotlin team,
> as these often require interaction with internal experts.
>
> [Create a YouTrack issue](https://kotl.in/issue) if you have any ideas how to improve the Kotlin language.
> 
{type="warning"}

## Kotlin feature development lifecycle

The current lifecycle of language features:

* **Under discussion**: we consider the possibility of the feature introduction to the language.
  Discuss how it might look and be consistent with other features. Collect use-cases and assess a positive or negative impact.
  What feedback do we expect from users: use-cases and problems that they would solve by that feature.
  Any estimation of how frequent these use-cases and problems arise would be beneficial. 
  Usually, ideas are filed as YouTrack tickets and discussion goes there.

* **KEEP preparation**: we are more or less sure that the feature should be in the language.
  And we are trying to specify motivation, use-cases, design, and other major information in a document called _KEEP_.
  What feedback do we expect from users: discussion around all information provided in KEEP.

* **Pilot version**: a prototype is ready, and you can enable it by a feature-specific compiler key.
  What feedback do we expect from users: describe experience from trying the feature.
  How easy it was to introduce the codebase, how does it look with existing code, IDE support (issues and suggestions), etc.
  Further the shape of the feature may vary a lot, or it may be completely revoked.
  
* **Stable**: the feature comes with a first-class citizen in the language. 
  It gets guaranties of backward compatibility, tooling support, etc.
  
* **Revoked**: we revoke the proposal and won't implement the feature in the Kotlin language.

## Language design proposals

Listed below are significant language features currently on our radar.
These range in status from preliminary discussions to approaching [Stable](components-stability.md#stability-levels-explained) release, 
focusing on major updates since Kotlin 1.8.

> This table contains Kotlin language features and proposals starting from 1.7.0
>
{type="note"}

<tabs>
<tab id="all-proposals" title="All">

<!-- <include include-id="all-proposals" src="all-proposals.xml"/> -->

<chunk id="source">
<table header-style="left">

<!-- UNDER DISCUSSION BLOCK -->

<tr filter="under-discussion">
<td>

**Under discussion**

</td>
<td>

**Kotlin statics and static extensions**

* KEEP documents: [proposal: statics.md](https://github.com/Kotlin/KEEP/blob/statics/proposals/statics.md), [discussion: KEEP-348](https://github.com/Kotlin/KEEP/issues/348)
* YouTrack issue: [KT-11968](https://youtrack.jetbrains.com/issue/KT-11968)
* Target version: Not defined

</td>
</tr>

<tr filter="under-discussion">
<td>

**Under discussion**

</td>
<td>

**Collection literals**

* KEEP documents: [proposal: collection-literals.md](https://github.com/KyLeggiero/KEEP/blob/collection-literals/proposals/collection-literals.md), [discussion: KEEP-112](https://github.com/Kotlin/KEEP/issues/112)
* YouTrack issue: [KT-43871](https://youtrack.jetbrains.com/issue/KT-43871)
* Target version: Not defined

</td>
</tr>

<tr filter="under-discussion">
<td>

**Under discussion**

</td>
<td>

**Union types for errors and exceptions**

* KEEP documents: Not defined
* YouTrack issue: [KT-7128](https://youtrack.jetbrains.com/issue/KT-7128)
* Target version: Not defined

</td>
</tr>

<tr filter="under-discussion">
<td>

**Under discussion**

</td>
<td>

**Name-based destructuring**

* KEEP documents: Not defined
* YouTrack issue: [KT-19627](https://youtrack.jetbrains.com/issue/KT-19627)
* Target version: Not defined

</td>
</tr>

<tr filter="under-discussion">
<td>

**Under discussion**

</td>
<td>

**Support immutability (multifield value classes)**

* KEEP documents: Not defined
* YouTrack issue: [KT-1179](https://youtrack.jetbrains.com/issue/KT-1179)
* Target version: Not defined

</td>
</tr>

<!-- END OF UNDER DISCUSSION BLOCK -->

<!-- KEEP PREPARATION BLOCK -->

<tr filter="keep">
<td>

**KEEP preparation**

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

**KEEP preparation**

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

**KEEP preparation**

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

**KEEP preparation**

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

**KEEP preparation**

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

**KEEP preparation**

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

**KEEP preparation**

</td>
<td>

**Java synthetic property references**

* KEEP documents: [proposal: references-to-java-synthetic-properties.md](https://github.com/Kotlin/KEEP/blob/master/proposals/references-to-java-synthetic-properties.md), [discussion KEEP-328](https://github.com/Kotlin/KEEP/issues/328)
* YouTrack issue: [KT-8575](https://youtrack.jetbrains.com/issue/KT-8575)
* Target version: 2.1.0

</td>
</tr>

<!-- END OF KEEP PREPARATION BLOCK -->

<!-- PILOT VERSION BLOCK -->



<!-- END OF PILOT VERSION BLOCK -->

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
* Target version: Not available

</td>
</tr>

</table>
</chunk>

<!-- END OF REVOKED BLOCK -->

</tab>

<tab id="under-discussion" title="Under discussion">

<include include-id="source" use-filter="empty,under-discussion" src="evolution.md"/>

</tab>

<tab id="keep-preparation" title="KEEP preparation">

<include include-id="source" use-filter="empty,keep" src="evolution.md"/>

</tab>

<tab id="pilot-version" title="Pilot version">

<include include-id="source" use-filter="empty,pilot" src="evolution.md"/>

</tab>

<tab id="stable" title="Stable">

<include include-id="source" use-filter="empty,stable" src="evolution.md"/>

</tab>

<tab id="revoked" title="Revoked">

<include include-id="source" use-filter="empty,revoked" src="evolution.md"/>

</tab>
</tabs>