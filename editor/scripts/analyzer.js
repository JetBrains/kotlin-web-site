/**
 * Created by hadihariri on 06/11/13.
 */


var Analyzer = (function () {

    function Analyzer(settings) {


        var instance = {
            onSuccess: function (results) {
            },
            onFail: function (error) {
            },
            analyze: function (programText, sessionId) {
                analyze(programText, sessionId);
            }
        };

        function analyze(programText, sessionId) {
            $.ajax({
                url:generateServerUrl(settings.serverUrl, sessionId, "highlight", settings.compilerType),
                context:document.body,
                success:function (data) {
                    instance.onSuccess(data);
                },
                dataType:"json",
                type:"POST",
                data:{text: programText},
                timeout:10000,
                error:function (jqXHR, textStatus, errorThrown) {
                    instance.onFail(textStatus + " : " + errorThrown);
                }
            });
        }
        return instance;
    }
    return Analyzer;
})();