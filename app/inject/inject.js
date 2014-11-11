(function() {
  if (injected) {
    return;
  }
  injected = true;
  console.log('soundcast injected');

  // An object that will contain the "methods"
  // we can use from the "background"
  var methods = {
    addToQueue: function() {
      // for now this will just play a track
          
    },
    initCast: function() {
      var host = 'https://soundcast-app.appspot.com/app/inject/';
      loadScript('https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js', function() {
        loadScript(host + 'soundcloud-api.js', function() {
          loadScript(host + 'cast-api.js', function() {
            loadScript(host + 'init.js', function() {
              loadScript('https://www.gstatic.com/cv/js/sender/v1/cast_sender.js', function() {
              });
            });
          });
        });
      });
    }
  };

  // listen for messages from the extension.
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    var data = {};
    if (methods.hasOwnProperty(request.method))
      data = methods[request.method]();
    sendResponse({ data: data });
    return true;
  });

  // send initial onload request
  chrome.extension.sendRequest({onLoad:true, inject:true});










  function loadScript(url, callback){
    var script = document.createElement("script");
    script.type = "text/javascript";

    if (script.readyState) {  //IE
      script.onreadystatechange = function() {
        if (script.readyState === "loaded" || script.readyState === "complete") {
          script.onreadystatechange = null;
          callback();
        }
      };
    } else {  //Others
      script.onload = function(){
        callback();
      };
    }
    script.src = url;
    document.body.appendChild(script);
  }
});
