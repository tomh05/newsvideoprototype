
$( document ).ready(function() {

openOverlay = function(){
        var key = $("#caption div:visible").find('a').attr("href");
        console.log(key);
        if (key !== undefined) {
        console.log("it isnt undefined");
        $("#overlaycontent").html(overlays[key]);
        $("#overlay").fadeIn();
        pop.pause();
        }

}

updateIndicator = function() {
        var key = $("#caption div:visible").find('a').attr("href");
        console.log(key);
        if (key == undefined) {
        $("#contentindicator").fadeOut();
        } else {
        $("#contentindicator").fadeIn();
        }


}



$(document).on("tap", "body",function(event){
        if (document.body.requestFullscreen) {
        document.body.requestFullscreen();
        } else if (document.body.msRequestFullscreen) {
        document.body.msRequestFullscreen();
        }else if (document.body.mozRequestFullScreen) {
        document.body.mozRequestFullScreen();
        }else if (document.body.webkitRequestFullscreen) {
        document.body.webkitRequestFullscreen();
        }
        console.log("fs");
        $(document).off("tap", "body");
});



    var pop = Popcorn("#video");

    (function ( Popcorn ) {
        Popcorn.plugin( "footnoteCustom", { // <---
            _setup: function( options ) {

                var target = document.getElementById( options.target );

                options._container = document.createElement( "div" );
                options._container.style.display = "none";
                options._container.innerHTML  = options.text;

                if ( !target && Popcorn.plugin.debug ) {
                    throw new Error( "target container doesn't exist" );
                }
                target && target.appendChild( options._container );
            },

            start: function( event, options ){
                $( options._container ).show(); // <---
                updateIndicator();

            },

            end: function( event, options ){
                $( options._container ).hide(); // <---
                updateIndicator();
            },
            _teardown: function( options ) {
                document.getElementById( options.target ) && document.getElementById( options.target ).removeChild( options._container );
            }
        });

})( Popcorn );

    // populate captions
    for (var i=0; i< captions.length;i++) {
        var a = pop.footnoteCustom({
            start: captions[i].start,
            end: captions[i].end,
            text: captions[i].body,
            target: "caption"
        });
    }

    // play the video
    pop.play();


    // clicking on caption links
    $(document).on("click","#caption a", function(e) {
        e.preventDefault();
        // do nothing - gesture instead
        /*
        var key = $(this).attr("href");
        $("#overlaycontent").html(overlays[key]);
        $("#overlay").fadeIn();
        pop.pause();
        */
    });

    // clicking on caption links
$(document).on("click","#contentindicator", function(e) {
        openOverlay();
    });

//  Open an overlay by a gesture
$("#videodiv").swipe({
swipeUp:function(event, direction, distance, duration, fingerCount){
        console.log("up");
        openOverlay();
},
//Default is 75px, set to 0 for demo so any distance triggers swipe
threshold:50
});



    // exit overlay
    $("#overlay").click(function(e){
        $(this).fadeOut();
        pop.play();
    });

});


