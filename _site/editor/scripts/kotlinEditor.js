/**
 * Created by hadihariri on 05/11/13.
 */

var KotlinEditor = (function () {


    function KotlinEditor(settings) {

        var sessionId = -1;
        var compiler = undefined;
        var analyzer = undefined;
        var resultsEnabled = false;

        setSessionId();


        var editor = CodeMirror.fromTextArea(document.getElementById(settings.editorId), {
            lineNumbers: true,
            matchBrackets: true,
            extraKeys: {"Ctrl-Space": "autocomplete"},
            gutters: ["gutterHighlighting"],
            mode: "text/kotlin"
        });

        function getProgramText() {
            if (settings.autoWrapWithMain) {
                return 'fun main(args: Array<String>) {'
                    + editor.getValue() +
                    '}'
            } else {
                return editor.getValue();
            }
        }

        var instance = {
            sessionId: sessionId,
            editor: editor,
            compiler: compiler,
            analyzer: analyzer,
            programText: getProgramText()
        };

        function analyzeCode() {
            analyzer.analyze(getProgramText(), sessionId)
        }

        if (settings.completionEnabled) {
            CodeMirror.commands.autocomplete = function (cm) {
                CodeMirror.showHint(cm, showCompletion, { async: true });
            };
        }


        if (settings.analysisEnabled) {
            analyzer = new Analyzer(settings);
            var markers = [];
            analyzer.onSuccess = function (analysisItems) {
                if (resultsEnabled) {
                    resultsContainer.clear();
                    resultsContainer.activateMessagesTab();
                }
                editor.clearGutter("gutterHighlighting");
                markers.forEach( function (item) {
                   item.clear();
                });
                analysisItems.forEach(function (item) {
                    if (resultsEnabled) {
                        resultsContainer.addMessage(item);
                    }
                    var start = eval('(' + item.x + ')');
                    var end = eval('(' + item.y + ')');

                    markers.push(editor.markText(start, end, {className: item.className}));
                    addGutterIcon(item.severity, start.line);
                });
            };

            analyzer.onFail = function (error) {
                error.severity = 'ERROR';
                error.titleName = error;
                resultsContainer.addMessage(error);
                resultsContainer.activateMessagesTab();
            };


            var waiting;

            editor.on("change", function () {
                clearTimeout(waiting);
                waiting = setTimeout(analyzeCode, 1000);
            });
            setTimeout(analyzeCode, 100);
        }

        if (notNull(settings.executeButtonId)) {
            compiler = new Compiler(settings);
            var executeButton = new Button(settings.executeButtonId);
            executeButton.onClick = function () {
                resultsContainer.clear();
                executeButton.disable();
                compiler.run(sessionId, getProgramText(), null)
            };

            compiler.onSuccess = function (results) {
                executeButton.enable();
                if (resultsEnabled) {
                    resultsContainer.onSuccess(results);
                }
            };

            compiler.onFail = function (errors) {
                executeButton.enable();
                if (resultsEnabled) {
                    resultsContainer.onFail(errors);
                }
            };
        }

        if (notNull(settings.clearButtonId)) {
            var clearButton = new Button(settings.clearButtonId);
            clearButton.onClick = function () {
                editor.setValue("");
                if (resultsEnabled) {
                    resultsContainer.clear();
                }
            }
        }

        if (notNull(settings.resultsContainerId)) {
            var resultsContainer = new ResultsContainer(settings);
            resultsEnabled = true;
        }

        // TODO: Improve this.
        function showCompletion(editor, callback) {
            var Pos = CodeMirror.Pos;
            $.ajax({
                url: generateServerUrl(settings.serverUrl, sessionId,
                    "complete",
                    editor.getCursor().line + "," + editor.getCursor().ch + "&runConf=" + "java"),
                context: document.body,
                success: function (data) {
                    var completionList = [];
                    data.forEach(function (completionItem) {
                        // TODO: Fix this
                        var textToComplete = completionItem.name.substr(0, completionItem.name.indexOf('('));
                        var iconUrl;
                        if (notNull(settings.iconUrl)) {
                            iconUrl = settings.iconUrl + '/' + completionItem.icon + '.png'
                        } else {
                            iconUrl = null;
                        }
                        completionList.push({text: textToComplete, displayText: completionItem.name, icon: iconUrl});
                    });
                    callback({
                            list: completionList,
                            from: Pos(editor.getCursor().line, 1),
                            to: Pos(editor.getCursor().line, 1)
                        }
                    );
                },
                dataType: "json",
                type: "POST",
                data: {text: getProgramText()},
                timeout: 10000,
                error: function (jqXHR, textStatus, errorThrown) {
                    console.dir(textStatus + " " + errorThrown)
                }
            });
        }

        function addGutterIcon(severityLevel, lineNumber) {
            var marker = document.createElement("img");
            marker.src = settings.iconUrl + '/' + severityLevel.toLowerCase() + '.png';
            editor.setGutterMarker(lineNumber, "gutterHighlighting", marker);
        }

        function setSessionId() {
            $.ajax({
                url: generateServerUrl(settings.serverUrl, sessionId, "getSessionId", "null"),
                context: document.body,
                type: "GET",
                dataType: "json",
                timeout: 10000,
                success: getSessionIdSuccess
            });
        }

        function getSessionIdSuccess(data) {
            data = eval(data);
            if (data[0] != null && data[0] != '') {
                sessionId = data[0];
            }
            var info = "browser: " + navigator.appName + " " + navigator.appVersion;
            info += " " + "system: " + navigator.platform;

            $.ajax({
                url: generateServerUrl(settings.serverUrl, sessionId, "sendUserData", "null"),
                context: document.body,
                type: "POST",
                data: {text: info},
                timeout: 5000
            });
        }


        return instance;
    }

    return KotlinEditor;
})();



