var current = 1;

$(function() {
	$('.block').each(function() {
		$(this).children('.image_item').eq(0).addClass('active');
	});

	$('.cv').on('click', function(e) {
		window.open('/cv', '', 'width=360, height=500, left=200, top=200');
	});

	$(document)
		.on('mousedown', 'img', function(e) {
			return false;
		})
		.on('click', 'img', function(e) {
			var $active_block = $(this).closest('.block');
			var $active_image = $(this).closest('.image_item');

			if ($active_image.index() < $active_block.children('.image_item').length - 1) {
				$active_image.removeClass('active').next().addClass('active');
			} else {
				$.post('', { index: current }).done(function(data) {
					current = data.current;

					$('.content_block').html(data.html).find('.run').delay(300).queue(function() { $(this).addClass('go'); $(this).dequeue(); });
					// $('.current').text(current);

					$('.block').each(function() {
						$(this).children('.image_item').eq(0).addClass('active');
					});
				});
			}
		});

});