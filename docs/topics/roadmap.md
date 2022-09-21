[//]: # (title: Kotlin roadmap)

<table>
    <tr>
        <td><strong>Last modified on</strong></td>
        <td>June 2022</td>
    </tr>
    <tr>
        <td><strong>Next update</strong></td>
        <td><strong>November 2022</strong></td>
    </tr>
</table>

Welcome to the Kotlin roadmap! Get a sneak peek into the priorities of the Kotlin Team.

## Key priorities

The goal of this roadmap is to give you a big picture. Here's a list of our key priorities – the areas we are investing the most effort into:

* **Fast turnaround**: making the change-test-debug cycle really fast.
* **New compiler**: a rewrite of the Kotlin compiler optimized for speed, parallelism, and unification. Later we will also work on pluggability.
* **Fast and smooth IDE**: improving the stability and performance of the Kotlin plugin.
* **Kotlin for JVM server-side development**: expanding support for server-side use cases across the Kotlin ecosystem.
* **Kotlin Multiplatform Mobile**: improving the user experience and feature set for sharing code on mobile platforms.

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
            <ul>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-15613" target="_blank">🆕 Introduce special syntax for <code>until</code> operator</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-11968" target="_blank">Research and prototype namespace-based solution for statics and static extensions</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-27576" target="_blank">Support inline sealed classes</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-4107" target="_blank">Design and implement solution for toString on objects</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-48872" target="_blank">Provide modern and performant replacement for Enum.values()</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-10468" target="_blank">Multiple receivers on extension functions/properties</a></li>
            </ul>
        </td>
        <td></td>
    </tr>
    <tr>
        <td><strong>Compiler core</strong></td>
        <td>
            <ul>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42286" target="_blank">Maintain the current compiler</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-49511" target="_blank">Improve Kotlin scripting</a></li>
            </ul>
        </td>
    </tr>
    <tr>
        <td><strong>K2 compiler</strong></td>
        <td>
            <ul>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-52604" target="_blank">🆕 Release K2 Beta</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-52594" target="_blank">🆕 Provide Alpha support for Native in the K2 platform</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-52593" target="_blank">🆕 Provide Alpha support for JS in the K2 platform</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-52597" target="_blank">🆕 Support Multiplatform in the K2 platform</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-49508" target="_blank">Stabilize the K2 Compiler Plugin API</a></li>
            </ul>
        </td>
        <td></td>
    </tr>
    <tr>
        <td><strong>Kotlin/JVM</strong></td>
        <td>
            <ul>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-49682" target="_blank">Support kapt in JVM IR</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-49514" target="_blank">Fix issues related to inline classes on the JVM</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-46767" target="_blank">Maintain the new JVM IR backend</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-46768" target="_blank">Improve the new JVM IR backend compilation time</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-46770" target="_blank">Stabilize JVM-specific experimental features</a></li>
            </ul>
         </td>
        <td></td>
    </tr>
    <tr>
        <td><strong>Kotlin/JS</strong></td>
        <td>
            <ul>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42289" target="_blank">Make the new JS IR backend Stable</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42291" target="_blank">Maintain the old JS backend by fixing critical bugs</a></li>
            </ul>
         </td>
    </tr>
    <tr>
        <td><strong>Kotlin/Wasm</strong></td>
        <td>
            <ul>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-46773" target="_blank">Implement an experimental version of Kotlin/Wasm compiler backend</a></li>
            </ul>
            <p>Note: Wasm support in <a href="https://kotlinlang.org/docs/reference/native-overview.html" target="_blank">Kotlin/Native</a> (through LLVM) will be deprecated and removed</p>
         </td>
    </tr>
    <tr>
        <td><strong>Kotlin/Native</strong></td>
        <td>
            <ul>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-52595" target="_blank">🆕 Promote new memory manager to Beta and enable it by default</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42294" target="_blank">Improve compilation time</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42297" target="_blank">Improve exporting Kotlin code to Objective-C</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42293" target="_blank">Native: provide binary compatibility between incremental releases</a></li>
            </ul>
         </td>
    </tr>
    <tr>
        <td><strong>Kotlin Multiplatform</strong></td>
        <td>
            <ul>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-52596" target="_blank">🆕 Promote Kotlin Multiplatform Mobile to Beta</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-52599" target="_blank">🆕 Improve Android support in Multiplatform projects</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-52600" target="_blank">🆕 Stabilize klib</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-49525" target="_blank">Improve stability and robustness of the multiplatform toolchain</a></li>
            </ul>
         </td>
    </tr>
    <tr>
        <td><strong>IDE</strong></td>
        <td>
            <ul>
                <li><a href="https://youtrack.jetbrains.com/issue/KTIJ-21906" target="_blank">🆕 Stabilize code analysis</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTIJ-20044" target="_blank">Make update of compiler/platform versions faster</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTIJ-20045" target="_blank">Improve Multiplatform project support</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTIJ-20046" target="_blank">Stabilize Eclipse plugin</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTIJ-18195" target="_blank">Prototype the IDE plugin with the new compiler frontend</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTIJ-18174" target="_blank">Improve IDE performance</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTIJ-18572" target="_blank">Improve debugging experience</a></li>
            </ul>
         </td>
    </tr>
    <tr>
        <td><strong>Build tools</strong></td>
        <td>
            <ul>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-52603" target="_blank">🆕 Make compilation avoidance support Stable for Gradle</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-49532" target="_blank">Provide better experience with Kotlin Daemon</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42309" target="_blank">Improve the performance of Gradle incremental compilation</a></li>
            </ul>
         </td>
    </tr>
    <tr>
        <td><strong>Libraries</strong></td>
        <td>
            <ul>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-52601" target="_blank">🆕 Continue development and stabilization of standard library</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-48011" target="_blank">Release <code>kotlinx-metadata-jvm</code> as Stable</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-48998" target="_blank">Release Dokka as Stable</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-49527" target="_blank">Launch <code>kotlinx-kover</code> and productize it further</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-49528" target="_blank">Release <code>kotlinx-serialization</code> 1.4</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-49529" target="_blank">Release <code>kotlinx-coroutines</code> 1.7</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-46786" target="_blank">Stabilize and document <code>atomicfu</code></a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42315" target="_blank">Improve <code>kotlinx-datetime</code> library</a></li>
            </ul>
         </td>
    </tr>
    <tr>
        <td><strong>Website</strong></td>
        <td>
            <ul>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-44339" target="_blank">Make the Kotlin website mobile friendly</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-46791" target="_blank">Make the UI and navigation consistent</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-49536" target="_blank">Improve Kotlin Playground</a></li>
            </ul>
        </td>
        <td></td>
    </tr>
</table>

> * This roadmap is not an exhaustive list of all things the team is working on, only the biggest projects.
> * There's no commitment to delivering specific features or fixes in specific versions.
> * We will adjust our priorities as we go and update the roadmap approximately every six months.
> 
{type="note"}

## What's changed since November 2021

### Completed items

We've **completed** the following items from the previous roadmap:

* ✅ Language: [Allow denotable definitely not-null types](https://youtrack.jetbrains.com/issue/KT-26245)
* ✅ Language: [Allow implementation by delegation to inlined value of inline class](https://youtrack.jetbrains.com/issue/KT-27435)
* ✅ Language: [Release OptIn annotations](https://youtrack.jetbrains.com/issue/KT-22956)
* ✅ Language: [Release builder inference](https://youtrack.jetbrains.com/issue/KT-45618)
* ✅ Language: [Support sealed (exhaustive) whens](https://youtrack.jetbrains.com/issue/KT-12380)
* ✅ Language: [Prototype multiple receivers](https://youtrack.jetbrains.com/issue/KT-42435)
* ✅ Compiler core: [Finalize support for jspecify](https://youtrack.jetbrains.com/issue/KT-46762)
* ✅ K2 compiler: [Release the K2/JVM compiler in Alpha](https://youtrack.jetbrains.com/issue/KT-46756)
* ✅ K2 compiler: [Implement support for basic compile-time evaluation](https://youtrack.jetbrains.com/issue/KT-49303)
* ✅ Kotlin/JVM: [Support method references to functional interface constructors](https://youtrack.jetbrains.com/issue/KT-47939)
* ✅ Kotlin/JS: [JS IR BE: Add an ability to generate separate JS files for each module](https://youtrack.jetbrains.com/issue/KT-44319)
* ✅ Kotlin/Native: [Promote new memory manager to Alpha](https://youtrack.jetbrains.com/issue/KT-49520)
* ✅ Multiplatform: [Improve UX of using Native libraries in Kotlin](https://youtrack.jetbrains.com/issue/KT-44329)
* ✅ Multiplatform: [Improve environment setup experience for KMM projects](https://youtrack.jetbrains.com/issue/KT-49523)
* ✅ Multiplatform: [Improve DSL for managing Kotlin/Native binary output](https://youtrack.jetbrains.com/issue/KT-49524)
* ✅ IDE: [Improve the New Project wizard](https://youtrack.jetbrains.com/issue/KTIJ-18809)
* ✅ Build tools: [Make kapt work out of the box with latest JDKs](https://youtrack.jetbrains.com/issue/KT-49533)
* ✅ Build tools: [Improve the user experience with the Kotlin Gradle plugin](https://youtrack.jetbrains.com/issue/KT-46789)
* ✅ Website: [Update community graphic assets to the new Kotlin visual style](https://youtrack.jetbrains.com/issue/KT-46792)

### New items

We've **added** the following items to the roadmap:

* 🆕 Language: [Introduce special syntax for `until` operator](https://youtrack.jetbrains.com/issue/KT-15613)
* 🆕 K2 compiler: [Release K2 Beta](https://youtrack.jetbrains.com/issue/KT-52604)
* 🆕 K2 compiler: [Provide Alpha support for Native in the K2 platform](https://youtrack.jetbrains.com/issue/KT-52594)
* 🆕 K2 compiler: [Provide Alpha support for JS in the K2 platform](https://youtrack.jetbrains.com/issue/KT-52593)
* 🆕 K2 compiler: [Support Multiplatform in the K2 platform](https://youtrack.jetbrains.com/issue/KT-52597)
* 🆕 Kotlin/Native: [Promote new memory manager to Beta and enable it by default](https://youtrack.jetbrains.com/issue/KT-52595)
* 🆕 Multiplatform: [Promote Kotlin Multiplatform Mobile to Beta](https://youtrack.jetbrains.com/issue/KT-52596)
* 🆕 Multiplatform: [Improve Android support in Multiplatform projects](https://youtrack.jetbrains.com/issue/KT-52599)
* 🆕 Multiplatform: [Stabilize klib](https://youtrack.jetbrains.com/issue/KT-52600/)
* 🆕 IDE: [Stabilize code analysis](https://youtrack.jetbrains.com/issue/KTIJ-21906)
* 🆕 Libraries: [Continue development and stabilization of standard library](https://youtrack.jetbrains.com/issue/KT-52601)
* 🆕 Build tools: [Make compilation avoidance support Stable for Gradle](https://youtrack.jetbrains.com/issue/KT-52603)

### Removed items

We've **removed** the following items from the roadmap:

* ❌ Language: [Provide equals operator with precise signature for inline classes](https://youtrack.jetbrains.com/issue/KT-24874)
* ❌ Kotlin/JVM: [Allow private top-level classes or type aliases with same name in different files on JVM](https://youtrack.jetbrains.com/issue/KT-17699)
* ❌ Kotlin/JVM: [Provide ability to enumerate all direct subclasses of a sealed class at compile-time without reflection](https://youtrack.jetbrains.com/issue/KT-25871)
* ❌ Kotlin/JVM: [Support Java synthetic property references](https://youtrack.jetbrains.com/issue/KT-8575)
* ❌ Kotlin/JS: [JS: support ES6 as compilation target](https://youtrack.jetbrains.com/issue/KT-8373)
* ❌ Kotlin/JS: [Improve Dukat support](https://youtrack.jetbrains.com/issue/KT-42290)
* ❌ Kotlin/Native: [Support building Kotlin/Native for Mac Catalyst (x86-64 and arm64)](https://youtrack.jetbrains.com/issue/KT-40442)
* ❌ Kotlin/Native: [Support direct interoperability with Swift](https://youtrack.jetbrains.com/issue/KT-49521)
* ❌ Kotlin/Native: [Support running Kotlin/Native-produced binaries on Alpine Linux](https://youtrack.jetbrains.com/issue/KT-38876)
* ❌ IDE: [Implement advanced tooling that users have in Java but is missing in Kotlin](https://youtrack.jetbrains.com/issue/KTIJ-20047)
* ❌ IDE: [Improve the quality of less frequently used features](https://youtrack.jetbrains.com/issue/KTIJ-20048)
* ❌ Build tools: [Improve the quality of Gradle import](https://youtrack.jetbrains.com/issue/KT-46788)
* ❌ Website: [Provide infrastructure for documentation localization by community](https://youtrack.jetbrains.com/issue/KT-49537)

### Items in progress

All other previously identified roadmap items are in progress. You can check their [YouTrack tickets](https://youtrack.jetbrains.com/issues?q=project:%20KT,%20KTIJ%20tag:%20%7BRoadmap%20Item%7D%20%23Unresolved%20)
for updates.
