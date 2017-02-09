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
    let sample;
    if (state.code) {
      this.prefix = state.code.substring(0, state.code.indexOf('//sampleStart') + '//sampleStart'.length + 1);
      sample = state.code.substring(state.code.indexOf('//sampleStart') + '//sampleStart'.length + 1,
        state.code.indexOf('//sampleEnd') - 1);
      this.suffix = state.code.substring(state.code.indexOf('//sampleEnd') - 1);
    } else {
      if (this.state.folded) {
        sample = this.codemirror.getValue();
      } else {
        let editorValue = this.codemirror.getValue();
        sample = editorValue.substring(this.prefix.length, editorValue.length - this.suffix.length);
      }
    }

    Object.assign(this.state, state);
    super.update(this.state);

    if (!this.initialized) {
      this.initializeCodeMirror();
      this.initialized = true;
    } else {
      if (state.folded === undefined) {
        return
      }
    }


    if (this.state.folded) {
      this.codemirror.setValue(sample);
    } else {
      this.codemirror.setValue(this.prefix + sample + this.suffix);
      const commentStartLineNo = findComment(this.codemirror, "sampleStart");
      const commentEndLineNo = findComment(this.codemirror, "sampleEnd");
      this.codemirror.markText({
          line: 0,
          ch: 0
        },
        {
          line: commentStartLineNo + 1,
          ch: 0
        },
        {
          readOnly: true
        }
      );
      this.codemirror.markText({
          line: commentEndLineNo - 1,
          ch: null
        },
        {
          line: this.codemirror.lineCount() - 1,
          ch: null
        },
        {
          readOnly: true
        }
      );
    }
  }

  onFoldButtonMouseEnter() {
    if (!this.state.foldButtonHover) {
      this.update({foldButtonHover: true})
    }
  }

  onFoldButtonMouseLeave() {
    if (this.state.foldButtonHover) {
      this.update({foldButtonHover: false})
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
          "text": this.getCode(),
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
        filename: "File.kt",
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

  getCode() {
    if (this.state.folded) {
      return this.prefix + this.codemirror.getValue() + this.suffix
    } else {
      return this.codemirror.getValue()
    }
  }

  recalculatePosition(position) {
    const newPosition = {
      line: position.line,
      ch: position.ch
    };
    if (!this.state.folded) {
      return newPosition;
    }

    let linesInPrefix = (this.prefix.match(/\n/g) || []).length;
    newPosition.line = position.line - linesInPrefix;
    if (newPosition.line < 0) {
      newPosition.line = 0;
      newPosition.ch = 0;
    } else if (newPosition.line >= this.codemirror.lineCount()) {
      newPosition.line = this.codemirror.lineCount() - 1;
      newPosition.ch = null;
    }
    return newPosition
  }

  showDiagnostics(diagnostics) {
    this.removeStyles();
    diagnostics.forEach(diagnostic => {
      const interval = diagnostic.interval;
      interval.start = this.recalculatePosition(interval.start);
      interval.end = this.recalculatePosition(interval.end);

      const errorMessage = unEscapeString(diagnostic.message);
      const severity = diagnostic.severity;

      this.arrayClasses.push(this.codemirror.markText(interval.start, interval.end, {
        "className": "cm__" + diagnostic.className,
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
