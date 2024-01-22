[//]: # (title: Kotlin and Java libraries for data analysis)

Kotlin has 100% interoperability with Java, providing excellent performance and the ability to leverage 
the entire ecosystem of tried and true Java libraries.

## Kotlin libraries

* [Kotlin DataFrame](https://github.com/Kotlin/dataframe) is a library for structured data processing. It aims to
  reconcile Kotlin's static typing with the dynamic nature of data by utilizing both the full power of the Kotlin language
  and the opportunities provided by intermittent code execution in Jupyter notebooks and REPLs.

* [Kandy](https://kotlin.github.io/kandy/welcome.html) is an open-source plotting library for the JVM written in Kotlin.
  It provides a powerful and flexible DSL for chart creation,
  along with seamless integration with [Kotlin Notebook](https://plugins.jetbrains.com/plugin/16340-kotlin-notebook)
  and [Kotlin DataFrame](https://kotlin.github.io/dataframe/gettingstarted.html).

* [Multik](https://github.com/Kotlin/multik) is a library for multidimensional arrays in Kotlin. The library provides Kotlin-idiomatic, 
  type- and dimension-safe API for mathematical operations over multidimensional arrays. Multik offers swappable 
  JVM and native computational engines, and a combination of the two for optimal performance.

* [KotlinDL](https://github.com/jetbrains/kotlindl) is a high-level Deep Learning API written in Kotlin and inspired
  by Keras. It offers simple APIs for training deep learning models from scratch, importing existing Keras models
  for inference, and leveraging transfer learning for tweaking existing pre-trained models to your tasks.

* [Kotlin for Apache Spark](https://github.com/JetBrains/kotlin-spark-api) adds a missing layer of compatibility between
  Kotlin and Apache Spark. It allows Kotlin developers to use familiar language features such as data classes, and
  lambda expressions as simple expressions in curly braces or method references.

* [kmath](https://github.com/mipt-npm/kmath) is an experimental library that was initially inspired by
[NumPy](https://numpy.org/) but evolved to more flexible abstractions. It implements mathematical operations combined in
algebraic structures over Kotlin types, defines APIs for linear structures, expressions, histograms, streaming operations,
provides interchangeable wrappers over existing Java and Kotlin libraries including
[ND4J](https://github.com/eclipse/deeplearning4j/tree/master/nd4j),
[Commons Math](https://commons.apache.org/proper/commons-math/), [Multik](https://github.com/Kotlin/multik), and others.

* [lets-plot](https://github.com/JetBrains/lets-plot) is a plotting library for statistical data written in Kotlin.
Lets-Plot is multiplatform and can be used not only with JVM, but also with JS and Python. 

* [kravis](https://github.com/holgerbrandl/kravis) is another library for the visualization of tabular data inspired by
R's [ggplot](https://ggplot2.tidyverse.org/).

* [londogard-nlp-toolkit](https://github.com/londogard/londogard-nlp-toolkit/) is a library that provides utilities when working with natural language processing such as word/subword/sentence embeddings, word-frequencies, stopwords, stemming, and much more.

## Java libraries

Since Kotlin provides first-class interop with Java, you can also use Java libraries for data science in your Kotlin code.
Here are some examples of such libraries:

* [DeepLearning4J](https://deeplearning4j.konduit.ai) is a deep learning library for Java

* [ND4J](https://github.com/eclipse/deeplearning4j/tree/master/nd4j) is an efficient matrix math library for JVM

* [Dex](https://github.com/PatMartin/Dex) is a Java-based data visualization tool

* [Smile](https://github.com/haifengl/smile) is a comprehensive machine learning, natural language processing,
linear algebra, graph, interpolation, and visualization system. Besides Java API, Smile also provides a functional
[Kotlin API](https://haifengl.github.io/api/kotlin/smile-kotlin/index.html) along with Scala and Clojure API.
   * [Smile-NLP-kt](https://github.com/londogard/smile-nlp-kt) is a Kotlin rewrite of the Scala implicits for the natural
   language processing part of Smile in the format of extension functions and interfaces.

* [Apache Commons Math](https://commons.apache.org/proper/commons-math/) is a general math, statistics, and machine learning
library for Java

* [NM Dev](https://nm.dev/) is a Java mathematical library that covers all of classical mathematics.

* [OptaPlanner](https://www.optaplanner.org/) is a solver utility for optimization planning problems

* [Charts](https://github.com/HanSolo/charts) is a scientific JavaFX charting library in development

* [Apache OpenNLP](https://opennlp.apache.org/) is a machine learning based toolkit for the processing of natural language text

* [CoreNLP](https://stanfordnlp.github.io/CoreNLP/) is a natural language processing toolkit

* [Apache Mahout](https://mahout.apache.org/) is a distributed framework for regression, clustering, and recommendation

* [Weka](https://www.cs.waikato.ac.nz/ml/index.html) is a collection of machine learning algorithms for data mining tasks

* [Tablesaw](https://github.com/jtablesaw/tablesaw) is a Java dataframe. It includes a visualization library based on Plot.ly

## New structure (?)

I'd like to see these two lists as tables (we should find a way how to group these libraries)

| Library                                                 | Features                   | Notes                                        |
|---------------------------------------------------------|----------------------------|----------------------------------------------|
| [Kotlin DataFrame](https://github.com/Kotlin/dataframe) | Structured data processing | Support for `csv`, `json`, and other formats |
| [Kandy](https://kotlin.github.io/kandy/welcome.html)    | Data visualization         | ...                                          |
| ...                                                     | ...                        | ...                                          |
