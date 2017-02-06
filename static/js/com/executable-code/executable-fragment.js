const ExecutableCodeTemplate = require('./executable-fragment.monk');

const CodeMirror = require('codemirror');
require('codemirror/lib/codemirror.css');

require('./executable-fragment.scss');

const Monkberry = require('monkberry');
const directives = require('monkberry-directives').default;
require('monkberry-events');

const $ = require('jquery');

function getExceptionCauses(exception) {
  if (exception.cause !== undefined && exception.cause != null) {
    return [exception.cause].concat(getExceptionCauses(exception.cause))
  } else {
    return []
  }
}

function foldCode(codeMirror, range) {
  return codeMirror.markText(range.from, range.to, {
    collapsed: true
  })
}

function findComment(cm, commentText) {
  for (let line = 0; line < cm.lineCount(); line++) {
    let tokens = cm.getLineTokens(line);
    if (tokens.length > 1) continue;

    let token = tokens[0];
    if (token.type != "comment") continue;

    if (token.string == '//' + commentText) {
      return line
    }
  }
}

function getTopFoldRange(cm) {
  return {
    from: {
      line: 0,
      ch: 0
    },
    to: {
      line: findComment(cm, "sampleStart") + 1,
      ch: 0
    }
  }
}

function getBottomFoldRange(cm) {
  return {
    from: {
      line: findComment(cm, "sampleEnd") - 1,
      ch: null
    },
    to: {
      line: cm.lineCount(),
      ch: 0
    }
  }
}

function unEscapeString(s) {
  const tagsToReplace = {
    "&": "&amp;",
    "<": "&amp;lt;",
    ">": "&amp;gt;",
    " ": "%20"
  };
  let unEscapedString = s;
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
    this.foldMarkers = [];
    this.state = {
      code: '',
      foldButtonHover: false,
      folded: true,
      output: null,
    };
  }

  static render(element) {
    const instance = Monkberry.render(ExecutableFragment, element, {
      'directives': directives
    });

    instance.on('click', '.fold-button', (event) => {
      instance.update({folded: !instance.state.folded});
    });

    return instance;
  }

  update(state) {
    Object.assign(this.state, state);
    super.update(this.state);

    if (!this.initialized) {
      this.initializeCodeMirror();
      this.initialized = true;

      const commentStartLineNo = findComment(this.codemirror, "sampleStart");
      const commentEndLineNo = findComment(this.codemirror, "sampleEnd");
      this.codemirror.markText({
          line: commentStartLineNo,
          ch: 0
        },
        {
          line: commentStartLineNo,
          ch: null
        },
        {
          readOnly: true
        }
      );
      this.codemirror.markText({
          line: commentEndLineNo,
          ch: 0
        },
        {
          line: commentEndLineNo,
          ch: null
        },
        {
          readOnly: true
        }
      );
    }

    if (this.state.folded) {
      this.foldCode()
    } else {
      this.unfoldCode()
    }
  }

  onFoldButtonMouseEnter(){
    if(!this.state.foldButtonHover){
      this.update({foldButtonHover: true})
    }
  }

  onFoldButtonMouseLeave() {
    if (this.state.foldButtonHover) {
      this.update({foldButtonHover: false})
    }
  }

  unfoldCode() {
    this.codemirror.setOption("lineNumbers", true);
    this.foldMarkers.forEach((marker) => {
      marker.clear()
    });
    this.foldMarkers = [];
  }

  foldCode() {
    this.codemirror.setOption("lineNumbers", false);
    this.foldMarkers.push(foldCode(this.codemirror, getTopFoldRange(this.codemirror)));
    this.foldMarkers.push(foldCode(this.codemirror, getBottomFoldRange(this.codemirror)));
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
      url: 'http://kotlin-web-demo-cloud.passive.aws.intellij.net/kotlinServer?type=run&runConf=java',
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

      let output;
      if (data.text !== undefined) {
        output = data.text.replace("<outStream>", "<span class=\"standard-output\">")
          .replace("</outStream>", "</span>")
          .replace("<errStream>", "<span class=\"error-output\">")
          .replace("</errStream>", "</span>");
      } else {
        output = "";
      }

      if (data.exception != null) {
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
      lineNumbers: false,
      mode: 'text/x-kotlin',
      indentUnit: 4,
      viewportMargin: Infinity,
      smartIndent: false,
      gutters: [
        "errors-and-warnings-gutter",
        "CodeMirror-foldgutter"
      ]
    });

    this.codemirror.on("change", codemirror => {
      this.removeStyles()
    })
  }
}

module.exports = ExecutableFragment;
