'use strict';
/*eslint-disable new-cap, no-unused-vars,
	no-use-before-define, no-trailing-spaces, space-infix-ops, comma-spacing,
	no-mixed-spaces-and-tabs, no-multi-spaces, camelcase, no-loop-func,no-empty,
	key-spacing ,curly, no-shadow, no-return-assign, no-redeclare, no-unused-vars,
	eqeqeq, no-extend-native, quotes , no-inner-declarations*/
/*global app, TweenMax, ga*/
app.partial.whatsnew = function($, container){
	container.on('page:update' , function(page, menu){
		$('html').removeClass('loading');
		if(!container.hasClass('loaded')){
			container.trigger('page:load');
		}
	});
	container.on('page:load' , function(page, menu){
		$('header nav [data-container=whatsnew]').addClass('active').siblings().removeClass('active');
		//ga
		if($('html.mobile,html.tablet').length){
			ga('send', 'pageview', { 'page': 'Mobile_1.0_Whats_New', 'title': 'Mobile_1.0_Whats_New'});
		}else{
			ga('send', 'pageview', { 'page': 'PC_1.0_Whats_New', 'title': 'PC_1.0_Whats_New'});
		}
		//
		$('html').removeClass('loading');
		// container.addClass('loaded');
		$('[data-spa]').unbind('click').on('click', function(e){
			if(!app.spa.supported){
				return true;
			}else{
				app.spa.loadPage($(this).data('spa'));
				return false;
			}
		});
	});
	container.on('mousewheel', function(e){
		console.log(e.originalEvent.deltaY);
		if(e.originalEvent.deltaY>0 ){
			$('.btn-autoshow').trigger('click');
			e.stopPropagation();
			e.preventDefault();
			return false;
		}
	});
};
