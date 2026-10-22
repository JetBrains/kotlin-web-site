[//]: # (title: Kotlin and Java libraries for data analysis)

From data collection to model building, Kotlin offers robust libraries facilitating 
different tasks in the data pipeline.

In addition to its own libraries, Kotlin is 100% interoperable with Java. This interoperability helps to leverage
the entire ecosystem of tried-and-true Java libraries with excellent performance. With this perk, you can easily use either Kotlin
or Java libraries when working on [Kotlin data projects](data-analysis-overview.md). 

## Kotlin libraries

### Kotlin DataFrame

The [Kotlin DataFrame](https://kotlin.github.io/dataframe/overview.html) library lets you manipulate structured data in your Kotlin projects. From data creation and
cleaning to in-depth analysis and feature engineering, this library has you covered.

With the Kotlin DataFrame library, you can work with different file formats and databases:

<tabs>

<tab id="dataframe-files" title="Files">

* [JSON](https://kotlin.github.io/dataframe/json.html)
* [CSV / TSV](https://kotlin.github.io/dataframe/csv-tsv.html)
* [Excel](https://kotlin.github.io/dataframe/excel.html)
* [Apache Arrow](https://kotlin.github.io/dataframe/apachearrow.html)
* [Parquet](https://kotlin.github.io/dataframe/parquet.html)

</tab>

<tab id="dataframe-db" title="Databases">

* [PostgreSQL](https://kotlin.github.io/dataframe/postgresql.html)
* [MySQL](https://kotlin.github.io/dataframe/mysql.html)
* [Microsoft SQL Server](https://kotlin.github.io/dataframe/microsoft-sql-server.html)
* [SQLite](https://kotlin.github.io/dataframe/sqlite.html)
* [H2](https://kotlin.github.io/dataframe/h2.html)
* [MariaDB](https://kotlin.github.io/dataframe/mariadb.html)
* [DuckDB](https://kotlin.github.io/dataframe/duckdb.html)

</tab>
</tabs>

Use Kotlin DataFrame to select columns, filter and sort rows, convert values, add calculated columns, and group and
aggregate data. Transformations return new dataframes, preserving the original dataframe and reusing underlying
storage where possible.

Kotlin DataFrame also interoperates with Kotlin collections and data classes, so you can use data already available
in your application.

![Kotlin DataFrame](data-analysis-dataframe-example.png){width=700}

### Kandy

[Kandy](https://kotlin.github.io/kandy/welcome.html) is an open-source Kotlin library that provides a powerful and flexible DSL for plotting charts, such as bar charts, line charts, scatter plots, and other visualizations. You can combine multiple layers in
one plot, map data to properties such as position and color, and customize axes, legends, titles, and tooltips.

This library is a simple, idiomatic, readable, and type-safe tool to visualize data. You can also easily combine Kandy
with [Kotlin DataFrame](https://kotlin.github.io/dataframe/overview.html) to prepare and visualize data in the same Kotlin workflow.

![Kandy](data-analysis-kandy-example.png){width=700}

### Lets-Plot for Kotlin

[Lets-Plot for Kotlin (LPK)](https://lets-plot.org/kotlin/get-started.html) is a multiplatform plotting library that ports the [R's ggplot2 library](https://ggplot2.tidyverse.org/) to
Kotlin. LPK brings the feature-rich ggplot2 API to the Kotlin ecosystem,
making it suitable for scientists and statisticians who require sophisticated data visualization capabilities.

LPK targets various platforms, including [Kotlin/JS](js-overview.md), [JVM's Swing](https://docs.oracle.com/javase/8/docs/technotes/guides/swing/), [JavaFX](https://openjfx.io/), and [Compose Multiplatform](https://www.jetbrains.com/lp/compose-multiplatform/).
Additionally, LPK has seamless integration with [IntelliJ IDEA](https://www.jetbrains.com/idea/), [DataGrip](https://www.jetbrains.com/datagrip/), [DataSpell](https://www.jetbrains.com/dataspell/), and [PyCharm](https://www.jetbrains.com/pycharm/).

### Other libraries

<table>
  <tr>
    <td><strong>Library</strong></td>
    <td><strong>Purpose</strong></td>
    <td><strong>Features</strong></td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/jetbrains/kotlindl"><strong>KotlinDL</strong></a>
    </td>
    <td>
      <list>
        <li>Model building</li>
      </list>
    </td>
    <td>
      <list>
        <li>Deep learning API written in Kotlin and inspired by <a href="https://keras.io/">Keras</a></li>
        <li>Training deep learning models from scratch or importing existing Keras and ONNX models for inference</li>
        <li>Transferring learning for tailoring existing pre-trained models to your tasks</li>
        <li>Support for the <a href="https://developer.android.com/about">Android platform</a></li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/Kotlin/multik"><strong>Multik</strong></a>
    </td>
    <td>
      <list>
        <li>Data cleaning and processing</li>
        <li>Model building</li>
      </list>
    </td>
    <td>
      <list>
        <li>Mathematical operations over multidimensional arrays (linear algebra, statistics, arithmetics, and other calculations)</li>
        <li>Creating, copying, indexing, slicing, and other array operations</li>
        <li>Kotlin-idiomatic library with benefits such as type and dimension safety and swappable computational engines, running on the JVM or as native code</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/JetBrains/kotlin-spark-api"><strong>Kotlin for Apache Spark</strong></a>
    </td>
    <td>
      <list>
        <li>Data collection</li>
        <li>Data cleaning and processing</li>
        <li>Data exploration and visualization</li>
        <li>Model building</li>
      </list>
    </td>
    <td>
      <list>
        <li>Layer of compatibility between <a href="https://spark.apache.org/">Apache Spark</a> and Kotlin</li>
        <li>Apache Spark data transformation operations in Kotlin-idiomatic code</li>
        <li>Simple usage of Kotlin features, such as data classes and lambda expressions, in curly braces or method reference</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/mipt-npm/kmath"><strong>KMath</strong></a>
    </td>
    <td>
      <list>
        <li>Data cleaning and processing</li>
        <li>Data exploration and visualization</li>
        <li>Model building</li>
      </list>
    </td>
    <td>
      <list>
        <li>Modular library to work with mathematical abstractions in <a href="https://kotlinlang.org/multiplatform/">Kotlin Multiplatform</a> (JVM, JS, Native, and Wasm)</li>
        <li>APIs for algebraic structures, mathematical expressions, histograms, and streaming operations</li>
        <li>Interchangeable wrappers over existing Java and Kotlin libraries, including <a href="https://github.com/eclipse/deeplearning4j/tree/master/nd4j">ND4J</a>, <a href="https://commons.apache.org/proper/commons-math/">Apache Commons Math</a>, and <a href="https://github.com/Kotlin/multik">Multik</a></li>
        <li>Inspired by Python's <a href="https://numpy.org/">NumPy</a> but with other additional features like type safety</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/holgerbrandl/kravis"><strong>kravis</strong></a>
    </td>
    <td>
      <list>
        <li>Data exploration and visualization</li>
      </list>
    </td>
    <td>
      <list>
        <li>Visualization of tabular data</li>
        <li>Inspired by R's <a href="https://ggplot2.tidyverse.org/">ggplot</a></li>
      </list>
    </td>
  </tr>
</table>

## Java libraries

Since Kotlin provides first-class interoperability with Java, you can use Java libraries for data tasks in your Kotlin code.
Here are some examples of such libraries:

<table>
  <tr>
    <td><strong>Library</strong></td>
    <td><strong>Purpose</strong></td>
    <td><strong>Features</strong></td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/jtablesaw/tablesaw"><strong>Tablesaw</strong></a>
    </td>
    <td>
      <list>
        <li>Data collection</li>
        <li>Data cleaning and processing</li>
        <li>Data exploration and visualization</li>
      </list>
    </td>
    <td>
      <list>
        <li>Tools for loading, cleaning, transforming, filtering, and summarizing data</li>
        <li>Inspired by <a href="https://plotly.com/">Plot.ly</a></li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://stanfordnlp.github.io/CoreNLP/"><strong>CoreNLP</strong></a>
    </td>
    <td>
      <list>
        <li>Data cleaning and processing</li>
      </list>
    </td>
    <td>
      <list>
        <li>Natural language processing toolkit</li>
        <li>Linguistic annotations for text, such as sentiment and quote attributions</li>
        <li>Support for eight languages</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/haifengl/smile"><strong>Smile</strong></a>
    </td>
    <td>
      <list>
        <li>Data cleaning and processing</li>
        <li>Data exploration and visualization</li>
        <li>Model building</li>
      </list>
    </td>
    <td>
      <list>
        <li>Ready-made algorithms for machine learning and natural language processing</li>
        <li>Linear algebra, graph, interpolation, and visualization tools</li>
        <li>Provides functional <a href="https://github.com/haifengl/smile/tree/master/kotlin">Kotlin API</a>, <a href="https://github.com/haifengl/smile/tree/master/scala">Scala API</a>, <a href="https://github.com/haifengl/smile/tree/master/clojure">Clojure API</a>, and more</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/londogard/smile-nlp-kt"><strong>Smile-NLP-kt</strong></a>
    </td>
    <td>
      <list>
        <li>Data cleaning and processing</li>
      </list>
    </td>
    <td>
      <list>
        <li>Kotlin rewrite of the <a href="https://www.scala-lang.org/api/current/">Scala</a> implicits for the natural language processing part of Smile</li>
        <li>Operations in the format of Kotlin extension functions and interfaces</li>
        <li>Sentence breaking, stemming, bag of words, and other tasks</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/eclipse/deeplearning4j/tree/master/nd4j"><strong>ND4J</strong></a>
    </td>
    <td>
      <list>
        <li>Data cleaning and processing</li>
        <li>Model building</li>
      </list>
    </td>
    <td>
      <list>
        <li>Matrix mathematics library for the JVM</li>
        <li>Over 500 mathematical, linear algebra, and deep learning operations</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://commons.apache.org/proper/commons-math/"><strong>Apache Commons Math</strong></a>
    </td>
    <td>
      <list>
        <li>Data cleaning and processing</li>
        <li>Model building</li>
      </list>
    </td>
    <td>
      <list>
        <li>Mathematics and statistics operations for Java</li>
        <li>Correlations, distributions, linear algebra, geometry, and other operations</li>
        <li>Machine learning models</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://nm.dev/"><strong>NM Dev</strong></a>
    </td>
    <td>
      <list>
        <li>Data cleaning and processing</li>
        <li>Model building</li>
      </list>
    </td>
    <td>
      <list>
        <li>Java math library of numerical algorithms</li>
        <li>Object-oriented numerical methods</li>
        <li>Linear algebra, optimization, statistics, calculus, and more operations</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://opennlp.apache.org/"><strong>Apache OpenNLP</strong></a>
    </td>
    <td>
      <list>
        <li>Data cleaning and processing</li>
        <li>Model building</li>
      </list>
    </td>
    <td>
      <list>
        <li>Machine-learning-based toolkit for the processing of natural language text</li>
        <li>Tokenization, sentence segmentation, part-of-speech tagging, and other tasks</li>
        <li>Built-in tools for data modeling and model validation</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/HanSolo/charts"><strong>Charts</strong></a>
    </td>
    <td>
      <list>
        <li>Data exploration and visualization</li>
      </list>
    </td>
    <td>
      <list>
        <li><a href="https://openjfx.io/">JavaFX</a> library for scientific charts</li>
        <li>Complex charts, such as logarithmic, heatmap, and force-directed graph</li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://deeplearning4j.konduit.ai"><strong>DeepLearning4J</strong></a>
    </td>
    <td>
      <list>
        <li>Model building</li>
      </list>
    </td>
    <td>
      <list>
        <li>Deep learning library for Java</li>
        <li>Importing and retraining models (<a href="https://pytorch.org/">Pytorch</a>, <a href="https://www.tensorflow.org/">Tensorflow</a>, <a href="https://keras.io/">Keras</a>)</li>
        <li>Deploying in JVM microservice environments, mobile devices, IoT, and <a href="https://spark.apache.org/">Apache Spark</a></li>
      </list>
    </td>
  </tr>
  <tr>
    <td>
      <a href="https://github.com/TimefoldAI/"><strong>Timefold</strong></a>
    </td>
    <td>
      <list>
        <li>Model building</li>
      </list>
    </td>
    <td>
      <list>
        <li>Solver utility for optimization planning problems</li>
        <li>Compatible with object-oriented and functional programming</li>
      </list>
    </td>
  </tr>
</table>