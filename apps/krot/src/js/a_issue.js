$(function() {
	var articles_sort = {
		placeholder: 'placeholder',
		cancel: '.add_item',
		connectWith: '.column_articles',
		sort: function(e) {
			$('.articles_list').removeClass('show');
		}
	};

	$('.column_articles').sortable(articles_sort);

	$('.issue_colums').sortable({
		placeholder: 'placeholder',
		cancel: '.add_item',
		sort: function(e) {
			$('.articles_list').removeClass('show');
		}
	});

	$(document)
		.on('click', '.add_item.article', function(e) {
			var index = $(this).closest('.issue_column').index();

			$('.articles_list').addClass('show').attr('index', index);
			$('.add_item.article').removeClass('select').filter(this).addClass('select');
		})
		.on('click', '.add_item.column', function(e) {
			$('.issue_column').first().clone().find('.issue_article').remove().end().insertBefore(this);
		})
		.on('click', '.delete_item.column', function(e) {
			$('.issue_column').length > 1 && $(this).closest('.issue_column').remove();
		})
		.on('click', '.delete_item.article', function(e) {
			$(this).parent().remove();
		})
		.on('click', '.list_item', function(e) {
			var index = $('.articles_list').attr('index');

			var $del_article = $('<div/>', { 'class': 'delete_item article' });
			var $article = $('<div/>', { 'class': 'issue_article', 'text': $(this).text() }).append($del_article);

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