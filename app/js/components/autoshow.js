'use strict';
/*eslint-disable new-cap, no-unused-vars,
	no-use-before-define, no-trailing-spaces, space-infix-ops, comma-spacing,
	no-mixed-spaces-and-tabs, no-multi-spaces, camelcase, no-loop-func,no-empty,
	key-spacing ,curly, no-shadow, no-return-assign, no-redeclare, no-unused-vars,
	eqeqeq, no-extend-native, quotes , no-inner-declarations*/
/*global app, TweenMax*/
app.partial.autoshow = function($, container){
	container.on('page:update' , function(page, menu){
		container.addClass('loaded');
		// $('html').removeClass('loading');
		$(window).on('resize', function(){
			var viewport = {
				width: $(window).width(),
				height: $(window).height(),
				ratio: $(window).width() / $(window).height()
			}, ratio = 1920/1080;
			var yt = {
				width: viewport.width,
				height: viewport.height
			};
			if(viewport.ratio > ratio){
				yt.height = viewport.width / ratio
			}else{
				yt.width = viewport.height * ratio
			}
			TweenMax.set($('.yt', container), {
				top: '50%',
				left: '50%',
				width: yt.width,
				height: yt.height,
				marginLeft: yt.width* -0.5,
				marginTop: yt.height* -0.5
			});
		});
		var player;
		
		function onYouTubeIframeAPIReady() {
			player = new YT.Player('player', {
				videoId: 'fJGo8XNahLY',
				playerVars: {
					autoplay: 1,
					playlist: 'fJGo8XNahLY',
					rel: 0,
					controls: 0,
					showinfo: 0,
					modestbranding: 1,
					iv_load_policy: 3,
					enablejsapi: 1,
					version: 3,
					loop: 1,
					vq: 'hd720'
				},
				events: {
					onReady: function(){
						player.playVideo();
					},
					onStateChange: function(){}
				}
			});
			var wait4loop = setInterval(function(){
				if(!player || !player.getVideoLoadedFraction){
					return;
				}
				if($(window).width() <= 768 || $('html.mobile').length){
					clearInterval(wait4loop);
				}
				var frac = player.getVideoLoadedFraction();
				player.mute();
			//   console.log(frac);
				if(frac >= 0.2){
				//   console.log('pauseVideo');
					player.pauseVideo();	
					player.seekTo(0);
					clearInterval(wait4loop);
					player.playVideo();
					$('html').removeClass('loading');
				}
			}, 100);
		}
		window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
		try{
			onYouTubeIframeAPIReady();
		}catch(e){}
		$('[name=autoshowDetail]').on('click', function(){
			if(this.id === 'autoshow0101'){
				player.playVideo();
			}else{
				player.pauseVideo();
			}
		});
		// $('html').removeClass('loading');
	});
};
