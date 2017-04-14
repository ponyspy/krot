$(function() {
	var $document = $(document);
	var $triangle = $('.bookmark_triangle');
	var timer;

	$(window)
		.on('load', function(e) {
			$document.scrollTop(localStorage.getItem(window.location.href));
		})
		.on('scroll', function(e) {
			$triangle.addClass('scroll');
			clearTimeout(timer);
			timer = setTimeout(function() {
				$triangle.removeClass('scroll');
				localStorage.setItem(window.location.href, $document.scrollTop());
			}, 250);
		});

});