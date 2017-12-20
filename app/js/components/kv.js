'use strict';
/*eslint-disable new-cap, no-unused-vars,
	no-use-before-define, no-trailing-spaces, space-infix-ops, comma-spacing,
	no-mixed-spaces-and-tabs, no-multi-spaces, camelcase, no-loop-func,no-empty,
	key-spacing ,curly, no-shadow, no-return-assign, no-redeclare, no-unused-vars,
	eqeqeq, no-extend-native, quotes , no-inner-declarations*/
/*global app, TweenMax, YT, ga*/
app.partial.kv = function($, container){
	container.on('page:update' , function(page, menu){
		if(!container.hasClass('loaded')){
			container.trigger('page:load');
		}
	});
	container.on('page:load' , function(page, menu){
		container.addClass('loaded');
		//ga
		if($('html.mobile,html.tablet').length){
			ga('send', 'pageview', { 'page': 'Mobile_0.0_Index', 'title': 'Mobile_0.0_Index'});
		}else{
			ga('send', 'pageview', { 'page': 'PC_0.0_Index', 'title': 'PC_0.0_Index'});

		}

		//
		$('[data-spa]').unbind('click').on('click', function(e){
			if(!app.spa.supported){
				return true;
			}else{
				app.spa.loadPage($(this).data('spa'));
				return false;
			}
		});
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
				yt.height = viewport.width / ratio;
			}else{
				yt.width = viewport.height * ratio;
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
		
		// console.log('loaded:');
		var players = {
			loop: {
				vid: $('#player').data('vid'),
				elementId: 'player',
				loop: 1,
				autoplay: 1,
				height: 1080,
				width: 1920,
				origin: location.href,
				ready: function(){
					// console.log(players.loop.player.playVideo)
					// players.loop.player.playVideo();
					// $('[for=autoshow01011]').trigger('click')
				}
			}
		};
	

		// window.players = players;

		
		function onYouTubeIframeAPIReady() {
			$('#player', container).addClass('fade');

			$.each(players, function(index, video){
				if(!$('#' + video.elementId).length){
					return;
				}
				var playerVars = {
					autoplay: video.autoplay,
					playlist: video.loop ? video.vid : undefined,
					rel: 0,
					controls: 0,
					showinfo: 0,
					modestbranding: 1,
					iv_load_policy: 3,
					enablejsapi: 1,
					version: 3,
					origin: video.origin,
					vq: 'hd1080'
				};
				var pl = new YT.Player(video.elementId, {
					videoId: video.vid,
					playerVars: playerVars,
					height: video.height,
					width: video.width,
					origin: video.origin,
					events: {
						onReady: typeof video.ready == 'function' ? video.ready : function(){},
						onStateChange: typeof video.stateChange == 'function' ? video.ready : function(){}
					}
				});
				video.player = pl;
				video.playerVars = playerVars;
				// pl.playVideo();
				// pl.mute();
				// console.log('pl:', pl);

			});

			var kvplayer = players.loop.player;
			// kvplayer.frac = kvplayer.getVideoLoadedFraction();
			// kvplayer.totalTime = kvplayer.getDuration();
			// kvplayer.currentTime = kvplayer.getCurrentTime();
			// kvplayer.played = currentTime/totalTime * 100;
			// console.log('kvplayer:', kvplayer);

			var wait4loop = setInterval(function(){
				if(!kvplayer || !kvplayer.getVideoLoadedFraction){
					return;
				}
				kvplayer.mute();
				kvplayer.frac = kvplayer.getVideoLoadedFraction();
				kvplayer.totalTime = kvplayer.getDuration();
				kvplayer.currentTime = kvplayer.getCurrentTime();
				kvplayer.played = kvplayer.currentTime/kvplayer.totalTime * 100;
				// console.log(frac);
				if(kvplayer.frac >= 0.05 && !$('#player', container).hasClass('in')){
					kvplayer.pauseVideo();	
					kvplayer.seekTo(0);
					// clearInterval(wait4loop);
					kvplayer.playVideo();
					setTimeout(function(){
						$('html').removeClass('loading');
						$('#player', container).addClass('in');
					}, 200);
				}
				$('.duration .played', container).width(kvplayer.played + '%');
				// console.log('kvplayer:', kvplayer);
				// console.log('frac:', kvplayer.frac*100+'%',',totalTime:', kvplayer.totalTime+'s',',currentTime:', kvplayer.currentTime+'s',',played:', kvplayer.played+'%');
				// console.log('kvplayer.getVideoLoadedFraction:', kvplayer.getVideoLoadedFraction+'',',kvplayer.getDuration:', kvplayer.getDuration+'',',kvplayer.getCurrentTime:', kvplayer.getCurrentTime+'');
				// console.log('kvplayer.getVideoLoadedFraction:', kvplayer.getVideoLoadedFraction(),',kvplayer.getDuration:', kvplayer.getDuration(),',kvplayer.getCurrentTime:', kvplayer.getCurrentTime());
				if(kvplayer.frac!=null && kvplayer.frac < 1){
					$('.duration .downloaded', container).width(kvplayer.frac*100 + '%');
				}
				if(kvplayer.played > 98.5){
					kvplayer.pauseVideo();	
					kvplayer.seekTo(0);
					// clearInterval(wait4loop);
					kvplayer.playVideo();
				}
			}, 250);
			setTimeout(function(){
				$('html').removeClass('loading');
				$('#player', container).addClass('in');
			}, 8000);

			if($(window).width() <= 768 || $('html.mobile').length || !players.loop.vid){
				$('html').removeClass('loading');
				clearInterval(wait4loop);
			}
			

			// $('.duration', container).unbind('click').on('click', function(e){
			// 	var percent = (e.clientX - $(this).offset().left) / $('.duration .downloaded', container).width();
			// 	var to = Math.floor(percent * kvplayer.totalTime);
			// 	$('.duration .played', container).width(percent*100 + '%');

			// 	kvplayer.seekTo(to, true);
				
			// 	e.stopPropagation();
			// 	e.preventDefault();
			// 	return false;
			// });
		}

		window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;

		try{
			onYouTubeIframeAPIReady();
		}catch(e){}
	});
	// $('html').removeClass('loading');
	
};
