function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) 
    {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) 
        {
            return sParameterName[1];
        }
    }
}          

$( document ).ready(function() {

    $.getScript('../../articles/'+ getUrlParameter("article")+'/content.js',function() {

        $('#title h1').html(title);
        $('#video source').attr('src','../../articles/'+ getUrlParameter("article")+'/footage.m4v');
        $('#video')[0].load();


updateIndicator = function() {
        var key = $("#caption").find('a').attr("href");
        console.log(key);
        if (key == undefined) {
        $("#contentindicator").fadeOut();
        } else {
        $("#contentindicator").fadeIn();
        }


}


        function CaptionState(capdata){
        this.currentIndex=-1;
        this.manualmode=false;

        this.advance = function(animate) {
        if (this.currentIndex >= capdata.length-1) return;
        this.manualmode = true;
        this.currentIndex +=1;
        if (!animate) {
        console.log("caption is now "+this.currentIndex);
        $("#caption").html(capdata[this.currentIndex].body);
        updateIndicator();
        } else {
        console.log("caption is now "+this.currentIndex);
        $("#caption").after('<div id="nextcaption">'+ capdata[this.currentIndex].body + '</div>');
        $("#nextcaption").animate({left: "0"},{duration: 200, queue: false});
        $("#caption").animate({left: "-300"},{duration: 200, queue: false, complete: function() {
            $("#caption").remove();
            $("#nextcaption").attr('id','caption');
            updateIndicator();
            }});
        }

        }



        this.goBack = function() {
        if (this.currentIndex<=0) return;
        this.manualmode = true;
        console.log("back")
        this.currentIndex -=1;

        console.log("caption is now "+this.currentIndex);
        $("#caption").before('<div id="prevcaption">'+ capdata[this.currentIndex].body + '</div>');
        $("#prevcaption").animate({left: "0"},{duration: 200, queue: false});
        $("#caption").animate({left: "300"},{duration: 200, queue: false, complete: function() {
                $("#caption").remove();
                $("#prevcaption").attr('id','caption');
                updateIndicator();
                }});
        }

        this.setIndexFromVideo = function(n) {
            if (n < 0 || n >= capdata.length) return;


            if (!this.manualmode){
                console.log("auto-switching to caption "+n);
                this.currentIndex = n;

                $("#caption").html(capdata[n].body);
            } else {
                // if video is back in sync with captions, continue
                if (n == this.currentIndex) {
                    console.log("returning to automatic");
                    this.manualmode = false;
                }
            }
        updateIndicator();
        }
        }

        var pop = Popcorn("#video");

        var captionState = new CaptionState(captions);

        (function ( Popcorn ) {
         Popcorn.plugin( "footnoteCustom", { // <---
_setup: function( options ) {

var target = document.getElementById( options.target );

//options._container = document.createElement( "div" );
//options._container.style.display = "none";
//options._container.innerHTML  = options.text;

//if ( !target && Popcorn.plugin.debug ) {
//throw new Error( "target container doesn't exist" );
// }
//target && target.appendChild( options._container );
},

start: function( event, options ){
$( options._container ).fadeIn(); // <---
captionState.setIndexFromVideo(options.id);
},

end: function( event, options ){
         $( options._container ).fadeOut(); // <---
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
id: i,
target: "caption"
});
}



// play the video
pop.play();


// clicking on caption links
$(document).on("click","#caption a", function(e) {
        e.preventDefault();
        /*
        var key = $(this).attr("href");
        $("#overlaycontent").html(overlays[key]);
        $("#overlay").fadeIn();
        pop.pause();
        */
        });

// exit overlay
$("#overlay").click(function(e){
        $(this).fadeOut();
        pop.play();
        });

/*
   $("#caption").swipe( {
//Generic swipe handler for all directions
swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
event.preventDefault();
console.log("swipe");
if (direction=="right"){
console.log("right");
captionState.goBack();
}
},
});
 */

// tap a caption to skip to next one
$(document).on("tap", "#caption",function(event){
        console.log("tap");
        captionState.advance(false);
        });
// swipe a caption to go back next one

//$(document).on("swiperight", "#caption",function(event){
$("#captionholder").swipe({
swipeRight:function(event, direction, distance, duration, fingerCount){
        console.log("swipe");
        captionState.goBack();
},
swipeLeft:function(event, direction, distance, duration, fingerCount){
        console.log("swipe");
        captionState.advance(true);
},
swipeUp:function(event, direction, distance, duration, fingerCount){
        console.log("up");
        var key = $("#caption").find('a').attr("href");
        console.log(key);
        if (key !== undefined) {
        console.log("it isnt undefined");
        $("#overlaycontent").html(overlays[key]);
        $("#overlay").fadeIn();
        pop.pause();
        }
},
//Default is 75px, set to 0 for demo so any distance triggers swipe
threshold:50
});

/*
//  Open an overlay by a gesture
$(document).on("swipeup", "body",function(event){
        alert("up");
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

$(document).on("swipedown", "video",function(event){

        alert("down");

        });

$(document).on("swiperight", "video",function(event){

        alert("right");

        });
*/
});
});
