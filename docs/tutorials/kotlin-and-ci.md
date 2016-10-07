---
type: tutorial
layout: tutorial
title:  "Kotlin and Continuous Integration with TeamCity"
description:
authors: Hadi Hariri
date: 2015-02-02
showAuthorInfo: false
---
We're going to see how to set up TeamCity to build our Kotlin project. For more information and basics of TeamCity please check the [Documentation page](https://www.jetbrains.com/teamcity/documentation/)
which contains information about installation, basic configuration, etc.

Kotlin works with different [build tools](build-tools.html), so if we're using a standard tool such as Ant, Maven or Gradle, the process for setting up a Kotlin
project is no different to any other language or library that integrates with these tools. Where there are some minor requirements and differences is when using JBS, which
is the internal build system that IntelliJ IDEA uses, which is also supported on TeamCity.

### Using a standard build tool
If using Ant, Maven or Gradle, the setup process is straightforward. All that is needed is to define the Build Step. In our case, if using Gradle
we'd simply define the required parameters such as the Step Name and Gradle tasks that need executing for the Runner Type.

<br/>
![Gradle Build Step]({{ site.baseurl }}/{{ site.img_tutorial_root }}/kotlin-and-ci/teamcity-gradle.png)
<br/>

Since all the dependencies required for Kotlin are defined in the Gradle file, nothing else needs to be configured specifically for Kotlin to run correctly.

If using Ant or Maven, the same configuration applies. The only difference being that the Runner Type would be Ant or Maven respectively.

### Using IntelliJ IDEA Build System
If using IntelliJ IDEA build system with TeamCity, we need to make sure that the version of Kotlin being used by IntelliJ IDEA is the same as that that TeamCity
runs. This would mean that we need to download the specific version of the Kotlin plugin and install it on TeamCity.

Fortunately, there is a meta-runner already available that takes care of most of the manual work. If not familiar with the concept of TeamCity meta-runners, check the
[documentation](https://confluence.jetbrains.com/display/TCD9/Working+with+Meta-Runner). They are very easy and powerful way to introduce custom Runners without the need to
write plugins

#### Download and install the meta-runner.
The meta-runner for Kotlin is available on [GitHub](https://github.com/jonnyzzz/Kotlin.TeamCity). If using TeamCity 9 or above, we can now simply import that meta-runner
from the TeamCity user interface

<br/>
![Meta-runner]({{ site.baseurl }}/{{ site.img_tutorial_root }}/kotlin-and-ci/teamcity-metarunner.png)
<br/>

If using a previous version, refer to the [documentation on how to add meta-runners](https://confluence.jetbrains.com/display/TCD9/Working+with+Meta-Runner).

#### Setup Kotlin Compiler Fetching Step
Basically this step is limited to defining the Step Name and the version of Kotlin we need. Tags can be used.

<br/>
![Setup Kotlin Compiler]({{ site.baseurl }}/{{ site.img_tutorial_root }}/kotlin-and-ci/teamcity-setupkotlin.png)
<br/>

The runner will set the value for the property system.path.macro.KOTLIN.BUNDLED to the correct one based on the path settings from the IntelliJ IDEA project. However
this value needs to be defined in TeamCity (and can be set to any value). Therefore we need to define it as a system variable.

#### Setup Kotlin Compilation Step
The final step is to define the actual compilation of the project, which uses the standard IntelliJ IDEA Runner Type

<br/>
![IntelliJ IDEA Runner]({{ site.baseurl }}/{{ site.img_tutorial_root }}/kotlin-and-ci/teamcity-idearunner.png)
<br/>


With that, our project should now build and produce the corresponding artifacts.

### Other CI Server
If using a Continuous Integration tool different to TeamCity, as long as it supports any of the build tools, or calling command line tools, compiling Kotlin and automating things
as part of a CI process should be possible.


