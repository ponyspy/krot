$(function() {

	$(document)
		.on('click', '.forward', function() {
			var $snake = $(this).parent('.snake_outer').children('.snake');
			$snake.first().clone()
				.find('option').prop('selected', false).end()
				.find('.input').val('').end()
				.insertAfter($snake.last());
		})
		.on('click', '.back', function() {
			var $snake = $(this).closest('.snake_outer').children('.snake');
			if ($snake.size() == 1) return false;
			$(this).parent('.snake').remove();
		})
		.on('scroll', function(event) {
			$(this).scrollTop() >= $('.menu_block').offset().top + $('.menu_block').height() + 11
				? $('.sub_menu_block').addClass('fixed')
				: $('.sub_menu_block').removeClass('fixed');
		});

	$('.form_submit').on('click', function(event) {
		var $this = $(this);

		if ($this.data('timer')) return false;

		$this.data('timer', true);

		$('form').submit();

		setTimeout(function() {
			$this.data('timer', false);
		}, 3000);
	});

	$('.form_cancel').on('click', function(event) {
		location.reload();
	});

});