[//]: # (title: KSP FAQ)

### Why KSP?

KSP has several advantages over [kapt](kapt.md):
* It is faster.
* The API is more fluent for Kotlin users.
* It supports [multiple round processing](ksp-multi-round.md) on generated Kotlin sources.
* It is being designed with multiplatform compatibility in mind.

### Why is KSP faster than kapt?

kapt has to parse and resolve every type reference in order to generate Java stubs, whereas KSP resolves references on-demand.
Delegating to javac also takes time.

Additionally, KSP's [incremental processing model](ksp-incremental.md) has a finer granularity than just isolating and
aggregating. It finds more opportunities to avoid reprocessing everything. Also, because KSP traces symbol resolutions
dynamically, a change in a file is less likely to pollute other files and therefore the set of files to be reprocessed
is smaller. This is not possible for kapt because it delegates processing to javac.

### Is KSP Kotlin-specific?

KSP can process Java sources as well. The API is unified, meaning that when you parse a Java class and a Kotlin class
you get a unified data structure in KSP.

### How to upgrade KSP?

KSP has API and implementation. The API rarely changes and is backward compatible: there can be new interfaces,
but old interfaces never change. The implementation is tied to a specific compiler version. With the new release, 
the supported compiler version can change.

Processors only depend on API and therefore are not tied to compiler versions.
However, users of processors need to bump KSP version when bumping the compiler version in their project.
Otherwise, the following error will occur:

```text
ksp-a.b.c is too old for kotlin-x.y.z. Please upgrade ksp or downgrade kotlin-gradle-plugin
```

> Users of processors don't need to bump processor's version because processors only depend on API.
>
{style="note"}

For example, some processor is released and tested with KSP 1.0.1, which depends strictly on Kotlin 1.6.0.
To make it work with Kotlin 1.6.20, the only thing you need to do is bump KSP to a version (for example, KSP 1.1.0) 
that is built for Kotlin 1.6.20.

### Can I use a newer KSP implementation with an older Kotlin compiler?

If the language version is the same, Kotlin compiler is supposed to be backward compatible. 
Bumping Kotlin compiler should be trivial most of the time. If you need a newer KSP implementation, please upgrade 
the Kotlin compiler accordingly.

### How often do you update KSP?

KSP tries to follow [Semantic Versioning](https://semver.org/) as close as possible.
With KSP version `major.minor.patch`,
* `major` is reserved for incompatible API changes. There is no pre-determined schedule for this.
* `minor` is reserved for new features. This is going to be updated approximately quarterly.
* `patch` is reserved for bug fixes and new Kotlin releases. It's updated roughly monthly.

Usually a corresponding KSP release is available within a couple of days after a new Kotlin version is released,
including the [pre-releases (Beta or RC)](eap.md).

### Besides Kotlin, are there other version requirements for libraries?

Here is a list of requirements for libraries/infrastructures:
* Android Gradle Plugin 7.1.3+
* Gradle 6.8.3+

### What is KSP's future roadmap?

The following items have been planned:
* Support [new Kotlin compiler](https://kotlinlang.org/docs/roadmap.html)
* Improve support to multiplatform. For example, running KSP on a subset of targets/sharing computations between targets.
* Improve performance. There are a bunch of optimizations to be done!
* Keep fixing bugs.

Please feel free to reach out to us in the [#ksp channel in Kotlin Slack](https://kotlinlang.slack.com/archives/C013BA8EQSE)
([get an invite](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)) 
if you would like to discuss any ideas. Filing [GitHub issues/feature requests](https://github.com/google/ksp/issues)
or pull requests are also welcome!