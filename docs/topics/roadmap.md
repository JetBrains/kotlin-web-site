[//]: # (title: Kotlin roadmap)

<table>
    <tr>
        <td><strong>Last modified on</strong></td>
        <td>October 2021</td>
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

![Roadmap board in YouTrack](roadmap-board.png)

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
                <li><a href="https://youtrack.jetbrains.com/issue/KT-26245" target="_blank">🆕 Denotable definitely not-null types</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-11968" target="_blank">🆕 Research and prototype namespace-based solution for statics and static extensions</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-4107" target="_blank">🆕 Design and implement solution for toString on objects</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-48872" target="_blank">🆕 Provide modern and performant replacement for Enum.values()</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-27435" target="_blank">🆕 Allow implementation by delegation to inlined value of inline class</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-27576" target="_blank">🆕 Consider supporting inline sealed classes</a></li>
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
                <li><a href="https://youtrack.jetbrains.com/issue/KFC-88" target="_blank">🆕 !FIX LINK! Stable Compiler Plugin API</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KFC-105" target="_blank">🆕 !FIX LINK! K2/JS investigation</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-46756" target="_blank">Release the new compiler frontend in Alpha for JVM target</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42286" target="_blank">Maintain the current compiler</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-46762" target="_blank">Finalize support for jspecify</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-46762" target="_blank"> !FIX LINK! Scripting improvements</a></li>
            </ul>
        </td>
        <td></td>
    </tr>
    <tr>
        <td><strong>Kotlin/JVM</strong></td>
        <td>
            <ul>
                <li><a href="https://youtrack.jetbrains.com/issue/KFC-131" target="_blank">🆕 !FIX LINK! Release kotlinx-metadata-jvm as Stable</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KFC-160" target="_blank">🆕 !FIX LINK! Fix issues related to inline classes on JVM</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-17699" target="_blank">🆕 Allow private top-level classes or type aliases with same name in different files on JVM</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-25871" target="_blank">🆕 Provide ability to enumerate all direct subclasses of a sealed class at compile-time without reflection</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-47939" target="_blank">🆕 Support method references to functional interface constructors</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-8575" target="_blank">🆕 Support Java synthetic property references</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-46767" target="_blank">Maintain the new JVM IR backend</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-46768" target="_blank">Improve new JVM IR backend compilation time</a></li>
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
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42294" target="_blank">🆕 !FIX LINK! Promote new memory manager to Alpha</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42294" target="_blank">Improve compilation time</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42297" target="_blank">Improve exporting Kotlin code to Objective-C</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42293" target="_blank">Native: provide binary compatibility between incremental releases</a></li>
            </ul>
         </td>
        <td>
            <ul>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-40422" target="_blank">⏸ Support building Kotlin/Native for Mac Catalyst (x86-64 and arm64)</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-40422" target="_blank">⏸ !FIX LINK! Direct interoperability with Swift</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-38876" target="_blank">⏸ Support running Kotlin/Native-produced binaries on Alpine Linux</a></li>
            </ul>
        </td>
    </tr>
    <tr>
        <td><strong>Kotlin Multiplatform</strong></td>
        <td>
            <ul>
                <li><a href="https://youtrack.jetbrains.com/issue/KFC-265" target="_blank">🆕 !FIX LINK! Improve environment setup experience for KMM projects</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KFC-266" target="_blank">🆕 !FIX LINK! Improve DSL for managing Kotlin/Native binary output</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KFC-266" target="_blank">🆕 !FIX LINK! Improve stability and robustness of multiplatform toolchain</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-44329" target="_blank">Improve UX of using Native libraries in Kotlin</a></li>
            </ul>
         </td>
        <td>
            <ul>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-44328" target="_blank">⏸ Improve Kotlin/Native debugging experience</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42466" target="_blank">⏸ Sharing code between JVM and Android</a></li>
            </ul>
        </td>
    </tr>
    <tr>
        <td><strong>IDE</strong></td>
        <td>
            <ul>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-46788" target="_blank">🆕 !FIX LINK! Fast update of compiler/platform versions</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KFC-198" target="_blank">🆕 !FIX LINK! MPP support improvement</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KFC-197" target="_blank">🆕 !FIX LINK! Eclipse plugin stabilization</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42307" target="_blank">Prototype IDE plugin with the new compiler frontend</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42304" target="_blank">Improve IDE performance</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-44330" target="_blank">Improve debugging experience</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-46787" target="_blank">Improve the New Project wizard</a></li>
            </ul>
         </td>
        <td>
            <ul>
                <li>⏸ Advanced tooling that users have in Java but is missing in Kotlin</li>
                <li>⏸ Quality of less frequently used features, except blocking problems</li>
            </ul>
        </td>
    </tr>
    <tr>
        <td><strong>Build tools</strong></td>
        <td>
            <ul>
                <li><a href="https://youtrack.jetbrains.com/issue/KFC-249" target="_blank">🆕 !FIX LINK! Provide better experience with Kotlin Daemon</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KFC-256" target="_blank">🆕 !FIX LINK! Make KAPT work out of the box with latest JDKs</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42309" target="_blank">Improve the performance of Gradle incremental compilation</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-46789" target="_blank">Improve user experience with the Kotlin Gradle plugin</a></li>
            </ul>
         </td>
        <td>
            <ul>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-46788" target="_blank">⏸ Improve the quality of Gradle import</a></li>
            </ul>
        </td>
    </tr>
    <tr>
        <td><strong>Libraries</strong></td>
        <td>
            <ul>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-48998" target="_blank">🆕 Stable release of Dokka</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KFC-280" target="_blank">🆕 !FIX LINK! Initial release of kotlinx-kover and its further productization</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KFC-286" target="_blank">🆕 !FIX LINK! kotlinx-serialization 1.4 release</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KFC-279" target="_blank">🆕 !FIX LINK! kotlinx-coroutines 1.7 release</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-46786" target="_blank">Stabilize and document atomicfu</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42315" target="_blank">Improve kotlinx-datetime library</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42436" target="_blank">Support java.nio.Path extension in the standard library</a></li>
            </ul>
         </td>
        <td>
            <ul>
                <li>⏸ <code>kotlinx-cli</code></li>
                <li>⏸ <code>binary-compatibility-validator</code></li>
                <li>⏸ <code>kotlinx-io</code></li>
            </ul>
        </td>
    </tr>
    <tr>
        <td><strong>Website</strong></td>
        <td>
            <ul>
                <li><a href="https://youtrack.jetbrains.com/issue/KFC-83" target="_blank">🆕 !FIX LINK! Kotlin Playground improvements</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KFC-83" target="_blank">🆕 !FIX LINK! Infrastructure for documentation localization by community</a></li>
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
* ✅ Language: [Support JVM sealed classes](https://youtrack.jetbrains.com/issue/KT-46778)
* ✅ Compiler core: [Work on services for the new compiler to interact with IDE](https://youtrack.jetbrains.com/issue/KT-44318)
* ✅ Kotlin/Native: [Implement safe initialization for top-level properties](https://youtrack.jetbrains.com/issue/KT-46771)
* ✅ Kotlin/Native: [Prototype a new garbage collector](https://youtrack.jetbrains.com/issue/KT-42296)
* ✅ Multiplatform: [Support the Apple Silicon target in the Kotlin Multiplatform tooling](https://youtrack.jetbrains.com/issue/KT-46772)
* ✅ Multiplatform: [Improve dependency management for iOS](https://youtrack.jetbrains.com/issue/KT-42301)
* ✅ IDE: [Move the Kotlin plugin to the IntelliJ platform development infrastructure](https://youtrack.jetbrains.com/issue/KT-42308)
* ✅ Build tools: [Decrease time for opening Gradle projects](https://youtrack.jetbrains.com/issue/KT-42311)
* ✅ Libraries: [Improve kotlinx-serialization (release v1.3.0)](https://youtrack.jetbrains.com/issue/KT-46782)
* ✅ Libraries: [Improve kotlinx-coroutines (release v1.6.0)](https://youtrack.jetbrains.com/issue/KT-46783)
* ✅ Libraries: [Stabilize Duration API in the standard library](https://youtrack.jetbrains.com/issue/KT-46784)
* ✅ Libraries: [Get rid of <code>!!</code> for <code>readLine()</code> in the standard library](https://youtrack.jetbrains.com/issue/KT-46785)
* ✅ Libraries: [Improve usability of multi-threaded coroutines library for Kotlin/Native](https://youtrack.jetbrains.com/issue/KT-42314)
* ✅ Website: [Revamp Kotlin documentation](https://youtrack.jetbrains.com/issue/KT-44338)


### Postponed items

We've decided to **postpone** the following items from the previous roadmap:

* ⏸ Build tools: [Improve the quality of Gradle import](https://youtrack.jetbrains.com/issue/KT-46778)

Other postponed items remain in this state from earlier roadmap versions.

### New items

We've **added** the following items to the roadmap:

* 🆕 Language: [Denotable definitely not-null types](https://youtrack.jetbrains.com/issue/KT-26245)
* 🆕 Language: [Research and prototype namespace-based solution for statics and static extensions](https://youtrack.jetbrains.com/issue/KT-11968)
* 🆕 Language: [Design and implement solution for toString on objects](https://youtrack.jetbrains.com/issue/KT-4107)
* 🆕 Language: [Provide modern and performant replacement for Enum.values()](https://youtrack.jetbrains.com/issue/KT-48872)
* 🆕 Language: [Allow implementation by delegation to inlined value of inline class](https://youtrack.jetbrains.com/issue/KT-27435)
* 🆕 Language: [Consider supporting inline sealed classes](https://youtrack.jetbrains.com/issue/KT-27576)
* 🆕 Compiler core: [!FIX LINK! Stable Compiler Plugin API](https://youtrack.jetbrains.com/issue/KFC-88)
* 🆕 Compiler core: [!FIX LINK! K2/JS investigation](https://youtrack.jetbrains.com/issue/KFC-105)
* 🆕 Kotlin/JVM: [!FIX LINK! Release kotlinx-metadata-jvm as Stable](https://youtrack.jetbrains.com/issue/KFC-131)
* 🆕 Kotlin/JVM: [!FIX LINK! Fix prominent issues related to inline classes on JVM](https://youtrack.jetbrains.com/issue/KFC-160)
* 🆕 Kotlin/JVM: [Allow private top-level classes or type aliases with same name in different files on JVM](https://youtrack.jetbrains.com/issue/KT-17699)
* 🆕 Kotlin/JVM: [Provide ability to enumerate all direct subclasses of a sealed class at compile-time without reflection](https://youtrack.jetbrains.com/issue/KT-25871)
* 🆕 Kotlin/JVM: [Support method references to functional interface constructors](https://youtrack.jetbrains.com/issue/KT-47939)
* 🆕 Kotlin/JVM: [Support Java synthetic property references](https://youtrack.jetbrains.com/issue/KT-8575)
* 🆕 Kotlin/Native: [!FIX LINK! Promote new memory manager to Alpha](https://youtrack.jetbrains.com/issue/KT-8575)
* 🆕 Multiplatform: [!FIX LINK! Improve environment setup experience for KMM projects](https://youtrack.jetbrains.com/issue/KFC-265)
* 🆕 Multiplatform: [!FIX LINK! Improve DSL for managing Kotlin/Native binary output](https://youtrack.jetbrains.com/issue/KFC-266)
* 🆕 Multiplatform: [!FIX LINK! Improve stability and robustness of multiplatform toolchain](https://youtrack.jetbrains.com/issue/KFC-266)
* 🆕 IDE: [!FIX LINK! Fast update of compiler/platform versions](https://youtrack.jetbrains.com/issue/KFC-266)
* 🆕 IDE: [!FIX LINK! MPP support improvement](https://youtrack.jetbrains.com/issue/KFC-198)
* 🆕 IDE: [!FIX LINK! Eclipse plugin stabilization](https://youtrack.jetbrains.com/issue/KFC-197)
* 🆕 Build tools: [!FIX LINK! Provide better experience with Kotlin Daemon](https://youtrack.jetbrains.com/issue/KFC-249)
* 🆕 Build tools: [!FIX LINK! Make KAPT work out of the box with latest JDKs](https://youtrack.jetbrains.com/issue/KFC-256)
* 🆕 Libraries: [Stable release of Dokka](https://youtrack.jetbrains.com/issue/KT-48998)
* 🆕 Libraries: [!FIX LINK! Initial release of kotlinx-kover and its further productization](https://youtrack.jetbrains.com/issue/KFC-280)
* 🆕 Libraries: [!FIX LINK! kotlinx-serialization 1.4 release](https://youtrack.jetbrains.com/issue/KFC-286)
* 🆕 Libraries: [!FIX LINK! kotlinx-coroutines 1.7 release](https://youtrack.jetbrains.com/issue/KFC-279)
* 🆕 Website: [!FIX LINK! Kotlin Playground improvements](https://youtrack.jetbrains.com/issue/KFC-83)
* 🆕 Website: [!FIX LINK! Infrastructure for documentation localization by community](https://youtrack.jetbrains.com/issue/KFC-83)


### Removed items

We've **removed** the following items from the roadmap:

* ❌ Kotlin/Native: Interoperability with C++
* ❌ Multiplatform: [Improve Gradle and Compiler error messages](https://youtrack.jetbrains.com/issue/KT-42303)
* ❌ Build tools: Improvements in Kotlin Maven support
* ❌ Libraries: Any new multiplatform libraries


### Items in progress

All other previously identified roadmap items are in progress.
You can check their [YouTrack tickets](https://youtrack.jetbrains.com/issues/KT?q=Type:%20%7BRoadmap%20Item%7D%20state:%20%7BIn%20Progress%7D%20) for updates.
