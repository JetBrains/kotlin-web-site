[//]: # (title: Package your Maven application)

To package your Kotlin application with Maven, you can create a standard JAR file or a self-contained (fat) JAR file
that includes all its dependencies. Packaging your application allows you to distribute it and run it on any machine
with a Java Runtime Environment (JRE).

## Create JAR files

To create a small JAR file containing just the code from your module, include the following under `<build><plugins>`
in your Maven `pom.xml` file, where `main.class` is defined as a property and points to the main Kotlin or Java class:

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-jar-plugin</artifactId>
    <version>3.5.0</version>
    <configuration>
        <archive>
            <manifest>
                <addClasspath>true</addClasspath>
                <mainClass>${main.class}</mainClass>
            </manifest>
        </archive>
    </configuration>
</plugin>
```

## Create self-contained JAR files

To create a self-contained JAR file containing the code from your module along with its dependencies, include the following
under `<build><plugins>` in your Maven `pom.xml` file, where `main.class` is defined as a property and points to
the main Kotlin or Java class:

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-assembly-plugin</artifactId>
    <version>3.8.0</version>
    <executions>
        <execution>
            <id>make-assembly</id>
            <phase>package</phase>
            <goals> <goal>single</goal> </goals>
            <configuration>
                <archive>
                    <manifest>
                        <mainClass>${main.class}</mainClass>
                    </manifest>
                </archive>
                <descriptorRefs>
                    <descriptorRef>jar-with-dependencies</descriptorRef>
                </descriptorRefs>
            </configuration>
        </execution>
    </executions>
</plugin>
```

This self-contained JAR file can be passed directly to a JRE to run your application:

``` bash
java -jar target/mymodule-0.0.1-SNAPSHOT-jar-with-dependencies.jar
```
