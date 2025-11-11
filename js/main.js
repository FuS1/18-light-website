let mainSwiper, previewSwiper, youtubePlayer;

// === YouTube API Ready ===
function onYouTubeIframeAPIReady() {
  youtubePlayer = new YT.Player("youtubePlayer", {
    events: {
      onStateChange: onPlayerStateChange,
    },
  });
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.PLAYING) {
    if (mainSwiper && mainSwiper.autoplay.running) {
      mainSwiper.autoplay.stop();
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  // === Preview Swiper ===
  previewSwiper = new Swiper(".game-page-slider-preview", {
    loop: false,
    slidesPerView: 10,
    spaceBetween: 10,
    centeredSlides: true,
    watchSlidesProgress: true,
    slideToClickedSlide: true,
    freeMode: false,
    breakpoints: {
      0: { slidesPerView: 3 },
      768: { slidesPerView: 5 },
      1200: { slidesPerView: 10 },
    },
  });

  // === Main Swiper ===
  mainSwiper = new Swiper(".topic-sec.game-page-sec", {
    slidesPerView: 1,
    loop: false,
    speed: 600,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    on: {
      slideChange: function () {
        syncPreviewActive(this.realIndex);
      },
    },
  });

  // === Click Preview to Switch ===
  previewSwiper.on("click", (swiper) => {
    const clickedIndex = swiper.clickedIndex;
    if (typeof clickedIndex !== "undefined") {
      mainSwiper.slideToLoop(clickedIndex);
      stopAutoplay();
      syncPreviewActive(clickedIndex);
    }
  });

  function syncPreviewActive(index) {
    previewSwiper.slides.forEach((slide, i) => {
      slide.classList.toggle("active", i % previewSwiper.slides.length === index);
    });
    previewSwiper.slideToLoop(index);
  }

  function stopAutoplay() {
    if (mainSwiper.autoplay.running) {
      mainSwiper.autoplay.stop();
    }
  }

  [mainSwiper.el, previewSwiper.el].forEach((el) => {
    el.addEventListener("mousedown", stopAutoplay);
    el.addEventListener("touchstart", stopAutoplay);
  });

  syncPreviewActive(0);
});

// Effect
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const sections = document.querySelectorAll(".topic-sec");
// const dotNav = document.querySelector(".dot-nav");
const toolSec = document.querySelector(".tool-sec");

let currentSection = 0;
let isAnimating = false;
let isDesktop = window.innerWidth > 767.98;

// === Game Soft Section ===
const gameSoftSecs = document.querySelectorAll(".game-soft-sec");

gameSoftSecs.forEach((sec) => {
  const bg = sec.querySelector(".game-soft-sec-bg");
  if (!bg) return;

  // Timeline
  const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.2, paused: true });

  // Backgrouind Effect
  tl.fromTo(bg, 
    { opacity: 0, scale: 1, filter: "blur(10px) brightness(0.6)" },
    { opacity: 1, scale: 1.1, filter: "blur(0px) brightness(1)", duration: 1.2, ease: "power2.out" }
  )
  .to(bg, 
    { scale: 1.2, rotate: "3deg", duration: 8, ease: "sine.inOut" }
  )
  .to(bg, 
    { filter: "blur(2px) brightness(1.8)", duration: .8, ease: "sine.inOut" }
  )
  .to(bg, 
    { opacity: 0, scale: 1.4, filter: "blur(10px) brightness(2)", duration: .7, ease: "power2.in" }
  );

  ScrollTrigger.create({
    trigger: sec,
    start: "top center",
    end: "bottom center",
    onEnter: () => tl.play(),
    onLeave: () => tl.pause(0),
    onEnterBack: () => tl.play(),
    onLeaveBack: () => tl.pause(0),
  });
});

// About Gallery 
let aboutGallery = new Swiper(".about-gallery", {
    effect: "flip",
    autoplay: {
        delay: 2500,
        disableOnInteraction: true,
    },
});

// Game Soft Slider 
let gameDemoSlider = new Swiper(".gamesoft-demo-slider", {
    spaceBetween: 30,
    autoplay: {
        delay: 2500,
        disableOnInteraction: true,
    },
});

// NaviDots Detected
// let lastSyncTime = 0;

// window.addEventListener("scroll", () => {
//   if (!isDesktop) return;

//   const now = Date.now();
//   if (now - lastSyncTime < 200) return; 
//   lastSyncTime = now;

//   syncCurrentSection(); 
//   updateDots();
//   updateToolBar();
// });