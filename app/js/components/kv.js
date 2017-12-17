'use strict';
/*eslint-disable new-cap, no-unused-vars,
	no-use-before-define, no-trailing-spaces, space-infix-ops, comma-spacing,
	no-mixed-spaces-and-tabs, no-multi-spaces, camelcase, no-loop-func,no-empty,
	key-spacing ,curly, no-shadow, no-return-assign, no-redeclare, no-unused-vars,
	eqeqeq, no-extend-native, quotes , no-inner-declarations*/
/*global app, TweenMax*/
app.partial.kv = function($, container){
	container.on('page:update' , function(page, menu){
		container.addClass('loaded');
		setup();
		init();
		requestAnimationFrame(draw);
		var ratio = 1280 / 720;
		$(window).on('resize', function(){

			var ww = $(window).width() * 1.2, wh = $(window).height() *1.2;
			var cRatio = ww / wh;
			var w, h, left, top;
			if(ratio > cRatio){
				h = wh;
				w = Math.floor(wh * ratio);
				top = ww *-0.1
				left = (ww - w) / 2;
				$('.yt iframe', container)
					.css('top', top).height(wh)					
					.css('left', left +'px').width(w);
			}
		});
	});
	
	// $('html').removeClass('loading');
	
	var ctx, mid;
	var dots = [],
	  target = [];
	var maxForce = 0.002;
	
	/* This code implements some steering behaviors to a set of 14000 particles.
	Each particle will follow one target. There are 7 targets in this pen;
	
	** WARNING: Lots of math and no 'real physics'. */
	
	// A Vector Mini-library
	function Vector(x, y) {
	  this.x = x;
	  this.y = y;
	}
	
	Vector.prototype.add = function(vector) {
	  this.x += vector.x;
	  this.y += vector.y;
	};
	
	Vector.prototype.sub = function(vector) {
	  this.x -= vector.x;
	  this.y -= vector.y;
	};
	
	Vector.prototype.mult = function(n) {
	  this.x *= n;
	  this.y *= n;
	};
	
	// Returns the "length" of a vector
	Vector.prototype.norm = function() {
	  return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
	};
	
	/* Moves a particle/target around. If it hits a wall 
	(in this case, a circular barrier with a 190px radius, 
	centered in the middle of the canvas), the particle 
	goes to the oposite direction, with a smaller velocity. */
	
	Vector.prototype.move = function(delta) {
	  if (dist(this.x + delta.x, this.y + delta.y, mid.x, mid.y) > 190) {
		delta.mult(-0.43);
	  }
	
	  this.add(delta);
	};
	
	// Dat Dot, a.k.a particle.
	
	function Dot(x, y) {
	  this.pos = new Vector(x, y); // It has a position,
	
	  this.vel = new Vector(rand(), rand()); // A velocity,
	  this.vel.mult(5 / this.vel.norm());
	
	  this.acc = new Vector(rand(), rand()); // And an acceleration.
	  this.acc.mult(5 / this.acc.norm());
	
	  // The vectors are normalized, for the sake of AWESOME EXPLOSIONS :D
	}
	
	/* At each frame, each particle will calculate its new
	velocity based on the acceleration, which will affect 
	its current position. */
	
	Dot.prototype.update = function() {
	  this.pos.move(this.vel);
	  this.vel.add(this.acc);
	  //The acc reset is a kludge. I'm Sorry...
	  //In other words, a workaround to a non-accumulative acceleration.
	  this.acc.mult(0);
	};
	
	/* In a nutshell, the particle movement is given by its current state + desired state */
	
	Dot.prototype.seek = function(target) {
	  /* The Desired vector (des) is the shortest way
		 between the particle and its target. */
	
	  var des = new Vector(0, 0);
	  des.add(target);
	  des.sub(this.pos);
	
	  /* If the particle gets too close to the target, 
		It'll be scared and will run away. */
	
	  var d = des.norm();
	  des.mult(d < 25 ? -d : d);
	
	  /* We live in a world with mass, thus with inertia.
		To give a more natural movement, we'll 
		create a steering vector, which is the 
		difference between the desired and the 
		current velocity. */
	
	  var steer = new Vector(0, 0);
	  steer.add(des);
	  steer.sub(this.vel);
	
	  /* The steering vector can be really strong, so
		 I created a sort of limit for it. */
	
	  if (steer.norm() > maxForce) {
		steer.mult(maxForce / steer.norm());
	  }
	
	  return steer;
	};
	
	/* The steering force will determinate the particle's acceleration,
	which will affect the rest in update() . */
	Dot.prototype.behave = function(target) {
	  var seek = this.seek(target);
	  this.acc.add(seek);
	};
	
	// Just a random function. ]-1, 1[
	function rand() {
	  return Math.random() > 0.5 ? Math.random() : -Math.random();
	}
	
	// 2D Euclidian Distance
	function dist(x1, y1, x2, y2) {
	  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
	}
	
	function init() {
	  var dot, i;
	
	  // Create all the particles
	  for (i = 0; i < 2500; i++) {
		dot = new Dot(mid.x, mid.y);
		dots.push(dot);
	  }
	
	  // And their targets.
	  for (i = 0; i < 7; i++) {
		dot = new Vector(mid.x, mid.y);
		target.push(dot);
	  }
	}
	
	// Some house cleaning before the cool stuff happens.
	function setup() {
	  var canvas = document.querySelector("#c");
	
	  canvas.width = $(window).width();
	  canvas.height = $(window).height();;
	
	  ctx = canvas.getContext("2d");
	  ctx.fillStyle = "rgb(134,168,192)";
	
	  mid = new Vector(canvas.width / 2, canvas.height / 2);
	}
	
	function draw() {
	  var dot, i, j;
	
	  // Clear the previous frame.
	  ctx.clearRect(0, 0, 2 * mid.x, 2 * mid.y);
	
	  ctx.beginPath();
	
	  // For each target:
	  for (i = 0; i < target.length; i++) {
		// Take a set of particles that will follow it,
		for (
		  j = Math.floor(i * dots.length / target.length);
		  j < Math.floor((i + 1) * dots.length / target.length);
		  j++
		) {
		  // Do all the magic stuff,
		  dot = dots[j];
		  dot.behave(target[i]);
		  dot.update();
	
		  ctx.rect(dot.pos.x, dot.pos.y, 1, 1);
		}
	
		// Move the target randomly within the given borders,
		target[i].move(
		  new Vector(Math.floor(50 * rand()), Math.floor(50 * rand()))
		);
	  }
	
	  // Draw everyting on the canvas at once
	  ctx.fill();
	  // And repeat it till the sun goes out.
	  requestAnimationFrame(draw);
	}
	
	var player;
	function onYouTubeIframeAPIReady() {
	  player = new YT.Player('player', {
		videoId: 'enrTCrFJ71I',
		playerVars: {
			autoplay: 1,
			playlist: 'enrTCrFJ71I',
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
};
