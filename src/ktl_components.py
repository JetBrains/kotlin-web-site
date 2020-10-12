import hashlib
import subprocess
from json import dumps
from functools import lru_cache

from flask import Markup
from jinja2 import nodes
from jinja2.ext import Extension


class KTLComponentExtension(Extension):
    """ {% ktl_component "componentName" stringProp="value" boolProp %}"""

    tags = frozenset(['ktl_component'])

    error_template = """
    <pre style='font-size:14px; color:red;'><![CDATA[
      KTLComponentExtension FAILED!: %s
    ]]></pre>
    """

    def parse(self, parser):
        lineno = parser.stream.expect("name:ktl_component").lineno

        component_name = parser.parse_expression()
        component_props = []

        while parser.stream.current.type != "block_end":
            target = nodes.Const(parser.parse_assign_target(name_only=True).name)
            value = parser.parse_expression() if parser.stream.skip_if("assign") else nodes.Const(True)
            component_props.append(nodes.Pair(target, value))

        result = self.call_method("_render", [component_name, nodes.Dict(component_props)], lineno=lineno)
        return nodes.Output([result], lineno=lineno)

    def _render(self, name, props):
        content = self.__exec_render(name, dumps(props))

        props_render = dict(
            name=name,
            props=props,
        )

        return Markup(
            "<!-- ktl_component: %s -->%s"
            % (dumps(props_render), content)
        )

    @lru_cache(maxsize=None)
    def __exec_render(self, name, props_json):
        nodejs = subprocess.Popen(
            ["node", "compile.js", name, props_json],
            cwd="scripts/react-renderer",
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )

        stdout_data, stderr_data = nodejs.communicate()
        result = stdout_data.decode("utf8", errors='ignore')

        if nodejs.returncode != 0:
            input_hash = hashlib.sha1(props_json.encode("utf8")).hexdigest()

            print(
                "##teamcity[buildProblem description='ktl-components failed! - %s'identity='%s']"
                % (stderr_data, input_hash)
            )

            result = self.error_template % stderr_data

        return result
