/**
 * Created by hadihariri on 06/11/13.
 */

// This is a component that given a container (a div) it will create
// two tabs and inside them display output from compiler as well as
// messages and errors, including during error highlighting.

// This container does not need to be created directly. The KotlinEditor will
// create it. All that's needed is the ID of a div.
var ResultsContainer = (function () {


    function ResultsContainer(settings) {

        var resultTypeStyles = {
            info: "text-info",
            err: "text-danger",
            out: "text-primary"

        };

        var errorSeverityStyles = {
            ERROR: "text-danger",
            WARNING: "text-warning",
            HINT: "text-primary"
        };

        // Get Id's
        var containerTabId = generateRandomId("containerTab");
        var outputContainerId = generateRandomId("containerOutput");
        var messagesContainerId = generateRandomId("containerMessage");

        var outputTabHeader = $('<li class="active"><a href="#' + outputContainerId + '" data-toggle="tab">Output</li>');
        var messagesTabHeader = $('<li><a href="#' + messagesContainerId + '" data-toggle="tab">Messages</li>');
        var tabs = $("<ul>")
            .attr("id", containerTabId)
            .addClass("nav nav-tabs navbar-fixed-bottom");


        outputTabHeader.appendTo(tabs);
        messagesTabHeader.appendTo(tabs);
        var container = $("#"+settings.resultsContainerId);
        tabs.appendTo(container);

        var tabContent = $('<div class="tab-content">' +
            '<div class="tab-pane active" id="' + outputContainerId + '"></div>' +
            '<div class="tab-pane" id="' + messagesContainerId + '"></div>' +
            '</div>').appendTo(container);

        // Activate Tab Navigation
        $('#' + containerTabId +' a').click(function (e) {
            e.preventDefault();
            $(this).tab('show');
        });

        var outputContainer = $("#" + outputContainerId);
        var messagesContainer = $("#" + messagesContainerId);

        function activateOutputTab() {
            $('#' + containerTabId + ' a[href="#' + outputContainerId + '"]').tab('show');
        }

        function activateMessagesTab() {
            $('#' + containerTabId + ' a[href="#' + messagesContainerId + '"]').tab('show');
        }

        var instance = {
            clear: function () {
                outputContainer.text("");
                messagesContainer.text("");
            },
            activateOutputTab: activateOutputTab,
            activateMessagesTab: activateMessagesTab,
            addMessage: addMessage,
            onSuccess: function (results) {
                results.forEach( function (item) {
                    if (item.type === "info") {
                        if (settings.packageInfoEnabled) {
                            createDisplayItem(item).appendTo(messagesContainer);
                        }
                    } else {
                        createDisplayItem(item).appendTo(outputContainer);
                    }
                });
                activateOutputTab();
            },
            onFail: function (errors) {
                errors.forEach( function (item) {
                    item.text = item.exception;
                    createDisplayItem(item).appendTo(messagesContainer);
                })
                activateMessagesTab();
            }
        };

        function addMessage(message) {
            $("<p>")
                .addClass(errorSeverityStyles[message.severity])
                .html('<img src="' + settings.iconUrl + '/' + message.severity.toLowerCase() + '.png"> ' + message.severity + ": " + message.titleName + " - " + message.x)
                .appendTo(messagesContainer);
        }

        function createDisplayItem(item) {
            return $("<p>")
                .addClass(resultTypeStyles[item.type])
                .html(unEscapeString(item.text));
        }

        return instance;
    }

    return ResultsContainer;

})();
