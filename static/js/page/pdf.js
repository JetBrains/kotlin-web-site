require('../../css/pdf.scss');
const CodeMirror = require('../com/codemirror/CodeMirror');

const $ = require('jquery');

$(document).ready(function () {
  const sampleStartComment = '//sampleStart';
  const sampleEndComment = '//sampleEnd';

  $('.sample').each((ind, element) => {
    const codeElement = $(element).find('code')[0];
    let code = codeElement.textContent;
    code = code.substring(code.indexOf(sampleStartComment) + sampleStartComment.length + 1);
    code = code.substring(0, code.indexOf(sampleEndComment));
    codeElement.textContent = code;
    codeElement.className = "code _highlighted";
    codeElement.setAttribute("data-lang", "text/x-kotlin");
  });

  CodeMirror.colorize($('.code._highlighted'))
});
