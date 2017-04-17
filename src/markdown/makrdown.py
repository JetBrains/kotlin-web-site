import subprocess

def customized_markdown(text):
    kramdown = subprocess.Popen(
        "kramdown --input GFM --no-hard-wrap --smart-quotes apos,apos,quot,quot --no-enable-coderay",
        shell=True,
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE)
    stdout_data, stderr_data = kramdown.communicate(input=text.encode("utf8"))
    return stdout_data.decode("utf8", errors='ignore')


def jinja_aware_markdown(text, flatPages):
    app = flatPages.app
    template_context = {}
    app.update_template_context(template_context)

    env = app.jinja_env
    template = env.from_string(text)
    return customized_markdown(template.render(template_context))
