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
	
	
		var scrolling = 0;
		$(window).on('scroll', function(){
			var offsetTop = $('header').offset().top + $('header').outerHeight();// + $('[role=content] .kv-container').outerHeight();
			if($(window).scrollTop() >= offsetTop){
				$('[role=content]').addClass('fixed-menu');
				// $('[role=content]').css('padding-top', $('[role=content] header').outerHeight() + 'px');
			} else{
				$('[role=content]').removeClass('fixed-menu');
				// $('[role=content]').css('padding-top', 0);
			}
		}).trigger('scroll');
	
		

		$('[role=content] header nav a').on('click', function(e){
			var headerOffset = 0; //$('.fixed-menu[role=content] header').length ? 0 : $('[role=content] header').offset().top;
			var headerOffset = $('html.desktop').length ? 0 : $('[role=content] header').outerHeight();
			var headerHeight = $('html.desktop').length ? $('[role=content] header nav').outerHeight() : $('[role=content] header').outerHeight();
			var offset = headerHeight - headerOffset;
			var target = $($(this).attr('href'));
			var to = target.length ? (target.offset().top - offset) : $('header').outerHeight();
			TweenMax.to('html, body', 0.75, {
				scrollTop: to
			});
			e.stopPropagation();
			e.preventDefault();
			$(this).parent().removeClass('in');
			return false;
		});

		$('[role=content] header nav').on('click', function(e){
			$(this).toggleClass('in');
		});

		var range = {}, activeSection = null, scrollTop = 0;
		
		$('[data-nav]').each(function(i){
	
			var id = $(this).attr('id');
	
			var title = $(this).data().nav;
	
			title.replace(/[&]nbsp[;]/ig, ' ').replace(/\s/ig, ' ');
	
			var ele = this;
	
			// var a = $('header nav a[href=#'+id+']');
				
				
			range[id] = {};
			// if(!$('#'+id).length){
			// 	return;
			// }
			range[id].ele = this;
			range[id].top = function(){
				return $(this.ele).offset().top;
			};
			range[id].butt = function(){
				return $(this.ele).offset().top + $(this.ele).outerHeight();
			};
			range[id].middle = function(){
				var middle = $(this.ele).offset().top + $(this.ele).outerHeight() / 2;
				return middle;
			};
			range[id].height = function(){
				return $(this.ele).outerHeight();
			};
			range[id].title = title;
		});

		
		var sTop = $(window).scrollTop();
		$(window).on('scroll', function(){
			var direction = $(window).scrollTop() > sTop;
			sTop = $(window).scrollTop();

			var currentTop = $(window).scrollTop();
			var currentButt = $(window).scrollTop() + $(window).height();
			var currentMid = $(window).scrollTop() + $(window).height() / 2;
			var navButton = $('[role=content] header nav [href$='+activeSection+']');
			$('[data-nav]').each(function(i, section){
				var sectionId = $(this).attr('id');
				var rg = range[sectionId];
	
				if(rg.height() <= $(window).height()*2 && rg.middle() >= currentTop  && rg.middle() <= currentButt){
					if(activeSection != sectionId){
						activeSection = sectionId;
					}
				} 
				if(rg.height() > $(window).height() && rg.top() <= currentMid && rg.butt() >= currentMid){
					if(activeSection != sectionId){
						activeSection = sectionId;
					}
				} 
				if(activeSection == 'index'){
					navButton = $('[role=main] header nav a:eq(0)');
				}
				if(activeSection && !navButton.hasClass('active')){
					// console.log(navButton);
					var href = location.href;
					// console.log(activeSection);
					if(activeSection != 'index'){
						href = './' + location.search + '#' + activeSection;
					}else{
						if(history.pushState){
							href =  './' + location.search;
						}else{
							href = './' + location.search + '#';
						}
					}
					$(navButton).addClass('active').trigger('button:active')
						.siblings().removeClass('active');
					if(history.pushState){
						history.pushState(null, $(this).data().nav, href);
					}else {
						window.location.hash = href;
					}
				}
				scrollTop = currentTop;
			});
		});


		$('[role=content] header nav').removeClass('in');



	});
}(app.$));




