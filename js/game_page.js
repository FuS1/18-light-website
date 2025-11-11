document.addEventListener("DOMContentLoaded", function () {
  const swiper = new Swiper(".game-swiper", {
    slidesPerView: 1,
    loop: true,
    speed: 600,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    on: {
      slideChange: function () {
        updatePreviewActive(this.realIndex);
      },
    },
  });

  const previewLis = document.querySelectorAll(".game-page-slider-preview li");

  // 點擊縮圖切換對應 slide
  previewLis.forEach((li, index) => {
    li.addEventListener("click", () => {
      swiper.slideToLoop(index);
      updatePreviewActive(index);
      stopAutoplay();
    });
  });

  // 更新 active 狀態
  function updatePreviewActive(activeIndex) {
    previewLis.forEach((li, i) => {
      li.classList.toggle("active", i === activeIndex);
    });
  }

  // 停止 autoplay（手動操作後）
  function stopAutoplay() {
    if (swiper.autoplay.running) {
      swiper.autoplay.stop();
    }
  }

  // 使用者滑動時也停止 autoplay
  swiper.el.addEventListener("mousedown", stopAutoplay);
  swiper.el.addEventListener("touchstart", stopAutoplay);

  // 初始設定
  updatePreviewActive(0);
});