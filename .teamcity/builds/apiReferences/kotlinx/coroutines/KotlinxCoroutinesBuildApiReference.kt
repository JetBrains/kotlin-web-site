package builds.apiReferences.kotlinx.coroutines

import BuildParams.KOTLINX_COROUTINES_RELEASE_TAG
import builds.apiReferences.dependsOnDokkaTemplate
import builds.apiReferences.templates.BuildApiReference
import jetbrains.buildServer.configs.kotlin.BuildType

object KotlinxCoroutinesBuildApiReference : BuildType({
    name = "kotlinx.coroutines API reference"

    templates(BuildApiReference)

    params {
        param("release.tag", KOTLINX_COROUTINES_RELEASE_TAG)
    }

    vcs {
        root(builds.apiReferences.vcsRoots.KotlinxCoroutines)
    }

    dependencies {
        dependsOnDokkaTemplate(KotlinxCoroutinesPrepareDokkaTemplates)
    }
})
