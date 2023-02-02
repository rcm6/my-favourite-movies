var OMDBapiKey = "1cd5aea2";
var movieHistory = [];


$("#search-button").on("click", function(event) {
    event.preventDefault();
    var movie = $("#search-input").val().trim();
    if(movie){ 
      if(!movieHistory.includes(movie)){
          movieHistory.push(movie);
          localStorage.setItem("searchHistory", JSON.stringify(movieHistory));
      }
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
    
    var movieCard = $(`
    <div class="pl-3">
      <div class="card pl-3 pt-3 mb-3 bg-primary text-light" style="width: 12rem";>
      <h4>${response.Title}</h4>
        <div class="card-body">
          <h5>${response.Year}</h5>
          <p>${response.Plot}</p>
          <img src=${response.Poster}>
          <p>${response.Genre}</p>
          <p>${response.imdbRating}</p>                           
        </div>
      </div>
    </div>
  `);
  $('#movie-summary').append(movieCard);
});
}


function getYouTube(){
  $.ajax({
    url: "https://youtube.googleapis.com/youtube/v3/search?q=" + movie + "&key=AIzaSyDgb40pPDUgfTAJRSL_rNpputm0ksw60N8",
    method: "GET"
  }).then(function(response1) {
      console.log(response1);

      $('iframe').attr("src", "https://www.youtube.com/embed/" + response1.items[0].id.videoId);

});
}
