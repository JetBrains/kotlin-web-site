package kotlinlang.builds

import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.buildSteps.gradle
import kotlinlang.vcsRoots.GrammarGenerator
import kotlinlang.vcsRoots.KotlinSpecGrammar

object BuildKotlinGrammar : BuildType({
  name = "Kotlin Grammar"

  artifactRules = "grammar.xml"

  vcs {
    root(GrammarGenerator)
    root(KotlinSpecGrammar, "+:/grammar/src/main/antlr => grammar")

    cleanCheckout = true
  }

  steps {
    gradle {
      tasks = "run"
      buildFile = "build.gradle.kts"
      gradleParams = "--debug"
      dockerImage = "amazoncorretto:21-alpine-jdk"
    }
  }

  requirements {
    doesNotContain("teamcity.agent.name", "windows")
    doesNotContain("teamcity.agent.name", "W7")
    doesNotContain("teamcity.agent.name", "Helpbuilder")
  }
})
