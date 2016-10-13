---
type: tutorial
layout: tutorial
title:  "Creating Kotlin/JavaScript library with IntelliJ IDEA"
description: "This tutorials walks us through creating a simple Kotlin/JavaScript library using IntelliJ IDEA."
authors: 
date: 
showAuthorInfo: false
---
### Setting up the environment
The tutorial works with IntelliJ IDEA Community Edition as well as IntelliJ IDEA Ultimate.
For best experience developing Kotlin/JavaScript applications, we recommend using IntelliJ IDEA Ultimate,
which includes the JavaScript debugger and other JavaScript support features.

1. Create a New Kotlin/JavaScript Project.

   ![Kotlin New Project]({{ url_for('tutorial_img', filename='create-library-js/create_new_project.png') }})

2. Specify the project name (e.g. sample-library), and click the *Create* for Kotlin JS library.

   ![Kotlin New Project]({{ url_for('tutorial_img', filename='create-library-js/name_for_project.png') }})

3. Select "Use library from plugin". Of cource, you can choose copy library to some directory in your project, if you prefer.

   ![Kotlin New Project]({{ url_for('tutorial_img', filename='create-library-js/creating_project_library.png') }})

4. Click the *Finish*.

   ![Kotlin New Project]({{ url_for('tutorial_img', filename='create-library-js/finish_creating_project.png') }})

5. We should now have the new project created and the following folder structure

   ![Kotlin New Project]({{ url_for('tutorial_img', filename='create-library-js/folder_structure.png') }})

6. Let's create a new Kotlin file under the source folder. It can be named anything. In our case we will call it *library*:
   
   ``` kotlin
   package org.sample
   
   fun factorial(n: Int): Long = if (n == 0) 1 else n * factorial(n - 1)
   ``` 

7. Using *File > Settings*, check compiler settings for Kotlin compiler. Disable "Copy library runtime files".

   ![Kotlin New Project]({{ url_for('tutorial_img', filename='create-library-js/compiler_settings.png') }})

   Click the *Build > Make Project*, and check that out/production directory contains two new files.

   ![Kotlin New Project]({{ url_for('tutorial_img', filename='create-library-js/two_files.png') }})

8. Open Project Structure Dialog (*File > Project Structure*), select *Artifacts* and add new empty artifact.

   ![Kotlin New Project]({{ url_for('tutorial_img', filename='create-library-js/create_artifact.png') }})

   Choose name for artifact and add module compilation output to the content of newly created artifact.

   ![Kotlin New Project]({{ url_for('tutorial_img', filename='create-library-js/tune_artifact.png') }})
   
9. Click the *Build > Build Artifacts*, and the resulting artifact is our library, which can be distributed.

   ![Kotlin New Project]({{ url_for('tutorial_img', filename='create-library-js/created_artifact.png') }})

   
   [intellijdownload]: http://www.jetbrains.com/idea/download/index.html
[jetbrains]: http://www.jetbrains.com
[getting_started_command_line]: command-line.html
