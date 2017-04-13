$(function() {
	var $document = $(document);
	var timer;

	$(window)
		.on('load', function(e) {
			$document.scrollTop(history.state.scroll || 0);
		})
		.on('scroll', function(e) {
			clearTimeout(timer);
			timer = setTimeout(function() {
				history.pushState($document.scrollTop(), 'scroll');
			}, 250);
		});

});