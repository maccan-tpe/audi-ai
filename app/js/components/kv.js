'use strict';
/*eslint-disable new-cap, no-unused-vars,
	no-use-before-define, no-trailing-spaces, space-infix-ops, comma-spacing,
	no-mixed-spaces-and-tabs, no-multi-spaces, camelcase, no-kv-func,no-empty,
	key-spacing ,curly, no-shadow, no-return-assign, no-redeclare, no-unused-vars,
	eqeqeq, no-extend-native, quotes , no-inner-declarations*/
/*global app, TweenMax, YT, ga*/
app.partial.kv = function($, container){
	container.on('page:update' , function(page, menu){
		if(!container.hasClass('loaded')){
			container.trigger('page:load');
		}
	});
	container.one('page:load' , function(page, menu){
		container.addClass('loaded');
		container.on('mousewheel', function(e){
			// console.log(e.originalEvent.deltaY);
			if(e.originalEvent.deltaY>0 ){
				clearInterval(container.data('wait4kv')*1);
				$('.kv-btn').trigger('click');
				e.stopPropagation();
				e.preventDefault();
				return false;
			}
		});
		//ga
		if($('html.mobile,html.tablet').length){
			ga('send', 'pageview', { 'page': 'Mobile_0.0_Index', 'title': 'Mobile_0.0_Index'});
		}else{
			ga('send', 'pageview', { 'page': 'PC_0.0_Index', 'title': 'PC_0.0_Index'});

		}

		//
		$('[data-spa]').unbind('click').on('click', function(e){
			window.onYouTubeIframeAPIReady = function(){};
			clearInterval(container.data('wait4kv')*1);
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
		var homeplayers = {
			kv: {
				vid: $('#kvplayer').data('vid'),
				elementId: 'kvplayer',
				loop: 1,
				autoplay: 1,
				height: 1080,
				width: 1920,
				origin: location.href,
				ready: function(){
					// console.log(homeplayers.kv.player.playVideo)
					// homeplayers.kv.player.playVideo();
					// $('[for=autoshow01011]').trigger('click')
				}
			}
		};
	

		// window.homeplayers = homeplayers;

		
		function onYouTubeIframeAPIReady() {
			$('#kvplayer', container).addClass('fade');

			$.each(homeplayers, function(index, video){
				if(!$('#' + video.elementId).length){
					return;
				}
				var playerVars = {
					autoplay: video.autoplay,
					playlist: video.kv ? video.vid : undefined,
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

			var kvplayer = homeplayers.kv.player;
			// kvplayer.frac = kvplayer.getVideoLoadedFraction();
			// kvplayer.totalTime = kvplayer.getDuration();
			// kvplayer.currentTime = kvplayer.getCurrentTime();
			// kvplayer.played = currentTime/totalTime * 100;
			// console.log('kvplayer:', kvplayer);

			var wait4kv = setInterval(function(){
				if(!kvplayer || !kvplayer.getVideoLoadedFraction){
					return;
				}
				kvplayer.mute();
				kvplayer.frac = kvplayer.getVideoLoadedFraction();
				kvplayer.totalTime = kvplayer.getDuration();
				kvplayer.currentTime = kvplayer.getCurrentTime();
				kvplayer.played = kvplayer.currentTime/kvplayer.totalTime * 100;
				// console.log(frac);
				if(kvplayer.frac >= 0.05 && !$('#kvplayer', container).hasClass('in')){
					kvplayer.pauseVideo();	
					kvplayer.seekTo(0);
					// clearInterval(wait4kv);
					kvplayer.playVideo();
					setTimeout(function(){
						$('html').removeClass('loading');
						$('#kvplayer', container).addClass('in');
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
				if(kvplayer.played > 95){
					kvplayer.pauseVideo();	
					kvplayer.seekTo(0);
					// clearInterval(wait4kv);
					kvplayer.playVideo();
				}
			}, 250);

			container.data('wait4kv', wait4kv);

			setTimeout(function(){
				$('html').removeClass('loading');
				$('#kvplayer', container).addClass('in');
			}, 8000);

			if($(window).width() <= 768 || $('html.mobile').length || !homeplayers.kv.vid){
				$('html').removeClass('loading');
				clearInterval(wait4kv);
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

		if($('html.desktop').find('#kvplayer').length){
			var apiTick = 0;
			var retry = 0;
			// console.log('start retry');
			apiTick = setInterval(function(){
				if(onYouTubeIframeAPIReady && !homeplayers.kv.player){
					// console.log('retry:', retry, homeplayers.kv.player);
					var api = $('script[src*=youtube]');
					var newApi = api.clone().attr('src', 'https://www.youtube.com/iframe_api?retry=' + retry);
					newApi.insertAfter(api);
					api.remove();
					retry++;
					onYouTubeIframeAPIReady();
				}else{
					// try{
						// onYouTubeIframeAPIReady();
					// }catch(e){}
					// console.log('done retry');
					clearInterval(apiTick);
				}
			}, 1000);
		}else{
			$('html').removeClass('loading');
		}
	});
	// $('html').removeClass('loading');
};
