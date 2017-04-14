$(function() {
	var timer;

	var $bookmark = $('.bookmark');
	var $window = $(window)
		.on('load', function(e) {
			$window.scrollTop(localStorage[window.location.href]);
		})
		.on('scroll', function(e) {
			$bookmark.addClass('scroll');

			clearTimeout(timer);
			timer = setTimeout(function() {
				$bookmark.removeClass('scroll');

				localStorage[window.location.href] = $window.scrollTop();
			}, 250);
		});

});