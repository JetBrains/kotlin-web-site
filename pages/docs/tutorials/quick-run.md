---
type: tutorial
layout: tutorial
title: "Running Code Snippets "
description: "This tutorial shows the ways to write and run Kotlin code snippets in a lightweight manner without creating
entire applications."
authors: Pavel Semyonov
date: 2019-11-13
showAuthorInfo: false
related:
    - command-line.md
---

Sometimes you may need to quickly write and execute some code outside of a project or an application. 
This may be useful, for example, when learning Kotlin or evaluating expressions.
Let's have a look through three handy ways to quickly run Kotlin code:
* [Scratches](#scratches-and-worksheets) let you write and run code in a temporary file outside your project in IDE.
* [Worksheets](#scratches-and-worksheets) are similar to scratches, but they reside within projects.
* [REPL](#repl) (_Read-Eval-Print-Loop_) runs code interactively in a console.     

## Scratches and worksheets

Kotlin plugin for IntelliJ IDEA supports [_scratches_](https://www.jetbrains.com/help/idea/scratches.html) and _worksheets._
 
Scratches let you create code drafts in the same IDE window with your project and run them on the fly. 
Scratches are not tied to projects; you can access and run all your scratches from any IntelliJ IDEA window on your OS. 

To create a Kotlin scratch, click __File \| New \| Scratch file__ and select the __Kotlin__ type.

In turn, worksheets are project files: they are stored in project directories and tied to the project modules.
Worksheets are useful for writing code parts that don't actually compose an software unit but should be stored together 
in a project. For example, you can use worksheets for education or demo materials.

To create a Kotlin worksheet in a project directory, right-click the directory in the project tree and select
__New \| Kotlin Worksheet__.

In scratches and worksheets, you can write any valid Kotlin code. Syntax highlighting, auto-completion, and other code 
editing features of IntelliJ IDEA are supported too. Note that there's no need in declaring the `main` function: all the 
code you write is executed as if it would be the body of `main`.

Once you complete writing your code in a scratch or a worksheet, click __Run__. 
The execution results will appear opposite the lines of your code.

<div style="display: flex; align-items: center; margin-bottom: 10px;">
    <img
    src="{{ url_for('asset', path='images/tutorials/quick-run/scratch-run.png') }}"
    data-gif-src="{{ url_for('asset', path='images/tutorials/quick-run/scratch-run.gif') }}"
    class="gif-image">
</div>

### Interactive mode

IntelliJ IDEA can run the code from scratches and worksheets automatically. To get the execution results once you stop 
typing for a short time, switch on the __Interactive mode__.

<div style="display: flex; align-items: center; margin-bottom: 10px;">
    <img
    src="{{ url_for('asset', path='images/tutorials/quick-run/scratch-interactive.png') }}"
    data-gif-src="{{ url_for('asset', path='images/tutorials/quick-run/scratch-interactive.gif') }}"
    class="gif-image">
</div>

### Using modules

In scratches and worksheets, you can use classes or functions from a Kotlin project.

Worksheets automatically get access to classes and functions from the module where they reside.

To use classes or functions from a project in a scratch, import them into the scratch file as usual with the 
`import` statement. Then write your code and run it with the appropriate module selected in __Use classpath of module__ list.
 
Both scratches and worksheets use the compiled versions of connected modules. Thus, if you modify a module's source files,
the changes will propagate to scratches and worksheets once you rebuild the module.
To rebuild the module automatically before each run of a scratch or a worksheet, select __Make before Run__.

![Scratch select module]({{ url_for('tutorial_img', filename='quick-run/scratch-select-module.png') }})

### Running as REPL 

To evaluate each particular expression in a scratch or a worksheet, run it with __Use REPL__ selected. The code will be 
executed the same way as in [REPL](#repl): the code lines will run subsequently, providing results of each call. 
You can later refer to the results by the names `res*` shown in the corresponding lines.

![Scratch REPL]({{ url_for('tutorial_img', filename='quick-run/scratch-repl.png') }})

## REPL

_REPL_ (_Read-Eval-Print-Loop_) is a tool for running Kotlin code interactively. REPL lets you evaluate expressions and 
code chunks without creating projects or even functions if you don't need them. 

To run REPL in IntelliJ IDEA, open __Tools \| Kotlin \| Kotlin REPL__.

To run REPL in the OS command line, open __/bin/kotlinc-jvm__ from the directory of standalone Kotlin compiler.

The REPL command line interface opens. You can enter any valid Kotlin code and see the result. Results are printed as 
variables with auto-generated names like `res*`. You can later use such variables in the code you run in REPL.

<div style="display: flex; align-items: center; margin-bottom: 10px;">
    <img
    src="{{ url_for('asset', path='images/tutorials/quick-run/repl-run.png') }}"
    data-gif-src="{{ url_for('asset', path='images/tutorials/quick-run/repl-run.gif') }}"
    class="gif-image">
</div>

REPL supports multiple line input as well. The result of a multiple line input is the value of its last expression. 

<div style="display: flex; align-items: center; margin-bottom: 10px;">
    <img
    src="{{ url_for('asset', path='images/tutorials/quick-run/repl-multi-line.png') }}"
    data-gif-src="{{ url_for('asset', path='images/tutorials/quick-run/repl-multi-line.gif') }}"
    class="gif-image">
</div>
