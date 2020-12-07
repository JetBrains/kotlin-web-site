---
layout: reference
title: Kotlin Roadmap
date: 2020-10-01
---

# Kotlin Roadmap

<table>
    <tr>
        <td><strong>Last modified on</strong></td>
        <td>October 2020</td>
    </tr>
    <tr>
        <td><strong>Time frame</strong></td>
        <td>6 months until March 2021</td>
    </tr>
    <tr>
        <td><strong>Next update</strong></td>
        <td>January 2021</td>
    </tr>
</table>

Welcome to the Kotlin roadmap! Get a sneak peek into the priorities of the Kotlin Team.

Here are a few points to note about this roadmap:

1. It describes the primary areas that the team is investing into.
2. It’s not an exhaustive list of all things the team is working on, only the biggest projects.
3. There’s no commitment to delivering specific features or fixes in specific versions.
4. It lists some things that are postponed and will NOT get the team’s attention in the nearest future.
5. Nothing is set in stone, we will adjust our priorities as we go and update the roadmap approximately every three months.

If you have any questions or feedback about the roadmap or the items on it, feel free to post them to [YouTrack tickets](https://youtrack.jetbrains.com/issues/KT?q=%23%7BRoadmap%20Item%7D%20) or in the [#kotlin-roadmap](https://kotlinlang.slack.com/archives/C01AAJSG3V4) channel of Kotlin Slack ([request an invite](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up?_ga=2.60878444.1901676095.1599823213-394965905.1588600024)).
 
## Key priorities

The goal of this roadmap is to give you a big picture. Here’s a list of our key priorities – the areas we are investing the most effort into:

- **Fast turnaround**: making the change-test-debug cycle really fast.
- **New compiler**: a rewrite of the Kotlin compiler optimized for speed, parallelism, and unification. Later we will also work on pluggability.
- **Fast and smooth IDE**: improving the stability and performance of the Kotlin IDE.
- **Kotlin for JVM server-side development**: expanding support for server-side use cases across the Kotlin ecosystem.
- **Kotlin Multiplatform Mobile**: improving the user experience and feature set for sharing code on mobile platforms.

## Kotlin roadmap by subsystem

This table describes the biggest projects that we’re working on.

<table>
    <tr>
        <th>Subsystem</th>
        <th>In focus now</th>
        <th>Postponed for later</th>
    </tr>
    <tr>
        <td><strong>Language</strong>
        </td>
        <td>
            <ul>
                <li><p>Support JVM records<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-42430" target="_blank">KT-42430</a>)</p></li>
                <li><p>Support JVM sealed classes<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-42433" target="_blank">KT-42433</a>)</p></li>
                <li><p>Release inline classes as stable, secure Valhalla compatibility<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-42434" target="_blank">KT-42434</a>)</p></li>
                <li><p>Prototype multiple receivers<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-42435" target="_blank">KT-42435</a>)</p></li>
            </ul>
        </td>
        <td>
        </td>
    </tr>
    <tr>
        <td><strong>Compiler core</strong>
        </td>
        <td>
            <ul>
                <li>
                  <p>Bootstrap the new compiler (make the new Kotlin compiler compile itself)<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-42285" target="_blank">KT-42285</a>)</p>
                </li>
                <li>
                  <p>Maintain the current compiler (bug-fixing only)<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-42286" target="_blank">KT-42286</a>)</p>
                </li>
            </ul>
        </td>
        <td>
            <ul>
                <li><p>⏸ Stable Compiler Plugin API</p></li>
                <li><p>⏸ Scripting improvements</p></li>
            </ul>
        </td>
    </tr>
    <tr>
        <td><strong>Kotlin/JVM</strong>
        </td>
        <td>
            <ul>
                <li>
                  <p>Make the new JVM IR backend stable<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-42287" target="_blank">KT-42287</a>)</p>
                </li>
                <li>
                  <p>Maintain the old JVM backend by fixing critical bugs<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-42288" target="_blank">KT-42288</a>)</p>
                </li>
            </ul>
         </td>
        <td>
        </td>
    </tr>
    <tr>
        <td><strong>Kotlin/JS</strong>
        </td>
        <td>
            <ul>
                <li>
                  <p>Make the new JS IR backend stable<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-42289" target="_blank">KT-42289</a>)</p>
                </li>
                <li>
                  <p>Improve Dukat support<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-42290" target="_blank">KT-42290</a>)</p>
                </li>
                <li>
                  <p>Maintain the old JS backend by fixing critical bugs<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-42291" target="_blank">KT-42291</a>)</p>
                </li>
            </ul>
         </td>
        <td>
            <ul><li>⏸ ES6 support</li></ul>
        </td>
    </tr>
    <tr>
        <td><strong>Kotlin/WASM</strong>
        </td>
        <td>
            <ul>
                <li>
                  <p>Prototype a compiler for Wasm GC proposal<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-42292" target="_blank">KT-42292</a>)</p>
                </li>
            </ul>
         </td>
        <td>
            <p>Note: Wasm support in <a href="https://kotlinlang.org/docs/reference/native-overview.html" target="_blank">Kotlin/Native</a> (through LLVM) will be deprecated and removed</p>
        </td>
    </tr>
    <tr>
        <td><strong>Kotlin/Native</strong>
        </td>
        <td>
            <ul>
                <li>
                  <p>Provide binary compatibility between incremental releases<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-42293" target="_blank">KT-42293</a>)</p>
                </li>
                <li>
                  <p>Improve compilation time<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-42294" target="_blank">KT-42294</a>)</p>
                </li>
                <li>
                  <p>Runtime performance: improve object allocation times<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-42295" target="_blank">KT-42295</a>)</p>
                </li>
                <li>
                  <p>Prototype a new garbage collector<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-42296" target="_blank">KT-42296</a>)</p>
                </li>
                <li>
                  <p>Improve exporting Kotlin code to Objective-C<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-42297" target="_blank">KT-42297</a>)</p>
                </li>
            </ul>
         </td>
        <td>
            <ul>
                <li>
                  <p>⏸ Support ARM Mac & Catalyst<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-39834" target="_blank">KT-39834</a>)<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-39833" target="_blank">KT-39833</a>)<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-40442" target="_blank">KT-40442</a>)</p>
                </li>
                <li>
                  <p>⏸ Direct interoperability with Swift</p>
                </li>
                <li>
                  <p>⏸ Interoperability with C++</p>
                </li>
                <li>
                  <p>⏸ Support Alpine Linux<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-38876" target="_blank">KT-38876</a>)</p>
                </li>
            </ul>
        </td>
    </tr>
    <tr>
        <td><strong>Kotlin Multiplatform</strong>
        </td>
        <td>
            <ul>
                <li>
                  <p>KMM plugin: Fix major bugs<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-42299" target="_blank">KT-42299</a>)</p>
                </li>
                <li>
                  <p>KMM plugin: Run common tests on Android devices<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-42298" target="_blank">KT-42298</a>)</p>
                </li>
                <li>
                  <p>Improve dependency management for iOS<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-42301" target="_blank">KT-42301</a>)</p>
                </li>
                <li>
                  <p>Improve Gradle & Compiler error messages<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-42303" target="_blank">KT-42303</a>)</p>
                </li>
            </ul>
         </td>
        <td>
            <ul>
                <li>
                  <p>⏸ Sharing code between JVM and Android</p>
                </li>
                <li>
                  <p>⏸ KMM plugin: support for IntelliJ IDEA</p>
                </li>
            </ul>
        </td>
    </tr>
    <tr>
        <td><strong>IDE</strong>
        </td>
        <td>
            <ul>
                <li>
                  <p>Improve IDE performance<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-42304" target="_blank">KT-42304</a>)</p>
                </li>
                <li>
                  <p>Improve cross-language support in the Inline Method and Change Signature refactorings<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-42306" target="_blank">KT-42306</a>)</p>
                </li>
                <li>
                  <p>Prototype IDE plugin with the new compiler frontend<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-42307" target="_blank">KT-42307</a>)</p>
                </li>
                <li>
                  <p>Move the Kotlin plugin to the IntelliJ platform development infrastructure<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-42308" target="_blank">KT-42308</a>)</p>
                </li>
            </ul>
         </td>
        <td>
            <p>Note: Kotlin support for VSCode or other IDEs is not on the roadmap for the Kotlin team. Community initiatives in this respect are welcome.</p>
        </td>
    </tr>
    <tr>
        <td><strong>Build tools</strong>
        </td>
        <td>
            <ul>
                <li>
                  <p>Improve incremental compilation performance in Gradle<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-42309" target="_blank">KT-42309</a>)</p>
                </li>
                <li>
                  <p>Support the Gradle configuration cache<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-42310" target="_blank">KT-42310</a>)</p>
                </li>
                <li>
                  <p>Decrease time for opening Gradle projects<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-42311" target="_blank">KT-42311</a>)</p>
                </li>
            </ul>
         </td>
        <td>
            <ul>
                <li><p>⏸ Improvements in Kotlin Maven support</p></li>
            </ul>
        </td>
    </tr>
    <tr>
        <td><strong>Libraries</strong>
        </td>
        <td>
            <ul>
                <li>
                  <p>Support <code>java.nio.Path</code> extension in the standard library<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-42436" target="_blank">KT-42436</a>)</p>
                </li>
                <li>
                  <p>Make multiplatform <code>kotlin.text</code> API locale-agnostic by default<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-42437" target="_blank">KT-42437</a>)</p>
                </li>
                <li>
                  <p>Improve usability of multi-threaded coroutines library for Kotlin/Native<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-42314" target="_blank">KT-42314</a>)</p>
                </li>
                <li>
                  <p>Improve <code>kotlinx-datetime</code> library<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-42315" target="_blank">KT-42315</a>)</p>
                </li>
                <li>
                  <p>Improve <code>kotlinx-serialization</code> (release v1.1)<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-42316" target="_blank">KT-42316</a>)</p>
                </li>
                <li>
                  <p>Improve <code>kotlinx-coroutines</code> (release v1.4)<br/>(<a href="https://youtrack.jetbrains.com/issue/KT-42317" target="_blank">KT-42317</a>)</p>
                </li>
            </ul>
         </td>
        <td>
            <ul>
                <li><p>⏸ <code>kotlinx-cli</code></p></li>
                <li><p>⏸ <code>binary-compatibility-validator</code></p></li>
                <li><p>⏸ <code>kotlinx-io</code></p></li>
                <li><p>⏸ Any new multiplatform libraries</p></li>
            </ul>
        </td>
    </tr>
    <tr>
        <td><strong>Ktor</strong>
        </td>
        <td>
           <p><a href="https://blog.jetbrains.com/ktor/2020/08/10/ktor-roadmap-for-2020-2021/" target="_blank">Ktor roadmap</a></p>
         </td>
        <td>
        </td>
    </tr>
</table>