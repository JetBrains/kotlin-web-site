[//]: # (title: Run code snippets – tutorial)

Kotlin code is typically organized into projects with which you work in an IDE, a text editor, or other tools. However,
if you want to quickly check how a function works or find an expression's value, there's no need to create a new project
and build it: check out three handy ways to run Kotlin code instantly in different environments:

* [Scratches and worksheets](#intellij-idea-scratches-and-worksheets) in the IDE
* [Kotlin Playground](#browser-kotlin-playground) in the browser
* [ki shell](#command-line-ki-shell) in the command line

## IDE: Scratches and worksheets

IntelliJ IDEA and Android Studio support Kotlin [scratches and worksheets](https://www.jetbrains.com/help/idea/kotlin-repl.html#efb8fb32).
 
_Scratches_ let you create code drafts in the same IDE window with your project and run them on the fly. 
Scratches are not tied to projects; you can access and run all your scratches from any IntelliJ IDEA window on your OS. 

To create a Kotlin scratch, click **File** | **New** | **Scratch File** and select the **Kotlin** type.

In turn, _worksheets_ are project files: they are stored in project directories and tied to the project modules.
Worksheets are useful for writing code parts that don't actually make a software unit but should still be stored together 
in a project. For example, you can use worksheets for education or demo materials.

To create a Kotlin worksheet in a project directory, right-click the directory in the project tree and select
**New** | **Kotlin Worksheet**.

In scratches and worksheets, you can write any valid Kotlin code. Syntax highlighting, auto-completion, and other
IntelliJ IDEA code editing features are supported too. Note that there's no need for declaring the `main` function: 
all the code you write is executed as if it would be in the body of `main`.

Once you have finished writing your code in a scratch or a worksheet, click **Run**. 
The execution results will appear in the lines opposite your code.

![Run scratch](scratch-run.png){width=700}

### Interactive mode

IntelliJ IDEA can run the code from scratches and worksheets automatically. To get the execution results when you stop 
typing, switch on the **Interactive mode**.

![Scratch interactive mode](scratch-interactive.png){width=700}

### Use modules

We can use classes or functions from a Kotlin project, in our scratches and worksheets.

Worksheets automatically get access to classes and functions from the module where they reside.

To use classes or functions from a project in a scratch, import them into the scratch file as usual with the 
`import` statement. Then write your code and run it with the appropriate module selected in **Use classpath of module** list.
 
Both scratches and worksheets use the compiled versions of connected modules. So, if you modify a module's source files,
the changes will propagate to scratches and worksheets when you rebuild the module.
To rebuild the module automatically before each run of a scratch or a worksheet, select **Make module before Run**.

![Scratch select module](scratch-select-module.png){width=700}

### Run as REPL 

To evaluate each particular expression in a scratch or a worksheet, run it with **Use REPL** selected. The code lines
will run sequentially, providing results of each call. 
You can later refer to the results by the names `res*` shown in the corresponding lines.

![Scratch REPL](scratch-repl.png){width=700}

## Browser: Kotlin Playground

[Kotlin Playground](https://play.kotlinlang.org/) is an online application that allows writing, running, and sharing
Kotlin code in the browser.

### Write and edit code

The playground provides a text editor where you write code as you would write in a source file:
* place your own classes, functions, and top-level declarations in an arbitrary order
* write the executable part in the body of the `main` function.

Like in usual Kotlin projects, the `main` function in the playground can have the `args` parameter or no parameters at all.
To pass program arguments upon execution, write them in the **Program arguments** field.

![Playground: code completion](playground-completion.png){width=700}

The playground provides code completion as you type. It also automatically imports declarations from the standard library
and [`kotlinx.coroutines`](coroutines-overview.md).

### Choose execution environment

The playground provides means for customizing the execution environment:
* multiple Kotlin versions, including available previews of a future version
* multiple backends to run the code in: JVM, JS (legacy or [IR compiler](js-ir-compiler.md) or Canvas), or JUnit

![Playground: environment setup](playground-env-setup.png){width=700}

For JS backends, you can also see the generated JS code.

![Playground: generated JS](playground-generated-js.png){width=700}


### Share code online 

Use the playground to share your code with others: click **Copy link** and send it to anyone you want to show the code. 

You can also use the playground to embed interactive code samples into other websites. Click **Share code** and you will 
get the code for embedding your sample into any web page or into a [Medium](https://medium.com/)
article.

![Playground: share code](playground-share.png){width=700}

## Command line: ki shell

[ki shell](https://github.com/Kotlin/kotlin-interactive-shell) (_Kotlin Interactive Shell_) is a command-line
utility for running Kotlin code in the terminal. It's available for Linux, macOS, and Windows.

ki shell provides basic code evaluation capabilites along with advanced features such as:
* code completion
* type checks
* external dependencies
* paste mode for code snippets
* scripting support
* and even plugin-based extensibility.

### Installation

To install ki shell, download its latest version from [GitHub](https://github.com/Kotlin/kotlin-interactive-shell) and 
unzip it in a directory of your choice.

On macOS, you can also install ki shell with Homebrew by running the following command:

```Shell
brew install ki
```

### Features 

To start ki shell, run `bin/ki.sh` on Linux and macOS (or just `ki` if ki shell in installed with Homebrew) or
`bin\ki.bat` on Windows.

When the shell is started, you can write Kotlin code right away in your terminal.

The shell provides code completion upon pressing **Tab**. It also provides the syntax highlighting as you type;
you can disable it by entering `:syntax off`.

![ki shell highlighting and completion](ki-shell-highlight-completion.png){width=700}

When you press **Enter**, ki shell evaluates the entered line and prints the result. Expression values are
printed as variables with auto-generated names like `res*`. You can later use such variables in the code you run. 
If the entered construct is incomplete (for example, an `if` with a condition but without the body), the shell prints 
three dots and expects the remaining part.


![ki shell results](ki-shell-results.png){width=700}

Type in `:help` (or `:h`) to see commands available in ki shell. Below is a quick overview of some helpful ones.

#### Find out an expression's type

For complex expressions or APIs you don't know well, ki shell provides the command `:type` (or `:t`) that shows the 
type of an expression:

![ki shell type](ki-shell-type.png){width=700}

#### Load code

If the code you need is stored somewhere outside, there are two ways to load it and use in ki shell:
* load a source file with the `:load` (or `:l`) command
* copy and paste the code snippet in the paste mode with the `:paste` (or `:p`) command

![ki shell load file](ki-shell-load.png){width=700}

The `ls` command shows available symbols (variables and functions).

#### Add external dependencies

Along with the standard library, ki shell supports external dependencies.
This lets you use it for trying third-party libraries without creating a whole project. 

To add a third-party library in ki shell, use the `:dependsOn` command. By default, ki shell works with Maven Central,
but you can use other repositories if you connect them with the `:repository` command:

![ki shell external dependency](ki-shell-dependency.png){width=700}

### Extensibility

If ki shell's functionality is not enough for a specific case, you can extend it by writing a plugin. To do this,
implement the [`Plugin`](https://github.com/Kotlin/kotlin-interactive-shell/blob/main/ki-shell/src/main/kotlin/org/jetbrains/kotlinx/ki/shell/Plugin.kt)
interface. 

Such ki shell functions as help display or paste mode are already implemented in plugins: [`HelpPlugin`](https://github.com/Kotlin/kotlin-interactive-shell/blob/main/ki-shell/src/main/kotlin/org/jetbrains/kotlinx/ki/shell/plugins/HelpPlugin.kt)
and [`PastePlugin`](https://github.com/Kotlin/kotlin-interactive-shell/blob/main/ki-shell/src/main/kotlin/org/jetbrains/kotlinx/ki/shell/plugins/PastePlugin.kt).
Check out their code and see how you can create your own plugin for ki shell.
