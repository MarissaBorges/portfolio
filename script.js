// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const hasFinePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)",
  ).matches;

  // =========================================================
  // 1. I18N DICTIONARY & EXPANDING BUBBLE WAVE ENGINE
  // =========================================================
  const TRANSLATIONS = {
    en: {
      "meta.title": "Borges — Python Developer",
      "nav.home": "Home",
      "nav.about": "About",
      "nav.projects": "Projects",
      "nav.contact": "Contact",
      "hero.bg": "Python Developer",
      "hero.greeting": "Hi, I'm Borges",
      "hero.desc":
        "A Systems Analysis and Development student, driven by the curiosity to understand how things work.",
      "hero.ctaPrimary": "Explore my work",
      "hero.ctaSecondary": "GitHub",
      "hero.scroll": "Scroll",
      "hero.cornerRole": "MARISSA BORGES · PYTHON & AI",
      "about.chatTitle": "What would you like to know about Borges?",
      "about.btnExperiences": "Experiences",
      "about.btnAbout": "About",
      "about.btnStack": "Stack",
      "about.btnProjects": "Projects",
      "projects.heading": "Projects",
      "projects.view": "View Project →",
      "contact.heading": "Contact",
    },
    pt: {
      "meta.title": "Borges — Desenvolvedora Python",
      "nav.home": "Início",
      "nav.about": "Sobre",
      "nav.projects": "Projetos",
      "nav.contact": "Contato",
      "hero.bg": "Desenvolvedora Python",
      "hero.greeting": "Olá, eu sou Borges",
      "hero.desc":
        "Estudante de Análise e Desenvolvimento de Sistemas, movida pela curiosidade de entender como as coisas funcionam.",
      "hero.ctaPrimary": "Explorar projetos",
      "hero.ctaSecondary": "GitHub",
      "hero.scroll": "Rolar",
      "hero.cornerRole": "MARISSA BORGES · PYTHON & IA",
      "about.chatTitle": "O que você quer saber sobre a Borges?",
      "about.btnExperiences": "Experiências",
      "about.btnAbout": "Sobre",
      "about.btnStack": "Stack",
      "about.btnProjects": "Projetos",
      "projects.heading": "Projetos",
      "projects.view": "Ver Projeto →",
      "contact.heading": "Contato",
    },
  };

  const CHAT_RESPONSES = {
    en: {
      experiences: [
        "Borges has worked as an apprentice at HPE, was an apprentice at São Nicolau Hospital, and has now evolved to a Technician role.",
        "With a strong track record early in her career, she has worked across industrial and hospital IT environments and recently earned a promotion.",
      ],
      about: [
        "She is a Systems Analysis and Development student driven by curiosity and a passion for understanding how things work under the hood.",
      ],
      stack: [
        "Her main stack spans Python, Django, FastAPI, LangChain, RAG pipelines, Playwright automation, PostgreSQL, Docker, and GSAP.",
      ],
      projects: [
        "Scroll down to the Projects section to explore her real systems: OROS, Tallenn, Help na Escolha, and Signa!",
      ],
    },
    pt: {
      experiences: [
        "Borges atuou como aprendiz na HPE, foi aprendiz no Hospital São Nicolau e evoluiu para o cargo de Técnica em TI.",
        "Com uma trajetória sólida no início da carreira, acumulou experiência em ambientes corporativos e hospitalares e conquistou uma promoção recente.",
      ],
      about: [
        "Estudante de Análise e Desenvolvimento de Sistemas movida pela curiosidade e pela vontade de entender como os sistemas funcionam por baixo dos panos.",
      ],
      stack: [
        "Sua stack principal envolve Python, Django, FastAPI, LangChain, pipelines RAG, automação com Playwright, PostgreSQL, Docker e GSAP.",
      ],
      projects: [
        "Role até a seção de Projetos para conhecer os sistemas reais em desenvolvimento: OROS, Tallenn, Help na Escolha e Signa!",
      ],
    },
  };

  let currentLang = "en";
  try {
    const savedLang = localStorage.getItem("borges-lang");
    if (savedLang === "pt" || savedLang === "en") {
      currentLang = savedLang;
    }
  } catch (_) {
    /* localStorage optional */
  }

  const langToggle = document.getElementById("langToggle");
  const langBubble = document.getElementById("langWaveBubble");
  let activeWaveTl = null;
  const heroNodeWave = { active: false, x: 0, y: 0, radius: 0, prevRadius: 0 };

  function applyToggleState(lang) {
    if (!langToggle) return;
    langToggle.setAttribute("data-lang", lang);
    langToggle.querySelectorAll(".lang-option").forEach((opt) => {
      opt.classList.toggle("is-active", opt.dataset.code === lang);
    });
    document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
    document.title = TRANSLATIONS[lang]["meta.title"];
  }

  function applyTranslationsImmediate(lang) {
    const dict = TRANSLATIONS[lang];
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });
    applyToggleState(lang);
  }

  function swapElementWithRipple(el, newText) {
    gsap.killTweensOf(el, "opacity,y,filter");
    el.classList.add("i18n-wave-hit");

    const tl = gsap.timeline({
      onComplete: () => {
        el.classList.remove("i18n-wave-hit");
        gsap.set(el, { clearProps: "filter" });
      },
    });

    tl.to(el, {
      opacity: 0.15,
      y: -5,
      filter: "blur(4px)",
      duration: 0.13,
      ease: "power2.in",
      onComplete: () => {
        el.textContent = newText;
        if (el.classList.contains("nav-link")) {
          updateNavIndicator(false);
        }
      },
    }).to(el, {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 0.32,
      ease: "expo.out",
    });
  }

  function switchLanguageWithWave(targetLang, originEl) {
    if (targetLang === currentLang) return;
    currentLang = targetLang;
    try {
      localStorage.setItem("borges-lang", targetLang);
    } catch (_) {
      /* ignore */
    }

    const dict = TRANSLATIONS[targetLang];
    applyToggleState(targetLang);

    if (prefersReducedMotion || !langBubble || !originEl) {
      applyTranslationsImmediate(targetLang);
      updateNavIndicator(false);
      return;
    }

    if (activeWaveTl) {
      activeWaveTl.kill();
    }

    const originRect = originEl.getBoundingClientRect();
    const cx = originRect.left + originRect.width / 2;
    const cy = originRect.top + originRect.height / 2;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const maxRadius =
      Math.hypot(Math.max(cx, vw - cx), Math.max(cy, vh - cy)) + 90;

    // Gather all translatable elements and compute their exact radial distance
    const onscreenTargets = [];
    const offscreenTargets = [];

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const nextText = dict[key];
      if (!nextText) return;

      const rect = el.getBoundingClientRect();
      const isVisible =
        rect.width > 0 &&
        rect.height > 0 &&
        rect.bottom > -120 &&
        rect.top < vh + 120;

      if (isVisible) {
        const elCx = rect.left + rect.width / 2;
        const elCy = rect.top + rect.height / 2;
        const dist = Math.hypot(elCx - cx, elCy - cy);
        onscreenTargets.push({ el, nextText, dist, swapped: false });
      } else {
        offscreenTargets.push({ el, nextText });
      }
    });

    onscreenTargets.sort((a, b) => a.dist - b.dist);

    // Position the 100px base circle centered on the button
    gsap.set(langBubble, {
      left: cx,
      top: cy,
      xPercent: -50,
      yPercent: -50,
      scale: 0.05,
      opacity: 0.92,
      force3D: true,
    });

    const waveProxy = { radius: 0 };
    let offscreenSwapped = false;
    heroNodeWave.active = true;
    heroNodeWave.x = cx;
    heroNodeWave.y = cy;
    heroNodeWave.radius = 0;
    heroNodeWave.prevRadius = 0;

    activeWaveTl = gsap.timeline({
      onComplete: () => {
        // Safety net: ensure every element finished swapping
        onscreenTargets.forEach((item) => {
          if (!item.swapped) {
            item.swapped = true;
            item.el.textContent = item.nextText;
          }
        });
        if (!offscreenSwapped) {
          offscreenTargets.forEach(({ el, nextText }) => {
            el.textContent = nextText;
          });
        }
        heroNodeWave.active = false;
        gsap.set(langBubble, { opacity: 0, scale: 0 });
        updateNavIndicator(true);
        activeWaveTl = null;
      },
    });

    activeWaveTl
      .to(
        waveProxy,
        {
          radius: maxRadius,
          duration: 0.92,
          ease: "power2.inOut",
          onUpdate: () => {
            const currentR = waveProxy.radius;
            heroNodeWave.prevRadius = heroNodeWave.radius;
            heroNodeWave.radius = currentR;
            const scaleFactor = (currentR * 2) / 100;
            gsap.set(langBubble, { scale: scaleFactor, force3D: true });

            for (let i = 0; i < onscreenTargets.length; i++) {
              const item = onscreenTargets[i];
              if (!item.swapped && currentR >= item.dist) {
                item.swapped = true;
                swapElementWithRipple(item.el, item.nextText);
              }
            }

            if (!offscreenSwapped && currentR >= maxRadius * 0.45) {
              offscreenSwapped = true;
              offscreenTargets.forEach(({ el, nextText }) => {
                el.textContent = nextText;
              });
            }
          },
        },
        0,
      )
      .to(
        langBubble,
        {
          opacity: 0,
          duration: 0.34,
          ease: "power2.out",
        },
        0.58,
      );
  }

  // Apply persisted language immediately on initial load
  applyTranslationsImmediate(currentLang);

  if (langToggle) {
    langToggle.addEventListener("click", () => {
      const nextLang = currentLang === "en" ? "pt" : "en";
      switchLanguageWithWave(nextLang, langToggle);
    });
  }

  // =========================================================
  // 2. FLOATING NAV, ACTIVE INDICATOR & SCROLL PROGRESS
  // =========================================================
  const topMenu = document.getElementById("topMenu");
  const navLinks = Array.from(document.querySelectorAll(".nav-link"));
  const navIndicator = document.getElementById("navIndicator");
  const scrollProgress = document.getElementById("scrollProgress");
  let activeNavSection = "Home";

  function updateNavIndicator(animate = true) {
    if (!navIndicator) return;
    const activeLink = navLinks.find(
      (link) => link.dataset.section === activeNavSection,
    );
    if (!activeLink || activeLink.offsetWidth === 0) return;

    const targetX = activeLink.offsetLeft;
    const targetW = activeLink.offsetWidth;

    if (animate && !prefersReducedMotion) {
      gsap.to(navIndicator, {
        x: targetX,
        width: targetW,
        opacity: 1,
        duration: 0.45,
        ease: "expo.out",
        overwrite: "auto",
      });
    } else {
      gsap.set(navIndicator, {
        x: targetX,
        width: targetW,
        opacity: 1,
      });
    }
  }

  function setActiveNav(sectionId) {
    if (activeNavSection === sectionId) return;
    activeNavSection = sectionId;
    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.dataset.section === sectionId);
    });
    updateNavIndicator(true);
  }

  // Scrolled header background state
  ScrollTrigger.create({
    start: 40,
    onEnter: () => topMenu && topMenu.classList.add("is-scrolled"),
    onLeaveBack: () => topMenu && topMenu.classList.remove("is-scrolled"),
  });

  // Reading progress hairline
  if (scrollProgress) {
    gsap.to(scrollProgress, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.15,
      },
    });
  }

  // Track active section in nav
  ["Home", "About", "Projects", "Contact"].forEach((id) => {
    const sec = document.getElementById(id);
    if (!sec) return;
    ScrollTrigger.create({
      trigger: sec,
      start: "top 45%",
      end: "bottom 45%",
      onEnter: () => setActiveNav(id),
      onEnterBack: () => setActiveNav(id),
    });
  });

  // =========================================================
  // 3. HERO ENTRANCE CHOREOGRAPHY & MULTI-LAYER PARALLAX
  // =========================================================
  const exploreWorkBtn = document.getElementById("exploreWorkBtn");
  if (exploreWorkBtn) {
    exploreWorkBtn.addEventListener("click", () => {
      const target = document.getElementById("Projects");
      if (target) {
        target.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
        });
      }
    });
  }

  if (!prefersReducedMotion) {
    const heroTl = gsap.timeline({ defaults: { ease: "expo.out" } });

    heroTl
      .fromTo(
        ".top-menu",
        { y: -24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9 },
        0,
      )
      .fromTo(
        ".background-text",
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.4 },
        0.1,
      )
      .fromTo(
        ".hero-title .line-inner",
        { yPercent: 115, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.15 },
        0.2,
      )
      .fromTo(
        ".hero-desc",
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.0 },
        0.36,
      )
      .fromTo(
        ".hero-actions > *",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.1 },
        0.48,
      )
      .fromTo(
        ".photo-wrapper",
        { y: 55, opacity: 0, scale: 0.96 },
        { y: 0, opacity: 1, scale: 1, duration: 1.35 },
        0.25,
      )
      .fromTo(
        ".scroll-cue",
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        0.85,
      )
      .fromTo(
        ".hero-frame .corner-item",
        { opacity: 0 },
        { opacity: 1, duration: 0.9, stagger: 0.08 },
        0.55,
      );

    // Scroll Parallax on Background Text, Portrait & Scroll Cue
    gsap.to(".background-text", {
      y: 160,
      ease: "none",
      scrollTrigger: {
        trigger: ".Home",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    gsap.to(".photo-wrapper img", {
      y: 42,
      ease: "none",
      scrollTrigger: {
        trigger: ".Home",
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });

    gsap.to("#scrollCue", {
      opacity: 0,
      y: 18,
      ease: "none",
      scrollTrigger: {
        trigger: ".Home",
        start: "top top",
        end: "25% top",
        scrub: true,
      },
    });

    // Subtle Desktop Cursor Depth Parallax (Background Text vs Portrait)
    const homeSection = document.getElementById("Home");
    const bgWord = document.querySelector(".background-text");
    const heroPhoto = document.querySelector(".photo-wrapper");

    if (hasFinePointer && homeSection && bgWord && heroPhoto) {
      const bgX = gsap.quickTo(bgWord, "x", { duration: 0.9, ease: "power3.out" });
      const photoX = gsap.quickTo(heroPhoto, "x", { duration: 0.85, ease: "power3.out" });

      homeSection.addEventListener("mousemove", (e) => {
        const rect = homeSection.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        bgX(nx * -28);
        photoX(nx * 14);
      });

      homeSection.addEventListener("mouseleave", () => {
        bgX(0);
        photoX(0);
      });
    }

    // Magnetic Buttons
    if (hasFinePointer) {
      document.querySelectorAll(".magnetic").forEach((el) => {
        const moveX = gsap.quickTo(el, "x", { duration: 0.45, ease: "expo.out" });
        const moveY = gsap.quickTo(el, "y", { duration: 0.45, ease: "expo.out" });

        el.addEventListener("mousemove", (e) => {
          const rect = el.getBoundingClientRect();
          const dx = e.clientX - (rect.left + rect.width / 2);
          const dy = e.clientY - (rect.top + rect.height / 2);
          moveX(dx * 0.22);
          moveY(dy * 0.22);
        });

        el.addEventListener("mouseleave", () => {
          moveX(0);
          moveY(0);
        });
      });
    }
  }

  // =========================================================
  // 3B. EDITORIAL CORNER DETAILS & INTERACTIVE NODE FIELD
  // =========================================================
  const heroClockEl = document.getElementById("heroClock");
  if (heroClockEl) {
    const clockFormatter = new Intl.DateTimeFormat("pt-BR", {
      timeZone: "America/Sao_Paulo",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const updateClock = () => {
      if (!document.hidden) {
        heroClockEl.textContent = clockFormatter.format(new Date());
      }
    };
    updateClock();
    setInterval(updateClock, 1000);
  }

  const heroCoordsEl = document.getElementById("heroCoords");
  const heroCanvas = document.getElementById("heroNodesCanvas");
  const homeEl = document.getElementById("Home");

  if (heroCanvas && homeEl) {
    const ctx = heroCanvas.getContext("2d");
    let width = 0;
    let height = 0;
    let dpr = 1;
    let nodes = [];
    let heroInView = true;
    const pointer = { x: -9999, y: -9999, active: false };

    function readNodeColors() {
      const styles = getComputedStyle(document.documentElement);
      return {
        base: styles.getPropertyValue("--node-rgb").trim() || "148, 163, 184",
        accent:
          styles.getPropertyValue("--node-accent-rgb").trim() || "167, 139, 250",
      };
    }

    let palette = readNodeColors();

    function seedNodes() {
      const area = width * height;
      const targetCount = Math.max(
        26,
        Math.min(72, Math.round(area / 19500)),
      );
      nodes = Array.from({ length: targetCount }, () => {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.14 + Math.random() * 0.24;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          baseVx: Math.cos(angle) * speed,
          baseVy: Math.sin(angle) * speed,
          r: 1.0 + Math.random() * 1.15,
          alpha: 0.18 + Math.random() * 0.28,
          pulse: 0,
        };
      });
    }

    function resizeCanvas() {
      const rect = homeEl.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      heroCanvas.width = Math.round(width * dpr);
      heroCanvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      palette = readNodeColors();
      seedNodes();
      renderNodes(true);
    }

    function renderNodes(staticOnly = false) {
      ctx.clearRect(0, 0, width, height);

      const linkDist = width < 768 ? 105 : 142;
      const linkDistSq = linkDist * linkDist;
      const pointerDist = 180;
      const pointerDistSq = pointerDist * pointerDist;

      let waveLocalX = 0;
      let waveLocalY = 0;
      if (heroNodeWave.active) {
        const rect = homeEl.getBoundingClientRect();
        waveLocalX = heroNodeWave.x - rect.left;
        waveLocalY = heroNodeWave.y - rect.top;
      }

      if (!staticOnly) {
        for (let i = 0; i < nodes.length; i++) {
          const n = nodes[i];

          // Smoothly relax velocity back toward gentle organic drift
          n.vx += (n.baseVx - n.vx) * 0.035;
          n.vy += (n.baseVy - n.vy) * 0.035;

          // Subtle cursor reaction
          if (pointer.active) {
            const dx = n.x - pointer.x;
            const dy = n.y - pointer.y;
            const dSq = dx * dx + dy * dy;
            if (dSq < pointerDistSq && dSq > 0.01) {
              const d = Math.sqrt(dSq);
              const force = (1 - d / pointerDist) * 0.22;
              n.vx += (dx / d) * force;
              n.vy += (dy / d) * force;
              n.pulse = Math.max(n.pulse, (1 - d / pointerDist) * 0.55);
            }
          }

          // Physical impulse when the EN/PT bubble wavefront touches the node
          if (heroNodeWave.active) {
            const wdx = n.x - waveLocalX;
            const wdy = n.y - waveLocalY;
            const wd = Math.hypot(wdx, wdy);
            if (
              wd >= heroNodeWave.prevRadius - 22 &&
              wd <= heroNodeWave.radius + 26 &&
              wd > 0.01
            ) {
              const kick = 2.6;
              n.vx += (wdx / wd) * kick;
              n.vy += (wdy / wd) * kick;
              n.pulse = 1;
            }
          }

          n.x += n.vx;
          n.y += n.vy;
          n.pulse *= 0.94;

          // Seamless edge wrap with slight margin
          const pad = 24;
          if (n.x < -pad) n.x = width + pad;
          else if (n.x > width + pad) n.x = -pad;
          if (n.y < -pad) n.y = height + pad;
          else if (n.y > height + pad) n.y = -pad;
        }
      }

      // Draw fine connecting filaments between nearby nodes
      ctx.lineWidth = 0.85;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dSq = dx * dx + dy * dy;
          if (dSq < linkDistSq) {
            const proximity = 1 - Math.sqrt(dSq) / linkDist;
            const energy = Math.max(a.pulse, b.pulse);
            const alpha = proximity * (0.13 + energy * 0.24);
            const rgb = energy > 0.22 ? palette.accent : palette.base;
            ctx.strokeStyle = `rgba(${rgb}, ${alpha.toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Draw delicate filaments to cursor when active
      if (!staticOnly && pointer.active) {
        ctx.lineWidth = 0.8;
        for (let i = 0; i < nodes.length; i++) {
          const n = nodes[i];
          const dx = n.x - pointer.x;
          const dy = n.y - pointer.y;
          const dSq = dx * dx + dy * dy;
          if (dSq < pointerDistSq) {
            const proximity = 1 - Math.sqrt(dSq) / pointerDist;
            ctx.strokeStyle = `rgba(${palette.accent}, ${(proximity * 0.22).toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(pointer.x, pointer.y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const energy = n.pulse;
        const radius = n.r + energy * 1.1;
        const alpha = Math.min(0.9, n.alpha + energy * 0.55);
        const rgb = energy > 0.2 ? palette.accent : palette.base;
        ctx.fillStyle = `rgba(${rgb}, ${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    homeEl.addEventListener("mousemove", (e) => {
      const rect = homeEl.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
      if (heroCoordsEl) {
        const xPad = String(Math.max(0, Math.round(pointer.x))).padStart(3, "0");
        const yPad = String(Math.max(0, Math.round(pointer.y))).padStart(3, "0");
        heroCoordsEl.textContent = `X ${xPad} · Y ${yPad}`;
      }
    });

    homeEl.addEventListener("mouseleave", () => {
      pointer.active = false;
      pointer.x = -9999;
      pointer.y = -9999;
    });

    ScrollTrigger.create({
      trigger: homeEl,
      start: "top bottom",
      end: "bottom top",
      onEnter: () => (heroInView = true),
      onLeave: () => (heroInView = false),
      onEnterBack: () => (heroInView = true),
      onLeaveBack: () => (heroInView = false),
    });

    resizeCanvas();

    if (!prefersReducedMotion) {
      gsap.ticker.add(() => {
        if (!heroInView || document.hidden) return;
        renderNodes(false);
      });
    }

    let canvasResizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(canvasResizeTimer);
      canvasResizeTimer = setTimeout(resizeCanvas, 180);
    });
  }

  // =========================================================
  // 4. INFINITE HORIZONTAL SKILLS MARQUEE (CLEAN 1x CLONE)
  // =========================================================
  const track = document.getElementById("skillsTrack");
  if (track) {
    // Clone exactly once so -50% translates seamlessly back to 0%
    const singleSequence = track.innerHTML;
    track.innerHTML = singleSequence + singleSequence;

    if (!prefersReducedMotion) {
      const marqueeTween = gsap.to(track, {
        xPercent: -50,
        ease: "none",
        duration: 36,
        repeat: -1,
      });

      const marqueeBand = track.closest(".skills-carousel");
      if (marqueeBand) {
        marqueeBand.addEventListener("mouseenter", () => {
          gsap.to(marqueeTween, { timeScale: 0.2, duration: 0.6, ease: "power2.out" });
        });
        marqueeBand.addEventListener("mouseleave", () => {
          gsap.to(marqueeTween, { timeScale: 1, duration: 0.6, ease: "power2.out" });
        });
      }
    }
  }

  // =========================================================
  // 5. SECTION REVEALS (About, Projects, Contact)
  // =========================================================
  if (!prefersReducedMotion) {
    const sections = gsap.utils.toArray(".section:not(.Home)");
    sections.forEach((sec) => {
      gsap.fromTo(
        sec,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "expo.out",
          scrollTrigger: {
            trigger: sec,
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
        },
      );
    });
  }

  // =========================================================
  // 6. ABOUT SECTION — FLOATING TAGS PHYSICS (PAUSED OFFSCREEN)
  // =========================================================
  const container = document.getElementById("floatingTagsContainer");
  const tags = Array.from(document.querySelectorAll(".tag"));
  let aboutVisible = false;

  if (container && tags.length > 0) {
    gsap.set(tags, { xPercent: -50, yPercent: -50 });

    const tagData = tags.map((tag) => ({
      el: tag,
      baseX: 0,
      baseY: 0,
      floatX: 0,
      floatY: 0,
      vx: 0,
      vy: 0,
      origX: 0,
      origY: 0,
      w: 0,
      h: 0,
    }));

    function cacheLayout() {
      const cHeight = container.offsetHeight || 400;
      const cWidth = container.offsetWidth || window.innerWidth;
      tagData.forEach((data, i) => {
        data.origX = tags[i].offsetLeft;
        data.origY = tags[i].offsetTop;

        if (data.origY === 0) {
          data.origY = (cHeight / tags.length) * i + 20;
          tags[i].style.top = data.origY + "px";
        }
        if (data.origX === 0) {
          data.origX = (cWidth / tags.length) * i + 20;
          tags[i].style.left = data.origX + "px";
        }

        data.w = tags[i].offsetWidth;
        data.h = tags[i].offsetHeight;
      });
    }

    function initFloating() {
      if (prefersReducedMotion) return;
      tagData.forEach((data) => {
        function animateFloat() {
          const speed = parseFloat(data.el.getAttribute("data-speed")) || 1;
          gsap.to(data, {
            floatX: Math.random() * 40 - 20,
            floatY: Math.random() * 30 - 15,
            duration: 3 + (Math.random() * 3) / speed,
            ease: "sine.inOut",
            onComplete: animateFloat,
          });
        }
        animateFloat();
      });
    }

    function initDraggable() {
      if (typeof Draggable === "undefined") return;
      tags.forEach((tag, i) => {
        const data = tagData[i];
        Draggable.create(tag, {
          bounds: container,
          onDragStart: function () {
            tag.classList.add("is-dragging");
          },
          onDrag: function () {
            data.baseX = this.x - data.floatX;
            data.baseY = this.y - data.floatY;
            data.vx = 0;
            data.vy = 0;
          },
          onDragEnd: function () {
            tag.classList.remove("is-dragging");
          },
        });
      });
    }

    ScrollTrigger.create({
      trigger: "#About",
      start: "top bottom",
      end: "bottom top",
      onEnter: () => (aboutVisible = true),
      onLeave: () => (aboutVisible = false),
      onEnterBack: () => (aboutVisible = true),
      onLeaveBack: () => (aboutVisible = false),
    });

    gsap.ticker.add(() => {
      if (!aboutVisible || window.innerWidth <= 768) return;
      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;
      if (containerWidth === 0 || containerHeight === 0) return;

      for (let i = 0; i < tagData.length; i++) {
        const dataA = tagData[i];
        if (dataA.el.classList.contains("is-dragging")) continue;

        for (let j = 0; j < tagData.length; j++) {
          if (i === j) continue;
          const dataB = tagData[j];

          const aAbsX = dataA.origX + dataA.baseX + dataA.floatX;
          const aAbsY = dataA.origY + dataA.baseY + dataA.floatY;
          const bAbsX = dataB.origX + dataB.baseX + dataB.floatX;
          const bAbsY = dataB.origY + dataB.baseY + dataB.floatY;

          let dx = aAbsX - bAbsX;
          let dy = aAbsY - bAbsY;
          if (Math.abs(dx) < 0.1) dx = (Math.random() - 0.5) * 2;
          if (Math.abs(dy) < 0.1) dy = (Math.random() - 0.5) * 2;

          const dist = Math.sqrt(dx * dx + dy * dy);
          const absDx = Math.abs(dx);
          const absDy = Math.abs(dy);
          const minDx = dataA.w / 2 + dataB.w / 2 + 20;
          const minDy = dataA.h / 2 + dataB.h / 2 + 15;

          if (absDx < minDx && absDy < minDy && dist > 0) {
            const overlapX = minDx - absDx;
            const overlapY = minDy - absDy;
            const pushStrength = 0.08;

            if (overlapX < overlapY) {
              const dirX = dx !== 0 ? Math.sign(dx) : Math.random() > 0.5 ? 1 : -1;
              dataA.vx += dirX * overlapX * pushStrength;
            } else {
              const dirY = dy !== 0 ? Math.sign(dy) : Math.random() > 0.5 ? 1 : -1;
              dataA.vy += dirY * overlapY * pushStrength;
            }
            dataA.vx *= 0.75;
            dataA.vy *= 0.75;
          }
        }
      }

      tagData.forEach((data) => {
        if (!data.el.classList.contains("is-dragging")) {
          data.vx *= 0.92;
          data.vy *= 0.92;
          data.baseX += data.vx;
          data.baseY += data.vy;

          const edgePad = 25;
          const minCenterX = data.w / 2 + edgePad;
          const maxCenterX = containerWidth - data.w / 2 - edgePad;
          const currentCenterX = data.origX + data.baseX;

          if (currentCenterX < minCenterX) {
            data.baseX = minCenterX - data.origX;
            data.vx = Math.abs(data.vx) * 0.5;
          } else if (currentCenterX > maxCenterX) {
            data.baseX = maxCenterX - data.origX;
            data.vx = -Math.abs(data.vx) * 0.5;
          }

          const minCenterY = data.h / 2 + edgePad;
          const maxCenterY = containerHeight - data.h / 2 - edgePad;
          const currentCenterY = data.origY + data.baseY;

          if (currentCenterY < minCenterY) {
            data.baseY = minCenterY - data.origY;
            data.vy = Math.abs(data.vy) * 0.5;
          } else if (currentCenterY > maxCenterY) {
            data.baseY = maxCenterY - data.origY;
            data.vy = -Math.abs(data.vy) * 0.5;
          }

          gsap.set(data.el, {
            x: data.baseX + data.floatX,
            y: data.baseY + data.floatY,
            xPercent: -50,
            yPercent: -50,
            rotation: (data.floatX / 20) * 4,
            force3D: true,
          });
        } else {
          const dragInst = Draggable.get(data.el);
          if (dragInst) {
            data.baseX = dragInst.x - data.floatX;
            data.baseY = dragInst.y - data.floatY;
            gsap.set(data.el, {
              rotation: (data.floatX / 20) * 4,
              xPercent: -50,
              yPercent: -50,
            });
          }
        }
      });
    });

    window.addEventListener("load", () => {
      cacheLayout();
      initFloating();
      initDraggable();
      updateNavIndicator(false);
    });

    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        cacheLayout();
        updateNavIndicator(false);
        tags.forEach((tag) => {
          const dragInst = Draggable.get(tag);
          if (dragInst) dragInst.applyBounds(container);
        });
      }, 200);
    });

    // Expose impulse helper for chat interactions
    window.__nudgeFloatingTags = () => {
      tagData.forEach((d) => {
        d.vx += (Math.random() - 0.5) * 9;
        d.vy += (Math.random() - 0.5) * 7;
      });
    };
  } else {
    window.addEventListener("load", () => updateNavIndicator(false));
    window.addEventListener("resize", () => updateNavIndicator(false));
  }

  // =========================================================
  // 7. ABOUT CHAT INTERACTION
  // =========================================================
  const chatOptions = document.getElementById("chatOptions");
  const chatHistory = document.getElementById("chatHistory");
  const chatBtns = document.querySelectorAll(".chat-btn");

  chatBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const topic = btn.getAttribute("data-topic");
      const btnText = btn.textContent.trim();

      chatOptions.style.display = "none";
      document.getElementById("chatInterface").classList.add("chat-active");

      addMessage(btnText, "user");

      const typingIndicator = document.createElement("div");
      typingIndicator.className = "typing-indicator chat-bubble chat-ai";
      typingIndicator.innerHTML =
        '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
      chatHistory.appendChild(typingIndicator);
      scrollToBottom();

      setTimeout(() => {
        typingIndicator.remove();
        const responses = CHAT_RESPONSES[currentLang][topic] || [];
        const randomResponse =
          responses[Math.floor(Math.random() * responses.length)] || "";

        addMessage(randomResponse, "ai");
        chatOptions.style.display = "flex";
        scrollToBottom();

        if (typeof window.__nudgeFloatingTags === "function") {
          window.__nudgeFloatingTags();
        }
      }, 1100);
    });
  });

  function addMessage(text, sender) {
    const msgDiv = document.createElement("div");
    msgDiv.className = `chat-bubble ${sender === "user" ? "chat-user" : "chat-ai"}`;
    msgDiv.textContent = text;
    chatHistory.appendChild(msgDiv);
    scrollToBottom();
  }

  function scrollToBottom() {
    chatHistory.scrollTop = chatHistory.scrollHeight;
  }

  // =========================================================
  // 8. PROJECTS SECTION — STICKY SCROLL & CAROUSELS
  // =========================================================
  const projectsContainer = document.querySelector(".projects-container");
  if (projectsContainer) {
    const titleStack = document.querySelector(".title-stack");
    const titleWords = gsap.utils.toArray(".title-word");
    const projectCards = gsap.utils.toArray(".project-card");
    const sliderLine = document.querySelector(".slider-line");

    gsap.fromTo(
      sliderLine,
      { background: "#39495b" },
      {
        background: "#e5e7eb",
        ease: "none",
        scrollTrigger: {
          trigger: projectsContainer,
          start: "top center",
          end: "bottom center",
          scrub: true,
        },
      },
    );

    projectCards.forEach((card, i) => {
      ScrollTrigger.create({
        trigger: card,
        start: "top 60%",
        end: "bottom 40%",
        onEnter: () => updateActiveWord(i),
        onEnterBack: () => updateActiveWord(i),
      });
    });

    function updateActiveWord(index) {
      const wordIndex = Math.min(index, titleWords.length - 1);
      titleWords.forEach((word, w) => {
        word.classList.toggle("active", w === wordIndex);
        word.classList.toggle("ghost", w !== wordIndex);
      });

      const activeWord = titleWords[wordIndex];
      if (!activeWord) return;
      const wrapperCenter = 100;
      const wordCenter = activeWord.offsetTop + activeWord.offsetHeight / 2;
      const shiftY = wrapperCenter - wordCenter;

      gsap.to(titleStack, {
        y: shiftY,
        duration: 0.8,
        ease: "expo.out",
        overwrite: "auto",
      });
    }
  }

  const carousels = document.querySelectorAll(".project-carousel");
  carousels.forEach((carousel) => {
    const trackEl = carousel.querySelector(".carousel-track");
    const images = carousel.querySelectorAll(".carousel-track img");
    const prevBtn = carousel.querySelector(".prev-btn");
    const nextBtn = carousel.querySelector(".next-btn");
    const indicatorsContainer = carousel.querySelector(".carousel-indicators");

    if (!trackEl || images.length === 0) return;

    let currentIndex = 0;
    const totalImages = images.length;
    let autoPlayInterval;

    images.forEach((_, i) => {
      const dot = document.createElement("span");
      dot.classList.add("dot");
      if (i === 0) dot.classList.add("active");
      dot.addEventListener("click", () => goToSlide(i));
      indicatorsContainer.appendChild(dot);
    });

    const dots = indicatorsContainer.querySelectorAll(".dot");

    function updateCarousel() {
      trackEl.style.transform = `translateX(-${currentIndex * 100}%)`;
      dots.forEach((dot, i) => {
        dot.classList.toggle("active", i === currentIndex);
      });
    }

    function nextSlide() {
      currentIndex = (currentIndex + 1) % totalImages;
      updateCarousel();
    }

    function prevSlide() {
      currentIndex = (currentIndex - 1 + totalImages) % totalImages;
      updateCarousel();
    }

    function goToSlide(index) {
      currentIndex = index;
      updateCarousel();
    }

    function startAutoPlay() {
      autoPlayInterval = setInterval(nextSlide, 3500);
    }

    function stopAutoPlay() {
      clearInterval(autoPlayInterval);
    }

    nextBtn.addEventListener("click", () => {
      nextSlide();
      stopAutoPlay();
      startAutoPlay();
    });

    prevBtn.addEventListener("click", () => {
      prevSlide();
      stopAutoPlay();
      startAutoPlay();
    });

    carousel.addEventListener("mouseenter", stopAutoPlay);
    carousel.addEventListener("mouseleave", startAutoPlay);
    startAutoPlay();
  });

  // =========================================================
  // 9. MOBILE FULLSCREEN CHAT IMMERSION
  // =========================================================
  const phoneMockup = document.getElementById("phoneMockup");
  const exitFullscreenBtn = document.getElementById("exitFullscreen");

  if (phoneMockup && exitFullscreenBtn) {
    phoneMockup.addEventListener("click", (e) => {
      if (window.innerWidth <= 768 && !e.target.closest(".chat-btn")) {
        document.body.classList.add("immersion-active");
      }
    });

    exitFullscreenBtn.addEventListener("click", () => {
      document.body.classList.remove("immersion-active");
    });
  }
});
