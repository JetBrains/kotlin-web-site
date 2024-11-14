package templates

import jetbrains.buildServer.configs.kotlin.Template

object TemplateSearchIndex : Template({
    name = "Site Search Index"
    description = "Template for make search index for Algolia using Google Analytics data"
})
