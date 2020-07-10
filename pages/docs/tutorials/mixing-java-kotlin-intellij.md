---
type: tutorial
layout: tutorial
title: "Mixing Java and Kotlin in one project"
description: "This tutorial walks us through the process of using Java and Kotlin in a single IntelliJ IDEA project."
authors: Hadi Hariri
showAuthorInfo: false
date: 2019-04-11
related:
    - getting-started.md
---

We'll be using IntelliJ IDEA (Ultimate or Community edition). To learn how to start a new Kotlin project in IntelliJ IDEA, 
see the [Getting Started with IntellJ IDEA](jvm-get-started.html) tutorial. If you are using build tools, please see the corresponding
entry under [Build Tools](build-tools.html). 

## Adding Java source code to an existing Kotlin project
Adding Java classes to a Kotlin project is pretty straightforward. All you need to do is create a new Java file (__Alt + Insert__/__Cmd + N__) in the correct directory or package.

![New Java Class]({{ url_for('tutorial_img', filename='mixing-java-kotlin-intellij/new-java-class.png') }})

If you already have the Java classes, you can just copy them to the project directories.

You can now consume the Java сlass from Kotlin or vice versa without any further actions.
 
For example, adding the following Java class:

<div class="sample" markdown="1" theme="idea" mode="java">

``` java
public class Customer {

    private String name;

    public Customer(String s){
        name = s;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
    
    public void placeOrder() {
        System.out.println("A new order is placed by " + name);
    }
}
```
</div>

lets you call it from Kotlin like any other type in Kotlin.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
val customer = Customer("Phase")
println(customer.name)
println(customer.placeOrder())
```
</div>


## Adding Kotlin source code to an existing Java project
Adding a Kotlin file to an existing Java project is pretty much the same process.

![New Kotlin File]({{ url_for('tutorial_img', filename='mixing-java-kotlin-intellij/new-kotlin-file.png') }})

If this is the first time you're adding a Kotlin file to this project, IntelliJ IDEA will prompt you to add the required Kotlin runtime.
For a Java project, configure the Kotlin runtime as a __Kotlin Java Module__.

The next step is to decide which modules to configure (if the project has more than one module) and whether you want to
add the runtime library to the project or use those provided by the current Kotlin plugin.

![Bundling Kotlin Runtime]({{ url_for('tutorial_img', filename='mixing-java-kotlin-intellij/bundling-kotlin-option.png') }})

You can also open the Kotlin runtime configuration manually from __Tools \| Kotlin \| Configure Kotlin in Project__.

## Converting an existing Java file to Kotlin with J2K

The Kotlin plugin also bundles a Java to Kotlin converter (_J2K_) that automatically converts Java files to Kotlin.
To use J2K on a file, click __Convert Java File to Kotlin File__ in its context menu or in the __Code__ menu of IntelliJ IDEA.

![Convert Java to Kotlin Menu]({{ url_for('tutorial_img', filename='mixing-java-kotlin-intellij/convert-java-to-kotlin.png') }})

While the converter is not fool-proof, it does a pretty decent job of converting most boilerplate code from Java to Kotlin. Some manual tweaking however is sometimes required.
