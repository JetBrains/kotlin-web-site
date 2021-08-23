import os
import re
from os import path
import yaml
import shutil

from src.github import assert_valid_git_hub_url

root_folder = path.normpath(path.join(os.path.dirname(__file__), '..'))


def _parse_replacements(item : dict, context) -> list:
    replacements: list = []

    if 'replace' in item and isinstance(item['replace'], list):
        for it in item['replace']:

            def process(it):
                re_text = it['regex']
                replace = it['with']

                try:
                    re_compile = re.compile(re_text)
                except BaseException as e:
                    raise Exception("Failed to parse regex %s for %s." % (re_text, context)) from e

                def replace_function(text):
                    return re_compile.sub(replace, text)

                return replace_function

            replacements.append(process(it))

    return replacements

class ExternalMount:

    def __init__(self, build_mode, external_spec):
        self.build_mode = build_mode

        print("Detected external: ", external_spec)
        self.external_base: str = external_spec['base']
        self.external_path: str = external_spec['path']
        self.external_nav: str = external_spec['nav']
        self.external_repo: str = external_spec['repo']
        self.external_branch: str = external_spec['branch']
        self.inline: bool = bool(external_spec['inline'] or 'False') if 'inline' in external_spec else False
        self.wrap_code_snippets: bool = bool(external_spec['wrap_code_snippets'] or 'False') if 'wrap_code_snippets' in external_spec else False

        if self.external_base.startswith("/docs/reference/"):
            self.page_type: str = 'doc'
            self.page_layout: str = 'reference'
        elif self.external_base.startswith("/docs/tutorials/"):
            self.page_type: str = 'tutorial'
            self.page_layout: str = 'tutorial'
        else:
            raise Exception("Unknown external path %s in %s" % (self.external_path, self.external_base))

        assert_valid_git_hub_url(self.external_repo, 'EXTERNAL MODULE: %s' % self.external_path)

        self.target_external_path = path.join(root_folder, 'pages', self.external_base.lstrip("/"))
        self.source_external_path = path.join(root_folder, 'external', self.external_path.lstrip("/"))
        # assuming external folder contains only sub repositories
        self.source_checkout_root = path.join(root_folder, 'external', self.external_path.split("/")[0])

        self.nav_file = path.join(self.source_external_path, self.external_nav.lstrip("/"))
        self.replacements = _parse_replacements(external_spec, self.external_nav)
        self.explicit_github_edit_page = external_spec['github_edit_page'] if 'github_edit_page' in external_spec else None

        print("External repo:       ", self.external_repo)
        print("External nav file:   ", self.nav_file)
        print("External source dir: ", self.source_external_path)
        print("External target dir: ", self.target_external_path)

    def github_view_url(self, real_path: str) -> str:
        file = path.relpath(real_path, self.source_checkout_root)
        return self.external_repo.rstrip('/') + "/blob/" + self.external_branch + "/" + file.lstrip("/")

    def github_edit_url(self, real_path: str) -> str:
        if self.explicit_github_edit_page is None:
            file = path.relpath(real_path, self.source_checkout_root)
        else:
            file = self.explicit_github_edit_page

        return self.external_repo.rstrip('/') + "/edit/" + self.external_branch + "/" + file.lstrip("/")


def _rant_if_external_nav_is_not_found(self: ExternalMount):
    if os.path.isfile(self.nav_file):
        return True

    if self.build_mode:
        raise Exception("File " + self.nav_file + " is not found, clone "
                        + self.external_repo + " to " + self.source_external_path)
    else:
        print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        print("!!!! Cannot locate external sources for path ")
        print("!!!!   " + self.external_path)
        print("!!!! Cannot locate NAV file for path")
        print("!!!!   " + self.nav_file)
        print("!!!! Please make sure you checked out the external repository")
        print("!!!!   " + self.external_repo)
        print("!!!! to ")
        print("!!!!   " + self.source_external_path)
        print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
        return False


class ExternalItem:

    def __init__(self, module: ExternalMount, url_mappers, item):
        self.module = module
        self.url_mappers = url_mappers

        self.title: str = item['title']
        self.url: str = item['url']
        self.md: str = item['md']
        self.html = module.external_base.rstrip("/") + "/" + self.url.lstrip("/")
        self.replacements = _parse_replacements(item, self.md) + module.replacements

        assert self.md.endswith(".md"), "md path " + self.md + " must have `.md` extension"
        assert self.url.endswith(".html"), "url path " + self.url + "must have `.html` " \
                                                                    "extension, no matter you have " \
                                                                    "`.md` file instead "

        self.ext_fix = re.compile('\\.html$')
        self.source_item = path.join(module.source_external_path, self.md.lstrip('/'))
        self.target_name = self.ext_fix.sub(".md", self.url.lstrip('/'))
        self.target_item = path.join(module.target_external_path, self.target_name)
        self.target_dir = os.path.dirname(self.target_item)
        self.github_edit_url = module.github_edit_url(self.source_item)

    def generate_header(self):
        return "##################################################\n" \
               "#### THIS FILE WAS AUTOGENERATED FROM\n"              \
               "#### " + self.module.external_repo + "\n"             \
               "#### branch " + self.module.external_branch + "\n"    \
               "#### file   " + self.md + "\n"                        \
               "#### links were in the file! \n"                      \
               "#### HEADER below IS GENERATED! \n"                   \
               "##################################################\n" \
               "\n"                                                   \
               "---\n"                                                \
               "type: " + self.module.page_type + " \n"               \
               "layout: " + self.module.page_layout + " \n"           \
               "title: \"" + self.title + "\"\n"                      \
               "github_edit_url: " + self.github_edit_url + "\n"      \
               "---\n\n"                                              \



def _process_external_entry(self: ExternalMount, url_mappers, entry: dict) -> list:
    item = ExternalItem(self, url_mappers, entry)

    if not os.path.isdir(item.target_dir):
        os.makedirs(item.target_dir, mode=0o777)

    with open(item.source_item, 'r') as file:
        source_text = file.read()

    # TODO: check `---` headers at the beginning of the original file and WARN or MERGE
    source_text = url_mappers(source_text, item.source_item)

    for repl in item.replacements:
        source_text = repl(source_text)

    if self.wrap_code_snippets:
        def handle_match(m):
            if m.group(1).lower() == 'kotlin':
                return '\n\n<div class="sample" markdown="1" theme="idea" data-highlight-only>' + m.group(0) + '\n</div>\n\n'
            else:
                return '\n\n<div class="sample" markdown="1" theme="idea" mode="' + m.group(1) + '">' + m.group(0) + '\n</div>\n\n'

        source_text = re.compile("[\\r\\n]+```([^\\r\\n]+)([\\r\\n]+[^`][^\\r\\n]*)+[\\r\\n]+```").sub(handle_match, source_text)

    template = item.generate_header()

    source_text = template + source_text

    with open(item.target_item, 'w') as file:
        file.write(source_text)

    return [{
        'url': item.html,
        'title': item.title
    }]


def _build_url_mappers(external_yml, mount: ExternalMount):
    r = re.compile("\\]\\("        "([^#)]+)?"           "(#[^)]+)?"     "\\)")

    known_urls = {item['md']: item['url'] for item in external_yml}

    def patch_the_text(text, source_item):
        def handle_match(m):
            url = m.group(1) or ''
            anchor = m.group(2) or ''

            if url in known_urls:
                url = known_urls[url]
            elif not url.startswith("http://") and not url.startswith("https://"):
                real_path = path.normpath(path.join(path.dirname(source_item), url))

                if path.isfile(real_path):
                    is_image = (real_path.endswith(ext) for ext in [".jpg", ".jpeg", ".png", ".svg"])

                    if any(is_image):
                        image_relative_path = path.join(mount.external_base.lstrip("/"), url)
                        image_output_path = path.join(root_folder, "assets", "externals", image_relative_path)
                        image_output_dir = os.path.dirname(image_output_path)

                        if not os.path.isdir(image_output_dir):
                            os.makedirs(image_output_dir, mode=0o777)

                        shutil.copyfile(real_path, image_output_path)
                        url = "{{ url_for(\"asset\", path=\"" + path.join("externals", image_relative_path) + "\") }}"
                    else:
                        url = mount.github_view_url(real_path)

            return "](" + url + anchor + ")"

        return r.sub(handle_match, text)

    return patch_the_text


def _process_external_key(build_mode, data) -> list:
    """
    :param build_mode: current build mode
    :param data: the element from the _nav.yml to process
    :return: the _list_ of items to replace the data item with
    """
    if not isinstance(data, dict):
        return [data]

    if 'external' not in data:
        return [data]

    mount = ExternalMount(build_mode, data['external'])
    del data['external']

    if not _rant_if_external_nav_is_not_found(mount):
        # TODO: side effect
        data['content'] = [{'url': '/', 'title': 'external "%s" is it included' % mount.external_path}]
        return [data]

    with open(mount.nav_file) as stream:
        external_yml = yaml.load(stream)
        assert isinstance(external_yml, list)

    url_mappers = _build_url_mappers(external_yml, mount)
    contents = [
        entry
        for item in external_yml
        for entry in _process_external_entry(mount, url_mappers, item)
    ]

    if mount.inline:
        return contents
    else:
        # TODO: side effect
        data['content'] = contents
        return [data]


def process_nav_includes(build_mode, data):
    if isinstance(data, list):
        children = [
            process_nav_includes(build_mode, item)
            for item in data
        ]

        # flatten the results of the _process_external_key call
        return [
            entry
            for item in children
            for entry in _process_external_key(build_mode, item)
        ]

    if isinstance(data, dict):
        return {
            key: process_nav_includes(build_mode, item)
            for key, item in data.items()
        }

    return data
