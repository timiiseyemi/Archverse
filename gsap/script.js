/* ============================================
   STILL MIND - script.js
   ============================================ */

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, Flip, ScrambleTextPlugin);
ScrollTrigger.normalizeScroll(true);

// ── ScrollSmoother ────────────────────────────────────
const smoother = ScrollSmoother.create({
  wrapper: "#smooth-wrapper",
  content: "#smooth-content",
  smooth: 1.5,
  effects: true,
  smoothTouch: 0.1,
});

window.addEventListener("load", () => {
  ScrollTrigger.refresh();
});

document.addEventListener("DOMContentLoaded", () => {

  const navbar = document.querySelector(".navbar");

  // ── Pill image carousel ───────────────────────────────
  const slides = document.querySelectorAll('.pill-slide');
  let current = 0;

  if (slides.length) {
    setInterval(() => {
      slides[current].classList.remove('active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('active');
    }, 900);
  }

  // ── Navbar shadow ─────────────────────────────────────
  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
      navbar.style.boxShadow = "0 2px 20px rgba(26,26,24,0.08)";
    } else {
      navbar.style.boxShadow = "none";
    }
  }, { passive: true });

  // ── Scroll button ─────────────────────────────────────
  const scrollDownBtn = document.querySelector(".scroll-down-btn");
  if (scrollDownBtn) {
    scrollDownBtn.addEventListener("click", () => {
      const firstSection = document.querySelector(".marquee-section");
      if (firstSection) {
        smoother.scrollTo(firstSection, true, "top top");
      }
    });
  }

  // ── CTA hover ─────────────────────────────────────────
  const ctaPrimary = document.querySelector(".cta-primary");
  if (ctaPrimary) {
    ctaPrimary.addEventListener("mouseenter", () => {
      ctaPrimary.style.boxShadow = "none ";
    });
    ctaPrimary.addEventListener("mouseleave", () => {
      ctaPrimary.style.boxShadow = "none";
    });
  }

  // ── Marquee section ───────────────────────────────────
  const marqueeSection = document.querySelector(".marquee-section");
  const marqueeImgWrap = document.querySelector(".marquee-img-wrap");
  const marqueeWords = document.querySelector(".marquee-words");
  const marqueeImgText = document.querySelector(".marquee-img-text");
  const scrambleText = document.querySelector(".scramble-text");
  const panels = marqueeSection ? gsap.utils.toArray(marqueeSection.querySelectorAll(".panel")) : [];
  const scrambleChars = "\uff71\uff72\uff73\uff74\uff75\uff76\uff77\uff78\uff79\uff7a\uff7b\uff7c\uff7d\uff7e\uff7f";
  const runScramble = (target, text) => {
    if (!target || target.dataset.scrambled === "true") return;

    target.dataset.scrambled = "true";
    target.classList.add("is-scrambling");
    gsap.to(target, {
      duration: 1,
      scrambleText: {
        text,
        chars: scrambleChars,
        speed: 0.4,
        revealDelay: 0.1,
      },
      onComplete: () => {
        target.classList.remove("is-scrambling");
      },
    });
  };

  if (marqueeSection && marqueeImgWrap) {

    marqueeSection.classList.add("is-visible");
    gsap.set(panels, {
      autoAlpha: 1,
      visibility: "hidden",
      clipPath: "inset(100% 0% 0% 0%)",
      force3D: true,
      zIndex: 10,
    });

    gsap.set(".panel-img-wrap", {
      force3D: true,
    });

    gsap.set(".panel-img-wrap img", {
      force3D: true,
    });

    gsap.set(".panel-copy", {
      autoAlpha: 0,
    });

    gsap.set(".panel-link", {
      autoAlpha: 0,
    });

    // 🔥 MAIN TIMELINE (PIN + ANIMATION)
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: marqueeSection,
        start: "top top",
        end: () => `+=${(panels.length + 7) * window.innerHeight}`,
        scrub: 2,
        pin: true,
        pinType: "transform",
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      }
    });

    // Phase 1: zoom image
    tl.to(marqueeImgWrap, {
      width: "100vw",
      height: "100vh",
      borderRadius: 0,
      ease: "none",
      duration: 1,
    }, 0);

    // Phase 2: fade out words
    tl.to(marqueeWords, {
      opacity: 0,
      ease: "none",
      duration: 0.3,
    }, 0);

    // Phase 3: reveal overlay text
    tl.to(marqueeImgText, {
      opacity: 1,
      ease: "none",
      duration: 0.4,
    }, 0.6);

    // 🔥 Phase 4: SCRAMBLE TEXT (THIS IS THE NEW PART)
    if (scrambleText) {
      tl.call(() => {
        runScramble(scrambleText, "My Hero Academia ");
      }, null, ">");
      /*
      tl.to(scrambleText, {
  duration: 1,
  scrambleText: {
    text: "My Hero Academia ",
    chars: "あいうえおかきくけこさしすせそたちつてとなにぬねのアイウ",
          chars: scrambleChars,
    speed: 0.4,
    revealDelay: 0.1,
        }
      }, ">");
      */
    }

    tl.to(marqueeImgText, {
      autoAlpha: 0,
      ease: "none",
      duration: 0.25,
    }, ">");

    panels.forEach((panel, index) => {
      const panelImgWrap = panel.querySelector(".panel-img-wrap");
      const panelImg = panel.querySelector(".panel-img-wrap img");
      const panelCopy = panel.querySelector(".panel-copy");
      const panelLink = panel.querySelector(".panel-link");
      const panelTitle = panel.querySelector(".panel-title");
      const panelTitleText = panelTitle ? panelTitle.dataset.title || panelTitle.textContent : "";

      tl.to(panel, {
        visibility: "visible",
        clipPath: "inset(0% 0% 0% 0%)",
        ease: "power2.inOut",
        duration: 2,
      }, ">")
      .to(panelImg, {
        scale: 1.04,
        ease: "power2.inOut",
        duration: 2,
      }, "<")
      .to(panelCopy, {
        autoAlpha: 1,
        ease: "power2.out",
        duration: 0.7,
      }, "<1.1")
      .to(panelLink, {
        autoAlpha: 0.8,
        ease: "power2.out",
        duration: 0.7,
      }, "<");

      if (panelTitle) {
        tl.call(() => {
          runScramble(panelTitle, panelTitleText);
        }, null, ">");
      }

      tl.to(panel, {
        autoAlpha: 1,
        ease: "none",
        duration: 0.9,
      });
    });
  }

  const holdSections = gsap.utils.toArray([
    ".hero",
    ".featured-arcs",
    ".character-lineup",
    ".replaying",
    ".manga-gallery",
    ".anime-drops",
    ".fan-wall",
  ].join(", "));

  holdSections.forEach((section) => {
    ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: () => `+=${Math.min(window.innerHeight * 0.35, 360)}`,
      pin: true,
      pinSpacing: true,
      pinType: "transform",
      anticipatePin: 1,
      invalidateOnRefresh: true,
    });
  });

  gsap.utils.toArray(".section-scramble").forEach((heading) => {
    const finalText = heading.dataset.scrambleText || heading.textContent;
    gsap.set(heading, {
      autoAlpha: 0,
      filter: "blur(8px)",
      y: 20,
    });

    ScrollTrigger.create({
      trigger: heading,
      start: "top 80%",
      once: true,
      onEnter: () => {
        gsap.to(heading, {
          autoAlpha: 1,
          filter: "blur(0px)",
          y: 0,
          duration: 0.45,
          ease: "power2.out",
          onStart: () => {
            heading.textContent = finalText;
          },
          onComplete: () => runScramble(heading, finalText),
        });
      },
    });
  });

  const revealSections = [
    {
      section: ".featured-arcs",
      items: ".featured-arcs-header, .arc-card",
    },
    {
      section: ".character-lineup",
      items: ".lineup-header, .character-card",
    },
    {
      section: ".replaying",
      items: ".battles-header, .battle-row",
    },
    {
      section: ".manga-gallery",
      items: ".manga-header, .manga-panel",
    },
    {
      section: ".anime-drops",
      items: ".drops-header, .drop-card",
    },
    {
      section: ".fan-wall",
      items: ".fan-wall-header, .fan-quote, .fan-image",
    },
    {
      section: ".site-footer",
      items: ".footer-brand, .footer-column, .footer-bottom",
    },
  ];

  revealSections.forEach(({ section, items }) => {
    const sectionEl = document.querySelector(section);
    if (!sectionEl) return;

    const revealItems = gsap.utils.toArray(sectionEl.querySelectorAll(items));

    gsap.set(revealItems, {
      autoAlpha: 0,
      y: 34,
      filter: "blur(8px)",
    });

    const revealTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionEl,
        start: "top 78%",
        once: true,
      },
    });

    revealTl
      .to(revealItems, {
        autoAlpha: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.85,
        ease: "power3.out",
        stagger: 0.09,
        clearProps: "transform,filter,opacity,visibility",
      });
  });

  const featuredArcs = document.querySelector(".featured-arcs");
  const arcCards = featuredArcs ? gsap.utils.toArray(featuredArcs.querySelectorAll(".arc-card")) : [];

  arcCards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      featuredArcs.style.setProperty("--arc-bg", `url("${card.dataset.bg}")`);
      featuredArcs.style.setProperty("--arc-bg-opacity", "1");
      featuredArcs.classList.add("is-bg-active");
    });

    card.addEventListener("mouseleave", () => {
      featuredArcs.style.setProperty("--arc-bg-opacity", "0");
      featuredArcs.classList.remove("is-bg-active");
    });
  });

  const replayingSection = document.querySelector(".replaying");
  const battleList = replayingSection ? replayingSection.querySelector(".battle-list") : null;
  const battleBgReveal = replayingSection ? replayingSection.querySelector(".battle-bg-reveal") : null;
  const battleBgImg = battleBgReveal ? battleBgReveal.querySelector("img") : null;
  const battleRows = battleList ? gsap.utils.toArray(battleList.querySelectorAll(".battle-row")) : [];

  if (replayingSection && battleList && battleBgReveal && battleBgImg && battleRows.length) {
    gsap.set(battleBgReveal, { autoAlpha: 0 });
    gsap.set(battleBgImg, { scale: 1.08 });

    battleRows.forEach((row) => {
      row.addEventListener("mouseenter", () => {
        const rowImage = row.querySelector("img");
        const nextImage = rowImage ? rowImage.getAttribute("src") : "";

        if (nextImage && battleBgImg.getAttribute("src") !== nextImage) {
          gsap.to(battleBgImg, {
            autoAlpha: 0,
            duration: 0.18,
            ease: "power2.out",
            onComplete: () => {
              battleBgImg.src = nextImage;
              gsap.fromTo(battleBgImg, {
                autoAlpha: 0,
                scale: 1.12,
              }, {
                autoAlpha: 1,
                scale: 1.06,
                duration: 0.65,
                ease: "power3.out",
              });
            },
          });
        } else {
          gsap.to(battleBgImg, {
            autoAlpha: 1,
            scale: 1.06,
            duration: 0.65,
            ease: "power3.out",
          });
        }

        gsap.to(battleBgReveal, {
          autoAlpha: 1,
          duration: 0.45,
          ease: "power2.out",
        });
      });
    });

    battleList.addEventListener("mouseleave", () => {
      gsap.to(battleBgReveal, {
        autoAlpha: 0,
        duration: 0.5,
        ease: "power2.out",
      });
      gsap.to(battleBgImg, {
        scale: 1.1,
        duration: 0.5,
        ease: "power2.out",
      });
    });
  }

  const animeDrops = document.querySelector(".anime-drops");
  const dropReveal = animeDrops ? animeDrops.querySelector(".drop-hover-reveal") : null;
  const dropRevealImg = dropReveal ? dropReveal.querySelector("img") : null;
  const dropCards = animeDrops ? gsap.utils.toArray(animeDrops.querySelectorAll(".drop-card")) : [];

  if (animeDrops && dropReveal && dropRevealImg && dropCards.length) {
    dropCards.forEach((card) => {
      const imageSrc = card.dataset.revealImage;
      if (!imageSrc) return;

      const img = new Image();
      img.src = imageSrc;
    });

    gsap.set(dropReveal, {
      xPercent: -50,
      yPercent: -50,
      autoAlpha: 0,
      scale: 0.98,
      clipPath: "circle(0% at 50% 50%)",
    });

    const revealX = gsap.quickTo(dropReveal, "x", {
      duration: 0.7,
      ease: "power3.out",
    });
    const revealY = gsap.quickTo(dropReveal, "y", {
      duration: 0.7,
      ease: "power3.out",
    });
    let revealOpen = false;

    const moveReveal = (event) => {
      const bounds = animeDrops.getBoundingClientRect();
      revealX(event.clientX - bounds.left + 26);
      revealY(event.clientY - bounds.top - 18);
    };

    const hideReveal = () => {
      revealOpen = false;
      gsap.to(dropReveal, {
        autoAlpha: 0,
        scale: 0.98,
        clipPath: "circle(0% at 50% 50%)",
        duration: 0.38,
        ease: "power3.inOut",
      });
    };

    const showReveal = () => {
      if (revealOpen) return;

      revealOpen = true;
      gsap.fromTo(dropReveal, {
        autoAlpha: 0,
        scale: 0.98,
        clipPath: "circle(0% at 50% 50%)",
      }, {
        autoAlpha: 1,
        scale: 1,
        clipPath: "circle(74% at 50% 50%)",
        duration: 0.55,
        ease: "power3.out",
      });
    };

    const swapDropRevealImage = (nextImage) => {
      if (!nextImage || dropRevealImg.getAttribute("src") === nextImage) return;

      gsap.killTweensOf(dropRevealImg);
      dropRevealImg.src = nextImage;
      gsap.fromTo(dropRevealImg, {
        autoAlpha: 0.55,
        scale: 1.1,
      }, {
        autoAlpha: 1,
        scale: 1.05,
        duration: 0.22,
        ease: "power2.out",
      });
    };

    dropCards.forEach((card) => {
      card.addEventListener("mouseenter", (event) => {
        swapDropRevealImage(card.dataset.revealImage);
        moveReveal(event);
        showReveal();
      });

      card.addEventListener("mousemove", (event) => {
        moveReveal(event);
        showReveal();
      });
    });

    animeDrops.querySelector(".drops-list").addEventListener("mouseleave", hideReveal);
  }

});

// ── Mouse Cursor ─────────────────────────────
gsap.set(".ball", { xPercent: -50, yPercent: -50 });

const ball = document.querySelector(".ball");
const hero = document.querySelector(".hero");
const ballHiddenTargets = document.querySelectorAll(".hero button, .hero a, .headline-image-pill");

const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
const mouse = { x: pos.x, y: pos.y };
const speed = 0.08;

const xSet = gsap.quickSetter(ball, "x", "px");
const ySet = gsap.quickSetter(ball, "y", "px");

window.addEventListener("mousemove", (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});

hero.addEventListener("mouseenter", () => { ball.style.opacity = "1"; });
hero.addEventListener("mouseleave", () => { ball.style.opacity = "0"; });

ballHiddenTargets.forEach((target) => {
  target.addEventListener("mouseenter", () => { ball.style.opacity = "0"; });
  target.addEventListener("mouseleave", () => { ball.style.opacity = "1"; });
});

gsap.ticker.add(() => {
  const dt = 1.0 - Math.pow(1.0 - speed, gsap.ticker.deltaRatio());
  pos.x += (mouse.x - pos.x) * dt;
  pos.y += (mouse.y - pos.y) * dt;
  xSet(pos.x);
  ySet(pos.y);

});
