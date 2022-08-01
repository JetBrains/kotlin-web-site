[//]: # (title: Set up an environment)

<microformat>
    <p>This is a part of the <strong>Getting started with Kotlin Multiplatform Mobile</strong> tutorial:</p>
    <p><img src="icon-1.svg" width="20" alt="First step"/> <strong>Set up an environment</strong><br/><img src="icon-2-todo.svg" width="20" alt="Second step"/> Create your first cross-platform app<br/><img src="icon-3-todo.svg" width="20" alt="Third step"/> Add dependencies<br/><img src="icon-4-todo.svg" width="20" alt="Fourth step"/> Upgrade your app<br/><img src="icon-5-todo.svg" width="20" alt="Fifth step"/> Wrap up your project</p>
</microformat>

Before you create your first application that works on both iOS and Android, first you'll need to set up an environment for Kotlin Multiplatform
Mobile development.

> To write iOS-specific code and run an iOS application on a simulated or real device, you'll need a Mac with macOS.
> This cannot be performed on other operating systems, such as Microsoft Windows. This is an Apple requirement.
>
{type="warning"}

## Install the necessary tools

We recommend that you install the latest stable versions for compatibility and better performance.

<table>
   <tr>
      <td>Tool</td>
      <td>Comments</td>
   </tr>
    <tr>
        <td><a href="https://developer.android.com/studio">Android Studio</a></td>
        <td>You will use Android Studio to create your multiplatform applications and run them on simulated or hardware devices.</td>
    </tr>
    <tr>
        <td><a href="https://apps.apple.com/us/app/xcode/id497799835">Xcode</a></td>
        <td>Most of the time, Xcode will work in the background. You will use it to add Swift or Objective-C code to your iOS application.</td>
   </tr>
   <tr>
        <td><a href="https://www.oracle.com/java/technologies/javase-downloads.html">JDK</a></td>
        <td>To check whether it's installed, run the following command in the Android Studio terminal or your command-line tool: <code style="block"
            lang="bash">java -version</code></td>
   </tr>
   <tr>
        <td><a href="multiplatform-mobile-plugin-releases.md">Kotlin Multiplatform Mobile plugin</a></td>
        <td>In Android Studio, select <strong>Settings/Preferences | Plugins</strong>, search <strong>Marketplace</strong> for <i>Kotlin Multiplatform Mobile</i>, and then install it.</td>
   </tr>
   <tr>
        <td><a href="plugin-releases.md#update-to-a-new-release">Kotlin plugin</a></td>
        <td><p>The Kotlin plugin should be compatible with the Kotlin Multiplatform Mobile plugin. Refer to the <a href="multiplatform-mobile-plugin-releases.md#release-details">compatibility table</a>.</p>
            <p>To update the plugin, in Android Studio navigate to <strong>Tools | Kotlin | Configure Kotlin Plugin Updates</strong> and then select the latest version in the <strong>Stable</strong> channel.</p></td>
   </tr>
   <tr>
        <td><a href="https://cocoapods.org/">CocoaPods</a></td>
        <td><p>CocoaPods is useful for adding iOS dependencies, which you'll make use of in later steps. CocoaPods is built with Ruby, and you can install it with the default Ruby available on macOS.</p>
            <p>In the Android Studio terminal or your command-line tool, run the following commands:</p>
            <p><code style="block"
               lang="ruby" prompt="$">sudo gem install cocoapods</code></p>
         </td>
   </tr>
</table>

## Check your environment

To make sure everything works as expected, install and run the KDoctor tool:

> KDoctor works on macOS only.
>
{type="note"}

1. In the Android Studio terminal or your command-line tool, run the following command to install the tool using Homebrew:

    ```bash
    brew install kdoctor
    ```

   If you don't have Homebrew yet, [install it](https://brew.sh/) or see the KDoctor [README](https://github.com/Kotlin/kdoctor#installation) for other ways to install it.
2. After the installation is completed, call KDoctor in the console: 

    ```bash
    kdoctor
    ```

3. If KDoctor diagnoses any problems while checking your environment, review the output for issues and possible solutions:

   * Fix any failed checks (`[x]`). You can find problem descriptions and potential solutions after the `*` symbol.
   * Check the warnings (`[!]`) and successful messages (`[v]`). They may contain useful notes and tips, as well.

## Possible issues and solutions

<deflist collapsible="true">
   <def title="Android Studio">
      Make sure that you have Android Studio installed. You can get it from its <a href="https://developer.android.com/studio">official website.</a>
   </def>
   <def title="Java and JDK">
      <list>
         <ul>
            <li>Make sure that you have JDK installed. You can get it from its <a href="https://www.oracle.com/java/technologies/javase-downloads.html">official website</a>.</li>
           <li>Android Studio uses a bundled JDK to execute Gradle tasks. To configure the Gradle JDK in Android Studio, select <strong>Settings/Preferences | Build, Execution, Deployment | Build Tools | Gradle</strong>.</li>
           <li>You might encounter issues related to <code>JAVA_HOME</code>. This environment variable specifies the location of the Java binary required for Xcode and Gradle. If so, follow KDoctor's tips to fix the issues.</li>
         </ul>
      </list>
   </def>
   <def title="Xcode">
      <ul>
         <li>Make sure that you have Xcode installed. You can get it from its <a href="https://developer.apple.com/xcode/">official website</a>.</li>
        <li>Xcode also requires you to accept its license and performs some initial tasks on the first launch. To do so, launch Xcode in a separate window.</li>
      </ul>
   </def>
   <def title="Kotlin plugins">
        <list>
            <ul>
               <li>Make sure that both the Kotlin and Kotlin Mobile Multiplatform plugins are installed and enabled. In Android Studio, select <strong>Settings/Preferences | Tools | Plugins</strong> and then
              verify that you have both plugins enabled in the <strong>Installed</strong> tab. If either is missing, search <strong>Marketplace</strong> and install it.
              </li>
              <li>
                  <p>The current version of the Kotlin Multiplatform Mobile plugin may be incompatible with your version of Kotlin. Refer to the <a href="https://kotlinlang.org/docs/multiplatform-mobile-plugin-releases.html#release-details">compatibility table</a>.</p>
                  <p>To update the Kotlin version, in Android Studio select <strong>Tools | Kotlin | Configure Kotlin Plugin Updates</strong>.</p>
                  <p>To update the Kotlin Multiplatform Mobile plugin, select <strong>Settings/Preferences | Tools | Plugins</strong>. Next to the plugin name, click <strong>Update</strong>.</p>
              </li>
            </ul>
         </list>
   </def>
   <def title="CocoaPods">
        <p>Make sure you have the <a href="https://guides.cocoapods.org/using/getting-started.html#installation">CocoaPods dependency manager</a> installed.</p>
        <note><p>We recommend using the latest Kotlin version. If your current version is earlier than 1.7.0, you should also install the <a href="https://github.com/square/cocoapods-generate#installation"><code>cocoapods-generate</code> plugin</a>.</p></note>
        <p>If you don't have Ruby installed on your device or have issues with CocoaPods installation, use these guides:</p>
        <list>
            <ul>
               <li><a href="https://www.ruby-lang.org/en/documentation/installation/">Installing Ruby</a>. You can install Ruby with Homebrew, RVM, or other package managers.</li>
               <li><a href="https://rubygems.org/pages/download">Download RubyGems</a>, a package management framework for Ruby.</li>
            </ul>
         </list>
         <p>If you have Ruby 3.0.0 or later, you might encounter a compatibility error with <code>cocoapods-generate</code>. In this case, downgrade Ruby.</p>
    </def>
   <def title="Command line">
         <list>
            <p>Make sure you have all the necessary tools installed:</p>
            <ul>
              <li><code>command not found: brew</code> — <a href="https://brew.sh/">install Homebrew</a>.</li>
              <li><code>command not found: java</code> — <a href="https://www.oracle.com/java/technologies/javase-downloads.html">install Java</a>.</li>
              <li>
                 <p><code>command not found: gem</code> — RubyGems come built-in with Ruby 1.9 or later. Ruby should be available on macOS by default.</p>
                 <p>If you don't have Ruby, follow <a href="https://www.ruby-lang.org/en/documentation/installation/">this guide</a> to install it. You can get the RubyGems package management framework from its <a href="https://rubygems.org/pages/download/">official website</a>.</p>
              </li>
           </ul>
         </list>
    </def>
</deflist>

## Next step

Once the setup is complete, you can start [creating your first cross-platform mobile application](multiplatform-mobile-create-first-app.md).

## Get help

* **Kotlin Slack**. Get an [invite](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) and join the [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) channel.
* **Kotlin issue tracker**. [Report a new issue](https://youtrack.jetbrains.com/newIssue?project=KT).