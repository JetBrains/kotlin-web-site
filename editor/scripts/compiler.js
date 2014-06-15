/**
 * Created by hadihariri on 06/11/13.
 */

// This is the compiler component. It talks to the backend server
// and compile the code. Two events are raised: onSuccess and onFail
// You do not need to create this manually. KotlinEditor will do it.

var Compiler = (function () {

    function Compiler(settings) {

        var instance = {
            onSuccess: function (results) {
            },
            onFail: function (error) {
            },
            run: function (sessionId, programText, args) {
                runJava(sessionId, programText, args)
            }
        }

        function dataIsException(data) {
            return (data[0] != null && data[0] != undefined && data[0].exception != undefined);
        }

        function runJava(sessionId, programText, args) {
            $.ajax({
                url:generateServerUrl(settings.serverUrl, sessionId, "run", "java"),
                context:document.body,
                success:function (data) {
                    if (notNull(data)) {
                        if (dataIsException(data)) {
                            instance.onFail(data);
                        } else {
                            instance.onSuccess(data);
                        }
                    } else {
                        instance.onFail("Incorrect data format.")
                    }
                },
                dataType:"json",
                type:"POST",
                data:{text:programText, consoleArgs:args},
                timeout:10000,
                error:function (jqXHR, textStatus, errorThrown) {
                    instance.onFail(textStatus + " : " + errorThrown);
                }
            });

        }

        return instance;

    }

    return Compiler;
})();