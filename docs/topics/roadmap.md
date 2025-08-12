[//]: # (title: Kotlin roadmap)

<table>
    <tr>
        <td><strong>Last modified on</strong></td>
        <td><strong>February 2025</strong></td>
    </tr>
    <tr>
        <td><strong>Next update</strong></td>
        <td><strong>August 2025</strong></td>
    </tr>
</table>

Welcome to the Kotlin roadmap! Get a sneak peek into the priorities of the JetBrains Team.

## Key priorities

The goal of this roadmap is to give you the big picture.
Here's a list of our key focus areas – the most important directions we are focused on delivering:

* **Language evolution**: more efficient data handling, increased abstraction, enhanced performance with clear code.
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
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-75371">Finalize JSpecify support</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-75372">Deprecate K1 compiler</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-75370">Promote Kotlin/Wasm (<code>wasm-js</code> target) to Beta</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64568" target="_blank">Kotlin/Wasm: Switch <code>wasm-wasi</code> target of libraries to WASI Preview 2</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64569" target="_blank">Kotlin/Wasm: Support Component Model</a></li>
            </list>
        </td>
    </tr>
    <tr id="multiplatform">
        <td><strong>Multiplatform</strong></td>
        <td>
            <list>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64572">The first public release of Swift Export</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71278">Enable Concurrent Mark and Sweep (CMS) GC by default</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71290">Stabilize klib cross-compilation on different platforms</a></li> 
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71281">Implement the next generation distribution format of multiplatform libraries</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71289">Support declaring Kotlin Multiplatform dependencies at project-level</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64570" target="_blank">Unify inline semantics between all Kotlin targets</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71279" target="_blank">Enable incremental compilation of klib artifacts by default</a></li>
            </list>
            <tip><p><a href="https://www.jetbrains.com/help/kotlin-multiplatform-dev/kotlin-multiplatform-roadmap.html" target="_blank">Kotlin Multiplatform development roadmap</a></p></tip>
         </td>
    </tr>
    <tr id="tooling">
        <td><strong>Tooling</strong></td>
        <td>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-75374" target="_blank">Improve development experience for Kotlin/Wasm projects in IntelliJ IDEA</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-75376" target="_blank">Improve performance of imports</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-75377" target="_blank">Support resources in XCFrameworks</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTNB-898" target="_blank">Kotlin Notebook: Smoother access and improved experience</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTIJ-31316" target="_blank">IntelliJ IDEA K2 mode complete release</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71286" target="_blank">Design the Build Tools API</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71292" target="_blank">Kotlin Ecosystem Plugin supporting Declarative Gradle</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-54105" target="_blank">Support Gradle project isolation</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64577" target="_blank">Improve integration of Kotlin/Native toolchain into Gradle</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-60279" target="_blank">Improve Kotlin build reports</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-55515" target="_blank">Expose stable compiler arguments in Gradle DSL</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-49511" target="_blank">Improve Kotlin scripting and experience with <code>.gradle.kts</code></a></li>
            </list>
         </td>
    </tr>
    <tr id="library-ecosystem">
        <td><strong>Library ecosystem</strong></td>
        <td>
            <p><b>Library ecosystem roadmap items:</b></p>
            <list>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71295" target="_blank">Refine the Dokka HTML output UI</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-12719" target="_blank">Introduce default warnings/errors for Kotlin functions that return non-unit values that are unused</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71298" target="_blank">New multiplatform API for the standard library: Support for Unicode and codepoints</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71300" target="_blank">Stabilize the <code>kotlinx-io</code> library</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-71297" target="_blank">Improve Kotlin distribution UX: add code coverage and binary compatibility validation</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-64578" target="_blank">Promote <code>kotlinx-datetime</code> to Beta</a></li>
            </list>
            <p><b>Ktor:</b></p>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-1501">Add gRPC support to Ktor with a generator plugin and tutorial</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-7158">Make project structuring for the backend applications simple</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-3937">Publish CLI generator to SNAP</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-6026">Create Kubernetes Generator Plugin</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-6621">Make Dependency Injection Usage Simple</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTOR-7938">HTTP/3 Support</a></li>
            </list>
            <p><b>Exposed:</b></p>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/EXPOSED-444">Release 1.0.0</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/EXPOSED-74">Add R2DBC Support</a></li>
            </list>
         </td>
    </tr>
</table>

> * This roadmap is not an exhaustive list of all things the team is working on, only the biggest projects.
> * There's no commitment to delivering specific features or fixes in specific versions.
> * We will adjust our priorities as we go and update the roadmap approximately every six months.
> 
{style="note"}

## What's changed since September 2024

### Completed items

We've **completed** the following items from the previous roadmap:

* ✅ Compiler: [Support debugging inline functions on Android](https://youtrack.jetbrains.com/issue/KT-60276)
* ✅ Compiler: [Improve the quality of compiler diagnostics](https://youtrack.jetbrains.com/issue/KT-71275)
* ✅ Multiplatform: [Support Xcode 16 in Kotlin](https://youtrack.jetbrains.com/issue/KT-71287)
* ✅ Multiplatform: [Publish publicly available API reference for Kotlin Gradle Plugin](https://youtrack.jetbrains.com/issue/KT-71288)
* ✅ Tooling: [Provide out-of-the-box debugging experience for Kotlin/Wasm targets](https://youtrack.jetbrains.com/issue/KT-71276)
* ✅ Library ecosystem: [Implement new Dokka Gradle plugin based on Dokkatoo](https://youtrack.jetbrains.com/issue/KT-71293)
* ✅ Library ecosystem: [New multiplatform API for the standard library: Atomics](https://youtrack.jetbrains.com/issue/KT-62423)
* ✅ Library ecosystem: [Expand Library authors' guidelines](https://youtrack.jetbrains.com/issue/KT-71299)

### New items

We've **added** the following items to the roadmap:

* 🆕 Compiler: [Finalize JSpecify support](https://youtrack.jetbrains.com/issue/KT-75371)
* 🆕 Compiler: [Deprecate K1 compiler](https://youtrack.jetbrains.com/issue/KT-75372)
* 🆕 Compiler: [Promote Kotlin/Wasm (`wasm-js` target) to Beta](https://youtrack.jetbrains.com/issue/KT-75370)
* 🆕 Tooling: [Improve development experience for Kotlin/Wasm projects in IntelliJ IDEA](https://youtrack.jetbrains.com/issue/KT-75374)
* 🆕 Tooling: [Improve performance of imports](https://youtrack.jetbrains.com/issue/KT-75376)
* 🆕 Tooling: [Support resources in XCFrameworks](https://youtrack.jetbrains.com/issue/KT-75377)
* 🆕 Tooling: [Smoother access and improved experience in Kotlin Notebook](https://youtrack.jetbrains.com/issue/KTNB-898)
* 🆕 Ktor: [Add gRPC support to Ktor with a generator plugin and tutorial](https://youtrack.jetbrains.com/issue/KTOR-1501)
* 🆕 Ktor: [Make project structuring for the backend applications simple](https://youtrack.jetbrains.com/issue/KTOR-7158)
* 🆕 Ktor: [Publish CLI generator to SNAP](https://youtrack.jetbrains.com/issue/KTOR-3937)
* 🆕 Ktor: [Create Kubernetes Generator Plugin](https://youtrack.jetbrains.com/issue/KTOR-6026)
* 🆕 Ktor: [Make Dependency Injection Usage Simple](https://youtrack.jetbrains.com/issue/KTOR-6621)
* 🆕 Ktor: [HTTP/3 Support](https://youtrack.jetbrains.com/issue/KTOR-7938)
* 🆕 Exposed: [Release 1.0.0](https://youtrack.jetbrains.com/issue/EXPOSED-444)
* 🆕 Exposed: [Add R2DBC Support](https://youtrack.jetbrains.com/issue/EXPOSED-74)

<!--
### Removed items

We've **removed** the following items from the roadmap:

* ❌ Compiler: [Improve the quality of compiler diagnostics](https://youtrack.jetbrains.com/issue/KT-71275)

> Some items were removed from the roadmap but not dropped completely. In some cases, we've merged previous roadmap items
> with the current ones.
>
{style="note"}
-->

### Items in progress

All other previously identified roadmap items are in progress. You can check their [YouTrack tickets](https://youtrack.jetbrains.com/issues?q=project:%20KT,%20KTIJ%20tag:%20%7BRoadmap%20Item%7D%20%23Unresolved%20)
for updates.
