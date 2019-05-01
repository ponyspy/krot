$(function() {
	var swiperH = new Swiper('.swiper-container', {
		// navigation: {
		// 	nextEl: '.slide_button.right',
		// 	prevEl: '.slide_button.left',
		// },
		slidesPerView: 'auto',
		initialSlide: $('.column_item.main').index() || 0,
		direction: 'horizontal',
		spaceBetween: 20,
		autoHeight: true,
		centeredSlides: true,
		loop: false
	});
});