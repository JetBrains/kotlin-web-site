[//]: # (title: Run code in Kotlin Playground)

[Kotlin Playground](https://play.kotlinlang.org/) is an online application for writing, running, and sharing
Kotlin code in your browser.

## Write and edit code

In the Playground's editor area, you can write code just as you would in a source file:
* Add your own classes, functions, and top-level declarations in an arbitrary order.
* Write the executable part in the body of the `main()` function.

As in typical Kotlin projects, the `main()` function in the Playground can have the `args` parameter or no parameters at all.
To pass program arguments upon execution, write them in the **Program arguments** field.

![Playground: code completion](playground-completion.png){width=700}

The Playground highlights the code and shows code completion options as you type. It automatically imports declarations
from the standard library and [`kotlinx.coroutines`](coroutines-overview.md).

## Choose execution environment

The Playground provides ways to customize the execution environment:
* Multiple Kotlin versions, including available [previews of future versions](eap.md).
* Multiple backends to run the code in: JVM, JS (legacy or [IR compiler](js-ir-compiler.md), or Canvas), or JUnit.

![Playground: environment setup](playground-env-setup.png){width=700}

For JS backends, you can also see the generated JS code.

![Playground: generated JS](playground-generated-js.png){width=700}

## Share code online 

Use the Playground to share your code with others – click **Copy link** and send it to anyone you want to show the code to.

You can also embed code snippets from the Playground into other websites and even make them runnable. Click **Share code** to
embed your sample into any web page or into a [Medium](https://medium.com/) article.

![Playground: share code](playground-share.png){width=700}