$(document).ready(function(){

// Target your .container, .wrapper, .post, etc.
$("#main-media").fitVids();

 $('#style-switcher').animate({
			left: '-220px'
		});
		
		$('#style-switcher h6 a').click(function(e){
			e.preventDefault();
			var div = $('#style-switcher');
			console.log(div.css('left'));
			if (div.css('left') === '-220px') {
				$('#style-switcher').animate({
					left: '0px'
				}); 
			} else {
				$('#style-switcher').animate({
					left: '-220px'
				});
			}
		})

                	
 });
    /*----------------------------------------------------*/
    /*	Image Overlay
/*----------------------------------------------------*/

    $(document).ready(function () {
        $('.picture a').hover(function () {
            $(this).find('.image-overlay-zoom, .image-overlay-link').stop().fadeTo('fast', 1);
        },function () {
            $(this).find('.image-overlay-zoom, .image-overlay-link').stop().fadeTo('fast', 0);
        });
    });


// scroll to anchor	
$("a[href^='#top']").click(function(event){
    event.preventDefault();
    var full_url = this.href;
    var parts = full_url.split("#");
    var trgt = parts[1];
		
    var target_offset = $("#"+trgt).offset();
    if (!target_offset) return;

    var target_top = target_offset.top - 60;
    $('html, body').animate({
        scrollTop:target_top
    }, 1000, 'easeOutQuad');
});

$(".nav li a[href^='#']").click(function(event){
    event.preventDefault();
    var full_url = this.href;
    var parts = full_url.split("#");
    var trgt = parts[1];
		
    var target_offset = $("#"+trgt).offset();
    if (!target_offset) return;

    var target_top = target_offset.top -60;
    $('html, body').animate({
        scrollTop:target_top
    }, 1000, 'easeOutQuad');
});
//
//	

  
// Cache selectors
var lastId,
topMenu = $(".nav"),
topMenuHeight = topMenu.outerHeight()+50,
// All list items
menuItems = topMenu.find("a"),
// Anchors corresponding to menu items
scrollItems = menuItems.map(function(){
    var item = $($(this).attr("href"));
    if (item.length) {
        return item;
    }
});


// Bind to scroll
$(window).scroll(function(){
    // Get container scroll position
    var fromTop = $(this).scrollTop()+topMenuHeight;
   
    // Get id of current scroll item
    var cur = scrollItems.map(function(){
        if ($(this).offset().top < fromTop)
            return this;
    });
    // Get the id of the current element
    cur = cur[cur.length-1];
    var id = cur && cur.length ? cur[0].id : "";
   
    if (lastId !== id) {
        lastId = id;
        // Set/remove active class
        menuItems
        .parent().removeClass("active")
        .end().filter("[href=#"+id+"]").parent().addClass("active");
    }                   
            
}); 

jQuery(document).ready(function($){
    $.getJSON('http://api.twitter.com/1/statuses/user_timeline/wrapbootstrap.json?count=1&amp;callback=?', function(tweets){
        $("#twitter").html(tz_format_twitter(tweets));
    });
});


    /*----------------------------------------------------*/
    /*	Fancybox
/*----------------------------------------------------*/
    (function() {

        $('[rel=image]').fancybox({
            type        : 'image',
            openEffect  : 'fade',
            closeEffect	: 'fade',
            nextEffect  : 'fade',
            prevEffect  : 'fade',
            helpers     : {
                title   : {
                    type : 'inside'
                }
            }
        });
	
        $('[rel=image-gallery]').fancybox({
            nextEffect  : 'fade',
            prevEffect  : 'fade',
            helpers     : {
                title   : {
                    type : 'inside'
                },
                buttons  : {},
                media    : {}
            }
        });
	
	
    })();