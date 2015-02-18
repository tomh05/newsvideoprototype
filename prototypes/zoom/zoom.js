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

//$( document ).ready(function() {
$(document).on('pageinit', function() {

    console.log("init!!");

    $.getScript('../../articles/'+ getUrlParameter("article")+'/text-content.js',function() {

        $('#title h1').html(title);

        if (typeof(getUrlParameter("id"))== "undefined") {
            // populate body
            console.log("no id, showing full article");
            for (var i=0; i< atoms.length;i++) {
                if (atoms[i].level=="2") {
                    var tag = '<div class="atomblock" ';
                    console.log(atoms[i].child);
                    console.log(atoms[i].parent);
                    if (atoms[i].child != "") { tag = tag + ' data-child="'+atoms[i].child+'" ';}
                    if (atoms[i].parent != "") { tag = tag + ' data-parent="'+atoms[i].parent+'" ';}
                    tag = tag + '>'+ atoms[i].body+'</div>';
                    $('div.ui-page-active #article').append(tag);



                }
            }
            // swipe to get context
            console.log("setting swipe up!");
            $(".atomblock").swipe({
                swipeRight:function(event, direction, distance, duration, fingerCount){
                    var parent_str = $(this).attr("data-parent");
                    if (parent_str=="") return;
                    var target = "zoom.htm?article="+getUrlParameter("article")+"&id="+parent_str;
                    $.mobile.pageContainer.pagecontainer("change", target, {transition: "slide", reverse: true, changeHash: true, reload: true})
                console.log("swipe to parent");
                },
                swipeLeft:function(event, direction, distance, duration, fingerCount){
                    var child_str = $(this).attr("data-child");
                    if (child_str=="") return;
                    var target = "zoom.htm?article="+getUrlParameter("article")+"&id="+child_str;
                    $.mobile.pageContainer.pagecontainer("change", target, {transition: "slide",  changeHash: true, reload: true})
                },
                //Default is 75px, set to 0 for demo so any distance triggers swipe
                threshold:50
            });


        } else {
            // Single article node
            var id = getUrlParameter("id");
            var foundElement = $.grep(atoms, function(e) { return e.id == id });
            console.log(foundElement);
            var tag = '<div class="atomblock" ';
            console.log(foundElement[0].child);
            console.log(foundElement[0].parent);
            if (foundElement[0].child != "") { tag = tag + ' data-child="'+foundElement[0].child+'" ';}
            if (foundElement[0].parent != "") { tag = tag + ' data-parent="'+foundElement[0].parent+'" ';}
            tag = tag + '>'+ foundElement[0].body+'</div>';
            $('div.ui-page-active #article').append(tag);


            
            console.log("binding swipe");
            $(".atomblock").swipe({
                swipeRight:function(event, direction, distance, duration, fingerCount){
                    console.log("back");
                    $.mobile.back();
                },
                swipeLeft:function(event, direction, distance, duration, fingerCount){
                    console.log("back");
                    $.mobile.back();
                },
                //Default is 75px, set to 0 for demo so any distance triggers swipe
                threshold:50
            });

            $(".atomblock").click(function(data){console.log(data);});
        }
    });

});
