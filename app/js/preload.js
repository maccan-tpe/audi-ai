'use strict';
/*eslint-disable new-cap, no-unused-vars,
	no-use-before-define, no-trailing-spaces, space-infix-ops, comma-spacing,
	no-mixed-spaces-and-tabs, no-multi-spaces, camelcase, no-loop-func,no-empty,
	key-spacing ,curly, no-shadow, no-return-assign, no-redeclare, no-unused-vars,
	eqeqeq, no-extend-native, quotes , no-inner-declarations*/
/*global app */
app.partial.preload = function($){
	
	app.dementions = {
		mobile: false,
		desktop: false
	};


	function imageReload(callback){

		var imagePreload = {}, elements = [];

		var main = $('img[data-src]:visible, figure[data-src]:visible').not('.loaded');
		main.each(function(idx, ele){
			if($(ele).attr('data-src')){
				imagePreload[$(ele).attr('data-src')] = false;
				elements.push(ele);
			}
		});
		// console.log(main);
		
		$.each(imagePreload, function(src, stat){
			if(/\.svg$/.test(src)){

				$.get(src, function(svg){
					var ret = $(elements).filter(function(){
						return src == $(this).attr('data-src');
					}).each(function(i, ele){
						$(ele).addClass('loaded');
						if(ele.tagName.toLowerCase() === 'img'){
							$('svg', svg).clone().attr('class', $(ele).attr('class')).insertAfter(ele);
							$(ele).remove();
						}else{
							$(ele).removeAttr('data-src').html($('svg', svg).clone());
						}
					});	
					checkAll(src);
				});
			}else{
				var img = new Image();
				img.onload = function(){
					var ret = $(elements).filter(function(){
						return src == $(this).attr('data-src');
					}).each(function(i, ele){
						$(ele).addClass('loaded');
						if(ele.tagName.toLowerCase() === 'img'){
							$(ele).attr('src', $(ele).attr('data-src'));
						}else{
							$(ele).css('background-image', 'url(' + $(ele).attr('data-src') + ')');
						}
					});			
					checkAll(src);	
				};
				img.src = src;
			}
		});
		if(!main.length){
			//沒有圖片
			// console.log('沒有圖片');
			imageLoaded();
		}

		function checkAll(src){

			imagePreload[src] = true;
			var alldone = true;
			$.each(imagePreload, function($s, $done){
				alldone = $done && alldone;
			});
			if(alldone){
				//全部圖片下載完成
				imageLoaded();
			}
		}

		function imageLoaded(){
			if(typeof app.imageReload.callback == 'function'){
				app.imageReload.callback();
			}
		}

	}


	app.imageReload = {
		init: function(){
			$(window).on('resize', function(){
				var main = $('img[data-src]:visible, figure[data-src]:visible').not('[src],[style]');

				// if(main.length && $(window).width()){
					imageReload(function(){
						
					});
				// } else{
				// 	app.imageReload.callback();
				// }
			}).trigger('resize');
		},
		refresh: function(){
			$(window).trigger('resize');
		},
		callback: function(){}
	};

};	

