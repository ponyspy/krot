$(function() {

	$(document).on('paste','[contenteditable]',function(e) {
		e.preventDefault();
		var text = (e.originalEvent || e).clipboardData.getData('text/plain') || prompt('Paste something..');
		window.document.execCommand('insertText', false, text);
	});

	$('.editor').each( function(index, element) {
		$(element).wysiwyg({
				classes: 'editor',
				toolbar: 'top-selection',
				buttons: {
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
				placeholderUrl: 'www.example.com',
		});
	});
});