var storage = JSON.parse(localStorage.getItem('soundcast'));
storage = storage || {};
if (!storage.hasSeenInstructions) {
  console.log('first time user, showing instructions.');
  var url = chrome.extension.getURL('app/instructions/index.html');
  chrome.tabs.create({'url': url});
  localStorage.setItem('soundcast', JSON.stringify({hasSeenInstructions:true}));
}

document.addEventListener("DOMContentLoaded", function () {

  if (!chrome.extension)
    console.log('not a chrome extension');

  // messages from popup
  chrome.runtime.onMessage.addListener(function(data, sender) {
    console.log('background message received',sender);
  });

  // messages from inject
  chrome.extension.onRequest.addListener(function(data, sender) {
    console.log('background request received');
    if (data.onLoad && data.inject)
      onInject(sender);
    else if (data.notification)
      chrome.notifications.create('soundcast', data.data);
  });

  function onInject(sender) {
    console.log('script injected in tab ' + sender.tab.id);
    chrome.pageAction.show(sender.tab.id);
    chrome.pageAction.onClicked.addListener(function() {
      chrome.tabs.sendMessage(sender.tab.id, { 'method': 'addToQueue' });
    });
    chrome.tabs.sendMessage(sender.tab.id, { 'method': 'initCast' });
  }

  console.log('background script initialized');
});
