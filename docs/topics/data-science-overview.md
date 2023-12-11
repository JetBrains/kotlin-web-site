[//]: # (title: Kotlin for data science)

From building data pipelines to productionizing machine learning models, Kotlin can be a great choice for 
working with data:
* Kotlin is concise, readable, and easy to learn.
* Static typing and null safety help create reliable, maintainable code that is easy to troubleshoot. 
* Being a JVM language, Kotlin gives you great performance and an ability to leverage an entire ecosystem 
of tried and true Java libraries. 

## Interactive editors

Notebooks such as [Jupyter Notebook](https://jupyter.org/), [Datalore](http://jetbrains.com/datalore), and [Apache Zeppelin](https://zeppelin.apache.org/) provide 
convenient tools for data visualization and exploratory research.
Kotlin integrates with these tools to help you explore data, share your findings with 
colleagues, or build up your data science and machine learning skills.

### Kotlin Notebook

The [Kotlin Notebook](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook) is a plugin for IntelliJ IDEA that
allows you to create notebooks in Kotlin. It leverages the [Kotlin kernel](#jupyter-kotlin-kernel) for executing the
cells and harnesses the powerful Kotlin IDE support to offer real-time code insights. It is now the preferred method
for working with Kotlin notebooks. Be sure to check out our [blog post](https://blog.jetbrains.com/kotlin/2023/07/introducing-kotlin-notebook/) about it.

![Kotlin Notebook](kotlin-notebook.png){width=800}

### Jupyter Kotlin kernel

The Jupyter Notebook is an open-source web application that allows you to create and share documents 
(aka "notebooks") that can contain code, visualizations, and Markdown text. 
[Kotlin-jupyter](https://github.com/Kotlin/kotlin-jupyter) is an open source project that brings Kotlin 
support to Jupyter Notebook. 

![Kotlin in Jupyter notebook](kotlin-jupyter-kernel.png){width=800}

Check out Kotlin kernel's [GitHub repo](https://github.com/Kotlin/kotlin-jupyter) for installation 
instructions, documentation, and examples.

### Kotlin Notebooks in Datalore

With Datalore, you can use Kotlin in the browser straight out of the box, no installation required.
You can also collaborate on Kotlin notebooks in real time, get smart coding assistance when writing code, and share results as interactive or static reports.
Check out a [sample report](https://datalore.jetbrains.com/view/report/9YLrg20eesVX2cQu1FKLiZ).

![Kotlin in Datalore](kotlin-datalore.png){width=800}

[Sign up and use Kotlin with a free Datalore Community account](https://datalore.jetbrains.com/).

### Zeppelin Kotlin interpreter

Apache Zeppelin is a popular web-based solution for interactive data analytics. It provides strong support 
for the Apache Spark cluster computing system, which is particularly useful for data engineering. 
Starting from [version 0.9.0](https://zeppelin.apache.org/docs/0.9.0-preview1/), Apache Zeppelin comes with 
bundled Kotlin interpreter. 

![Kotlin in Zeppelin notebook](kotlin-zeppelin-interpreter.png){width=800}

## Libraries

The ecosystem of libraries for data-related tasks created by the Kotlin community is rapidly expanding. 
Here are some libraries that you may find useful:

### Kotlin libraries

* [Multik](https://github.com/Kotlin/multik): multidimensional arrays in Kotlin. The library provides Kotlin-idiomatic, 
  type- and dimension-safe API for mathematical operations over multidimensional arrays. Multik offers swappable 
  JVM and native computational engines, and a combination of the two for optimal performance.

* [KotlinDL](https://github.com/jetbrains/kotlindl) is a high-level Deep Learning API written in Kotlin and inspired
  by Keras. It offers simple APIs for training deep learning models from scratch, importing existing Keras models
  for inference, and leveraging transfer learning for tweaking existing pre-trained models to your tasks.

* [Kotlin DataFrame](https://github.com/Kotlin/dataframe) is a library for structured data processing. It aims to 
  reconcile Kotlin's static typing with the dynamic nature of data by utilizing both the full power of the Kotlin language
  and the opportunities provided by intermittent code execution in Jupyter notebooks and REPLs.

* [Kotlin for Apache Spark](https://github.com/JetBrains/kotlin-spark-api) adds a missing layer of compatibility between
  Kotlin and Apache Spark. It allows Kotlin developers to use familiar language features such as data classes, and
  lambda expressions as simple expressions in curly braces or method references.

* [kmath](https://github.com/mipt-npm/kmath) is an experimental library that was intially inspired by
[NumPy](https://numpy.org/) but evolved to more flexible abstractions. It implements mathematical operations combined in
algebraic structures over Kotlin types, defines APIs for linear structures, expressions, histograms, streaming operations,
provides interchangeable wrappers over existing Java and Kotlin libraries including
[ND4J](https://github.com/eclipse/deeplearning4j/tree/master/nd4j),
[Commons Math](https://commons.apache.org/proper/commons-math/), [Multik](https://github.com/Kotlin/multik), and others.

* [krangl](https://github.com/holgerbrandl/krangl) is a library inspired by R's [dplyr](https://dplyr.tidyverse.org/)
and Python's [pandas](https://pandas.pydata.org/). This library provides functionality for data manipulation using
a functional-style API; it also includes functions for filtering, transforming, aggregating, and reshaping tabular data.

* [lets-plot](https://github.com/JetBrains/lets-plot) is a plotting library for statistical data written in Kotlin.
Lets-Plot is multiplatform and can be used not only with JVM, but also with JS and Python. 

* [kravis](https://github.com/holgerbrandl/kravis) is another library for the visualization of tabular data inspired by
R's [ggplot](https://ggplot2.tidyverse.org/).

* [londogard-nlp-toolkit](https://github.com/londogard/londogard-nlp-toolkit/) is a library that provides utilities when working with natural language processing such as word/subword/sentence embeddings, word-frequencies, stopwords, stemming, and much more.

### Java libraries

Since Kotlin provides first-class interop with Java, you can also use Java libraries for data science in your Kotlin code.
Here are some examples of such libraries:

* [DeepLearning4J](https://deeplearning4j.konduit.ai) - a deep learning library for Java

* [ND4J](https://github.com/eclipse/deeplearning4j/tree/master/nd4j) - an efficient matrix math library for JVM

* [Dex](https://github.com/PatMartin/Dex) - a Java-based data visualization tool

* [Smile](https://github.com/haifengl/smile) - a comprehensive machine learning, natural language processing,
linear algebra, graph, interpolation, and visualization system. Besides Java API, Smile also provides a functional
[Kotlin API](https://haifengl.github.io/api/kotlin/smile-kotlin/index.html) along with Scala and Clojure API.
   * [Smile-NLP-kt](https://github.com/londogard/smile-nlp-kt) - a Kotlin rewrite of the Scala implicits for the natural
   language processing part of Smile in the format of extension functions and interfaces.

* [Apache Commons Math](https://commons.apache.org/proper/commons-math/) - a general math, statistics, and machine learning
library for Java

* [NM Dev](https://nm.dev/) - a Java mathematical library that covers all of classical mathematics.

* [OptaPlanner](https://www.optaplanner.org/) - a solver utility for optimization planning problems

* [Charts](https://github.com/HanSolo/charts) - a scientific JavaFX charting library in development

* [Apache OpenNLP](https://opennlp.apache.org/) - a machine learning based toolkit for the processing of natural language text

* [CoreNLP](https://stanfordnlp.github.io/CoreNLP/) - a natural language processing toolkit

* [Apache Mahout](https://mahout.apache.org/) - a distributed framework for regression, clustering and recommendation

* [Weka](https://www.cs.waikato.ac.nz/ml/index.html) - a collection of machine learning algorithms for data mining tasks

* [Tablesaw](https://github.com/jtablesaw/tablesaw) - a Java dataframe. It includes a visualization library based on Plot.ly

If this list doesn't cover your needs, you can find more options in the 
**[Kotlin Machine Learning Demos](https://github.com/thomasnield/kotlin-machine-learning-demos)** GitHub repository with showcases from Thomas Nield.
