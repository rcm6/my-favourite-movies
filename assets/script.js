var apiKey = "1cd5aea2";


$("#search-button").on("click", function(event) {
    event.preventDefault();
  
    // This line grabs the input from the textbox
    var movie = $("#search-input").val().trim();
  

    var queryURL = "https://www.omdbapi.com/?t=" + movie + "&apikey=" + apiKey;
 
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
       console.log(response);


    });
    $.ajax({
        url: "https://youtube.googleapis.com/youtube/v3/search?q=" + movie + "&key=AIzaSyDgb40pPDUgfTAJRSL_rNpputm0ksw60N8",
        method: "GET"
      }).then(function(response1) {
          console.log(response1);

          $('iframe').attr("src", "https://www.youtube.com/embed/" + response1.items[1].id.videoId);

  });
})