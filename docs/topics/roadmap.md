[//]: # (title: Kotlin roadmap)

<table>
    <tr>
        <td><strong>Last modified on</strong></td>
        <td><strong>July 2023</strong></td>
    </tr>
    <tr>
        <td><strong>Next update</strong></td>
        <td><strong>December 2023</strong></td>
    </tr>
</table>

Welcome to the Kotlin roadmap! Get a sneak peek into the priorities of the Kotlin Team.

## Key priorities

The goal of this roadmap is to give you a big picture. Here's a list of our key projects – the most important things we focus on delivering:

* **K2 compiler**: a rewrite of the Kotlin compiler optimized for speed, parallelism, and unification. It will also let us introduce many anticipated language features.
* **K2-based IntelliJ plugin**: much faster code completion, highlighting, and search, together with more stable code analysis.
* **Kotlin Multiplatform Mobile**: promote the technology to Stable by improving the toolchain stability and documentation, and ensuring compatibility guarantees.
* **Experience of library authors**: a set of documentation and tools helping to set up, develop, and publish Kotlin libraries.

## Kotlin roadmap by subsystem

To view the biggest projects we're working on, visit the [YouTrack board](https://youtrack.jetbrains.com/agiles/153-1251/current) or the [Roadmap details](#roadmap-details) table.

If you have any questions or feedback about the roadmap or the items on it, feel free to post them to [YouTrack tickets](https://youtrack.jetbrains.com/issues?q=project:%20KT,%20KTIJ%20tag:%20%7BRoadmap%20Item%7D%20%23Unresolved%20) or in the [#kotlin-roadmap](https://kotlinlang.slack.com/archives/C01AAJSG3V4) channel of Kotlin Slack ([request an invite](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)).

### YouTrack board

Visit the [roadmap board in our issue tracker YouTrack](https://youtrack.jetbrains.com/agiles/153-1251/current) ![YouTrack](youtrack-logo.png){width=30}{type="joined"}

![Roadmap board in YouTrack](roadmap-board.png){width=800}

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
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-60255" target="_blank">Release Kotlin 2.0</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-60276" target="_blank">Design and implement new debugging information</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-60277" target="_blank">Promote Kotlin/Wasm to Alpha</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-60278" target="_blank">Make Kotlin/Wasm suitable for standalone Wasm VMs (without JavaScript support)</a></li>
            </list>
        </td>
    </tr>
    <tr>
        <td><strong>Multiplatform</strong></td>
        <td>
            <list>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-55513">Promote Kotlin Multiplatform Mobile to Stable</a></li> 
                <li><a href="https://youtrack.jetbrains.com/issue/KT-55512">Improve the new Kotlin/Native memory manager robustness and performance and deprecate the old one</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-52600" target="_blank">Stabilize klib: keep binary compatibility easier for library authors</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42297" target="_blank">Improve exporting Kotlin code to Objective-C</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42294" target="_blank">Improve Kotlin/Native compilation time</a></li>
            </list>
         </td>
    </tr>
    <tr>
        <td><strong>Tooling</strong></td>
        <td>
            <list>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-60279">Improve Kotlin build reports</a></li>
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
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-60280" target="_blank">Provide initial series of <code>kotlinx-io</code> releases towards its Stable release</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-48011" target="_blank">Release <code>kotlinx-metadata-jvm</code> as Stable</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-49527" target="_blank">Stabilize <code>kotlinx-kover</code></a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-48998" target="_blank">Release Dokka as Stable</a></li>
            </list>
            <p><tip><a href="https://blog.jetbrains.com/ktor/2022/12/16/ktor-2023-roadmap/" target="_blank">The Ktor framework roadmap</a></tip></p>
         </td>
    </tr>
</table>

> * This roadmap is not an exhaustive list of all things the team is working on, only the biggest projects.
> * There's no commitment to delivering specific features or fixes in specific versions.
> * We will adjust our priorities as we go and update the roadmap approximately every six months.
> 
{type="note"}

## What's changed since May 2022

### Completed items

We've **completed** the following items from the previous roadmap:

* ✅ Language: [Introduce special syntax for `until` operator](https://youtrack.jetbrains.com/issue/KT-15613)
* ✅ Language: [Provide modern and performant replacement for `Enum.values()`](https://youtrack.jetbrains.com/issue/KT-48872)
* ✅ Language: [Design and implement solution for `toString` on objects](https://youtrack.jetbrains.com/issue/KT-4107)
* ✅ Compiler: [Release K2 Beta](https://youtrack.jetbrains.com/issue/KT-52604)
* ✅ Compiler: [Fix issues related to inline classes on the JVM](https://youtrack.jetbrains.com/issue/KT-49514)
* ✅ Compiler: [Implement an experimental version of Kotlin/Wasm compiler backend](https://youtrack.jetbrains.com/issue/KT-46773)
* ✅ Tooling: [Provide better experience with Kotlin Daemon](https://youtrack.jetbrains.com/issue/KT-49532)
* ✅ Tooling: [Improve the performance of Gradle incremental compilation](https://youtrack.jetbrains.com/issue/KT-42309)
* ✅ Tooling: [Release the Experimental version of the Kotlin Notebooks IJ IDEA plugin](https://youtrack.jetbrains.com/issue/KTIJ-23990)
* ✅ Library ecosystem: [Release `kotlinx-coroutines` 1.7](https://youtrack.jetbrains.com/issue/KT-49529)
* ✅ Library ecosystem: [Improve `kotlinx-datetime` library](https://youtrack.jetbrains.com/issue/KT-42315)
* ✅ Library ecosystem: [Continue to develop and stabilize the standard library](https://youtrack.jetbrains.com/issue/KT-52601)

* ✅ Compiler core: [Maintain the current compiler](https://youtrack.jetbrains.com/issue/KT-42286)
* ✅ Kotlin/JVM: [Support kapt in JVM IR](https://youtrack.jetbrains.com/issue/KT-49682)
* ✅ Kotlin/JVM: [Maintain the new JVM IR backend](https://youtrack.jetbrains.com/issue/KT-46767)
* ✅ Kotlin/JVM: [Improve the new JVM IR backend compilation time](https://youtrack.jetbrains.com/issue/KT-46768)
* ✅ Kotlin/Native: [Provide binary compatibility between incremental releases](https://youtrack.jetbrains.com/issue/KT-42293)
* ✅ Kotlin/Native: [Promote new memory manager to Beta and enable it by default](https://youtrack.jetbrains.com/issue/KT-52595)
* ✅ Kotlin/JS: [Make the new JS IR backend Stable](https://youtrack.jetbrains.com/issue/KT-42289)
* ✅ Kotlin/JS: [Maintain the old JS backend by fixing critical bugs](https://youtrack.jetbrains.com/issue/KT-42291)
* ✅ Multiplatform: [Promote Kotlin Multiplatform Mobile to Beta](https://youtrack.jetbrains.com/issue/KT-52596)
* ✅ Libraries: [Release `kotlinx-serialization` 1.4](https://youtrack.jetbrains.com/issue/KT-49528)
* ✅ IDE: [Stabilize code analysis](https://youtrack.jetbrains.com/issue/KTIJ-21906)
* ✅ IDE: [Make update of compiler/platform versions faster](https://youtrack.jetbrains.com/issue/KTIJ-20044)
* ✅ IDE: [Improve Multiplatform project support](https://youtrack.jetbrains.com/issue/KTIJ-20045)
* ✅ IDE: [Stabilize Eclipse plugin](https://youtrack.jetbrains.com/issue/KTIJ-20046)
* ✅ IDE: [Prototype the IDE plugin with the new compiler frontend](https://youtrack.jetbrains.com/issue/KTIJ-18195)
* ✅ IDE: [Improve IDE performance](https://youtrack.jetbrains.com/issue/KTIJ-18174)
* ✅ IDE: [Improve debugging experience](https://youtrack.jetbrains.com/issue/KTIJ-18572)
* ✅ Website: [Make the Kotlin website mobile friendly](https://youtrack.jetbrains.com/issue/KT-44339)
* ✅ Website: [Make the UI and navigation consistent](https://youtrack.jetbrains.com/issue/KT-46791)

### New items

We've **added** the following items to the roadmap:

* 🆕 Compiler: [Release Kotlin 2.0](https://youtrack.jetbrains.com/issue/KT-60255)
* 🆕 Compiler: [Design and implement new debugging information](https://youtrack.jetbrains.com/issue/KT-60276)
* 🆕 Compiler: [Promote Kotlin/Wasm to Alpha](https://youtrack.jetbrains.com/issue/KT-60277)
* 🆕 Compiler: [Make Kotlin/Wasm suitable for standalone Wasm VMs (without JavaScript support)](https://youtrack.jetbrains.com/issue/KT-60278)
* 🆕 Tooling: [Improve Kotlin build reports](https://youtrack.jetbrains.com/issue/KT-60279)
* 🆕 Library ecosystem: [Provide initial series of `kotlinx-io` releases towards its Stable release](https://youtrack.jetbrains.com/issue/KT-60280)

* ℹ️ Language: [List of all upcoming language features](https://youtrack.jetbrains.com/issue/KT-54620)
* 🆕 Multiplatform: Promote Kotlin Multiplatform Mobile to Stable
* 🆕 Multiplatform: Improve the new Kotlin/Native memory manager robustness and performance and deprecate the old one
* 🆕 Tooling: First public release of K2-based IntelliJ plugin
* 🆕 Tooling: Improve performance and code analysis stability of the current IDE plugin
* 🆕 Tooling: Expose stable compiler arguments in Gradle DSL
* 🆕 Tooling: Kotlin Notebooks IDEA plugin
* 🆕 Libraries: [Improve KDoc experience](https://youtrack.jetbrains.com/issue/KT-55073)
* 🆕 Libraries: [Provide a Kotlin API guide for libraries authors](https://youtrack.jetbrains.com/issue/KT-55077)

### Removed items

We've **removed** the following items from the roadmap:

* ❌ Language: [Support non-local `break` and `continue`](https://youtrack.jetbrains.com/issue/KT-1436)
* ❌ Compiler: [Stabilize JVM-specific experimental features](https://youtrack.jetbrains.com/issue/KT-46770)
* ❌ Library ecosystem: [Stabilize and document `atomicfu`](https://youtrack.jetbrains.com/issue/KT-46786)
* ❌ Library ecosystem: [Improve KDoc experience](https://youtrack.jetbrains.com/issue/KT-55073)
* ❌ Library ecosystem: [Provide a Kotlin API guide for libraries authors](https://youtrack.jetbrains.com/issue/KT-55077)

* ❌ Language: [Research and prototype namespace-based solution for statics and static extensions](https://youtrack.jetbrains.com/issue/KT-11968)
* ❌ Language: [Multiple receivers on extension functions/properties](https://youtrack.jetbrains.com/issue/KT-10468)
* ❌ Language: [Support inline sealed classes](https://youtrack.jetbrains.com/issue/KT-27576)
* ❌ K2 compiler: [Stabilize the K2 Compiler Plugin API](https://youtrack.jetbrains.com/issue/KT-49508)
* ❌ K2 compiler: [Provide Alpha support for Native in the K2 platform](https://youtrack.jetbrains.com/issue/KT-52594)
* ❌ K2 compiler: [Provide Alpha support for JS in the K2 platform](https://youtrack.jetbrains.com/issue/KT-52593)
* ❌ K2 compiler: [Support Multiplatform in the K2 platform](https://youtrack.jetbrains.com/issue/KT-52597)
* ❌ Multiplatform: [Improve stability and robustness of the multiplatform toolchain](https://youtrack.jetbrains.com/issue/KT-49525)
* ❌ Multiplatform: [Improve Android support in Multiplatform projects](https://youtrack.jetbrains.com/issue/KT-52599)
* ❌ Build tools: [Make compilation avoidance support Stable for Gradle](https://youtrack.jetbrains.com/issue/KT-52603)
* ❌ Website: [Improve Kotlin Playground](https://youtrack.jetbrains.com/issue/KT-49536)

> Some items were removed from the roadmap but not dropped completely. In some cases, we've merged previous roadmap items
> with the current ones.
>
{type="note"}

### Items in progress

All other previously identified roadmap items are in progress. You can check their [YouTrack tickets](https://youtrack.jetbrains.com/issues?q=project:%20KT,%20KTIJ%20tag:%20%7BRoadmap%20Item%7D%20%23Unresolved%20)
for updates.