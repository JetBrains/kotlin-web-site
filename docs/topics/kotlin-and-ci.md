[//]: # (title: Kotlin and continuous integration with TeamCity)

On this page, you'll learn how to set up [TeamCity](https://www.jetbrains.com/teamcity/) to build your Kotlin project.
For more information and basics of TeamCity please check the [Documentation page](https://www.jetbrains.com/teamcity/documentation/)
which contains information about installation, basic configuration, etc.

Kotlin works with different build tools, so if you're using a standard tool such as Ant, Maven or Gradle,
the process for setting up a Kotlin project is no different to any other language or library that integrates with these tools.
Where there are some minor requirements and differences is when using the internal build system of IntelliJ IDEA,
which is also supported on TeamCity.

## Gradle, Maven, and Ant

If using Ant, Maven or Gradle, the setup process is straightforward. All that is needed is to define the Build Step.
For example, if using Gradle, simply define the required parameters such as the Step Name and Gradle tasks that need
executing for the Runner Type.

<img src="teamcity-gradle.png" alt="Gradle Build Step" width="700"/>

Since all the dependencies required for Kotlin are defined in the Gradle file, nothing else needs to be configured
specifically for Kotlin to run correctly.

If using Ant or Maven, the same configuration applies. The only difference being that the Runner Type would be Ant or Maven respectively.

## IntelliJ IDEA Build System

If using IntelliJ IDEA build system with TeamCity, make sure that the version of Kotlin being used by IntelliJ IDEA
is the same as the one that TeamCity runs. You may need to download the specific version of the Kotlin plugin
and install it on TeamCity.

Fortunately, there is a meta-runner already available that takes care of most of the manual work. If not familiar with
the concept of TeamCity meta-runners, check the [documentation](https://www.jetbrains.com/help/teamcity/working-with-meta-runner.html).
They are very easy and powerful way to introduce custom Runners without the need to write plugins.

### Download and install the meta-runner

The meta-runner for Kotlin is available on [GitHub](https://github.com/jonnyzzz/Kotlin.TeamCity).
Download that meta-runner and import it from the TeamCity user interface

<img src="teamcity-metarunner.png" alt="Meta-runner" width="700"/>

### Setup Kotlin compiler fetching step

Basically this step is limited to defining the Step Name and the version of Kotlin you need. Tags can be used.

<img src="teamcity-setupkotlin.png" alt="Setup Kotlin Compiler" width="700"/>

The runner will set the value for the property system.path.macro.KOTLIN.BUNDLED to the correct one based on the path settings
from the IntelliJ IDEA project. However, this value needs to be defined in TeamCity (and can be set to any value).
Therefore, you need to define it as a system variable.

### Setup Kotlin compilation step

The final step is to define the actual compilation of the project, which uses the standard IntelliJ IDEA Runner Type.

<img src="teamcity-idearunner.png" alt="IntelliJ IDEA Runner" width="700"/>

With that, our project should now build and produce the corresponding artifacts.

## Other CI servers

If using a continuous integration tool different to TeamCity, as long as it supports any of the build tools,
or calling command line tools, compiling Kotlin and automating things as part of a CI process should be possible.

