package builds.kotlinlang.buidTypes

import builds.apiReferences.kotlinx.coroutines.KotlinxCoroutinesBuildApiReference
import builds.apiReferences.kotlinx.datetime.KotlinxDatetimeBuildApiReference
import builds.apiReferences.kotlinx.metadataJvm.KotlinxMetadataJvmBuildApiReference
import builds.apiReferences.kotlinx.serialization.KotlinxSerializationBuildApiReference
import builds.kotlinlang.templates.DockerImageBuilder
import jetbrains.buildServer.configs.kotlin.*
import jetbrains.buildServer.configs.kotlin.buildSteps.ScriptBuildStep
import jetbrains.buildServer.configs.kotlin.buildSteps.script

private const val kotlinWebsiteSetup = "/kotlin-website-setup.sh"

object BuildSitePages : BuildType({
  name = "Build site pages"

  templates(DockerImageBuilder)

  artifactRules = """
        dist/** => pages.zip
        robots.txt => pages.zip
    """.trimIndent()

  vcs {
    root(vcsRoots.KotlinLangOrg)
    cleanCheckout = true
  }

  steps {
    script {
      name = "Build html pages"
      scriptContent = """
                #!/bin/bash
                
                set -x
                
                cat $kotlinWebsiteSetup
                source $kotlinWebsiteSetup
                
                ## refresh packages
                pip install -r requirements.txt
                npm i -g yarn
                
                yarn install --frozen-lockfile
                
                python kotlin-website.py build
            """.trimIndent()
      formatStderrAsError = true
      dockerImage = "%dep.Kotlin_KotlinSites_Builds_KotlinlangOrg_BuildPythonContainer.kotlin-website-image%"
      dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
      dockerPull = true
    }

    script {
      name = "Override with external source"
      scriptContent = """
                cp -fR _webhelp/reference/* build/docs/
                #cp -fR _webhelp/mobile build/docs/
                mv build dist
                cp -fR spec dist/
                cp -fR _assets dist/
                cp -fR out dist/
                cp -fR out/_next dist/_next/
                cp -fR libs/* dist/api/
            """.trimIndent()
      dockerImage = "alpine"
    }

    script {
      name = "Build Sitemap"
      conditions {
        equals("teamcity.build.branch.is_default", "true")
      }
      scriptContent = """
                #!/bin/bash
                pip install -r requirements.txt
                python kotlin-website.py sitemap
            """.trimIndent()
      dockerImage = "%dep.Kotlin_KotlinSites_Builds_KotlinlangOrg_BuildPythonContainer.kotlin-website-image%"
      dockerImagePlatform = ScriptBuildStep.ImagePlatform.Linux
      dockerPull = true
    }

    script {
      name = "Update build status"
      scriptContent = """
                #!/bin/bash
                
                if [[ "%teamcity.build.branch%" == "<default>" ]]; then
                  url="https://branch-.kotlin-web-site.labs.jb.gg"
                else
                  url="https://branch-%teamcity.build.branch%.kotlin-web-site.labs.jb.gg"
                fi
                
                echo " ##teamcity[buildStatus text='{build.status.text} ${'$'}{url}'] "
            """.trimIndent()
    }
  }

  dependencies {
    dependency(BuildJsAssets) {
      snapshot {
        onDependencyFailure = FailureAction.FAIL_TO_START
        onDependencyCancel = FailureAction.CANCEL
      }

      artifacts {
        artifactRules = "+:assets.zip!** => ./"
      }
    }

    dependency(BuildKotlinSpec) {
      snapshot {
        onDependencyFailure = FailureAction.FAIL_TO_START
        onDependencyCancel = FailureAction.CANCEL
        synchronizeRevisions = false
      }

      artifacts {
        buildRule = lastSuccessful()
        cleanDestination = true
        artifactRules = """
                    +: spec.zip!html => spec
                    +: spec.zip!pdf => spec/pdf
                """.trimIndent()
      }
    }

    dependency(BuildReferenceDocs) {
      snapshot {
        onDependencyFailure = FailureAction.FAIL_TO_START
      }

      artifacts {
        artifactRules = "+:docs.zip!** => _webhelp/reference/"
      }
    }

    dependency(KotlinxCoroutinesBuildApiReference) {
      snapshot {
        reuseBuilds = ReuseBuilds.NO
        onDependencyFailure = FailureAction.FAIL_TO_START
      }

      artifacts {
        artifactRules = "+:pages.zip!** => libs/kotlinx.coroutines/"
      }
    }

    dependency(KotlinxDatetimeBuildApiReference) {
      snapshot {
        reuseBuilds = ReuseBuilds.NO
        onDependencyFailure = FailureAction.FAIL_TO_START
      }

      artifacts {
        artifactRules = "+:pages.zip!** => libs/kotlinx-datetime/"
      }
    }

    dependency(KotlinxMetadataJvmBuildApiReference) {
      snapshot {
          reuseBuilds = ReuseBuilds.NO
          onDependencyFailure = FailureAction.FAIL_TO_START
      }

      artifacts {
          artifactRules = "+:pages.zip!** => libs/kotlinx-metadata-jvm/"
      }
    }

    dependency(FetchBlogNews) {
        snapshot {
            onDependencyFailure = FailureAction.FAIL_TO_START
            onDependencyCancel = FailureAction.CANCEL
            synchronizeRevisions = false
        }

        artifacts {
            buildRule = lastSuccessful("<default>")
            artifactRules = """
                +: latest-news.zip!** => latest-news/
            """.trimIndent()
            cleanDestination = true
        }
    }

    dependency(KotlinxSerializationBuildApiReference) {
      snapshot {
        reuseBuilds = ReuseBuilds.NO
        onDependencyFailure = FailureAction.FAIL_TO_START
      }

      artifacts {
        artifactRules = "+:pages.zip!** => libs/kotlinx.serialization/"
      }
    }

    artifacts(AbsoluteId("Kotlin_KotlinRelease_1920_LibraryReferenceLegacyDocs")) {
      buildRule = tag("publish", """
                +:<default>
                +:*
            """.trimIndent())
      artifactRules = """
                kotlin.test.zip!** => api/latest/kotlin.test
                kotlin-stdlib.zip!** => api/latest/jvm/stdlib
            """.trimIndent()
    }
  }
})
