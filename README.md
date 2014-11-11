# Soundcast

Soundcloud. Chromecast. You get the idea.

This project lives in a few places. Github, Google App Engine, and the Chrome App/Extension Store.

Google App Engine hosts the receiver page for the tv, as well as the ember front/backend for non-extension use. The extension is your best bet if all this stuff actually works.

Must read: http://stackoverflow.com/a/17276475/2474735

HIC SVNT DRACONES: A lot of best practices had to be avoided in order for this to work. Long story short, google doesn't allow the extension background to talk to chromecast.

```
//Code for displaying <extensionDir>/images/myimage.png:
var imgURL = chrome.extension.getURL("images/myimage.png");
document.getElementById("someImage").src = imgURL;
```

https://developer.chrome.com/extensions/messaging#connect
https://developer.chrome.com/extensions/pageAction
https://developer.chrome.com/extensions/browserAction
https://developer.chrome.com/extensions/manifest
https://developer.chrome.com/extensions/manifest/storage

This project has a great structure https://github.com/mailvelope/mailvelope/blob/master/

http://192.168.1.3:8008/setup/eureka_info
curl -H "Content-Type: application/json" http://192.168.1.3:8008/apps/YouTube -X POST -d 'v=oHg5SJYRHA0'
http://fiquett.com/2013/07/chromecast-traffic-sniffing/
