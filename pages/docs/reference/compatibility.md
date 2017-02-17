---
type: doc
layout: reference
category: "Compatibility"
title: "Compatibility"
---

# Compatibility

This page describes compatibility guarantees for different versions and subsystems of Kotlin. 

## Compatibility glossary

Compatibility if a function of a pair of versions, e.g. we can speak of compatibility between versions 1.2 and 1.1.5. In such a pair, one version is *older* than another when its smaller wrt version comparison, e.g. 1.1.5 is older than 1.2, even if it was released later. In the list below we explain available compatibility modes for such pairs of versions. We use OV for "Older Version", and NV for "Newer Version". 

- **C** - Full **C**ompatibility
  - Language
    - no syntax changes (*modulo bugs**)
    - new warnings/hints may be added or removed
  - API (`kotlin-stdlib-*`, `kotlin-reflect-*`)
    - no API changes
    - deprecations with level `WARN` may be added/removed
  - Binaries (ABI)
    - runtime: binaries can be used interchangeably
    - compilation: binaries can be used interchangeably
- **BCL** - **B**ackward **C**ompatibility for the **L**anguage
  - Language
    - syntax deprecated in OV may be removed in NV
    - other than that, all code compilable in OV is compilable by in NV (modulo bugs*)
    - new syntax may be added in NV
    - some restrictions of OV may be lifted in NV 
    - new warnings/hints may be added or removed
  - API (`kotlin-stdlib-*`, `kotlin-reflect-*`)
    - new APIs may be added
    - deprecations with level `WARN` may be added/removed
    - deprecations with level `WARN` may be elevated to level `ERROR` or `HIDDEN` in NV
- **BCB** - Full **B**ackward **C**ompatibility for Binaries
  - Binaries (ABI)
    - runtime: NV-binaries can be used  everywhere where OV binaries worked
    - NV compiler: code compilable against OV binaries is compilable against NV binaries
    - OV compiler may not accept NV binaries (e.g. those that exhibit newer language features or APIs)
- **BC** = BCL & BCB
- **EXP** - Experimental feature
  - see below
- **NO** - No compatibility guarantees
  - we'll do our best to offer smooth migration, but can give no guarantees
  - migration is planned individually for every incompatible subsystem 

---

\* No changes *modulo bugs* means that if an important bug is found (e.g. in the compiler diagnostics or elsewhere), a fix for it may introduce a breaking change, but we are always very careful with such changes.

## Compatibility guarantees for Kotlin releases

**Kotlin for JVM**:
  - patch updates are fully compatible
  - minor version updates are backwards compatible

| JVM  | 1.0 | 1.0.X | 1.1 | 1.1.X | ... | 2.0 |
|---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **1.0** | - | C | BC | BC | ... | ? |
| **1.0.X** | C | - | BC | BC | ... | ?
| **1.1** | BC | BC | - | C | ... | ?
| **1.1.X** | BC | BC | C | - | .... | ?
| **...** | ... | ... | ... | ... | ... | ... |
| **2.0** | ? | ? | ? | ? | ... | - 

**Kotlin for JS**: starting with Kotlin 1.1, both patch and minor version updates provide backward compatibility for the language (BCL), but no BCB.  

| JS  | 1.0.X | 1.1 | 1.1.X | ... | 2.0 |
|---:|:---:|:---:|:---:|:---:|:---:|
| **1.0.X** | - |  EXP | EXP | ... | EXP |
| **1.1** | EXP |  - | BCL | ... | ?
| **1.1.X** | EXP | BCL | - | .... | ?
| **...** | ... | ... | ... | ... | ... | ... |
| **2.0** | EXP | ? | ? | ? | ... | - 

**Kotlin Scripts**: both patch and minor version updates provide backward compatibility for the language (BCL), but no BCB.

## Experimental features

Experimental features, such as coroutines in Kotlin 1.1, have exemption from the compatibility modes listed above. Such features require an opt-in to use without compiler warning. Experimental features are at least backwards compatible for patch version updates, but we do guarantee no compatibility for minor version updates (migration aids will be provided where possible).    

| EXP  | 1.1 | 1.1.X | 1.2 | 1.2.X | 
|---:|:---:|:---:|:---:|:---:|
| **1.1** | - | BC | NO | NO  
| **1.1.X** | BC | - | NO | NO
| **1.2** | NO | NO | - | BC 
| **1.2.X** | NO | NO | BC | - 

## EAP builds

We publish Early Access Preview (EAP) builds to special channels where early adopters from the community may try them out and give us feedback. Such builds provide no compatibility guarantees whatsoever (although we do our best to keep them reasonable compatible with releases and with each other). Quality expectations for such builds are also much lower than for releases. Beta builds also fall under this category.

**IMPORTANT NOTE**: all binaries compiled by EAP builds are **rejected by release builds of the compiler**. We don't want any code compiled by pre-release versions to be kept around after a stable version is released. 

## Compatibility modes

When a big team is migrating onto a new version, it may appear in a "inconsistent state" at some point, when some developers have already updated, and others haven't. To prevent the former from writing and committing code that others may not be able to compile, we provide the following command line switches (also available in the IDE and build systems):   

- `-language-version`=X.Y - compatibility mode for Kotlin language version X.Y, reports errors for all language features that came out later
- `-api-version`=X.Y - compatibility mode for Kotlin API version X.Y, reports errors for all code using newer APIs (including the code generated by the compiler).

## Binary compatibility warnings

TODO