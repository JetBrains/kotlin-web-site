[//]: # (title: Mixing Java and Kotlin in one project – tutorial)

Kotlin provides the first-class interoperability with Java, and modern IDEs make it even better.
In this tutorial, you'll learn how to use both Kotlin and Java sources in the same project in 
IntelliJ IDEA. To learn how to start a new Kotlin project in IntelliJ IDEA, 
see [Getting started with IntellJ IDEA](jvm-get-started.md). 

## Adding Java source code to an existing Kotlin project

Adding Java classes to a Kotlin project is pretty straightforward. All you need to do is create a new Java file
(__Alt + Insert__/__Cmd + N__) in a directory or package inside your project.

<img src="new-java-class.png" alt="Add new Java class" width="400"/>

If you already have the Java classes, you can just copy them to the project directories.

You can now consume the Java class from Kotlin or vice versa without any further actions.
 
For example, adding the following Java class:

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

lets you call it from Kotlin like any other type in Kotlin.

```kotlin
val customer = Customer("Phase")
println(customer.name)
println(customer.placeOrder())
```

## Adding Kotlin source code to an existing Java project

Adding a Kotlin file to an existing Java project is pretty much the same.

<img src="new-kotlin-file.png" alt="Add new Kotlin file class" width="600"/>

If this is the first time you're adding a Kotlin file to this project, IntelliJ IDEA will prompt you to add the required
Kotlin runtime. For a Java project, configure the Kotlin runtime as a __Kotlin Java Module__.

The next step is to decide which modules to configure (if the project has more than one module) and whether you want to
add the runtime library to the project or use those provided by the current Kotlin plugin.

<img src="bundling-kotlin-option.png" alt="Bundling Kotlin runtime" width="600"/>

You can also open the Kotlin runtime configuration manually from __Tools \| Kotlin \| Configure Kotlin in Project__.

## Converting an existing Java file to Kotlin with J2K

The Kotlin plugin also bundles a Java to Kotlin converter (_J2K_) that automatically converts Java files to Kotlin.
To use J2K on a file, click __Convert Java File to Kotlin File__ in its context menu or in the __Code__ menu of IntelliJ IDEA.

<img src="convert-java-to-kotlin.png" alt="Convert Java to Kotlin" width="500"/>

While the converter is not fool-proof, it does a pretty decent job of converting most boilerplate code from Java to Kotlin.
Some manual tweaking however is sometimes required.
