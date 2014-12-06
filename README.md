# Soundcast

Soundcloud. Chromecast. You get the idea.

This project lives in a few places. Github, Google App Engine, and the Chrome App/Extension Store.

Google App Engine hosts the receiver page for the tv.

Must read: http://stackoverflow.com/a/17276475/2474735

HIC SVNT DRACONES: A lot of best practices had to be avoided in order for this to work. Long story short, google doesn't allow the extension background to talk to chromecast. All of this will be changing with the upcoming Second Screen API (~mid to late 2015 probably). For now, this'll do.

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
