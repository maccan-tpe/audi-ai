'use strict';
/*eslint-disable new-cap, no-unused-vars,
	no-use-before-define, no-trailing-spaces, space-infix-ops, comma-spacing,
	no-mixed-spaces-and-tabs, no-multi-spaces, camelcase, no-loop-func,no-empty,
	key-spacing ,curly, no-shadow, no-return-assign, no-redeclare, no-unused-vars,
	eqeqeq, no-extend-native, quotes , no-inner-declarations*/
/*global  $, jQuery, TweenMax, ga */
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
			if($(this).hasClass('in') && $('html.mobile,html.tablet').length){
				
				//ga
				ga('send', 'pageview', { 'page': 'Mobile_0.0_nav', 'title': 'Mobile_0.0_nav'});

				//
			}
		});


		$('[role=content] header nav').removeClass('in');


		app.spa = {
			supported: typeof history.pushState === 'function',
			container: $('.main-content'),
			next: null
		};


		function loadPage(href){
			var temp = document.createElement('div');
			var demand = {
				title: null,
				url: href
			};
			app.spa.to = href;
			$.get(href, function(r){
				$(r).each(function(i, element){
					if($(element).attr('property') === 'og:title'){
						demand.title = $(element).attr('content');
					}
					if($(element).attr('role') === 'content'){
						demand.htmlContent = $('.main-content', element).html();
					}
				});
				app.spa.demand = demand;
				translate();
				// console.log(app.spa);
			});
		}

		function translate(){
			// console.log(app.spa.container);
			app.spa.next = app.spa.container.clone()
				.html('')
				.addClass('translateLeft')
				.append(app.spa.demand.htmlContent);

			app.spa.next.insertAfter(app.spa.container);
			app.imageReload.refresh();

			app.spa.container.one('transitionend', function(){
				$('.translateRight').remove();
			});
			app.spa.next.one('transitionend', function(){
				app.spa.container = app.spa.next;
				app.spa.next = null;
				pushState(app.spa.demand, app.spa.url);
			});
			app.spa.container.addClass('translateRight');
			app.spa.next.removeClass('translateLeft');
			$('html').addClass('loading');
			$.each(app.partial, function(name, init){
				var cont = $('[role='+name+']');
				init($, cont);
				cont.trigger('page:update');
			});

			
		}
		function pushState(info){
			// console.log('history.pushState('+JSON.stringify(info)+', '+(info.title || document.title)+', '+info.uri+')');
			// console.log('push ref:',':',info);
			document.title = info.title;
			history.pushState(info, info.title, info.url);
		}

		$(window).on('popstate', function(event){
			var info = event.originalEvent.state;
			// console.log('pop',info);
			if(info === null){
				location.href = './';
			}
			document.title = info.title;
			loadPage(info.url);
			return true;
	
		});

		app.spa.loadPage = loadPage;
	});
}(app.$));




