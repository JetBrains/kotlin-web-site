package builds.references

import BuildParams.API_REFERENCES
import builds.references.stdlib.BasePrepareDokkaTemplate
import builds.references.stdlib.BuildStdlibApiReference
import builds.references.stdlib.StdlibPrepareDokkaTemplates
import jetbrains.buildServer.configs.kotlin.Project

object ReferencesProject : Project({
    name = "API References"
    description = "Build API references for kotlinlang.org"

    template(BasePrepareDokkaTemplate)

    buildType(BuildStdlibApiReference)
    buildType(StdlibPrepareDokkaTemplates)

    for (reference in API_REFERENCES) {
        subProject(reference.project)
    }
})
