[//]: # (title: Kotlin roadmap)

<table>
    <tr>
        <td><strong>Last modified on</strong></td>
        <td>November 2021</td>
    </tr>
    <tr>
        <td><strong>Next update</strong></td>
        <td><strong>April 2022</strong></td>
    </tr>
</table>

Welcome to the Kotlin roadmap! Get a sneak peek into the priorities of the Kotlin Team.

## Key priorities

The goal of this roadmap is to give you a big picture. Here’s a list of our key priorities – the areas we are investing the most effort into:

* **Fast turnaround**: making the change-test-debug cycle really fast.
* **New compiler**: a rewrite of the Kotlin compiler optimized for speed, parallelism, and unification. Later we will also work on pluggability.
* **Fast and smooth IDE**: improving the stability and performance of the Kotlin IDE.
* **Kotlin for JVM server-side development**: expanding support for server-side use cases across the Kotlin ecosystem.
* **Kotlin Multiplatform Mobile**: improving the user experience and feature set for sharing code on mobile platforms.

## Kotlin roadmap by subsystem

To view the biggest projects we're working on, visit the [YouTrack board](https://youtrack.jetbrains.com/agiles/153-1251/current) or the [Roadmap details](#roadmap-details) table.

If you have any questions or feedback about the roadmap or the items on it, feel free to post them to [YouTrack tickets](https://youtrack.jetbrains.com/issues/KT?q=%23%7BRoadmap%20Item%7D%20) or in the [#kotlin-roadmap](https://kotlinlang.slack.com/archives/C01AAJSG3V4) channel of Kotlin Slack ([request an invite](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)).

### YouTrack board

Visit the [roadmap board in our issue tracker YouTrack](https://youtrack.jetbrains.com/agiles/153-1251/current) ![YouTrack](youtrack-logo.png){width=30}{type="joined"}

![Roadmap board in YouTrack](roadmap-board.png){width=700}

### Roadmap details

<table>
    <tr>
        <th>Subsystem</th>
        <th>In focus now</th>
        <th>Postponed for later</th>
    </tr>
    <tr>
        <td><strong>Language</strong></td>
        <td>
            <ul>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-11968" target="_blank">🆕 Research and prototype namespace-based solution for statics and static extensions</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-27576" target="_blank">🆕 Consider supporting inline sealed classes</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-26245" target="_blank">🆕 Allow denotable definitely not-null types</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-4107" target="_blank">🆕 Design and implement solution for toString on objects</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-48872" target="_blank">🆕 Provide modern and performant replacement for Enum.values()</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-27435" target="_blank">🆕 Allow implementation by delegation to inlined value of inline class</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-22956" target="_blank">Release OptIn annotations</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-45618" target="_blank">Release builder inference</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-12380" target="_blank">Support sealed (exhaustive) whens</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42435" target="_blank">Prototype multiple receivers</a></li>
            </ul>
        </td>
        <td></td>
    </tr>
    <tr>
        <td><strong>Compiler core</strong></td>
        <td>
            <ul>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-49508" target="_blank">🆕 Stabilize the Compiler Plugin API</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-49510" target="_blank">🆕 Investigate JS backend for the K2 compiler</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-46756" target="_blank">Release the K2/JVM compiler in Alpha</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42286" target="_blank">Maintain the current compiler</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-46762" target="_blank">Finalize support for jspecify</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-49511" target="_blank">Improve Kotlin scripting</a></li>
            </ul>
        </td>
        <td></td>
    </tr>
    <tr>
        <td><strong>Kotlin/JVM</strong></td>
        <td>
            <ul>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-49513" target="_blank">🆕 Release <code>kotlinx-metadata-jvm</code> as Stable</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-49514" target="_blank">🆕 Fix issues related to inline classes on the JVM</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-17699" target="_blank">🆕 Allow private top-level classes or type aliases with same name in different files on JVM</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-25871" target="_blank">🆕 Provide ability to enumerate all direct subclasses of a sealed class at compile-time without reflection</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-47939" target="_blank">🆕 Support method references to functional interface constructors</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-8575" target="_blank">🆕 Support Java synthetic property references</a></li>
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
                <li><a href="https://youtrack.jetbrains.com/issue/KT-44319" target="_blank">JS IR BE: Add an ability to generate separate JS files for each module</a></li>                
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42291" target="_blank">Maintain the old JS backend by fixing critical bugs</a></li>
            </ul>
         </td>
        <td>
            <ul>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-8373" target="_blank">⏸ JS: support ES6 as compilation target</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42290" target="_blank">⏸ Improve Dukat support</a></li>
            </ul>
        </td>
    </tr>
    <tr>
        <td><strong>Kotlin/Wasm</strong></td>
        <td>
            <ul>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-46773" target="_blank">Implement an experimental version of Kotlin/Wasm compiler backend</a></li>
            </ul>
         </td>
        <td>Note: Wasm support in <a href="https://kotlinlang.org/docs/reference/native-overview.html" target="_blank">Kotlin/Native</a> (through LLVM) will be deprecated and removed</td>
    </tr>
    <tr>
        <td><strong>Kotlin/Native</strong></td>
        <td>
            <ul>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-49520" target="_blank">🆕 Promote new memory manager to Alpha</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42294" target="_blank">Improve compilation time</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42297" target="_blank">Improve exporting Kotlin code to Objective-C</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42293" target="_blank">Native: provide binary compatibility between incremental releases</a></li>
            </ul>
         </td>
        <td>
            <ul>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-40422" target="_blank">⏸ Support building Kotlin/Native for Mac Catalyst (x86-64 and arm64)</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-49521" target="_blank">⏸ Support direct interoperability with Swift</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-38876" target="_blank">⏸ Support running Kotlin/Native-produced binaries on Alpine Linux</a></li>
            </ul>
        </td>
    </tr>
    <tr>
        <td><strong>Kotlin Multiplatform</strong></td>
        <td>
            <ul>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-49523" target="_blank">🆕 Improve environment setup experience for KMM projects</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-49524" target="_blank">🆕 Improve DSL for managing Kotlin/Native binary output</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-49525" target="_blank">🆕 Improve stability and robustness of the multiplatform toolchain</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-44329" target="_blank">Improve UX of using Native libraries in Kotlin</a></li>
            </ul>
         </td>
        <td>
            <ul>
                <li><a href="https://youtrack.jetbrains.com/issue/KTIJ-18571" target="_blank">⏸ Improve Kotlin/Native debugging experience</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42466" target="_blank">⏸ Implement code sharing between JVM and Android</a></li>
            </ul>
        </td>
    </tr>
    <tr>
        <td><strong>IDE</strong></td>
        <td>
            <ul>
                <li><a href="https://youtrack.jetbrains.com/issue/KTIJ-20044" target="_blank">🆕 Make update of compiler/platform versions faster</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTIJ-20045" target="_blank">🆕 Improve MPP support</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTIJ-20046" target="_blank">🆕 Stabilize Eclipse plugin</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTIJ-18195" target="_blank">Prototype the IDE plugin with the new compiler frontend</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTIJ-18174" target="_blank">Improve IDE performance</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTIJ-18572" target="_blank">Improve debugging experience</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTIJ-18809" target="_blank">Improve the New Project wizard</a></li>
            </ul>
         </td>
        <td>
            <ul>
                <li><a href="https://youtrack.jetbrains.com/issue/KTIJ-20047" target="_blank">⏸ Implement advanced tooling that users have in Java but is missing in Kotlin</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KTIJ-20048" target="_blank">⏸ Improve the quality of less frequently used features</a></li>
            </ul>
        </td>
    </tr>
    <tr>
        <td><strong>Build tools</strong></td>
        <td>
            <ul>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-49532" target="_blank">🆕 Provide better experience with Kotlin Daemon</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-49533" target="_blank">🆕 Make kapt work out of the box with latest JDKs</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42309" target="_blank">Improve the performance of Gradle incremental compilation</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-46789" target="_blank">Improve the user experience with the Kotlin Gradle plugin</a></li>
            </ul>
         </td>
        <td>
            <ul>
                <li><a href="https://youtrack.jetbrains.com/issue/KTIJ-18810" target="_blank">⏸ Improve the quality of Gradle import</a></li>
            </ul>
        </td>
    </tr>
    <tr>
        <td><strong>Libraries</strong></td>
        <td>
            <ul>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-48998" target="_blank">🆕 Release Dokka as Stable</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-49527" target="_blank">🆕 Launch <code>kotlinx-kover</code> and productize it further</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-49528" target="_blank">🆕 Release <code>kotlinx-serialization</code> 1.4</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-49529" target="_blank">🆕 Release <code>kotlinx-coroutines</code> 1.7</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-46786" target="_blank">Stabilize and document <code>atomicfu</code></a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42315" target="_blank">Improve <code>kotlinx-datetime</code> library</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42436" target="_blank">Support <code>java.nio.Path</code> extension in the standard library</a></li>
            </ul>
         </td>
        <td></td>
    </tr>
    <tr>
        <td><strong>Website</strong></td>
        <td>
            <ul>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-49536" target="_blank">🆕 Improve Kotlin Playground</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-49537" target="_blank">🆕 Provide infrastructure for documentation localization by community</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-44339" target="_blank">Make the Kotlin website mobile friendly</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-46791" target="_blank">Make the UI and navigation consistent</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-46792" target="_blank">Update community graphic assets to the new Kotlin visual style</a></li>
            </ul>
        </td>
        <td></td>
    </tr>
</table>

> * This roadmap is not an exhaustive list of all things the team is working on, only the biggest projects.
> * There’s no commitment to delivering specific features or fixes in specific versions.
> * It lists some things that are postponed and will NOT get the team’s attention in the nearest future.
> * We will adjust our priorities as we go and update the roadmap approximately every six months.
> 
{type="note"}

## What's changed since May 2021

### Completed items

We've **completed** the following items from the previous roadmap:

* ✅ Language: [Support programmatic creation of annotation class instances](https://youtrack.jetbrains.com/issue/KT-45395)
* ✅ Language: [Stabilize typeOf](https://youtrack.jetbrains.com/issue/KT-45396)
* ✅ Language: [Allow repeating annotations with runtime retention when compiling under Java 8](https://youtrack.jetbrains.com/issue/KT-12794)
* ✅ Language: [Support annotations on class type parameters](https://youtrack.jetbrains.com/issue/KT-43714)
* ✅ Language: [Improve type inference in corner cases for popular Java APIs](https://youtrack.jetbrains.com/issue/KT-40804)
* ✅ Language: [Support for JVM sealed classes](https://youtrack.jetbrains.com/issue/KT-46778)
* ✅ Compiler core: [Inferring types based on self upper bounds](https://youtrack.jetbrains.com/issue/KT-40804)
* ✅ Compiler core: [Work on services for the new compiler to interact with IDE](https://youtrack.jetbrains.com/issue/KT-44318)
* ✅ Kotlin/Native: [Implement safe initialization for top-level properties](https://youtrack.jetbrains.com/issue/KT-46771)
* ✅ Kotlin/Native: [Prototype a new garbage collector](https://youtrack.jetbrains.com/issue/KT-42296)
* ✅ Multiplatform: [Support the Apple silicon target in the Kotlin Multiplatform tooling](https://youtrack.jetbrains.com/issue/KT-46772)
* ✅ Multiplatform: [Improve dependency management for iOS](https://youtrack.jetbrains.com/issue/KT-42301)
* ✅ IDE: [Move the Kotlin plugin to the IntelliJ platform development infrastructure](https://youtrack.jetbrains.com/issue/KTIJ-18196)
* ✅ Build tools: [Decrease time for opening Gradle projects](https://youtrack.jetbrains.com/issue/KT-42311)
* ✅ Libraries: [Improve `kotlinx-serialization` (release 1.3.0)](https://youtrack.jetbrains.com/issue/KT-46782)
* ✅ Libraries: [Improve `kotlinx-coroutines` (release 1.6.0)](https://youtrack.jetbrains.com/issue/KT-46783)
* ✅ Libraries: [Stabilize Duration API in the standard library](https://youtrack.jetbrains.com/issue/KT-46784)
* ✅ Libraries: [Get rid of `!!` after `readLine()` in the standard library](https://youtrack.jetbrains.com/issue/KT-46785)
* ✅ Libraries: [Improve usability of multi-threaded coroutines library for Kotlin/Native](https://youtrack.jetbrains.com/issue/KT-42314)
* ✅ Website: [Revamp Kotlin documentation](https://youtrack.jetbrains.com/issue/KT-44338)

### Postponed items

We've decided to **postpone** the following items from the previous roadmap:

* ⏸ Kotlin/Native: [Support building Kotlin/Native for Mac Catalyst (x86-64 and arm64)](https://youtrack.jetbrains.com/issue/KT-40442)
* ⏸ Kotlin/Native: [Support direct interoperability with Swift](https://youtrack.jetbrains.com/issue/KT-49521)
* ⏸ Kotlin/Native: [Support running Kotlin/Native-produced binaries on Alpine Linux](https://youtrack.jetbrains.com/issue/KT-38876)
* ⏸ Kotlin/JS: [Improve Dukat support](https://youtrack.jetbrains.com/issue/KT-42290)
* ⏸ Kotlin/JS: [JS: support ES6 as compilation target](https://youtrack.jetbrains.com/issue/KT-8373)
* ⏸ Multiplatform: [Improve Kotlin/Native debugging experience](https://youtrack.jetbrains.com/issue/KTIJ-18571)
* ⏸ Multiplatform: [Implement code sharing between JVM and Android](https://youtrack.jetbrains.com/issue/KT-42466)
* ⏸ IDE: [Implement advanced tooling that users have in Java but is missing in Kotlin](https://youtrack.jetbrains.com/issue/KTIJ-20047)
* ⏸ IDE: [Improve the quality of less frequently used features](https://youtrack.jetbrains.com/issue/KTIJ-20048)
* ⏸ Build tools: [Improve the quality of Gradle import](https://youtrack.jetbrains.com/issue/KTIJ-18810)

Other postponed items remain in this state from earlier roadmap versions.

### New items

We've **added** the following items to the roadmap:

* 🆕 Language: [Research and prototype namespace-based solution for statics and static extensions](https://youtrack.jetbrains.com/issue/KT-11968)
* 🆕 Language: [Consider supporting inline sealed classes](https://youtrack.jetbrains.com/issue/KT-27576)
* 🆕 Language: [Allow denotable definitely not-null types](https://youtrack.jetbrains.com/issue/KT-26245)
* 🆕 Language: [Design and implement solution for toString on objects](https://youtrack.jetbrains.com/issue/KT-4107)
* 🆕 Language: [Provide modern and performant replacement for Enum.values()](https://youtrack.jetbrains.com/issue/KT-48872)
* 🆕 Language: [Allow implementation by delegation to inlined value of inline class](https://youtrack.jetbrains.com/issue/KT-27435)
* 🆕 Compiler core: [Stabilize the Compiler Plugin API](https://youtrack.jetbrains.com/issue/KT-49508)
* 🆕 Compiler core: [Investigate JS backend for the K2 compiler](https://youtrack.jetbrains.com/issue/KT-49510)
* 🆕 Kotlin/JVM: [Release `kotlinx-metadata-jvm` as Stable](https://youtrack.jetbrains.com/issue/KT-49513)
* 🆕 Kotlin/JVM: [Fix issues related to inline classes on the JVM](https://youtrack.jetbrains.com/issue/KT-49514)
* 🆕 Kotlin/JVM: [Allow private top-level classes or type aliases with same name in different files on JVM](https://youtrack.jetbrains.com/issue/KT-17699)
* 🆕 Kotlin/JVM: [Provide ability to enumerate all direct subclasses of a sealed class at compile-time without reflection](https://youtrack.jetbrains.com/issue/KT-25871)
* 🆕 Kotlin/JVM: [Support method references to functional interface constructors](https://youtrack.jetbrains.com/issue/KT-47939)
* 🆕 Kotlin/JVM: [Support Java synthetic property references](https://youtrack.jetbrains.com/issue/KT-8575)
* 🆕 Kotlin/Native: [Promote new memory manager to Alpha](https://youtrack.jetbrains.com/issue/KT-49520)
* 🆕 Multiplatform: [Improve environment setup experience for KMM projects](https://youtrack.jetbrains.com/issue/KT-49523)
* 🆕 Multiplatform: [Improve DSL for managing Kotlin/Native binary output](https://youtrack.jetbrains.com/issue/KT-49524)
* 🆕 Multiplatform: [Improve stability and robustness of the multiplatform toolchain](https://youtrack.jetbrains.com/issue/KT-49525)
* 🆕 IDE: [Make update of compiler/platform versions faster](https://youtrack.jetbrains.com/issue/KTIJ-20044)
* 🆕 IDE: [Improve MPP support](https://youtrack.jetbrains.com/issue/KTIJ-20045)
* 🆕 IDE: [Stabilize Eclipse plugin](https://youtrack.jetbrains.com/issue/KTIJ-20046)
* 🆕 Build tools: [Provide better experience with Kotlin Daemon](https://youtrack.jetbrains.com/issue/KT-49532)
* 🆕 Build tools: [Make kapt work out of the box with latest JDKs](https://youtrack.jetbrains.com/issue/KT-49533)
* 🆕 Libraries: [Release Dokka as Stable](https://youtrack.jetbrains.com/issue/KT-48998)
* 🆕 Libraries: [Launch `kotlinx-kover` and productize it further](https://youtrack.jetbrains.com/issue/KT-49527)
* 🆕 Libraries: [Release `kotlinx-serialization` 1.4](https://youtrack.jetbrains.com/issue/KT-49528)
* 🆕 Libraries: [Release `kotlinx-coroutines` 1.7](https://youtrack.jetbrains.com/issue/KT-49529)
* 🆕 Website: [Improve Kotlin Playground](https://youtrack.jetbrains.com/issue/KT-49536)
* 🆕 Website: [Provide infrastructure for documentation localization by community](https://youtrack.jetbrains.com/issue/KT-49537)

### Removed items

We've **removed** the following items from the roadmap:

* ❌ Kotlin/Native: Support interoperability with C++
* ❌ Multiplatform: [Improve Gradle and Compiler error messages](https://youtrack.jetbrains.com/issue/KT-42303)
* ❌ Build tools: Improve Kotlin Maven support
* ❌ Libraries: Implement any new multiplatform libraries
* ❌ Libraries: `kotlinx-cli`
* ❌ Libraries: `binary-compatibility-validator`
* ❌ Libraries: `kotlinx-io`

### Items in progress

All other previously identified roadmap items are in progress. You can check their [YouTrack tickets](https://youtrack.jetbrains.com/issues?q=project:%20KT,%20KTIJ%20tag:%20%7BRoadmap%20Item%7D%20%23Unresolved%20)
for updates.
