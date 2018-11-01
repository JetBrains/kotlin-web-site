from src.markdown.makrdown import jinja_aware_markdown

PREFERRED_URL_SCHEME = 'http'
SERVER_NAME = 'localhost:5000'
FLATPAGES_EXTENSION = '.md'
FLATPAGES_HTML_RENDERER = jinja_aware_markdown
FREEZER_IGNORE_404_NOT_FOUND = True
FLATPAGES_AUTO_RELOAD = True
FREEZER_STATIC_IGNORE = ["*"]
ERROR_404_HELP = False
GITHUB_URL = 'https://github.com/JetBrains/kotlin'
TWITTER_URL = 'https://twitter.com/kotlin'
EDIT_ON_GITHUB_URL = 'https://github.com/JetBrains/kotlin-web-site/edit/master/'
PDF_URL = '/docs/kotlin-docs.pdf'
FORUM_URL = 'http://devnet.jetbrains.com/community/kotlin'
SITE_GITHUB_URL = 'http://github.com/JetBrains/kotlin-web-site'
CODE_URL = 'https://github.com/JetBrains/kotlin-examples/tree/master'

TEXT_USING_GRADLE = "In this tutorial we're going to be using Gradle but the same can be accomplished using either IntelliJ IDEA project structure or Maven. For details on setting up Gradle to work with Kotlin, see [Using Gradle](/docs/reference/using-gradle.html)."