import subprocess
import hashlib

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
    app = flatPages.app
    template_context = {}
    app.update_template_context(template_context)

    env = app.jinja_env
    template = env.from_string(text)
    return customized_markdown(template.render(template_context))
