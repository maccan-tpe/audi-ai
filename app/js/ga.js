'use strict';
/*eslint-disable new-cap, no-unused-vars,
	no-use-before-define, no-trailing-spaces, space-infix-ops, comma-spacing,
	no-mixed-spaces-and-tabs, no-multi-spaces, camelcase, no-loop-func,no-empty,
	key-spacing ,curly, no-shadow, no-return-assign, no-redeclare, no-unused-vars,
	eqeqeq, no-extend-native, quotes , no-inner-declarations*/
/*global app, ga, $ */
app.partial.ga = function(){
	var ismobile = $('html').hasClass('mobile') || $('html').hasClass('tablet');
	if(ismobile){
		$('[data-ga-m]').on('click', function(e){
			ga('send', 'event', 'Button', 'click', $(this).data('ga-m'));
		});
	}else{
		$('[data-ga]').on('click', function(e){
			ga('send', 'event', 'Button', 'click', $(this).data('ga'));
		});
	}
};
