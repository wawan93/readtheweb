/* Author:

*/

function prev_def (e) {
	// Предотвращаем дальнейшее всплытие события
	if (e.stopPropagation) e.stopPropagation();
	else e.cancelBubble = true;

	// Отменяем действие по умолчанию для события
	if (e.preventDefault) e.preventDefault();
	else e.returnValue = false;
	
	return false;
}

var winW = 630, winH = 460;

function setSizes () {
	if (parseInt(navigator.appVersion)>3) {
		if (navigator.appName=="Netscape") {
			winW = window.innerWidth;
			winH = window.innerHeight;
		}
		else 
		if (navigator.appName.indexOf("Microsoft")!=-1) {
			winW = document.documentElement.clientWidth;
			winH = document.documentElement.clientHeight;
		}
		else
		{
			winW = document.body.offsetWidth;
			winH = document.body.offsetHeight;
		} 
	}

	if (winW % 2 != 0) {winW--;}
	winW = Math.round(winW/2);
	
	$('.copy').css('WebkitColumnWidth',winW-85);
	$('.copy').css('MozColumnWidth',winW-70);
	$('.copy').css('ColumnWidth',winW-85);
	
	$('.copy').append('<p id="first_paragraph" class="endmark">&emsp;&emsp;&emsp;</p>');
}	

function setHeight() {
	var top = $('header').height();
	var diff = winH - top - 50;
	$('.copy').css({'height':diff, 'margin-top':top});	
}

function fadeTitle() {
	$('header').addClass('small');
	setHeight();
}

function progressBar(){
	var totalWidth = $('.endmark').offset().left+winW - $(window).width();
	var currentPosition = $('body').scrollLeft() || $('html').scrollLeft();
	var progress = currentPosition / totalWidth;
	var progressPercent = progress * 99;
	var location = Math.round(progressPercent).toFixed(0);
	var progressLocation = $('#scrollbar').width() * progress;
	$('#progress').css('width', progressPercent + '%');
	$('#location').html(location + '%').css('margin-left', progressLocation);

}

function nextParagraph(dir) {
	var para_currentPosition = $('body').scrollLeft() || $('html').scrollLeft();
	var paraWidth = $('#first_paragraph').width() + 42;
	if (dir>0) {
		var nextPara = Math.ceil(para_currentPosition / paraWidth) * paraWidth;
	} else {
		var nextPara = Math.floor(para_currentPosition / paraWidth) * paraWidth;
	}
	if (nextPara == para_currentPosition) {
		nextPara = nextPara + paraWidth * dir;
	}
	else{
	// Do Nothing
	}
	return nextPara;
}

function ajax_load (u) {
	$.ajax({
		'url':'get.php',
		data:{'url':u},
		beforeSend: function ( xhr ) {
			$('.copy').html('<h1>LOADING...</h1><p>Please wait...</p>');
		}
	}).done(function ( data ) {
		$('.copy').html(data);
		$('.copy').scrollLeft(0);
		$('.copy').append('<p id="first_paragraph" class="endmark">&emsp;&emsp;&emsp;</p>');
	});
}

function ajax_init() {
	if (location.hash != '') {
		ajax_load(location.hash.replace(/^#/,''));
	} else {
		$('#showmenu').click();
	}

	$(window).bind('hashchange', function() {
		if (location.hash != '') {
			ajax_load(location.hash.replace(/^#/,''));
		}
	});
	
	$('#form').submit(function(e) { 
		location.hash = $('#form input:first').val();
		return prev_def(e);
	});
	
	$('#go').click(function(e) { 
		location.hash = $('#form input:first').val();
		return prev_def(e);
	});
}

	
function scrolling() {
	
	// вешаем обработчик скролла мыши
	if (window.addEventListener) window.addEventListener("DOMMouseScroll", mouse_wheel, false);
	window.onmousewheel = document.onmousewheel = mouse_wheel;

	// собственно сам обработчик прокрутки мыши
	function mouse_wheel (e) {
		// тут обрабатывай событие прокрутки колеса мыши.

		// собственно само событие, для ИЕ берем из window
		e = e || window.event;

		prev_def(e);
		var direction = ((e.wheelDelta) ? e.wheelDelta/120 : e.detail/-3) || false;
		$('html, body').stop(true,true,true).animate({scrollLeft:nextParagraph(-direction)},200);
	};
	
	$(document).keydown(function(e){
		if((e.keyCode == 39) || (e.keyCode == 40) || (e.keyCode == 34) || (e.keyCode == 32)){
			var direction = 1;
		} else if ((e.keyCode == 37) || (e.keyCode == 38) || (e.keyCode == 33)) {
			var direction = -1;
		} else if (e.keyCode == 68) { //d
		}
		else if (e.keyCode == 36) {
			$('html,body').stop(true,true,true).animate({scrollLeft : 0}, 500);
		}
		else {return;}
		    $('html,body').stop(true,true,true).animate({scrollLeft : nextParagraph(direction)}, 200);
		return prev_def(e);
	});
}

$(document).ready(function() {
	setSizes();
	fadeTitle();
	progressBar();
	scrolling();
	ajax_init();
});

$(window).resize(function(){
	setSizes();
	setHeight();
	progressBar();
});

$(window).scroll(function(){
	fadeTitle();
	progressBar();
});

