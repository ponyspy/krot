$(function() {
	var $document = $(document);

	$(window)
		.on('load', function(e) {
			$document.scrollTop(history.state.scroll || 0);
		})
		.on('scroll', function(e) {
			clearTimeout($.data(this, 'scrollTimer'));
			$.data(this, 'scrollTimer', setTimeout(function() {
				history.pushState({ scroll: $document.scrollTop() }, 'scroll');
			}, 250));
		});

});