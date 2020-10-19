---
layout: reference
title: Kotlin Releases
---

# Kotlin Releases

We ship different types of releases:

* _Feature releases_ (1._x_) that bring major changes in the language.
* _Incremental releases_ (1._x_._y_) that are shipped between feature releases and include updates in the tooling, 
performance improvements, and bug fixes.
* _Bug fix releases_ (1._x_._yz_) that include bug fixes for incremental releases.

For example, for the feature release 1.3 we had several incremental releases including 1.3.10, 1.3.20, and 1.3.70.
For 1.3.70, we had 2 bug fix releases – 1.3.71 and 1.3.72.

For each incremental and feature release, we also ship several preview (_EAP_) versions for you to try 
new features before they are released. See [Early Access Preview](eap/index.html) for details.

Learn more about [types of Kotlin releases and their compatiblity](https://kotlinlang.org/docs/kotlin-evolution.html#feature-releases-and-incremental-releases). 

## Updating to a new release

IntelliJ IDEA and Android Studio suggest updating to a new release once it is out. When you accept the suggestion,
it automatically updates the Kotlin plugin to the new version. You can check the Kotlin version in **Tools** \| **Kotlin** 
\| **Configure Plugin Updates**.

If you have projects created with earlier Kotlin versions, change the Kotlin version in your projects and update kotlinx
libraries if necessary – check the [recommended versions](#release-details).

If you are migrating to the new feature release, Kotlin plugin's migration tools will help you with the migration.

## Release details

The following table lists details of latest Kotlin releases.

You can also use [preview versions of Kotlin](eap/index.html#build-details).

<table>
    <tr>
        <th>Build info</th>
        <th>Build highlights</th>
        <th>Recommended kotlinx library versions</th>
    </tr>
    <tr>
        <td><strong>1.4.10</strong>
            <p>Released: <strong>September 7, 2020</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4.10" target="_blank">Release on GitHub</a></p>
        </td>
        <td>
            <p>A bug fix release for Kotlin 1.4.0.</p>
            <p>Learn more about <a href="https://blog.jetbrains.com/kotlin/2020/08/kotlin-1-4-released-with-a-focus-on-quality-and-performance/" target="_blank">Kotlin 1.4.0</a>.</p>
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
            <p>The versions of libraries from <code>kotlin-wrappers</code> (such as <code>kotlin-react</code>) can be found in the <a href="https://github.com/JetBrains/kotlin-wrappers" target="_blank">corresponding repository</a>.</p>
        </td>
    </tr>    
    <tr>
        <td><strong>1.4.0</strong>
            <p> Released: <strong>August 17, 2020</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.4.0" target="_blank">Release on GitHub</a></p>
        </td>
        <td>
            <p>A feature release with many features and improvements that mostly focus on quality and performance.</p>
            <p>Learn more in:</p>
            <ul>
                <li><a href="http://blog.jetbrains.com/kotlin/2020/08/kotlin-1-4-released-with-a-focus-on-quality-and-performance/" target="_blank">Release blog post</a></li>
                <li><a href="https://kotlinlang.org/docs/whatsnew14.html" target="_blank">What's new in Kotlin 1.4.0</a></li>
                <li><a href="https://kotlinlang.org/docs/compatibility-guide-14.html" target="_blank">Compatibility Guide</a></li>
                <li><a href="https://kotlinlang.org/docs/whatsnew14.html#migrating-to-kotlin-140" target="_blank">Migrating to Kotlin 1.4.0</a></li>
            </ul>
         </td>
        <td>
            <ul>
                <li><a href="https://github.com/Kotlin/kotlinx.serialization" target="_blank"><strong>kotlinx.serialization</strong>
                </a> version: <a href="https://github.com/Kotlin/kotlinx.serialization/releases/tag/1.0.0-RC" target="_blank">1.0.0-RC</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.coroutines" target="_blank"><strong>kotlinx.coroutines</strong></a>
                version: <a href="https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.3.9" target="_blank">1.3.9
                </a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.atomicfu" target="_blank"><strong>kotlinx.atomicfu</strong></a>
                version: <a href="https://github.com/Kotlin/kotlinx.atomicfu/releases/tag/0.14.4" target="_blank">0.14.4
                </a></li>          
                 <li><a href="https://ktor.io/" target="_blank"><strong>ktor</strong></a> version: <a href="https://github.com/ktorio/ktor/releases/tag/1.4.0" target="_blank">1.4.0</a></li>
                 <li><a href="https://github.com/Kotlin/kotlinx.html" target="_blank"><strong>kotlinx.html</strong></a> version: <a href="https://github.com/Kotlin/kotlinx.html/releases/tag/0.7.2" target="_blank">0.7.2</a></li>
                 <li><a href="https://github.com/Kotlin/kotlinx-nodejs" target="_blank"><strong>kotlinx-nodejs</strong></a> version: <a href="https://bintray.com/kotlin/kotlinx/kotlinx.nodejs/0.0.6" target="_blank">0.0.6</a></li>
            </ul>
            <p>The versions of libraries from <code>kotlin-wrappers</code> (such as <code>kotlin-react</code>) can be found in the <a href="https://github.com/JetBrains/kotlin-wrappers" target="_blank">corresponding repository</a>.</p>
        </td>
    </tr>       
    <tr>
        <td><strong>1.3.72</strong>
            <p> Released: <strong>April 15, 2020</strong></p>
            <p><a href="https://github.com/JetBrains/kotlin/releases/tag/v1.3.72" target="_blank">Release on GitHub</a></p>
        </td>
        <td>
            <p>A bug fix release for Kotlin 1.3.70.</p>
            <p>Learn more about <a href="https://blog.jetbrains.com/kotlin/2020/03/kotlin-1-3-70-released/" target="_blank">Kotlin 1.3.70</a>.</p>
         </td>
        <td>
            <ul>
                <li><a href="https://github.com/Kotlin/kotlinx.serialization" target="_blank"><strong>kotlinx.serialization</strong>
                </a> version: <a href="https://github.com/Kotlin/kotlinx.serialization/blob/master/CHANGELOG.md#0200--2020-03-04" target="_blank">0.20.0</a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.coroutines" target="_blank"><strong>kotlinx.coroutines</strong></a>
                version: <a href="https://github.com/Kotlin/kotlinx.coroutines/releases/tag/1.3.8" target="_blank">1.3.8
                </a></li>
                <li><a href="https://github.com/Kotlin/kotlinx.atomicfu" target="_blank"><strong>kotlinx.atomicfu</strong></a>
                version: <a href="https://github.com/Kotlin/kotlinx.atomicfu/releases/tag/0.14.2" target="_blank">0.14.2
                </a></li>          
                 <li><a href="https://ktor.io/" target="_blank"><strong>ktor</strong></a> version: <a href="https://github.com/ktorio/ktor/releases/tag/1.3.2" target="_blank">1.3.2</a></li>
                 <li><a href="https://github.com/Kotlin/kotlinx.html" target="_blank"><strong>kotlinx.html</strong></a> version: <a href="https://github.com/Kotlin/kotlinx.html/releases/tag/0.7.1" target="_blank">0.7.1</a></li>
                 <li><a href="https://github.com/Kotlin/kotlinx-nodejs" target="_blank"><strong>kotlinx-nodejs</strong></a> version: <a href="https://bintray.com/kotlin/kotlinx/kotlinx.nodejs/0.0.3" target="_blank">0.0.3</a></li>
            </ul>
            <p>The versions of libraries from <code>kotlin-wrappers</code> (such as <code>kotlin-react</code>) can be found in the <a href="https://github.com/JetBrains/kotlin-wrappers" target="_blank">corresponding repository</a>.</p>
        </td>
    </tr>    
</table>

> On the JVM, you usually can use library versions other than the recommended ones.
{:.note}
