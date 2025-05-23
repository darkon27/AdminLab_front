/** ==========================================================================================

  Project :   Labostica - Responsive Multi-purpose HTML5 Template
  Author :    Themetechmount

========================================================================================== */


/** ===============

01. Preloader
02. header_search
03. Datetimepicker
04. Fixed-header
05. Menu
06. Number rotator
07. Skillbar
08. Tab
09. Accordion
10. Isotope
11. Prettyphoto
12. Slick_slider
13. Back to top 

 =============== */


 (function($) {

    'use strict'
 
 
 /*------------------------------------------------------------------------------*/
 /* Preloader
 /*------------------------------------------------------------------------------*/
    // makes sure the whole site is loaded
     $(window).on("load",function() {
             // will first fade out the loading animation
          $("#preloader").fadeOut();
             // will fade out the whole DIV that covers the website.
          $("#status").fadeOut(9000);
     })
 
 
 /*------------------------------------------------------------------------------*/
 /* header_search
 /*------------------------------------------------------------------------------*/
     
     $(".header_search").each(function(){  
         $(".search_btn", this).on("click", function(e){
 
             e.preventDefault();
             e.stopPropagation();
 
             $(".header_search_content").toggleClass("on");
 
                 if ($('.header_search a').hasClass('open')) {
 
                     $( ".header_search a i" ).removeClass('ti-close').addClass('ti-search');
                     
                     $(this).removeClass('open').addClass('sclose');    
 
                 } 
 
                 else {
                     $(".header_search a").removeClass('sclose').addClass('open');
 
                     $( ".header_search a i" ).removeClass('ti-search').addClass('ti-close');  
                     
                     }
                 });
 
     });
 
 
     $(function() {
   
         // appointment form animations
         $('.header_btn > a').on('click', function(event) {
             event.preventDefault();
             $('#appointment').fadeToggle();
         })
         $(this).mouseup(function (e) {
 
             
             var container = $("#appointment");
 
             // @ts-ignore
             if (!container.is(e.target) // if the target of the click isn't the container...
                 // @ts-ignore
                 && container.has(e.target).length === 0) // ... nor a descendant of the container
             {
                 container.fadeOut();
             }
         });
   
     });
 
 
 
 /*------------------------------------------------------------------------------*/
 /* Datetimepicker
 /*------------------------------------------------------------------------------*/
     $(function () {
         // @ts-ignore
         $('#datetimepicker1').datetimepicker({
             daysOfWeekDisabled: [0, 6]
         });
     });
 
 
 
 /*------------------------------------------------------------------------------*/
 /* Fixed-header
 /*------------------------------------------------------------------------------*/
 
     $(window).scroll(function(){
         if ( matchMedia( 'only screen and (min-width: 1200px)' ).matches ) 
         {
             if ($(window).scrollTop() >= 50 ) {
 
                 $('.ttm-stickable-header').addClass('fixed-header');
             }
             else {
 
                 $('.ttm-stickable-header').removeClass('fixed-header');
             }
         }
     });
 
 
 
 /*------------------------------------------------------------------------------*/
 /* Menu
 /*------------------------------------------------------------------------------*/
 
     var menu = {
         initialize: function() {
             this.Menuhover();
         },
 
         Menuhover : function(){
             var getNav = $("nav.main-menu"),
                 // @ts-ignore
                 getWindow = $(window).width(),
                 // @ts-ignore
                 getHeight = $(window).height(),
                 // @ts-ignore
                 getIn = getNav.find("ul.menu").data("in"),
                 // @ts-ignore
                 getOut = getNav.find("ul.menu").data("out");
             
             if ( matchMedia( 'only screen and (max-width: 1200px)' ).matches ) {
                                                      
                 // Enable click event
                 $("nav.main-menu ul.menu").each(function(){
                     
                     // Dropdown Fade Toggle
                     $("a.mega-menu-link", this).on('click', function (e) {
                         e.preventDefault();
                         var t = $(this);
                         t.toggleClass('active').next('ul').toggleClass('active');
                     });
 
                     // Megamenu style
                     $(".megamenu-fw", this).each(function(){
                         $(".col-menu", this).each(function(){
                             $(".title", this).off("click");
                             $(".title", this).on("click", function(){
                                 $(this).closest(".col-menu").find(".content").stop().toggleClass('active');
                                 $(this).closest(".col-menu").toggleClass("active");
                                 return false;
                                 // @ts-ignore
                                 e.preventDefault();
                                 
                             });
 
                         });
                     });
                 }); 
             }
         },
     };
 
 
     $('.btn-show-menu-mobile').on('click', function(e){
         $(this).toggleClass('is-active'); 
         $('.menu-mobile').toggleClass('show'); 
         return false;
         // @ts-ignore
         e.preventDefault();  
     });
 
     // Initialize
     $(document).ready(function(){
         menu.initialize();
 
     });
 
 
 /*------------------------------------------------------------------------------*/
 /* Animation on scroll: Number rotator
 /*------------------------------------------------------------------------------*/
     
     $("[data-appear-animation]").each(function() {
     var self      = $(this);
     var animation = self.data("appear-animation");
     // @ts-ignore
     var delay     = (self.data("appear-animation-delay") ? self.data("appear-animation-delay") : 0);
         
         if( $(window).width() > 959 ) {
             self.html('0');
             // @ts-ignore
             self.waypoint(function(direction) {
                 if( !self.hasClass('completed') ){
                     var from     = self.data('from');
                     var to       = self.data('to');
                     var interval = self.data('interval');
                     // @ts-ignore
                     self.numinate({
                         format: '%counter%',
                         from: from,
                         to: to,
                         runningInterval: 2000,
                         stepUnit: interval,
                         // @ts-ignore
                         onComplete: function(elem) {
                             self.addClass('completed');
                         }
                     });
                 }
             }, { offset:'85%' });
         } else {
             if( animation == 'animateWidth' ) {
                 self.css('width', self.data("width"));
             }
         }
     });
 
 
    
 /*------------------------------------------------------------------------------*/
 /* Skillbar
 /*------------------------------------------------------------------------------*/
     
     $('.ttm-progress-bar').each(function() {
     $(this).find('.progress-bar').width(0);
     });
 
     $('.ttm-progress-bar').each(function() {
 
         $(this).find('.progress-bar').animate({
             width: $(this).attr('data-percent')
         }, 2000);
     });
 
 
     // Part of the code responsible for loading percentages:
 
     $('.progress-bar-percent[data-percentage]').each(function () {
 
         var progress = $(this);
         // @ts-ignore
         var percentage = Math.ceil($(this).attr('data-percentage'));
 
             $({countNum: 0}).animate({countNum: percentage}, {
                 duration: 2000,
                 easing:'linear',
                 step: function() {
                 // What todo on every count
                     var pct = '';
                     if(percentage == 0){
                         pct = Math.floor(this.countNum) + '%';
                     }else{
                         pct = Math.floor(this.countNum+1) + '%';
                     }
                     progress.text(pct);
                 }
             });
     });
 
 /*------------------------------------------------------------------------------*/
 /* Tab
 /*------------------------------------------------------------------------------*/ 
 
     $(document).ready(function() { 
         
         $('.content-tab').children('.content-inner').first().addClass('active');
         $('.ttm-tabs .tabs li').on('click', function(e) {  
             if (!$(this).hasClass('active')) { 
                 var i = $(this).index(); 
                 $('.ttm-tabs .tabs li.active').removeClass('active'); 
                 $('.content-tab .active').hide().removeClass('active'); 
                 $(this).addClass('active'); 
                 $($('.content-tab').children('.content-inner')[i]).fadeIn(600).addClass('active');
                 e.preventDefault();
             } 
         });
     });
     
 
 /*------------------------------------------------------------------------------*/
 /* Accordion
 /*------------------------------------------------------------------------------*/
 
 /*https://www.antimath.info/jquery/quick-and-simple-jquery-accordion/*/
 $(".accordion").each(function(){
 
     var allPanels = $('.toggle').children(".toggle-content").hide();
     $('.toggle').children(".toggle-content").eq(2).slideDown("easeOutExpo");
     $('.toggle').children(".toggle-title").children("a").eq(2).addClass("active");
 
     $('.toggle').children(".toggle-title").children("a").click(function(){        
         var current = $(this).parent().next(".toggle-content");
         $(".toggle-title > a").removeClass("active");
         $(this).addClass("active");
         allPanels.not(current).slideUp("easeInExpo");
         $(this).parent().next().slideDown("easeOutExpo");                
         return false;                
     });
 
 });
 
 
 /*------------------------------------------------------------------------------*/
 /* Isotope
 /*------------------------------------------------------------------------------*/
 
    $(function () {
 
         // @ts-ignore
         if ( $().isotope ) {           
             var $container = $('.isotope-project');
             // @ts-ignore
             $container.imagesLoaded(function(){
                 // @ts-ignore
                 $container.isotope({
                     itemSelector: '.ttm-box-col-wrapper',
                     transitionDuration: '1s',
                     layoutMode: 'fitRows'
                 });
             });
 
             $('.portfolio-filter li').on('click',function() {                           
                 var selector = $(this).find("a").attr('data-filter');
                 $('.portfolio-filter li').removeClass('active');
                 $(this).addClass('active');
                 // @ts-ignore
                 $container.isotope({ filter: selector });
                 return false;
             });
         };
 
    });
 
 
     
 /*------------------------------------------------------------------------------*/
 /* Prettyphoto
 /*------------------------------------------------------------------------------*/
 $(function () {
 
      // Normal link
     jQuery('a[href*=".jpg"], a[href*=".jpeg"], a[href*=".png"], a[href*=".gif"]').each(function(){
         if( jQuery(this).attr('target')!='_blank' && !jQuery(this).hasClass('prettyphoto') && !jQuery(this).hasClass('modula-lightbox') ){
             var attr = $(this).attr('data-gal');
             // @ts-ignore
             if (typeof attr !== typeof undefined && attr !== false && attr!='prettyPhoto' ) {
                 jQuery(this).attr('data-rel','prettyPhoto');
             }
         }
     });     
 
     // @ts-ignore
     jQuery('a[data-gal^="prettyPhoto"]').prettyPhoto();
     // @ts-ignore
     jQuery('a.ttm_prettyphoto').prettyPhoto();
     // @ts-ignore
     jQuery('a[data-gal^="prettyPhoto"]').prettyPhoto();
     // @ts-ignore
     jQuery("a[data-gal^='prettyPhoto']").prettyPhoto({hook: 'data-gal'})
 
 });
     
 
 
 /*------------------------------------------------------------------------------*/
 /* Slick_slider
 /*------------------------------------------------------------------------------*/
     // @ts-ignore
     $(".slick_slider").slick({
         speed: 1000,
         infinite: true,
         arrows: false,
         dots: false,                   
         autoplay: false,
         centerMode : false,
 
         responsive: [{
 
             breakpoint: 1360,
             settings: {
             slidesToShow: 3,
             slidesToScroll: 3
             }
         },
         {
 
             breakpoint: 1024,
             settings: {
             slidesToShow: 3,
             slidesToScroll: 3
             }
         },
         {
 
             breakpoint: 680,
             settings: {
                 slidesToShow: 2,
                 slidesToScroll: 2
             }
         },
         {
             breakpoint: 575,
             settings: {
                 slidesToShow: 1,
                 slidesToScroll: 1
             }
         }]
     });
 
 
 
 
 // @ts-ignore
 jQuery( document ).ready(function($) 
 {    
     if( jQuery('body').hasClass('ttm-one-page-site') ){
         var sections = jQuery('.ttm-row'),
         nav          = jQuery('.ttm-header-wrap, .menu'),
         nav_height   = jQuery('#site-navigation').data('sticky-height')-1;
         
         jQuery(window).on('scroll', function () {
                 if( jQuery('body').scrollTop() < 5 ){
                     nav.find('a').parent().removeClass('active');  
                 }                          
                 var cur_pos = jQuery(this).scrollTop(); 
                 sections.each(function() {
                     var top = jQuery(this).offset().top - (nav_height+1),
                     bottom = top + jQuery(this).outerHeight(); 
                     if (cur_pos >= top && cur_pos <= bottom) {                        
                         if( typeof jQuery(this) != 'undefined' && typeof jQuery(this).attr('id')!='undefined' && jQuery(this).attr('id')!='' ){
                             var mainThis = jQuery(this);                            
                             nav.find('a').removeClass('active');                       
                             jQuery(this).addClass('active');
                             var arr = mainThis.attr('id');                          
                             
                             // Applying active class
                             nav.find('a').parent().removeClass('active');
                             nav.find('a').each(function(){
                                 var menuAttr = jQuery(this).attr('href').split('#')[1];                     
                                 if( menuAttr == arr ){
                                     jQuery(this).parent().addClass('active');
                                 }
                             })
                         }
                     }
                 });
             //}
         });
         
         nav.find('a').on('click', function () {
             var $el = jQuery(this), 
             id = $el.attr('href');
             var arr=id.split('#')[1];     
             jQuery('html, body').animate({
                 scrollTop: jQuery('#'+ arr).offset().top - nav_height
             }, 500);  
             return false;
         });
         
     }
     
 } ); // END of  document.ready
 
 
 /*------------------------------------------------------------------------------*/
 /* Back to top
 /*------------------------------------------------------------------------------*/
 
 // ===== Scroll to Top ==== 
 jQuery('#totop').hide();
 
 jQuery(window).scroll(function() {
     "use strict";
     if (jQuery(this).scrollTop() >= 1000) {        // If page is scrolled more than 50px
         jQuery('#totop').fadeIn(200);    // Fade in the arrow
         jQuery('#totop').addClass('top-visible');
     } else {
         jQuery('#totop').fadeOut(200);   // Else fade out the arrow
         jQuery('#totop').removeClass('top-visible');
     }
 });
 
 jQuery('#totop').on("click",function() {      // When arrow is clicked
     jQuery('body,html').animate({
         scrollTop : 0                       // Scroll to top of body
     }, 500);
     return false;
 });
 
 
 
 $(function() {
 
     });
 
 })(jQuery);