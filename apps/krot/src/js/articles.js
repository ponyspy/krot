var $window = $(window);
var $document = $(document);

$window.on('load hashchange', function(e) {
	var context = {
		skip: 0,
		limit: 8,
		category: window.location.hash.replace('#', '')
	};

	var scrollLoader = function(e, fire) {
		if (fire || $window.scrollTop() + $window.height() + 240 >= $document.height()) {
			context.limit = 4;

			$window.off('scroll');

			$.ajax({url: '', method: 'POST', data: { context: context }, async: false }).done(function(data) {
				if (data !== 'end') {

					$('.articles_block').append(data).promise().done(function() {
						$('.category_item').removeClass('current').filter(context.category != '' ? '.' + context.category : '').addClass('current');
					});

					context.skip += 4;
					$window.on('scroll', scrollLoader);
				} else {
					$('.articles_loader').addClass('hide');
				}
			});
		}
	};

	$('.articles_loader').removeClass('hide');

	$.ajax({url: '', method: 'POST', data: { context: context }, async: false }).done(function(data) {
		if (data !== 'end') {
			var $data = $(data);

			$('.articles_block').empty().append($data).promise().done(function() {
				$('.category_item').removeClass('current').filter(context.category != '' ? '.' + context.category : '').addClass('current');
			});

			context.skip = $data.length;
			$window.off('scroll').scrollTop(0).on('scroll', scrollLoader);
		}
	});
});

$(function() {
	$('.articles_loader').children('span').on('click', function(e) {
		$window.trigger('scroll', true);
	});

	$document
		.on('keyup', function(e) {
			if (e.which == 27) {
				$('.category_item.current').trigger('click');
			}
		})
		.on('click', '.category_item.current', function(e) {
			e.preventDefault();

			window.location.href = '#';
		})
		.on('mouseenter', '.category_item', function(e) {
			var $this = $(this);

			$('.category_item').filter('.' + $this.attr('class').split(' ')[1])
												 .addClass($this.hasClass('current') ? 'out' : 'active');
		})
		.on('mouseleave', '.category_item', function(e) {
			$('.category_item').removeClass('active out');
		});

});