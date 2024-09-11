[//]: # (title: Kotlin roadmap)

<table>
    <tr>
        <td><strong>Last modified on</strong></td>
        <td><strong>August 2024</strong></td>
    </tr>
    <tr>
        <td><strong>Next update</strong></td>
        <td><strong>February 2025</strong></td>
    </tr>
</table>

Welcome to the Kotlin roadmap! Get a sneak peek into the priorities of the JetBrains Team.

## Key priorities

The goal of this roadmap is to give you a big picture. Here's a list of our key projects – the most important things we focus on delivering:

* **Language evolution**: more efficient data handling, increased abstraction, enhanced performance with clear code.
* **K2-based IntelliJ plugin**: faster code completion, highlighting, and search, along with more stable code analysis.
* **Kotlin Multiplatform**: release direct Kotlin to Swift Export, streamlined build setup, and simplified creation of multiplatform libraries.
* **Experience of third-party ecosystem authors**: simplified development and publication process for Kotlin libraries, tools, and frameworks.

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
    <tr>
        <td><strong>Language</strong></td>
        <td>
            <p><a href="kotlin-language-features-and-proposals.md">See the full list of Kotlin language features and proposals</a></p>
            <p><tip><a href="https://youtrack.jetbrains.com/issue/KT-54620" target="_blank">Follow the YouTrack issue for upcoming language features</a></tip></p>
        </td>
    </tr>
    <tr>
        <td><strong>Compiler</strong></td>
        <td>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-71275">Improve the quality of compiler diagnostics</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-71283">Generate JVM default methods</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64568" target="_blank">Kotlin/Wasm: Switch wasm-wasi target of libraries to WASI Preview 2</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64569" target="_blank">Kotlin/Wasm: Support Component Model</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-60276" target="_blank">Support debugging inline functions on Android</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td><strong>Multiplatform</strong></td>
        <td>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-71278">Enable Concurrent Mark and Sweep (CMS) GC by default</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-71279">Enable incremental compilation of klib artifacts by default</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-64572">The first public release of Swift Export</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-71281">Implement the next generation distribution format of multiplatform libraries</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64570" target="_blank">Unify inline semantics between all Kotlin targets</a></li>
            </list>
            <tip><p><a href="https://blog.jetbrains.com/kotlin/2023/11/kotlin-multiplatform-development-roadmap-for-2024/" target="_blank">Kotlin Multiplatform development roadmap for 2024</a></p></tip>
         </td>
    </tr>
    <tr>
        <td><strong>Tooling</strong></td>
        <td>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-71286">Design for Build Tools API</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-71287">Support Xcode 16 in Kotlin</a></li> 
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-71288">Publish publicly available API reference for Kotlin Gradle Plugin</a></li> 
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-71289">Support declaring Kotlin Multiplatform dependencies at project-level</a></li> 
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-71290">Stabilize klib cross-compilation on different platforms</a></li> 
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-71276">Provide out-of-the-box debugging experience for Kotlin/Wasm targets</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64575" target="_blank">Support Gradle project isolation</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64577" target="_blank">Improve integration of Kotlin/Native toolchain into Gradle</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTNB-506" target="_blank">Kotlin Notebook: Light Notebooks and improved experience exploring data from HTTP endpoints</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-60279">Improve Kotlin build reports</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-55515">Expose stable compiler arguments in Gradle DSL</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-49511" target="_blank">Improve Kotlin scripting and experience with <code>.gradle.kts</code></a></li>
            </list>
         </td>
    </tr>
    <tr>
        <td><strong>Library ecosystem</strong></td>
        <td>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-71293">Implement new Dokka Gradle plugin based on Dokkatoo</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-71295">Refine the Dokka HTML output UI</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-62423">New multiplatform API for the standard library</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-12719">Introduce default warnings/errors for Kotlin functions that return non-unit values that are unused</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-71298">New multiplatform API for the standard library: Support for Unicode and codepoints</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-71299">Expand Library authors’ guidelines</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-71300">Stabilize the <code>kotlinx-io</code> library</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-71292">Kotlin Ecosystem Plugin supporting Declarative Gradle</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-71297">Kotlin distribution UX: Code coverage and Binary compatibility validator – Phase 1</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64578" target="_blank">Promote <code>kotlinx-datetime</code> to Beta</a></li>
            </list>
            <tip><p>Ktor and Exposed roadmaps:</p>
            <list>
                <li><a href="https://blog.jetbrains.com/kotlin/2024/03/the-ktor-roadmap-for-2024/" target="_blank">Ktor framework roadmap</a></li>
                <li><a href="https://blog.jetbrains.com/kotlin/2023/08/exposed-moving-forward/" target="_blank">Exposed library roadmap</a></li>
            </list>
            </tip>
         </td>
    </tr>
</table>

> * This roadmap is not an exhaustive list of all things the team is working on, only the biggest projects.
> * There's no commitment to delivering specific features or fixes in specific versions.
> * We will adjust our priorities as we go and update the roadmap approximately every six months.
> 
{type="note"}

## What's changed since December 2023

### Completed items

We've **completed** the following items from the previous roadmap:

* ✅ Compiler: [Promote K2 compiler to Stable](https://youtrack.jetbrains.com/issue/KT-60255)
* ✅ Compiler: [Make Kotlin/Wasm suitable for standalone Wasm VMs](https://youtrack.jetbrains.com/issue/KT-60278)
* ✅ Multiplatform: [Improve the new Kotlin/Native memory manager’s robustness and performance, and deprecate the old one](https://youtrack.jetbrains.com/issue/KT-55512)
* ✅ Multiplatform: [Stabilize klib: make binary compatibility easier for library authors](https://youtrack.jetbrains.com/issue/KT-52600)
* ✅ Multiplatform: [Improve Kotlin/Native compilation time](https://youtrack.jetbrains.com/issue/KT-42294) 
* ✅ Tooling: [First public release of the K2-based IntelliJ plugin](https://youtrack.jetbrains.com/issue/KTIJ-23988)
* ✅ Tooling: [Improve the performance and code analysis stability of the current IDE plugin](https://youtrack.jetbrains.com/issue/KTIJ-23989)
* ✅ Library ecosystem: [Provide an initial series of kotlinx-io releases](https://youtrack.jetbrains.com/issue/KT-60280)
* ✅ Library ecosystem: [Release kotlinx-metadata-jvm as Stable](https://youtrack.jetbrains.com/issue/KT-48011)
* ✅ Library ecosystem: [Promote kotlinx-kover to Beta](https://youtrack.jetbrains.com/issue/KT-49527)

### New items

We've **added** the following items to the roadmap:

* 🆕 Compiler: [Improve the quality of compiler diagnostics](https://youtrack.jetbrains.com/issue/KT-71275)
* 🆕 Compiler: [Generate JVM default methods](https://youtrack.jetbrains.com/issue/KT-71283)
* 🆕 Multiplatform: [Enable Concurrent Mark and Sweep (CMS) GC by default](https://youtrack.jetbrains.com/issue/KT-71278)
* 🆕 Multiplatform: [Enable incremental compilation of klib artifacts by default](https://youtrack.jetbrains.com/issue/KT-71279)
* 🆕 Multiplatform: [The first public release of Swift Export](https://youtrack.jetbrains.com/issue/KT-64572)
* 🆕 Multiplatform: [Implement the next generation distribution format of multiplatform libraries](https://youtrack.jetbrains.com/issue/KT-71281)
* 🆕 Tooling: [Design for Build Tools API](https://youtrack.jetbrains.com/issue/KT-71286)
* 🆕 Tooling: [Support Xcode 16 in Kotlin](https://youtrack.jetbrains.com/issue/KT-71287)
* 🆕 Tooling: [Publish publicly available API reference for Kotlin Gradle Plugin](https://youtrack.jetbrains.com/issue/KT-71288)
* 🆕 Tooling: [Support declaring Kotlin Multiplatform dependencies at project-level](https://youtrack.jetbrains.com/issue/KT-71289)
* 🆕 Tooling: [Stabilize klib cross-compilation on different platforms](https://youtrack.jetbrains.com/issue/KT-71290)
* 🆕 Tooling: [Provide out-of-the-box debugging experience for Kotlin/Wasm targets](https://youtrack.jetbrains.com/issue/KT-71276)
* 🆕 Library ecosystem: [Implement new Dokka Gradle plugin based on Dokkatoo](https://youtrack.jetbrains.com/issue/KT-71293)
* 🆕 Library ecosystem: [Refine the Dokka HTML output UI](https://youtrack.jetbrains.com/issue/KT-71295)
* 🆕 Library ecosystem: [New multiplatform API for the standard library](https://youtrack.jetbrains.com/issue/KT-62423)
* 🆕 Library ecosystem: [Introduce default warnings/errors for Kotlin functions that return non-unit values that are unused](https://youtrack.jetbrains.com/issue/KT-12719)
* 🆕 Library ecosystem: [New multiplatform API for the standard library: Support for Unicode and codepoints](https://youtrack.jetbrains.com/issue/KT-71298)
* 🆕 Library ecosystem: [Expand Library authors’ guidelines](https://youtrack.jetbrains.com/issue/KT-71299)
* 🆕 Library ecosystem: [Stabilize the kotlinx-io library](https://youtrack.jetbrains.com/issue/KT-71300)
* 🆕 Library ecosystem: [Kotlin Ecosystem Plugin supporting Declarative Gradle](https://youtrack.jetbrains.com/issue/KT-71292)
* 🆕 Library ecosystem: [Kotlin distribution UX: Code coverage and Binary compatibility validator – Phase 1](https://youtrack.jetbrains.com/issue/KT-71297)

### Removed items

We've **removed** the following items from the roadmap:

* ❌ Multiplatform: [Swift export: Design and implement support for Kotlin classes and interfaces](https://youtrack.jetbrains.com/issue/KT-64572)
* ❌ Tooling: [Support SwiftPM for Kotlin Multiplatform users](https://youtrack.jetbrains.com/issue/KT-64571)
* ❌ Library ecosystem: [Release Dokka as Stable](https://youtrack.jetbrains.com/issue/KT-48998)

> Some items were removed from the roadmap but not dropped completely. In some cases, we've merged previous roadmap items
> with the current ones.
>
{type="note"}

### Items in progress

All other previously identified roadmap items are in progress. You can check their [YouTrack tickets](https://youtrack.jetbrains.com/issues?q=project:%20KT,%20KTIJ%20tag:%20%7BRoadmap%20Item%7D%20%23Unresolved%20)
for updates.