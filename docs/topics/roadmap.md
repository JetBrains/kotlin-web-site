[//]: # (title: Kotlin roadmap)

<table>
    <tr>
        <td><strong>Last modified on</strong></td>
        <td>December 2022</td>
    </tr>
    <tr>
        <td><strong>Next update</strong></td>
        <td><strong>June 2023</strong></td>
    </tr>
</table>

Welcome to the Kotlin roadmap! Get a sneak peek into the priorities of the Kotlin Team.

## Key priorities

The goal of this roadmap is to give you a big picture. Here's a list of our key projects – the most important things we focus on delivering:

* **K2 compiler**: a rewrite of the Kotlin compiler optimized for speed, parallelism, and unification. It will also let us introduce many anticipated language features.
* **K2-based IntelliJ plugin**: much faster code completion, highlighting, and search, together with a more stable code analysis.
* **Kotlin Multiplatform Mobile**: promote the technology to Stable by improving the toolchain stability and documentation, and ensuring compatibility guarantees.
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
            <ul>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-15613" target="_blank">Introduce special syntax for <code>until</code> operator</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-48872" target="_blank">Provide modern and performant replacement for <code>Enum.values()</code></a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-1436" target="_blank">Support non-local <code>break</code> and <code>continue</code></a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-4107" target="_blank">Design and implement solution for <code>toString</code> on objects</a></li>
            </ul>
        </td>
    </tr>
    <tr>
        <td><strong>Compiler</strong></td>
        <td>
            <ul>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-52604" target="_blank">Release K2 Beta</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-49514" target="_blank">Fix issues related to inline classes on the JVM</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-46770" target="_blank">Stabilize JVM-specific experimental features</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-46773" target="_blank">Implement an experimental version of Kotlin/Wasm compiler backend</a></li>
            </ul>
        </td>
    </tr>
    <tr>
        <td><strong>Multiplatform</strong></td>
        <td>
            <ul>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-55513">Promote Kotlin Multiplatform Mobile to Stable</a></li> 
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-55512">Improve the new Kotlin/Native memory manager robustness and performance and deprecate the old one</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-52600" target="_blank">Stabilize klib: keep binary compatibility easier for library authors</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42297" target="_blank">Improve exporting Kotlin code to Objective-C</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42294" target="_blank">Improve Kotlin/Native compilation time</a></li>
            </ul>
         </td>
    </tr>
    <tr>
        <td><strong>Tooling</strong></td>
        <td>
            <ul>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTIJ-23988">First public release of K2-based IntelliJ plugin</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTIJ-23989">Improve performance and code analysis stability of the current IDE plugin</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-55515">Expose stable compiler arguments in Gradle DSL</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KTIJ-23990">Release the Experimental version of the Kotlin Notebooks IJ IDEA plugin</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-49511" target="_blank">Improve Kotlin scripting and experience with <code>.gradle.kts</code></a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-49532" target="_blank">Provide better experience with Kotlin Daemon</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42309" target="_blank">Improve the performance of Gradle incremental compilation</a></li>
            </ul>
         </td>
    </tr>
    <tr>
        <td><strong>Library ecosystem</strong></td>
        <td>
            <ul>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-55073" target="_blank">Improve KDoc experience</a></li>
                <li>🆕 <a href="https://youtrack.jetbrains.com/issue/KT-55077" target="_blank">Provide a Kotlin API guide for libraries authors</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-48011" target="_blank">Release <code>kotlinx-metadata-jvm</code> as Stable</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-49527" target="_blank">Stabilize <code>kotlinx-kover</code></a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-49529" target="_blank">Release <code>kotlinx-coroutines</code> 1.7</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-46786" target="_blank">Stabilize and document <code>atomicfu</code></a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42315" target="_blank">Improve <code>kotlinx-datetime</code> library</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-52601" target="_blank">Continue to develop and stabilize the standard library</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-48998" target="_blank">Release Dokka as Stable</a></li>
            </ul>
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