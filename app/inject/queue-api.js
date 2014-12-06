window.soundcastQueue = {

  render: function() {
    var tracks = JSON.parse(localStorage.getItem('tracks'));
    var $ul = $('<ol>');

    tracks.forEach(function(track) {
      $ul.append($('<li>')
      .append($('<span>').text(track.title).on('click', function(e) {
        window.location = track.permalink_url;
      }))
      .append($('<span>').html('&nbsp;&nbsp;&nbsp;'))
      .append($('<span>').html('&#9658;').on('click', function(e) {
        soundcastQueue.play(track);
      }))
      .append($('<span>').html('&nbsp;&nbsp;&nbsp;'))
      .append($('<span>').text('X').on('click', function(e) {
        soundcastQueue.remove(track);   
      })));
    });

    window.$soundcastQueue.html('').append($ul);
  },

  play: function(track) {
    castApi.loadMedia(track);
  },

  add: function(track) {
    var tracks = JSON.parse(localStorage.getItem('tracks'));
    if (!tracks)
      tracks = [];
    }
    tracks.push(track);
    tracks.flatten(); // in case track was actually tracks ;)
    localStorage.setItem('tracks',JSON.stringify(tracks));
    soundcastQueue.render();
  },

  remove: function(track) {
    var tracks = JSON.parse(localStorage.getItem('tracks'));
    if (!tracks)
      tracks = [];
    // not sure why but a simple indexof wasn't working here
    tracks.forEach(function(trackRec,i) {
      if (trackRec.permalink_url === track.permalink_url) {
        tracks.splice(i, 1);
        localStorage.setItem('tracks', JSON.stringify(tracks));
        soundcastQueue.render();
      }
    });
  }

};
