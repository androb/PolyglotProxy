(function () {
  var iframe = (function () {
    "use strict";

    tinymce.PluginManager.add("chatplugin", function (editor, url) {
      /*
      Used to store a reference to the dialog when we have opened it
       */
      var _api = false;

      /*
      Define configuration for the iframe
       */
      var _urlDialogConfig = {
        title: "Ask AI",
        url: "testchat.html",
        buttons: [
          {
            type: "cancel",
            name: "cancel",
            text: "Close Dialog",
          },
        ],
        onAction: function (instance, trigger) {
          // do something
          editor.windowManager.alert(
            "onAction is running.<br /><br />You can code your own onAction handler within the plugin."
          );

          // close the dialog
          instance.close();
        },
        width: 600,
        height: 300,
      };

      // Define the Toolbar button
      editor.ui.registry.addButton("chatplugin", {
        text: "Ask AI",
        icon: "ai-icon",
        onAction: () => {
          _api = editor.windowManager.openUrl(_urlDialogConfig);
        },
      });
    });
  })();
})();
