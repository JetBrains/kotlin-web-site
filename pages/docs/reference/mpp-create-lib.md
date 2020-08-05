---
type: doc
layout: reference
title: "Create a multiplatform library"
---

# Create a multiplatform library

This section provides steps for creating a multiplatform library. You can also complete the [tutorial](../tutorials/mpp/multiplatform-library.html) 
where you will create a multiplatform library, test it, and publish it to Maven.

1. In IntelliJ IDEA, select **File** \| **New** \| **Project**.
2. In the panel on the left, select **Kotlin**.
3. Enter a project name and select **Library** under **Multiplatform** as the project template.  

    ![Select a project template]({{ url_for('asset', path='images/reference/mpp/mpp-project-1.png') }})

4. Select the Gradle DSL – Kotlin or Groovy.
5. Click **Next**.

You can finish creating the project by clicking **Finish** on the next screen or configure it if necessary:

{:start="6"}
6. Add the target platforms and modules by clicking the + icon.
7. Configure target settings, such as the target template, JVM target version, and test framework.    

    ![Configure the project]({{ url_for('asset', path='images/reference/mpp/mpp-project-2.png') }})

8. If necessary, specify dependencies between modules:
    *   Multiplatform and Android modules
    *   Multiplatform and iOS modules
    *   JVM modules  
    
    ![Add module dependencies]({{ url_for('asset', path='images/reference/mpp/mpp-project-3.png') }})

9. Click **Finish**.

The new project opens. [Discover what it includes](mpp-discover-project.html).
