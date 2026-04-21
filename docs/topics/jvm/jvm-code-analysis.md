[//]: # (title: Code quality tools in Kotlin projects)

Code quality tools help you enforce coding standards, detect bugs early, measure test coverage, and maintain code quality
across your Kotlin projects. This guide shows how to integrate popular tools like [ktlint](https://pinterest.github.io/ktlint/),
[detekt](https://detekt.dev/), [SonarSource](https://www.sonarsource.com/), and [Kover](https://kotlin.github.io/kotlinx-kover/maven-plugin/)
into your Maven or Gradle build.

## Code formatting with ktlint

[ktlint](https://pinterest.github.io/ktlint/) is a Kotlin linter and formatter that enforces the
official Kotlin [coding conventions](coding-conventions.md) with no extra configuration.

ktlint checks rules such as indentation, spacing around operators, import ordering, and trailing commas. If a violation
is found, the build fails with a message indicating the file and line number.

To integrate ktlint into your project:

1. Add the plugin to your build file:

   <tabs group="build-system">
   <tab title="Maven" group-key="maven">

   ```xml
   <!-- pom.xml -->
   <plugin>
       <groupId>com.github.gantsign.maven</groupId>
       <artifactId>ktlint-maven-plugin</artifactId>
       <version>3.7.1</version>
       <executions>
           <execution>
               <id>check</id>
               <goals>
                   <goal>check</goal>
               </goals>
           </execution>
       </executions>
   </plugin>
   ```

   </tab>
   <tab title="Gradle" group-key="gradle">

   ```kotlin
   // build.gradle.kts
   plugins {
       id("org.jlleitschuh.gradle.ktlint") version "12.3.0"
   }
   ```

   </tab>
   </tabs>

2. Run the linter to check your code style:

   <tabs group="build-system">
   <tab title="Maven" group-key="maven">

   ```bash
   mvn ktlint:check
   ```

   </tab>
   <tab title="Gradle" group-key="gradle">

   ```bash
   ./gradlew ktlintCheck
   ```

   </tab>
   </tabs>

3. You can also add an `.editorconfig` file to the root of your project to customize rules. For example, to
   allow wildcard imports and disable trailing comma enforcement:

   ```ini
   [*.{kt,kts}]
   ij_kotlin_imports_layout = *
   ktlint_standard_trailing-comma-on-call-site = disabled
   ktlint_standard_trailing-comma-on-declaration-site = disabled
   ```

4. To automatically fix formatting issues, run:

   <tabs group="build-system">
   <tab title="Maven" group-key="maven">

   ```bash
   mvn ktlint:format
   ```

   </tab>
   <tab title="Gradle" group-key="gradle">

   ```bash
   ./gradlew ktlintFormat
   ```

   </tab>
   </tabs>

For more information on available features and rules, see the [ktlint documentation](https://pinterest.github.io/ktlint/latest/).

## Code analysis with detekt

[detekt](https://github.com/detekt/detekt) is a static code analysis tool for Kotlin that detects code smells, complexity issues,
and potential bugs.

To integrate detekt into your project:

1. Add the plugin to your build file:

   <tabs group="build-system">
   <tab title="Maven" group-key="maven">

   ```xml
   <!-- pom.xml -->
   <plugin>
       <groupId>com.github.ozsie</groupId>
       <artifactId>detekt-maven-plugin</artifactId>
       <version>1.23.8</version>
       <executions>
           <execution>
               <phase>verify</phase>
               <goals>
                   <goal>check</goal>
               </goals>
           </execution>
       </executions>
   </plugin>
   ```

   </tab>
   <tab title="Gradle" group-key="gradle">
   
   ```kotlin
   // build.gradle.kts
   plugins {
       id("io.gitlab.arturbosch.detekt") version "1.23.8"
   }
   ```

   </tab>
   </tabs>

2. You can also add a `detekt.yml` configuration file to the root of your project to customize the rules:

   ```yaml
   complexity:
     LongMethod:
       threshold: 60
   style:
     MagicNumber:
       active: true
   ```

3. Run the analysis:

   <tabs group="build-system">
   <tab title="Maven" group-key="maven">

   ```bash
   mvn verify
   ```

   </tab>
   <tab title="Gradle" group-key="gradle">

   ```bash
   ./gradlew detekt
   ```

   </tab>
   </tabs>

detekt will produce an HTML or XML report in the `build/reports/detekt/` directory. The report lists all rule violations
with their severity, file location, and a description of the issue.

For more information, see the [detekt documentation](https://detekt.dev/docs/intro).

## Code quality with SonarSource

[SonarQube](https://www.sonarsource.com/products/sonarqube/) and [SonarCloud](https://www.sonarsource.com/products/sonarcloud/)
from SonarSource provide deep static analysis for Kotlin projects, including bug detection, vulnerability scanning,
and code coverage tracking through a web dashboard.

To analyze your project with SonarQube:

1. Add the plugin to your build file:

   <tabs group="build-system">
   <tab title="Maven" group-key="maven">

   ```xml
   <!-- pom.xml -->
   <plugin>
       <groupId>org.sonarsource.scanner.maven</groupId>
       <artifactId>sonar-maven-plugin</artifactId>
       <version>5.5.0.6356</version>
   </plugin>
   ```

   </tab>
   <tab title="Gradle" group-key="gradle">

   ```kotlin
   // build.gradle.kts
   plugins {
       id("org.sonarqube") version "6.2.0.5505"
   }
   ```

   </tab>
   </tabs>

2. You can also add a `sonar-project.properties` file to the root of your project to customize quality gate
   conditions. For example, to fail the build if code coverage drops below 80% or if new bugs are introduced:

   ```properties
   sonar.qualitygate.wait=true
   sonar.coverage.minimum=80
   ```

   The `sonar.qualitygate.wait=true` property makes the Maven build wait for the analysis to complete and fail if the gate is not passed.

   > Quality gate rules (such as minimum coverage thresholds and allowed issue counts) are defined in the SonarQube
   > or SonarCloud web interface under **Quality Gates**.
   >
   {style="note"}

3. Run the analysis against your SonarQube server:

   <tabs group="build-system">
   <tab title="Maven" group-key="maven">

   ```bash
   mvn verify sonar:sonar \
     -Dsonar.projectKey=my-project \
     -Dsonar.host.url=http://localhost:9000 \
     -Dsonar.token=YOUR_TOKEN
   ```

   For SonarCloud, replace the host URL with `https://sonarcloud.io` and provide your organization key:

   ```bash
   mvn verify sonar:sonar \
     -Dsonar.projectKey=my-project \
     -Dsonar.organization=my-org \
     -Dsonar.host.url=https://sonarcloud.io \
     -Dsonar.token=YOUR_TOKEN
   ```

   </tab>
   <tab title="Gradle" group-key="gradle">

   ```bash
   ./gradlew sonar \
     -Dsonar.projectKey=my-project \
     -Dsonar.host.url=http://localhost:9000 \
     -Dsonar.token=YOUR_TOKEN
   ```

   For SonarCloud, replace the host URL with `https://sonarcloud.io` and provide your organization key:

   ```bash
   ./gradlew sonar \
     -Dsonar.projectKey=my-project \
     -Dsonar.organization=my-org \
     -Dsonar.host.url=https://sonarcloud.io \
     -Dsonar.token=YOUR_TOKEN
   ```

   </tab>
   </tabs>

4. Open the SonarQube or SonarCloud dashboard to review the results. The dashboard shows issues grouped by type
   (bug, vulnerability, code smell) and severity.

For more information, see the [SonarSource documentation](https://docs.sonarsource.com/).

## Code coverage with Kover

[Kover](https://kotlin.github.io/kotlinx-kover/) is the official JetBrains code coverage tool for Kotlin.
It measures which lines and branches of your code are covered by tests and generates human-readable reports.

Unlike JaCoCo, Kover understands Kotlin-specific constructs such as inline functions and data classes, so it reports
accurate coverage numbers without false negatives caused by compiler-generated bytecode.

To integrate Kover into your project:

1. Add the plugin to your build file:

   <tabs group="build-system">
   <tab title="Maven" group-key="maven">

   ```xml
   <!-- pom.xml -->
   <plugin>
       <groupId>org.jetbrains.kotlinx</groupId>
       <artifactId>kover-maven-plugin</artifactId>
       <version>0.9.8</version>
       <executions>
           <execution>
               <id>instr</id>
               <goals>
                   <goal>instrumentation</goal>
               </goals>
           </execution>
           <execution>
               <id>kover-report-xml</id>
               <phase>verify</phase>
               <goals>
                   <goal>report-xml</goal>
               </goals>
           </execution>
           <execution>
               <id>kover-report-html</id>
               <phase>verify</phase>
               <goals>
                   <goal>report-html</goal>
               </goals>
           </execution>
       </executions>
   </plugin>
   ```

   </tab>
   <tab title="Gradle" group-key="gradle">

   ```kotlin
   // build.gradle.kts
   plugins {
       id("org.jetbrains.kotlinx.kover") version "0.9.8"
   }
   ```

   </tab>
   </tabs>

2. Run your tests to collect coverage data and generate the report:

   <tabs group="build-system">
   <tab title="Maven" group-key="maven">

   ```bash
   mvn verify
   ```

   </tab>
   <tab title="Gradle" group-key="gradle">

   ```bash
   ./gradlew koverHtmlReport
   ```

   </tab>
   </tabs>

3. Open the HTML report  generated in the `target/kover/html/` directory (`build/reports/kover/html/` for Gradle) to
  review line-by-line coverage.
4. To enforce a minimum coverage threshold that fails the build if the conditions are not met, add a coverage verification
configuration to your build file. For example:

   <tabs group="build-system">
   <tab title="Maven" group-key="maven">

   ```xml
   <!-- pom.xml -->
   <!--  Add a `kover-verify` execution section to your build file: -->
   <execution>
       <id>kover-verify</id>
       <goals>
           <goal>verify</goal>
       </goals>
       <configuration>
           <rules>
               <rule>
                   <bounds>
                       <bound>
                           <minValue>80</minValue>
                           <coverageUnits>LINE</coverageUnits>
                           <aggregationForGroup>COVERED_PERCENTAGE</aggregationForGroup>
                       </bound>
                   </bounds>
               </rule>
           </rules>
       </configuration>
   </execution>
   ```

   </tab>
   <tab title="Gradle" group-key="gradle">

   ```kotlin
   // build.gradle.kts
   //  Add a `kover` configuration block
   kover {
       reports {
           verify {
               rule {
                   bound {
                       minValue = 80
                       metric = MetricType.LINE
                       aggregation = AggregationType.COVERED_PERCENTAGE
                   }
               }
           }
       }
   }
   ```

   </tab>
   </tabs>

For more information on configuring verification rules, see the Kover documentation for [Mven](https://kotlin.github.io/kotlinx-kover/maven-plugin/)
and [Gradle](https://kotlin.github.io/kotlinx-kover/gradle-plugin/).

## Other tools

Besides ktlint, detekt, SonarSource, and Kover, you can use other tools to improve Kotlin code quality:

| Tool                                      | Description                                                                                                                                 |
|-------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------|
| [CodeQL](https://codeql.github.com/docs/) | Semantic code analysis engine by GitHub. Supports Kotlin and integrates with GitHub Actions to find security vulnerabilities automatically. |
| [Semgrep](https://semgrep.dev/docs/)      | Fast, lightweight static analysis tool that supports custom rules. Can be used to enforce patterns or detect anti-patterns in Kotlin code.  |
| [PMD](https://docs.pmd-code.org/latest/)  | Source code analyzer that supports Kotlin (via its CPD copy-paste detector) and detects common programming flaws and duplicate code.        |

## What's next

<!-- * [Run tests in Maven projects](maven-running-tests.md) -->
* [Configure a Kotlin project with Maven](maven-configure-project.md)
