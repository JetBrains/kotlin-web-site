package builds.references.stdlib

import builds.common.configureReferenceTemplate
import jetbrains.buildServer.configs.kotlin.Template
import vcsRoots.KotlinLangOrg

object BasePrepareDokkaTemplate : Template({
    configureReferenceTemplate()

    name = "Build Custom HTML Template"

    vcs {
        root(KotlinLangOrg)
    }
})
