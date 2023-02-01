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
  
  });
  