var ExecutableCodeTemplate = require('./executable-fragment.monk');

var CodeMirror = require('codemirror');
require('codemirror/lib/codemirror.css');
require('./executable-fragment.scss');

var Monkberry = require('monkberry');
var directives = require('monkberry-directives').default;

var $ = require('jquery');

class ExecutableFragment extends ExecutableCodeTemplate {

  constructor() {
    super();

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
      data: {
        project: projectJson
      },
      success: function (jqXHR, message, errorThrown) {
        console.log(message)
      },
      fail: function (jqXHR, message, errorThrown) {
        console.log(message)
      }
    })
  }

  initializeCodeMirror() {
    const textarea = this.nodes[0].getElementsByTagName('textarea')[0];
    this.codemirror = CodeMirror.fromTextArea(textarea, {
      lineNumbers: true,
      mode: 'text/x-kotlin',
      indentUnit: 4,
      viewportMargin: Infinity
    });
  }
}

module.exports = ExecutableFragment;
