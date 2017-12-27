'use strict';
/*eslint-disable new-cap, no-unused-vars,
	no-use-before-define, no-trailing-spaces, space-infix-ops, comma-spacing,
	no-mixed-spaces-and-tabs, no-multi-spaces, camelcase, no-loop-func,no-empty,
	key-spacing ,curly, no-shadow, no-return-assign, no-redeclare, no-unused-vars,
	eqeqeq, no-extend-native, quotes , no-inner-declarations*/
/*global app, TweenMax, ga*/
app.partial.promotion = function($, container){
	container.on('page:update' , function(page, menu){
		$('html').removeClass('loading');
		if(!container.hasClass('loaded')){
			container.trigger('page:load');
		}
	});
	container.one('page:load' , function(page, menu){
		$('.slick', container).slick({
            arrows: false,
            dots: true,
            autoplay: true,
            autoplaySpeed: 3000
        });
		container.on('mousewheel', function(e){
			// console.log(e.originalEvent.deltaY);
			if(e.originalEvent.deltaY>0 ){
                $('#promo2').trigger('click');
			}else if(e.originalEvent.deltaY<0){
                $('#promo1').trigger('click');
			}
		});
	});
};
