[//]: # (title: Supported platforms)

Kotlin supports the following platforms and provides target presets for each platform. See how to [use a target preset](mpp-set-up-targets.md).

<table>
    <tr>
        <th>Target platform</th>
        <th>Target preset</th>
        <th>Comments</th>
    </tr>
    <tr>
        <td>Kotlin/JVM</td>
        <td><code>jvm</code></td>
        <td></td>
    </tr>
    <tr>
        <td>Kotlin/JS</td>
        <td><code>js</code></td>
        <td>
            <p>Select the execution environment:</p>
            <ul>
                <li><code>browser {}</code> for applications running in the browser.</li>
                <li><code>nodejs{}</code> for applications running on Node.js.</li>
            </ul>
            <p>Learn more in <a href="js-project-setup.md#execution-environments">Setting up a Kotlin/JS project</a>.</p>
        </td>
    </tr>
    <tr>
        <td>Android applications and libraries</td>
        <td><code>android</code></td>
        <td>
            <p>Manually apply an Android Gradle plugin  – <code>com.android.application</code> or <code>com.android.library</code>.</p>
            <p>You can only create one Android target per Gradle subproject.</p>
        </td>
    </tr>
    <tr>
        <td>Android NDK</td>
        <td><code>androidNativeArm32</code>, <code>androidNativeArm64</code></td>
        <td>
            <p>The 64-bit target requires a Linux or macOS host.</p>
            <p>You can build the 32-bit target on any supported host.</p>
        </td>
    </tr>
    <tr>
        <td>iOS</td>
        <td><code>iosArm32</code>, <code>iosArm64</code>, <code>iosX64</code>, <code>iosSimulatorArm64</code></td>
        <td>Requires a macOS host.</td>
    </tr>
    <tr>
        <td>watchOS</td>
        <td><code>watchosArm32</code>, <code>watchosArm64</code>, <code>watchosX86</code>, <code>watchosX64</code>, <code>watchosSimulatorArm64</code></td>
        <td>Requires a macOS host.</td>
    </tr>
    <tr>
        <td>tvOS</td>
        <td><code>tvosArm64</code>, <code>tvosX64</code>, <code>tvosSimulatorArm64</code></td>
        <td>Requires a macOS host.</td>
    </tr>
    <tr>
        <td>macOS</td>
        <td><code>macosX64</code>, <code>macosArm64</code></td>
        <td>Requires a macOS host.</td>
    </tr>
    <tr>
        <td>Linux</td>
        <td><code>linuxArm64</code>, <code>linuxArm32Hfp</code>, <code>linuxMips32</code>, <code>linuxMipsel32</code>, <code>linuxX64</code></td>
        <td>
            <p>Linux MIPS targets (<code>linuxMips32</code> and <code>linuxMipsel32</code>) require a Linux host.</p>
            <p>You can build other Linux targets on any supported host.</p>
        </td>
    </tr>
    <tr>
        <td>Windows</td>
        <td><code>mingwX64</code>, <code>mingwX86</code></td>
        <td>Requires a Windows host.</td>
    </tr>
    <tr>
        <td>WebAssembly</td>
        <td><code>wasm32</code></td>
        <td></td>
    </tr>
</table>

> A target that is not supported by the current host is ignored during building and therefore not published.
>
{type="note"}
