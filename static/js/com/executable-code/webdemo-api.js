const $ = require('jquery');
const URLSearchParams = require('url-search-params');

function getExceptionCauses(exception) {
  if (exception.cause !== undefined && exception.cause != null) {
    return [exception.cause].concat(getExceptionCauses(exception.cause))
  } else {
    return []
  }
}

class WebDemoApi {
  static getCompilerConfigs() {
    return fetch(`${webDemoURL}/kotlinServer?type=getKotlinVersions`)
      .then(response => response.json())
  }

  static executeKotlinCode(code, compilerVersion) {
    const projectJson = JSON.stringify({
      "id": "",
      "name": "",
      "args": "",
      "compilerVersion": compilerVersion,
      "confType": "java",
      "originUrl": null,
      "files": [
        {
          "name": "File.kt",
          "text": code,
          "publicId": ""
        }
      ],
      "readOnlyFileNames": []
    });

    const body = new URLSearchParams();
    body.set('filename', "File.kt");
    body.set('project', projectJson);

    return fetch(`${webDemoURL}/kotlinServer?type=run&runConf=java`, {
      method: 'POST',
      body: body.toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      }
    }).then(response => response.json()).then(function (data) {
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

      return {
        errors: data.errors["File.kt"],
        output: output,
        exception: data.exception
      }
    })
  }
}

module.exports = WebDemoApi;