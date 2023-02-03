var apiKey = "1cd5aea2";

// query selecting elements

const moviesEl = $("#movies");

// creating an array of objects here to test storing data from api

const movieData = [
  {
    id: 1,
    title: "The Matrix",
    year: "1999",
    runtime: "136 min",
    genre: "Action, Sci-Fi",
    director: "Lana Wachowski, Lilly Wachowski",
    actor: "Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss",
    plot: "When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth--the life he knows is the elaborate deception of an evil cyber-intelligence.",
    metascore: "73",
    imdbRating: "8.7",
    poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    id: 2,
    title: "The Truman Show",
    year: "1998",
    runtime: "103 min",
    genre: "Comedy, Drama",
    director: "Peter Weir",
    actor: "Jim Carrey, Ed Harris, Laura Linney",
    plot: "An insurance salesman discovers his whole life is actually a reality TV show.",
    metascore: "90",
    imdbRating: "8.2",
    poster:
      "https://m.media-amazon.com/images/M/MV5BMDIzODcyY2EtMmY2MC00ZWVlLTgwMzAtMjQwOWUyNmJjNTYyXkEyXkFqcGdeQXVyNDk3NzU2MTQ@._V1_SX300.jpg",
  },
];

$("#search-button").on("click", function (event) {
  event.preventDefault();

  // This line grabs the input from the textbox
  var movie = $("#search-input").val().trim();

  var queryURL = "https://www.omdbapi.com/?t=" + movie + "&apikey=" + apiKey;

  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    console.log(response);
  });
  $.ajax({
    url: "https://youtube.googleapis.com/youtube/v3/search?q=Terminator&key=AIzaSyDgb40pPDUgfTAJRSL_rNpputm0ksw60N8",
    method: "GET",
  }).then(function (response1) {
    console.log(response1);

    $("iframe").attr(
      "src",
      "https://www.youtube.com/embed/" + response1.items[1].id.videoId
    );
  });
});

// creating a function to generate a movie card

const renderMovieCard = () => {
  // emptying child elements from movies div container

  moviesEl.empty();

  // looping through the array of objects to extract the movie data to variables
  // and then generate the movie card elements inside of movie summary div container

  for (let i = 0; i < movieData.length; i++) {
    const {
      id,
      title,
      year,
      runtime,
      genre,
      director,
      actor,
      plot,
      metascore,
      imdbRating,
      poster,
    } = movieData[i];

    console.log(
      id,
      title,
      year,
      runtime,
      genre,
      director,
      actor,
      plot,
      metascore,
      imdbRating,
      poster
    );

    // creating the markup to appear in the movies div container

    const markup = `
    

    <div class="col-4 col-lg-3 col-xl-2 p-1">
    <img src="${poster}" alt="movie poster" class="image-fluid" />
    <h2 class="movie-title">${title}</h2>
    <h2 class="release-date">${year}</h2>
    <div class="movie-card-summary">
      <p class="movie-plot">
          ${plot}
      </p>
      <div class="youtube-links">
        <h2 class="header-youtube">Click to search on Youtube</h2>
        <div class="movie-card-links">
          <ul class="movie-card-list">
            <li class="movie-list-items">
              <a href="#">watch a trailer</a>
            </li>
            <li class="movie-list-items">
              <a href="#">watch a review</a>
            </li>
            <li class="movie-list-items">
              <a href="#">find actors appearing in this movie</a>
            </li>
            <li class="movie-list-items">
              <a href="#">find soundtracks used in this movie</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="fave-link">
        <a href="#" class="add-to-fave">add to favourites</a>
      </div>
    </div>
  </div>
      
     
    `;

    // appending to the main movies div container
    moviesEl.append(markup);
  }
};

renderMovieCard();
