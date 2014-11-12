window.castApi = {

  isConnectedToCast: false,
  currentMediaSession: null,
  debugMessages: [],
  mediaCurrentTime: 0,
  currentVolume: 1,
  progressFlag: 1,
  session: null,

  moveProgressBar: function() {
    if (castApi.progressFlag && castApi.currentMediaSession) {
      var progress = parseInt(100 *
        castApi.currentMediaSession.currentTime /
        castApi.currentMediaSession.media.duration);
      castApi.progress = progress;
      $progress = $('.progress');
      $bar = $progress.find('div');
      var progressTotal = progress * 0.1  * $progress.width();
      var animationLength = 500;
      $bar.stop().animate({
        width: progressTotal
      }, animationLength);
    }
  },

  initProgressBar: function() {
    castApi.progressBarInterval = setInterval(function() {
      castApi.moveProgressBar();
    }.bind(castApi),5000);
  },

  init: function() {
    castApi._super();
    castApi.initProgressBar();
  },

  getQueryParams: function() {
      var qs = window.location.search.substring(1);
      qs = qs.split("+").join(" ");

      var params = {}, tokens,
          re = /[?&]?([^=]+)=([^&]*)/g;

      while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
      }

      return params;
  },

  initializeCastApi: function() {
    var p = castApi.getQueryParams();
    var autoJoinPolicy;
  
    if( p['auto'] === 'page_scoped' ) {
      autoJoinPolicy = chrome.cast.AutoJoinPolicy.PAGE_SCOPED;
    }
    else if( p['auto'] === 'origin_scoped' ) {
      autoJoinPolicy = chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED;
    }
    else {
      autoJoinPolicy = chrome.cast.AutoJoinPolicy.TAB_AND_ORIGIN_SCOPED;
    }


    var sessionRequest = new chrome.cast.SessionRequest(
      chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
      chrome.cast.Capability,
      null,
      15000);

    var apiConfig = new chrome.cast.ApiConfig(sessionRequest,
      castApi.sessionListener.bind(castApi),
      castApi.receiverListener.bind(castApi),
      autoJoinPolicy);

    chrome.cast.initialize(apiConfig,
      castApi.onInitSuccess.bind(castApi),
      castApi.onError.bind(castApi));
  },

  onInitSuccess: function() {
    castApi.isConnectedToCast = true;
    console.log('init success');
  },

  onError: function() {
    console.log("error");
  },

  onSuccess: function(message) {
    console.log(message);
  },

  onStopAppSuccess: function() {
    castApi.isConnectedToCast = false;
    console.log('Session stopped');
    document.getElementById("casticon").src = 'images/cast_icon_idle.png'; 
  },

  sessionListener: function(e) {
    console.log('New session ID: ' + e.sessionId);
    castApi.session = e;
    if (castApi.session.media.length !== 0) {
      castApi.onMediaDiscovered('onRequestSessionSuccess_', castApi.session.media[0]);
    }
    castApi.session.addMediaListener(
      castApi.onMediaDiscovered.bind(castApi,'addMediaListener'));
    castApi.session.addUpdateListener(castApi.sessionUpdateListener.bind(castApi));
  },

  sessionUpdateListener: function(isAlive) {
    var message = isAlive ? 'Session Updated' : 'Session Removed';
    message += ': ' + castApi.session.sessionId;
    if (!isAlive) {
      castApi.session = null;
    }
  },

  receiverListener: function(e) {
    if( e === 'available' ) {
      console.log("receiver found");
    }
    else {
      console.log("receiver list empty");
    }
  },

  launchApp: function() {
    console.log('launching...', chrome, chrome.cast);
    chrome.cast.requestSession(castApi.onRequestSessionSuccess.bind(castApi),
      castApi.onLaunchError.bind(castApi));
  },

  onRequestSessionSuccess: function(e) {
    console.log("session success: " + e.sessionId, e);
    castApi.session = e;
    castApi.startPlaying();
  },

  onLaunchError: function(e) {
    console.log("launch error",e);
  },

  stopApp: function() {
    castApi.session.stop(castApi.onStopAppSuccess, castApi.onError);
  },

  showNotification: function(track) {
    if (!chrome.notifications) {
      console.log('chrome notifications api not available');
      return;
    }
    chrome.notifications.create('soundcast', {
      iconUrl: track.artwork_url,
      imageUrl: track.artwork_url,
      title: 'Soundcast',
      message: 'Now Playing: ' + track.title,
      priority: -2
    });
  },

  loadMedia: function(track) {
    if (!castApi.session) {
      console.log("no session");
      return castApi.launchApp();
    }
    castApi.loadMediaTime = new Date();
    console.log('loading...' + track.permalink_url);
    
    window.$soundcastTitleLink.attr('href',track.permalink_url);
    var url = track.stream_url + '?client_id=dc07f9e8441801095408fd67c6e35fa8'; 
    var image = track.artwork_url ?
      track.artwork_url.replace(/large/,'t500x500') : null;
    var artist = track.user ? track.user.username : null;

    var mediaInfo = new chrome.cast.media.MediaInfo(url);
    mediaInfo.metadata = new chrome.cast.media.GenericMediaMetadata();
    mediaInfo.metadata.metadataType = chrome.cast.media.MetadataType.MUSIC_TRACK;
    mediaInfo.metadata.title = track.title;
    mediaInfo.metadata.artist = artist;
    mediaInfo.metadata.link = track.permalink_url;
    mediaInfo.metadata.images = [{'url': image }];
    mediaInfo.contentType = 'audio/mp3';

    var request = new chrome.cast.media.LoadRequest(mediaInfo);
    request.autoplay = true;
    request.currentTime = 0;
    castApi.session.loadMedia(request,castApi.onMediaDiscovered.bind(castApi,'loadMedia'),
      castApi.onMediaError.bind(castApi));
    castApi.showNotification(track);
  },

  onMediaDiscovered: function(how, mediaSession) {
    console.log("new media session ID:" + mediaSession.mediaSessionId);
    castApi.currentMediaSession = mediaSession;
    mediaSession.addUpdateListener(castApi.onMediaStatusUpdate.bind(castApi));
    castApi.mediaCurrentTime = castApi.currentMediaSession.currentTime;
    window.$soundcastCtrl.show();
    window.$soundcastPlay.addClass('playing');
    window.$soundcastTitle.removeClass('paused');
    window.$soundcastTitleLink.text(mediaSession.media.metadata.title)
      .attr('href', mediaSession.media.metadata.link);
    $('.volume').attr('data-level',mediaSession.volume.level * 10);
    castApi.isPlaying = true;
    castApi.moveProgressBar();
  },

  onMediaError: function(e) {
    console.log("media error",e);
  },

  onMediaStatusUpdate: function(e) {
    //console.log('isMediaPlaying',e);
    console.log(JSON.parse(localStorage.getItem('tracks')));
    // if no longer playing and not set to paused or stopped,
    // play the next item in the queue
    if (!e && castApi.isPlaying) {
      castApi.startPlaying();
    }
    if( castApi.progressFlag ) {
      var progress = parseInt(100 * castApi.currentMediaSession.currentTime / castApi.currentMediaSession.media.duration);
      castApi.progress = progress;
    }
    castApi.playerState = castApi.currentMediaSession.playerState;
    $('.volume').attr('data-level',castApi.currentMediaSession.volume.level * 10);
    if (castApi.currentMediaSession.volume.muted) {
      $('.volume').addClass('muted');
    } else {
      $('.volume').removeClass('muted');
    }
  },

  startPlaying: function(override) {
    if (new Date() - castApi.loadMediaTime < 1000 ||
        castApi.isPlaying && !override) {
      console.log('already playing');
      return;
    }
    var tracks = JSON.parse(localStorage.getItem('tracks'));
    //console.log(tracks);
    if (tracks && tracks.length) {
      var track = tracks.shift();
      if (track) {
        castApi.loadMedia(track);
      }
      localStorage.setItem('tracks',JSON.stringify(tracks));
    } else {
      castApi.stopMedia();
    }
  },

  skipTrack: function() {
    castApi.startPlaying(true);
  },

  pausePlay: function() {
    if (!castApi.currentMediaSession) {
      castApi.startPlaying();
      return;
    }
     if (castApi.isPlaying) {
      if (!castApi.isPaused) {
        castApi.currentMediaSession.pause(null,
          castApi.mediaCommandSuccessCallback.bind(castApi,
            "paused " + castApi.currentMediaSession.sessionId),
            castApi.onError.bind(castApi));
        castApi.isPaused = true;
        window.$soundcastPlay.removeClass('playing');
        window.$soundcastTitle.addClass('paused');
      } else {
        castApi.currentMediaSession.play(null,
          castApi.mediaCommandSuccessCallback.bind(castApi,
            "resumed " + castApi.currentMediaSession.sessionId),
            castApi.onError.bind(castApi));
        castApi.isPaused = false;
        window.$soundcastPlay.addClass('playing');
        window.$soundcastTitle.removeClass('paused');
      }
    } else {
      castApi.startPlaying();
    }
  },

  stopMedia: function() {
    if(!castApi.currentMediaSession){ 
      return;
    }
    castApi.currentMediaSession.stop(null,
      castApi.mediaCommandSuccessCallback.bind(castApi,
        "stopped " + castApi.currentMediaSession.sessionId),
        castApi.onError.bind(castApi));
    castApi.isPlaying = false;
    castApi.isPaused = false;
    window.$soundcastCtrl.hide();
    window.$soundcastPlay.removeClass('playing');
    window.$soundcastTitle.addClass('paused');
    window.$soundcastTitleLink.text('');
  },

  setMediaVolume: function(level, mute) {
    if( !castApi.currentMediaSession ) {
      return;
    }

    var volume = new chrome.cast.Volume();
    volume.level = level;
    castApi.currentVolume = volume.level;
    volume.muted = mute;
    var request = new chrome.cast.media.VolumeRequest();
    request.volume = volume;
    castApi.currentMediaSession.setVolume(request,
      castApi.mediaCommandSuccessCallback.bind(castApi,'media set-volume done'),
      castApi.onError.bind(castApi));
    castApi.mediaVolume = level;
    castApi.isMediaMuted = mute;
  },

  setReceiverVolume: function(level, mute) {
    if (!castApi.session) {
      return castApi.launchApp;
    }

    if (!mute) {
      castApi.session.setReceiverVolumeLevel(level,
        castApi.mediaCommandSuccessCallback.bind(castApi,'media set-volume done'),
        castApi.onError.bind(castApi));
      castApi.currentVolume = level;
    } else {
      castApi.session.setReceiverMuted(true,
        castApi.mediaCommandSuccessCallback.bind(castApi,'media set-volume done'),
        castApi.onError.bind(castApi));
    }
    castApi.receiverVolume = level;
    castApi.isReceiverMuted = mute;
    $('.volume').data('level',level * 10);
  },

  muteMedia: function() {
    if (!castApi.isReceiverMuted) {
      castApi.setReceiverVolume(castApi.currentVolume, true);
      console.log("media muted");
      $('.volume').addClass('muted');
    } else {
      castApi.setReceiverVolume(castApi.currentVolume, false);
      console.log("media unmuted");
      $('.volume').removeClass('muted');
    }
  },


  seekMedia: function(pos) {
    console.log('Seeking ' + castApi.currentMediaSession.sessionId + ':' +
      castApi.currentMediaSession.mediaSessionId + ' to ' + pos + "%");
    castApi.progressFlag = 0;
    var request = new chrome.cast.media.SeekRequest();
    request.currentTime = pos * castApi.currentMediaSession.media.duration / 100;
    castApi.currentMediaSession.seek(request,
      castApi.onSeekSuccess.bind(castApi,'media seek done'),
      castApi.onError);
  },

  onSeekSuccess: function(info) {
    console.log(info);
    setTimeout(function() {
      castApi.progressFlag = 1;
    }.bind(castApi),1500);
  },

  mediaCommandSuccessCallback: function(info) {
    console.log(info);
  },

  autoJoin: function(value) {
    window.location.href = window.location.pathname + '?auto=' + value;
  }
};
