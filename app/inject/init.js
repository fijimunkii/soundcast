window['__onGCastApiAvailable'] = function(loaded, error) {
  if (loaded) {
    console.log('cast api available. initializing...');
    if (!window.castApi) return console.log('castApi global missing');
    window.castApi.initializeCastApi();
  } else {
    console.log(error);
  }
};

if (window.soundCastInterval) {
  clearInterval(window.soundCastInterval);
}
window.soundCastInterval = setInterval(addCastLinks,5000);
addCastControls();
addCastLinks();

function addCastLinks() {
  $('.soundActions').each(function() {
    var $this = $(this);
    if ($this.data('hasCastLink')) {
      return;
    } else {
      $this.data('hasCastLink', true);
    }

    //find the link
    var url;
    var urls = [];
    try {
      urls.push($(this).parent().parent().parent().parent().parent()
        .find('a').eq(0).prop('href'));
    } catch(e) {
    }
    try {
     urls.push($(this).parent().parent().parent().parent().parent()
        .find('a').eq(1).prop('href'));
    } catch(e) {
    }
    if (urls.length) {
      if (!urls[1]) {
        url = urls[0];
      } else {
        url = urls[0].split('').length > urls[1].split('').length ?
          urls[0] : urls[1];
      }
    }
    if (!url) {
      url = window.location.href;
    }
    if (url && url.split('')[url.length-1] === '#') {
      url = url.slice(0, -1);
    }
    
    var btnClass = $this.hasClass('soundActions__medium') ?
      'sc-button-medium' : 'sc-button-small';
    $this.find('div').eq(0).append($('<button class="soundcast-button sc-button ' + btnClass + ' sc-button-responsive sc-button-icon sc-button-addtoset" title="Cast">Cast</button>').on('click', function() {
      window.soundcloudApi.actions.resolveSoundcloud(url); 
    }));
  });
}


function addCastControls() {
  var $ctrl = $('<div class="playControls g-z-index-header" style="bottom:87px;z-index:999;display:none;"><div class="playControls__inner l-container"> <div class="playControls__wrapper"> <ul class="playControls__controls sc-list-nostyle g-dark" style="height:125px; overflow: scroll;"> <li class="playControls__playPauseSkip"> <button class="skipControl sc-ir skipControl__previous disabled" tabindex="-1">Skip to previous</button> <button class="playControl sc-ir" tabindex="" title="Play current">Play current</button> <button class="skipControl sc-ir skipControl__next" tabindex="">Skip to next</button> </li> <li class="playControls__title"> <div class="playbackTitle paused"><div class="playbackTitle__linkContainer"> <a class="playbackTitle__link sc-truncate animate" href="/stream" title="Playing on your chromecast"></a> </div> <div class="playbackTitle__progress progress" aria-valuemax="100" aria-valuenow="0" aria-valuetext=""> <div class="playbackTitle__progressBar" style="width: 1px;"></div> </div> </div> </li> <li class="playControls__volume"> <div class="volume" data-level="10"><div class="volume__wrapper"> <button class="volume__button volume__togglemute sc-ir"> Toggle mute </button> <div role="slider" tabindex="0" class="volume__slider g-slider g-slider-vertical" aria-valuemin="0" aria-valuemax="1" aria-label="Volume" aria-valuenow="1"><div class="progress"></div><span class="volume__handle g-slider-handle" style="top: 0px;"></span></div><input type="hidden" data-orig-type="range" class="volume__range" min="0" max="1" step="0.1" value="1"> <span class="volume__button volume__indicator sc-ir"></span> </div> </div> </li> <li class="soundcast-queue"></li></ul> <div class="playControls__panel"> <div class="playControlsPanel sc-font-body sc-background-darkgrey" style="height: 0px;"></div> </div> </div> </div> </div>');


  window.$soundcastCtrl = $ctrl;
  window.$soundcastTitle = $ctrl.find('.playbackTitle');
  window.$soundcastTitleLink = $ctrl.find('.playbackTitle__link');
  window.$soundcastSkip = $ctrl.find('.skipControl');
  window.$soundcastPlay = $ctrl.find('.playControl');
  window.$soundcastQueue = $ctrl.find('.soundcast-queue');
    
  $('body')
    .append($ctrl);

  window.$soundcastPlay.on('click', window.castApi.pausePlay);
  window.$soundcastSkip.on('click', window.castApi.skipTrack);
}


var css = '';

css += '.soundcast-queue { display: inline-block; padding: 1em; } .soundcast-queue span { cursor: pointer; }';

css += '.soundcast-button:before { background-image: url(data:image/png;base64,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) !important; background-size: 16px 12px !important; }';
var style = style = document.createElement('style');
style.type = 'text/css';
if (style.styleSheet){
    style.styleSheet.cssText = css;
} else {
    style.appendChild(document.createTextNode(css));
}
document.head.appendChild(style);
