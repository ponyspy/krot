$(function() {
	var $ascii = $('.ascii');

	var h = $ascii[0].scrollHeight;
	var w = $ascii[0].scrollWidth;

	if (w > $('.content_block').width() || h > $('.content_block').height()) {
		var deltaY = 0;
		var deltaX = 0;

		$ascii
			.on('mousemove', function(e) {
				var y = e.clientY - h / 2;
				deltaY = y * 0.1;

				var x = e.clientX - w / 2;
				deltaX = x * 0.1;
			})
			.on('blur mouseleave', function(e) {
				deltaX = 0;
				deltaY = 0;
			});

		(function step() {
			if (deltaY) {
				$ascii.scrollTop(function(i, v) {
					return v + deltaY;
				});
			}

			if (deltaX) {
				$ascii.scrollLeft(function(i, v) {
					return v + deltaX;
				});
			}

			requestAnimationFrame(step);
		})();
	}
});