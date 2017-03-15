$(function() {
	var swiperH = new Swiper('.swiper-container', {
		nextButton: '.slide_button.right',
		prevButton: '.slide_button.left',
		slidesPerView: 'auto',
		initialSlide: $('.column_item.main').index() || 0,
		direction: 'horizontal',
		spaceBetween: 20,
		autoHeight: true,
		centeredSlides: true,
		keyboardControl: true,
		loop: false,
		// runCallbacksOnInit: false,
	});
});