$(function() {

	$(document).on('paste','[contenteditable]',function(e) {
		e.preventDefault();
		var text = (e.originalEvent || e).clipboardData.getData('text/plain') || prompt('Paste something..');
		window.document.execCommand('insertText', false, text);
	});

	$('.editor').each(function(index, element) {
		$(element).wysiwyg({
				classes: 'editor',
				toolbar: 'top-selection',
				buttons: {
					insertimage: index === 0 ? false : {
						title: 'Insert image',
						image: '\uf030'
					},
					insertlink: {
						title: 'Insert link',
						image: '\uf08e',
					},
					bold: {
						title: 'Bold (Ctrl+B)',
						image: '\uf032',
						hotkey: 'b'
					},
					italic: {
						title: 'Italic (Ctrl+I)',
						image: '\uf033',
						hotkey: 'i'
					},
					underline: {
						title: 'Underline (Ctrl+U)',
						image: '\uf0cd',
						hotkey: 'u'
					},
					removeformat: {
						title: 'Remove format',
						image: '\uf12d'
					},
				},
				submit: {
						title: 'Submit',
						image: '\uf00c'
				},
				// placeholder: 'Type your text here...',
				selectImage: 'Click or drop image',
				placeholderUrl: 'www.example.com',
				// maxImageSize: [600, 400],
				forceImageUpload: true,
				onImageUpload: function(insert_image) {
					var form_data = new FormData();
					var image = this.files[0];

					form_data.append('image', image);

					$.ajax({
						url: '/admin/preview',
						data: form_data,
						cache: false,
						contentType: false,
						processData: false,
						type: 'POST',
						success: function(path){
							insert_image(path);
						}
					});
				}
		});
	});
});