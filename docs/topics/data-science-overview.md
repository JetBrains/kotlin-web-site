[//]: # (title: Kotlin for data science)

From building data pipelines to productionizing machine learning models, Kotlin can be a great choice for 
working with data:
* Kotlin is concise, readable, and easy to learn.
* Static typing and null safety help create reliable, maintainable code that is easy to troubleshoot. 
* Being a JVM language, Kotlin gives you great performance and an ability to leverage an entire ecosystem 
of tried and true Java libraries. 

## Interactive editors

Notebooks such as [Jupyter Notebook](https://jupyter.org/) and [Apache Zeppelin](https://zeppelin.apache.org/) provide 
convenient tools for data visualization and exploratory research.
Kotlin integrates with these tools to help you explore data, share your findings with 
colleagues, or build up your data science and machine learning skills.

### Jupyter Kotlin kernel

The Jupyter Notebook is an open-source web application that allows you to create and share documents 
(aka "notebooks") that can contain code, visualizations, and markdown text. 
[Kotlin-jupyter](https://github.com/Kotlin/kotlin-jupyter) is an open source project that brings Kotlin 
support to Jupyter Notebook. 

<img src="kotlin-jupyter-kernel.png" alt="Kotlin in Jupyter notebook" width="800"/>

Check out Kotlin kernel's [GitHub repo](https://github.com/Kotlin/kotlin-jupyter) for installation 
instructions, documentation, and examples.

### Zeppelin Kotlin interpreter

Apache Zeppelin is a popular web-based solution for interactive data analytics. It provides strong support 
for the Apache Spark cluster computing system, which is particularly useful for data engineering. 
Starting from [version 0.9.0](https://zeppelin.apache.org/docs/0.9.0-preview1/), Apache Zeppelin comes with 
bundled Kotlin interpreter. 

<img src="kotlin-zeppelin-interpreter.png" alt="Kotlin in Zeppelin notebook" width="800"/>

## Libraries

The ecosystem of libraries for data-related tasks created by the Kotlin community is rapidly expanding. 
Here are some libraries that you may find useful:

### Kotlin libraries
* [Multik](https://github.com/Kotlin/multik): multidimensional arrays in Kotlin. The library provides Kotlin-idiomatic, 
  type- and dimension-safe API for mathematical operations over multidimensional arrays. Multik offers swappable 
  JVM and native computational engines, and a combination of the two for optimal performance.

* [KotlinDL](http://github.com/jetbrains/kotlindl) is a high-level Deep Learning API written in Kotlin and inspired
  by Keras. It offers simple APIs for training deep learning models from scratch, importing existing Keras models
  for inference, and leveraging transfer learning for tweaking existing pre-trained models to your tasks.

* [Kotlin for Apache Spark](https://github.com/JetBrains/kotlin-spark-api) adds a missing layer of compatibility between
  Kotlin and Apache Spark. It allows Kotlin developers to use familiar language features such as data classes, and
  lambda expressions as simple expressions in curly braces or method references.

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
Lets-Plot is multiplatform and can be used not only with JVM, but also with JS and Python. 

* [kravis](https://github.com/holgerbrandl/kravis) is another library for the visualization of tabular data inspired by
Python's [ggplot](https://ggplot2.tidyverse.org/).

### Java libraries

Since Kotlin provides first-class interop with Java, you can also use Java libraries for data science in your Kotlin code.
Here are some examples of such libraries:

* [DeepLearning4J](https://deeplearning4j.org/) - a deep learning library for Java

* [ND4J](http://nd4j.org/) - an efficient matrix math library for JVM

* [Dex](https://github.com/PatMartin/Dex) - a Java-based data visualization tool

* [Smile](https://github.com/haifengl/smile) - a comprehensive machine learning, natural language processing,
linear algebra, graph, interpolation, and visualization system. Besides Java API, Smile also provides a functional
[Kotlin API](http://haifengl.github.io/api/kotlin/smile-kotlin/index.html) along with Scala and Clojure API.
   * [Smile-NLP-kt](https://github.com/londogard/smile-nlp-kt) - a Kotlin rewrite of the Scala implicits for the natural
   language processing part of Smile in the format of extension functions and interfaces.

* [Apache Commons Math](http://commons.apache.org/proper/commons-math/) - a general math, statistics, and machine learning
library for Java

* [OptaPlanner](https://www.optaplanner.org/) - a solver utility for optimization planning problems

* [Charts](https://github.com/HanSolo/charts) - a scientific JavaFX charting library in development

* [CoreNLP](https://stanfordnlp.github.io/CoreNLP/) - a natural language processing toolkit

* [Apache Mahout](https://mahout.apache.org/) - a distributed framework for regression, clustering and recommendation

* [Weka](https://www.cs.waikato.ac.nz/ml/index.html) - a collection of machine learning algorithms for data mining tasks

If this list doesn’t cover your needs, you can find more options in the 
**[Kotlin Data Science Resources](https://github.com/thomasnield/kotlin-data-science-resources)** digest from Thomas Nield.