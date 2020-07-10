---
layout: default
title: Participate in the Kotlin Early Access Preview
main_nav_id: eap
---

# Participate in the Kotlin Early Access Preview (EAP)

You can participate in the Kotlin Early Access Preview (EAP) to try out the latest Kotlin features before they are released.

We ship a few EAP builds before every Kotlin incremental release (_1.x.y_) and a few Milestone (M) builds before every feature release (_1.x_). 

We’ll be very thankful if you find and report bugs to our issue tracker [YouTrack](https://kotl.in/issue). 
It is very likely that we’ll be able to fix them before the final release, which means you won’t need to wait until the next Kotlin release for your issues to be addressed. 

By participating in the Early Access Preview and reporting bugs, you contribute to Kotlin and help us make it better 
for everyone in [the growing Kotlin community](/community/). We appreciate your help a lot! 

If you have any questions and want to participate in discussions, you are welcome to join the _#eap_ channel in [Kotlin Slack](https://app.slack.com/client/T09229ZC6/C0KLZSCHF). 
In this channel, you can also get notifications about new EAP builds.

**[Install the Kotlin EAP Plugin for IDEA or Android Studio](install-eap-plugin.html)**

> By participating in the EAP, you expressly acknowledge that the EAP version may not be reliable, may not work as intended, and may contain errors.
>
> Please note that we don’t provide any guarantees of compatibility between EAP and final versions of the same release. 
{:.note}

If you have already installed the EAP version and want to work on projects that were created previously, 
check [our instructions on how to configure your build to support this version](configure-build-for-eap.html). 

# Build details

<table>
    <tr>
        <th>Build info</th>
        <th>Build highlights</th>
        <th>kotlinx library versions</th>
    </tr>
    <tr>
        <td><strong>1.4-M3</strong>
            <p> Released: <strong>July 6, 2020</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4-M3" target="_blank">Release on GitHub</a></p>
        </td>
        <td>
            <p>Standard library improvements:</p>
            <ul>
                <li>Supported functional interfaces</li>
                <li><code>module-info</code> descriptor for JVM classes</li>
                <li>New collection operations</li>
                <li><code>@Throws</code> annotation in the common library</li>
            </ul>
            <p> For more details, please refer to <a href="https://blog.jetbrains.com/kotlin/2020/07/kotlin-1-4-m3-is-out-standard-library-changes" target="_blank">the blog post</a>.</p>
         </td>
        <td>
            <ul>
                <li><a href="https://github.com/Kotlin/kotlinx.serialization" target="_blank"><strong>kotlinx.serialization</strong>
                </a> version: <a href="https://bintray.com/kotlin/kotlinx/kotlinx.serialization.runtime/0.20.0-1.4-M3" target="_blank">0.20.0-1.4-M3</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.coroutines" target="_blank"><strong>kotlinx.coroutines</strong></a>
                version: <a href="https://bintray.com/kotlin/kotlinx/kotlinx.coroutines/1.3.7-1.4-M3" target="_blank">1.3.7-1.4-M3
                </a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.atomicfu" target="_blank"><strong>kotlinx.atomicfu</strong></a>
                version: <a href="https://bintray.com/kotlin/kotlinx/kotlinx.atomicfu/0.14.3-1.4-M3" target="_blank">0.14.3-1.4-M3
                </a></li>          
                 <li><a href="https://ktor.io/" target="_blank"><strong>ktor</strong></a> version: <a href="https://bintray.com/kotlin/ktor/ktor/1.3.2-1.4-M3" target="_blank">1.3.2-1.4-M3</a></li>
            </ul>
        </td>
    </tr>    
    <tr>
        <td><strong>1.4-M2</strong>
            <p> Released: <strong>June 4, 2020</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4-M2">Release on GitHub</a></p>
        </td>
        <td>
            <ul>
                <li>Hierarchical project structure</li>
                <li>New flexible Project Wizard</li>
                <li>Explicit API mode for library authors</li>
                <li>And many other improvements</li>
            </ul>
            <p> For more details, please refer to <a href="http://blog.jetbrains.com/kotlin/2020/06/kotlin-1-4-m2-released/" target="_blank">the blog post</a>.</p>
         </td>
        <td>
            <ul>
                <li><a href="https://github.com/Kotlin/kotlinx.serialization"><strong>kotlinx.serialization</strong></a> version: <a href="https://bintray.com/kotlin/kotlinx/kotlinx.serialization.runtime/0.20.0-1.4-M2">0.20.0-1.4-M2</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.coroutines"><strong>kotlinx.coroutines</strong></a> version: <a href="https://bintray.com/kotlin/kotlinx/kotlinx.coroutines/1.3.7-1.4-M2">1.3.7-1.4-M2</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.atomicfu"><strong>kotlinx.atomicfu</strong></a> version: <a href="https://bintray.com/kotlin/kotlinx/kotlinx.atomicfu/0.14.3-1.4-M2">0.14.3-1.4-M2</a></li>          
                 <li><a href="https://ktor.io/"><strong>ktor</strong></a> version: <a href="https://bintray.com/kotlin/ktor/ktor/1.3.2-1.4-M2">1.3.2-1.4-M2</a></li>
            </ul>
        </td>
    </tr>
    <tr>
        <td><strong>1.4-M1</strong>
            <p> Released: <strong>March 23, 2020</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4-M1">Release on GitHub</a></p>
        </td>
        <td>
            <ul>
                <li>More powerful type inference algorithm</li>
                <li>SAM conversions for Kotlin classes</li>
                <li>New backend for Kotlin/JS that brings major improvements to the resulting artifacts</li>
                <li>And many other improvements</li>
            </ul>
            <p> For more details, please refer to <a href="https://blog.jetbrains.com/kotlin/2020/03/kotlin-1-4-m1-released/" target="_blank">the blog post</a>.</p>
         </td>
        <td>
            <ul>
                <li><a href="https://github.com/Kotlin/kotlinx.serialization"><strong>kotlinx.serialization</strong></a> version: <a href="https://bintray.com/kotlin/kotlinx/kotlinx.serialization.runtime/0.20.0-1.4-M1">0.20.0-1.4-M1</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.coroutines"><strong>kotlinx.coroutines</strong></a> version: <a href="https://bintray.com/kotlin/kotlinx/kotlinx.coroutines/1.3.5-1.4-M1">1.3.5-1.4-M1</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.atomicfu"><strong>kotlinx.atomicfu</strong></a> version: <a href="https://bintray.com/kotlin/kotlinx/kotlinx.atomicfu/0.14.2-1.4-M1">0.14.2-1.4-M1</a></li>          
                <li><a href="https://ktor.io/"><strong>ktor</strong></a> version: <a href="https://bintray.com/kotlin/ktor/ktor/1.3.2-1.4-M1">1.3.2-1.4-M1</a></li>
            </ul>
        </td>
    </tr>
</table>
       

                
                

                

                