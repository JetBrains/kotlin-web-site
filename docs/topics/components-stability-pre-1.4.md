[//]: # (title: Stability of Kotlin components \(pre 1.4\))

There can be different modes of stability depending of how quickly a component is evolving:
<a name="moving-fast"></a>
*   **Moving fast (MF)**: no compatibility should be expected between even [incremental releases](kotlin-evolution.md#feature-releases-and-incremental-releases), any functionality can be added, removed or changed without warning.

*   **Additions in Incremental Releases (AIR)**: things can be added in an incremental release, removals and changes of behavior should be avoided and announced in a previous incremental release if necessary.

*   **Stable Incremental Releases (SIR)**: incremental releases are fully compatible, only optimizations and bug fixes happen. Any changes can be made in a [feature release](kotlin-evolution.md#feature-releases-and-incremental-releases).

<a name="fully-stable"></a>
*   **Fully Stable (FS)**: incremental releases are fully compatible, only optimizations and bug fixes happen. Feature releases are backwards compatible.

Source and binary compatibility may have different modes for the same component, e.g. the source language can reach full stability before the binary format stabilizes, or vice versa.

The provisions of the [Kotlin evolution policy](kotlin-evolution.md) fully apply only to components that have reached Full Stability (FS). From that point on incompatible changes have to be approved by the Language Committee.

|**Component**|**Status Entered at version**|**Mode for Sources**|**Mode for Binaries**|
| --- | --- | --- | --- |
Kotlin/JVM|1.0|FS|FS|
kotlin-stdlib (JVM)|1.0|FS|FS
KDoc syntax|1.0|FS|N/A
Coroutines|1.3|FS|FS
kotlin-reflect (JVM)|1.0|SIR|SIR
Kotlin/JS|1.1|AIR|MF
Kotlin/Native|1.3|AIR|MF
Kotlin Scripts (*.kts)|1.2|AIR|MF
dokka|0.1|MF|N/A
Kotlin Scripting APIs|1.2|MF|MF
Compiler Plugin API|1.0|MF|MF
Serialization|1.3|MF|MF
Multiplatform Projects|1.2|MF|MF
Inline classes|1.3|MF|MF
Unsigned arithmetics|1.3|MF|MF
**All other experimental features, by default**|N/A|**MF**|**MF**