'use strict';
/*eslint-disable new-cap, no-unused-vars,
	no-use-before-define, no-trailing-spaces, space-infix-ops, comma-spacing,
	no-mixed-spaces-and-tabs, no-multi-spaces, camelcase, no-loop-func,no-empty,
	key-spacing ,curly, no-shadow, no-return-assign, no-redeclare, no-unused-vars,
	eqeqeq, no-extend-native, quotes , no-inner-declarations*/
/*global app, TweenMax, ga YT*/
app.partial.a8l = function($, container){
	container.on('page:update' , function(page, menu){
		if(!container.hasClass('loaded')){
			container.trigger('page:load');
		}
	});
	container.on('page:load' , function(page, menu){
		//ga
		if($('html.mobile,html.tablet').length){
			ga('send', 'pageview', { 'page': 'Mobile_1.1.1.1_A8_Technology', 'title': 'Mobile_1.1.1.1_A8_Technology'});
		}else{
			ga('send', 'pageview', { 'page': 'PC_1.1.1.1_A8_Technology', 'title': 'PC_1.1.1.1_A8_Technology'});			
		}
		//
        var iframe = '<div><iframe frameborder="0" allowfullscreen="1" gesture="media" allow="encrypted-media" title="YouTube video player" width="640" height="360" src="https://www.youtube.com/embed/{{vid}}?autoplay=1&amp;playlist={{vid}}&amp;rel=0&amp;controls=0&amp;showinfo=0&amp;modestbranding=1&amp;iv_load_policy=3&amp;enablejsapi=1&amp;version=3&amp;widgetid=1&amp;playsinline=1"></iframe></div>';
        $('a[data-vid]').each(function(){
            var vid = $(this).data('vid');
            $(this).html(iframe.replace(/{{vid}}/ig, vid));
            
		});
		
		$('.scroll', container).on('click', function(){
			console.log('scroll');
			TweenMax.to('[role=a8l] .wrap',0.2, {scrollTop: '+=10px'});
		});
	});
};
