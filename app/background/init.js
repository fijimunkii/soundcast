document.addEventListener("DOMContentLoaded", function () {

  if (!chrome.extension) {
    console.log('not a chrome extension');
  }

  // messages from popup
  chrome.runtime.onMessage.addListener(function(data, sender) {
    console.log('background message received',sender);
    if (data.onLoad && data.popup) {
      onPopup();
    } else if (data.action) {
      appRoute.send(data.action, data.actionArg);
    }
  });
  // messages from inject
  chrome.extension.onRequest.addListener(function(data, sender) {
    console.log('background request received');
    if (data.onLoad && data.inject) {
        onInject(sender);
    } else if (data.action) {
      appRoute.send(data.action.name, data.action.arg); 
    }
  });

  function onInject(sender) {
    console.log('soundcloud page loaded on tab %s', sender.tab.id);
    chrome.pageAction.show(sender.tab.id);
    chrome.pageAction.onClicked.addListener(function() {
      chrome.tabs.sendMessage(sender.tab.id, { 'method': 'addToQueue' });
    });
    chrome.tabs.sendMessage(sender.tab.id, { 'method': 'initCast' });
  }

  function onPopup() {
    var data = {
      tracks: window.tracks,
      history: window.history
    };
    console.log('rendering popup',data);
    chrome.runtime.sendMessage({ method: 'render', data: data });
  }

  console.log('background initialized');

});
