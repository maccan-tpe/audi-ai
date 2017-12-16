'use strict';
/*eslint-disable new-cap, no-unused-vars,
	no-use-before-define, no-trailing-spaces, space-infix-ops, comma-spacing,
	no-mixed-spaces-and-tabs, no-multi-spaces, camelcase, no-loop-func,no-empty,
	key-spacing ,curly, no-shadow, no-return-assign, no-redeclare, no-unused-vars,
	eqeqeq, no-extend-native, quotes , no-inner-declarations*/
/*global  $, jQuery, TweenMax */
var app = {};
app.partial = {};

if($ || jQuery){
	app.$ = $.noConflict() || jQuery.noConflict();
}
(function($){
	$(function(){
		
		// 定義每個元件
		$.each(app.partial, function(name, init){
			var cont = $('[role='+name+']');
			init($, cont);
			cont.trigger('page:update');
		});
		app.imageReload.callback = function(){
			$('[role=content]').addClass('loaded');
		};
		app.imageReload.init();
	
	
	

		$('[role=content] header nav').on('click', function(e){
			$(this).toggleClass('in');
		});


		$('[role=content] header nav').removeClass('in');



	});
}(app.$));




