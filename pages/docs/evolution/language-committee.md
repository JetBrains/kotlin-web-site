---
type: doc
layout: reference
category: "Language Evolution"
title: "About the Kotlin Language Committee"
---

# Kotlin Language Evolution 

Evolving a language in a consistent and healthy way is challenging due to a number of trade-offs, biggest of which are adding useful features vs keeping the complexity down and getting rid of legacy vs maintaining compatibility. In both cases, the balance is not immediately obvious. Growing a language must be done very cautiously to avoid both "feature creep" and stagnation. It's much easier to build a modern language from scratch than to keep it modern over the course of many years. Kotlin aims at the sweet spot of evolving continuously and pragmatically.

This document outlines the governance model of language evolution for Kotlin.

## Lead Language Designer 

In Kotlin, the job of finding the right balance in these trade-offs and directing the language evolution belongs to the Lead Language Designer (currently Andrey Breslav). The Lead Designer, while consulting extensively with many other people including the community, holds the ultimate decision power in all matters concerning evolving the language (some people call this "benevolent dictatorship"), limited only in the case of backwards incompatible changes (see next section).

## Language Committee

As part of the efforts to move Kotlin into a non-profit entity, the Kotlin Language Committee was created to oversee changes to the Kotlin language. 
 
This committee is in charge of ensuring the Kotlin language ages well
over time; to ensure that any work done in new versions of the language
does not put an undue burden on users trying to migrate from older
versions to the newer version.

If the Lead Language Designer decides to introduce a backwards incompatible change to the language, this decision must be approved by the Kotlin Language Committee. For each proposed change the committee also decides which deprecation procedures are to be applied. The committee maintains a set of [guidelines]() that are being consulted with when making such decisions.  

Current members of this committee:

*   [William Cook, University of Texas at Austin](https://github.com/w7cook)
*   [Andrey Breslav, JetBrains](https://github.com/abreslav)
*   [Jeffrey van Gogh, Google](https://github.com/jvgogh)

