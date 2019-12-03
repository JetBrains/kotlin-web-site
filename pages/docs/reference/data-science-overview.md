---
type: doc
layout: reference
category: "Introduction"
title: "Kotlin for Data Science"
---

# Kotlin for Data Science

![Kotlin for data science]({{ url_for('asset', path='images/landing/data-science/data-science-overview.png')}})

Data science takes a special place in the information technology: it includes both software development and scientific
research aspects at the same time. As a discipline, data science comprises a wide range of areas: data engineering,
data analysis, machine learning, visualization, and many more.

To cover all these areas, the software industry offers a number of technologies and tools for data science. 
This includes frameworks, specific IDEs (called notebooks), plotting tools, and even programming languages 
designed specifically for data analysis and related mathematical research.

The general-purpose languages also find their application in the data science, and Kotlin has already started its way 
into the data science as well. Here we’ll introduce you some things to start using Kotlin in the data science.

## Tools

Modern software developers rarely write their code in plain text editors and run it from the command line. 
Instead, they use integrated development environments that handle all development tasks in a single window. 
Data scientists also have similar tools called notebooks. Notebooks let their users conduct a research and store it 
in a single environment. In a notebook, you can write narrative text next to a code block, execute the code block and
see the execution results in any formats that you need: output text, tables, data visualization and so on.

Kotlin provides the integration with two popular notebooks: Jupyter and Apache Zeppelin, allowing you to write and 
run Kotlin code blocks.

### Jupyter kernel

The open-source project [Jupyter](https://jupyter.org/) offers the well-known web-based development environment **Jupyter Notebook**.
For code execution, the Jupyter notebook uses the concept of _kernels_ - components that run separately and run the code upon requests,
for example, when you click **Run** in your notebook.

There is one kernel that the Jupyter team maintains themselves - IPython for running the Python code.
However, there are many other kernels for different languages created and maintained by the community.
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

Once the Kernel is installed, feel free to run Jupyter notebook and switch to the Kotlin kernel. 
And here it is: you can write and run Kotlin in your notebook!

![Kotlin in Jupyter notebook]({{ url_for('asset', path='images/landing/data-science/jupyter-kotlin.png')}})

Find more information about the Kotlin kernel for Jupyter [here](https://github.com/cheptsov/kotlin-jupyter-demo/blob/master/index.ipynb).

### Zeppelin interpreter

[Apache Zeppelin](http://zeppelin.apache.org/) is a popular web-based solution for interactive data analytics.
Zeppelin provides the strong support for the [Apache Spark](http://zeppelin.apache.org/docs/latest/interpreter/spark.html)
 cluster computing system, which is particularly useful for data engineering. Spark provides a high-level API in multiple languages.
 
The language support in Zeppelin is provided by _interpreters_ - plugins that enable users to use a specific language or data-processing-backend.
There are numerous community-maintained interpreters for different languages.
We offer you the **Kotlin interpreter for Apache Zeppelin** that adds the Kotlin support.

#### Setting up Zeppelin with Kotlin interpreter

Currently, the latest release of Zeppelin (0.8.2) doesn’t come with bundled Kotlin interpreter.
Anyway, it’s already available in the master branch of Zeppelin.
Thus, to add Kotlin support to Zeppelin, build your own version from the sources.

To build a custom version of Zeppelin, you will need:

* git
* Maven
* JDK 8
* dependencies listed [here](https://zeppelin.apache.org/docs/latest/setup/basics/how_to_build.html#build-requirements)

First, checkout the master branch of the Zeppelin repository:

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

To learn how to deploy Zeppelin with Kotlin support in a Spark cluster, see [this instruction](/docs/tutorials/zeppelin-spark-cluster.html).

## Libraries

For software engineering, an important part of any domain is the availability of frameworks for related areas.
For data science, this includes such areas as machine learning, data analysis, visualization, and many more.
Fortunately, there are already plenty of frameworks for data science written in Kotlin. 
Even more such frameworks are written in Java, which can be called from Kotlin code seamlessly.

Below are two short lists of libraries that you may find useful for data science.

### Kotlin libraries
* [kotlin-statistics](https://github.com/thomasnield/kotlin-statistics) is a library providing extension functions for 
exploratory and production statistics. It supports basic numeric list/sequence/array functions (from `sum` to `skewness`),
slicing operators (such as `countBy`, `simpleRegressionBy`), binning operations, discrete PDF sampling,
naive bayes classifier, clustering, linear regression, and many more.

* [kmath](https://github.com/mipt-npm/kmath) is a library inspired by [NumPy](https://numpy.org/).
This library supports algebraic structures and operations, array-like structures, math expressions, histograms,
streaming operations, wrappers around [commons-math](http://commons.apache.org/proper/commons-math/) and
[koma](https://github.com/kyonifer/koma), and more.

* [krangl](https://github.com/holgerbrandl/krangl) is a library inspired by R's [dplyr](https://dplyr.tidyverse.org/)
and Python's [pandas](https://pandas.pydata.org/). This library provides functionality for data manipulation using
a functional-style API; it also includes functions for filtering, transforming, aggregating, and reshaping tabular data.

* [lets-plot](https://github.com/JetBrains/lets-plot) is a plotting library for statistical data written in Kotlin.
Lets-Plot is multi-platform and can be used not only with JVM, but also with JS and Python. For more information, see [below](#lets-plot-for-kotlin).

* [kravis](https://github.com/holgerbrandl/kravis) is another library for visualization of tabular data inspired by
Python's [ggplot](https://ggplot2.tidyverse.org/).

### Java libraries

Since Kotlin provides the first-class interop with Java, you can also use Java libraries for data science in your Kotlin code.
Here are some examples of such libraries:

* [DeepLearning4J](https://deeplearning4j.org/) - a deep learning library for Java

* [ND4J](http://nd4j.org/) - an efficient matrix math library for JVM

* [Dex](https://github.com/PatMartin/Dex) - a Java-based data visualization tool

* [Smile](https://github.com/haifengl/smile) - a comprehensive machine learning, natural language processing, linear algebra,
 graph, interpolation, and visualization system

* [Apache Commons Math](http://commons.apache.org/proper/commons-math/) - a general math, statistics, and machine learning library for Java

* [OptaPlanner](https://www.optaplanner.org/) - a solver utility for optimization planning problems

* [Charts](https://github.com/HanSolo/charts) - a scientific JavaFX charting library in development

* [CoreNLP](https://stanfordnlp.github.io/CoreNLP/) - a natural language processing toolkit

* [Apache Mahout](https://mahout.apache.org/) - a distributed framework for regression, clustering and recommendation

* [Weka](https://www.cs.waikato.ac.nz/ml/index.html) - a collection of machine learning algorithms for data mining tasks

If this list doesn’t cover your needs, you can find more options in the 
[**Kotlin Data Science Resources**](https://github.com/thomasnield/kotlin-data-science-resources) digest from Thomas Nield.

### Lets-Plot for Kotlin

Lets-Plot for Kotlin is a Kotlin API for [Lets-Plot](https://github.com/JetBrains/lets-plot) library - 
an open-source plotting library for statistical data written entirely in Kotlin. Lets-Plot was built on the concept of 
layered graphics first described in the Leland Wilkinson work [The Grammar of Graphics](https://www.goodreads.com/book/show/2549408.The_Grammar_of_Graphics)
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

**KNumpy** (**Kotlin Bindings for NumPy**) is a Kotlin library that enables calling NumPy functions from the Kotlin code.
[NumPy](https://numpy.org/) is a popular package for scientific computing with Python. It provides powerful capabilities
for multi-dimensional array processing, linear algebra, Fourier transform, random numbers, and other mathematical tasks. 

KNumpy provides statically typed wrappers for NumPy functions. Thanks to the functional capabilities of Kotlin,
the API of KNumpy is highly similar to the one of NumPy. This lets developers experienced with NumPy easily switch to KNumpy.
Here are two equal code samples:

<div class="sample" markdown="1" mode="python" theme="idea">

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

<div class="sample" markdown="1" mode="kotlin" theme="idea">

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

<div class="sample" markdown="1" mode="python" theme="idea">

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

<div class="sample" markdown="1" mode="kotlin" theme="idea">

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

