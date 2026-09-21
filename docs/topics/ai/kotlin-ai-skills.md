[//]: # (title: Kotlin AI skills)
[//]: # (description: Learn what Kotlin AI skills are, how they help AI agents, and where to find available skills.)

Kotlin AI skills are reusable instructions that help AI agents
perform Kotlin-specific tasks more reliably.

A skill gives an AI agent the context it needs before it starts executing a task.
For example, a skill can point to a relevant API, define prerequisites,
or provide step-by-step workflow guidance.

Kotlin AI skills help agents produce more accurate results and reduce the time you spend explaining the task yourself.
For teams, skills also provide a shared framework for common tasks, so everyone gets consistent results.

<a href="https://github.com/Kotlin/kotlin-agent-skills" as="button" mode="rock" icon="arrow-right" icon-position="right">Explore Kotlin AI skills</a>

Kotlin AI skills follow the [Agent Skills standard](https://agentskills.io/home), so you can use them
with compatible AI agents, for example, [Junie](https://www.jetbrains.com/junie/), Claude Code, OpenAI Codex, Google Gemini,
and GitHub Copilot.

## Set up AI skills in IDEs

Learn how to set up and use AI skills in:

* [IntelliJ IDEA](https://www.jetbrains.com/help/ai-assistant/agent-skills.html)
* [Android Studio](https://developer.android.com/tools/agents/android-skills)

## Supported workflows

You can use Kotlin AI skills for different Kotlin-specific scenarios. 
The following examples show some of the tasks that AI skills can help you with.

<p></p> <!-- workaround for MRK057: Paragraph can only contain inline elements -->
<panels columns="2" id="kotlin-ai-skills">
    <panel>
        <title>Convert Java source files to Kotlin</title>
        <p>Convert your Java source files to idiomatic Kotlin while preserving behavior and applying Kotlin-specific conventions.<br/>
        Learn more about <a href="mixing-java-kotlin-intellij.md">this scenario</a>.</p>
        <a href="https://github.com/Kotlin/kotlin-agent-skills/tree/main/skills/kotlin-tooling-java-to-kotlin" as="button" icon="arrow-right" icon-position="right" id="kotlin-tooling-java-to-kotlin">AI skill</a>
    </panel>
    <panel>
        <title>Migrate multiplatform projects to AGP 9</title>
        <p>Migrate your Kotlin Multiplatform project to AGP 9 and enable an AI agent to apply the required project and Gradle configuration changes.<br/>
        Learn more about this scenario in <a href="https://kotlinlang.org/docs/multiplatform/multiplatform-project-agp-9-migration.html">this scenario</a>.</p>
        <a href="https://github.com/Kotlin/kotlin-agent-skills/tree/main/skills/kotlin-tooling-agp9-migration" as="button" icon="arrow-right" icon-position="right" id="kotlin-tooling-agp9-migration">AI skill</a>
    </panel>
    <panel>
        <title>Migrate from CocoaPods to SwiftPM</title>
        <p>Migrate Kotlin Multiplatform projects from CocoaPods dependencies to Swift Package Manager dependencies.<br/>
         Learn more about <a href="https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-spm-migration-ai.html">this scenario</a>.</p>
        <a href="https://github.com/Kotlin/kotlin-agent-skills/tree/main/skills/kotlin-tooling-cocoapods-spm-migration" as="button" icon="arrow-right" icon-position="right" id="kotlin-tooling-cocoapods-spm-migration">AI skill</a>
    </panel>
    <panel>
        <title>Design JPA entity mappings</title>
        <p>Design reliable Kotlin entities for Spring Data JPA and Hibernate, including identity, relationships, constraints, fetching, and common ORM pitfalls.</p>
        <a href="https://github.com/Kotlin/kotlin-agent-skills/tree/main/skills/kotlin-backend-jpa-entity-mapping" as="button" icon="arrow-right" icon-position="right" id="kotlin-backend-jpa-entity-mapping">AI skill</a>
    </panel>
    <panel>
        <title>Convert a Gradle plugin to a Kotlin Toolchain plugin</title>
        <p>Reimplement an existing Gradle plugin as a local Kotlin Toolchain plugin.</p>
        <a href="https://github.com/Kotlin/kotlin-agent-skills/tree/main/skills/kotlin-tooling-gradle-to-kotlin-toolchain-plugin" as="button" icon="arrow-right" icon-position="right" id="kotlin-tooling-gradle-to-kotlin-toolchain-plugin">AI skill</a>
    </panel>
    <panel>
        <title>Migrate a Gradle project to Kotlin Toolchain</title>
        <p>Migrate an entire Gradle-based Kotlin project, including its configuration, plugins, and CI workflows.</p>
        <a href="https://github.com/Kotlin/kotlin-agent-skills/tree/main/skills/kotlin-tooling-gradle-to-kotlin-toolchain-project" as="button" icon="arrow-right" icon-position="right" id="kotlin-tooling-gradle-to-kotlin-toolchain-project">AI skill</a>
    </panel>
    <panel>
        <title>Migrate to immutable collections 0.5.x</title>
        <p>Update projects to <code>kotlinx.collections.immutable 0.5.x</code> and replace deprecated persistent collection operations.</p>
        <a href="https://github.com/Kotlin/kotlin-agent-skills/tree/main/skills/kotlin-tooling-immutable-collections-0-5-x-migration" as="button" icon="arrow-right" icon-position="right" id="kotlin-tooling-immutable-collections-0-5-x-migration">AI skill</a>
    </panel>
    <panel>
        <title>Create a Kotlin Toolchain plugin</title>
        <p>Create local plugins for custom build tasks, code generation, verification, and packaging.</p>
        <a href="https://github.com/Kotlin/kotlin-agent-skills/tree/main/skills/kotlin-tooling-kotlin-toolchain-plugin-authoring" as="button" icon="arrow-right" icon-position="right" id="kotlin-tooling-kotlin-toolchain-plugin-authoring">AI skill</a>
    </panel>
    <panel>
        <title>Build projects with Kotlin Toolchain</title>
        <p>Create, configure, build, test, and package Kotlin and Java projects using Kotlin Toolchain.</p>
        <a href="https://github.com/Kotlin/kotlin-agent-skills/tree/main/skills/kotlin-tooling-kotlin-toolchain" as="button" icon="arrow-right" icon-position="right" id="kotlin-tooling-kotlin-toolchain">AI skill</a>
    </panel>
    <panel>
        <title>Improve Kotlin/Native build performance</title>
        <p>Diagnose slow Kotlin/Native and iOS builds and get recommendations for targeted changes to compilation, linking, caching, targets, and CI configuration.</p>
        <a href="https://github.com/Kotlin/kotlin-agent-skills/tree/main/skills/kotlin-tooling-native-build-performance" as="button" icon="arrow-right" icon-position="right" id="kotlin-tooling-native-build-performance">AI skill</a>
    </panel>
</panels>

## Get support

If you have questions or encounter problems, ask for help in ![Slack](slack.svg){width=25}{type="joined"} Slack: [get an invite](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 
and share your experience in the `#ai` channel.