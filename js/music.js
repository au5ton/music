/*

music.js
Client-code for austinj.net/music

*/

function escapeHtml(unsafe) {
    return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

//Disable tooltips on mobile
if(document.body.clientWidth <= 600) {
    var arr = document.querySelectorAll('[data-balloon]');
    for(var i = 0; i < arr.length; i++) {
        arr.item(i).removeAttribute('data-balloon');
    }
}

window.SoundCloud = {
    createSongElement: function(t) {
        var elem = document.createElement('div');
        elem.setAttribute('class', 'song-wrap');
        elem.innerHTML = document.getElementById('song-template-sc').innerHTML;
        elem.innerHTML = String(elem.innerHTML).replace('{{PERMALINK}}',t['permalink']);
        elem.innerHTML = String(elem.innerHTML).replace('{{SONG_TITLE}}',escapeHtml(t['song_title']));
        elem.innerHTML = String(elem.innerHTML).replace('{{COVER_ART}}',t['cover_art']);
        return elem;
    }
};

window.LastFm = {
    createSongElement: function(t) {
        var elem = document.createElement('div');
        elem.setAttribute('class', 'song-wrap');
        elem.innerHTML = document.getElementById('song-template-fm').innerHTML;
        elem.innerHTML = String(elem.innerHTML).replace('{{PERMALINK}}',t['permalink']);
        elem.innerHTML = String(elem.innerHTML).replace('{{SONG_TITLE}}',escapeHtml(t['song_title']));
        elem.innerHTML = String(elem.innerHTML).replace('{{SONG_ARTIST}}',escapeHtml(t['song_artist']));
        elem.innerHTML = String(elem.innerHTML).replace('{{COVER_ART}}',t['cover_art']);
        return elem;
    }
};



function populateSoundCloud(count) {
    if(typeof count !== 'number' || count <= 0) {
        count = 10;
    }
    //SoundCloud likes
    window.fetch('https://austinjnet-stats.herokuapp.com/api/soundcloud/likes?count='+count).then(function(response){
        return response.json();
    }).then(function(json){
        //we got the json

        var songGrid = document.querySelector('.song-grid#music-sc');
        //empties the grid
        songGrid.innerHTML = '';
        for(var i = 0; i < json.length; i++) {
            var elem = window.SoundCloud.createSongElement(json[i]);
            songGrid.appendChild(elem);
        }
    }).catch(function(ex){
        //well crap
        console.error(ex);
        var songGrid = document.querySelector('.song-grid#music-sc');
        //Replaces the loader in the process
        songGrid.innerHTML = '<h5 class=\'red-text fetch-failure\'>Failed to load from the statistics server.</h5>';
    });
}

function populateLastFm(count) {
    if(typeof count !== 'number' || count <= 0) {
        count = 10;
    }
    //Last.fm scrobbles
    window.fetch('https://austinjnet-stats.herokuapp.com/api/lastfm/recent?count='+count).then(function(response){
        return response.json();
    }).then(function(json){
        //we got the json
        var songGrid = document.querySelector('.song-grid#music-fm');
        //empties the grid
        songGrid.innerHTML = '';
        for(var i = 0; i < json.length; i++) {
            var elem = window.LastFm.createSongElement(json[i]);
            songGrid.appendChild(elem);
        }
    }).catch(function(ex){
        //well crap
        console.error(ex);
        var songGrid = document.querySelector('.song-grid#music-fm');
        //Replaces the loader in the process
        songGrid.innerHTML = '<h5 class=\'red-text fetch-failure\'>Failed to load from the statistics server.</h5>';
    });
}

populateSoundCloud(10);
populateLastFm(10);

document.getElementById('loadmore-sc').addEventListener('click', function(event){
    //event.target is the element clicked
    if(event.target.getAttribute('class').split(' ').indexOf('disabled') === -1) {
        //if the 'disabled' class isn't already on the button

        //Clone the loader element
        var loader = document.createElement('div');
        loader.setAttribute('class', 'loader-container');
        loader.innerHTML = document.getElementById('loader-template').innerHTML;

        //Append the loader element
        document.querySelector('.song-grid#music-sc').appendChild(loader);

        populateSoundCloud(30);

        event.target.setAttribute('class', event.target.getAttribute('class')+' disabled'); //Disable the button
        event.target.innerText = 'Already loaded';
    }
});
document.getElementById('loadmore-fm').addEventListener('click', function(event){
    //event.target is the element clicked

    if(event.target.getAttribute('class').split(' ').indexOf('disabled') === -1) {
        //if the 'disabled' class isn't already on the button

        //Clone the loader element
        var loader = document.createElement('div');
        loader.setAttribute('class', 'loader-container');
        loader.innerHTML = document.getElementById('loader-template').innerHTML;

        //Append the loader element
        document.querySelector('.song-grid#music-fm').appendChild(loader);

        populateLastFm(30);

        event.target.setAttribute('class', event.target.getAttribute('class')+' disabled'); //Disable the button
        event.target.innerText = 'Already loaded';
    }
});
