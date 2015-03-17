$( document ).ready(function() {
 
    function preload(arrayOfImages) {
    $(arrayOfImages).each(function(){
        $('<img/>')[0].src = this;
    });
}

// Usage:

preload([
    'img/bbc.png',
    'img/article.png',
    'img/comment.png',
    'img/video.png',
    'img/location.png',
    'img/image.png',
]);
    var replayButton=false;

    var pop = Popcorn("#video");
    var playVideo = function() {
        console.log("playing video");
        $("#paused").fadeOut();
        pop.play();
    }
    var pauseVideo = function(replay) {
        console.log("pausing video");
        pop.pause();
        replayButton = replay;
        if (replay) { //show a replay arrow instead
            $("#paused").html("&#8635;");
        } else {
            $("#paused").html("&#9658;");
        }
        $("#paused").fadeIn();
    }

    // holds data for timeline
    var Timeline = function(){
        this.list = [];
        // list can be objects type vidChapter or richText
        for (var i=0;i<chapters.length;i++) {
            this.list.push({"type":"vidChapter","id":i});
        }
        this.addElementAt = function(at,type,id) {
            this.list.splice(at,0,{"type":type,"id":id});
        };
        this.getAt = function(at) {
            return this.list[at];
        }
        this.length = function() {
            return this.list.length;
        }
        // find if an element is already in timeline
        this.findID = function(_id) {
            for (var i=0;i<this.list.length;i++) {
                if (this.list[i].id==_id) return true;
            }
            return false;
        }
    };

    // view controller
    var Controller = function(){
        this.timeline = new Timeline();
        this.currentElement = 0;

        // jump to element n in timeline
        this.goToElement = function(n) {
            this.currentElement = n;

            $("#timelineDiv .timelineEl").removeClass("currentEl");
            $("#timelineDiv .timelineEl:eq("+this.currentElement+")").addClass("currentEl");

            console.log("current el is "+this.currentElement);
            $("#timelineDiv .bg").width("0%");
            var scroll = $("#timelineDiv .timelineEl:eq("+this.currentElement+")").position().left - 30;
            $("#timelineContainer").animate({scrollLeft: scroll + "px"},{duration: 200, queue: false});

            var newEl = this.timeline.getAt(n);
            if (newEl.type=="vidChapter") {
                pop.currentTime(chapters[newEl.id].start);
                playVideo();
                $("#videoholder").show();
                $("#richtextholder").hide();

            } else if (newEl.type=="richText") {
                pauseVideo(false);
                $("#richtextholder").html(richtexts[newEl.id].body);
                $("#richtextholder").show();
                $("#videoholder").hide();
            } 
        };
        // pause the video at the end of each chapter
        this.endChapter = function(chapterID) {
            //only pause if video reached natural end
            if (chapterID == this.timeline.getAt(this.currentElement).id) { 
                    pauseVideo(true);
            }
        }
        // go to next timeline element
        this.nextElement = function() {
            if (this.currentElement < this.timeline.length()-1) {
                this.goToElement(this.currentElement+1);
            }
        };
        // go to previous timeline element
        this.prevElement = function() {
            if (this.currentElement > 0) {
                this.goToElement(this.currentElement-1);
            }
        };

        // create div tags in timeline bar from the timeline array.
        this.populateTimeline = function() {
            for (var i=0;i<this.timeline.length();i++) {
                this.createTimelineElement(i,false);
            }
            $("#timelineDiv .timelineEl:eq(0)").addClass("currentEl");
        }

        // Put a new div on page
        this.createTimelineElement = function(i, isAnimated) {

                console.log("t "+this.timeline.getAt(i).type );
                var title, type, icon;
                if (this.timeline.getAt(i).type == "vidChapter") {
                    title = chapters[this.timeline.getAt(i).id].title;
                    type = "typeVid";
                    icon = "img/video.png";
                } else {
                    title = richtexts[this.timeline.getAt(i).id].title;
                    type = "typeRich";
                    var iconType = richtexts[this.timeline.getAt(i).id].type;
                    if      (iconType=="comment") icon = "img/comment.png";
                    else if (iconType=="text") icon = "img/article.png";
                    else if (iconType=="location") icon = "img/location.png";
                    else if (iconType=="image") icon = "img/image.png";
                    else icon = "img/article.png";
                }
                var animateStyle = "";
                if (isAnimated) animateStyle = "max-width:0px";
                var newDiv = "<div class=\"timelineEl "+ type +"\" style=\""+animateStyle+"\">"+
                    "<div class=\"bg\"></div>" +
                    "<div class=\"con\">" +
                    "<img src=\""+icon+"\"/>"
                    +title+"</div></div>";
                $("#timelineDiv").append(newDiv);

                if (isAnimated) {
            $("#timelineDiv .timelineEl:last-child").animate({"max-width": "500px"},{duration:400,queue:false});
                }

        }

        // insert a new element into the timeline
        this.addElementAt = function(at,type,id) {
            var title = richtexts[id].title;
            console.log("creating new div with id "+id);
            var newDiv = "<div class=\"timelineEl typeRich\" style=\"max-width:0px\">"+title+"</div>";
            var newLocation = this.timeline.length()-1;

            this.timeline.addElementAt(newLocation+1,type,id);
            this.createTimelineElement(newLocation+1,true);

            // only display the "added" box if new timeline element is off the edge of the page.
            var pos = $("#timelineDiv .timelineEl:eq("+(newLocation+1)+")").position().left;
            var scroll = $("#timelineContainer").scrollLeft();
            var width = 720-20;
            if (pos-scroll > width) {
            $("#addedIndicator").animate({"right":"0px"},{duration:300});
            $("#addedIndicator").delay(1200);
            $("#addedIndicator").animate({"right":"-200px"},{duration:300});
            }

        }

        // show video progress in a timeline bar element
        this.updateTimelineBackground = function() {
            var curEl = this.timeline.getAt(this.currentElement);
            if (curEl.type=="vidChapter") {
                var t = pop.currentTime();
                var s = chapters[curEl.id].start;
                var e = chapters[curEl.id].end;
                var percent = 100 * (t-s) / (e-s);
                if (percent>100) percent=100;
            $("#timelineDiv .timelineEl:eq("+this.currentElement+") .bg").width(percent+"%");
            if (percent>50){
                $(".typeVid.currentEl").addClass("filled");
            } else {
                $(".typeVid.currentEl").removeClass("filled");
            }
            }
        }
        // go back to start of chapter and play from there
        this.restartVideoChapter = function() {
            var el = this.timeline.getAt(this.currentElement);
            if (el.type=="vidChapter") {
            pop.currentTime(chapters[el.id].start);
            playVideo();
            }
        }
    };


    var controller = new Controller();
    console.log(controller);
    //test
    controller.populateTimeline();
    //controller.goToElement(0);

    //tap timeline element to jump to it
    $(document).on("tap", "#timelineDiv .timelineEl",function(event){
        console.log("tap id "+$(this).attr("data-id"));
        //controller.goToElement($(this).attr("data-id"));
        console.log($("#timelineDiv").index(this));
        controller.goToElement($(".timelineEl").index(this));
    });

    $(document).on("tap", ".timelineLink.unclicked",function(event){
        $(this).removeClass("unclicked");
        console.log("timeline link id "+$(this).attr("data-id"));
        controller.addElementAt(controller.currentElement+1,"richText",$(this).attr("data-id"));
    });


    $("#videoholder, #richtextholder").swipe({
        swipeRight:function(event, direction, distance, duration, fingerCount){
            console.log("swipe right video");
            //prevChapter();
            controller.prevElement();
        },
        swipeLeft:function(event, direction, distance, duration, fingerCount){
            console.log("swipe left video");
            //nextChapter();
            controller.nextElement();
        },
        threshold:50
    });

    //update background on video
    pop.on("timeupdate",function() {
        controller.updateTimelineBackground();
    });

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

    function nextChapter() {
        console.log("next chapter");
        if (currentChapter < chapters.length -1){
            $("#caption").after('<div id="nextcaption">'+ chapters[currentChapter+1].captions[0].body+ '</div>');
            $("#nextcaption").animate({left: "0"},{duration: 200, queue: false});
            $("#caption").animate({left: "-300"},{duration: 200, queue: false, complete: function() {
                $("#caption").remove();
                $("#nextcaption").attr('id','caption');
                var video = document.getElementsByTagName("video")[0];
                video.currentTime = chapters[currentChapter+1].start
            }});
        }
    }

    function prevChapter() {
        console.log("prev chapter");
        console.log("current chapter" + currentChapter);
        if (currentChapter > 0){
            $("#caption").before('<div id="prevcaption">'+chapters[currentChapter-1].captions[0].body+ '</div>');
            console.log("body " + chapters[currentChapter-1].captions[0].body);
            $("#prevcaption").animate({left: "0"},{duration: 200, queue: false});
            $("#caption").animate({left: "300"},{duration: 200, queue: false, complete: function() {
                $("#caption").remove();
                $("#prevcaption").attr('id','caption');
                var video = document.getElementsByTagName("video")[0];
                video.currentTime = chapters[currentChapter-1].start;
            }});
        }
    }
    $('#title h1').html(title);


    console.log("creating video");

    // define popcorn triggers - chapters and captions
    (function ( Popcorn ) {
        Popcorn.plugin( "caption", { // <---
            _setup: function( options ) {
                var target = document.getElementById( options.target );
            },
            start: function( event, options ){
                //console.log("caption start");
                //$( options._container ).fadeIn(); // <---
                //console.log(options);
                if (controller.currentElement == options.chapter) {
                    $("#caption").html(options.text);
                }

            },
            end: function( event, options ){
                //console.log("caption end");
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
                console.log("chapter start "+options.id + " @ "+pop.currentTime() +"s" );

                    $("#links").html("");
                $.each(options.links,function(i,linkID){
                    // check if it should be clickable or not

                    var icon;
                    var iconType = richtexts[linkID].type;
                    if      (iconType=="comment") icon = "img/comment.png";
                    else if (iconType=="text") icon = "img/article.png";
                    else if (iconType=="location") icon = "img/location.png";
                    else if (iconType=="image") icon = "img/image.png";
                    else icon = "img/article.png";

                    var imgCode = "<img src=\""+icon+"\"/>";
                    var unclickedClass="";

                    if (controller.timeline.findID(linkID)==false) unclickedClass = "unclicked";
                    var newDiv = "<div class=\"timelineLink "+unclickedClass+"\" data-id=\""+linkID+"\">"+ imgCode + richtexts[linkID].title +"</>";

                    /*
                    if (controller.timeline.findID(linkID)==true) {
                    $("#links").append("<div class=\"timelineLink\" data-id=\""+linkID+"\">"+richtexts[linkID].title+"</>");
                    } else {
                    $("#links").append("<div class=\"timelineLink unclicked\" data-id=\""+linkID+"\">" + richtexts[linkID].title +"</>");
                    }
                    */

                    $("#links").append(newDiv);
                });
            },
            end: function( event, options ){
                console.log("chapter end "+options.id+ " @ "+pop.currentTime() +"s" );
                if (pop.currentTime()>options.start) {
                controller.endChapter(options.id);
                }
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
            links: chap.links,
            id: i,
        });
        // populate captions
        var caps = chapters[i].captions;
        for (var j=0; j< caps.length;j++) {
            var a = pop.caption({
                start: parseInt(chapters[i].start,10) + parseInt(caps[j].start,10),
                end: parseInt(chapters[i].start,10) + parseInt(caps[j].end,10),
                text: caps[j].body,
                chapter:i,
                id: j,
                target: "caption"
            });
        }
    };

    // play the video
    pop.play();

    $(document).on("tap", "#videodiv",function(event){
        if (replayButton) {
            controller.restartVideoChapter();
        } else {
        playVideo();
        }
        
    });

    var tappedToLoad=false;
    $(document).on("tap", "#playblocker",function(event){
        pop.play();
        $(this).html("loading video...");
        tappedToLoad=true;
    });

    $('video').on('loadeddata',function(){
        $("#playblocker").fadeOut();
        controller.goToElement(0);
    });

    //clicking captions
        $(document).on("click","#caption a", function(e) {
            e.preventDefault();
            var key = $(this).attr("href");
            console.log("clicked"+help[key].body);
            pauseVideo();
            $("#container").animate({ top: "-600px" }, 400);
            $("#help").html(help[key].body);
            $("#help").fadeIn();
        });

    $("#help").swipe({
        swipeDown:function(event, direction, distance, duration, fingerCount){
            $("#container").animate({ top: "0px" }, 400);
            $("#help").fadeOut(function(){
            $("#help").html("");
            playVideo();
            });
        },
        threshold:50
    });

});
