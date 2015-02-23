//** getUrlParameter()
//** return a variable set in URL
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
//
//** transitionBlock():
//** Animate a movement to a new tile
function transitionBlock(id,direction) {
    console.log("transitioning " + direction + " to id " + id);
    var foundElement = $.grep(atoms, function(e) { return e.id == id });
    var newContent = foundElement[0].body;

    // set start/end keyframes
    if (direction=="down") {
        current_tileStart =     {top:"0px"};
        current_tileEnd =       {top:"-600px"};
        new_tileStart =         {top:"600px"};
        new_tileEnd =           {top:"0px"};
    }else if (direction=="up") {
        current_tileStart =     {top:"0px"};
        current_tileEnd =       {top:"600px"};
        new_tileStart =         {top:"-600px"};
        new_tileEnd =           {top:"0px"};
    }else if (direction=="left") {
        current_tileStart =     {left:"0px"};
        current_tileEnd =       {left:"300px"};
        new_tileStart =         {left:"-300px"};
        new_tileEnd =           {left:"0px"};
    }else if (direction=="right") {
        current_tileStart =     {left:"0px"};
        current_tileEnd =       {left:"-300px"};
        new_tileStart =         {left:"300px"};
        new_tileEnd =           {left:"0px"};
    }

    // apply animation by creating a new div, sliding it in to replace old div
    $("#current_tile").css(current_tileStart);
    $("#current_tile").after('<div id="new_tile" class="tile">'+ newContent + '</div>');
    $("#new_tile").css(new_tileStart);
    $("#new_tile").animate(new_tileEnd,{duration: 200, queue: false});
    $("#current_tile").animate(current_tileEnd,{duration: 200, queue: false, complete: function() {
        $("#current_tile").remove();
        // rename new tile to current_tile
        $("#new_tile").attr('id','current_tile');
    }});
}

// getId()
// Find the tile ID given layout (a 2d array that maps row/col to tile IDs)
function getId() {
    console.log("returning "+ layout[currentRow][currentCol]);
    return layout[currentRow][currentCol];
}


// bounds checking for changing tiles
function goDown(){
    if (currentRow < layout.length-1){
        currentRow ++;
        currentCol = 0;
        transitionBlock(getId(),"down");
    }
}
function goUp(){
    if (currentRow > 0){
        currentRow --;
        currentCol = 0;
        transitionBlock(getId(),"up");

    }
}
function goLeft(){
    if (currentCol > 0){
        currentCol --;
        transitionBlock(getId(),"left");
    }
}
function goRight(){
    if (currentCol < layout[currentRow].length-1){
        currentCol ++; 
        transitionBlock(getId(),"right");
    }
}

var currentRow, currentCol;

$(document).on('pageinit',function() {

    // set current row and col from url
    if (typeof(getUrlParameter("row"))== "undefined") { currentRow = 0; } else { currentRow = getUrlParameter("row"); }
    if (typeof(getUrlParameter("col"))== "undefined") { currentCol = 0; } else { currentCol = getUrlParameter("col"); }
    console.log("row "+currentRow + " col "+currentCol);

    //populate first tile
    var currId = getId();
    var foundElement = $.grep(atoms, function(e) { return e.id == currId });
    $('#current_tile').html(foundElement[0].body);

    // bind swipe interactions.
    $("body").swipe({
        swipeUp:function(event, direction, distance, duration, fingerCount){
            goDown();
        },
        swipeDown:function(event, direction, distance, duration, fingerCount){
            goUp();
        },
        swipeLeft:function(event, direction, distance, duration, fingerCount){
            goRight();
        },
        swipeRight:function(event, direction, distance, duration, fingerCount){
            goLeft();
        },
        //Default is 75px, set to 0 for demo so any distance triggers swipe
        threshold:50
    });

});
