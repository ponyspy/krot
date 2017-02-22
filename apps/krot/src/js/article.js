$(function() {
	$('.article_description').find('img').filter(':odd').addClass('left').end()
																			 .filter(':even').addClass('right');
});