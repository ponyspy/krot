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
					image_position: index === 0 ? false : {
							title: 'Image position',
							style: 'font-size: 16pt; line-height: 12pt;',
							image: '↔',
							popup: function( $popup, $button ) {
								var list_headers = {
												// Name : position
												'<- img --' : 'left',
												'-- img ->' : 'right',
												'<- img ->' : 'center',
												'>- img -<' : 'double',
												'x- img -x' : 'clear',
										};

								var $list = $('<div/>').addClass('wysiwyg-plugin-list')
																			 .attr('unselectable','on');

								$.each( list_headers, function(name, format) {
										var $link = $('<a/>').attr('href','#')
																				 .css('font-family', format)
																				 .html( name )
																				 .click(function(event) {
																						var html = $(element).wysiwyg('shell').getSelectedHTML();

																						if (/img/.test(html)) {
																							$(element).wysiwyg('shell').fontSize(7).closePopup();

																							if (format == 'clear') {
																								$(element).wysiwyg('container')
																												.find('font[size=7]')
																												.removeAttr('size')
																												.find('img').removeAttr('class')
																												.unwrap();
																							} else {
																								$(element).wysiwyg('container')
																												.find('font[size=7]')
																												.removeAttr('size')
																												.find('img').removeAttr('class').addClass(format)
																												.unwrap();
																							}
																						}

																						// prevent link-href-#
																						event.stopPropagation();
																						event.preventDefault();
																						return false;
																				});
										$list.append( $link );
								});
								$popup.append( $list );
							 }
					},
					insertvideo: index === 0 ? false : {
						title: 'Insert video',
						image: '\uf03d',
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
					header: index === 0 ? false : {
						title: 'Header',
						image: '\uf1dc', // <img src="path/to/image.png" width="16" height="16" alt="" />
						popup: function( $popup, $button ) {
							var list_headers = {
								'Header 1' : '<h1>',
								'Header 2' : '<h2>',
								'Header 3' : '<h3>',
							};
							var $list = $('<div/>').addClass('wysiwyg-plugin-list')
																		 .attr('unselectable','on');
							$.each(list_headers, function(name, format) {
									var $link = $('<a/>').attr('href','#')
																			 .css( 'font-family', format )
																			 .html( name )
																			 .click(function(event) {
																					$(element).wysiwyg('shell').format(format).closePopup();
																					// prevent link-href-#
																					event.stopPropagation();
																					event.preventDefault();
																					return false;
																			});
									$list.append( $link );
							});
							$popup.append( $list );
						 }
					},
					alignleft: index === 0 ? false : {
						title: 'Left',
						image: '\uf036',
					},
					aligncenter: index === 0 ? false : {
						title: 'Center',
						image: '\uf037',
					},
					alignright: index === 0 ? false : {
						title: 'Right',
						image: '\uf038',
					},
					orderedList: index === 0 ? false : {
						title: 'Ordered list',
						image: '\uf0cb',
					},
					unorderedList: index === 0 ? false : {
						title: 'Unordered list',
						image: '\uf0ca',
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
				placeholderEmbed: '<embed/>',
				// maxImageSize: [600, 400],
				videoFromUrl: function( url ) {

						// youtube - http://stackoverflow.com/questions/3392993/php-regex-to-get-youtube-video-id
						var youtube_match = url.match( /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]{11,11}).*/ );
						if( youtube_match && youtube_match[1].length == 11 )
								return '<iframe class="video_embed" src="//www.youtube.com/embed/' + youtube_match[1] + '" width="560" height="315" frameborder="0" allowfullscreen></iframe>';

						// vimeo - http://embedresponsively.com/
						var vimeo_match = url.match( /^(?:http(?:s)?:\/\/)?(?:[a-z0-9.]+\.)?vimeo\.com\/([0-9]+)$/ );
						if( vimeo_match )
								return '<iframe class="video_embed" src="//player.vimeo.com/video/' + vimeo_match[1] + '" width="560" height="315" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>';

						// dailymotion - http://embedresponsively.com/
						var dailymotion_match = url.match( /^(?:http(?:s)?:\/\/)?(?:[a-z0-9.]+\.)?dailymotion\.com\/video\/([0-9a-z]+)$/ );
						if( dailymotion_match )
								return '<iframe class="video_embed" src="//www.dailymotion.com/embed/video/' + dailymotion_match[1] + '" width="560" height="315" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>';

						// undefined -> create '<video/>' tag
				},
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