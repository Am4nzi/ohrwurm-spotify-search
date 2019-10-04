(function() {
    var resultsContainer = $("#results-container");
    var resultsMessageContainer = $("#results-for");

    $("#submit-button").on("click", function() {
        var userInput = $("input[name='user-input']").val();
        var albumOrArtist = $("select").val();

        //Initial Request
        $.ajax({
            url: "https://elegant-croissant.glitch.me/spotify",
            method: "GET",
            data: {
                query: userInput,
                type: albumOrArtist
            },

            //If successfull do this
            success: function(response) {
                response = response.artists || response.albums;

                var resultsMessage = "";

                resultsMessage += "<p>" + "Results for " + userInput + "</p>";

                var results = buildResults(response);

                resultsMessageContainer.html(resultsMessage);
                resultsContainer.html(results);

                //Get URL for next 20 results
                nextUrl =
                    response.next &&
                    response.next.replace(
                        "api.spotify.com/v1/search",
                        "elegant-croissant.glitch.me/spotify"
                    );

                var moreButtonContainer = $("#more-button-container");
                var moreButton = "";

                moreButton += "<button id='more-button'>Show more</button>";
                moreButtonContainer.html(moreButton);

                if (response.next) {
                    if (location.search.indexOf("scroll=infinite") > -1) {
                        $("#more-button-container").empty($("#more-button"));
                        infiniteCheck();
                    } else {
                        moreButtonContainer.html(moreButton);
                    }
                }

                function infiniteCheck() {
                    var hasReachedBottom =
                        $(window).height() + $(document).scrollTop() >=
                        $(document).height() - 100;
                    if (hasReachedBottom) {
                        var userInput = $("input[name='user-input']").val();
                        var albumOrArtist = $("select").val();
                        $.ajax({
                            url: nextUrl,
                            method: "GET",
                            data: {
                                query: userInput,
                                type: albumOrArtist
                            },
                            //If successful do this
                            success: function(response) {
                                response = response.artists || response.albums;

                                var results = buildResults(response);
                                var resultsMessage = "";

                                resultsMessage +=
                                    "<p>" + "Results for " + userInput + "</p>";

                                resultsMessageContainer.html(resultsMessage);
                                resultsContainer.append(results);

                                nextUrl =
                                    response.next &&
                                    response.next.replace(
                                        "api.spotify.com/v1/search",
                                        "elegant-croissant.glitch.me/spotify"
                                    );
                                infiniteCheck();
                            }
                        });
                    } else {
                        setTimeout(infiniteCheck, 500);
                    }
                }
            }
        });
    });

    //Request after clicking on 'more button'
    $("#more-button-container").on("click", "#more-button", function() {
        var userInput = $("input[name='user-input']").val();
        var albumOrArtist = $("select").val();
        $.ajax({
            url: nextUrl,
            method: "GET",
            data: {
                query: userInput,
                type: albumOrArtist
            },
            //If successful do this
            success: function(response) {
                response = response.artists || response.albums;

                var results = buildResults(response);
                var resultsMessage = "";

                resultsMessage += "<p>" + "Results for " + userInput + "</p>";

                resultsMessageContainer.html(resultsMessage);
                resultsContainer.append(results);

                nextUrl =
                    response.next &&
                    response.next.replace(
                        "api.spotify.com/v1/search",
                        "elegant-croissant.glitch.me/spotify"
                    );

                //Removes more button if the next available amount of result is less than the offset (always 20)

                if (response.next < response.offset) {
                    $("#more-button-container").empty($("#more-button"));
                }
            }
        });
    });

    function buildResults(response) {
        var results = "";
        for (var i = 0; i < response.items.length; i++) {
            var link = response.items[i].external_urls.spotify;

            // HANDLES IMAGES
            var imageUrl =
                "C:/Users/garet/Desktop/SPICED/sassafras-code/Week-Four/Day-01/Spotify/default.jpg";
            if (response.items[i].images[0]) {
                imageUrl = response.items[i].images[0].url;
            }

            results +=
                "<div><a href=" +
                link +
                "><img class='results-images' src=" +
                imageUrl +
                "></a><p>" +
                response.items[i].name +
                "<p></div>";
        }
        return results;
    }
})();
