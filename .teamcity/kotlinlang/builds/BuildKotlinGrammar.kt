package kotlinlang.builds

import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.buildSteps.gradle
import kotlinlang.vcsRoots.GrammarGenerator
import kotlinlang.vcsRoots.KotlinSpec

object BuildKotlinGrammar : BuildType({
  name = "Kotlin Grammar"

  artifactRules = "grammar.xml"

  vcs {
    root(GrammarGenerator)
    root(KotlinSpec, "+:/grammar/src/main/antlr => grammar", "-:/grammar/testData")

    cleanCheckout = true
  }

  steps {
    gradle {
      tasks = "run"
      buildFile = "build.gradle.kts"
      gradleParams = "--debug"
      dockerImage = "openjdk:8-jdk-alpine"
    }
  }

  requirements {
    doesNotContain("teamcity.agent.name", "windows")
    doesNotContain("teamcity.agent.name", "W7")
    doesNotContain("teamcity.agent.name", "Helpbuilder")
  }
})
