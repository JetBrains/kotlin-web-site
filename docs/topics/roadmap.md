[//]: # (title: Kotlin roadmap)

<table>
    <tr>
        <td><strong>Last modified on</strong></td>
        <td><strong>August 2026</strong></td>
    </tr>
    <tr>
        <td><strong>Next update</strong></td>
        <td><strong>February 2027</strong></td>
    </tr>
</table>

Welcome to the Kotlin roadmap! Get a sneak peek into the priorities of the JetBrains team.

## Key priorities

The goal of this roadmap is to give you the big picture.
Here's a list of our key focus areas – the most important directions we are focused on delivering:

* **Language evolution**: keep Kotlin concise and expressive, prioritizing ergonomics and safety over ceremony.
* **Kotlin Multiplatform**: become the foundation for modern cross-platform apps through a solid iOS experience, mature web targets, and reliable IDE tooling.
* **Staying agnostic**: support developers no matter their tools or targets.
* **Experience of third-party ecosystem authors:** simplify the development and publication process for Kotlin libraries, tools, and frameworks.

## Kotlin roadmap by subsystem

<!-- To view the biggest projects we're working on, see the [Roadmap details](#roadmap-details) table. -->

If you have any questions or feedback about the roadmap or the items on it, feel free to post them to [YouTrack tickets](https://youtrack.jetbrains.com/issues?q=project:%20KT,%20KTIJ%20tag:%20%7BRoadmap%20Item%7D%20%23Unresolved%20) or in the [#kotlin-roadmap](https://kotlinlang.slack.com/archives/C01AAJSG3V4) channel of Kotlin Slack ([request an invite](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)).

<!-- ### YouTrack board
Visit the [roadmap board in our issue tracker YouTrack](https://youtrack.jetbrains.com/agiles/153-1251/current) ![YouTrack](youtrack-logo.png){width=30}{type="joined"}
-->

<table>
    <tr>
        <th>Subsystem</th>
        <th>In focus now</th>
    </tr>
    <tr id="language">
        <td><strong>Language</strong></td>
        <td>
            <p><a href="kotlin-language-features-and-proposals.md">See the full list</a> of Kotlin language features and proposals or follow the <a href="https://youtrack.jetbrains.com/issue/KT-54620">YouTrack issue for upcoming language features</a></p>
        </td>
    </tr>
    <tr id="compiler">
        <td><strong>Compiler</strong></td>
        <td>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-88663" target="_blank">Promote Kotlin/Wasm to Stable</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-88664" target="_blank">Improve KAPT performance to be comparable with Java APT</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-51107" target="_blank">Stabilize overload resolution by lambda return type</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-84567" target="_blank">Support K2 multiplatform incremental compilation of common code</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-75463" target="_blank">New JVM reflection: Investigation, prototype and implementation </a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64568" target="_blank">Kotlin/Wasm: Switch the <code>wasm-wasi</code> target of libraries to WASI Preview 2</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64569" target="_blank">Kotlin/Wasm: Support the Component Model</a></li>
            </list>
        </td>
    </tr>
    <tr id="multiplatform">
        <td><strong>Multiplatform</strong></td>
        <td>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/SKIKO-982" target="_blank">Improved rendering reliability and future-proof GPU support via Graphite in Skiko</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KMT-2910" target="_blank">Xcode integration for Kotlin/Native debugger</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-86791" target="_blank">Swift Export: from Alpha to Beta</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/CMP-10598" target="_blank">Make Native Text Input default in Compose Multiplatform for iOS</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-86492" target="_blank">Native compiler caches in release mode</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64570" target="_blank">Unify inline semantics between stable Kotlin targets</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80307" target="_blank">Kotlin/JS: Improve onboarding materials for Kotlin/JS</a></li> 
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80308" target="_blank">Kotlin/JS: Compile to the modern JavaScript</a></li> 
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80310" target="_blank">Kotlin/JS: Extend possibilities for exporting Kotlin declarations to JavaScript </a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71279" target="_blank">Enable incremental compilation of klib artifacts by default</a></li>
            </list>
         </td>
    </tr>
    <tr id="tooling">
        <td><strong>Tooling</strong></td>
        <td>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-88545" target="_blank">Streamline the Kotlin-on-Maven onboarding with a unified compiler-plugins bundle</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KMT-2910" target="_blank">Xcode integration for Kotlin/Native debugger</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-88546" target="_blank">Enable Native tasks parallelization without configuration cache enabled</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTC-5718" target="_blank">Kotlin Toolchain: a single entry point into Kotlin</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-84572" target="_blank">Kotlin/Native debugger health and performance improvements</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-53877" target="_blank">Support for importing Swift Package Manager packages in Kotlin</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-66897" target="_blank">Replace Karma runner with a not-deprecated alternative</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80311" target="_blank">Support Kotlin/JS and Kotlin/Wasm in Gradle project isolation</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-76255" target="_blank">Design the Build tools API</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80322" target="_blank">Support Kotlin LSP and VS Code</a></li>
            </list>
         </td>
    </tr>
    <tr id="ecosystem">
        <td><strong>Ecosystem</strong></td>
        <td>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-88665" target="_blank">Implement first-class JPA/Hibernate support for Kotlin stdlib types</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-84574" target="_blank">Stabilize the experimental <code>kotlinx.serialization</code> API</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-84576" target="_blank">Improve the Lombok compiler plugin experience with Kotlin for server side</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-84575" target="_blank">Stabilize <code>kotlinx.collections.immutable</code></a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64578" target="_blank">Promote <code>kotlinx-datetime</code> to Beta</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80323" target="_blank">Implement KDoc machine-readable representation</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71298" target="_blank">New multiplatform API for the standard library: Support for Unicode and codepoints</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71300" target="_blank">Stabilize the <code>kotlinx-io</code> library</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-12719" target="_blank">Introduce default warnings/errors for Kotlin functions that return non-unit values that are unused</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80327" target="_blank">Release Kotlin DataFrame 1.0</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80328" target="_blank">Release Kandy 0.9</a></li>
            </list>
            <p><b>Ktor:</b></p>
            <list>
                <li><a href="https://youtrack.jetbrains.com/issue/KTOR-9266" target="_blank">Improve authentication in Ktor</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTOR-9498" target="_blank">Support HTTP/3</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTOR-1501" target="_blank">Add gRPC support to Ktor with a generator plugin and tutorial</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTOR-6622" target="_blank">Improve Ktor administration and observability</a></li>
            </list>
            <p><b>Exposed:</b></p>
            <list>
                <li><a href="https://youtrack.jetbrains.com/issue/EXPOSED-819" target="_blank">Release Exposed DAO 2.0</a></li>
            </list>
         </td>
    </tr>
</table>

> * This roadmap is not an exhaustive list of all things the team is working on, only the biggest projects.
> * There's no commitment to delivering specific features or fixes in specific versions.
> * We will adjust our priorities as we go and update the roadmap approximately every six months.
> 
{style="note"}

## What's changed since February 2026

### Completed items

We've **completed** the following items from the previous roadmap:

* ✅ Compiler: [Evolve the Power-assert plugin](https://youtrack.jetbrains.com/issue/KT-84568)
* ✅ Compiler: [Kotlin/Wasm: Support multi-module compilation](https://youtrack.jetbrains.com/issue/KT-82064)
* ✅ Multiplatform: [Swift Export: Alpha release](https://youtrack.jetbrains.com/issue/KT-64572)
* ✅ Multiplatform: [Implement new `TextInputService` on iOS for Compose Multiplatform](https://youtrack.jetbrains.com/issue/KT-84569)
* ✅ Multiplatform: [Swift 6.3 support](https://youtrack.jetbrains.com/issue/KT-84570)
* ✅ Multiplatform: [Stabilize Navigation3 for Compose Multiplatform](https://youtrack.jetbrains.com/issue/KT-84571)
* ✅ Tooling: [Smart defaults for Kotlin on Maven (mixed Java + Kotlin)](https://youtrack.jetbrains.com/issue/KT-84573)
* ✅ Tooling: [Release Kotlin ecosystem plugin supporting declarative Gradle](https://youtrack.jetbrains.com/issue/KT-71292)
* ✅ Ecosystem: [Improve Kotlin distribution UX: Add code coverage and binary compatibility validation](https://youtrack.jetbrains.com/issue/KT-71297)
* ✅ Ecosystem: [Introduce 18-month support window for security fixes in the standard library](https://youtrack.jetbrains.com/issue/KT-83525)
* ✅ Ecosystem: [Create a migration Gradle plugin for Exposed](https://youtrack.jetbrains.com/issue/EXPOSED-755)

### New items

We've **added** the following items to the roadmap:

* 🆕 Compiler: [Promote Kotlin/Wasm to Stable](https://youtrack.jetbrains.com/issue/KT-88663)
* 🆕 Compiler: [Improve KAPT performance to be comparable with Java APT](https://youtrack.jetbrains.com/issue/KT-88664)
* 🆕 Multiplatform: [Improved rendering reliability and future-proof GPU support via Graphite in Skiko](https://youtrack.jetbrains.com/issue/SKIKO-982)
* 🆕 Multiplatform: [Swift Export: from Alpha to Beta](https://youtrack.jetbrains.com/issue/KT-86791)
* 🆕 Multiplatform: [Make Native Text Input default in Compose Multiplatform for iOS](https://youtrack.jetbrains.com/issue/CMP-10598)
* 🆕 Multiplatform: [Native compiler caches in release mode](https://youtrack.jetbrains.com/issue/KT-86492)
* 🆕 Tooling: [Streamline the Kotlin-on-Maven onboarding with a unified compiler-plugins bundle](https://youtrack.jetbrains.com/issue/KT-88545)
* 🆕 Tooling: [Xcode integration for Kotlin/Native debugger](https://youtrack.jetbrains.com/issue/KMT-2910)
* 🆕 Tooling: [Enable Native tasks parallelization without configuration cache enabled](https://youtrack.jetbrains.com/issue/KT-88546)
* 🆕 Tooling: [Kotlin Toolchain: a single entry point into Kotlin](https://youtrack.jetbrains.com/issue/KTC-5718)
* 🆕 Ecosystem: [Implement first-class JPA/Hibernate support for Kotlin stdlib types](https://youtrack.jetbrains.com/issue/KT-88665)

### Removed items

We've **removed** the following items from the roadmap:

* ❌ Multiplatform: [Implement the next generation distribution format of multiplatform libraries](https://youtrack.jetbrains.com/issue/KT-68323)
* ❌ Tooling: [Improve Kotlin scripting and experience with `.gradle.kts`](https://youtrack.jetbrains.com/issue/KT-49511)
* ❌ Ecosystem: [Stabilize Kotlin Notebooks](https://youtrack.jetbrains.com/issue/KT-80324)
