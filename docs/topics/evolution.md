[//]: # (title: Kotlin language evolution)

The language is evolving according to the [language evolution principles](kotlin-evolution-principles.md)

Description of statuses:
* Under discussion
* KEEP preparation
* Pilot version
* Stable
* Revoked

## Language design proposals

<tabs>
<tab id="all-proposals" title="All">

<!-- <include include-id="all-proposals" src="all-proposals.xml"/> -->

<chunk id="source">
<table header-style="left">

<!-- UNDER DISCUSSION -->

<tr filter="under-discussion">
<td>

**Under discussion**

</td>
<td>

**Research and prototype namespace-based solution for statics and static extensions**

* Status: Under discussion
* KEEP proposal: Not defined
* KEEP discussion: [KEEP-348](https://github.com/Kotlin/KEEP/issues/348)
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

* Status: Under discussion
* KEEP proposal: [collection-literals.md](https://github.com/KyLeggiero/KEEP/blob/collection-literals/proposals/collection-literals.md)
* KEEP discussion: [KEEP-112](https://github.com/Kotlin/KEEP/issues/112)
* YouTrack issue: [KT-43871](https://youtrack.jetbrains.com/issue/KT-43871)
* Target version: Not defined

</td>
</tr>

<tr filter="under-discussion">
<td>

**Under discussion**

</td>
<td>

**Denotable union and intersection types**

* Status: Under discussion
* KEEP proposal: Not defined
* KEEP discussion: Not defined
* YouTrack issue: [KT-13108](https://youtrack.jetbrains.com/issue/KT-13108)
* Target version: Not defined

</td>
</tr>

<tr filter="under-discussion">
<td>

**Under discussion**

</td>
<td>

**Multi catch block**

* Status: Under discussion
* KEEP proposal: Not defined
* KEEP discussion: Not defined
* YouTrack issue: [KT-7128](https://youtrack.jetbrains.com/issue/KT-7128)
* Target version: Not defined

</td>
</tr>

<tr filter="under-discussion">
<td>

**Under discussion**

</td>
<td>

**Object (name-based) destructuring**

* Status: Under discussion
* KEEP proposal: Not defined
* KEEP discussion: Not defined
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

* Status: Under discussion
* KEEP proposal: Not defined
* KEEP discussion: Not defined
* YouTrack issue: [KT-1179](https://youtrack.jetbrains.com/issue/KT-1179)
* Target version: Not defined

</td>
</tr>

<!-- KEEP PREPARATION -->

<tr filter="keep">
<td>

**KEEP preparation**

</td>
<td>

**Guard conditions in when-with-subject**

* Status: KEEP preparation
* KEEP proposal: [guards.md](https://github.com/Kotlin/KEEP/blob/guards/proposals/guards.md)
* KEEP discussion: [KEEP-371](https://github.com/Kotlin/KEEP/issues/371)
* YouTrack issue: [KT-13626](https://youtrack.jetbrains.com/issue/KT-13626)
* Target version: 2.1.0

</td>
</tr>
<tr filter="keep">
<td>

**KEEP preparation**

</td>
<td>

**Improved exhaustiveness checking**

* Status: KEEP preparation
* KEEP proposal: Not defined
* KEEP discussion: Not defined
* YouTrack issue: [KT-63696](https://youtrack.jetbrains.com/issue/KT-63696)
* Target version: Not defined

</td>
</tr>
<tr filter="keep">
<td>

**KEEP preparation**

</td>
<td>

**Support non-local break and continue**

* Status: KEEP preparation
* KEEP proposal: [break-continue-in-inline-lambdas.md](https://github.com/Kotlin/KEEP/blob/master/proposals/break-continue-in-inline-lambdas.md)
* KEEP discussion: [KEEP-326](https://github.com/Kotlin/KEEP/issues/326)
* YouTrack issue: [KT-1436](https://youtrack.jetbrains.com/issue/KT-1436)
* Target version: 2.1.0

</td>
</tr>

<!-- PILOT VERSION -->

<tr filter="pilot">
<td>

**Pilot version**

</td>
<td>

**Contracts: if a given function parameter is not null, the result is not null**

* Status: Revoked
* KEEP proposal: Not defined
* KEEP discussion: Not defined
* YouTrack issue: [KT-8889](https://youtrack.jetbrains.com/issue/KT-8889)
* Target version: Not available

</td>
</tr>

<!-- STABLE -->

<tr filter="stable">
<td>

**Stable**

</td>
<td>

**Explicit backing fields**

* Status: Stable
* KEEP proposal: [explicit-backing-fields.md](https://github.com/Kotlin/KEEP/blob/explicit-backing-fields-re/proposals/explicit-backing-fields.md)
* KEEP discussion: [KEEP-278](https://github.com/Kotlin/KEEP/issues/278)
* YouTrack issue: [KT-14663](https://youtrack.jetbrains.com/issue/KT-14663)
* Target version: 

</td>
</tr>

<tr filter="stable">
<td>

**Stable**

</td>
<td>

**Decommission Enum.values() and replace it with Enum.entries**

* Status: Stable
* KEEP proposal: [enum-entries.md](https://github.com/Kotlin/KEEP/blob/master/proposals/enum-entries.md)
* KEEP discussion: [KEEP-283](https://github.com/Kotlin/KEEP/issues/283)
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

* Status: Stable
* KEEP proposal: [data-objects.md](https://github.com/Kotlin/KEEP/blob/master/proposals/data-objects.md)
* KEEP discussion: [KEEP-317](https://github.com/Kotlin/KEEP/issues/317)
* YouTrack issue: [KT-4107](https://youtrack.jetbrains.com/issue/KT-4107)
* Target version: 1.9.0

</td>
</tr>

<tr filter="stable">
<td>

**Stable**

</td>
<td>

**Open-ended ranges and rangeUntil operator**

* Status: Stable
* KEEP proposal: [open-ended-ranges.md](https://github.com/kotlin/KEEP/blob/open-ended-ranges/proposals/open-ended-ranges.md)
* KEEP discussion: [KEEP-314](https://github.com/Kotlin/KEEP/issues/314)
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

* Status: Stable
* KEEP proposal: [definitely-non-nullable-types.md](https://github.com/Kotlin/KEEP/blob/master/proposals/definitely-non-nullable-types.md)
* KEEP discussion: [KEEP-268](https://github.com/Kotlin/KEEP/issues/268)
* YouTrack issue: [KT-26245](https://youtrack.jetbrains.com/issue/KT-26245)
* Target version: 

</td>
</tr>

<!-- REVOKED -->

<tr filter="revoked">
<td>

**Revoked**

</td>
<td>

**Context receivers**

* Status: Revoked
* KEEP proposal: [context-receivers.md](https://github.com/Kotlin/KEEP/blob/master/proposals/context-receivers.md)
* KEEP discussion: [KEEP-259](https://github.com/Kotlin/KEEP/issues/259)
* YouTrack issue: [KT-10468](https://youtrack.jetbrains.com/issue/KT-10468)
* Target version: Not available


</td>
</tr>

</table>
</chunk>

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