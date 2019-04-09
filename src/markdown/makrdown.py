import subprocess
import hashlib
import re
import os

root_folder = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
include_regex = re.compile("^\\s*\\[\\[\\s*(import|include)\\s+([^\\]]+)\\s*\\]\\]\\s*$", re.MULTILINE)


def handle_match(m):
    include_file: str = m.group(2).strip()

    if not include_file.startswith('pages/') and \
            not include_file.startswith('pages-includes/') and \
            not include_file.startswith('externals/'):
        raise Exception("Invalid [[include ]] for path: " + include_file +
                        ", only 'externals/', 'pages-includes/', or 'pages/' are allowed")

    include_path = os.path.join(root_folder, include_file)

    with open(include_path, 'r', encoding="UTF-8") as f:
        include_text = f.read()

    return include_contents_from_files(include_text)


def include_contents_from_files(text: str) -> str:
    return include_regex.sub(handle_match, text)


def customized_markdown(text):

    # it is expected to have kramdown version 1.14.0
    # the kramdown version 2.1.0  misses the --no-hard-wrap flag

    kramdown = subprocess.Popen(
        "kramdown --input GFM --no-hard-wrap --smart-quotes apos,apos,quot,quot --no-enable-coderay",
        shell=True,
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    text_utf8 = text.encode("utf8")
    stdout_data, stderr_data = kramdown.communicate(input=text_utf8)
    html = stdout_data.decode("utf8", errors='ignore')

    if kramdown.returncode != 0:
        input_hash = hashlib.sha1(text_utf8).hexdigest()
        print(" ##teamcity[buildProblem description='kramdown failed!' identity='%s'] " % input_hash)
        html = "<pre style='font-size:14px; color:red;'><![CDATA[\n" \
               "  kramdown FAILED!:\n" + \
                 stderr_data.decode("utf8", errors='ignore') + \
               "]]></pre>\n\n" + \
               html

    return html


def jinja_aware_markdown(text, flatPages):

    text = include_contents_from_files(text)
    app = flatPages.app
    template_context = {}
    app.update_template_context(template_context)

    env = app.jinja_env
    template = env.from_string(text)
    return customized_markdown(template.render(template_context))
