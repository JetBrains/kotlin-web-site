[//]: # (title: Run code in command line tool ki shell)

The [ki shell](https://github.com/Kotlin/kotlin-interactive-shell) (_Kotlin Interactive Shell_) is a command-line
utility for running Kotlin code in the terminal. It's available for Linux, macOS, and Windows.

The ki shell provides basic code evaluation capabilities, along with advanced features such as:
* code completion
* type checks
* external dependencies
* paste mode for code snippets
* scripting support

See the [ki shell GitHub repository](https://github.com/Kotlin/kotlin-interactive-shell) for more details.

## Install and run ki shell

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

## Code completion and highlighting

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

## Load code

If the code you need is stored somewhere else, there are two ways to load it and use it in the ki shell:
* Load a source file with the `:load` (or `:l`) command.
* Copy and paste the code snippet in paste mode with the `:paste` (or `:p`) command.

![ki shell load file](ki-shell-load.png){width=700}

The `ls` command shows available symbols (variables and functions).

## Add external dependencies

Along with the standard library, the ki shell also supports external dependencies.
This lets you try out third-party libraries in it without creating a whole project.

To add a third-party library in the ki shell, use the `:dependsOn` command. By default, the ki shell works with Maven Central,
but you can use other repositories if you connect them using the `:repository` command:

![ki shell external dependency](ki-shell-dependency.png){width=700}
