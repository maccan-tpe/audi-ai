'use strict';
/*eslint-disable new-cap, no-unused-vars,
	no-use-before-define, no-trailing-spaces, space-infix-ops, comma-spacing,
	no-mixed-spaces-and-tabs, no-multi-spaces, camelcase, no-loop-func,no-empty,
	key-spacing ,curly, no-shadow, no-return-assign, no-redeclare, no-unused-vars,
	eqeqeq, no-extend-native, quotes , no-inner-declarations*/
/*global app, TweenMax, YT*/
app.partial.autoshow = function($, container){
	container.on('page:update' , function(page, menu){
		if(!container.hasClass('loaded')){
			container.trigger('page:load');
		}
	});
	container.on('page:load' , function(page, menu){
		var idleTick = 0;
		$(container).on('mousemove', function(){
			clearTimeout(idleTick);
			$('.menu', container).removeClass('idle');
			idleTick = setTimeout(function(){
				$('.menu', container).addClass('idle');
			}, 2000);
		});
		$('[data-spa]').unbind('click').on('click', function(e){
			if(!app.spa.supported){
				return true;
			}else{
				app.spa.loadPage($(this).data('spa'));
				return false;
			}
		});
		container.addClass('loaded');
		$('html').addClass('loading');
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
		$('header nav a:eq(1)').on('click', function(e){
			$('#autoshow0101').trigger('click');
			e.stopPropagation();
			e.preventDefault();
			return false;
		});
		$('header nav a:eq(2)').on('click', function(e){
			$('#autoshow01011').trigger('click');
			e.stopPropagation();
			e.preventDefault();
			return false;
		});
		var players = {
			loop: {
				vid: $('#player').data('vid'),
				elementId: 'player',
				loop: 1,
				autoplay: 1,
				height: 1080,
				width: 1920,
				ready: function(){
					// console.log(players.loop.player.playVideo)
					// players.loop.player.playVideo();
					// $('[for=autoshow01011]').trigger('click')
				}
			},
			tech: {
				height: 530,
				width: 940,
				vid: $('#player1').data('vid'),
				elementId: 'player1',
				// autoplay: 1,
				ready: function(){
					playerReady(players.tech);
				},
				stateChange: function (e) {
					console.log(e.data);
					if (e.data !== YT.PlayerState.PLAYING) {
						$('#player1').parent().data('data-playing', 0);
					}
				}
			},
			asistant: {
				height: 530,
				width: 940,
				vid: $('#player2').data('vid'),
				elementId: 'player2',
				ready: function(){
					playerReady(players.asistant);
				},
				stateChange: function (e) {
					console.log(e.data);
					if (e.data !== YT.PlayerState.PLAYING) {
						$('#player2').parent().attr('data-playing', 0);
					}
				}
			},
			look: {
				height: 530,
				width: 940,
				vid: 'meIoN4eEi_Y',
				elementId: 'player3',
				ready: function(){
					playerReady(players.look);
				}
			},
			inside: {
				height: 530,
				width: 940,
				vid: 'dMfFL0kSytU',
				elementId: 'player4',
				ready: function(){
					playerReady(players.inside);
				}
			}
		};

		function playerReady(v){
			// console.log(v.player);
			// console.log(v);
			v.player.pauseVideo();
			$('#' + v.elementId).parent().unbind('click').on('click', function(){
				var playing = $('#' + v.elementId).parent().attr('data-playing');
				console.log(playing);
				if(playing != 1){
					$('#' + v.elementId).parent().attr('data-playing', 1);
					v.player.playVideo();
				}else{
					$('#' + v.elementId).parent().attr('data-playing', 0);
					v.player.pauseVideo();
				}
			});
		}
		

		window.players = players;

		var loop;
		// $('.vbox').venobox({overlayClose: false});
		function onYouTubeIframeAPIReady() {
			if($(window).width() <= 768 || $('html.mobile').length){
				$('html').removeClass('loading');
				return;
			}
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
					vq: 'hd1080'
				};
				var pl = new YT.Player(video.elementId, {
					videoId: video.vid,
					playerVars: playerVars,
					height: video.height,
					width: video.width,
					events: {
						onReady: typeof video.ready == 'function' ? video.ready : function(){},
						onStateChange: typeof video.stateChange == 'function' ? video.ready : function(){}
					}
				});
				video.player = pl;
				video.playerVars = playerVars;

			});

			players.loop = players.loop.player;
			var wait4loop = setInterval(function(){
				if(!players.loop || !players.loop.getVideoLoadedFraction){
					return;
				}
				if($(window).width() <= 768 || $('html.mobile').length){
					clearInterval(wait4loop);
				}
				var frac = players.loop.getVideoLoadedFraction();
				players.loop.frac = players.loop.getVideoLoadedFraction();
				players.loop.totalTime = players.loop.getDuration();
				players.loop.currentTime = players.loop.getCurrentTime();
				players.loop.played = players.loop.currentTime/players.loop.totalTime * 100;
				// console.log('players.loop:', players.loop);
				// console.log('frac:', players.loop.frac*100+'%',',totalTime:', players.loop.totalTime+'s',',currentTime:', players.loop.currentTime+'s',',played:', players.loop.played+'%');
				// console.log('players.loop.getVideoLoadedFraction:', players.loop.getVideoLoadedFraction+'',',players.loop.getDuration:', players.loop.getDuration+'',',players.loop.getCurrentTime:', players.loop.getCurrentTime+'');
				// console.log('players.loop.getVideoLoadedFraction:', players.loop.getVideoLoadedFraction(),',players.loop.getDuration:', players.loop.getDuration(),',players.loop.getCurrentTime:', players.loop.getCurrentTime());
				players.loop.mute();
				if(players.loop.played > 98.5){
					players.loop.pauseVideo();	
					// players.loop.seekTo(0);
					clearInterval(wait4loop);
					// players.loop.playVideo();
				}
				if(frac >= 0.2 && !$('#player', container).hasClass('in')){
					players.loop.pauseVideo();	
					players.loop.seekTo(0);
					// clearInterval(wait4loop);
					players.loop.playVideo();
					setTimeout(function(){
						$('html').removeClass('loading');
						$('#player', container).addClass('in');
						// console.log(location.hash == '#A8L');
						if(location.hash == '#A8L'){
							$('#autoshow01011').trigger('click');
							players.loop.pauseVideo();	
						}
					}, 200);
				}
			}, 100);
		}

		window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;

		try{
			onYouTubeIframeAPIReady();
		}catch(e){}

		$('[name=autoshowDetail]').on('click', function(){
			if(this.id === 'autoshow0101'){
				players.loop.playVideo();
			}else{
				players.loop.pauseVideo();
			}
		});


	});
};
