setTimeout(function() {
  if (window.soundcast && window.soundcast.injected) {
    console.log('already injected');
    return;
  }
  window.soundcast = window.soundcast || {};
  window.soundcast.injected = true;
  console.log('soundcast 0.0.6 injected');

  // An object that will contain the "methods"
  // we can use from the "background"
  var methods = {
    initCast: function() {
      var host = 'https://soundcast-app.appspot.com/app/inject/';
      loadScript('https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js', function() {
        loadScript(host + 'soundcloud-api.js', function() {
          loadScript(host + 'cast-api.js', function() {
            loadScript(host + 'queue-api.js', function() {
              loadScript(host + 'init.js', function() {
                loadScript('https://www.gstatic.com/cv/js/sender/v1/cast_sender.js', function() {
                });
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



  // utility for pulling scripts into main dom
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
},1000);
