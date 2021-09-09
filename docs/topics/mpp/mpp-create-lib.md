[//]: # (title: Create a multiplatform library)

This section provides steps for creating a multiplatform library. You can also complete the [tutorial](multiplatform-library.md) 
where you will create a multiplatform library, test it, and publish it to Maven.

1. In IntelliJ IDEA, select **File** \| **New** \| **Project**.
2. In the panel on the left, select **Kotlin**.
3. Enter a project name, then in the **Multiplatform** section select **Library** as the project template.

    ![Select a project template](mpp-project-1.png)

4. Select the Gradle DSL – Kotlin or Groovy.
5. Click **Next**.

You can finish creating the project by clicking **Finish** on the next screen or configure it if necessary:

6. Add the target platforms and modules by clicking the + icon.

7. Configure target settings, such as the target template, JVM target version, and test framework.    

    ![Configure the project](mpp-project-2.png)

8. If necessary, specify dependencies between modules:
    *   Multiplatform and Android modules
    *   Multiplatform and iOS modules
    *   JVM modules  
    
    ![Add module dependencies](mpp-project-3.png)

9. Click **Finish**.

The new project opens. 

## What's next?

* [Understand the multiplatform project structure](mpp-discover-project.md). 
* [Create and publish a multiplatform library – tutorial](multiplatform-library.md).
* [Create your first KMM application for Android and iOS – tutorial](kmm-create-first-app.md).
* [Create a full-stack web app with Kotlin Multiplatform – hands-on tutorial](https://play.kotlinlang.org/hands-on/Full%20Stack%20Web%20App%20with%20Kotlin%20Multiplatform/01_Introduction).
