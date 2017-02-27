$(function() {
	var articles_sort = {
		// placeholder: 'placeholder',
		cancel: '.add_item',
		connectWith: '.column_articles',
		sort: function(e) {
			$('.articles_list').removeAttr('index').removeClass('show');
			$('.add_item').removeClass('select');
		}
	};

	var columns_sort = {
		// placeholder: 'placeholder',
		cancel: '.add_item',
		sort: function(e) {
			$('.articles_list').removeAttr('index').removeClass('show');
			$('.add_item').removeClass('select');
		}
	};

	$('.column_articles').sortable(articles_sort);
	$('.issue_colums').sortable(columns_sort);


	$('form').on('submit', function(e) {
		e.preventDefault();

		$('.issue_column').toArray().forEach(function(column, i) {
			$('<input />').attr('type', 'hidden')
										.attr('name', 'columns' + '[' + i + ']' + '[main]')
										.attr('value', $(column).find('.column_main:checked').val() ? true : false)
										.appendTo('form');

			$(column).find('.issue_article').toArray().forEach(function(article, j) {
				$('<input />').attr('type', 'hidden')
											.attr('name', 'columns' + '[' + i + ']' + '[articles][' + j + ']')
											.attr('value', $(article).attr('id'))
											.appendTo('form');
			});
		});

		this.submit();
	});


	var search = {
		val: '', buf: '',
		checkResult: function() {
			if (this.buf != this.val) {
				this.buf = this.val;
				this.getResult.call(search, this.val);
			}
		},
		getResult: function (result) {
			$.post('/admin/issues/get_articles', { context: { text: result } }).done(function(data) {
				if (data == 'end') {
					$('.list_items').empty().text('Ничего нет!');
				} else {
					$('.list_items').empty().append(data);
				}
			});
		}
	};

	$(document)


		.on('keyup change', '.list_search', function(event) {
			search.val = $(this).val();
		})
		.on('focusin', '.list_search', function(event) {
			search.interval = setInterval(function() {
				search.checkResult.call(search);
			}, 600);
		})
		.on('focusout', '.list_search', function(event) {
			clearInterval(search.interval);
		})


		.on('keyup', function(event) {
			if (event.altKey && event.which == 70) {
				$('.list_search').focus();
				return false;
			}

			if (event.which == 27) {
				var $sub_search = $('.list_search');
				$sub_search.val() === ''
					? $sub_search.blur()
					: $sub_search.val('').trigger('keyup');
				return false;
			}
		})

		.on('mouseup', function(e) {
			if (!/delete_item|add_item|list_item|list_search/.test(event.target.className)) {
				$('.articles_list').removeAttr('index').removeClass('show');
				$('.add_item').removeClass('select');
			}
		})


		.on('click', '.add_item.article', function(e) {
			var self = this;
			var index = $(self).closest('.issue_column').index();

			$.post('/admin/issues/get_articles', { context: { text: '' } }, function(data) {
				$('.add_item.article').removeClass('select').filter(self).addClass('select');
				$('.articles_list').addClass('show').children('.list_items').empty().append(data).end()
																						.attr('index', index);
				$('.list_search').val('').focus();
			});
		})

		.on('click', '.add_item.column', function(e) {
			if ($('.issue_column').length > 2) return false;
			$('.issue_column').first().clone()
																.find('.column_main').removeAttr('checked').end()
																.find('.issue_article').remove().end()
																.find('.add_item').removeClass('select').end()
																.insertBefore(this);
		})

		.on('click', '.delete_item.column', function(e) {
			$('.articles_list').removeAttr('index').removeClass('show');
			$('.add_item').removeClass('select');
			if ($('.issue_column').length > 1) $(this).closest('.issue_column').remove();
		})

		.on('click', '.delete_item.article', function(e) {
			$(this).parent().remove();
		})

		.on('click', '.list_item', function(e) {
			var $this = $(this);
			var index = $('.articles_list').attr('index');

			var $del_article = $('<div/>', { 'class': 'delete_item article' });
			var $img_article = $('<img/>', { 'class': 'article_image', 'src': $this.attr('image')  });
			var $title_article = $('<div/>', { 'class': 'article_title', 'text': $this.text() });
			var $article = $('<div/>', { 'class': 'issue_article', 'id': $this.attr('id') }).append($del_article, $img_article, $title_article);

			$('.issue_column').eq(index).find('.add_item.article').before($article);
			$('.column_articles').sortable(articles_sort);
		});

});