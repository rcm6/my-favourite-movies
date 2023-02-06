/*/// importing the api keys from config.js

// import { OMDB_API_KEY, YOUTUBE_API_KEY } from "./config.js";

// // checking if api exists otherwise throw an error to the console

// if (!OMDB_API_KEY && !YOUTUBE_API_KEY)
//   throw new Error("No API keys are provided");

if (!OMDB_API_KEY && !YOUTUBE_API_KEY)
  throw new Error("No API keys are provided");*/
OMDB_API_KEY = "1cd5aea2";
YOUTUBE_API_KEY = "AIzaSyDgb40pPDUgfTAJRSL_rNpputm0ksw60N8";

// global variables to store the movie search history and favourites history to local storage

let movieHistory = window.localStorage.getItem("searchHistory")
  ? JSON.parse(window.localStorage.getItem("searchHistory"))
  : [];

const favouriteHistory = window.localStorage.getItem("favouriteHistory")
  ? JSON.parse(window.localStorage.getItem("favouriteHistory"))
  : [];

// stores the string value from the form input

const movie = "";

// invoking the function here first so that: if there are any movies stored within local storage, will be rendered first

renderMovieCards();

// an event listener on to search button on page
$("#search-button").on("click", function (event) {
  // prevents the page from reloading
  event.preventDefault();
  // gets the value from the form input
  const movie = $("#search-input").val().trim();

  // checks if movie string exists and then invokes functions
  if (movie) {
    getMovieInfo(movie);
    renderMainCard(movie);
    //call you tube function passing response.title into parameter
    getYouTube(movie);
    $("#search-input").val("");
  } else {
    $("#modal-2").modal("show");
  }
});

// need this variable to be global so that it updates before the function is executed
// let countId = 1;
// function to retrieve data from the omdb api

function getMovieInfo(movie) {
  // lets created a variable here to initialise the countId

  let countId = 0;

  const queryURL =
    "https://www.omdbapi.com/?t=" + movie + "&apikey=" + OMDB_API_KEY;

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    console.log(response);
    if(response.imdbID){
    
      // filters the array and checks if there is already a movie in the array before pushing the movie object
      if (movieHistory.filter((e) => e.name === movie).length === 0) {
        // creating an object to store to local storage
        const movieObject = {
          cardId: countId,
          name: movie,
          imdbId: response.imdbID,
        };

        // pushing object to array
        movieHistory.push(movieObject);

        if (countId < 6) {
          for (let i = 0; i < movieHistory.length; i++) {
            console.log("inside of loop getMovieInfo");

            countId = i + 1;

            const movie = movieHistory[i];

            movie["cardId"] = movie["cardId"] = countId;
            countId++;
          }
        }

        // if there is more than five objects in the array then one will be removed, so causing the next movie to increase to 7 and so on..
        if (movieHistory.length > 6) {
          movieHistory.shift();

          // this loops through the array and reassigns the correct numbers to cardId
          for (let i = 0; i < movieHistory.length; i++) {
            const movies = movieHistory[i];
            movies["cardId"] = 0;
            movies["cardId"] = movies["cardId"] + i + 1;
          }
        }
        // once the above array checked with the above conditionals, the array is stringified and stored to local storage
        window.localStorage.setItem(
          "searchHistory",
          JSON.stringify(movieHistory)
        );

        // invoking the function again because user searched for a movie and clicked on the search button
        renderMovieCards();
      }
    }
      else{
      $("#modal-2").modal("show");
    }
  });
}

// function to render the movie cards to the movies container

function renderMovieCards() {
  $("#movies").empty();

  // logging the array here to show if there are any movie objects currently stored
  console.log(movieHistory);

  for (let i = 0; i < movieHistory.length; i++) {
    const queryURL =
      "https://www.omdbapi.com/?t=" +
      movieHistory[i].name +
      "&apikey=" +
      OMDB_API_KEY;
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      // console.log(response);

      // using destructuring to get data properties from response object

      const { Poster, Title, Year, Plot } = response;

      var movieCard = $(`
      
      <div class="col-4 col-lg-3 col-xl-2 p-1 movie-column">
      <div class="align-top">
        <img src="${Poster}" alt="movie poster" class="image-fluid" />
        <h2 class="movie-title">${Title}</h2>
        <h2 class="release-date">${Year}</h2>
      </div>

      <div class="movie-card-summary">
        <p class="movie-plot">
              ${Plot}
        </p>
      </div>
      <div class="youtube-links">
        <h2 class="header-youtube">search on youtube</h2>
        <div class="movie-card-links">
          <ul class="movie-card-list">
            <li class="movie-list-items">
              <a href="#" class="trailer" data-cardid="${movieHistory[i].cardId}">watch a trailer</a>
            </li>
            <li class="movie-list-items">
              <a href="#" class="review" data-cardid="${movieHistory[i].cardId}">watch a review</a>
            </li>
            <li class="movie-list-items">
              <a href="#" class="actors" data-cardid="${movieHistory[i].cardId}">about the actors</a>
            </li>
            <li class="movie-list-items">
              <a href="#" class="soundtracks" data-cardid="${movieHistory[i].cardId}">movie soundtracks</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="fave-link">
        <a href="#" class="add-to-fave btn btn-dark" data-cardid="${movieHistory[i].cardId}">add to favourites</a>
      </div>
    </div>


    `);


      $(movieCard).appendTo("#movies");

      $("#poster-background").remove();// remove movie poster background image from 
 

      searchYoutube();

      // invoking the function because once movie card is rendered can attach the event listener to add to fave button

      addTofave();
    });
  }
}

// this function takes in the response object from getMovieInfo and then checks if there is a match within movieHistory object in local storage and will then create a new local storage titled favourites

// creating a helper function to return the movie title

function getMovieTitle(clickEvent) {
  const target = $(clickEvent.currentTarget);

  // had to use Element.attr() instead of dataset because of jquery and convert it to number
  const targetId = +target.attr("data-cardid");

  console.log(targetId);

  const movieObj = movieHistory.filter(
    (element) => element.cardId === targetId
  );

  if (targetId === movieObj[0].cardId) {
    const title = movieObj[0].name;

    return title;
  }
}

function addTofave() {
  // console.log(data);

  // attaching an event listener to the add to favourites button

  $(".add-to-fave").on("click", function (event) {
    event.preventDefault();

    console.log("add to fave button clicked");

    const movieTitle = getMovieTitle(event);

    console.log(movieTitle);

    // looping through the movieHistory array and checking if the title exists and if so, lets save the id movie title and imdb id to favouriteHistory

    for (let i = 0; i < movieHistory.length; i++) {
      const movies = movieHistory[i];

      console.log(movies);

      // this returns a boolean value of true if exists or false if does not
      const title = movies["name"].includes(movieTitle);

      // if the title exists in the array then create an object from it again and store it local storage as favourites, however if it already exists in favourites then we don't want to add it to the favourites array again.

      // because favouritesHistory is an array of object, we need to use findIndex to return a boolean which indicates that the title does not exist

      if (title) {
        const exists =
          favouriteHistory.findIndex(
            (element) => element.name === movies["name"]
          ) > -1;

        console.log(exists);

        if (!exists) {
          favouriteHistory.push({
            cardId: movies["cardId"],
            name: movies["name"],
            imdbId: movies["imdbId"],
          });

          window.localStorage.setItem(
            "favourites",
            JSON.stringify(favouriteHistory)
          );
        }
      }
    }
  });
}

// function to listen to search on youtube links within movie card

function searchYoutube() {
  // event listener on watch a trailer link
  $(".trailer").on("click", function (event) {
    event.preventDefault();

    console.log("trailer link clicked");

    const movieTitle = getMovieTitle(event);

    console.log(movieTitle);

    if (movieTitle) {
      getYouTube(movieTitle, "trailer");
    }
  });

  // event listener on watch a review link

  $(".review").on("click", function (event) {
    event.preventDefault();

    console.log("watch review clicked");

    const movieTitle = getMovieTitle(event);

    console.log(movieTitle);

    if (movieTitle) {
      getYouTube(movieTitle, "review");
    }
  });

  // event listener on about the actors link

  $(".actors").on("click", function (event) {
    event.preventDefault();

    console.log("about the actors link clicked");

    const movieTitle = getMovieTitle(event);

    console.log(movieTitle);

    if (movieTitle) {
      getYouTube(movieTitle, "actors");
    }
  });

  // event listener on movie soundtracks link

  $(".soundtracks").on("click", function (event) {
    event.preventDefault();

    console.log("soundtrack link clicked");

    const movieTitle = getMovieTitle(event);

    console.log(movieTitle);

    if (movieTitle) {
      getYouTube(movieTitle, "soundtracks");
    }
  });
}

// the api for the youtube api

function getYouTube(movie) {
  console.log(movie);
  $.ajax({
    url:
      "https://youtube.googleapis.com/youtube/v3/search?q=" +
      movie +

      " movie 2021&embeddable=true&maxResults=6&key=" +
      YOUTUBE_API_KEY,

    method: "GET",
  }).then(function (response1) {
    console.log(response1);
    console.log(response1.length);

    $("#you-tube").find("iframe").remove();

    for (i = 0; i < response1.items.length; i++) {
      console.log("videoID:" + response1.items[i].id.videoId);
      $("#you-tube").append(
        `<iframe width="560" height="315" class="col-6" src="https://www.youtube.com/embed/${response1.items[i].id.videoId}" title="YouTube video player"></iframe>`
      );
    }
  });
}

$('#show-fav-btn').on("click", function(event){
  event.preventDefault();
  renderFavourites();
})


function renderFavourites(){
  $('#favourite').empty();
  var favouriteSaved = JSON.parse(localStorage.getItem("favourites"))||[];

  if(favouriteSaved.length ===0){
    var noFaves = $('<h1>No favourites saved</h1>');
    $('#favourite').append(noFaves);
  }

  for(var i=0; i<favouriteSaved.length; i++){

    var queryURL = "https://www.omdbapi.com/?t=" + favouriteSaved[i].name + "&apikey=" + OMDB_API_KEY;
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      //set the id of the card so that the movie title can be extracted on click later on. Put a string to begin the id so that the full name is stored
      var favouriteCard = $(`
      <div class="card favourite-card">
      <a href=""><img src=${response.Poster} id="fave-${response.Title}"></a>                   
      </div>
    `); 
    $('#favourite').append(favouriteCard);
    });
  }
}

  $('#favourite').on("click", function(event){
    event.preventDefault();
    //$('#modal-1').modal("hide");
    var faveToPlay = event.target.id;
    faveToPlay= faveToPlay.substring(5); //remove the fave- from the beginning of the string to return just the movie name
    renderMainCard(faveToPlay);
    getYouTube(faveToPlay);
  })

  function renderMainCard(movie) {
    $('#main-card').empty();
    const queryURL =
      "https://www.omdbapi.com/?t=" +
      movie +
      "&apikey=" +
      OMDB_API_KEY;
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
    

      var movieCard = $(`
      <div class="card" style="width: 100%;">
      
        <img src="${response.Poster}" alt="movie poster" class="poster-main"/>
        <h2 class="movie-title">${response.Title}</h2>
        <h2 class="release-date">${response.Year}</h2>
     

      <div class="movie-card-summary">
        <p class="movie-plot">
              ${response.Plot}
        </p>
      </div>
      <div class="youtube-links">
      <h2 class="header-youtube">search on youtube</h2>
      <div class="movie-card-links">
        <ul class="movie-card-list">
          <li class="movie-list-items">
            <a href="#" class="trailer" data-searchVid="${response.Title}+'trailer'">watch a trailer</a>
          </li>
          <li class="movie-list-items">
            <a href="#" class="review" data-searchVid="${response.Title}+'review'">watch a review</a>
          </li>
          <li class="movie-list-items">
            <a href="#" class="actors" data-searchVid="${response.Title}+'actors'">about the actors</a>
          </li>
          <li class="movie-list-items">
            <a href="#" class="soundtracks" data-searchVid="${response.Title}+'soundtrack'">movie soundtracks</a>
          </li>
        </ul>
      </div>
    </div>
  </div>

    `);
    $('#main-card').append(movieCard);
    $("#modal-3").modal("show");
    });
  }

