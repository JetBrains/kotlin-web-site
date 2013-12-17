/**
 * Created by hadihariri on 06/11/13.
 */

var Button = (function () {
    function Button(elementId, /*Nullable*/ shortcut) {

        var element = $("#" + elementId);

        var instance = {
            enable:function () {
                setEnabled(true)
            },
            disable:function() {
                setEnabled(false)
            },
            click:function () {
                instance.onClick();
            },
            onClick:function () {
            }
        };

        function setEnabled(enabled) {
            if (enabled) {
                element.css({opacity:1});
            } else {
                element.css({opacity:0.5});
            }
        }

        if (shortcut != null) {
            var title = element.attr("title").replace("@shortcut@", shortcut);
            element.attr("title", title);
        }

        element.click(function () {
            instance.onClick();
        });

        return instance;
    }

    return Button;
})();