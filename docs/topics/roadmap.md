[//]: # (title: Kotlin roadmap)

<table>
    <tr>
        <td><strong>Last modified on</strong></td>
        <td>May 2021</td>
    </tr>
    <tr>
        <td><strong>Next update</strong></td>
        <td><strong>November 2021</strong></td>
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

Visit the [roadmap board in our issue tracker ![YouTrack](youtrack-logo.png){width=30}{type="joined"} YouTrack](https://youtrack.jetbrains.com/agiles/153-1251/current)!

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
                <li><a href="https://youtrack.jetbrains.com/issue/KT-12380" target="_blank">🆕 Support sealed (exhaustive) whens</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-22956" target="_blank">🆕 Release OptIn annotations</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-45395" target="_blank">🆕 Support programmatic creation of annotation class instances</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-45396" target="_blank">🆕 Stabilize typeOf</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-45618" target="_blank">🆕 Stabilize builder inference</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-12794" target="_blank">🆕 Allow repeating annotations with runtime retention when compiling under Java 8</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-43714" target="_blank">🆕 Support annotations on class type parameters</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-40804" target="_blank">🆕 Improve type inference in corner cases for popular Java APIs</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42435" target="_blank">Prototype multiple receivers</a></li>
            </ul>
        </td>
        <td>
            <ul>
                <li>⏸ <a href="https://youtrack.jetbrains.com/issue/KT-46778" target="_blank">Support JVM sealed classes</a></li>
            </ul>
        </td>
    </tr>
    <tr>
        <td><strong>Compiler core</strong></td>
        <td>
            <ul>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-46756" target="_blank">🆕 Release the new compiler frontend in Alpha for JVM target</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-46762" target="_blank">🆕 Finalize support for jspecify</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42286" target="_blank">Maintain the current compiler (bug-fixing only)</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-44318" target="_blank">Work on services for the new compiler to interact with IDE</a></li>
            </ul>
        </td>
        <td>
            <ul>
                <li>⏸ Stable Compiler Plugin API</li>
                <li>⏸ Scripting improvements</li>
            </ul>
        </td>
    </tr>
    <tr>
        <td><strong>Kotlin/JVM</strong></td>
        <td>
            <ul>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-46767" target="_blank">🆕 Maintain the new JVM IR backend</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-46768" target="_blank">🆕 Improve new JVM IR backend compilation time</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-46770" target="_blank">🆕 Stabilize JVM-specific experimental features</a></li>
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
                <li>⏸ ES6 support</li>
                <li>⏸ <a href="https://youtrack.jetbrains.com/issue/KT-42290" target="_blank">Improve Dukat support</a></li>
            </ul>
        </td>
    </tr>
    <tr>
        <td><strong>Kotlin/Wasm</strong></td>
        <td>
            <ul>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-46773" target="_blank">🆕 Implement an experimental version of Kotlin/Wasm compiler backend</a></li>
            </ul>
         </td>
        <td>Note: Wasm support in <a href="https://kotlinlang.org/docs/reference/native-overview.html" target="_blank">Kotlin/Native</a> (through LLVM) will be deprecated and removed</td>
    </tr>
    <tr>
        <td><strong>Kotlin/Native</strong></td>
        <td>
            <ul>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-46771" target="_blank">🆕 Implement safe initialization for top-level properties</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42296" target="_blank">Prototype a new garbage collector</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42294" target="_blank">Improve compilation time</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42297" target="_blank">Improve exporting Kotlin code to Objective-C</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42293" target="_blank">Provide binary compatibility between incremental releases</a></li>
            </ul>
         </td>
        <td>
            <ul>
                <li>⏸ Support Mac Catalyst</li>
                <li>⏸ Direct interoperability with Swift</li>
                <li>⏸ Interoperability with C++</li>
                <li>⏸ Support Alpine Linux</li>
            </ul>
        </td>
    </tr>
    <tr>
        <td><strong>Kotlin Multiplatform</strong></td>
        <td>
            <ul>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-46772" target="_blank">🆕 Support the Apple Silicon target in the Kotlin Multiplatform tooling</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-44329" target="_blank">Improve UX of using Native libraries in Kotlin</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42301" target="_blank">Improve dependency management for iOS</a></li>
            </ul>
         </td>
        <td>
            <ul>
                <li>⏸ <a href="https://youtrack.jetbrains.com/issue/KT-44328" target="_blank">Improve Kotlin/Native debugging experience</a></li>
                <li>⏸ <a href="https://youtrack.jetbrains.com/issue/KT-42303" target="_blank">Improve Gradle and Compiler error messages</a></li>
                <li>⏸ Sharing code between JVM and Android</li>
            </ul>
        </td>
    </tr>
    <tr>
        <td><strong>IDE</strong></td>
        <td>
            <ul>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42307" target="_blank">Prototype IDE plugin with the new compiler frontend</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42304" target="_blank">Improve IDE performance</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-44330" target="_blank">Improve debugging experience</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-46787" target="_blank">🆕 Improve the New Project wizard</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42308" target="_blank">Move the Kotlin plugin to the IntelliJ platform development infrastructure</a></li>
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
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42309" target="_blank">Improve the performance of Gradle incremental compilation</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42311" target="_blank">Decrease time for opening Gradle projects</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-46788" target="_blank">🆕 Improve the quality of Gradle import</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-46789" target="_blank">🆕 Improve user experience with the Kotlin Gradle plugin</a></li>
            </ul>
         </td>
        <td>
            <ul>
                <li><p>⏸ Improvements in Kotlin Maven support</p></li>
            </ul>
        </td>
    </tr>
    <tr>
        <td><strong>Libraries</strong></td>
        <td>
            <ul>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-46782" target="_blank">🆕 Improve kotlinx-serialization (release v1.3.0)</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-46783" target="_blank">🆕 Improve kotlinx-coroutines (release v1.6.0)</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-46784" target="_blank">🆕 Stabilize Duration API in the standard library</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-46785" target="_blank">🆕 Get rid of <code>!!</code> for <code>readLine()</code> in the standard library</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-46786" target="_blank">🆕 Stabilize and document atomicfu</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42315" target="_blank">Improve kotlinx-datetime library</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42436" target="_blank">Support java.nio.Path extension in the standard library</a></li>
            </ul>
         </td>
        <td>
            <ul>
                <li>⏸ <a href="https://youtrack.jetbrains.com/issue/KT-42314" target="_blank">Improve usability of multi-threaded coroutines library for Kotlin/Native</a></li>
                <li>⏸ <code>kotlinx-cli</code></li>
                <li>⏸ <code>binary-compatibility-validator</code></li>
                <li>⏸ <code>kotlinx-io</code></li>
                <li>⏸ Any new multiplatform libraries</li>
            </ul>
        </td>
    </tr>
    <tr>
        <td><strong>Website</strong></td>
        <td>
            <ul>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-44339" target="_blank">Make the Kotlin website mobile friendly</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-46791" target="_blank">🆕 Make the UI and navigation consistent</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-46792" target="_blank">🆕 Update community graphic assets to the new Kotlin visual style</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-44338" target="_blank">Revamp Kotlin documentation</a></li>
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

## What's changed since January 2021

### Completed items

We've **completed** the following items from the previous roadmap:

* ✅ Language: [Support JVM records](https://youtrack.jetbrains.com/issue/KT-42430)
* ✅ Language: [Release inline classes as Stable, secure Valhalla compatibility](https://youtrack.jetbrains.com/issue/KT-42434)
* ✅ Language: [Sealed interfaces and more sealed classes freedom](https://youtrack.jetbrains.com/issue/KT-42433)
* ✅ Compiler core: [Support incremental compilation for the new compiler](https://youtrack.jetbrains.com/issue/KT-44317)
* ✅ Kotlin/JVM: [Make the new JVM IR backend Stable](https://youtrack.jetbrains.com/issue/KT-42287)
* ✅ Kotlin/JS: [JS IR BE: Prototype lazy initialization for top-level properties like in JVM](https://youtrack.jetbrains.com/issue/KT-44320)
* ✅ Kotlin/Wasm: [Prototype a compiler for Wasm GC proposal](https://youtrack.jetbrains.com/issue/KT-42292)
* ✅ Kotlin/Native: [Support Apple Silicon without Rosetta 2](https://youtrack.jetbrains.com/issue/KT-44321)
* ✅ Multiplatform: [Introduce a complex KMM application sample](https://youtrack.jetbrains.com/issue/KT-44326)
* ✅ Multiplatform: [Improve frontend and IDE import stability for Multiplatform projects](https://youtrack.jetbrains.com/issue/KT-44325)
* ✅ IDE: [Improve cross-language support in the Inline Method and Change Signature refactorings](https://youtrack.jetbrains.com/issue/KT-42306)
* ✅ Build tools: [Support the Gradle configuration cache](https://youtrack.jetbrains.com/issue/KT-42310)
* ✅ Libraries: [Make multiplatform kotlin.text API locale-agnostic by default](https://youtrack.jetbrains.com/issue/KT-42437)
* ✅ Libraries: [Implement unambiguous API for Char conversion](https://youtrack.jetbrains.com/issue/KT-44333)
* ✅ Libraries: [Implement multiplatform API for characters](https://youtrack.jetbrains.com/issue/KT-44334)
* ✅ Libraries: [Improve kotlinx-serialization (release v1.1)](https://youtrack.jetbrains.com/issue/KT-42316)
* ✅ Libraries: [Improve kotlinx-serialization (release v1.2)](https://youtrack.jetbrains.com/issue/KT-44335)
* ✅ Libraries: [Improve kotlinx-coroutines (release v1.5)](https://youtrack.jetbrains.com/issue/KT-44336)
* ✅ Website: [Design a new Kotlin visual style](https://youtrack.jetbrains.com/issue/KT-44340)
* ✅ Website: [Close try.kotlinlang.org](https://youtrack.jetbrains.com/issue/KT-44342)

### Postponed items

We've decided to **postpone** the following items from the previous roadmap:

* ⏸ [Support JVM sealed classes](https://youtrack.jetbrains.com/issue/46778)
* ⏸ [Improve Kotlin/Native debugging experience](https://youtrack.jetbrains.com/issue/KT-44328)

Other postponed items remain in this state from earlier roadmap versions.

### New items

We've **added** the following items to the roadmap:

* 🆕 Language: [Support sealed (exhaustive) whens](https://youtrack.jetbrains.com/issue/KT-12380)
* 🆕 Language: [Release OptIn annotations](https://youtrack.jetbrains.com/issue/KT-22956)
* 🆕 Language: [Support programmatic creation of annotation class instances](https://youtrack.jetbrains.com/issue/KT-45395)
* 🆕 Language: [Stabilize typeOf](https://youtrack.jetbrains.com/issue/KT-45396)
* 🆕 Language: [Stabilize builder inference](https://youtrack.jetbrains.com/issue/KT-45618)
* 🆕 Language: [Allow repeating annotations with runtime retention when compiling under Java 8](https://youtrack.jetbrains.com/issue/KT-12794)
* 🆕 Language: [Support annotations on class type parameters](https://youtrack.jetbrains.com/issue/KT-43714)
* 🆕 Language: [Improve type inference in corner cases for popular Java APIs](https://youtrack.jetbrains.com/issue/KT-40804)
* 🆕 Compiler core: [Release the new compiler frontend in Alpha for JVM target](https://youtrack.jetbrains.com/issue/KT-46756)
* 🆕 Compiler core: [Finalize support for jspecify](https://youtrack.jetbrains.com/issue/KT-46762)
* 🆕 Kotlin/JVM: [Maintain the new JVM IR backend](https://youtrack.jetbrains.com/issue/KT-46767)
* 🆕 Kotlin/JVM: [Improve new JVM IR backend compilation time](https://youtrack.jetbrains.com/issue/KT-46768)
* 🆕 Kotlin/JVM: [Stabilize JVM-specific experimental features](https://youtrack.jetbrains.com/issue/KT-46770)
* 🆕 Kotlin/Wasm: [Implement an experimental version of Kotlin/Wasm compiler backend](https://youtrack.jetbrains.com/issue/KT-46773)
* 🆕 Kotlin/Native: [Implement safe initialization for top-level properties](https://youtrack.jetbrains.com/issue/KT-46771)
* 🆕 Multiplatform: [Support the Apple Silicon target in the Kotlin Multiplatform tooling](https://youtrack.jetbrains.com/issue/KT-46772)
* 🆕 IDE: [Improve the New Project wizard](https://youtrack.jetbrains.com/issue/KT-46787)
* 🆕 Build tools: [Improve the quality of Gradle import](https://youtrack.jetbrains.com/issue/KT-46788)
* 🆕 Build tools: [Improve user experience with the Kotlin Gradle plugin](https://youtrack.jetbrains.com/issue/KT-46789)
* 🆕 Libraries: [Improve kotlinx-serialization (release v1.3.0)](https://youtrack.jetbrains.com/issue/KT-46782)
* 🆕 Libraries: [Improve kotlinx-coroutines (release v1.6.0)](https://youtrack.jetbrains.com/issue/KT-46783)
* 🆕 Libraries: [Stabilize Duration API in the standard library](https://youtrack.jetbrains.com/issue/KT-46784)
* 🆕 Libraries: [Get rid of <code>!!</code> for <code>readLine()</code> in the standard library](https://youtrack.jetbrains.com/issue/KT-46785)
* 🆕 Libraries: [Stabilize and document `atomicfu`](https://youtrack.jetbrains.com/issue/KT-46786)
* 🆕 Website: [Make the UI and navigation consistent](https://youtrack.jetbrains.com/issue/KT-46791)
* 🆕 Website: [Update community graphic assets to the new Kotlin visual style](https://youtrack.jetbrains.com/issue/KT-46792)


### Items in progress

All other previously identified roadmap items are in progress.
You can check their [YouTrack tickets](https://youtrack.jetbrains.com/issues/KT?q=Type:%20%7BRoadmap%20Item%7D%20state:%20%7BIn%20Progress%7D%20) for updates.
