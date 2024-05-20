(function () {
	function swiperInit() {
		subSliderInit(true);
		sliderInit(true);
	}

	document.addEventListener('shopify:section:load', function (e) {
		swiperInit();
	});

	swiperInit();
})();
