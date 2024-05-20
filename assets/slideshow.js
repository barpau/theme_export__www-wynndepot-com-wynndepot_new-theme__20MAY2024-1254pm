(() => {
  const initSliders = () => {
    const slideshows = document.querySelectorAll(".slideshow__swiper");
    slideshows.forEach((slideshow) => {
      const autoplay =
        slideshow.getAttribute("data-autoplay") === "true" ? true : false;
      const slideshowSwiper = new Swiper(slideshow, {
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        loop: true,
        autoHeight: false,
        allowTouchMove: true,
      });
      if (autoplay) {
        slideshowSwiper.autoplay.run();
        slideshowSwiper.autoplay.running = true;

        slideshow.addEventListener("mouseenter", () => {
          slideshowSwiper.autoplay.pause();
        });
        slideshow.addEventListener("mouseleave", () => {
          slideshowSwiper.autoplay.run();
        });
      }
      if (slideshowSwiper.addSlide.length < 2) {
        slideshowSwiper.allowTouchMove = false;
      } else {
        slideshowSwiper.allowTouchMove = true;
      }
      if (slideshowSwiper.addSlide.length > 1)
        slideshow.classList.add("slideshow__swiper--multiple-slides");
    });
  };

  const updateImages = () => {
    const images = document.querySelectorAll('.slideshow__image');
    images.forEach(image => {
      const isMobile = window.matchMedia("(max-width: 480px)").matches;
      const mobileImage = image.getAttribute('data-mobile-image');
      const desktopImage = image.getAttribute('data-desktop-image');
      
      if (isMobile) {
        image.setAttribute('src', mobileImage);
      } else {
        image.setAttribute('src', desktopImage);
      }
    });
  };

  document.addEventListener('DOMContentLoaded', function() {
    updateImages();
    initSliders();
  });

  window.addEventListener('resize', updateImages);
  
  document.addEventListener("shopify:section:load", function () {
    initSliders();
  });
})();
