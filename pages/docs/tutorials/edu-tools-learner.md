---
type: tutorial
layout: tutorial
title: "Learning Kotlin with EduTools plugin"
description: "This tutorial walks you through the interactive learning with a set of Kotlin programming tasks."
authors: Tatiana Vasilyeva
showAuthorInfo: false
---

With [EduTools](https://plugins.jetbrains.com/plugin/10081-edutools) plugin you can learn and teach Kotlin through code practicing tasks. It is available both in [Android Studio](https://developer.android.com/studio) and [IntelliJ IDEA](https://www.jetbrains.com/idea/). This tutorial describes the interactive learning. If you want to use the EduTools plugin for teaching, read ["Teaching Kotlin with EduTools plugin"](/docs/tutorials/edu-tools-educator.html).  

### Installing EduTools plugin

Go to **Preferences -> Plugins** (or **Configure -> Plugins** from the **Welcome Screen**), press **Install JetBrains Plugin...** and search for EduTools plugin:

![Installing EduTools plugin]({{ url_for('tutorial_img', filename='education/install_plugin.png') }})

When installed for the first time, the EduTools plugin asks if you're a Learner or an Educator. Please choose **Learner**:

![Learner role]({{ url_for('tutorial_img', filename='education/learning/learner.png') }})

### Joining a course

To open the list of available courses, go to **Browse Courses** on the **Welcome Screen** or in the **File Menu**. You can start with the [Kotlin Koans](/docs/tutorials/koans.html), a series of exercises created to get you familiar with the Kotlin Syntax:

![Join a course]({{ url_for('tutorial_img', filename='education/learning/join_course.png') }})

*If you have a course archive shared with you by your teacher or co-worker, use the **Import Course** icon to open it. You can also log in to [Stepik](https://stepik.org/) with the corresponding link to see all the courses available to you on this MOOC platform.*

### Getting around

To start the course, go to **View -> Tool Windows -> Project**. You will find a course plan, the list of lessons. Every lesson has a set of tasks and code exercises you need to solve. Start with the very first one:

![Course plan]({{ url_for('tutorial_img', filename='education/learning/course_structure.png') }})

Every task has a description that you can read in the **Task Description** panel (**View -> Tool Windows -> Task Description**) and exercise code in the `Task.kt` file:

![Task details]({{ url_for('tutorial_img', filename='education/learning/task_details.png') }})

### Getting started

Now you're ready to start learning. Read the first task description and the exercise code. You will find a placeholder in the exercise code which you need to complete to solve the task:

![Solve a task]({{ url_for('tutorial_img', filename='education/learning/solve_task.png') }})

When you are ready, verify the task with the **Check** icon at the top of **Task Description** panel. If you passed, there will be the **Congratulations!** message:

![Verify task]({{ url_for('tutorial_img', filename='education/learning/check_task.png') }})
![Passed task]({{ url_for('tutorial_img', filename='education/learning/task_passed.png') }})

Go on to the next task with the **Next** icon at the top of **Task Description** panel:

![Next icon]({{ url_for('tutorial_img', filename='education/learning/next_task.png') }})

### Carry on solving

Continue on with the code exercises and learn more about Kotlin. Even if you make a mistake, EduTools will help you if you get stuck. If the verification failed, you will get a message to help you to find the mistake:

![Failed task]({{ url_for('tutorial_img', filename='education/learning/task_failed.png') }})

If you want to start from scratch with the task, use the **Reset** icon at the top of **Task Description** panel: 

![Reset task]({{ url_for('tutorial_img', filename='education/learning/reset_task.png') }})

Or you can fill in the right answer with the **Bulb** icon:

![Get an answer]({{ url_for('tutorial_img', filename='education/learning/get_answer.png') }})

Do not give up early! Make all the exercises green to finish the course:

![Course progress]({{ url_for('tutorial_img', filename='education/learning/course_progress.png') }})