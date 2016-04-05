import markdown.extensions.fenced_code
import markdown.extensions.codehilite
import markdown.extensions.attr_list

DEBUG = True
FLATPAGES_EXTENSION = '.md'
FLATPAGES_MARKDOWN_EXTENSIONS = [
    markdown.extensions.attr_list.AttrListExtension(),
    markdown.extensions.codehilite.CodeHiliteExtension(guess_lang=False, css_class="code"),
    markdown.extensions.fenced_code.FencedCodeExtension()
]
GITHUB_URL = 'https://github.com/JetBrains/kotlin'
TWITTER_URL = 'https://twitter.com/kotlin'
# forum_url= http://devnet.jetbrains.com/community/kotlin
# site_github_url: http://github.com/JetBrains/kotlin-web-site
# edit_on_github_url: https://github.com/JetBrains/kotlin-web-site/edit/master/%path%
# pdf_url: /docs/kotlin-docs.pdf
# img_tutorial_root: assets/images/tutorials
