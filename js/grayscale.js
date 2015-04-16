/*!
 * Start Bootstrap - Grayscale Bootstrap Theme (http://startbootstrap.com)
 * Code licensed under the Apache License v2.0.
 * For details, see http://www.apache.org/licenses/LICENSE-2.0.
 */

var graphParams = {
    w : 700,
    h : 371,
    file : "data/data.tsv",
    files : ['data/data.tsv','data/data-alt.tsv'],
    index :0,    
    selector : ".chart",
    f : " "
  }

$(document).ready(function() {
    
    // IE detect
    function iedetect(v) {

        var r = RegExp('msie' + (!isNaN(v) ? ('\\s' + v) : ''), 'i');
        return r.test(navigator.userAgent);
            
    }
    
    // For mobile screens, just show an image called 'poster.jpg'. Mobile
    // screens don't support autoplaying videos, or for IE.
    if(screen.width < 800 || iedetect(8) || iedetect(7) || 'ontouchstart' in window) {
    
        (adjSize = function() { // Create function called adjSize
            
            $width = $(window).width(); // Width of the screen
            $height = $(window).height(); // Height of the screen
            
            // Resize image accordingly
            $('#init').css({
                'display' : 'block',
                'background-image' : 'url(img/poster.png)', 
                'background-size' : 'cover', 
                'width' : $width+'px', 
                'height' : $height+'px'
            });
            
            // Hide video
            $('video').hide();
            
        })(); // Run instantly
        
        // Run on resize too
        $(window).resize(adjSize);
    }
    else {        
        // Wait until the video meta data has loaded
        // Not doing this anymore because the loadedmetadata callback fires before document is ready
        // look in the index
        // $('#cont video').on('loadedmetadata',onLoadedMetadata);
    }
    
    // $(".chart").css('width', graphParams.width);
    // $(".chart").css('height',graphParams.height);
    graphParams.width = parseInt($(".chart").css("width").replace("px",""));
    graphParams.height = parseInt($(".chart").css("height").replace("px",""));
    
    graphModule.start(graphParams);

    var iframe = $('#vimeo_player')[0],
            player = $f(iframe),
            status = $('.status');

            player.addEvent('ready', function() {
                
                player.api('setVolume', 0);
            });
            console.log(player);
    // graphModule.stop(graphParams);
});

var onLoadedMetadata  = function() {
        console.log("HERE");
        $('#init').css("display","none");
        $('#cont').css("display", "block");
        
        var $width, $height, // Width and height of screen
            $vidwidth = this.videoWidth, // Width of video (actual width)
            $vidheight = this.videoHeight, // Height of video (actual height)
            $aspectRatio = $vidwidth / $vidheight; // The ratio the video's height and width are in
        
        if( $(window).width() === undefined ){
                console.log("undefined!")
        }
        
        (adjSize = function() { // Create function called adjSize
                        
            
            $width = $(window).width(); // Width of the screen
            $height = $(window).height(); // Height of the screen

            console.log($width + " : "+$height);
            $boxRatio = $width / $height; // The ratio the screen is in
                        
            $adjRatio = $aspectRatio / $boxRatio; // The ratio of the video divided by the screen size
                        
            // Set the container to be the width and height of the screen
            $('#cont').css({'width' : $width+'px', 'height' : $height+'px'}); 
            
            $('div.intro .content .container .intro-body').css({'width' : $width+'px', 'height' : $height+'px'}); 
                        
            if($boxRatio < $aspectRatio) { // If the screen ratio is less than the aspect ratio..
                // Set the width of the video to the screen size multiplied by $adjRatio
                $vid = $('#cont video').css({'width' : $width*$adjRatio+'px'}); 
                 // $('div.intro .content  .container .row .intro-body  ').css({'width' : $width*$adjRatio+'px', 'height' : $height*(1/$adjRatio)+'px'}); 
                // $('.intro-body').css({'width' : $width*$adjRatio+'px'}); 
            } else {
                // Else just set the video to the width of the screen/container
                $vid = $('#cont video').css({'width' : $width+'px'});
                // $('div.content .intro .container .intro-body .row ').css({'width' : $width*$adjRatio+'px', 'height' : $height*(1/$adjRatio)+'px'}); 
            }
                             
        })(); // Run function immediately
                    
        // Run function also on window resize.
        $(window).resize(adjSize);
                    
    }

// jQuery to collapse the navbar on scroll
$(window).scroll(function() {
    if ($(".navbar").offset().top > 50) {
        $(".navbar-fixed-top").addClass("top-nav-collapse");
    } else {
        $(".navbar-fixed-top").removeClass("top-nav-collapse");
    }
});

// jQuery for page scrolling feature - requires jQuery Easing plugin
$(function() {
    $('a.page-scroll').bind('click', function(event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});

// Closes the Responsive Menu on Menu Item Click
$('.navbar-collapse ul li a').click(function() {
    $('.navbar-toggle:visible').click();
});

// Google Maps Scripts
// When the window has finished loading create our google map below
google.maps.event.addDomListener(window, 'load', init);

function init() {
    // Basic options for a simple Google Map
    // For more options see: https://developers.google.com/maps/documentation/javascript/reference#MapOptions
    var mapOptions = {
        // How zoomed in you want the map to start at (always required)
        zoom: 15,

        // The latitude and longitude to center the map (always required)
        center: new google.maps.LatLng(40.6700, -73.9400), // New York

        // Disables the default Google Maps UI components
        disableDefaultUI: true,
        scrollwheel: false,
        draggable: false,

        // How you would like to style the map. 
        // This is where you would paste any style found on Snazzy Maps.
        styles: [{
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 17
            }]
        }, {
            "featureType": "landscape",
            "elementType": "geometry",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 20
            }]
        }, {
            "featureType": "road.highway",
            "elementType": "geometry.fill",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 17
            }]
        }, {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 29
            }, {
                "weight": 0.2
            }]
        }, {
            "featureType": "road.arterial",
            "elementType": "geometry",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 18
            }]
        }, {
            "featureType": "road.local",
            "elementType": "geometry",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 16
            }]
        }, {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 21
            }]
        }, {
            "elementType": "labels.text.stroke",
            "stylers": [{
                "visibility": "on"
            }, {
                "color": "#000000"
            }, {
                "lightness": 16
            }]
        }, {
            "elementType": "labels.text.fill",
            "stylers": [{
                "saturation": 36
            }, {
                "color": "#000000"
            }, {
                "lightness": 40
            }]
        }, {
            "elementType": "labels.icon",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "transit",
            "elementType": "geometry",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 19
            }]
        }, {
            "featureType": "administrative",
            "elementType": "geometry.fill",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 20
            }]
        }, {
            "featureType": "administrative",
            "elementType": "geometry.stroke",
            "stylers": [{
                "color": "#000000"
            }, {
                "lightness": 17
            }, {
                "weight": 1.2
            }]
        }]
    };

    // Get the HTML DOM element that will contain your map 
    // We are using a div with id="map" seen below in the <body>
    // var mapElement = document.getElementById('map');

    // Create the Google Map using out element and options defined above
    // var map = new google.maps.Map(mapElement, mapOptions);

    // Custom Map Marker Icon - Customize the map-marker.png file to customize your icon
    // var image = 'img/map-marker.png';
    // var myLatLng = new google.maps.LatLng(40.6700, -73.9400);
    // var beachMarker = new google.maps.Marker({
    //     position: myLatLng,
    //     map: map,
    //     icon: image
    // });
}
