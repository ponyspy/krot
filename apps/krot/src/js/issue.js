$(function() {
	var swiperH = new Swiper('.swiper-container', {
		// nextButton: '.swiper-button-next',
		// prevButton: '.swiper-button-prev',
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