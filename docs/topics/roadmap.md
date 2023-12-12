[//]: # (title: Kotlin roadmap)

<table>
    <tr>
        <td><strong>Last modified on</strong></td>
        <td><strong>December 2023</strong></td>
    </tr>
    <tr>
        <td><strong>Next update</strong></td>
        <td><strong>June 2024</strong></td>
    </tr>
</table>

Welcome to the Kotlin roadmap! Get a sneak peek into the priorities of the Kotlin Team.

## Key priorities

The goal of this roadmap is to give you a big picture. Here's a list of our key projects – the most important things we focus on delivering:

* **K2 compiler**: a rewrite of the Kotlin compiler optimized for speed, parallelism, and unification. It will also let us introduce many anticipated language features.
* **K2-based IntelliJ plugin**: much faster code completion, highlighting, and search, together with more stable code analysis.
* **Kotlin Multiplatform**: streamline build setup and enhance the iOS development experience.
* **Experience of library authors**: a set of documentation and tools helping to set up, develop, and publish Kotlin libraries.

## Kotlin roadmap by subsystem

To view the biggest projects we're working on, visit the [YouTrack board](https://youtrack.jetbrains.com/agiles/153-1251/current) or the [Roadmap details](#roadmap-details) table.

If you have any questions or feedback about the roadmap or the items on it, feel free to post them to [YouTrack tickets](https://youtrack.jetbrains.com/issues?q=project:%20KT,%20KTIJ%20tag:%20%7BRoadmap%20Item%7D%20%23Unresolved%20) or in the [#kotlin-roadmap](https://kotlinlang.slack.com/archives/C01AAJSG3V4) channel of Kotlin Slack ([request an invite](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)).

### YouTrack board

Visit the [roadmap board in our issue tracker YouTrack](https://youtrack.jetbrains.com/agiles/153-1251/current) ![YouTrack](youtrack-logo.png){width=30}{type="joined"}

![Roadmap board in YouTrack](roadmap-board.png){width=700}

### Roadmap details

<table>
    <tr>
        <th>Subsystem</th>
        <th>In focus now</th>
    </tr>
    <tr>
        <td><strong>Language</strong></td>
        <td>
            <p><tip><a href="https://youtrack.jetbrains.com/issue/KT-54620" target="_blank">List of all upcoming language features</a></tip></p>
        </td>
    </tr>
    <tr>
        <td><strong>Compiler</strong></td>
        <td>
            <list>
                <li>🆕 <a href="TO UPDATE" target="_blank">Kotlin/Wasm: Switch wasm-wasi target of libraries to WASI Preview 2</a></li>
                <li>🆕 <a href="TO UPDATE" target="_blank">Kotlin/Wasm: Support Component Model</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-60277" target="_blank">Promote Kotlin/Wasm to Beta</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-60255" target="_blank">Promote K2 compiler to Stable</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-60276" target="_blank">Support debugging inline functions on Android</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-60278" target="_blank">Make Kotlin/Wasm suitable for standalone Wasm VMs</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td><strong>Multiplatform</strong></td>
        <td>
            <list>
                <li>🆕 <a href="TO UPDATE" target="_blank">Unify inline semantics between all Kotlin targets</a></li>
                <li>🆕 <a href="TO UPDATE" target="_blank">Support SwiftPM for Kotlin Multiplatform users</a></li>
                <li>🆕 <a href="TO UPDATE" target="_blank">Swift export: Design and implement support for Kotlin classes and interfaces</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-55512">Improve the new Kotlin/Native memory manager robustness and performance and deprecate the old one</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-52600" target="_blank">Stabilize klib: Make binary compatibility easier for library authors</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42294" target="_blank">Improve Kotlin/Native compilation time</a></li>
            </list>
         </td>
    </tr>
    <tr>
        <td><strong>Tooling</strong></td>
        <td>
            <list>
                <li>🆕 <a href="TO UPDATE" target="_blank">Support Gradle project isolation</a></li>
                <li>🆕 <a href="TO UPDATE" target="_blank">Improve integration of Kotlin/Native toolchain into Gradle</a></li>
                <li>🆕 <a href="TO UPDATE" target="_blank">Kotlin Notebook: Light Notebooks and improved experience exploring data from HTTP endpoints</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-60279">Improve Kotlin build reports</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTIJ-23988">First public release of K2-based IntelliJ plugin</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTIJ-23989">Improve performance and code analysis stability of the current IDE plugin</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-55515">Expose stable compiler arguments in Gradle DSL</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-49511" target="_blank">Improve Kotlin scripting and experience with <code>.gradle.kts</code></a></li>
            </list>
         </td>
    </tr>
    <tr>
        <td><strong>Library ecosystem</strong></td>
        <td>
            <list>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-60280" target="_blank">Provide initial series of <code>kotlinx-io</code> releases</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-48011" target="_blank">Release <code>kotlinx-metadata-jvm</code> as Stable</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-49527" target="_blank">Promote <code>kotlinx-kover</code> to Stable</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-48998" target="_blank">Release Dokka as Stable</a></li>
            </list>
            <p>Ktor and Exposed roadmaps:</p>
            <list>
                <li><a href="https://blog.jetbrains.com/ktor/2022/12/16/ktor-2023-roadmap/" target="_blank">Ktor framework roadmap</a></li>
                <li><a href="https://blog.jetbrains.com/kotlin/2023/08/exposed-moving-forward/" target="_blank">Exposed library roadmap</a></li>
            </list>
         </td>
    </tr>
</table>

> * This roadmap is not an exhaustive list of all things the team is working on, only the biggest projects.
> * There's no commitment to delivering specific features or fixes in specific versions.
> * We will adjust our priorities as we go and update the roadmap approximately every six months.
> 
{type="note"}

## What's changed since July 2023

### Completed items

We've **completed** the following items from the previous roadmap:

* ✅ Compiler: [Promote Kotlin/Wasm to Alpha](https://youtrack.jetbrains.com/issue/KT-60277)
* ✅ Multiplatform: [Promote Kotlin Multiplatform Mobile to Stable](https://youtrack.jetbrains.com/issue/KT-55513)

### New items

We've **added** the following items to the roadmap:

* 🆕 Compiler: [Promote Kotlin/Wasm to Beta](https://youtrack.jetbrains.com/issue/KT-60277)
* 🆕 Compiler: [Kotlin/Wasm: Switch wasm-wasi target of libraries to WASI Preview 2]()
* 🆕 Compiler: [Kotlin/Wasm: Support Component Model]()
* 🆕 Multiplatform: [Unify inline semantics between all Kotlin targets]()
* 🆕 Multiplatform: [Support SwiftPM for Kotlin Multiplatform users]()
* 🆕 Multiplatform: [Swift export: Design and implement support for Kotlin classes and interfaces]()
* 🆕 Tooling: [Support Gradle project isolation]()
* 🆕 Tooling: [Improve integration of Kotlin/Native toolchain into Gradle]()
* 🆕 Tooling: [Kotlin Notebook: Light Notebooks and improved experience exploring data from HTTP endpoints]()

### Removed items

We've **removed** the following item from the roadmap:

* ❌ Multiplatform: [Improve exporting Kotlin code to Objective-C](https://youtrack.jetbrains.com/issue/KT-42297)

> Some items were removed from the roadmap but not dropped completely. In some cases, we've merged previous roadmap items
> with the current ones.
>
{type="note"}

### Items in progress

All other previously identified roadmap items are in progress. You can check their [YouTrack tickets](https://youtrack.jetbrains.com/issues?q=project:%20KT,%20KTIJ%20tag:%20%7BRoadmap%20Item%7D%20%23Unresolved%20)
for updates.