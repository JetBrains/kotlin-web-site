var ExecutableCodeTemplate = require('./executable-fragment.monk');

var CodeMirror = require('codemirror');
require('codemirror/lib/codemirror.css');
require('./executable-fragment.scss');

var Monkberry = require('monkberry');
var directives = require('monkberry-directives').default;

var $ = require('jquery');

function getExceptionCauses(exception) {
  if (exception.cause !== undefined && exception.cause != null) {
    return [exception.cause].concat(getExceptionCauses(exception.cause))
  } else {
    return []
  }
}

function unEscapeString(s) {
  const tagsToReplace = {
    "&": "&amp;",
    "<": "&amp;lt;",
    ">": "&amp;gt;",
    " ": "%20"
  };
  var unEscapedString = s;
  Object.keys(tagsToReplace).forEach(function (key) {
    unEscapedString = unEscapedString.replace(tagsToReplace[key], key)
  });
  return unEscapedString
}

class ExecutableFragment extends ExecutableCodeTemplate {
  constructor() {
    super();
    this.arrayClasses = [];

    this.initialized = false;
    this.state = {
      code: '',
      output: null
    };
  }

  static render(element) {
    return Monkberry.render(ExecutableFragment, element, {
      'directives': directives
    });
  }

  update(state) {
    Object.assign(this.state, state);
    super.update(this.state);

    if (!this.initialized) {
      this.initializeCodeMirror();
      this.initialized = true;
    }
  }

  execute() {
    const projectJson = JSON.stringify({
      "id": "",
      "name": "",
      "args": "",
      "compilerVersion": null,
      "confType": "java",
      "originUrl": null,
      "files": [
        {
          "name": "File.kt",
          "text": this.codemirror.getValue(),
          "publicId": ""
        }
      ],
      "readOnlyFileNames": []
    });
    $.ajax({
      url: 'http://localhost:8080/kotlinServer?type=run&runConf=java',
      method: 'post',
      dataType: 'JSON',
      context: this,
      data: {
        project: projectJson
      },
      fail: function (jqXHR, message, errorThrown) {
        console.log(message)
      }
    }).success(function (data) {
      if (data.errors["File.kt"] !== undefined) {
        this.showDiagnostics(data.errors["File.kt"])
      }

      var output;
      if (data.text !== undefined) {
        output = data.text.replace("<outStream>", "<span class=\"standard-output\">")
          .replace("</outStream>", "</span>")
          .replace("<errStream>", "<span class=\"error-output\">")
          .replace("</errStream>", "</span>");
      } else {
        output = "";
      }

      if(data.exception != null) {
        data.exception.causes = getExceptionCauses(data.exception);
        data.exception.cause = undefined;
      }

      this.update({
        output: output,
        exception: data.exception
      })
    })
  }



  showDiagnostics(diagnostics) {
    this.removeStyles();
    diagnostics.forEach(diagnostic => {
      const interval = diagnostic.interval;
      const errorMessage = unEscapeString(diagnostic.message);
      const severity = diagnostic.severity;

      this.arrayClasses.push(this.codemirror.markText(interval.start, interval.end, {
        "className": diagnostic.className,
        "title": errorMessage
      }));

      if ((this.codemirror.lineInfo(interval.start.line) != null) &&
        (this.codemirror.lineInfo(interval.start.line).gutterMarkers == null)) {
        const gutter = document.createElement("div");
        gutter.className = severity + "gutter";
        gutter.title = errorMessage;

        this.codemirror.setGutterMarker(interval.start.line, "errors-and-warnings-gutter", gutter)
      } else {
        const gutter = this.codemirror.lineInfo(interval.start.line).gutterMarkers["errors-and-warnings-gutter"];
        gutter.title += "\n$errorMessage";
        if (gutter.className.indexOf("ERRORgutter") == -1) {
          gutter.className = severity + "gutter"
        }
      }
    });
  }

  removeStyles() {
    this.arrayClasses.forEach(it => it.clear());
    this.codemirror.clearGutter("errors-and-warnings-gutter")
  }

  initializeCodeMirror() {
    const textarea = this.nodes[0].getElementsByTagName('textarea')[0];
    this.codemirror = CodeMirror.fromTextArea(textarea, {
      lineNumbers: true,
      mode: 'text/x-kotlin',
      indentUnit: 4,
      viewportMargin: Infinity,
      gutters: ["errors-and-warnings-gutter"]
    });

    this.codemirror.on("change", codemirror => {
      this.removeStyles()
    })
  }


}

module.exports = ExecutableFragment;
