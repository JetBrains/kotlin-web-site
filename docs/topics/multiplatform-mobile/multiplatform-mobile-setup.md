[//]: # (title: 1. Set up an environment)

Before you create your first application that works on both iOS and Android, prepare an environment for Kotlin Multiplatform
Mobile development.

> * To write iOS-specific code and run an iOS application on a simulated or real device, you'll need a Mac with macOS.
> These cannot be performed on other operating systems, such as Microsoft Windows. This is an Apple requirement.
> * To work with shared code or Android-specific code, you can use any computer with an operating system supported by
> Android Studio.
> 
{type="note"}

## Install all the necessary tools

<table>
   <tr>
      <td>Tool</td>
      <td>Version</td>
      <td>Comments</td>
   </tr>
    <tr>
        <td><a href="https://developer.android.com/studio">Android Studio</a></td>
        <td>4.2 or 2020.3.1 Canary 8 or higher</td>
        <td>You will use Android Studio for creating your multiplatform applications and running them on simulated or hardware devices.</td>
    </tr>
    <tr>
        <td><a href="https://apps.apple.com/us/app/xcode/id497799835">Xcode</a></td>
        <td>11.3 or higher</td>
        <td>Most of the time, Xcode will work in the background. You will use it to add Swift or Objective-C code to your iOS application.</td>
   </tr>
   <tr>
        <td><a href="https://www.oracle.com/java/technologies/javase-downloads.html">JDK</a></td>
        <td></td>
        <td>To check if it's installed, run the command <code>java -version</code> in the terminal.</td>
   </tr>
   <tr>
        <td><a href="https://kotlinlang.org/docs/plugin-releases.html#update-to-a-new-release">Kotlin plugin</a></td>
        <td>%kotlinVersion%</td>
        <td><p>You can check the current Kotlin plugin version. In Android Studio, select <strong>Tools | Kotlin | Configure Kotlin Plugin Updates</strong>.</p>
            <p>If needed, update to the latest version in the <strong>Stable</strong> update channel.</p></td>
   </tr>
   <tr>
        <td><a href="https://kotlinlang.org/docs/multiplatform-mobile-plugin-releases.html">Kotlin Multiplatform Mobile plugin</a></td>
        <td></td>
        <td><p>In Android Studio, select <strong>Settings/Preferences | Plugins</strong> and search for <i>Kotlin Multiplatform Mobile</i> in <strong>Marketplace</strong> and install it.</p></td>
   </tr>
   <tr>
        <td>CocoaPods</td>
        <td></td>
        <td><p>CocoaPods is useful for adding iOS dependencies in Kotlin Multiplatform Mobile projects. CocoaPods is built with Ruby; you can install it with the default Ruby available on macOS.</p>
            <p>In the terminal, run the following commands:</p>
            <p><code lang="ruby">$ sudo gem install cocoapods</code></p>
            <p><code lang="ruby">$ sudo gem install cocoapods-generate</code></p>
         </td>
   </tr>
</table>

## Check your environment

To make sure everything works as expected, install and run the KDoctor tool:

> KDoctor works on macOS only.
>
{type="note"}

1. In the terminal, run the following command to install the tool using [Homebrew](https://brew.sh/):

    ```bash
    brew install kdoctor
    ```
   
    For other ways to install KDoctor, see its [README on GitHub](https://github.com/Kotlin/kdoctor).

2. If the installation was successful, call KDoctor in the console: 

    ```bash
    kdoctor
    ```

3. When the process is finished, you'll see a report. If KDoctor has diagnosed problems while checking your environment,
   review the output for issues and possible solutions:

   * Fix failed checks ([x]). You can find problem description and potential solution after the `*` symbol.
   * Check warnings ([!]) and successful messages ([v]). They may contain useful notes and tips as well.

## Possible issues and solutions

<deflist collapsible="true">
   <def title="Android Studio">
      Make sure that you have Android Studio installed. You can get it on the <a href="https://developer.android.com/studio">official website</a>. 
   </def>
   <def title="Java and JDK">
      <list>
         <ul>
            <li>Make sure that you have JDK installed. You can get it on the <a href="https://www.oracle.com/java/technologies/javase-downloads.html">official website</a>.</li>
            <li>Android Studio uses bundled JDK for Gradle tasks execution. To configure Gradle JDK, in Android Studio, select <b>Settings/Preferences | Build, Execution, Deployment | Build Tools | Gradle</b>.</li>
            <li>You may encounter issues related to <code>JAVA_HOME</code>. This environment variable specifies the location of the Java binary necessary for Xcode and Gradle. Follow KDoctor's tips to fix such issues.</li>
         </ul>
      </list>
   </def>
   <def title="Xcode">
      <ul>
         <li>Make sure that you have Xcode installed. You can get it on the <a href="https://developer.apple.com/xcode/">official website</a>.</li>
         <li>Xcode also requires you to accept its license and performs some initial tasks on the first launch. To do so, launch Xcode in a separate window.</li>
      </ul>
   </def>
   <def title="Kotlin plugins">
        <list>
            <ul>
               <li>Make sure that both Kotlin and Kotlin Mobile Multiplatform plugins are installed and enabled. In Android Studio, select <b>Settings/Preferences | Tools | Plugins</b>,
               check that you have both plugins enabled in the <b>Installed</b> tab. Otherwise, go to <b>Marketplace</b> and search for the missing plugins.
               </li>
               <li><p>Current version of the Kotlin Multiplatform Mobile plugin may be incompatible with your version of Kotlin. To update
               the Kotlin version, in Android Studio, select <b>Tools | Kotlin | Configure Kotlin Plugin Updates</b>.</p>
               <p>To update the Kotlin Multiplatform Mobile plugin, select <b>Settings/Preferences | Tools | Plugins</b>. Next to the plugin name, click <b>Update</b>.</p>
               </li>
            </ul>
         </list>
   </def>
   <def title="CocoaPods">
        <p>Make sure you have all the necessary tools installed:</p>
         <list>
            <ul>
               <li><a href="https://guides.cocoapods.org/using/getting-started.html#installation">The CocoaPods dependency manager</a></li>
               <li><a href="https://github.com/square/cocoapods-generate#installation">The <code>cocoapods-generate</code> plugin</a></li>
            </ul>
         </list>
         <p>If you don't have Ruby installed on your device or have issues with CocoaPods installation, use these guides:</p>
         <list>
            <ul>
               <li><a href="https://www.ruby-lang.org/en/documentation/installation/">Installing Ruby</a>. You can install Ruby with Homebrew, RVM, or other package manager</li>
               <li><a href="https://rubygems.org/pages/download">Download RubyGems</a>, a package management framework for Ruby</li>
            </ul>
         </list>
         <p>If you have Ruby 3.0.0 and later, you may encounter a compatibility error with <code>cocoapods-generate</code>. In this case, downgrade Ruby.</p>
    </def>
</deflist>

## What's next?

Now it's time to [create your first cross-platform mobile application](multiplatform-mobile-create-first-app.md).