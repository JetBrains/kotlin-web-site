---
type: doc
layout: reference
title: "Create a multiplatform library"
---

# Create a multiplatform library

1. In IntelliJ IDEA, select **File** \| **New** \| **Project**.
2. In the panel on the left, select **Kotlin**.
3. Enter a project name and select **Multiplatform Library** as the project template.
![Select a project template]({{ url_for('asset', path='images/reference/mpp/select-project.png') }})

4. Select the Gradle DSL – Kotlin or Groovy.
5. Click **Next**.  
You can finish creating the project by clicking **Finish** on the next screen or configure it if necessary.
6. Add the target platforms and modules by clicking the + icon.
7. Configure target settings, such as the target template, JVM target version, and test framework.    
![Configure the project]({{ url_for('asset', path='images/reference/mpp/configure-project.png') }})

8. If necessary, specify dependencies between modules:
    *   Multiplatform and Android modules
    *   Multiplatform and iOS modules
    *   JVM modules
![Add module dependencies]({{ url_for('asset', path='images/reference/mpp/add-dependencies.png') }})

9. Click **Finish**.

The new project opens. Discover what it includes.
