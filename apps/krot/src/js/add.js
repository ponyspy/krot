$(function() {


	// ------------------------
	// *** Constructors Block ***
	// ------------------------


	function snakeForward() {
		var $snake = $(this).parent('.snake_outer').children('.snake');
		$snake.first().clone()
			.find('option').prop('selected', false).end()
			.find('.input').val('').end()
			.insertAfter($snake.last());
	}

	function snakeBack() {
		var $snake = $(this).closest('.snake_outer').children('.snake');
		if ($snake.size() == 1) return false;
		$(this).parent('.snake').remove();
	}


	$(document).on('click', '.back', snakeBack);
	$(document).on('click', '.forward', snakeForward);

});