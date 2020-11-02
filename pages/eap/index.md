---
layout: default
title: Participate in the Kotlin Early Access Preview
main_nav_id: eap
---

# Participate in the Kotlin Early Access Preview (EAP)

You can participate in the Kotlin Early Access Preview (EAP) to try out the latest Kotlin features before they are released.

We ship a few Milestone (M) builds before every feature (_1.x_) and incremental (_1.x.y_) release. 

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

## Build details

<table>
    <tr>
        <th>Build info</th>
        <th>Build highlights</th>
        <th>kotlinx library versions</th>
    </tr>
    <tr>
        <td><strong>1.4.20-RC</strong>
            <p> Released: <strong>November 2, 2020</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4.20-RC">Release on GitHub</a></p>
        </td>
        <td>
            <ul>
                <li>Experimental extensions for java.nio.file.Path</li>
                <li>Experimental support for Dukat binaries generation</li>
                <li>Support for JVM target bytecode version 15</li>
                <li>Other improvements and bugfixes</li>
            </ul>
            <p>For more details, please refer to the <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4.20-RC">changelog</a>.</p>
         </td>
        <td>
            <ul>
                 <li><a href="https://github.com/Kotlin/kotlinx.serialization" target="_blank"><strong>kotlinx.serialization</strong></a> version: <a href="https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.0.0" target="_blank">1.0.0</a></li>
                 <li><a href="https://github.com/Kotlin/kotlinx.coroutines" target="_blank"><strong>kotlinx.coroutines</strong></a> version: <a href="https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.3.9" target="_blank">1.3.9</a></li>
                 <li><a href="https://github.com/Kotlin/kotlinx.atomicfu" target="_blank"><strong>kotlinx.atomicfu</strong></a> version: <a href="https://github.com/Kotlin/kotlinx.atomicfu/releases/tag/0.14.4" target="_blank">0.14.4</a></li>          
                 <li><a href="https://ktor.io/" target="_blank"><strong>ktor</strong></a> version: <a href="https://github.com/ktorio/ktor/releases/tag/1.4.0" target="_blank">1.4.0</a></li>
                 <li><a href="https://github.com/Kotlin/kotlinx.html" target="_blank"><strong>kotlinx.html</strong></a> version: <a href="https://github.com/Kotlin/kotlinx.html/releases/tag/0.7.2" target="_blank">0.7.2</a></li>
                 <li><a href="https://github.com/Kotlin/kotlinx-nodejs" target="_blank"><strong>kotlinx-nodejs</strong></a> version: <a href="https://bintray.com/kotlin/kotlinx/kotlinx.nodejs/0.0.6" target="_blank">0.0.6</a></li>
              </ul>
        </td>
    </tr>
    <tr>
        <td><strong>1.4.20-M2</strong>
            <p> Released: <strong>October 19, 2020</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4.20-M2">Release on GitHub</a></p>
        </td>
        <td>
            <ul>
                <li>Fixes in code inspections and formatting</li>
                <li>Performance improvements</li>
                <li>Other improvements and bugfixes</li>
            </ul>
            <p>For more details, please refer to the <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4.20-M2">changelog</a>.</p>
         </td>
        <td>
            <ul>
                 <li><a href="https://github.com/Kotlin/kotlinx.serialization" target="_blank"><strong>kotlinx.serialization</strong></a> version: <a href="https://github.com/Kotlin/kotlinx.serialization/releases/tag/v1.0.0" target="_blank">1.0.0</a></li>
                 <li><a href="https://github.com/Kotlin/kotlinx.coroutines" target="_blank"><strong>kotlinx.coroutines</strong></a> version: <a href="https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.3.9" target="_blank">1.3.9</a></li>
                 <li><a href="https://github.com/Kotlin/kotlinx.atomicfu" target="_blank"><strong>kotlinx.atomicfu</strong></a> version: <a href="https://github.com/Kotlin/kotlinx.atomicfu/releases/tag/0.14.4" target="_blank">0.14.4</a></li>          
                 <li><a href="https://ktor.io/" target="_blank"><strong>ktor</strong></a> version: <a href="https://github.com/ktorio/ktor/releases/tag/1.4.0" target="_blank">1.4.0</a></li>
                 <li><a href="https://github.com/Kotlin/kotlinx.html" target="_blank"><strong>kotlinx.html</strong></a> version: <a href="https://github.com/Kotlin/kotlinx.html/releases/tag/0.7.2" target="_blank">0.7.2</a></li>
                 <li><a href="https://github.com/Kotlin/kotlinx-nodejs" target="_blank"><strong>kotlinx-nodejs</strong></a> version: <a href="https://bintray.com/kotlin/kotlinx/kotlinx.nodejs/0.0.6" target="_blank">0.0.6</a></li>
              </ul>
        </td>
    </tr>
    <tr>
        <td><strong>1.4.20-M1</strong>
            <p> Released: <strong>September 28, 2020</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4.20-M1">Release on GitHub</a></p>
        </td>
        <td>
            <ul>
                <li>New Kotlin/JS project templates</li>
                <li>Kotlin/JS Gradle plugin upgrades</li>
                <li>Performance improvements</li>
                <li>Other improvements and bugfixes</li>
            </ul>
            <p>For more details, please refer to the <a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4.20-M1">changelog</a>.</p>
         </td>
        <td>
            <ul>
                 <li><a href="https://github.com/Kotlin/kotlinx.serialization" target="_blank"><strong>kotlinx.serialization</strong></a> version: <a href="https://github.com/Kotlin/kotlinx.serialization/releases/tag/1.0.0-RC" target="_blank">1.0.0-RC</a></li>
                 <li><a href="https://github.com/Kotlin/kotlinx.coroutines" target="_blank"><strong>kotlinx.coroutines</strong></a> version: <a href="https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.3.9" target="_blank">1.3.9</a></li>
                 <li><a href="https://github.com/Kotlin/kotlinx.atomicfu" target="_blank"><strong>kotlinx.atomicfu</strong></a> version: <a href="https://github.com/Kotlin/kotlinx.atomicfu/releases/tag/0.14.4" target="_blank">0.14.4</a></li>          
                 <li><a href="https://ktor.io/" target="_blank"><strong>ktor</strong></a> version: <a href="https://github.com/ktorio/ktor/releases/tag/1.4.0" target="_blank">1.4.0</a></li>
                 <li><a href="https://github.com/Kotlin/kotlinx.html" target="_blank"><strong>kotlinx.html</strong></a> version: <a href="https://github.com/Kotlin/kotlinx.html/releases/tag/0.7.2" target="_blank">0.7.2</a></li>
                 <li><a href="https://github.com/Kotlin/kotlinx-nodejs" target="_blank"><strong>kotlinx-nodejs</strong></a> version: <a href="https://bintray.com/kotlin/kotlinx/kotlinx.nodejs/0.0.6" target="_blank">0.0.6</a></li>
              </ul>
        </td>
    </tr>
</table>
       

                
                

                

                