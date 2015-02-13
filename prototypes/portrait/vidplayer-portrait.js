
$( document ).ready(function() {

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
            },

            end: function( event, options ){
                $( options._container ).hide(); // <---
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
        var key = $(this).attr("href");
        $("#overlaycontent").html(overlays[key]);
        $("#overlay").fadeIn();
        pop.pause();
    });

//  Open an overlay by a gesture
$(document).on("swipeleft", "#caption",function(event){
    console.log("up");
    var key = $("#caption").find('a').attr("href");
    console.log(key);
    if (key !== undefined) {
        console.log("it isnt undefined");
        $("#overlaycontent").html(overlays[key]);
        $("#overlay").fadeIn();
        pop.pause();
    }
});



    // exit overlay
    $("#overlay").click(function(e){
        $(this).fadeOut();
        pop.play();
    });

});


