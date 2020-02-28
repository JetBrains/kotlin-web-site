---
type: tutorial
layout: tutorial
title:  "Hello Kotlin/Native using IntelliJ IDEA"
description: "A look at how to create a Kotlin/Native application using IntelliJ IDEA"
authors: Hadi Hariri
date: 2020-01-15
---

<!--- To become a How-To. Need to change type to new "HowTo" --->


## Creating a new Kotlin/Native project in IntelliJ IDEA

This following is applicable to both [IntelliJ IDEA Community Edition as well as the Ultimate Edition](https://www.jetbrains.com/idea).


From the **File** menu in IntelliJ IDEA or **Welcome screen**, select to create a new Project and in the first step of the Wizard
select **Kotlin** on the left hand column and **Native | Gradle** on the right hand.

![Wizard Step One]({{ url_for('tutorial_img', filename='native/using-intellij-idea/wizard.png')}})

Click **Next** in the dialog and in the next step make sure **Automatically import this project on changes in build script** is checked. This is useful when starting
out to make sure any immediate changes to the build script are imported automatically. 

![Wizard Step Two]({{ url_for('tutorial_img', filename='native/using-intellij-idea/wizard-2.png')}})

On clicking **Next**, enter the path and name for the project.

![Wizard Step Three]({{ url_for('tutorial_img', filename='native/using-intellij-idea/wizard-3.png')}})

This will complete the process and open the newly created project in the IDE. By default the wizard will create the necessary
`Sample<TARGET>.kt` file and provide code for writing some string to the standard output. Note that `<TARGET>` varies based on the operating
system the project was created on (Windows, Linux, macOS).

![Project]({{ url_for('tutorial_img', filename='native/using-intellij-idea/IDE-1.png')}})

To run the project, simply invoke the [Run command in the IDE](https://www.jetbrains.com/help/idea/running-applications.html), by using the corresponding shortcuts or from the Run menu

![Run]({{ url_for('tutorial_img', filename='native/using-intellij-idea/IDE-2.png')}})

The sample project can serve as the basis for any new project for Kotlin/Native.

## What's next?

For further information, check out:

* [Kotlin/Native Gradle plugin](/docs/reference/native/gradle_plugin.html)
* [Building Multiplatform Projects with Gradle](/docs/reference/building-mpp-with-gradle.html)

