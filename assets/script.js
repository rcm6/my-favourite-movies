// Api keys
OMDB_API_KEY = "1cd5aea2";
YOUTUBE_API_KEY = "AIzaSyDgb40pPDUgfTAJRSL_rNpputm0ksw60N8";

// global variables to store the movie search history and favourites history to local storage

let movieHistory = window.localStorage.getItem("searchHistory")
  ? JSON.parse(window.localStorage.getItem("searchHistory"))
  : [];

// stores the string value from the form input

var movie = "";

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
    if (response.imdbID) {
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
    } else {
      $("#modal-2").modal("show");
      //empties you tube div
      $("#you-tube").empty();
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

      const { Poster, Title, Year, Plot, imdbID } = response;

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
          <a href="#" class="trailer" id="${Title}" data-imdb="${imdbID}">watch a trailer</a>
        </li>
        <li class="movie-list-items">
          <a href="#"  class="review" id="${Title}" data-imdb="${imdbID}">watch a review</a>
        </li>
        <li class="movie-list-items">
          <a href="#" class="actors" id="${Title}" data-imdb="${imdbID}">about the actors</a>
        </li>
        <li class="movie-list-items">
          <a href="#" class="soundtracks" id="${Title}" data-imdb="${imdbID}">movie soundtracks</a>
        </li>
          </ul>
        </div>
      </div>
      <div class="fave-link">
        <a href="#" class="add-to-fave btn btn-dark" id="${Title}" data-imdb="${imdbID}">add to favourites</a>
      </div>
    </div>
    `);

      $(movieCard).appendTo("#movies");

      $("#poster-background").remove(); // remove movie poster background image from

      // invoking this function here; so that the event listener on all the links will be listened on
      searchYoutube();

      // invoking the function because once movie card is rendered can attach the event listener to add to fave button

      addTofave();
    });
  }
}

// this function takes in the response object from getMovieInfo and then checks if there is a match within movieHistory object in local storage and will then create a new local storage titled favourites

function addTofave() {
  // attaching an event listener to the add to favourites button

  $(".add-to-fave").on("click", function (event) {
    event.preventDefault();

    console.log("add to fave button clicked");

    let movieTitle = event.target.id;
    movieTitle = movieTitle.toLowerCase();

    console.log("movie title: ", movieTitle);
    const imdbID = $(this).attr("data-imdb");

    const currentFavouriteList = window.localStorage.getItem("favourites")
      ? JSON.parse(window.localStorage.getItem("favourites"))
      : [];

    console.log("currentFavouritesList array: ", currentFavouriteList);

    // if there is no current movie then save to local storage
    if (currentFavouriteList.length === 0) {
      console.log("favourites is empty adding to favourites");
      const movieObject = {
        name: movieTitle,
        imdbId: imdbID,
      };

      // pushing to array
      currentFavouriteList.push(movieObject);
      // and saving to local storage
      window.localStorage.setItem(
        "favourites",
        JSON.stringify(currentFavouriteList)
      );
    } else {
      for (let i = 0; i < currentFavouriteList.length; i++) {
        const movies = currentFavouriteList[i];

        console.log("favourites is not empty");
        console.log(
          "logging all of favourites array here: ",
          currentFavouriteList
        );
        console.log("movies in favourites: ", movies);

        // this returns a boolean value of true if exists or false if does not
        const title = movies["name"].includes(movieTitle);

        console.log(currentFavouriteList[i]["name"]);
        console.log("Does the title match the title clicked on: ", title);

        // if the title does not exist: i.e is false we translate to true here
        if (!title) {
          // the above condition is not enough to test if the title exists in all of the array
          // we need to loop through the array and return another boolean value
          const exists =
            currentFavouriteList.findIndex(
              (element) => element.name === movieTitle
            ) > -1;

          console.log("But does title exist? : ", exists);

          // if the above is false we need to translate to true to push the object and store to local storage as favourites, if the above is true then the code below will not execute
          if (!exists) {
            const movieObject = {
              name: movieTitle,
              imdbID: imdbID,
            };

            // pushing the object to the array
            currentFavouriteList.push(movieObject);

            // and then saving this to local storage

            window.localStorage.setItem(
              "favourites",
              JSON.stringify(currentFavouriteList)
            );
          }
        }
      }
    }
  });
}

// function to listens to search on youtube links within movie card

function searchYoutube() {
  // event listener on watch a trailer link
  $(".trailer").on("click", function (event) {
    event.preventDefault();

    console.log("trailer link clicked");

    // lets get the target clicked on

    let movieTitle = event.target.id.toLowerCase();
    extra = "trailer";

    console.log(movieTitle);

    if (movieTitle) {
      getYouTube(movieTitle, extra);
    }
  });

  // event listener on watch a review link

  $(".review").on("click", function (event) {
    event.preventDefault();

    console.log("watch review clicked");

    let movieTitle = event.target.id.toLowerCase();
    extra = "review";

    console.log(movieTitle);

    if (movieTitle) {
      getYouTube(movieTitle, extra);
    }
  });

  // event listener on about the actors link

  $(".actors").on("click", function (event) {
    event.preventDefault();

    console.log("about the actors link clicked");

    let movieTitle = event.target.id.toLowerCase();
    extra = "actors";

    console.log(movieTitle);

    if (movieTitle) {
      getYouTube(movieTitle, extra);
    }
  });

  // event listener on movie soundtracks link

  $(".soundtracks").on("click", function (event) {
    event.preventDefault();

    console.log("soundtrack link clicked");

    let movieTitle = event.target.id.toLowerCase();
    extra = "soundtracks";

    console.log(movieTitle);

    if (movieTitle) {
      getYouTube(movieTitle, extra);
    }
  });
}

// the api for the youtube api

function getYouTube(movie, extra) {
  console.log(movie, extra);
  $.ajax({
    url:
      "https://youtube.googleapis.com/youtube/v3/search?q=" +
      movie +
      "+movie+" +
      extra +
      "&embeddable=true&maxResults=6&key=" +
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

$("#show-fav-btn").on("click", function (event) {
  event.preventDefault();
  renderFavourites();
});

function renderFavourites() {
  $("#favourite").empty();
  var favouriteSaved = JSON.parse(localStorage.getItem("favourites")) || [];

  if (favouriteSaved.length === 0) {
    var noFaves = $("<h1>No favourites saved</h1>");
    $("#favourite").append(noFaves);
  }

  for (var i = 0; i < favouriteSaved.length; i++) {
    var queryURL =
      "https://www.omdbapi.com/?t=" +
      favouriteSaved[i].name +
      "&apikey=" +
      OMDB_API_KEY;
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      //set the id of the card so that the movie title can be extracted on click later on. Put a string to begin the id so that the full name is stored
      var favouriteCard = $(`
      <div class="card favourite-card col-3">
      <a href="#"><img src="${response.Poster}" id="${response.Title}" data-dismiss="modal" ></a>                   
      </div>
    `);
      $("#favourite").append(favouriteCard);
    });
  }
}

$("#favourite").on("click", function (event) {
  event.preventDefault();
  //$('#modal-1').modal("hide");
  var faveToPlay = event.target.id;
  console.log(faveToPlay);
  renderMainCard(faveToPlay);
});

function renderMainCard(movie) {
  $("#main-card").empty();
  const queryURL =
    "https://www.omdbapi.com/?t=" + movie + "&apikey=" + OMDB_API_KEY;
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    var isValidMovie = response.imdbID;
    if (!isValidMovie) {
      return;
    }

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
            <a href="#" class="trailer" id="${response.Title}" data-dismiss="modal">watch a trailer</a>
          </li>
          <li class="movie-list-items">
            <a href="#" class="review" id="${response.Title}" data-dismiss="modal">watch a review</a>
          </li>
          <li class="movie-list-items">
            <a href="#" class="actors" id="${response.Title}"data-dismiss="modal">about the actors</a>
          </li>
          <li class="movie-list-items">
            <a href="#" class="soundtracks" id="${response.Title}" data-dismiss="modal">movie soundtracks</a>
          </li>
        </ul>
      </div>
    </div>
  </div>

    `);
    $("#main-card").append(movieCard);
    $("#modal-3").modal("show");

    // invoking this function here; so that the event listener on all the links will be listened on
    searchYoutube();
  });
}
