window['__onGCastApiAvailable'] = function(loaded, error) {
  if (loaded) {
    console.log('holla');
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
addCastLinks();
addCastControls();

function addCastLinks() {
  $('.soundActions div').each(function() {
    var $this = $(this);
    if ($this.data('hasCastLink')) {
      return;
    } else {
      $(this).data('hasCastLink', true);
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
      url = urls[0].split('').length > urls[1].split('').length ?
        urls[0] : urls[1];
    }
    if (!url) {
      url = window.location.href;
    }
   
    $(this).append($('<button class="sc-button-share sc-button sc-button-small sc-button-responsive">cast</button>').on('click', function() {
      window.soundcloudApi.actions.resolveSoundcloud(url); 
    }));
  });
}


function addCastControls() {
  var $ctrl = $('<div class="playControls g-z-index-header" style="bottom:87px;visibility:visible;z-index:999"><div class="playControls__inner l-container"> <div class="playControls__wrapper"> <ul class="playControls__controls sc-list-nostyle g-dark"> <li class="playControls__playPauseSkip"> <button class="skipControl sc-ir skipControl__previous disabled" tabindex="-1">Skip to previous</button> <button class="playControl sc-ir" tabindex="" title="Play current">Play current</button> <button class="skipControl sc-ir skipControl__next" tabindex="">Skip to next</button> </li> <li class="playControls__title"> <div class="playbackTitle paused"><div class="playbackTitle__linkContainer"> <a class="playbackTitle__link sc-truncate animate" href="/stream" title="Playing on your chromecast"></a> </div> <div class="playbackTitle__progress progress" aria-valuemax="100" aria-valuenow="0" aria-valuetext=""> <div class="playbackTitle__progressBar" style="width: 1px;"></div> </div> </div> </li> <li class="playControls__volume"> <div class="volume" data-level="10"><div class="volume__wrapper"> <button class="volume__button volume__togglemute sc-ir"> Toggle mute </button> <div role="slider" tabindex="0" class="volume__slider g-slider g-slider-vertical" aria-valuemin="0" aria-valuemax="1" aria-label="Volume" aria-valuenow="1"><div class="progress"></div><span class="volume__handle g-slider-handle" style="top: 0px;"></span></div><input type="hidden" data-orig-type="range" class="volume__range" min="0" max="1" step="0.1" value="1"> <span class="volume__button volume__indicator sc-ir"></span> </div> </div> </li> </ul> <div class="playControls__panel"> <div class="playControlsPanel sc-font-body sc-background-darkgrey" style="height: 0px;"></div> </div> </div> </div> </div>');

  window.$soundcastTitle = $ctrl.find('.playbackTitle');
  window.$soundcastTitleLink = $ctrl.find('.playbackTitle__link');
  window.$soundcastSkip = $ctrl.find('.skipControl');
  window.$soundcastPlay = $ctrl.find('.playControl');
    
  $ctrl.appendTo($('body'));

  window.$soundcastPlay.on('click', window.castApi.pausePlay);

  window.$soundcastSkip.on('click', window.castApi.skipTrack);
}


