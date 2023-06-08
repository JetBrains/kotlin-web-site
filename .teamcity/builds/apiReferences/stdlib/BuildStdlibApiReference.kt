package builds.apiReferences.stdlib

import jetbrains.buildServer.configs.kotlin.AbsoluteId
import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.FailureAction
import jetbrains.buildServer.configs.kotlin.ReuseBuilds

object BuildStdlibApiReference : BuildType({
    name = "Stdlib Api reference"

    artifactRules = "latest-version.zip"

    vcs {
        root(vcsRoots.KotlinLangOrg)
    }

    params {
        param("%apiTemplatesBranch%", "ktl-696-dokka-stdlib")
        param("revers.deps.*.templatesBranch", "%templatesBranch%")
    }

    dependencies {
        dependency(AbsoluteId("Kotlin_BuildPlayground_Sirius_LibraryReferenceLatestDocs")) {
            snapshot {
                reuseBuilds = ReuseBuilds.SUCCESSFUL
                onDependencyFailure = FailureAction.FAIL_TO_START
            }
            artifacts {
                cleanDestination = true
                artifactRules = "latest-version.zip"
            }
        }
    }
})