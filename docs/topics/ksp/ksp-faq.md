[//]: # (title: FAQ)

### Why KSP?

KSP has several advantages over [kapt](kapt.md):
* It is faster.
* The API is more fluent for Kotlin users.
* It supports [multiple round processing](ksp-multi-round.md) on generated Kotlin sources.
* It is being designed with multiplatform compatibility in mind.

### Why is KSP faster than kapt?

kapt has to parse and resolve every type reference in order to generate Java stubs, whereas KSP resolves references on-demand. 
Delegating to javac also takes time.

Additionally, KSP’s [incremental processing model](ksp-incremental.md) has a finer granularity than just isolating and 
aggregating. It finds more opportunities to avoid reprocessing everything. Also, because KSP traces symbol resolutions 
dynamically, a change in a file is less likely to pollute other files and therefore the set of files to be reprocessed 
is smaller. This is not possible for kapt because it delegates processing to javac.

### Is KSP Kotlin-specific?

KSP can process Java sources as well. The API is unified, meaning that when you parse a Java class and a Kotlin class 
you get a unified data structure in KSP.
