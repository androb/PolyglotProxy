// Add plugin to TinyMCE
tinymce.PluginManager.add('chatplugin', function(editor) {
  // Add a button to the toolbar that opens the sidebar
  editor.ui.registry.addButton('chatplugin', {
    icon: 'more',
    tooltip: 'Open ChatGPT',
    onAction: function() {
      editor.windowManager.open({
        title: 'ChatGPT',
        body: {
          type: 'panel',
          items: [
            {
              type: 'iframe',
              name: 'chat-iframe',
              label: 'ChatGPT',
              sandboxed: false,
              source: 'https://polyglotproxy.andrewroberts24.repl.co/testchat.html',
              minWidth: 800,
              minHeight: 500,
            }
          ]
        },
        buttons: [],
      });
    }
  });
});