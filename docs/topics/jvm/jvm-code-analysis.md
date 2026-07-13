[//]: # (title: Code quality tools in Kotlin projects)

Code quality tools help you enforce coding standards, detect bugs early, measure test coverage, and maintain code quality
across your Kotlin projects. This guide focusesand shows how to integrate popular tools like
[ktlint](https://ktlint.github.io/ktlint/latest/), [detekt](https://detekt.dev/), [SonarQube](https://www.sonarsource.com/products/sonarqube/),
[SonarCloud](https://www.sonarsource.com/products/sonarcloud/), and [Kover](https://kotlin.github.io/kotlinx-kover/) into
your backend project for Maven or Gradle.

## Code formatting with ktlint

[ktlint](https://github.com/ktlint/ktlint) is a Kotlin linter and formatter that enforces the
official Kotlin [coding conventions](coding-conventions.md) with no extra configuration.

ktlint checks rules such as indentation, spacing around operators, import ordering, and trailing commas. If a violation
is found, the build fails with a message indicating the file and line number. Besides reporting violations, ktlint can
also automatically fix straightforward issues.

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

3. (Optional) You can also add an `.editorconfig` file to the root of your project to customize rules. For example, to
   allow wildcard imports and disable trailing comma enforcement:

   ```ini
   [*.{kt,kts}]
   ij_kotlin_imports_layout = *
   ktlint_standard_trailing-comma-on-call-site = disabled
   ktlint_standard_trailing-comma-on-declaration-site = disabled
   ```

   By default, ktlint follows the official Kotlin coding conventions. If you prefer the
   [Android Kotlin style guide](https://developer.android.com/kotlin/style-guide), which differs noticeably from
   the Kotlin conventions, set the code style to `android_studio` in your `.editorconfig` file:

   ```ini
   [*.{kt,kts}]
   ktlint_code_style = android_studio
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

For more information on available features and rules, see the [ktlint documentation](https://github.com/ktlint/ktlint/tree/master/documentation).

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

2. Generate a default `detekt.yml` [configuration file](https://detekt.dev/docs/introduction/configurations):

   <tabs group="build-system">
   <tab title="Maven" group-key="maven">

   ```bash
   mvn detekt:generate-config
   ```

   </tab>
   <tab title="Gradle" group-key="gradle">

   ```bash
   ./gradlew detektGenerateConfig
   ```

   </tab>
   </tabs>

3. Open the `detekt.yml` file and customize the rules in the generated file, for example:

   ```yaml
   complexity:
     LongMethod:
       threshold: 50
   style:
     MagicNumber:
       active: false
   ```

4. Reference the configuration file in your build file so that detekt can apply the new rules:

   <tabs group="build-system">
   <tab title="Maven" group-key="maven">

   ```xml
   <!-- pom.xml -->
   <plugin>
       <groupId>com.github.ozsie</groupId>
       <artifactId>detekt-maven-plugin</artifactId>
       <version>1.23.8</version>
       <configuration>
           <config>detekt.yml</config>
           <report>
               <report>txt:reports/detekt.txt</report>
               <report>xml:reports/detekt.xml</report>
           </report>
       </configuration>
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
   detekt {
       toolVersion = "1.23.8"
       config.setFrom(file("config/detekt/detekt.yml"))
       buildUponDefaultConfig = true
   }
   ```

   </tab>
   </tabs>

5. Run the analysis:

   <tabs group="build-system">
   <tab title="Maven" group-key="maven">

   ```bash
   mvn detekt:check
   ```

   </tab>
   <tab title="Gradle" group-key="gradle">

   ```bash
   ./gradlew detekt
   ```

   </tab>
   </tabs>

detekt produces a report listing all rule violations with their severity, file location, and a description of the issue.
By default, Gradle outputs reports to `build/reports/detekt`, while Maven outputs to the `reports/detekt` directory in the project root.

For more information, see the detekt documentation for [Gradle](https://detekt.dev/docs/intro) and [Maven](https://github.com/Ozsie/detekt-maven-plugin).

## Code quality with SonarSource

[SonarQube](https://github.com/SonarSource/sonarqube) and [SonarCloud](https://github.com/marketplace/sonarcloud)
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
       <version>5.7.0.6970</version>
   </plugin>
   ```

   </tab>
   <tab title="Gradle" group-key="gradle">

   ```kotlin
   // build.gradle.kts
   plugins {
       id("org.sonarqube") version "6.2.0.5505"
   }

   sonar {
       properties {
           property("sonar.projectKey", "my-project")
           property("sonar.host.url", "http://localhost:9000")
       }
   }
   ```

   </tab>
   </tabs>

2. (Optional) Configure analysis properties. For example, to make the build wait for the
   quality gate result and fail if the gate is not passed, add the `sonar.qualitygate.wait` property:

   <tabs group="build-system">
   <tab title="Maven" group-key="maven">

   ```bash
   mvn verify sonar:sonar \
     -Dsonar.qualitygate.wait=true \
     -Dsonar.projectKey=my-project \
     -Dsonar.host.url=http://localhost:9000 \
     -Dsonar.token=YOUR_TOKEN
   ```

   </tab>
   <tab title="Gradle" group-key="gradle">

   ```kotlin
   // build.gradle.kts
   sonar {
       properties {
           property("sonar.qualitygate.wait", "true")
       }
   }
   ```

   </tab>
   </tabs>

   > Quality gate rules (such as minimum coverage thresholds and allowed issue counts) are defined in the SonarQube
   > or SonarCloud web interface under **Quality Gates**, not in the build file.
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

   To run the analysis, use the `sonar` task and provide your authentication token:

   ```bash
   ./gradlew sonar \
     -Dsonar.token=YOUR_TOKEN
   ```

   By default, the analysis is run against a local SonarQube server. To use SonarCloud, update the `sonar {}` block
   in your `build.gradle.kts` to use `https://sonarcloud.io` and add your organization key:

   ```kotlin
   sonar {
       properties {
           property("sonar.projectKey", "example-project")
           property("sonar.organization", "example-org")
           property("sonar.host.url", "https://sonarcloud.io")
       }
   }
   ```

   </tab>
   </tabs>

4. Open the SonarQube or SonarCloud dashboard to review the results. The dashboard shows issues grouped by type
   (bug, vulnerability, code smell) and severity.

For more information, see the [SonarSource documentation](https://docs.sonarsource.com/).

## Code coverage with Kover

[Kover](https://github.com/Kotlin/kotlinx-kover) is the official JetBrains code coverage tool for Kotlin.
It measures which lines and branches of your code are covered by tests and generates human-readable reports.

Unlike [JaCoCo](https://github.com/jacoco/jacoco), Kover correctly interprets Kotlin-specific constructs such as inline functions and data classes, so it reports
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
               <id>kover-verify</id>
               <goals>
                  <goal>verify</goal>
               </goals>
           </execution>
           <execution>
               <id>kover-report-xml</id>
               <goals>
                   <goal>report-xml</goal>
               </goals>
           </execution>
           <execution>
               <id>kover-report-html</id>
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
   ./gradlew koverVerify koverHtmlReport
   ```

   </tab>
   </tabs>

3. Open the HTML report generated in the `target/site/kover/html/` directory (`build/reports/kover/html/` for Gradle) to
   review line-by-line coverage.
4. (Optional) To enforce a minimum coverage threshold that fails the build if the conditions are not met, you can add
   a coverage verification configuration to your build file. For example:

   <tabs group="build-system">
   <tab title="Maven" group-key="maven">

   ```xml
   <!-- pom.xml -->
   <configuration>
     <!-- Create new coverage verification rule -->
     <rules>
         <rule>
             <bounds>
                 <bound>
                     <minValue>50</minValue>
                     <coverageUnits>LINE</coverageUnits>
                     <aggregationForGroup>COVERED_PERCENTAGE</aggregationForGroup>
                 </bound>
             </bounds>
         </rule>
     </rules>
   </configuration>
   ```

   </tab>
   <tab title="Gradle" group-key="gradle">

   ```kotlin
   // build.gradle.kts
   // Add a `kover` configuration block
   import kotlinx.kover.gradle.plugin.dsl.*
   
   kover {
       reports {
           total {
               log {
                   aggregationForGroup = AggregationType.COVERED_PERCENTAGE
                   coverageUnits = CoverageUnit.LINE
               }
               verify {
                   rule {
                       minBound(50)
                   }
               }
           }
       }
   }
   ```

   </tab>
   </tabs>

For more information on configuring verification rules, see the Kover documentation for [Maven](https://kotlin.github.io/kotlinx-kover/maven-plugin/)
and [Gradle](https://kotlin.github.io/kotlinx-kover/gradle-plugin/).

## Other tools

Besides ktlint, detekt, SonarQube, SonarCloud, and Kover, try out other tools to improve Kotlin code quality:

| Tool                                      | Description                                                                                                                                 |
|-------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------|
| [CodeQL](https://codeql.github.com/docs/) | Semantic code analysis engine by GitHub. Supports Kotlin and integrates with GitHub Actions to find security vulnerabilities automatically. |
| [Semgrep](https://semgrep.dev/docs/)      | Fast, lightweight static analysis tool that supports custom rules. Can be used to enforce patterns or detect anti-patterns in Kotlin code.  |
| [PMD](https://docs.pmd-code.org/latest/)  | Source code analyzer that supports Kotlin (via its CPD copy-paste detector) and detects common programming flaws and duplicate code.        |

## What's next

* [Run tests in Maven projects](jvm-test-maven.md)
* [Configure a Kotlin project with Maven](maven-configure-project.md)
