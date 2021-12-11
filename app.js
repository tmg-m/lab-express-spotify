require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:        // code coppied form lab from line 16-25
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));
  

// Our routes go here:

app.get("/",(req, res) => {
    res.render("index")
})

app.get("/artist-search-results", (req, res) => {
    spotifyApi
    .searchArtists(req.query.artistName) //gets name from placeholder
    .then(data => {
        res.render('artist-search-results', {artists: data.body.artists.items})
    })
    .catch(err => console.log('Error while searching the artist', err));
    
})

app.get("/albums/:thisArtistId", (req, res) => {
    spotifyApi
    .getArtistAlbums(req.params.thisArtistId)
    .then(data => {
        res.render('albums', {albums: data.body.items})
    })
    .catch(err => console.log('Error searching Albums', err));
})

app.get("/tracks/:thisAlbumId", (req, res) => {

    spotifyApi
    .getAlbumTracks(req.params.thisAlbumId)
    .then(data => {
        res.render('tracks', {tracks: data.body.items})
    })
    .catch(err => console.log('Error searching Tracks', err));
})

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));


