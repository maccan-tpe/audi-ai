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
				players.loop.mute();
				if(frac >= 0.2){
					players.loop.pauseVideo();	
					players.loop.seekTo(0);
					clearInterval(wait4loop);
					players.loop.playVideo();
					setTimeout(function(){
						$('html').removeClass('loading');
						$('#player', container).addClass('in');
						if(location.hash == '#A8L'){
							$('#autoshow01011').trigger('click');
						}
					}, 200)
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
			if(this.id === 'autoshow01011'){
				$('.vbox').trigger('click');
			}
		});


	});
};
