package kotlinlang.builds

import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.buildSteps.script

object BuildKotlinSpec : BuildType({
  name = "Kotlin Spec"

  artifactRules = "spec.zip"

  steps {
    script {
      name = "Get spec artifact"
      scriptContent = """
        curl -o last_build_info.xml "https://teamcity.jetbrains.com/guestAuth/app/rest/builds/branch:default:true,buildType:(id:Kotlin_Spec_DocsMaster),count:1,status:SUCCESS"
        
        build_number=${'$'}(sed -ne "s/.*Kotlin_Spec_DocsMaster\" number=\"\([^ ]*\)\".*/\1/p" last_build_info.xml)
        
        curl -o spec.zip "https://teamcity.jetbrains.com/guestAuth/app/rest/builds/buildType:(id:Kotlin_Spec_DocsMaster),status:success,branch:default:true/artifacts/content/kotlin-spec-latest-${'$'}build_number.zip"
      """.trimIndent()
    }
  }

  triggers {
    trigger {
      type = "urlBuildTrigger"
      param("url.build.trigger.url", "https://teamcity.jetbrains.com/guestAuth/app/rest/builds/branch:default:true,buildType:(id:Kotlin_Spec_DocsMaster),count:1,status:SUCCESS")
    }
  }

  requirements {
    doesNotContain("teamcity.agent.name", "windows")
  }
})
