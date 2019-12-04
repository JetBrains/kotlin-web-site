---
type: tutorial
layout: tutorial
title:  "Running Apache Zeppelin with Kotlin interpreter on Apache Spark cluster"
description: "This tutorial shows how to build Apache Zeppelin with Kotlin support from sources and run it on a Spark Cluster."
authors: Pavel Semyonov
date: 2019-12-03
showAuthorInfo: false
---

# Running Apache Zeppelin with Kotlin interpreter on Apache Spark cluster

Currently, the latest release of Zeppelin (0.8.2) doesn’t come with bundled Kotlin interpreter.
Anyway, it’s already available in the master branch of Zeppelin.
Thus, to add Kotlin support to Zeppelin, build your own version from the sources.

Here we'll learn how to run Zeppelin with Kotlin support on an [Apache Spark](https://spark.apache.org/) cluster.
The instruction for running Zeppelin locally is available [here](/docs/reference/data-science-overview.html#zeppelin-interpreter). 

## Prerequisites

To build a custom version of Zeppelin, you will need:

* [Git](https://git-scm.com/)
* [Maven](https://maven.apache.org/install.html),
* [JDK 8](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html)
* The dependencies listed [here](https://zeppelin.apache.org/docs/latest/setup/basics/how_to_build.html#build-requirements)

## Spark version

The Kotlin interpreter supports only Spark versions above 2.4. Zeppelin builds with Spark 2.2 support
by default, so don't forget to specify the suitable profile for build.

## Building and running Zeppelin on a Spark Cluster

Te below instruction explains how to build and run Apache Zeppelin on a Spark Cluster in [Amazon EMR](https://aws.amazon.com/emr/).

After getting an access to cluster creation in AWS Console, do the following:

1. Create a new cluster.

1. Specify the cluster options. Don't forget that the Spark version should be 2.4 or above.
    
1. Connect to newly created cluster via ssh.

1. Install prerequisites:
   <div class="sample" markdown="1" mode="shell" theme="idea">

   ```bash
   sudo yum -y maven git npm fontconfig freetype freetype-devel fontconfig-devel libstdc++ R
   ```
   </div>

1. Clone the Zeppelin repository. We recommend cloning to `/mnt`since it generally has more free space.

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

1. Build Zeppelin using the following command:

   <div class="sample" markdown="1" mode="shell" theme="idea">

   ```bash
   mvn clean package -DskipTests -Pspark-2.4 -Pscala-2.11
   ```
   </div>

1. Newly built Zeppelin distributive will be appear in `zeppelin-distribution/target`.
    Unpack it into `/mnt/distr` using `tar`.
    
1. Remove `conf` and `local-repo` directories (if any of them exist) from the unpacked folder.

1. Copy the contents of this dir into `/usr/lib/zeppelin`:
   <div class="sample" markdown="1" mode="shell" theme="idea">

   ```bash
   cp -r /mnt/distr/zeppelin[??] /usr/lib/zeppelin
   ```
   </div>
   
1. Reboot the cluster:
   <div class="sample" markdown="1" mode="shell" theme="idea">

   ```bash
   sudo reboot
   ```
   </div>
   
1. After reboot, log into cluster again and run the following:
   <div class="sample" markdown="1" mode="shell" theme="idea">

   ```bash
   sudo stop zeppelin
   sudo /usr/lib/zeppelin/bin/zeppelin-daemon.sh start   ```
   </div>
   
Now you can access Zeppelin on `https://<your machine public adress>:8080`.