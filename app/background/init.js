document.addEventListener("DOMContentLoaded", function () {

  if (!chrome.extension)
    console.log('not a chrome extension');

  // messages from popup
  chrome.runtime.onMessage.addListener(function(data, sender) {
    console.log('soundcast background message received',sender);
  });

  // messages from inject
  chrome.extension.onRequest.addListener(function(data, sender) {
    console.log('soundcast background request received');
    if (data.onLoad && data.inject)
      onInject(sender);
  });

  function onInject(sender) {
    console.log('soundcloud page loaded on tab %s', sender.tab.id);
    chrome.pageAction.show(sender.tab.id);
    chrome.pageAction.onClicked.addListener(function() {
      chrome.tabs.sendMessage(sender.tab.id, { 'method': 'addToQueue' });
    });
    chrome.tabs.sendMessage(sender.tab.id, { 'method': 'initCast' });
  }

  console.log('soundcast background initialized');
});
