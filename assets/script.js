const OMDBapiKey = "1cd5aea2";

// global variables to store the movie search history and favourites history to local storage

const movieHistory = window.localStorage.getItem("searchHistory")
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
    //call you tube function passing response.title into parameter
    getYouTube(movie);
    $("#search-input").val("");
  } else {
    $("#modal-2").modal("show");
  }
});

// function to retrieve data from the omdb api

function getMovieInfo(movie) {
  const queryURL =
    "https://www.omdbapi.com/?t=" + movie + "&apikey=" + OMDBapiKey;

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    console.log(response);

    // creating an object to store to local storage
    const movieObject = {
      name: movie,
      id: response.imdbID,
    };
    // filters the array and checks if there is already a movie in the array before pushing the movie object
    if (movieHistory.filter((e) => e.name === movie).length === 0) {
      movieHistory.push(movieObject);

      // if there is more than five objects in the array then one will be removed
      if (movieHistory.length > 6) {
        movieHistory.shift();
      }
      // once the above array checked with the above conditionals, the array is stringified and stored to local storage
      window.localStorage.setItem(
        "searchHistory",
        JSON.stringify(movieHistory)
      );

      // invoking the function again because user searched for a movie and clicked on the search button
      renderMovieCards();
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
      OMDBapiKey;
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
              <a href="#">watch a trailer</a>
            </li>
            <li class="movie-list-items">
              <a href="#">watch a review</a>
            </li>
            <li class="movie-list-items">
              <a href="#">about the actors</a>
            </li>
            <li class="movie-list-items">
              <a href="#">movie soundtracks</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="fave-link">
        <a href="#" class="add-to-fave btn btn-dark">add to favourites</a>
      </div>
    </div>


    `);

      $("#movies").append(movieCard);

      // invoking the function because once movie card is rendered can attach the event listener to add to fave button

      addTofave();
    });
  }
}

// this function takes in the response object from getMovieInfo and then checks if there is a match within movieHistory object in local storage and will then create a new local storage titled favourites

function addTofave() {
  // console.log(data);

  // attaching an event listener to the add to favourites button

  $(".add-to-fave").on("click", function (event) {
    event.preventDefault();

    console.log("add to fave button clicked");

    // returns the target button clicked on
    const target = $(event.currentTarget);

    // traverses the dom tree upwards to parent element of movie title in movie card
    const parentEl = $(target.parent().parent());
    // gets the actual title text and returns it in lowercase
    const movieTitle = $(parentEl[0].children[0].children[1].childNodes[0])
      .text()
      .toLowerCase();

    console.log(movieTitle);

    // looping through the movieHistory array and checking if the title exists and if so, lets save the id movie title and imdb id to favouriteHistory

    for (let i = 0; i < movieHistory.length; i++) {
      const movies = movieHistory[i];

      console.log(movies);

      const title = movies["name"].includes(movieTitle);

      // if the title exists in the array then create an object from it again and store it local storage as favourites

      if (title) {
        favouriteHistory.push({
          name: movies["name"],
          id: movies["id"],
        });

        // lets now save this movie to local storage

        window.localStorage.setItem(
          "favourites",
          JSON.stringify(favouriteHistory)
        );
      }
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
      " movie 2021&embeddable=true&maxResults=6&key=AIzaSyDgb40pPDUgfTAJRSL_rNpputm0ksw60N8",
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
  
  for(var i=0; i<favouriteSaved.length; i++){

    var queryURL = "https://www.omdbapi.com/?t=" + favouriteSaved[i].name + "&apikey=" + OMDBapiKey;
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
      //set the id of the card so that the movie title can be extracted on click later on. Put a string to begin the id so that the full name is stored
      var favouriteCard = $(`
      <div class="card favourite-card" style="width: 18rem;">
      <a href=""><img src=${response.Poster} id="fave-${response.Title}"></a>                   
        </div>
      </div>
    `); 
    $('#favourite').append(favouriteCard);
    });
  }
}

  $('#favourite').on("click", function(event){
    event.preventDefault();
    var faveToPlay = event.target.id;
    faveToPlay= faveToPlay.substring(5); //remove the fave- from the beginning of the string to return just the movie name
    getYouTube(faveToPlay);
  })
