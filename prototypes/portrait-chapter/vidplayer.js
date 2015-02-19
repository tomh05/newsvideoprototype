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

function updateIndicator() {
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


$( document ).ready(function() {
    console.log("deo");
    // Load article media
    //$.getScript('../../articles/'+ getUrlParameter("article")+'/content.js',function() {
    $('#title h1').html(title);
    $('#video source').attr('src','../../articles/'+ getUrlParameter("article")+'/footage.m4v');
    $('#video')[0].load();

    var pop = Popcorn("#video");

    console.log("creating video");
    var captionState = new CaptionState(captions);

    // define popcorn triggers - chapters and captions
    (function ( Popcorn ) {
        Popcorn.plugin( "caption", { // <---
            _setup: function( options ) {
                var target = document.getElementById( options.target );
            },

            start: function( event, options ){
                console.log("caption start");
                $( options._container ).fadeIn(); // <---
                captionState.setIndexFromVideo(options.id);
            },

            end: function( event, options ){
                console.log("caption end");
                $( options._container ).fadeOut(); // <---
            },
            _teardown: function( options ) {
                document.getElementById( options.target ) && document.getElementById( options.target ).removeChild( options._container );
            }
        });

    })( Popcorn );

    (function ( Popcorn ) {
        Popcorn.plugin( "chapter", { // <---
            _setup: function( options ) {
                var target = document.getElementById( options.target );
            },

            start: function( event, options ){
                console.log("chapter start");
                for (var i=0; i< captions.length;i++) {
                    var a = pop.caption({
                        start: captions[i].start,
                        end: captions[i].end,
                        text: captions[i].body,
                        id: i,
                        target: "caption"
                    });
                }

            },

            end: function( event, options ){
                console.log("chapter end");
                pop.pause();
            },
            _teardown: function( options ) {
                document.getElementById( options.target ) && document.getElementById( options.target ).removeChild( options._container );
            }
        });

    })( Popcorn );

    // populate chapters
    for (var i=0; i< chapters.length;i++) {
        var a = pop.chapter({
            start: chapters[i].start,
            end: chapters[i].end,
            captions: chapters[i].captions,
            id: i,
            //target: "caption"
        });
    }

    /*
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
    */



    // play the video
    pop.play();


    // clicking on caption links
    $(document).on("click","#caption a", function(e) {
        e.preventDefault();
    });

    // exit overlay
    $("#overlay").click(function(e){
        $(this).fadeOut();
        pop.play();
    });

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
});
