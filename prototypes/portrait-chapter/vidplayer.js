$( document ).ready(function() {
    for (var i=0;i<chapters.length;i++) {
        $("#chapterIndicator ul").append("<li></li>");
    }
    $("#chapterIndicator li").width( (300/chapters.length) + "px");
    $("#chapterIndicator li:eq(0)").addClass("chapterCurrent");


    var currentChapter = 0;
    function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1);
        var sURLVariables = sPageURL.split('&');
        for (var i = 0; i < sURLVariables.length; i++) {
            var sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] == sParam) {
                return sParameterName[1];
            }
        }
    }          

    // "swipe up to see more" indicator toggling
    function updateIndicator() {
        var key = $("#caption").find('a').attr("href");
        console.log(key);
        if (key == undefined) {
            //$("#contentindicator").fadeOut();
        } else {
            //$("#contentindicator").fadeIn();
        }
    }

    function nextChapter() {
        console.log("next chapter");
        if (currentChapter < chapters.length -1){
            //$("#chapterIndicator li:eq("+currentChapter+")").removeClass("chapterCurrent");
            //currentChapter ++;
            //$("#chapterIndicator li:eq("+currentChapter+")").addClass("chapterCurrent");
            //pop.currentTime(chapters[currentChapter].start);
;

            $("#caption").after('<div id="nextcaption">'+ chapters[currentChapter+1].captions[0].body+ '</div>');
            $("#nextcaption").animate({left: "0"},{duration: 200, queue: false});
            $("#caption").animate({left: "-300"},{duration: 200, queue: false, complete: function() {
                $("#caption").remove();
                $("#nextcaption").attr('id','caption');
                updateIndicator();
            var video = document.getElementsByTagName("video")[0];
            video.currentTime = chapters[currentChapter+1].start
            }});



        }
    }

    function prevChapter() {
        console.log("prev chapter");
        console.log("current chapter" + currentChapter);
        if (currentChapter > 0){
            //$("#chapterIndicator li:eq("+currentChapter+")").removeClass("chapterCurrent");
            //currentChapter --;
            //$("#chapterIndicator li:eq("+currentChapter+")").addClass("chapterCurrent");
            //pop.currentTime(chapters[currentChapter].start);
            $("#caption").before('<div id="prevcaption">'+chapters[currentChapter-1].captions[0].body+ '</div>');
            console.log("body " + chapters[currentChapter-1].captions[0].body);
            $("#prevcaption").animate({left: "0"},{duration: 200, queue: false});
            $("#caption").animate({left: "300"},{duration: 200, queue: false, complete: function() {
                $("#caption").remove();
                $("#prevcaption").attr('id','caption');
                updateIndicator();
            var video = document.getElementsByTagName("video")[0];
            video.currentTime = chapters[currentChapter-1].start;


            }});

        }
    }


    // Load article media
    //$.getScript('../../articles/'+ getUrlParameter("article")+'/content.js',function() {
    $('#title h1').html(title);
    //$('#video source').attr('src','../../articles/'+ getUrlParameter("article")+'/footage.m4v');
    //$('#video')[0].load();

    var pop = Popcorn("#video");

    console.log("creating video");
    //var captionState = new CaptionState(captions);

    // define popcorn triggers - chapters and captions
    (function ( Popcorn ) {
        Popcorn.plugin( "caption", { // <---
            _setup: function( options ) {
                var target = document.getElementById( options.target );
            },
            start: function( event, options ){
                console.log("caption start");
                //$( options._container ).fadeIn(); // <---
                //captionState.setIndexFromVideo(options.id);
                console.log(options);
                $("#caption").html(options.text);
            },
            end: function( event, options ){
                console.log("caption end");
                //$( options._container ).fadeOut(); // <---
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
            currentChapter = options.id;
            $("#chapterIndicator li").removeClass("chapterCurrent");
            $("#chapterIndicator li:eq("+options.id+")").addClass("chapterCurrent");

            },
            end: function( event, options ){
                console.log("chapter end");
            },
            _teardown: function( options ) {
                document.getElementById( options.target ) && document.getElementById( options.target ).removeChild( options._container );
            }
        });
    })( Popcorn );

    // populate chapters
    console.log(chapters);
    for (var i=0; i< chapters.length;i++) {
        console.log("creating chapter");
        var chap = chapters[i];
        var a = pop.chapter({
            start: chap.start,
            end: chap.end,
            //captions: chap.captions,
            id: i,
        });
        // populate captions
        var caps = chapters[i].captions;
        for (var j=0; j< caps.length;j++) {
            var a = pop.caption({
                start: parseInt(chapters[i].start,10) + parseInt(caps[j].start,10),
                end: parseInt(chapters[i].start,10) + parseInt(caps[j].end,10),
                text: caps[j].body,
                id: j,
                target: "caption"
            });
        }
    };

    // play the video
    pop.play();

    // clicking on caption links
    $(document).on("click","#caption a", function(e) {
        e.preventDefault();
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

    // tap a caption to skip to next one
    /*
       $(document).on("tap", "#caption",function(event){
       console.log("tap");
       captionState.advance(false);
       });
       */
    /*
    // swipe a caption to go back next one
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
    */
    $("#videodiv").swipe({
        swipeRight:function(event, direction, distance, duration, fingerCount){
            console.log("swipe right video");
            prevChapter();
        },
    swipeLeft:function(event, direction, distance, duration, fingerCount){
        console.log("swipe left video");
        nextChapter();
    },
    threshold:50
    });

    $(document).on("tap", "#playblocker",function(event){
        pop.play();
        $(this).html("loading video...");
    });

    $('video').on('loadeddata',function(){
        $("#playblocker").fadeOut();
    });




    $(document).on("tap", "#videodiv",function(event){
        pop.play();

    });

});
