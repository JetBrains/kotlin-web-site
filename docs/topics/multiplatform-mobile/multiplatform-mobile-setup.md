[//]: # (title: Set up an environment)

<microformat>
    <p>This is the first part of the <strong>Getting started with Kotlin Multiplatform for mobile</strong> tutorial:</p>
    <p><img src="icon-1.svg" width="20" alt="First step"/> <strong>Set up an environment</strong><br/>
       <img src="icon-2-todo.svg" width="20" alt="Second step"/> Create your first cross-platform app<br/>
       <img src="icon-3-todo.svg" width="20" alt="Third step"/> Update UI<br/>       
       <img src="icon-4-todo.svg" width="20" alt="Fourth step"/> Add dependencies<br/>
       <img src="icon-5-todo.svg" width="20" alt="Fifth step"/> Share more logic<br/>
       <img src="icon-6-todo.svg" width="20" alt="Sixth step"/> Wrap up your project</p>
</microformat>

Before you create your first application that works on both iOS and Android, you'll need to set up an environment for Kotlin Multiplatform
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
        <td>
          <p>Most of the time, Xcode will work in the background. You will use it to add Swift or Objective-C code to your iOS application.</p>
            <note>
              <p>
                We generally recommend using the latest stable versions for all tools. However, Kotlin/Native sometimes doesn't support the newest Xcode right away. If that's your case, <a href="https://developer.apple.com/download/all/?q=Xcode">install an earlier version of Xcode</a>.
              </p>
            </note>   
      </td>
   </tr>
   <tr>
        <td><a href="https://www.oracle.com/java/technologies/javase-downloads.html">JDK</a></td>
        <td>To check whether it's installed, run the following command in the Android Studio terminal or your command line: <code style="block"
            lang="bash">java -version</code></td>
   </tr>
   <tr>
        <td><a href="multiplatform-mobile-plugin-releases.md">Kotlin Multiplatform Mobile plugin</a></td>
        <td>In Android Studio, select <strong>Settings/Preferences | Plugins</strong>, search <strong>Marketplace</strong> for <i>Kotlin Multiplatform Mobile</i>, and then install it.</td>
   </tr>
   <tr>
        <td><a href="releases.md#update-to-a-new-release">Kotlin plugin</a></td>
        <td>
            <p>The Kotlin plugin is bundled with each Android Studio release. However, it still needs to be updated to the latest version to avoid compatibility issues.</p> 
            <p>To update the plugin, on the Android Studio welcome screen, select <strong>Plugins | Installed</strong>. Click <strong>Update</strong> next to Kotlin. You can also check the Kotlin version in <strong>Tools | Kotlin | Configure Kotlin Plugin Updates</strong>.</p>
            <p>The Kotlin plugin should be compatible with the Kotlin Multiplatform Mobile plugin. Refer to the <a href="multiplatform-mobile-plugin-releases.md#release-details">compatibility table</a>.</p></td>
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
   
   > You may ignore KDoctor's warnings regarding the CocoaPods installation. In your first project, you will use a
   > different iOS framework distribution option.
   >
   {type="tip"}

## Possible issues and solutions

<deflist collapsible="true">
   <def title="Android Studio">
      Make sure that you have Android Studio installed. You can get it from its <a href="https://developer.android.com/studio">official website.</a>
   </def>
   <def title="Java and JDK">
         <list>
           <li>Make sure that you have JDK installed. You can get it from its <a href="https://www.oracle.com/java/technologies/javase-downloads.html">official website</a>.</li>
           <li>Android Studio uses a bundled JDK to execute Gradle tasks. To configure the Gradle JDK in Android Studio, select <strong>Settings/Preferences | Build, Execution, Deployment | Build Tools | Gradle</strong>.</li>
           <li>You might encounter issues related to <code>JAVA_HOME</code>. This environment variable specifies the location of the Java binary required for Xcode and Gradle. If so, follow KDoctor's tips to fix the issues.</li>
         </list>
   </def>
   <def title="Xcode">
      <list>
         <li>Make sure that you have Xcode installed. You can get it from its <a href="https://developer.apple.com/xcode/">official website</a>.</li>
         <li>Launch Xcode in a separate window to accept its license terms and allow it to perform some necessary initial tasks.</li>
         <li>
            <p><code>Error: can't grab Xcode schemes</code>. If you encounter an error like this, in Xcode, select <strong>Settings/Preferences | Locations</strong>. In the <strong>Command Line Tools</strong> field, select your Xcode.</p>
            <img src="xcode-schemes.png" alt="Xcode schemes" width="500"/>
         </li>
      </list>
   </def>
   <def title="Kotlin plugins">
         <chunk>
            <p><strong>Kotlin Multiplatform Mobile plugin</strong></p>
               <list>
                  <li>Make sure that the Kotlin Mobile Multiplatform plugin is installed and enabled. On the Android Studio welcome screen, select <strong>Plugins | Installed</strong>. Verify that you have the plugin enabled. If it's not in the <strong>Installed</strong> list, search <strong>Marketplace</strong> for it and install the plugin.</li>
                  <li>If the plugin is outdated, click <strong>Update</strong> next to the plugin name. You can do the same in the <strong>Settings/Preferences | Tools | Plugins</strong> section.</li>
                  <li>Check the compatibility of the Kotlin Multiplatform Mobile plugin with your version of Kotlin in the <a href="https://kotlinlang.org/docs/multiplatform-mobile-plugin-releases.html#release-details">Release details</a> table.</li>
               </list>
         </chunk>
         <chunk>
            <p><strong>Kotlin plugin</strong></p>
            <p>Make sure that the Kotlin plugin is updated to the latest version. To do that, on the Android Studio welcome screen, select <strong>Plugins | Installed</strong>. Click <strong>Update</strong> next to Kotlin.</p>
            <p>You can also check the Kotlin version in <strong>Tools | Kotlin | Configure Kotlin Plugin Updates</strong>.</p>
         </chunk>
   </def>
   <def title="Command line">
            <p>Make sure you have all the necessary tools installed:</p>
            <list>
              <li><code>command not found: brew</code> — <a href="https://brew.sh/">install Homebrew</a>.</li>
              <li><code>command not found: java</code> — <a href="https://www.oracle.com/java/technologies/javase-downloads.html">install Java</a>.</li>
           </list>
    </def>
</deflist>

## Next step

In the next part of the tutorial, you'll create your first cross-platform mobile application.

**[Proceed to the next part](multiplatform-mobile-create-first-app.md)**

## Get help

* **Kotlin Slack**. Get an [invite](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) and join the [#multiplatform](https://kotlinlang.slack.com/archives/C3PQML5NU) channel.
* **Kotlin issue tracker**. [Report a new issue](https://youtrack.jetbrains.com/newIssue?project=KT).
