[//]: # (title: Kotlin roadmap)

<table>
    <tr>
        <td><strong>Last modified on</strong></td>
        <td>January 2021</td>
    </tr>
    <tr>
        <td><strong>Time frame</strong></td>
        <td>6 months until June 2021</td>
    </tr>
    <tr>
        <td><strong>Next update</strong></td>
        <td>April 2021</td>
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

Visit the [new roadmap board in our issue tracker ![YouTrack](youtrack-logo.png){width=30}{type="joined"} YouTrack](https://youtrack.jetbrains.com/agiles/153-1251/current)!

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
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42430" target="_blank">Support JVM records</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42433" target="_blank">Support JVM sealed classes</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42434" target="_blank">Release inline classes as Stable, secure Valhalla compatibility</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42435" target="_blank">Prototype multiple receivers</a></li>
            </ul>
        </td>
        <td></td>
    </tr>
    <tr>
        <td><strong>Compiler core</strong></td>
        <td>
            <ul>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-44317" target="_blank">Support incremental compilation for the new compiler</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-44318" target="_blank">Work on services for the new compiler to interact with IDE</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42286" target="_blank">Maintain the current compiler (bug-fixing only)</a></li>
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
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42287" target="_blank">Make the new JVM IR backend Stable</a></li>
            </ul>
         </td>
        <td>
            <ul>
                <li>⏸ <a href="https://youtrack.jetbrains.com/issue/KT-42288" target="_blank">Maintain the old JVM backend by fixing critical bugs</a></li>
            </ul>
        </td>
    </tr>
    <tr>
        <td><strong>Kotlin/JS</strong></td>
        <td>
            <ul>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42289" target="_blank">Make the new JS IR backend Stable</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-44320" target="_blank">JS IR BE: Prototype lazy initialization for top-level properties like in JVM</a></li>
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
        <td><strong>Kotlin/WASM</strong></td>
        <td>
            <ul>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42292" target="_blank">Prototype a compiler for Wasm GC proposal</a></li>
            </ul>
         </td>
        <td>Note: Wasm support in <a href="https://kotlinlang.org/docs/reference/native-overview.html" target="_blank">Kotlin/Native</a> (through LLVM) will be deprecated and removed</td>
    </tr>
    <tr>
        <td><strong>Kotlin/Native</strong></td>
        <td>
            <ul>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42293" target="_blank">Provide binary compatibility between incremental releases</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42294" target="_blank">Improve compilation time</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42296" target="_blank">Prototype a new garbage collector</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42297" target="_blank">Improve exporting Kotlin code to Objective-C</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-44321" target="_blank">Support producing binaries that run on Apple Silicon without Rosetta 2</a></li>
            </ul>
         </td>
        <td>
            <ul>
                <li>⏸ Support Mac Catalyst</li>
                <li>⏸ Development with Kotlin/Native on Apple Silicon without Rosetta 2</li>
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
                <li><a href="https://youtrack.jetbrains.com/issue/KT-44325" target="_blank">Improve frontend and IDE import stability for Multiplatform projects</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-44326" target="_blank">Introduce a complex KMM application sample</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-44328" target="_blank">Improve Kotlin/Native debugging experience</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-44329" target="_blank">Improve UX of using Native libraries in Kotlin</a></li>
            </ul>
         </td>
        <td>
            <ul>
                <li>⏸ <a href="https://youtrack.jetbrains.com/issue/KT-42301" target="_blank">Improve dependency management for iOS</a></li>
                <li>⏸ <a href="https://youtrack.jetbrains.com/issue/KT-42303" target="_blank">Improve Gradle and Compiler error messages</a></li>
                <li>⏸ Sharing code between JVM and Android</li>
                <li>⏸ KMM plugin: support for IntelliJ IDEA</li>
            </ul>
        </td>
    </tr>
    <tr>
        <td><strong>IDE</strong></td>
        <td>
            <ul>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42304" target="_blank">Improve IDE performance</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-44330" target="_blank">Improve debugging experience</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42306" target="_blank">Improve cross-language support in the Inline Method and Change Signature refactorings</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42307" target="_blank">Prototype IDE plugin with the new compiler frontend</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42308" target="_blank">Move the Kotlin plugin to the IntelliJ platform development infrastructure</a></li>
            </ul>
         </td>
        <td>
            <ul>
                <li>⏸ Advanced tooling that users have in Java but is missing in Kotlin.</li>
                <li>⏸ Quality of less frequently used features, except blocking problems.</li>
                <li>⏸ Support for VSCode or other IDEs. Community initiatives in this respect are welcome. </li>
            </ul>
        </td>
    </tr>
    <tr>
        <td><strong>Build tools</strong></td>
        <td>
            <ul>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42309" target="_blank">Improve incremental compilation performance in Gradle</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42310" target="_blank">Support the Gradle configuration cache</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42311" target="_blank">Decrease time for opening Gradle projects</a></li>
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
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42436" target="_blank">Support java.nio.Path extension in the standard library</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42437" target="_blank">Make multiplatform kotlin.text API locale-agnostic by default</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42315" target="_blank">Improve kotlinx-datetime library</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-42316" target="_blank">Improve kotlinx-serialization (release v1.1)</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-44335" target="_blank">Improve kotlinx-serialization (release v1.2)</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-44336" target="_blank">Improve kotlinx-coroutines (release v1.5)</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-44333" target="_blank">Implement unambiguous API for Char conversion</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-44334" target="_blank">Implement multiplatform API for characters</a></li>
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
                <li><a href="https://youtrack.jetbrains.com/issue/KT-44338" target="_blank">Revamp Kotlin documentation</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-44339" target="_blank">Make the Kotlin website mobile friendly</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-44340" target="_blank">Design a new Kotlin visual style</a></li>
                <li><a href="https://youtrack.jetbrains.com/issue/KT-44342" target="_blank">Close try.kotlinlang.org</a></li>
            </ul>
        </td>
        <td></td>
    </tr>
    <tr>
        <td><strong>Ktor</strong></td>
        <td>
           <p><a href="https://blog.jetbrains.com/ktor/2020/08/10/ktor-roadmap-for-2020-2021/" target="_blank">Ktor roadmap</a></p>
         </td>
        <td>
        </td>
    </tr>
</table>

> * This roadmap is not an exhaustive list of all things the team is working on, only the biggest projects.
> * There’s no commitment to delivering specific features or fixes in specific versions.
> * It lists some things that are postponed and will NOT get the team’s attention in the nearest future.
> * We will adjust our priorities as we go and update the roadmap approximately every three months.
> 
{type="note"}

## What's changed since October 2020

### Completed items

We've **completed** the following items from the roadmap that we published in October 2020:

* ✅ Compiler core: [Bootstrap the new compiler (make the new Kotlin compiler compile itself)](https://youtrack.jetbrains.com/issue/KT-42285)
* ✅ Kotlin/Native: [Runtime performance: improve object allocation times](https://youtrack.jetbrains.com/issue/KT-42295)
* ✅ Multiplatform: [KMM plugin: Fix major bugs](https://youtrack.jetbrains.com/issue/KT-42299)
* ✅ Multiplatform: [KMM plugin: Run common tests on Android devices](https://youtrack.jetbrains.com/issue/KT-42298) (partially)
* ✅ Libraries: [Improve `kotlinx-coroutines`(release v1.4)](https://youtrack.jetbrains.com/issue/KT-42317)

### Postponed items

We've decided to **postpone** the following items from the previous roadmap:

* ⏸ Kotlin/JVM: [Maintain the old JVM backend by fixing critical bugs](https://youtrack.jetbrains.com/issue/KT-42288)
* ⏸ Kotlin/JS: [Improve Dukat support](https://youtrack.jetbrains.com/issue/KT-42290)
* ⏸ Multiplatform: [Improve dependency management for iOS](https://youtrack.jetbrains.com/issue/KT-42301)
* ⏸ Multiplatform: [Improve Gradle and Compiler error messages](https://youtrack.jetbrains.com/issue/KT-42303)
* ⏸ Libraries: [Improve usability of multi-threaded coroutines library for Kotlin/Native](https://youtrack.jetbrains.com/issue/KT-42314)

### New items

We've **added** the following items to the roadmap:

* 🆕 Compiler core: [Support incremental compilation for the new compiler](https://youtrack.jetbrains.com/issue/KT-44317)
* 🆕 Compiler core: [Work on services for the new compiler to interact with IDE](https://youtrack.jetbrains.com/issue/KT-44318)
* 🆕 Kotlin/JS: [JS IR BE: Add an ability to generate separate JS files for each module](https://youtrack.jetbrains.com/issue/KT-44319)
* 🆕 Kotlin/JS: [JS IR BE: Prototype lazy initialization for top-level properties like in JVM](https://youtrack.jetbrains.com/issue/KT-44320)
* 🆕 Kotlin/Native: [Support producing binaries that run on Apple Silicon without Rosetta 2](https://youtrack.jetbrains.com/issue/KT-44321)
* 🆕 Multiplatform: [Improve frontend and IDE import stability for Multiplatform projects](https://youtrack.jetbrains.com/issue/KT-44325)
* 🆕 Multiplatform: [Introduce a complex KMM application sample](https://youtrack.jetbrains.com/issue/KT-44326)
* 🆕 Multiplatform: [Improve Kotlin/Native debugging experience](https://youtrack.jetbrains.com/issue/KT-44328)
* 🆕 Multiplatform: [Improve UX of using Native libraries in Kotlin](https://youtrack.jetbrains.com/issue/KT-44329)
* 🆕 IDE: [Improve debugging experience](https://youtrack.jetbrains.com/issue/KT-44330)
* 🆕 Libraries: [Improve kotlinx-serialization (release v1.2)](https://youtrack.jetbrains.com/issue/KT-44335)
* 🆕 Libraries: [Improve kotlinx-coroutines (release v1.5)](https://youtrack.jetbrains.com/issue/KT-44336)
* 🆕 Libraries: [Implement unambiguous API for Char conversion](https://youtrack.jetbrains.com/issue/KT-44333)
* 🆕 Libraries: [Implement multiplatform API for characters](https://youtrack.jetbrains.com/issue/KT-44334)

We've also added a new subsystem, **Website**, to share our roadmap for [kotlinlang.org](https://kotlinlang.org/):

* 🆕 Website: [Revamp Kotlin documentation](https://youtrack.jetbrains.com/issue/KT-44338)
* 🆕 Website: [Make the Kotlin website mobile friendly](https://youtrack.jetbrains.com/issue/KT-44339)
* 🆕 Website: [Design a new Kotlin visual style](https://youtrack.jetbrains.com/issue/KT-44340)
* 🆕 Website: [Close try.kotlinlang.org](https://youtrack.jetbrains.com/issue/KT-44342)

### Items in progress

All other previously identified roadmap items are in progress.
You can check their [YouTrack tickets](https://youtrack.jetbrains.com/issues/KT?q=Type:%20%7BRoadmap%20Item%7D%20state:%20%7BIn%20Progress%7D%20) for updates.
