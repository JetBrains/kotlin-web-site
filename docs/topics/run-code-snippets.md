[//]: # (title: Run code snippets – tutorial)

There may be times when you need to quickly write and execute code outside of a project or application. 
This may be useful, for example, when learning Kotlin or evaluating expressions.
Let's have a look at three handy ways we can use to run Kotlin code quickly:

* [Scratches](#scratches-and-worksheets) let us write and run code in a temporary file outside of our project in the IDE.
* [Worksheets](#scratches-and-worksheets) are like scratches, but they reside within projects.
* [REPL](#repl) (_Read-Eval-Print-Loop_) runs code in an interactive console.     

## Scratches and worksheets

The Kotlin plugin for IntelliJ IDEA supports [_scratches_](https://www.jetbrains.com/help/idea/scratches.html) and _worksheets._
 
_Scratches_ let you create code drafts in the same IDE window with your project and run them on the fly. 
Scratches are not tied to projects; you can access and run all your scratches from any IntelliJ IDEA window on your OS. 

To create a Kotlin scratch, click __File | New | Scratch file__ and select the __Kotlin__ type.

In turn, _worksheets_ are project files: they are stored in project directories and tied to the project modules.
Worksheets are useful for writing code parts that don't actually make a software unit but should still be stored together 
in a project. For example, you can use worksheets for education or demo materials.

To create a Kotlin worksheet in a project directory, right-click the directory in the project tree and select
__New | Kotlin Worksheet__.

In scratches and worksheets, you can write any valid Kotlin code. Syntax highlighting, auto-completion, and the other
IntelliJ IDEA code editing features are all supported too. Note that there's no need for declaring the `main` function: 
all the code you write is executed as if it would be in the body of `main`.

Once you have finished writing your code in a scratch or a worksheet, click __Run__. 
The execution results will appear in the lines opposite your code.

![Run scratch](scratch-run.png){width=700}

### Interactive mode

IntelliJ IDEA can run the code from scratches and worksheets automatically. To get the execution results when you stop 
typing, switch on the __Interactive mode__.

![Scratch interactive mode](scratch-interactive.png){width=700}

### Using modules

We can use classes or functions from a Kotlin project, in our scratches and worksheets.

Worksheets automatically get access to classes and functions from the module where they reside.

To use classes or functions from a project in a scratch, import them into the scratch file as usual with the 
`import` statement. Then write your code and run it with the appropriate module selected in __Use classpath of module__ list.
 
Both scratches and worksheets use the compiled versions of connected modules. So, if you modify a module's source files,
the changes will propagate to scratches and worksheets when you rebuild the module.
To rebuild the module automatically before each run of a scratch or a worksheet, select __Make before Run__.

![Scratch select module](scratch-select-module.png){width=700}

### Running as REPL 

To evaluate each particular expression in a scratch or a worksheet, run it with __Use REPL__ selected. The code will be 
executed the same way as in [REPL](#repl): the code lines will run sequentially, providing results of each call. 
You can later refer to the results by the names `res*` shown in the corresponding lines.

![Scratch REPL](scratch-repl.png){width=700}

## REPL

_REPL_ (_Read-Eval-Print-Loop_) is a tool for running Kotlin code interactively. REPL lets you evaluate expressions and 
code chunks without creating projects or even functions if you don't need them. 

To run REPL in IntelliJ IDEA, open __Tools | Kotlin | Kotlin REPL__.

To run REPL in the OS command line, open `/bin/kotlinc-jvm` from the directory of standalone Kotlin compiler.

The REPL command line interface will open. You can enter any valid Kotlin code and see the result. The results are printed as 
variables with auto-generated names like `res*`. You can later use such variables in the code you run in REPL.

![Run REPL](repl-run.png){width=700}

REPL supports multiline input as well. The result of the multiline input is the value of its last expression. 

![REPL multi-line run](repl-multi-line.png){width=700}


