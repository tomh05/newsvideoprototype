$( document ).ready(function() {

    var pop = Popcorn("#video");
    var playVideo = function() {
        console.log("playing video");
        $("#paused").fadeOut();
        pop.play();
    }
    var pauseVideo = function() {
        console.log("pausing video");
        pop.pause();
        $("#paused").fadeIn();
    }

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
            var scroll = $("#timelineDiv .timelineEl:eq("+this.currentElement+")").position().left - 30;
            console.log("scrolling to "+scroll+"px");
            $("#timelineContainer").animate({scrollLeft: scroll + "px"},{duration: 200, queue: false});

            var newEl = this.timeline.getAt(n);
            if (newEl.type=="vidChapter") {
                console.log("vidChapter");
                pop.currentTime(chapters[newEl.id].start);
                playVideo();
                console.log("cueueing for "+chapters[newEl.id].end);
                pop.cue(chapters[newEl.id].end-1,function(){
                    pauseVideo();
                });
                $("#videoholder").show();
                $("#richtextholder").hide();

            } else if (newEl.type=="richText") {
                console.log("richText");
                pauseVideo();
                $("#richtextholder").html(richtexts[newEl.id].body);
                $("#richtextholder").show();
                $("#videoholder").hide();
            } 
        };
        this.nextElement = function() {
            if (this.currentElement < this.timeline.length()-1) {
                this.goToElement(currentElement+1);
            }
        };
        this.prevElement = function() {
            if (this.currentElement > 0) {
                this.goToElement(currentElement-1);
            }
        };

        this.populateTimeline = function() {
        for (var i=0;i<this.timeline.length();i++) {
            console.log("t "+this.timeline.getAt(i).type );
            if (this.timeline.getAt(i).type == "vidChapter") {
                var title = chapters[this.timeline.getAt(i).id].title;
                $("#timelineDiv").append("<div class=\"timelineEl typeVid\">"+title+"</div>");
            } else {
                var title = richtexts[this.timeline.getAt(i).id].title;
                $("#timelineDiv").append("<div class=\"timelineEl typeRich\">"+title+"</div>");
            }
        }
            $("#timelineDiv .timelineEl:eq(0)").addClass("currentEl");
        }

        this.addElementAt = function(at,type,id) {
            var title = richtexts[id].title;
            console.log("creating new div with id "+id);
            var newDiv = "<div class=\"timelineEl typeRich\" style=\"max-width:0px\">"+title+"</div>";
            $("#timelineDiv .timelineEl:eq("+this.currentElement+")").after(newDiv);
            $("#timelineDiv .timelineEl:eq("+(this.currentElement+1)+")").animate({"max-width": "200px"},{duration:400,queue:false});
            this.timeline.addElementAt(at,type,id);

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

   /*

    for (var i=0;i<chapters.length;i++) {
        $("#chapterIndicator ul").append("<li>"+chapters[i].title+"</li>");
    }
    //$("#chapterIndicator li").width( (300/chapters.length) + "px");
    $("#chapterIndicator li:eq(0)").addClass("chapterCurrent");


    var currentChapter = 0;

    */
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
                $("#caption").html(options.text);
                $("#caption a").replaceWith(function(){
                    var id = $(this).attr("href");
                    return $("<div class=\"timelineLink unclicked\" data-id=\""+id+"\" />").append($(this).contents());
                });
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

    $(document).on("tap", "#videodiv",function(event){
        playVideo();
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
 
});