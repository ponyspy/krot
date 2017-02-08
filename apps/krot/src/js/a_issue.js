$(function() {
	var articles_sort = {
		placeholder: 'placeholder',
		cancel: '.add_item',
		connectWith: '.column_articles',
		sort: function(e) {
			$('.articles_list').removeAttr('index').removeClass('show');
			$('.add_item').removeClass('select');
		}
	};

	var columns_sort = {
		placeholder: 'placeholder',
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
			$(column).find('.issue_article').toArray().forEach(function(article, j) {
				$('<input />').attr('type', 'hidden')
											.attr('name', 'columns' + '[' + i + ']' + '[articles][' + j + ']')
											.attr('value', $(article).attr('id'))
											.appendTo('form');
			});
		});

		this.submit();
	});

	$(document)

		.on('click', '.add_item.article', function(e) {
			var self = this;
			var index = $(self).closest('.issue_column').index();

			$.post('/admin/issues/get_articles', { context: { text: '' } }, function(data) {
				$('.add_item.article').removeClass('select').filter(self).addClass('select');
				$('.articles_list').addClass('show').children('.list_items').empty().append(data).end()
																						.attr('index', index);
			});
		})

		.on('click', '.add_item.column', function(e) {
			$('.issue_column').first().clone()
																.find('.issue_article').remove().end()
																.find('.add_item').removeClass('select').end()
																.insertBefore(this);
		})

		.on('click', '.delete_item.column', function(e) {
			$('.issue_column').length > 1 && $(this).closest('.issue_column').remove();
		})

		.on('click', '.delete_item.article', function(e) {
			$(this).parent().remove();
		})

		.on('click', '.list_item', function(e) {
			var $this = $(this);
			var index = $('.articles_list').attr('index');

			var $del_article = $('<div/>', { 'class': 'delete_item article' });
			var $article = $('<div/>', { 'class': 'issue_article', 'id': $this.attr('id'), 'text': $this.text() }).append($del_article);

			$('.issue_column').eq(index).find('.add_item.article').before($article);
			$('.column_articles').sortable(articles_sort);
		})

		.on('mouseup', function(e) {
			if (!/delete_item|add_item|list_item|list_search/.test(event.target.className)) {
				$('.articles_list').removeAttr('index').removeClass('show');
				$('.add_item').removeClass('select');
			}
		});

});