package builds.apiReferences.stdlib

import builds.apiReferences.templates.BuildApiReferenceSearchIndex
import jetbrains.buildServer.configs.kotlin.BuildType
import jetbrains.buildServer.configs.kotlin.FailureAction

object StdlibBuildSearchIndex : BuildType({
    name = "Build search index for stdlib"

    templates(BuildApiReferenceSearchIndex)

    params {
        param("env.ALGOLIA_INDEX_NAME", "api-core")
        param("env.API_REFERENCE_URL", "/api/core")
    }

    dependencies {
        dependency(BuildStdlibApiReference) {
            snapshot {
                onDependencyFailure = FailureAction.FAIL_TO_START
                onDependencyCancel = FailureAction.CANCEL
            }
            artifacts {
                artifactRules = "+:pages.json => api-references/"
            }
        }
    }
})