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
      "about.kicker": "ABOUT",
      "about.hint": "DRAG, THROW OR CLICK ANY SKILL",
      "about.status": "Interactive Bio",
      "about.chatTitle": "What would you like to know about Borges?",
      "about.chatSub": "Pick a topic below or click any skill.",
      "about.btnExperiences": "Experiences",
      "about.btnAbout": "About",
      "about.btnStack": "Stack",
      "about.btnProjects": "Projects",
      "about.jumpProjects": "Jump to Projects ↓",
      "about.exitChat": "Exit",
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
      "about.kicker": "SOBRE",
      "about.hint": "ARRASTE, JOGUE OU CLIQUE EM UMA SKILL",
      "about.status": "Bio Interativa",
      "about.chatTitle": "O que você quer saber sobre a Borges?",
      "about.chatSub": "Escolha um tópico abaixo ou clique em qualquer skill.",
      "about.btnExperiences": "Experiências",
      "about.btnAbout": "Sobre",
      "about.btnStack": "Stack",
      "about.btnProjects": "Projetos",
      "about.jumpProjects": "Ir para Projetos ↓",
      "about.exitChat": "Sair",
      "projects.heading": "Projetos",
      "projects.view": "Ver Projeto →",
      "contact.heading": "Contato",
    },
  };

  // Compact fallback used only if ./data/chat-responses.json cannot be fetched (e.g. file://)
  const FALLBACK_CHAT_DATASET = {
    topics: {
      experiences: {
        highlight: ["python", "django", "postgresql", "docker"],
        en: {
          prompt: "Experiences",
          replies: [
            "Borges started as an apprentice at HPE, moved to São Nicolau Hospital as an apprentice, and grew into an IT Technician role building internal software, automations, and ERP integrations.",
          ],
        },
        pt: {
          prompt: "Experiências",
          replies: [
            "Borges começou como aprendiz na HPE, passou a aprendiz no Hospital São Nicolau e evoluiu para Técnica em TI desenvolvendo sistemas internos, automações e integrações com ERP.",
          ],
        },
      },
      about: {
        highlight: ["python", "agents", "gsap"],
        en: {
          prompt: "About",
          replies: [
            "Systems Analysis and Development student driven by curiosity. She likes opening the black box, understanding systems end to end, and turning ideas into real software.",
          ],
        },
        pt: {
          prompt: "Sobre",
          replies: [
            "Estudante de Análise e Desenvolvimento de Sistemas movida pela curiosidade. Gosta de abrir a caixa-preta, entender sistemas de ponta a ponta e transformar ideias em software real.",
          ],
        },
      },
      stack: {
        highlight: ["python", "django", "fastapi", "langchain", "rag", "playwright", "postgresql", "docker"],
        en: {
          prompt: "Stack",
          replies: [
            "Core stack: Python, Django, FastAPI, LangChain/LangGraph, RAG pipelines, Playwright browser automation, PostgreSQL, Docker, and GSAP for interactive interfaces.",
          ],
        },
        pt: {
          prompt: "Stack",
          replies: [
            "Stack principal: Python, Django, FastAPI, LangChain/LangGraph, pipelines RAG, automação com Playwright, PostgreSQL, Docker e GSAP para interfaces interativas.",
          ],
        },
      },
      projects: {
        highlight: ["agents", "rag", "django", "fastapi", "playwright"],
        cta: "#Projects",
        en: {
          prompt: "Projects",
          replies: [
            "Her flagship systems include OROS (local-first AI voice assistant), Tallenn (career & job collection platform), Help na Escolha (commercial BI + AI SaaS), and Signa (signature studio integrated with Tasy ERP).",
          ],
        },
        pt: {
          prompt: "Projetos",
          replies: [
            "Entre os principais sistemas estão o OROS (assistente IA local-first com voz), Tallenn (plataforma de carreira e coleta de vagas), Help na Escolha (SaaS comercial de BI + IA) e Signa (estúdio de assinaturas integrado ao ERP Tasy).",
          ],
        },
      },
    },
    skills: {
      python: {
        en: { prompt: "Tell me about Python", replies: ["Python is the backbone of almost everything Borges builds, from Django and FastAPI backends to local AI orchestrators and automation workers."] },
        pt: { prompt: "Como você usa Python?", replies: ["Python é a base de quase tudo que a Borges constrói, de backends em Django e FastAPI até orquestradores de IA locais e workers de automação."] },
      },
      agents: {
        en: { prompt: "How do you build AI Agents?", replies: ["She builds tool-calling agents with strict safety boundaries in OROS (local Ollama + OpenJarvis) and Help na Escolha (LangGraph ReAct agent)."] },
        pt: { prompt: "Como você cria AI Agents?", replies: ["Ela projeta agentes com tool-calling e limites claros de segurança no OROS (Ollama local + OpenJarvis) e no Help na Escolha (LangGraph)."] },
      },
      django: {
        en: { prompt: "Where do you use Django?", replies: ["Django powers her full-stack systems: Help na Escolha, OROS, Tallenn, and NeoGestão."] },
        pt: { prompt: "Onde você usa Django?", replies: ["Django sustenta seus sistemas full-stack: Help na Escolha, OROS, Tallenn e NeoGestão."] },
      },
      fastapi: {
        en: { prompt: "How do you use FastAPI?", replies: ["Used for high-throughput async services, including the AI microservice in Help na Escolha and the job collection API in Tallenn."] },
        pt: { prompt: "Como você usa FastAPI?", replies: ["Usado em serviços assíncronos de alta performance, incluindo o microserviço de IA no Help na Escolha e a API de coleta no Tallenn."] },
      },
      langchain: {
        en: { prompt: "What about LangChain?", replies: ["Applied together with LangGraph for structured tool-calling workflows and retrieval chains in Help na Escolha and GitHermes."] },
        pt: { prompt: "Como você usa LangChain?", replies: ["Aplicado junto com LangGraph para fluxos estruturados de tool-calling e cadeias de recuperação no Help na Escolha e no GitHermes."] },
      },
      rag: {
        en: { prompt: "How do you implement RAG?", replies: ["From hybrid crawlers (GitHermes) and ChromaDB vector memory (Help na Escolha) to SQLite FTS5 + Markdown local memory in OROS."] },
        pt: { prompt: "Como você implementa RAG?", replies: ["Desde crawlers híbridos (GitHermes) e ChromaDB (Help na Escolha) até memória local em SQLite FTS5 + Markdown no OROS."] },
      },
      playwright: {
        en: { prompt: "Where do you use Playwright?", replies: ["Powers real-browser automation and testing: dynamic doc crawling in GitHermes, career-portal scraping in Tallenn, and UI regression checks."] },
        pt: { prompt: "Onde você usa Playwright?", replies: ["Move automações e testes em navegador real: coleta de documentações no GitHermes, scraping de portais de vagas no Tallenn e testes de interface."] },
      },
      postgresql: {
        en: { prompt: "How do you use PostgreSQL?", replies: ["Production relational database behind Help na Escolha and Tallenn, handling multi-tenant workspaces, concurrent queues, and analytical views."] },
        pt: { prompt: "Como você usa PostgreSQL?", replies: ["Banco relacional de produção no Help na Escolha e no Tallenn, com isolamento por workspace, filas concorrentes e views analíticas."] },
      },
      docker: {
        en: { prompt: "How do you use Docker?", replies: ["Containerizes multi-service stacks with Docker Compose (Django, FastAPI, PostgreSQL, Redis, workers, and Nginx) with health checks."] },
        pt: { prompt: "Como você usa Docker?", replies: ["Containeriza stacks multi-serviço com Docker Compose (Django, FastAPI, PostgreSQL, Redis, workers e Nginx) com health checks."] },
      },
      gsap: {
        en: { prompt: "Why GSAP?", replies: ["For motion that feels physical: ScrollTrigger choreography, Draggable physics, and animated SVG scenes in Tallenn and Haffe's Design System."] },
        pt: { prompt: "Por que GSAP?", replies: ["Para criar movimento com sensação física: ScrollTrigger, física com Draggable e cenas SVG animadas no Tallenn e no Haffe's Design System."] },
      },
    },
  };

  let chatDataset = null;
  const chatDataReady = fetch("./data/chat-responses.json")
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((json) => {
      if (json && json.topics && json.skills) {
        chatDataset = json;
      } else {
        chatDataset = FALLBACK_CHAT_DATASET;
      }
    })
    .catch(() => {
      chatDataset = FALLBACK_CHAT_DATASET;
    });

  function getChatSource(kind, key) {
    const data = chatDataset || FALLBACK_CHAT_DATASET;
    const bucket = kind === "skill" ? data.skills : data.topics;
    return bucket ? bucket[key] || null : null;
  }

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
    if (el.classList.contains("background-text")) {
      gsap.killTweensOf(el, "opacity");
      gsap
        .timeline()
        .to(el, {
          opacity: 0,
          duration: 0.16,
          ease: "power2.in",
          onComplete: () => {
            el.textContent = newText;
          },
        })
        .to(el, {
          opacity: 1,
          duration: 0.42,
          ease: "expo.out",
        });
      return;
    }

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
      if (typeof window.__retranslateChatHistory === "function") {
        window.__retranslateChatHistory(targetLang);
      }
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
              if (typeof window.__retranslateChatHistory === "function") {
                window.__retranslateChatHistory(targetLang);
              }
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
  const phoneClockEl = document.getElementById("phoneClock");
  if (heroClockEl || phoneClockEl) {
    const clockFormatter = new Intl.DateTimeFormat("pt-BR", {
      timeZone: "America/Sao_Paulo",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const updateClock = () => {
      if (!document.hidden) {
        const formatted = clockFormatter.format(new Date());
        if (heroClockEl) heroClockEl.textContent = formatted;
        if (phoneClockEl) phoneClockEl.textContent = formatted.slice(0, 5);
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
        40,
        Math.min(105, Math.round(area / 13500)),
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
          r: 1.8 + Math.random() * 1.8,
          alpha: 0.24 + Math.random() * 0.34,
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
      ctx.lineWidth = 1;
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
        const radius = n.r + energy * 1.4;
        const alpha = Math.min(0.95, n.alpha + energy * 0.5);
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
          clearProps: "transform",
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
  // 6. ABOUT SECTION — FLOATING TAGS PHYSICS & THROW INERTIA
  // =========================================================
  const container = document.getElementById("floatingTagsContainer");
  const arenaHint = document.getElementById("arenaHint");
  const tags = Array.from(document.querySelectorAll(".tag"));
  let aboutVisible = false;
  let arenaDiscovered = false;

  function markArenaDiscovered() {
    if (arenaDiscovered) return;
    arenaDiscovered = true;
    if (arenaHint) arenaHint.classList.add("is-discovered");
  }

  let highlightTags = () => {};
  let nudgeFloatingTags = () => {};
  let triggerChatInteraction = () => {};

  if (container && tags.length > 0) {
    const tagData = tags.map((tag, idx) => {
      const speed = parseFloat(tag.getAttribute("data-speed")) || 1;
      const golden = idx * 2.39996;
      return {
        el: tag,
        setX: gsap.quickSetter(tag, "x", "px"),
        setY: gsap.quickSetter(tag, "y", "px"),
        setRot: gsap.quickSetter(tag, "rotation", "deg"),
        skill: tag.dataset.skill || "",
        baseX: 0,
        baseY: 0,
        floatX: 0,
        floatY: 0,
        renderX: 0,
        renderY: 0,
        renderRot: 0,
        vx: 0,
        vy: 0,
        origX: 0,
        origY: 0,
        w: 0,
        h: 0,
        phaseX: golden,
        phaseY: golden * 1.37 + 1.1,
        freqX: (0.42 + (idx % 4) * 0.09) * speed,
        freqY: (0.36 + ((idx + 2) % 4) * 0.08) * speed,
        ampX: 9 + (idx % 3) * 3.5,
        ampY: 7 + ((idx + 1) % 3) * 3,
        dragging: false,
      };
    });

    function cacheLayout() {
      if (window.innerWidth <= 768) return;
      const cHeight = container.offsetHeight || 500;
      const cWidth = container.offsetWidth || window.innerWidth;
      tagData.forEach((data, i) => {
        data.origX = tags[i].offsetLeft;
        data.origY = tags[i].offsetTop;

        if (data.origY === 0) {
          data.origY = (cHeight / tags.length) * i + 30;
          tags[i].style.top = data.origY + "px";
        }
        if (data.origX === 0) {
          data.origX = (cWidth / tags.length) * i + 30;
          tags[i].style.left = data.origX + "px";
        }

        data.w = tags[i].offsetWidth;
        data.h = tags[i].offsetHeight;
      });
    }

    function initDraggable() {
      if (typeof Draggable === "undefined") return;
      tags.forEach((tag, i) => {
        const data = tagData[i];
        let prevX = 0;
        let prevY = 0;
        let prevTime = 0;
        let dragVx = 0;
        let dragVy = 0;
        let dragDist = 0;

        Draggable.create(tag, {
          bounds: container,
          allowEventDefault: false,
          minimumMovement: 4,
          onPress: function () {
            if (window.innerWidth <= 768) {
              this.endDrag();
              return;
            }
            prevX = this.x;
            prevY = this.y;
            prevTime = performance.now();
            dragVx = 0;
            dragVy = 0;
            dragDist = 0;
          },
          onDragStart: function () {
            data.dragging = true;
            data.renderX = this.x;
            data.renderY = this.y;
            data.vx = 0;
            data.vy = 0;
            tag.classList.add("is-dragging");
            markArenaDiscovered();
          },
          onDrag: function () {
            const now = performance.now();
            const dtMs = Math.max(8, now - prevTime);
            const scaleTo60 = 16.6667 / dtMs;
            const dx = this.x - prevX;
            const dy = this.y - prevY;
            dragDist += Math.hypot(dx, dy);

            // Frame-rate independent smoothed pointer velocity
            dragVx = dragVx * 0.65 + dx * scaleTo60 * 0.35;
            dragVy = dragVy * 0.65 + dy * scaleTo60 * 0.35;
            prevX = this.x;
            prevY = this.y;
            prevTime = now;

            data.baseX = this.x - data.floatX;
            data.baseY = this.y - data.floatY;
            data.renderX = this.x;
            data.renderY = this.y;
            data.vx = dragVx * 0.6;
            data.vy = dragVy * 0.6;
          },
          onDragEnd: function () {
            data.dragging = false;
            tag.classList.remove("is-dragging");
            const idleMs = performance.now() - prevTime;
            if (dragDist >= 6 && idleMs < 95) {
              const releaseFade = Math.max(0, 1 - idleMs / 95);
              const maxSpeed = 22;
              data.vx = Math.max(
                -maxSpeed,
                Math.min(maxSpeed, dragVx * 0.95 * releaseFade),
              );
              data.vy = Math.max(
                -maxSpeed,
                Math.min(maxSpeed, dragVy * 0.95 * releaseFade),
              );
            } else {
              data.vx = 0;
              data.vy = 0;
            }
          },
          onClick: function () {
            if (window.innerWidth <= 768) return;
            markArenaDiscovered();
            triggerChatInteraction("skill", data.skill, tag);
          },
        });
      });
    }

    // Mobile tap & keyboard activation for every skill tag
    tags.forEach((tag) => {
      tag.addEventListener("click", () => {
        if (window.innerWidth <= 768) {
          markArenaDiscovered();
          triggerChatInteraction("skill", tag.dataset.skill || "", tag);
        }
      });

      tag.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          markArenaDiscovered();
          triggerChatInteraction("skill", tag.dataset.skill || "", tag);
        }
      });
    });

    ScrollTrigger.create({
      trigger: "#About",
      start: "top bottom",
      end: "bottom top",
      onEnter: () => (aboutVisible = true),
      onLeave: () => (aboutVisible = false),
      onEnterBack: () => (aboutVisible = true),
      onLeaveBack: () => (aboutVisible = false),
    });

    if (window.innerWidth > 768) {
      gsap.set(tags, { xPercent: -50, yPercent: -50, force3D: true });
      cacheLayout();
    }

    let elapsedSec = 0;

    gsap.ticker.add((_time, deltaTime) => {
      if (!aboutVisible || window.innerWidth <= 768) return;
      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;
      if (containerWidth === 0 || containerHeight === 0) return;

      // Normalize physics step to 60fps so 60Hz / 120Hz / 144Hz feel identical
      const dt = Math.min(deltaTime / 16.6667, 2);
      if (!prefersReducedMotion) {
        elapsedSec += (deltaTime / 1000);
      }

      // 1. Continuous C-infinity harmonic floating (zero random jumps)
      for (let i = 0; i < tagData.length; i++) {
        const d = tagData[i];
        if (!prefersReducedMotion) {
          d.floatX =
            Math.sin(elapsedSec * d.freqX + d.phaseX) * d.ampX +
            Math.sin(elapsedSec * d.freqX * 0.47 + d.phaseY) * (d.ampX * 0.35);
          d.floatY =
            Math.cos(elapsedSec * d.freqY + d.phaseY) * d.ampY +
            Math.cos(elapsedSec * d.freqY * 0.53 + d.phaseX) * (d.ampY * 0.35);
        } else {
          d.floatX = 0;
          d.floatY = 0;
        }
      }

      // 2. Smooth elliptical cushion repulsion (eliminates corner axis flipping/jitter)
      for (let i = 0; i < tagData.length; i++) {
        const a = tagData[i];
        const aX = a.origX + a.baseX + a.floatX;
        const aY = a.origY + a.baseY + a.floatY;

        for (let j = i + 1; j < tagData.length; j++) {
          const b = tagData[j];
          const bX = b.origX + b.baseX + b.floatX;
          const bY = b.origY + b.baseY + b.floatY;

          const dx = aX - bX;
          const dy = aY - bY;
          const rx = (a.w + b.w) * 0.52 + 24;
          const ry = (a.h + b.h) * 0.56 + 18;

          const nx = dx / rx;
          const ny = dy / ry;
          const eDistSq = nx * nx + ny * ny;

          if (eDistSq < 1) {
            const eDist = Math.sqrt(eDistSq) || 0.001;
            const overlap = 1 - eDist;
            // Smooth radial direction in world space
            const worldDist = Math.hypot(dx, dy) || 1;
            const ux = dx / worldDist;
            const uy = dy / worldDist;

            // Gentle quadratic-blended cushion force
            const force = (overlap * 0.65 + overlap * overlap * 1.4) * dt;

            if (!a.dragging && !b.dragging) {
              // Soft positional easing + gentle billiard momentum transfer
              const sep = overlap * 3.2 * dt;
              a.baseX += ux * sep;
              a.baseY += uy * sep;
              b.baseX -= ux * sep;
              b.baseY -= uy * sep;

              const relVn = (b.vx - a.vx) * ux + (b.vy - a.vy) * uy;
              const transfer = relVn > 0 ? relVn * 0.42 : 0;

              a.vx += ux * (force + transfer);
              a.vy += uy * (force + transfer);
              b.vx -= ux * (force + transfer);
              b.vy -= uy * (force + transfer);
            } else if (a.dragging) {
              b.vx -= ux * (force * 2.4) - a.vx * 0.14;
              b.vy -= uy * (force * 2.4) - a.vy * 0.14;
            } else {
              a.vx += ux * (force * 2.4) + b.vx * 0.14;
              a.vy += uy * (force * 2.4) + b.vy * 0.14;
            }
          }
        }
      }

      // 3. Fluid integration, soft wall cushioning & interpolated rendering
      const dragFactor = Math.pow(0.955, dt);
      const posLerp = 1 - Math.pow(0.68, dt);
      const rotLerp = 1 - Math.pow(0.82, dt);
      const edgePad = 26;

      for (let i = 0; i < tagData.length; i++) {
        const d = tagData[i];

        if (!d.dragging) {
          d.vx *= dragFactor;
          d.vy *= dragFactor;

          // Kill sub-pixel micro-drift cleanly
          if (Math.abs(d.vx) < 0.004) d.vx = 0;
          if (Math.abs(d.vy) < 0.004) d.vy = 0;

          d.baseX += d.vx * dt;
          d.baseY += d.vy * dt;

          const minX = d.w * 0.5 + edgePad;
          const maxX = containerWidth - d.w * 0.5 - edgePad;
          const cx = d.origX + d.baseX;

          if (cx < minX) {
            d.baseX += (minX - cx) * 0.35;
            d.vx = Math.abs(d.vx) * 0.55 + (minX - cx) * 0.04;
          } else if (cx > maxX) {
            d.baseX -= (cx - maxX) * 0.35;
            d.vx = -Math.abs(d.vx) * 0.55 - (cx - maxX) * 0.04;
          }

          const minY = d.h * 0.5 + edgePad;
          const maxY = containerHeight - d.h * 0.5 - edgePad;
          const cy = d.origY + d.baseY;

          if (cy < minY) {
            d.baseY += (minY - cy) * 0.35;
            d.vy = Math.abs(d.vy) * 0.55 + (minY - cy) * 0.04;
          } else if (cy > maxY) {
            d.baseY -= (cy - maxY) * 0.35;
            d.vy = -Math.abs(d.vy) * 0.55 - (cy - maxY) * 0.04;
          }

          const targetX = d.baseX + d.floatX;
          const targetY = d.baseY + d.floatY;
          const targetRot = Math.max(
            -9,
            Math.min(9, d.floatX * 0.14 + d.vx * 0.38),
          );

          d.renderX += (targetX - d.renderX) * posLerp;
          d.renderY += (targetY - d.renderY) * posLerp;
          d.renderRot += (targetRot - d.renderRot) * rotLerp;

          d.setX(d.renderX);
          d.setY(d.renderY);
          d.setRot(d.renderRot);
        } else {
          const dragHoldDecay = Math.pow(0.84, dt);
          d.vx *= dragHoldDecay;
          d.vy *= dragHoldDecay;
          const targetRot = Math.max(-10, Math.min(10, d.vx * 0.45));
          d.renderRot += (targetRot - d.renderRot) * rotLerp;
          d.setRot(d.renderRot);
        }
      }
    });

    let highlightTimer = null;
    highlightTags = (skillList = []) => {
      clearTimeout(highlightTimer);
      const targetSet = new Set(skillList);
      tags.forEach((tag) => {
        tag.classList.toggle("is-highlighted", targetSet.has(tag.dataset.skill));
      });
      document.querySelectorAll(".chat-skill-chip").forEach((chip) => {
        chip.classList.toggle(
          "is-highlighted",
          targetSet.has(chip.dataset.skill),
        );
      });
      highlightTimer = setTimeout(() => {
        tags.forEach((tag) => tag.classList.remove("is-highlighted"));
        document
          .querySelectorAll(".chat-skill-chip")
          .forEach((chip) => chip.classList.remove("is-highlighted"));
      }, 2400);
    };

    nudgeFloatingTags = (epicenterEl = null) => {
      if (window.innerWidth <= 768) return;
      const epicData = epicenterEl
        ? tagData.find((d) => d.el === epicenterEl)
        : null;

      tagData.forEach((d) => {
        if (epicData && d !== epicData) {
          const dx =
            d.origX + d.baseX - (epicData.origX + epicData.baseX);
          const dy =
            d.origY + d.baseY - (epicData.origY + epicData.baseY);
          const dist = Math.hypot(dx, dy) || 1;
          const waveStrength = Math.max(1.8, 7.5 - dist / 85);
          d.vx += (dx / dist) * waveStrength;
          d.vy += (dy / dist) * waveStrength;
        } else if (!epicData) {
          d.vx += (Math.random() - 0.5) * 5.5;
          d.vy += (Math.random() - 0.5) * 4.5;
        }
      });
    };

    window.addEventListener("load", () => {
      cacheLayout();
      initDraggable();
      updateNavIndicator(false);
    });

    let resizeTimeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (window.innerWidth > 768) {
          gsap.set(tags, { xPercent: -50, yPercent: -50 });
          cacheLayout();
          tags.forEach((tag) => {
            const dragInst = Draggable.get(tag);
            if (dragInst) dragInst.applyBounds(container);
          });
        }
        updateNavIndicator(false);
      }, 200);
    });
  } else {
    window.addEventListener("load", () => updateNavIndicator(false));
    window.addEventListener("resize", () => updateNavIndicator(false));
  }

  // =========================================================
  // 7. ABOUT CHAT INTERACTION (JSON RESPONSES + TOKEN STREAM)
  // =========================================================
  const chatInterface = document.getElementById("chatInterface");
  const chatOptions = document.getElementById("chatOptions");
  const chatHistory = document.getElementById("chatHistory");
  const chatResetBtn = document.getElementById("chatResetBtn");
  const chatBtns = document.querySelectorAll(".chat-btn");
  let pendingReplyTimer = null;
  let activeStream = null;
  let interactionSeq = 0;

  // Non-repeating shuffle bag per (kind:key) so consecutive clicks vary naturally
  const replyDecks = new Map();
  const lastVariantByKey = new Map();

  function pickVariantIndex(kind, key, count) {
    if (count <= 1) return 0;
    const deckKey = `${kind}:${key}`;
    let deck = replyDecks.get(deckKey);

    if (!deck || deck.length === 0) {
      deck = Array.from({ length: count }, (_, idx) => idx);
      for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
      }
      const prev = lastVariantByKey.get(deckKey);
      if (prev !== undefined && deck[deck.length - 1] === prev) {
        const swapIdx = Math.floor(Math.random() * (deck.length - 1));
        [deck[deck.length - 1], deck[swapIdx]] = [
          deck[swapIdx],
          deck[deck.length - 1],
        ];
      }
      replyDecks.set(deckKey, deck);
    }

    const picked = deck.pop();
    lastVariantByKey.set(deckKey, picked);
    return picked;
  }

  function getReplyText(source, lang, variantIdx) {
    const localized = source[lang];
    if (!localized) return "";
    const list = Array.isArray(localized.replies) ? localized.replies : [];
    if (list.length === 0) return "";
    return list[variantIdx % list.length];
  }

  // Split text into BPE-like subword / word tokens for realistic LLM streaming
  function tokenizeForStream(text) {
    const rawWords = text.match(/\S+\s*/g) || [text];
    const tokens = [];

    for (let i = 0; i < rawWords.length; i++) {
      const chunk = rawWords[i];
      const core = chunk.trimEnd();
      const trailing = chunk.slice(core.length);

      if (core.length >= 9 && !core.includes("://")) {
        const cut = Math.floor(core.length * (0.45 + Math.random() * 0.16));
        tokens.push(core.slice(0, cut));
        tokens.push(core.slice(cut) + trailing);
      } else {
        tokens.push(chunk);
      }
    }

    return tokens;
  }

  function createCtaLink(ctaTarget, lang, animateEnter = false) {
    const link = document.createElement("a");
    link.href = ctaTarget;
    link.className = animateEnter
      ? "chat-inline-link is-entering"
      : "chat-inline-link";
    link.textContent = TRANSLATIONS[lang]["about.jumpProjects"];
    link.addEventListener("click", (e) => {
      e.preventDefault();
      exitMobileImmersion(true);
      const target = document.querySelector(ctaTarget);
      if (target) {
        target.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
        });
      }
    });
    return link;
  }

  function renderBubbleContent(
    msgDiv,
    text,
    ctaTarget = null,
    lang = currentLang,
    animateCta = false,
  ) {
    msgDiv.textContent = "";
    const textSpan = document.createElement("span");
    textSpan.textContent = text;
    msgDiv.appendChild(textSpan);

    if (ctaTarget) {
      msgDiv.appendChild(document.createElement("br"));
      msgDiv.appendChild(createCtaLink(ctaTarget, lang, animateCta));
    }
  }

  function isChatNearBottom() {
    return (
      chatHistory.scrollHeight -
        chatHistory.scrollTop -
        chatHistory.clientHeight <
      56
    );
  }

  function scrollToBottom() {
    chatHistory.scrollTop = chatHistory.scrollHeight;
  }

  function addMessage(text, sender, meta = {}) {
    const msgDiv = document.createElement("div");
    msgDiv.className = `chat-bubble ${sender === "user" ? "chat-user" : "chat-ai"}`;
    if (meta.kind) msgDiv.dataset.chatKind = meta.kind;
    if (meta.key) msgDiv.dataset.chatKey = meta.key;
    if (meta.variantIdx !== undefined) {
      msgDiv.dataset.chatVariant = String(meta.variantIdx);
    }
    msgDiv.dataset.chatRole = sender;

    renderBubbleContent(msgDiv, text, meta.cta || null, currentLang);
    chatHistory.appendChild(msgDiv);

    if (!prefersReducedMotion) {
      gsap.fromTo(
        msgDiv,
        { opacity: 0, y: 12, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: 0.36, ease: "expo.out" },
      );
    }

    scrollToBottom();
    return msgDiv;
  }

  function finishActiveStream(preserveText = true, overrideLang = null) {
    if (!activeStream) return;
    const stream = activeStream;
    activeStream = null;
    if (stream.timerId) {
      clearTimeout(stream.timerId);
    }
    if (preserveText && stream.bubble.isConnected) {
      const targetLang = overrideLang || currentLang;
      const source = getChatSource(stream.kind, stream.key);
      const finalText = source
        ? getReplyText(source, targetLang, stream.variantIdx)
        : stream.fullText;
      renderBubbleContent(
        stream.bubble,
        finalText,
        stream.cta,
        targetLang,
        false,
      );
    }
  }

  function streamAssistantMessage(fullText, meta = {}) {
    if (prefersReducedMotion) {
      addMessage(fullText, "ai", meta);
      return;
    }

    const msgDiv = document.createElement("div");
    msgDiv.className = "chat-bubble chat-ai";
    if (meta.kind) msgDiv.dataset.chatKind = meta.kind;
    if (meta.key) msgDiv.dataset.chatKey = meta.key;
    if (meta.variantIdx !== undefined) {
      msgDiv.dataset.chatVariant = String(meta.variantIdx);
    }
    msgDiv.dataset.chatRole = "ai";

    const textContainer = document.createElement("span");
    const cursor = document.createElement("span");
    cursor.className = "stream-cursor";
    cursor.setAttribute("aria-hidden", "true");

    msgDiv.appendChild(textContainer);
    msgDiv.appendChild(cursor);
    chatHistory.appendChild(msgDiv);

    gsap.fromTo(
      msgDiv,
      { opacity: 0, y: 10, scale: 0.985 },
      { opacity: 1, y: 0, scale: 1, duration: 0.28, ease: "expo.out" },
    );
    scrollToBottom();

    const tokens = tokenizeForStream(fullText);
    let idx = 0;

    const streamState = {
      timerId: null,
      bubble: msgDiv,
      fullText,
      cta: meta.cta || null,
      kind: meta.kind,
      key: meta.key,
      variantIdx: meta.variantIdx || 0,
    };
    activeStream = streamState;

    function emitNextToken() {
      if (activeStream !== streamState) return;

      if (idx >= tokens.length) {
        activeStream = null;
        renderBubbleContent(
          msgDiv,
          fullText,
          streamState.cta,
          currentLang,
          Boolean(streamState.cta),
        );
        if (isChatNearBottom()) scrollToBottom();
        return;
      }

      const shouldFollowScroll = isChatNearBottom();

      // Occasional 2-token micro-burst on short chunks to mimic real SSE streaming
      const burstCount =
        idx + 1 < tokens.length &&
        tokens[idx].length <= 4 &&
        Math.random() < 0.24
          ? 2
          : 1;

      let emitted = "";
      for (let b = 0; b < burstCount && idx < tokens.length; b++) {
        emitted += tokens[idx++];
      }

      const tokenSpan = document.createElement("span");
      tokenSpan.className = "stream-token";
      tokenSpan.textContent = emitted;
      textContainer.appendChild(tokenSpan);

      if (shouldFollowScroll) {
        scrollToBottom();
      }

      const trimmed = emitted.trimEnd();
      const lastChar = trimmed.charAt(trimmed.length - 1);
      let delay = 20 + Math.random() * 26;
      if (lastChar === "." || lastChar === "!" || lastChar === "?") {
        delay += 85 + Math.random() * 55;
      } else if (lastChar === "," || lastChar === ":" || lastChar === ";") {
        delay += 45 + Math.random() * 35;
      }

      streamState.timerId = setTimeout(emitNextToken, delay);
    }

    emitNextToken();
  }

  function clearTypingIndicators() {
    chatHistory
      .querySelectorAll(".typing-indicator")
      .forEach((el) => el.remove());
  }

  triggerChatInteraction = async (kind, key, sourceEl = null) => {
    const seq = ++interactionSeq;
    if (!chatDataset) {
      await chatDataReady;
    }
    if (seq !== interactionSeq) return;

    const source = getChatSource(kind, key);
    if (!source) return;

    const localized = source[currentLang];
    if (!localized) return;

    if (pendingReplyTimer) {
      clearTimeout(pendingReplyTimer);
      pendingReplyTimer = null;
      clearTypingIndicators();
    }
    if (activeStream) {
      finishActiveStream(true);
    }

    chatInterface.classList.add("chat-active");
    if (chatResetBtn) chatResetBtn.hidden = false;

    const replyCount = Array.isArray(localized.replies)
      ? localized.replies.length
      : 1;
    const variantIdx = pickVariantIndex(kind, key, replyCount);

    addMessage(localized.prompt, "user", { kind, key });

    // Trigger synchronized tag reaction immediately
    if (kind === "skill") {
      highlightTags([key]);
      nudgeFloatingTags(sourceEl);
    } else if (Array.isArray(source.highlight)) {
      highlightTags(source.highlight);
      nudgeFloatingTags(null);
    }

    const typingIndicator = document.createElement("div");
    typingIndicator.className = "typing-indicator chat-bubble chat-ai";
    typingIndicator.innerHTML =
      '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
    chatHistory.appendChild(typingIndicator);
    scrollToBottom();

    const thinkDelay = prefersReducedMotion ? 120 : 340 + Math.random() * 180;
    pendingReplyTimer = setTimeout(() => {
      pendingReplyTimer = null;
      typingIndicator.remove();
      const freshText = getReplyText(source, currentLang, variantIdx);
      streamAssistantMessage(freshText, {
        kind,
        key,
        variantIdx,
        cta: source.cta || null,
      });
    }, thinkDelay);
  };

  window.__retranslateChatHistory = (lang) => {
    if (!chatHistory) return;
    if (activeStream) {
      finishActiveStream(true, lang);
    }
    chatHistory
      .querySelectorAll(".chat-bubble[data-chat-key]")
      .forEach((bubble) => {
        const kind = bubble.dataset.chatKind;
        const key = bubble.dataset.chatKey;
        const role = bubble.dataset.chatRole;
        const variantIdx = Number(bubble.dataset.chatVariant) || 0;
        const source = getChatSource(kind, key);
        if (!source || !source[lang]) return;
        const text =
          role === "user"
            ? source[lang].prompt
            : getReplyText(source, lang, variantIdx);
        const cta = role === "ai" ? source.cta || null : null;
        renderBubbleContent(bubble, text, cta, lang);
      });
  };

  chatBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const topic = btn.getAttribute("data-topic");
      triggerChatInteraction("topic", topic, null);
    });
  });

  if (chatResetBtn) {
    chatResetBtn.addEventListener("click", () => {
      interactionSeq++;
      if (pendingReplyTimer) {
        clearTimeout(pendingReplyTimer);
        pendingReplyTimer = null;
      }
      finishActiveStream(false);
      chatHistory.innerHTML = "";
      chatInterface.classList.remove("chat-active");
      chatResetBtn.hidden = true;
      highlightTags([]);
    });
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
  // 9. MOBILE NATIVE FULLSCREEN CHAT IMMERSION
  // =========================================================
  const aboutSection = document.getElementById("About");
  const aboutContainer = aboutSection
    ? aboutSection.querySelector(".about-container")
    : null;
  const phoneMockup = document.getElementById("phoneMockup");
  const enterFullscreenBtn = document.getElementById("enterFullscreen");
  const exitFullscreenBtn = document.getElementById("exitFullscreen");
  const chatSkillsRail = document.getElementById("chatSkillsRail");

  // Populate the mobile fullscreen skills rail from the floating tags (single source of truth)
  if (chatSkillsRail && tags.length > 0) {
    tags.forEach((tag) => {
      const skillKey = tag.dataset.skill || "";
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "chat-skill-chip";
      chip.dataset.skill = skillKey;
      chip.textContent = tag.textContent.trim();
      chip.addEventListener("click", () => {
        markArenaDiscovered();
        triggerChatInteraction("skill", skillKey, null);
      });
      chatSkillsRail.appendChild(chip);
    });
  }

  let immersionDismissed = false;

  function isMobileViewport() {
    return window.innerWidth <= 768;
  }

  function enterMobileImmersion() {
    if (!isMobileViewport() || !phoneMockup) return;
    if (document.body.classList.contains("immersion-active")) return;
    // Preserve layout height before detaching #phoneMockup into fixed fullscreen (zero scroll jump)
    if (aboutContainer) {
      aboutContainer.style.minHeight = `${aboutContainer.offsetHeight}px`;
    }
    // Clear any residual GSAP transform on #About so position:fixed anchors to the true viewport
    if (aboutSection) {
      gsap.killTweensOf(aboutSection);
      gsap.set(aboutSection, { opacity: 1, clearProps: "transform" });
    }
    document.body.classList.add("immersion-active");
    if (chatHistory) scrollToBottom();
  }

  function exitMobileImmersion(markDismissed = true) {
    if (!document.body.classList.contains("immersion-active")) return;
    document.body.classList.remove("immersion-active");
    if (aboutContainer) {
      aboutContainer.style.minHeight = "";
    }
    if (markDismissed) {
      immersionDismissed = true;
    }
  }

  if (aboutSection && phoneMockup) {
    // Only engage fullscreen once the chat header actually reaches the top edge of the phone viewport
    ScrollTrigger.create({
      trigger: phoneMockup,
      start: "top 6px",
      end: "bottom 20%",
      onEnter: () => {
        if (isMobileViewport() && !immersionDismissed) {
          enterMobileImmersion();
        }
      },
      onEnterBack: () => {
        if (isMobileViewport() && !immersionDismissed) {
          enterMobileImmersion();
        }
      },
    });

    // Re-arm immersion only after the user leaves the About section completely
    ScrollTrigger.create({
      trigger: aboutSection,
      start: "top bottom",
      end: "bottom top",
      onLeave: () => {
        immersionDismissed = false;
      },
      onLeaveBack: () => {
        immersionDismissed = false;
      },
    });

    // Tapping #About in navigation re-arms immersion on mobile
    document.querySelectorAll('a[href="#About"]').forEach((link) => {
      link.addEventListener("click", () => {
        immersionDismissed = false;
      });
    });

    // Manual re-entry button (shown on mobile after user exits fullscreen)
    if (enterFullscreenBtn) {
      enterFullscreenBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        immersionDismissed = false;
        enterMobileImmersion();
      });
    }

    // Tapping the phone card body on mobile also opens fullscreen
    phoneMockup.addEventListener("click", (e) => {
      if (
        isMobileViewport() &&
        !document.body.classList.contains("immersion-active") &&
        !e.target.closest(
          ".chat-btn, .chat-reset-btn, .chat-inline-link, .chat-fullscreen-btn, .chat-exit-btn, .chat-skill-chip",
        )
      ) {
        immersionDismissed = false;
        enterMobileImmersion();
      }
    });

    if (exitFullscreenBtn) {
      exitFullscreenBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        exitMobileImmersion(true);
      });
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        exitMobileImmersion(true);
      }
    });

    window.addEventListener("resize", () => {
      if (!isMobileViewport()) {
        exitMobileImmersion(false);
        immersionDismissed = false;
      }
    });
  }
});
