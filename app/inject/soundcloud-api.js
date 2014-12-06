window.soundcloudApi = {

  formatUrl: function(url, resolveUrl) {
    var baseUrl = 'https://api.soundcloud.com/' + url + '.json?';
    var auth = 'client_id=' + 'dc07f9e8441801095408fd67c6e35fa8';
    if (resolveUrl) {
      console.log(baseUrl += 'url=' + resolveUrl + '&' + auth);
      return baseUrl += 'url=' + resolveUrl + '&' + auth;
    }
    return baseUrl + auth;
  },
  actions: {
    resolveSoundcloud: function(url) {
      $.get(soundcloudApi.formatUrl('resolve', url), function(response) {
        if (response.errors) {
          return alert('SOUNDCLOUD 404 Yo!');
        }

        $('input#soundcloud').val('');
        if (typeof response === 'object') {
          var id = response.id;
          switch(response.kind) {
            case 'user':
              $.get(soundcloudApi.formatUrl('users/'+id+'/tracks'),
                soundcloudApi.onTracks.bind(soundcloudApi));
              $.get(soundcloudApi.formatUrl('users/'+id+'/favorites'),
                soundcloudApi.onTracks.bind(soundcloudApi));
              break;
            case 'group':
              $.get(soundcloudApi.formatUrl('groups/'+id+'/tracks'),
                soundcloudApi.onTracks.bind(soundcloudApi));
              break;
            case 'playlist':
              $.get(soundcloudApi.formatUrl('playlists/'+id),
                soundcloudApi.onTracks.bind(soundcloudApi)); 
              break;
            case 'track':
              soundcloudApi.addTrack(response);
              break;
          }
        }
      });
    }
  },
  onTracks: function(response) {
    if (response.errors) {
      return console.log(response);
    }
    if (response.tracks) { // playlist
      soundcloudApi.addTracks(response.tracks);
    } else { // everything else
      soundcloudApi.addTracks(response); 
    }
  },
  addTracks: function(tracks) {
    window.soundcastQueue.add(tracks); 
  },
  addTrack: function(track) {
    window.soundcastQueue.add(track);
    window.castApi.startPlaying();
  },
  notification: function(data) {
/*<div id="gritter-notice-wrapper" class="top-right"><div id="gritter-item-5" class="gritter-item-wrapper error" style=""><div class="gritter-top"></div><div class="gritter-item"><div class="gritter-close" style="display: none;"></div><div class="gritter-without-image"><p>There was a problem playing this track.</p></div><div style="clear:both"></div></div><div class="gritter-bottom"></div></div></div> */
  }
};
