[//]: # (title: Kotlin roadmap)

<table>
    <tr>
        <td><strong>Last modified on</strong></td>
        <td><strong>February 2026</strong></td>
    </tr>
    <tr>
        <td><strong>Next update</strong></td>
        <td><strong>August 2026</strong></td>
    </tr>
</table>

Welcome to the Kotlin roadmap! Get a sneak peek into the priorities of the JetBrains team.

## Key priorities

The goal of this roadmap is to give you the big picture.
Here's a list of our key focus areas – the most important directions we are focused on delivering:

* **Language evolution**: keep Kotlin concise and expressive, prioritizing meaningful semantics over ceremony.
* **Multiplatform**: become the foundation for modern multiplatform apps through a solid iOS experience,
  mature web targets, and reliable IDE tooling.
* **Staying agnostic**: support developers no matter their tools or targets.
* **Ecosystem support**: simplify the development and publication process for Kotlin libraries, tools, and frameworks.

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
                <li>🆕 Kotlin/Wasm: Support multi-module compilation</li>
                <li>🆕 Stabilize overload resolution by lambda return type</li>
                <li>🆕 Support K2 multiplatform incremental compilation of common code</li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-75463" target="_blank">New JVM reflection: Investigation, prototype and implementation </a></li>
                <li>🆕 Evolve the Power-assert plugin</li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-64568" target="_blank">Kotlin/Wasm: Switch the <code>wasm-wasi</code> target of libraries to WASI Preview 2</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-64569" target="_blank">Kotlin/Wasm: Support Component Model</a></li>
            </list>
        </td>
    </tr>
    <tr id="multiplatform">
        <td><strong>Multiplatform</strong></td>
        <td>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-80305">Swift Export: Alpha release</a></li>
                <li>🆕 Implement new <code>TextInputService</code> on iOS</li>
                <li>🆕 Swift 6.3 support</li> 
                <li>🆕 Stabilize Navigation3</li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-68323" target="_blank">Implement the next generation distribution format of multiplatform libraries</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64570" target="_blank">Unify inline semantics between stable Kotlin targets</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80307" target="_blank">Kotlin/JS: Improve onboarding materials for Kotlin/JS</a></li> 
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80308" target="_blank">Kotlin/JS: Compile to the modern JavaScript</a></li> 
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80310" target="_blank">Kotlin/JS: Extend possibilities for exporting Kotlin declarations to JavaScript </a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71279" target="_blank">Enable incremental compilation of klib artifacts by default</a></li>
            </list>
            <!--<tip><p><a href="https://jb.gg/kmp-roadmap-2025" target="_blank">Kotlin Multiplatform development roadmap</a></p></tip>-->
         </td>
    </tr>
    <tr id="tooling">
        <td><strong>Tooling</strong></td>
        <td>
            <list>
                <li>🆕 Kotlin/Native debugger health and performance improvements</li>
                <li>🆕 Smart Defaults for Kotlin on Maven (Mixed Java + Kotlin)</li>
                <li>🆕 Support for importing Swift Package Manager packages in Kotlin</li>
                <li>🆕 Replace Karma runner with a not-deprecated alternative</li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-49511" target="_blank">Improve Kotlin scripting and experience with <code>.gradle.kts</code></a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80311" target="_blank">Support Kotlin JS\Wasm in Gradle project isolation</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-76255" target="_blank">Design the Build tools API</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71292" target="_blank">Release Kotlin Ecosystem Plugin supporting Declarative Gradle</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80322" target="_blank">Support Kotlin LSP and VS Code</a></li>
            </list>
         </td>
    </tr>
    <tr id="ecosystem">
        <td><strong>Ecosystem</strong></td>
        <td>
            <list>
                <li>🆕 Introduce 18-month support window for security fixes in the standard library</li>
                <li>🆕 Stabilize the experimental <code>kotlinx.serialization</code> API</li>
                <li>🆕 Stabilize <code>kotlinx.collections.immutable</code></li>
                <li>🆕 Improve the Lombok compiler plugin experience with Kotlin for server-side</li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64578" target="_blank">Promote <code>kotlinx-datetime</code> to Beta</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80323" target="_blank">Implement KDoc machine-readable representation</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71297" target="_blank">Improve Kotlin distribution UX: Add code coverage and binary compatibility validation</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71298" target="_blank">New multiplatform API for the standard library: Support for Unicode and codepoints</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71300" target="_blank">Stabilize the <code>kotlinx-io</code> library</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80324" target="_blank">Stabilize Kotlin Notebooks</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80327" target="_blank">Release Kotlin DataFrame 1.0</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-80328" target="_blank">Release Kandy 0.9</a></li>
            </list>
            <p><b>Ktor:</b></p>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-9266" target="_blank">Improve authentication in Ktor</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTOR-7938" target="_blank">Support HTTP/3</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTOR-6026" target="_blank">Create Kubernetes Generator plugin</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTOR-1501" target="_blank">Add gRPC support to Ktor with a generator plugin and tutorial</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTOR-6622" target="_blank">Improve Ktor administration and observability</a></li>
            </list>
            <p><b>Exposed:</b></p>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/EXPOSED-778" target="_blank">Release Exposed DAO 2.0</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/EXPOSED-755" target="_blank">Create a migration Gradle plugin</a></li>
            </list>
         </td>
    </tr>
</table>

> * This roadmap is not an exhaustive list of all things the team is working on, only the biggest projects.
> * There's no commitment to delivering specific features or fixes in specific versions.
> * We will adjust our priorities as we go and update the roadmap approximately every six months.
> 
{style="note"}

## What's changed since August 2025

### Completed items

We've **completed** the following items from the previous roadmap:

* ✅ Compiler: [Finalize JSpecify support](https://youtrack.jetbrains.com/issue/KT-75371)
* ✅ Compiler: [Deprecate K1 compiler](https://youtrack.jetbrains.com/issue/KT-75372)
* ✅ Compiler: [Promote Kotlin/Wasm (`wasm-js` target) to Beta](https://youtrack.jetbrains.com/issue/KT-75370)
* ✅ Multiplatform: [Enable Concurrent Mark and Sweep (CMS) GC by default](https://youtrack.jetbrains.com/issue/KT-71278)
* ✅ Multiplatform: Support for Windows and Linux in the Kotlin Multiplatform IDE plugin
* ✅ Multiplatform: Release Compose Multiplatform for Web in Beta
* ✅ Multiplatform: Release Compose Hot Reload in Stable
* ✅ Tooling: [Improve Kotlin + JPA experience](https://youtrack.jetbrains.com/issue/KTIJ-35208)
* ✅ Tooling: [Kotlin Notebooks: Support new use cases](https://youtrack.jetbrains.com/issue/KTNB-1133)
* ✅ Tooling: [Improve development experience for Kotlin/Wasm projects in IntelliJ IDEA](https://youtrack.jetbrains.com/issue/KT-75374)
* ✅ Tooling: Add NPM publishing for JS/Wasm artifacts
* ✅ Tooling: [IntelliJ IDEA K2 mode complete release](https://youtrack.jetbrains.com/issue/KTIJ-31316)
* ✅ Tooling: [Improve import performance](https://youtrack.jetbrains.com/issue/KT-75376)
* ✅ Ecosystem: [Introduce default warnings/errors for Kotlin functions that return non-unit values that are unused](https://youtrack.jetbrains.com/issue/KT-12719)
* ✅ Ecosystem: [Support OpenAPI specification for the Ktor Client and Server application](https://youtrack.jetbrains.com/issue/KTOR-8316)
* ✅ Ecosystem: [WebRTC Client](https://youtrack.jetbrains.com/issue/KTOR-7958)
* ✅ Ecosystem: [Make dependency injection usage simple](https://youtrack.jetbrains.com/issue/KTOR-6621)
* ✅ Ecosystem: [Release 1.0.0](https://youtrack.jetbrains.com/issue/EXPOSED-444)
* ✅ Ecosystem: [Add R2DBC Support](https://youtrack.jetbrains.com/issue/EXPOSED-74)

### New items

We've **added** the following items to the roadmap:

* 🆕 Compiler: Kotlin/Wasm: Support multi-module compilation
* 🆕 Compiler: Kotlin/Wasm: Switch the `wasm-wasi `target of libraries to WASI Preview 2
* 🆕 Compiler: Stabilize overload resolution by lambda return type
* 🆕 Compiler: Support K2 multiplatform incremental compilation of common code
* 🆕 Compiler: [New JVM reflection: Investigation, prototype and implementation](https://youtrack.jetbrains.com/issue/KT-75463)
* 🆕 Compiler: Evolve the Power-assert plugin
* 🆕 Compiler: Kotlin/Wasm: Support Component Model
* 🆕 Multiplatform: [Swift Export: Alpha release](https://youtrack.jetbrains.com/issue/KT-80305)
* 🆕 Multiplatform: Implement new `TextInputService` on iOS
* 🆕 Multiplatform: Swift 6.3 support
* 🆕 Multiplatform: Stabilize Navigation3
* 🆕 Tooling: Kotlin/Native debugger health and performance improvements
* 🆕 Tooling: Smart Defaults for Kotlin on Maven (Mixed Java + Kotlin)
* 🆕 Tooling: Support for importing Swift Package Manager packages in Kotlin
* 🆕 Tooling: Replace Karma runner with a not-deprecated alternative
* 🆕 Ecosystem: Introduce 18-month support window for security fixes in the standard library
* 🆕 Ecosystem: Stabilize the experimental `kotlinx.serialization` API
* 🆕 Ecosystem: Stabilize `kotlinx.collections.immutable`
* 🆕 Ecosystem: Improve the Lombok compiler plugin experience with Kotlin for server-side
* 🆕 Ecosystem: [Improve authentication in Ktor](https://youtrack.jetbrains.com/issue/KTOR-9266)
* 🆕 Ecosystem: [Release Exposed DAO 2.0](https://youtrack.jetbrains.com/issue/EXPOSED-778)
* 🆕 Ecosystem: [Create a migration Gradle plugin](https://youtrack.jetbrains.com/issue/EXPOSED-755)

### Removed items

We've **removed** the following item from the roadmap:

* ❌ Compiler: [Kotlin/Wasm: Prototype multithreading support using the new threads proposal](https://youtrack.jetbrains.com/issue/KT-80304)

> Some items were removed from the roadmap but not dropped completely. In some cases, we've merged previous roadmap items
> with the current ones.
>
{style="note"}
