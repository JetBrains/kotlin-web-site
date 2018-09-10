---
type: tutorial
layout: tutorial
title: "Teaching Kotlin with EduTools plugin"
description: "This tutorial will walk you through creating a simple Kotlin course with a set of programming tasks and integrated tests."
authors: Tatiana Vasilyeva
showAuthorInfo: false
---

With [EduTools](https://plugins.jetbrains.com/plugin/10081-edutools) plugin you can learn and teach Kotlin through code practicing tasks. It is available both in [Android Studio](https://developer.android.com/studio) and [IntelliJ IDEA](https://www.jetbrains.com/idea/). This tutorial describes course creation for an educator. If you want to use EduTools plugin for learning, read ["Learning Kotlin with EduTools plugin"](/docs/tutorials/edu-tools-learner.html).  

### Installing EduTools plugin

Go to **Preferences -> Plugins** (or **Configure -> Plugins** from the **Welcome Screen**), press **Install JetBrains Plugin...** and search for EduTools plugin:

![Installing EduTools plugin]({{ url_for('tutorial_img', filename='education/install_plugin.png') }})

When installed for the first time, EduTools plugin asks if you're a Learner or an Educator. Please choose **Educator** to enable course creation functionality:

![Educator role]({{ url_for('tutorial_img', filename='education/teaching/educator.png') }})

*If you need to enable the course creation functionality later, you can go to **Help Menu -> Enable Course Creator Features**.*

### Creating a course

To create a course, go to **Create New Course** from the **Welcome Screen** or in the **File Menu**, fill in the title, author and description:

![Creating a course]({{ url_for('tutorial_img', filename='education/teaching/course_creation.png') }})

Every Kotlin course created with EduTools is structured as a list of lessons. Each lesson contains tasks. A task has the following components: a description, a `Task.kt` file with exercise code, a `Tests.kt` file with the task check, and any other files needed for the learner to complete the task.

Go to **View -> Tool Windows -> Project** to look at the course structure:

![Course structure]({{ url_for('tutorial_img', filename='education/teaching/course_structure.png') }})

Add more lessons and tasks via the **File Menu -> New**, drag-n-drop items to reorder them, or to rename items right-click them then in the menu use **Refactor -> Rename**:

![Rename a task]({{ url_for('tutorial_img', filename='education/teaching/rename_task.png') }})

*If you need additional files for the task, just add them and decide whether you want to make them visible to learners or not with the **Course Creator -> Make Visible to / Hide from Student**.*

### Working with tasks

Open `Task.kt` file to write the code you want for the exercise:

![Task code]({{ url_for('tutorial_img', filename='education/teaching/task_code.png') }}) 

Once the code is ready, select a fragment you want a learner to fill in, invoke **Add Answer Placeholder** command from the right-click menu and add the placeholder text and some hints to help the learner find the right solution:

![Answer placeholder]({{ url_for('tutorial_img', filename='education/teaching/answer_placeholder.png') }}) 

If you want to see how your task will be look to the learner, right-click the `Task.kt` file in the **Project** tool window, and choose **Course Creator -> Show Preview**:

![Task preview]({{ url_for('tutorial_img', filename='education/teaching/task_preview.png') }}) 

Now it's time to add the task description. Click the **Edit** icon at the top of **Task Description** panel to switch to the editing mode:

![Task description editing]({{ url_for('tutorial_img', filename='education/teaching/task_description_editing.png') }})  
![Task description preview]({{ url_for('tutorial_img', filename='education/teaching/task_description_preview.png') }}) 

*EduTools supports HTML and Markdown, so you can start editing with your preferred format, or even a combination of both.*

### Writing tests

You can write your custom tests using EduTools testing framework to automatically verify the learner's solution. Every task has a `Tests.kt` file already filled in with a test template that you will need to modify:

![Test file]({{ url_for('tutorial_img', filename='education/teaching/test_file.png') }})

Let's replace `testSolution()` function content with the following:

![Write test]({{ url_for('tutorial_img', filename='education/teaching/write_test.png') }})

To check that your code passes your own test click the **Check** icon at the top of **Task Description** panel. If your code and test are correct, you will see the **"Congratulations!"** text:

![Write test]({{ url_for('tutorial_img', filename='education/teaching/test_passed.png') }})

### Course preview

When you have finished creating your course, it's a good idea to view your course from a learner's perspective and test it. Right-click on the course view and go to **Course Creator -> Create Course Preview** to open your course in learner mode:

![Course preview]({{ url_for('tutorial_img', filename='education/teaching/course_preview.png') }})

So you can solve tasks:

![Course preview]({{ url_for('tutorial_img', filename='education/teaching/course_preview_1.png') }})

And verify them:

![Course preview]({{ url_for('tutorial_img', filename='education/teaching/course_preview_2.png') }})


### Course sharing

You can share your learning materials publicly or privately with your students or co-workers on [Stepik](https://stepik.org/), a learning management and MOOC platform. Or you can save your course as an archive file.

To save your course as a zip file, go to **Course Creator -> Generate Course Archive** action. The generated archive can be opened via the **Browse Courses** available from the **Welcome Screen** and in the **File Menu** with the **Import Course** icon:
 
![Import course]({{ url_for('tutorial_img', filename='education/teaching/import_course.png') }})

![Import course]({{ url_for('tutorial_img', filename='education/teaching/import_course_2.png') }})

If you have an account on [Stepik](https://stepik.org/), you can easily upload your course there, update it anytime you need, and [share publicly or privately](https://blog.jetbrains.com/pycharm/2017/06/integration-with-stepik-for-educators/).