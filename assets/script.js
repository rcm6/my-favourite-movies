var apiKey = "1cd5aea2";
var favourites = [];

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

    // Display the movie title, plot and save btn in summary container
    document.querySelector("#movie-title").innerText = response.Title;
    document.querySelector("#description").innerText = response.Plot;
    document.querySelector("#save-favourite-btn").classList.remove("d-none");

    // Function to store values in localStorage
    function store() {
      localStorage.setItem("storedTitle", response.Title);
      localStorage.setItem("storedPoster", response.Poster);
    }

    $("#save-favourite-btn").on("click", store);
  });

  $.ajax({
    url:
      "https://youtube.googleapis.com/youtube/v3/search?q=" +
      movie +
      "&key=AIzaSyDgb40pPDUgfTAJRSL_rNpputm0ksw60N8",
    method: "GET",
  }).then(function (response1) {
    console.log(response1);

    $("iframe").attr(
      "src",
      "https://www.youtube.com/embed/" + response1.items[0].id.videoId
    );
  });
});

// Function to display favourite movies in favourites modal from localStorage
function showFavourite() {
  if (localStorage.length === 0) {
    document.querySelector("#favourite-msg").innerText = "No Favourite Movies";
  } else {
    var paragraph = document.createElement("p");
    paragraph.innerText = localStorage.getItem("storedTitle");
    var poster = document.createElement("img");
    poster.setAttribute("src", localStorage.getItem("storedPoster"));
    $("#favourite").append(paragraph);
    $("#favourite").append(poster);
  }
}

$("#show-fav-btn").on("click", showFavourite);
