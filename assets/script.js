var OMDBapiKey = "1cd5aea2";
var movieHistory = [];


$("#search-button").on("click", function(event) {
    event.preventDefault();
    var movie = $("#search-input").val().trim();
    if(movie){ 
      getMovieInfo(movie);
    }
    else{
      alert("Nothing in search box");
     }
  });
   


function getMovieInfo(movie){

  var queryURL = "https://www.omdbapi.com/?t=" + movie + "&apikey=" + OMDBapiKey;

  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    console.log(response);
    var movieObject = {
      name: movie,
      id: response.imdbID
    }
   
    if (movieHistory.filter(e => e.name === movie).length === 0){
      movieHistory.push(movieObject);
      if(movieHistory.length >5){
        movieHistory.shift();
      }
      localStorage.setItem("searchHistory", JSON.stringify(movieHistory));
      console.log(movieHistory);
    }
    

    var movieCard = $(`
      <div class="card" style="width: 18rem;">
      <img class="card-img-top" src=${response.Poster} alt="Card image cap">
        <div class="card-body">
        <h4>${response.Title}</h4>
          <h5>${response.Year}</h5>
          <p>${response.Plot}</p>
          <p>Genre: ${response.Genre}</p>
          <p>IMDB Rating: ${response.imdbRating}</p>      
          <a href="#" class="btn btn-dark favourite">Add to Favourites</a>                     
        </div>
      </div>
    `);

    $('#movie-summary').append(movieCard);
  });
}

/*function getYouTube(){
  $.ajax({
    url: "https://youtube.googleapis.com/youtube/v3/search?q=" + movie + "&key=AIzaSyDgb40pPDUgfTAJRSL_rNpputm0ksw60N8",
    method: "GET"
  }).then(function(response1) {
      console.log(response1);

      $('iframe').attr("src", "https://www.youtube.com/embed/" + response1.items[0].id.videoId);

});
}*/
