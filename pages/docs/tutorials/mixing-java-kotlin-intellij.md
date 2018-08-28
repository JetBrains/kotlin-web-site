---
type: tutorial
layout: tutorial
title: "Mixing Java and Kotlin in one project"
description: "This tutorial walks us through the process of using Java and Kotlin in a single IntelliJ IDEA project."
authors: Hadi Hariri
showAuthorInfo: false
date: 2014-09-23
related:
    - getting-started.md
---

We'll be using IntelliJ IDEA (Ultimate or Community edition). If using build tools, please see the corresponding
entry under [Build Tools](build-tools.html). To understand how to start a new Kotlin project using IntelliJ IDEA,
please see the [Getting-Started](getting-started.html) tutorial.

### Adding Java source code to an existing Kotlin project
To add a new Java class to a Kotlin project is very straightforward. All we need to do is create a new Java file (Ctrl+N/Cmd+N) in the correct folder/package.

![New Java Class]({{ url_for('tutorial_img', filename='mixing-java-kotlin-intellij/new-java-class.png') }})


We can now consume the Java Class from Kotlin or vice versa without any further actions. For instance, adding the following Java class:

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
}
```
</div>

allows us to call it from Kotlin like any other type in Kotlin.

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
val customer = Customer("Phase")

println(customer.getName())
```
</div>


### Adding Kotlin source code to an existing Java project
Adding a Kotlin file to an existing Java project is pretty much the same process. The only difference here is that depending on how we do this, slightly different actions need to be taken:

#### Creating a new Kotlin file
To create a new Kotlin file we simply decide on the location in the project folder and create it.

![New Kotlin File]({{ url_for('tutorial_img', filename='mixing-java-kotlin-intellij/new-kotlin-file.png') }})

If this is the first time we're adding a Kotlin file, IntelliJ IDEA will prompt us to add the required Kotlin runtime.

![Add Kotlin Runtime]({{ url_for('tutorial_img', filename='mixing-java-kotlin-intellij/add-kotlin-runtime.png') }})

As we're working with a Java project, we'd most likely want to configure it as a Kotlin Java Module.
The next step is to decide which modules to configure (if our project has more than one module) and whether we want to
add the runtime library to the project or use those provided by the current Kotlin plugin.

![Bundling Kotlin Runtime]({{ url_for('tutorial_img', filename='mixing-java-kotlin-intellij/bundling-kotlin-option.png') }})

#### Adding an existing Kotlin file
If instead of creating a new file, we want to add an existing Kotlin file to the project, IntelliJ IDEA won't prompt us to configure the Kotlin runtime. We have to invoke
this action manually. This can be done via the *Tools\|Kotlin* menu option


![Kotlin Menu]({{ url_for('tutorial_img', filename='mixing-java-kotlin-intellij/kotlin-menu.png') }})


which then prompts the same dialog and process as when we [create a new Kotlin file](#creating-a-new-kotlin-file).

#### Converting an existing Java file to Kotlin with J2K

The Kotlin plugin also bundles a Java to Kotlin compiler which is located under the *Code* menu in IntelliJ IDEA.

![Convert Java to Kotlin Menu]({{ url_for('tutorial_img', filename='mixing-java-kotlin-intellij/convert-java-to-kotlin.png') }})

Selecting an existing Java file, we can use this option to convert it automatically into Kotlin.
While the converter is not fool-proof, it does a pretty decent job of converting most boiler-plate code from Java to Kotlin. Some manual tweaking however is sometimes required.
