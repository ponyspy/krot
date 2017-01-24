$(function() {
	$('.images_upload_preview').sortable({
		placeholder: 'placeholder',
		cancel: '.image_description, .image_delete, .image_position, .image_marquee',
		sort: function(e) {
			$('.image_description').removeClass('show');
		}
	});

	$(document).on('mouseup', function(event) {
		if (!/image_description|toggle_eng|image_position|image_marquee/.test(event.target.className)) {
			$('.image_description').removeClass('show');
		}
	});

	$(document).on('click', '.image_upload_preview', function() {
		$('.image_description').removeClass('show');
		$(this).children('.image_description').addClass('show');
		return false;
	});

	$(document).on('click', '.image_upload_preview > .image_delete', function(event) {
		$(this).parent('.image_upload_preview').remove();
	});

	$(document).on('click', '.image_position', function(event) {
		var $this = $(this);

		if ($this.children('input').val() == 'left') {
			$this.children('.label').text('справа');
			$this.children('input').val('right').append('справа');
		} else {
			$this.children('.label').text('слева');
			$this.children('input').val('left');
		}
	});

	$(document).on('click', '.image_marquee', function(event) {
		var $this = $(this);

		if ($this.children('input').val() == 'run') {
			$this.children('.label').text('стоит');
			$this.children('input').val('stop');
		} else {
			$this.children('.label').text('бежит');
			$this.children('input').val('run');
		}
	});

	$('.images_upload_preview').filedrop({
		url: '/admin/preview',
		paramname: 'image',
		fallback_id: 'upload_fallback',
		allowedfiletypes: ['image/jpeg','image/png','image/gif'],
		allowedfileextensions: ['.jpg','.jpeg','.png','.gif'],
		maxfiles: 5,
		maxfilesize: 12,
		dragOver: function() {
			$(this).css('outline', '2px solid red');
		},
		dragLeave: function() {
			$(this).css('outline', 'none');
		},
		uploadStarted: function(i, file, len) {

		},
		uploadFinished: function(i, file, response, time) {
			var image = $('<div />', {'class': 'image_upload_preview', 'style': 'background-image:url(' + response + ')'});
			var image_delete = $('<div />', {'class': 'image_delete', 'text': '×'});

			var image_position = $('<div />', {'class': 'image_position'});
			var position_label = $('<span />', { 'class': 'label', 'text': 'слева'});
			var position_form = $('<input />', {'class': 'position_form', 'type': 'hidden', 'name': 'images[position][]', 'value': 'left'});

			var image_marquee = $('<div />', {'class': 'image_marquee'});
			var marquee_label = $('<span />', { 'class': 'label', 'text': 'бежит'});
			var marquee_form = $('<input />', {'class': 'marquee_form', 'type': 'hidden', 'name': 'images[marquee][]', 'value': 'run'});

			var image_description = $('<div />', {'class': 'image_description'});
			var desc = $('<textarea />', {'class': 'image_description_input', 'name': 'images[description][]', 'placeholder':'Описание'});
			var image_form = $('<input />', {'class': 'image_form', 'type': 'hidden', 'name': 'images[path][]', 'value': response});
			$('.images_upload_preview').append(image.append(image_delete, image_position.append(position_label, position_form), image_marquee.append(marquee_label, marquee_form), image_form, image_description.append(desc)));
		},
		progressUpdated: function(i, file, progress) {

		},
		afterAll: function() {
			$('.images_upload_preview').css('outline', 'none');
		}
	});

});