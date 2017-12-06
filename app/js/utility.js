'use strict';
/*eslint-disable new-cap, no-unused-vars,
	no-use-before-define, no-trailing-spaces, space-infix-ops, comma-spacing,
	no-mixed-spaces-and-tabs, no-multi-spaces, camelcase, no-loop-func,no-empty,
	key-spacing ,curly, no-shadow, no-return-assign, no-redeclare, no-unused-vars,
	eqeqeq, no-extend-native, quotes , no-inner-declarations*/
/*global app, $ */
app.utility = new (function(){
	var $ = app.$;


	//判斷是否具有屬性
	$.fn.hasAttr = function(attributeName){
		var attr = $(this).attr(attributeName);
		if (typeof attr !== typeof undefined && attr !== false) {
			return true;
		}else{
			return false;
		}
	};



	this.share = {
		facebook: function(href, title){
			href = encodeURIComponent(href || location.href + '?utm_source=facebook&utm_medium=fbshare_m&utm_campaign=camp');
			title = encodeURIComponent(title || document.title);
			window.open('https://www.facebook.com/sharer.php?u='+href+'&amp;t='+title);
		},
		googleplus: function(href){
			href = encodeURIComponent(href || location.href + '?utm_source=g+&utm_medium=googleplus_m&utm_campaign=camp');
			window.open('https://plus.google.com/share?url=' + href,'', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=600,width=600');
		},
		email: function(href, title){
			href = encodeURIComponent(href || location.href + '?utm_source=email&utm_medium=email_m&utm_campaign=camp');
			title = encodeURIComponent(title || document.title);
			var body = encodeURIComponent(''+href+' #' +title+'');
			window.open('https://mail.google.com/mail/?view=cm&fs=1&to=&su=與你分享:'+title+'&body='+body+'&bcc=');
		}
	};


	this.getParam = function(name){
		var r = new RegExp('^.*[?&]'+name+'[=]([^&]+).*$', 'i');
		if(!r.test(location.search)){
			return null;
		}
		var value = location.search.replace(r,'$1');
		return decodeURIComponent(value);
	};


});	
