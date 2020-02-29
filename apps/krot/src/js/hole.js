$(function() {
	$('.answer_check').on('click', function(e) {
		var $question = $(this).closest('.hole_question');
		var params = {
			'question_id': $question.attr('id'),
			'answer': $question.find('.answer_input').val()
		}

		$.post('', params).done(function(data) {
			location.reload();
		});
	});
});