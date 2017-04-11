const ExecutableCodeTemplate = require('./executable-fragment.monk');

const CodeMirror = require('codemirror');
require('codemirror/lib/codemirror.css');

require('./executable-fragment.scss');

const Monkberry = require('monkberry');
const directives = require('monkberry-directives').default;
const WebDemoApi = require('./webdemo-api');
require('monkberry-events');

function countLines(string) {
  return (string.match(/\n/g) || []).length;
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
      this.prefix = state.code.substring(0, state.code.indexOf('//sampleStart'));
      sample = state.code.substring(state.code.indexOf('//sampleStart') + '//sampleStart'.length + 1,
        state.code.indexOf('//sampleEnd') - 1);
      this.suffix = state.code.substring(state.code.indexOf('//sampleEnd') + '//sampleEnd'.length);
      if(this.suffix.endsWith('\n')) {
        this.suffix = this.suffix.substr(0, this.suffix.length - 1)
      }
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
      this.showDiagnostics(state.errors);
      if (state.folded === undefined) {
        return
      }
    }

    if (this.state.folded) {
      this.codemirror.setOption("lineNumbers", false);
      this.codemirror.setValue(sample);
    } else {
      this.codemirror.setOption("lineNumbers", true);
      this.codemirror.setValue(this.prefix + sample + this.suffix);
      this.codemirror.markText(
        {line: 0, ch: 0},
        {line: countLines(this.prefix), ch: 0},
        {
          readOnly: true,
          inclusiveLeft: true,
          inclusiveRight: false
        }
      );
      this.codemirror.markText(
        {line: this.codemirror.lineCount() - countLines(this.suffix) - 1, ch: null},
        {line: this.codemirror.lineCount() - 1, ch: null},
        {
          readOnly: true,
          inclusiveLeft: false,
          inclusiveRight: true
        }
      );

      for (let i = 0; i < countLines(this.prefix); i++) {
        this.codemirror.addLineClass(i, "background", 'unmodifiable-line')
      }

      for (let i = this.codemirror.lineCount() - countLines(this.suffix); i < this.codemirror.lineCount(); i++) {
        this.codemirror.addLineClass(i, "background", 'unmodifiable-line')
      }
    }

    for (let i = 0; i < this.codemirror.lineCount(); i++) {
      this.codemirror.indentLine(i)
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
    if (this.state.waitingForOutput) {
      return
    }
    this.update({
      waitingForOutput: true
    });
    WebDemoApi.executeKotlinCode(this.getCode(), this.state.compilerVersion).then(
      state => {
        state.waitingForOutput = false;
        this.update(state);
      },
      () => {
        this.update({waitingForOutput: false})
      }
    )
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
    if (diagnostics === undefined) {
      return;
    }
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
        gutter.title += `\n${errorMessage}`;
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
      gutters: [
        "errors-and-warnings-gutter",
        "CodeMirror-foldgutter"
      ]
    });

    if (window.navigator.appVersion.indexOf("Mac") != -1) {
      this.codemirror.setOption("extraKeys", {
        "Cmd-Alt-L": "indentAuto",
        "Shift-Tab": "indentLess",
        "Ctrl-/": "toggleComment",
        "Cmd-[": false,
        "Cmd-]": false
      })
    } else {
      this.codemirror.setOption("extraKeys", {
        "Ctrl-Alt-L": "indentAuto",
        "Shift-Tab": "indentLess",
        "Ctrl-/": "toggleComment",
        "Ctrl-[": false,
        "Ctrl-]": false
      })
    }

    this.codemirror.on("change", codemirror => {
      this.removeStyles()
    })
  }
}

module.exports = ExecutableFragment;
