---
type: tutorial
layout: tutorial
title: "Quick Ways to Run Kotlin Code "
description: "This tutorial shows the ways to run Kotlin code in a lightweight manner outside of a project."
authors: Pavel Semyonov
date: 2018-12-19
showAuthorInfo: false
related:
    - command-line.md
---

Sometimes you may need to quickly write and execute some code outside of a project or an application. This may be useful, for example, when learning Kotlin or evaluating expressions. It this tutorial, we will go through two ways to quickly run arbitrary Kotlin code.   


### Using Scratches

> Currently, scratches are supported only in Kotlin/JVM projects.
{:.note}

Kotlin plugin for IntelliJ IDEA supports the [scratches](https://www.jetbrains.com/help/idea/scratches.html) feature. Scratches let you create code drafts in the same IDE window with your project and run them on the fly. Scratches are not tied to projects; you can access and run all your scratches from other projects opened in IntelliJ IDEA. 


To create a Kotlin scratch, open the __File__ menu and select __New__ > __Scratch file__. 

![Kotlin Scratch Type]({{ url_for('tutorial_img', filename='quick-run/scratch-create.png') }})

Then select __Kotlin__ in the scratch file type list.

In your scratch, you can can write any valid Kotlin code, including new functions and classes.
Write your code in the scratch and click __Run__. The execution results will appear opposite the the lines of your code.

![Scratch Run Results]({{ url_for('tutorial_img', filename='quick-run/scratch-results.png') }})

If you want to use classes or functions from a project in the scratch, import them as usual and run the scratch within the classpath of the module contains them. To do this, select the module in the __Use classpath of module__ list. To update the module build right before running the scratch, select __Make before Run__.

![Scratch Select Module]({{ url_for('tutorial_img', filename='quick-run/scratch-select-module.png') }})

Additionally, you can run scratch using [REPL](#running-in-repl) by selecting __Use REPL__. The main difference from running the usual way is that the code is executed subsequently, providing the results of each call.

![Scratch REPL]({{ url_for('tutorial_img', filename='quick-run/scratch-repl.png') }})

### Running in REPL

_REPL_ (_Read-Eval-Print-Loop_) is a tool for running Kotlin code interactively. REPL lets you evaluate expressions and code chunks without creating whole projects. 
To run REPL, open __Tools__ > __Kotlin__ > __Kotlin REPL__.

![Tools REPL]({{ url_for('tutorial_img', filename='quick-run/tools-repl.png') }})

The REPL interactive prompt opens.

![REPL Run]({{ url_for('tutorial_img', filename='quick-run/repl-run.png') }})

You can enter any valid Kotlin code and see the result. Results are printed as variables with auto-generated names like _res*_. You can later use such variables in your code.

![REPL Use Results]({{ url_for('tutorial_img', filename='quick-run/repl-use-results.png') }})

REPL supports multiple line input as well. The code is executed subsequently, so be sure that you define your functions and classes before using them.
