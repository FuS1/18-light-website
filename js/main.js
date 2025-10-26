gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const sections = document.querySelectorAll(".topic-sec");
const dotNav = document.querySelector(".dot-nav");
const toolSec = document.querySelector(".tool-sec");

let currentSection = 0;
let isAnimating = false;
let isDesktop = window.innerWidth > 767.98;

// === NaviDots ===
sections.forEach((_, i) => {
  const dot = document.createElement("div");
  dot.classList.add("dot");
  if (i === 0) dot.classList.add("active");
  dotNav.appendChild(dot);

  dot.addEventListener("click", () => {
    if (isDesktop) goToSection(i);
    else scrollToSection(i);
  });
});

// === Desktop ===
if (isDesktop) {
  window.addEventListener("wheel", onWheel);

  // for touch
  let touchStartY = 0;
  let touchEndY = 0;

  window.addEventListener("touchstart", (e) => {
    touchStartY = e.changedTouches[0].clientY;
  });

  window.addEventListener("touchend", (e) => {
    touchEndY = e.changedTouches[0].clientY;
    handleTouchSwipe();
  });

  function onWheel(e) {
    if (isAnimating) return;

    syncCurrentSection();

    if (e.deltaY > 0 && currentSection < sections.length - 1) {
      goToSection(currentSection + 1);
    } else if (e.deltaY < 0 && currentSection > 0) {
      goToSection(currentSection - 1);
    }
  }

  function handleTouchSwipe() {
    if (isAnimating) return;

    syncCurrentSection();

    const swipeDistance = touchEndY - touchStartY;
    const swipeThreshold = 50; 

    if (swipeDistance < -swipeThreshold && currentSection < sections.length - 1) {
      goToSection(currentSection + 1);
    } else if (swipeDistance > swipeThreshold && currentSection > 0) {
      goToSection(currentSection - 1);
    }
  }
} else {
  // === Mobile ===
  document.body.style.overflow = "auto"; 
  dotNav.style.display = "none"; 
  toolSec.classList.add("active"); 
}


function goToSection(index) {
  if (isAnimating) return;
  isAnimating = true;

  gsap.to(window, {
    duration: 1,
    scrollTo: { y: sections[index], offsetY: 0 },
    onComplete: () => {
      isAnimating = false;
      currentSection = index;
      updateDots();
      updateToolBar();
    },
    ease: "power2.inOut"
  });
}

function scrollToSection(index) {
  const top = sections[index].offsetTop;
  window.scrollTo({ top, behavior: "smooth" });
}

function updateDots() {
  document.querySelectorAll(".dot").forEach((dot, i) => {
    dot.classList.toggle("active", i === currentSection);
  });
}

function updateToolBar() {
  if (currentSection === 0) {
    toolSec.classList.remove("active");
  } else {
    toolSec.classList.add("active");
  }
}


window.addEventListener("resize", () => {
  const nowDesktop = window.innerWidth > 767.98;
  if (nowDesktop !== isDesktop) location.reload();
});



// === Section Switch Function ===
function goToSection(index) {
  if (isAnimating) return;
  isAnimating = true;

  gsap.to(window, {
    duration: 1,
    scrollTo: { y: sections[index], offsetY: 0 },
    ease: "power2.inOut",
    onComplete: () => {
      isAnimating = false;
      currentSection = index;
      updateDots();
      updateToolBar();
    },
  });
}

function updateDots() {
  document.querySelectorAll(".dot").forEach((dot, i) => {
    dot.classList.toggle("active", i === currentSection);
  });
}

function updateToolBar() {
  if (currentSection === 0) {
    toolSec.classList.remove("active");
  } else {
    toolSec.classList.add("active");
  }
}

function syncCurrentSection() {
  let scrollY = window.scrollY;
  let closestIndex = 0;
  let minDiff = Infinity;

  sections.forEach((sec, i) => {
    const diff = Math.abs(sec.offsetTop - scrollY);
    if (diff < minDiff) {
      minDiff = diff;
      closestIndex = i;
    }
  });

  currentSection = closestIndex;
}

// === KV Section ===
gsap.set(".kv-sec-bg", {
  scale: 1.05,
  opacity: 0,
  filter: "blur(8px)"
});

gsap.to(".kv-sec-bg", {
  scale: 1.1,
  opacity: 1,
  filter: "blur(0px)",
  duration: 2,
  ease: "power2.out",
  scrollTrigger: {
    trigger: ".kv-sec",
    start: "top 80%",
    toggleActions: "restart none none reverse"
  }
});

const kvBg = document.querySelector(".kv-sec-bg");
const kvSec = document.querySelector(".kv-sec");

kvSec.addEventListener("mousemove", (e) => {
  const rect = kvSec.getBoundingClientRect();
  const relX = e.clientX - rect.left;
  const relY = e.clientY - rect.top;

  const moveX = (relX / rect.width - 0.5) * 2;
  const moveY = (relY / rect.height - 0.5) * 2;

  gsap.to(kvBg, {
    x: moveX * 30,       
    y: moveY * 30,       
    scale: 1.12,         
    duration: 0.6,
    ease: "power2.out"
  });
});

kvSec.addEventListener("mouseleave", () => {
  gsap.to(kvBg, {
    x: 0,
    y: 0,
    scale: 1.1,
    duration: 1,
    ease: "power2.out"
  });
});

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
    pagination: {
        el: ".gamesoft-slider-pagination",
        clickable: true,
        renderBullet: function (index, className) {
          return '<span class="' + className + '">' + "</span>";
        }
    },
});

// NaviDots Detected
let lastSyncTime = 0;

window.addEventListener("scroll", () => {
  if (!isDesktop) return;

  const now = Date.now();
  if (now - lastSyncTime < 200) return; 
  lastSyncTime = now;

  syncCurrentSection(); 
  updateDots();
  updateToolBar();
});