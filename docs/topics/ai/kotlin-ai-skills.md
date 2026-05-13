[//]: # (title: Kotlin AI Skills)
[//]: # (description: Learn what Kotlin AI skills are, how they help AI agents, and where to find available skills.)

Kotlin AI skills are reusable instructions that help AI agents
perform Kotlin-specific tasks more reliably.

A skill gives an AI agent the context it needs before it starts executing a task.
For example, a skill can point to a relevant API, define prerequisites,
or provide step-by-step workflow guidance.

Kotlin AI skills help agents produce more accurate results and reduce the time you spend explaining the task manually.
For teams, skills also provide a shared framework for common tasks, so everyone gets consistent results.

[Explore Kotlin AI skills](https://github.com/Kotlin/kotlin-agent-skills){type="button"}

Kotlin AI skills follow the [Agent Skills standard](https://agentskills.io/home), so you can use them
with compatible AI agents. For example, [Junie](https://www.jetbrains.com/junie/), Claude Code, OpenAI Codex, Google Gemini,
and GitHub Copilot.

## Supported workflows

You can use Kotlin AI skills for different Kotlin-specific scenarios. 
The following examples show some of the tasks that AI skills can help you with.

### Convert Java source files to Kotlin

Use [this skill](https://github.com/Kotlin/kotlin-agent-skills/tree/main/skills/kotlin-tooling-java-to-kotlin) when you want to
convert your Java source files to idiomatic Kotlin while preserving behavior and applying Kotlin-specific conventions. 

Learn more in [](mixing-java-kotlin-intellij.md#convert-java-files-to-kotlin).

### Migrate multiplatform projects with Android apps to use AGP 9

Use [this skill](https://github.com/Kotlin/kotlin-agent-skills/tree/main/skills/kotlin-tooling-agp9-migration) when your Kotlin Multiplatform project needs to migrate to AGP 9,
and you want an AI agent to apply the required project and Gradle configuration changes.

Learn more in [Update multiplatform projects with Android apps to use AGP 9](https://kotlinlang.org/docs/multiplatform/multiplatform-project-agp-9-migration.html).

### Migrate multiplatform projects from CocoaPods to SwiftPM dependencies

Use [this skill](https://github.com/Kotlin/kotlin-agent-skills/tree/main/skills/kotlin-tooling-cocoapods-spm-migration) when your Kotlin Multiplatform project
uses CocoaPods for iOS integration and you want an AI agent to move the setup to SwiftPM.

Learn more in [Migrate multiplatform projects from CocoaPods to SwiftPM dependencies](https://kotlinlang.org/docs/multiplatform/multiplatform-cocoapods-spm-migration.html).

## Get support

If you have questions or encounter problems, ask for help in ![Slack](slack.svg){width=25}{type="joined"} Slack: [get an invite](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up) 
and share your experience in the `#ai` channel.