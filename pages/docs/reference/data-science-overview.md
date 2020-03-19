---
type: doc
layout: reference
category: "Introduction"
title: "Kotlin for Data Science"
---

# Kotlin for Data Science

![Kotlin for data science]({{ url_for('asset', path='images/landing/data-science/data-science-overview.png')}})

Data science has a special place in information technology: it includes aspects of both software development and
scientific research at the same time. As a discipline, data science covers a broad range of areas: data engineering,
data analysis, machine learning, visualization, and many more.

To cover all these different areas, the software industry has many technologies and tools for data science.
These include frameworks, specific IDEs (called _notebooks_), plotting tools, and programming languages designed
specifically for data analysis and mathematical research.

General-purpose languages can also be applied to data science, Kotlin is already being adopted to data science.
Here we’ll introduce you to some things that are useful to know about when using Kotlin for data science.

## Tools

Modern software developers very rarely write their code in plain text editors and run it from the command line anymore.
Instead, they tend to use integrated development environments (IDE) that can handle all the development tasks in a single tool.
Data scientists have similar tools called _notebooks_. Notebooks let users conduct research and store it in a single environment.
In a notebook, you can write narrative text next to a code block, execute the code block, and see the results in any
format that you need: output text, tables, data visualization, and so on.

Kotlin provides integration with two popular notebooks: Jupyter and Apache Zeppelin, which both allow you to write and
run Kotlin code blocks.

### Jupyter kernel

The open-source project [Jupyter](https://jupyter.org/) offers the well-known web-based development environment **Jupyter Notebook**.
For code execution, Jupyter uses the concept of _kernels_ - components that run separately and execute the code upon request,
for example, when you click **Run** in a notebook.

There is a kernel that the Jupyter team maintains themselves - IPython for running the Python code.
However, there are other community-maintained kernels for different languages.
Among them is the **Kotlin kernel for Jupyter notebooks**. With this kernel, you can write and run Kotlin code in Jupyter 
notebooks and use third-party data science frameworks written in Java and Kotlin.

#### Setting up the Kotlin kernel

The Kotlin kernel requires Java 8 to be installed.

To install the kernel, use [Conda](https://docs.conda.io/projects/conda/en/latest/):

<div class="sample" markdown="1" mode="shell" theme="idea">

```bash
conda install kotlin-jupyter-kernel -c jetbrains
```

</div>

Once the kernel is installed, feel free to run the Jupyter notebook and switch to the Kotlin kernel.
And that’s all there is to it, you can then write and run Kotlin in your notebook! 

![Kotlin in Jupyter notebook]({{ url_for('asset', path='images/landing/data-science/jupyter-kotlin.png')}})

You can find more information about the Kotlin kernel for Jupyter [here](https://github.com/cheptsov/kotlin-jupyter-demo/blob/master/index.ipynb).

### Zeppelin interpreter

[Apache Zeppelin](http://zeppelin.apache.org/) is a popular web-based solution for interactive data analytics.
Zeppelin provides strong support for the [Apache Spark](http://zeppelin.apache.org/docs/latest/interpreter/spark.html)
cluster computing system, which is particularly useful for data engineering. Spark provides a high-level API in multiple languages.
 
The language support in Zeppelin is provided by _interpreters_ - plugins that enable users to use a specific language or data-processing-backend.
There are numerous community-maintained interpreters for different programming languages.
The one we offer you is the **Kotlin interpreter for Apache Zeppelin** that adds the Kotlin support.

#### Setting up Zeppelin with Kotlin interpreter

Currently, the latest release of Zeppelin (0.8.2) doesn’t come with bundled Kotlin interpreter.
But anyway, it’s available in the master branch of Zeppelin. 
So, to add Kotlin support to Zeppelin, you need to build your own version from the sources.

To build a custom version of Zeppelin, you will need:

* [Git](https://git-scm.com/)
* [Maven](https://maven.apache.org/install.html),
* [JDK 8](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
* The dependencies listed [here](https://zeppelin.apache.org/docs/latest/setup/basics/how_to_build.html#build-requirements)

First, checkout the master branch from the Zeppelin repository:

<div class="sample" markdown="1" mode="shell" theme="idea">

```bash
git clone --depth=1 git@github.com:apache/zeppelin.git
```
</div>

or

<div class="sample" markdown="1" mode="shell" theme="idea">

```bash
git clone --depth=1 https://github.com/apache/zeppelin.git
```
</div>

To build Zeppelin with Maven, go to the Zeppelin directory and run the following command:

<div class="sample" markdown="1" mode="shell" theme="idea">

```bash
mvn clean package -DskipTests -Pspark-2.4 -Pscala-2.11
```
</div>

Then run Zeppelin with the following command:

<div class="sample" markdown="1" mode="shell" theme="idea">

```bash
./bin/zeppelin-daemon.sh start
```
</div>

Now the Zeppelin UI is available on `http://localhost:8089`.

To learn about how to deploy Zeppelin with Kotlin support in a Spark cluster, see [this instruction](/docs/tutorials/zeppelin-spark-cluster.html).

## Libraries

For software engineering, an important part of any domain is the availability of frameworks for related areas.
For data science, this includes such areas as machine learning, data analysis, visualization, and many others.
Fortunately, there are already plenty of frameworks written in Kotlin for data science.
There are even more frameworks written in Java, which is perfect as they can be called from Kotlin code seamlessly.

Below are two short lists of libraries that you may find useful for data science.

### Kotlin libraries
* [kotlin-statistics](https://github.com/thomasnield/kotlin-statistics) is a library providing extension functions for 
exploratory and production statistics. It supports basic numeric list/sequence/array functions (from `sum` to `skewness`),
slicing operators (such as `countBy`, `simpleRegressionBy`), binning operations, discrete PDF sampling,
naive bayes classifier, clustering, linear regression, and much more.

* [kmath](https://github.com/mipt-npm/kmath) is a library inspired by [NumPy](https://numpy.org/).
This library supports algebraic structures and operations, array-like structures, math expressions, histograms,
streaming operations, a wrapper around [commons-math](http://commons.apache.org/proper/commons-math/) and
[koma](https://github.com/kyonifer/koma), and more.

* [krangl](https://github.com/holgerbrandl/krangl) is a library inspired by R's [dplyr](https://dplyr.tidyverse.org/)
and Python's [pandas](https://pandas.pydata.org/). This library provides functionality for data manipulation using
a functional-style API; it also includes functions for filtering, transforming, aggregating, and reshaping tabular data.

* [lets-plot](https://github.com/JetBrains/lets-plot) is a plotting library for statistical data written in Kotlin.
Lets-Plot is multiplatform and can be used not only with JVM, but also with JS and Python. For more information, see [below](#lets-plot-for-kotlin).

* [kravis](https://github.com/holgerbrandl/kravis) is another library for the visualization of tabular data inspired by
Python's [ggplot](https://ggplot2.tidyverse.org/).

### Java libraries

Since Kotlin provides first-class interop with Java, you can also use Java libraries for data science in your Kotlin code.
Here are some examples of such libraries:

* [DeepLearning4J](https://deeplearning4j.org/) - a deep learning library for Java

* [ND4J](http://nd4j.org/) - an efficient matrix math library for JVM

* [Dex](https://github.com/PatMartin/Dex) - a Java-based data visualization tool

* [Smile](https://github.com/haifengl/smile) - a comprehensive machine learning, natural language processing, linear algebra,
 graph, interpolation, and visualization system
   * [Smile-NLP-kt](https://github.com/londogard/smile-nlp-kt) - a Kotlin rewrite of the Scala implicits for the natural language processing part of Smile in the format of extension functions and interfaces.

* [Apache Commons Math](http://commons.apache.org/proper/commons-math/) - a general math, statistics, and machine learning library for Java

* [OptaPlanner](https://www.optaplanner.org/) - a solver utility for optimization planning problems

* [Charts](https://github.com/HanSolo/charts) - a scientific JavaFX charting library in development

* [CoreNLP](https://stanfordnlp.github.io/CoreNLP/) - a natural language processing toolkit

* [Apache Mahout](https://mahout.apache.org/) - a distributed framework for regression, clustering and recommendation

* [Weka](https://www.cs.waikato.ac.nz/ml/index.html) - a collection of machine learning algorithms for data mining tasks

If this list doesn’t cover your needs, you can find more options in the 
[**Kotlin Data Science Resources**](https://github.com/thomasnield/kotlin-data-science-resources) digest from Thomas Nield.

### Lets-Plot for Kotlin

**Lets-Plot for Kotlin** is a Kotlin API for the [Lets-Plot](https://github.com/JetBrains/lets-plot) library - 
an open-source plotting library for statistical data written entirely in Kotlin. Lets-Plot was built on the concept of 
layered graphics first described in Leland Wilkinson's work [The Grammar of Graphics](https://www.goodreads.com/book/show/2549408.The_Grammar_of_Graphics)
and later implemented in the [ggplot2](https://ggplot2.tidyverse.org/) package for R.

Lets-Plot for Kotlin is tightly integrated with the [Kotlin kernel for Jupyter notebooks](#jupyter-kernel).
Once you have the Kotlin kernel installed and enabled, add the following line to a Jupyter notebook:

<div class="sample" markdown="1" mode="shell" theme="idea">

```
%use lets-plot
```
</div>

That’s it, now you can call functions from Lets-Plot and see the results.

![Lets-Plot diagram]({{ url_for('asset', path='images/landing/data-science/lets-plot.png')}})

### Kotlin bindings for NumPy

[**KNumpy**](https://github.com/kotlin/kotlin-numpy/) (**Kotlin Bindings for NumPy**) is a Kotlin library that enables calling NumPy functions from the Kotlin code.
[NumPy](https://numpy.org/) is a popular package for scientific computing with Python. It provides powerful capabilities
for multi-dimensional array processing, linear algebra, Fourier transform, random numbers, and other mathematical tasks. 

KNumpy provides statically typed wrappers for NumPy functions. Thanks to the functional capabilities of Kotlin,
the API of KNumpy is very similar to the one for NumPy. This lets developers that are experienced with NumPy easily switch to KNumpy.
Here are two equal code samples:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```python
# Python

import numpy as np
a = np.arange(15).reshape(3, 5)

print(a.shape == (3, 5))        # True
print(a.ndim == 2)              # True
print(a.dtype.name)             # 'int64'

b = (np.arange(15) ** 2).reshape(3, 5)
```
</div>

<div class="sample" markdown="1" mode="kotlin" theme="idea" data-highlight-only>

```kotlin
// Kotlin 

import org.jetbrains.numkt.*

fun main() {
    val a = arange(15).reshape(3, 5)
    
    println(a.shape.contentEquals(intArrayOf(3, 5))) // true
    println(a.ndim == 2)                             // true
    println(a.dtype)                                 // class java.lang.Integer

    // create an array of ints, we square each element and the shape to (3, 5) 
    val b = (arange(15) `**` 2).reshape(3, 5)
}
```
</div>

Unlike Python, Kotlin is a statically typed language. This lets you avoid entire classes of runtime errors with KNumpy:
the Kotlin compiler detects them at earlier stages.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```python
# Python

import numpy as np

# ...

a = np.ones((3, 3), dtype=int) * 3
b = np.random.random((3, 3))

b *= a # Success
a *= b # TypeError at runtime 
```
</div>

<div class="sample" markdown="1" mode="kotlin" theme="idea" data-highlight-only>

```kotlin
// Kotlin 

// ...

val a = ones<Int>(3, 3) * 3
val b = Random.random(3, 3)

b *= a // Success
a *= b // Compilation error: 
// Type mismatch: inferred type is KtNDArray<Double> but KtNDArray<Int> was expected
```
</div>

