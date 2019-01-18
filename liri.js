// console.log("Running liri.js");
require("dotenv").config();
var axios = require("axios");
var fs = require("fs");
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);

runCommand(process.argv[2], process.argv.slice(3).join(" "));

function runCommand(command, searchString) {
  // Input
  // concert-this = node liri.js concert-this <artist/band name here>
  // Use this
  // "https://rest.bandsintown.com/artists/" + searchString + "/events?app_id=codingbootcamp"
  // Output
  // Name of the venue
  // Venue location
  // Date of the Event (use moment to format this as "MM/DD/YYYY")
  if (command === "concert-this") {
    axios
      .get(
        "https://rest.bandsintown.com/artists/" +
          searchString +
          "/events?app_id=codingbootcamp"
      )
      .then(function(response) {
        console.log("TOTAL EVENTS:" + response.data.length);

        for (var i = 0; i < response.data.length; i++) {
          var event = response.data[i];
          var venue = event.venue;
          var moment = require("moment");
          var eventMoment = moment(event.datetime, "YYYY-MM-DD");

          console.log(
            "EVENT:" +
              (i + 1) +
              "\nVenue: " +
              venue.name +
              "\nLocation:" +
              venue.city +
              ", " +
              venue.country +
              "\nDate: " +
              eventMoment.format("MM/DD/YYYY")
          );
        }
      })
      .catch(function(error) {
        console.log("Sorry, we failed to get the events information " + error);
      });
  }

  // Input
  // spotify-this-song = node liri.js spotify-this-song '<song name here>'
  // Output
  // Artist(s)
  // The song's name
  // A preview link of the song from Spotify
  // The album that the song is from
  else if (command === "spotify-this-song") {
    if (!searchString) {
      searchString = "The sign by ace of base";
    }
    spotify
      .search({ type: "track", query: searchString })
      .then(function(response) {
        //console.log(JSON.stringify(response));
        var tracksItems = response.tracks.items;
        console.log("TOTAL SONGS:" + tracksItems.length);
        for (var i = 0; i < tracksItems.length; i++) {
          var track = tracksItems[i];
          var previewUrl = track.preview_url;
          var albumName = track.album.name;
          var artistsArr = track.artists;
          var name = track.name;
          var artistNames = [];

          for (var j = 0; j < artistsArr.length; j++) {
            artistNames.push(artistsArr[j].name);
          }
          console.log(
            "Song:" +
              (i + 1) +
              "\nName: " +
              name +
              "\nPreviewUrl: " +
              previewUrl +
              "\nAlbumName: " +
              albumName +
              "\nArtist(s): " +
              artistNames
          );
        }
      })
      .catch(function(err) {
        console.log(err);
      });
  }

  // Input
  // movie-this = node liri.js movie-this '<movie name here>'
  // Output
  // * Title of the movie.
  // * Year the movie came out.
  // * IMDB Rating of the movie.
  // * Rotten Tomatoes Rating of the movie.
  // * Country where the movie was produced.
  // * Language of the movie.
  // * Plot of the movie.
  // * Actors in the movie.
  else if (command === "movie-this") {
    if (!searchString) {
      searchString = "Mr. Nobody";
    }
    axios
      .get("http://www.omdbapi.com/?t=" + searchString + "&apikey=2d5e0b28")
      .then(function(response) {
        var data = response.data;
        if (data.Error) {
          // {"Response":"False","Error":"Movie not found!"}
          console.log(data.Error);
          return;
        }

        var title = data.Title;
        var year = data.Year;
        var imdbRating = data.imdbRating;
        var rtRating;
        for (var j = 0; j < data.Ratings.length; j++) {
          var rating = data.Ratings[j];
          if (rating.Source === "Rotten Tomatoes") {
            rtRating = rating.Value;
          }
        }
        var countryProduced = data.Country;
        var language = data.Languare;
        var plot = data.Plot;
        var actors = data.Actors;

        console.log(
          "MOVIE:" +
            "\nTitle: " +
            title +
            "\nYear: " +
            year +
            "\nIMDB: " +
            imdbRating +
            "\nRotten Tomatoes: " +
            rtRating +
            "\nCountry: " +
            countryProduced +
            "\nLanguage: " +
            language +
            "\nPlot: " +
            plot +
            "\nActors: " +
            actors
        );
      })

      .catch(function(error) {
        console.log("Sorry, we failed to get the events information " + error);
      });
  }

  // Input
  // do-what-it-says = node liri.js do-what-it-says
  // Output
  // One of the other commands read from random.txt
  else if (command === "do-what-it-says") {
    console.log("Reading file to do what it says");
    fs.readFile("random.txt", "utf8", function(err, data) {
      if (err) {
        console.log("could not read random text", err);
        return;
      }
      console.log("Command is: " + data);
      var dataArr = data.split(" ");
      var randomCommand = dataArr[0];
      if (randomCommand === "do-what-it-says") {
        console.log("will not run command from random.txt file");
        return;
      }
      runCommand(randomCommand, dataArr.slice(1).join(" "));
    });
  } else {
    console.log(
      "sorry, I only understand 4 commands\nconcert-this\nspotify-this-song\nmovie-this\ndo-what-it-says"
    );
  }
}
