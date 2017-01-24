function getParameterByName(name, url) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
			results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}

$(function() {
	if (getParameterByName('message')) {
		var message = $('<div/>', {'class': 'message', text: getParameterByName('message') });

		$('.form_login')
			.append(message)
			.on('click', function(e) {
				history.pushState(null, '', location.href.split('/?')[0]);
				$('.message').remove();
				$('.form_login').off();
			});
	}
});