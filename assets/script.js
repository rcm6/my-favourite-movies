const OMDBapiKey = "1cd5aea2";

// global variables to store the movie search history to local storage

const movieHistory = window.localStorage.getItem("searchHistory")
  ? JSON.parse(window.localStorage.getItem("searchHistory"))
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
      if (movieHistory.length > 5) {
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
      console.log(response);

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
        <a href="#" class="add-to-fave btn btn-dark"
          >add to favourites</a
        >
      </div>
    </div>


    `);

      $("#movies").append(movieCard);
    });
  }
}

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
