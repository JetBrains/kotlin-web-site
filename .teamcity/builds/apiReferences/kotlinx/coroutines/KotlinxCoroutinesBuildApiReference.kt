package builds.apiReferences.kotlinx.coroutines

import BuildParams.KOTLINX_COROUTINES_ID
import BuildParams.KOTLINX_COROUTINES_RELEASE_TAG
import builds.apiReferences.dependsOnDokkaTemplate
import builds.apiReferences.stdlib.copyDokkaFiles
import builds.apiReferences.stdlib.sitemapGenerate
import builds.apiReferences.templates.BuildApiReference
import jetbrains.buildServer.configs.kotlin.BuildType

object KotlinxCoroutinesBuildApiReference : BuildType({
    name = "$KOTLINX_COROUTINES_ID pages"
    description = "Build pages for Kotlinx Coroutines"

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

    steps {
        copyDokkaFiles(KOTLINX_COROUTINES_ID)
        sitemapGenerate(KOTLINX_COROUTINES_ID)
    }
})
