[//]: # (title: Run code snippets)

Kotlin code is typically organized into projects with which you work in an IDE, a text editor, or another tool. However,
if you want to quickly see how a function works or find an expression's value, there's no need to create a new project
and build it. Check out these three handy ways to run Kotlin code instantly in different environments:

* [Scratch files and worksheets](#ide-scratches-and-worksheets) in the IDE.
* [Kotlin Playground](#browser-kotlin-playground) in the browser.
* [ki shell](#command-line-ki-shell) in the command line.

## IDE: scratches and worksheets

IntelliJ IDEA and Android Studio support Kotlin [scratch files and worksheets](https://www.jetbrains.com/help/idea/kotlin-repl.html#efb8fb32).

* _Scratch files_ (or just _scratches_) let you create code drafts in the same IDE window as your project and run them on the fly.
  Scratches are not tied to projects; you can access and run all your scratches from any IntelliJ IDEA window on your OS.

  To create a Kotlin scratch, click **File** | **New** | **Scratch File** and select the **Kotlin** type.

* _Worksheets_ are project files: they are stored in project directories and tied to the project modules.
  Worksheets are useful for writing pieces of code that don't actually make a software unit but should still be stored together
  in a project, such as educational or demo materials.

  To create a Kotlin worksheet in a project directory, right-click the directory in the project tree and select
  **New** | **Kotlin Class/File** | **Kotlin Worksheet**.

Syntax highlighting, auto-completion, and other
IntelliJ IDEA code editing features are supported in scratches and worksheets. There's no need to declare the `main()` function 
– all the code you write is executed as if it were in the body of `main()`.

Once you have finished writing your code in a scratch or a worksheet, click **Run**.
The execution results will appear in the lines opposite your code.

![Run scratch](scratch-run.png){width=700}

### Interactive mode

The IDE can run code from scratches and worksheets automatically. To get execution results as soon as you stop
typing, switch on **Interactive mode**.

![Scratch interactive mode](scratch-interactive.png){width=700}

### Use modules

You can use classes or functions from a Kotlin project in your scratches and worksheets.

Worksheets automatically have access to classes and functions from the module where they reside.

To use classes or functions from a project in a scratch, import them into the scratch file with the
`import` statement, as usual. Then write your code and run it with the appropriate module selected in the **Use classpath of module** list.

Both scratches and worksheets use the compiled versions of connected modules. So, if you modify a module's source files,
the changes will propagate to scratches and worksheets when you rebuild the module.
To rebuild the module automatically before each run of a scratch or a worksheet, select **Make module before Run**.

![Scratch select module](scratch-select-module.png){width=700}

### Run as REPL 

To evaluate each particular expression in a scratch or a worksheet, run it with **Use REPL** selected. The code lines
will run sequentially, providing the results of each call.
You can later use the results in the same file by reffering to their auto-generated `res*` names (they are shown in the corresponding lines).

![Scratch REPL](scratch-repl.png){width=700}

## Browser: Kotlin Playground

[Kotlin Playground](https://play.kotlinlang.org/) is an online application for writing, running, and sharing
Kotlin code in your browser.

### Write and edit code

In the Playground's editor area, you can write code just as you would in a source file:
* Add your own classes, functions, and top-level declarations in an arbitrary order.
* Write the executable part in the body of the `main()` function.

As in typical Kotlin projects, the `main()` function in the Playground can have the `args` parameter or no parameters at all.
To pass program arguments upon execution, write them in the **Program arguments** field.

![Playground: code completion](playground-completion.png){width=700}

The Playground highlights the code and shows code completion options as you type. It automatically imports declarations
from the standard library and [`kotlinx.coroutines`](coroutines-overview.md).

### Choose execution environment

The Playground provides ways to customize the execution environment:
* Multiple Kotlin versions, including available [previews of future versions](eap.md).
* Multiple backends to run the code in: JVM, JS (legacy or [IR compiler](js-ir-compiler.md), or Canvas), or JUnit.

![Playground: environment setup](playground-env-setup.png){width=700}

For JS backends, you can also see the generated JS code.

![Playground: generated JS](playground-generated-js.png){width=700}

### Share code online 

Use the Playground to share your code with others – click **Copy link** and send it to anyone you want to show the code to.

You can also embed code snippets from the Playground into other websites and even make them runnable. Click **Share code** to
embed your sample into any web page or into a [Medium](https://medium.com/) article.

![Playground: share code](playground-share.png){width=700}

## Command line: ki shell

The [ki shell](https://github.com/Kotlin/kotlin-interactive-shell) (_Kotlin Interactive Shell_) is a command-line
utility for running Kotlin code in the terminal. It's available for Linux, macOS, and Windows.

The ki shell provides basic code evaluation capabilities, along with advanced features such as:
* code completion
* type checks
* external dependencies
* paste mode for code snippets
* scripting support

See the [ki shell GitHub repository](https://github.com/Kotlin/kotlin-interactive-shell) for more details.

### Install and run ki shell

To install the ki shell, download the latest version of it from [GitHub](https://github.com/Kotlin/kotlin-interactive-shell) and
unzip it in the directory of your choice.

On macOS, you can also install the ki shell with Homebrew by running the following command:

```shell
brew install ki
```

To start the ki shell, run `bin/ki.sh` on Linux and macOS (or just `ki` if the ki shell was installed with Homebrew) or
`bin\ki.bat` on Windows.

Once the shell is running, you can immediately start writing Kotlin code in your terminal. Type `:help` (or `:h`) to see
the commands that are available in the ki shell.

### Code completion and highlighting

The ki shell shows code completion options when you press **Tab**. It also provides syntax highlighting as you type. 
You can disable this feature by entering `:syntax off`.

![ki shell highlighting and completion](ki-shell-highlight-completion.png){width=700}

When you press **Enter**, the ki shell evaluates the entered line and prints the result. Expression values are
printed as variables with auto-generated names like `res*`. You can later use such variables in the code you run.
If the construct entered is incomplete (for example, an `if` with a condition but without the body), the shell prints
three dots and expects the remaining part.

![ki shell results](ki-shell-results.png){width=700}

### Check an expression's type

For complex expressions or APIs that you don't know well, the ki shell provides the `:type` (or `:t`) command, which shows
the type of an expression:

![ki shell type](ki-shell-type.png){width=700}

### Load code

If the code you need is stored somewhere else, there are two ways to load it and use it in the ki shell:
* Load a source file with the `:load` (or `:l`) command.
* Copy and paste the code snippet in paste mode with the `:paste` (or `:p`) command.

![ki shell load file](ki-shell-load.png){width=700}

The `ls` command shows available symbols (variables and functions).

### Add external dependencies

Along with the standard library, the ki shell also supports external dependencies.
This lets you try out third-party libraries in it without creating a whole project.

To add a third-party library in the ki shell, use the `:dependsOn` command. By default, the ki shell works with Maven Central,
but you can use other repositories if you connect them using the `:repository` command:

![ki shell external dependency](ki-shell-dependency.png){width=700}
