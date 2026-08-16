// Initialize GSAP and ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  // 1. Hero Entrance Animation
  const heroTl = gsap.timeline();

  // Animate the big background text
  heroTl
    .fromTo(
      ".background-text",
      { y: 100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.5, ease: "power3.out" },
    )
    // Animate the main text content
    .fromTo(
      ".text h2",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
      "-=1.0",
    )
    .fromTo(
      ".text p",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
      "-=0.6",
    )
    .fromTo(
      ".text button",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "back.out(1.7)" },
      "-=0.4",
    )
    // Animate the profile image
    .fromTo(
      ".photo-wrapper img",
      { y: 50, opacity: 0, scale: 0.95 },
      { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "power3.out" },
      "-=1.2",
    );

  // 2. Parallax Effect on Background Text
  gsap.to(".background-text", {
    y: 200, // Move down as user scrolls down
    ease: "none",
    scrollTrigger: {
      trigger: ".Home",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });

  // 3. Infinite Horizontal Scroll for Skills Carousel
  const track = document.querySelector(".skills-track");

  // Dynamically clone the contents to ensure it's wide enough for any screen
  // We clone the existing sequence multiple times.
  // Since we move by -50%, having an even number of identical sequences ensures a seamless loop.
  const originalHTML = track.innerHTML;
  for (let i = 0; i < 6; i++) {
    track.innerHTML += originalHTML;
  }

  gsap.to(".skills-track", {
    xPercent: -50,
    ease: "none",
    duration: 140, // Much slower: proportional to the new total width
    repeat: -1,
  });

  // 4. Fade Up for Sections (About, Projects, Contact)
  const sections = gsap.utils.toArray(".section:not(.Home)");

  sections.forEach((sec) => {
    gsap.fromTo(
      sec,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sec,
          start: "top 80%", // Trigger when top of section hits 80% of viewport
          toggleActions: "play none none reverse", // Play forward on enter, reverse on leave back
        },
      },
    );
  });

    // 5. About Section - Floating Tags Animation (Fabric Physics Engine)
    const container = document.getElementById("floatingTagsContainer");
    const tags = Array.from(document.querySelectorAll(".tag"));

    const tagData = tags.map((tag, i) => ({
        el: tag,
        baseX: 0, baseY: 0,
        floatX: 0, floatY: 0,
        vx: 0, vy: 0,
        origX: 0, origY: 0,
        w: 0, h: 0
    }));

    function cacheLayout() {
        tagData.forEach((data, i) => {
            data.origX = tags[i].offsetLeft;
            data.origY = tags[i].offsetTop;
            data.w = tags[i].offsetWidth;
            data.h = tags[i].offsetHeight;
        });
    }

    function initFloating() {
        tagData.forEach(data => {
            // Independent smooth float animation
            function animateFloat() {
                const speed = parseFloat(data.el.getAttribute("data-speed")) || 1;
                gsap.to(data, {
                    floatX: (Math.random() * 40 - 20),
                    floatY: (Math.random() * 30 - 15),
                    duration: 3 + Math.random() * 3 / speed,
                    ease: "sine.inOut",
                    onComplete: animateFloat
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
                onDragStart: function() {
                    tag.classList.add("is-dragging");
                },
                onDrag: function() {
                    data.baseX = this.x - data.floatX;
                    data.baseY = this.y - data.floatY;
                    data.vx = 0;
                    data.vy = 0;
                },
                onDragEnd: function() {
                    tag.classList.remove("is-dragging");
                }
            });
        });
    }

    gsap.ticker.add(() => {
        if (!container) return;
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;

        // --- Physics Step 1: Accumulate Forces ---
        for (let i = 0; i < tagData.length; i++) {
            const dataA = tagData[i];
            if (dataA.el.classList.contains("is-dragging")) continue;

            // b. N-Body Collision Repulsion (Ball-pit fabric behavior)
            for (let j = 0; j < tagData.length; j++) {
                if (i === j) continue;
                const dataB = tagData[j];

                // Absolute center coordinates for accurate real-world distance (CACHED for performance)
                const aAbsX = dataA.origX + dataA.baseX + dataA.floatX;
                const aAbsY = dataA.origY + dataA.baseY + dataA.floatY;
                
                const bAbsX = dataB.origX + dataB.baseX + dataB.floatX;
                const bAbsY = dataB.origY + dataB.baseY + dataB.floatY;

                const dx = aAbsX - bAbsX;
                const dy = aAbsY - bAbsY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                // AABB distance (distance between centers on X and Y)
                const absDx = Math.abs(dx);
                const absDy = Math.abs(dy);

                const minDx = (dataA.w / 2) + (dataB.w / 2) + 20; // 20px padding X
                const minDy = (dataA.h / 2) + (dataB.h / 2) + 15; // 15px padding Y

                if (absDx < minDx && absDy < minDy && dist > 0) {
                    // They are intersecting. Figure out the axis of least penetration
                    const overlapX = minDx - absDx;
                    const overlapY = minDy - absDy;
                    
                    const pushStrength = 0.08; // Stronger push because of damping
                    
                    if (overlapX < overlapY) {
                        // Resolve horizontally
                        const dirX = dx > 0 ? 1 : -1;
                        dataA.vx += dirX * overlapX * pushStrength;
                    } else {
                        // Resolve vertically
                        const dirY = dy > 0 ? 1 : -1;
                        dataA.vy += dirY * overlapY * pushStrength;
                    }
                    
                    // Viscous damping (soap effect): kills explosive momentum so they don't bounce off each other
                    dataA.vx *= 0.75;
                    dataA.vy *= 0.75;
                }
            }
        }

        // --- Physics Step 2: Integration & Constraints ---
        tagData.forEach(data => {
            if (!data.el.classList.contains("is-dragging")) {
                // Apply Friction (Fluid resistance)
                const friction = 0.92;
                data.vx *= friction;
                data.vy *= friction;

                // Move base position
                data.baseX += data.vx;
                data.baseY += data.vy;

                // Container Boundaries (Hard Clamping with 25px padding to keep them strictly inside)
                const tagWidth = data.w;
                const tagHeight = data.h;
                
                const minCenterX = (tagWidth / 2) + 25;
                const maxCenterX = containerWidth - (tagWidth / 2) - 25;
                let currentCenterX = data.origX + data.baseX;
                
                if (currentCenterX < minCenterX) {
                    data.baseX = minCenterX - data.origX;
                    data.vx = 0; // Zero bounce
                } else if (currentCenterX > maxCenterX) {
                    data.baseX = maxCenterX - data.origX;
                    data.vx = 0;
                }
                
                const minCenterY = (tagHeight / 2) + 25;
                const maxCenterY = containerHeight - (tagHeight / 2) - 25;
                let currentCenterY = data.origY + data.baseY;
                
                if (currentCenterY < minCenterY) {
                    data.baseY = minCenterY - data.origY;
                    data.vy = 0;
                } else if (currentCenterY > maxCenterY) {
                    data.baseY = maxCenterY - data.origY;
                    data.vy = 0;
                }

                // Render final positions (Base Physics + GSAP Floating)
                gsap.set(data.el, {
                    x: data.baseX + data.floatX,
                    y: data.baseY + data.floatY,
                    rotation: (data.floatX / 20) * 4,
                    force3D: true
                });
            } else {
                 // Dragging Override: Keep base in sync with user's pointer
                 const dragInst = Draggable.get(data.el);
                 if (dragInst) {
                     data.baseX = dragInst.x - data.floatX;
                     data.baseY = dragInst.y - data.floatY;
                     gsap.set(data.el, { rotation: (data.floatX / 20) * 4 });
                 }
            }
        });
    });

    window.addEventListener("load", () => {
        cacheLayout();
        initFloating();
        initDraggable();
    });

    let resizeTimeout;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            cacheLayout();
            tags.forEach(tag => {
                const dragInst = Draggable.get(tag);
                if (dragInst) dragInst.applyBounds(container);
            });
        }, 200);
    });

  const chatOptions = document.getElementById("chatOptions");
  const chatHistory = document.getElementById("chatHistory");
  const chatBtns = document.querySelectorAll(".chat-btn");

  // Placeholder data for the AI responses
  const chatData = {
    experiences: [
      "Borges has worked as an apprentice at HPE, was an apprentice at São Nicolau Hospital, and has now evolved to a Technician role.",
      "With a strong background for someone his age, he has worked in 2 places and recently got promoted at his current company.",
    ],
    about: [
      "He is a Systems Analysis and Development student, driven by curiosity and a passion for understanding how things work under the hood.",
    ],
    stack: [
      "His main stack involves Python, Django, Data Analytics with Pandas, Automation with Selenium, and he is exploring Langchain for AI.",
    ],
    projects: [
      "Scroll down to the Projects section to see some of his open-source work and personal experiments!",
    ],
  };

  chatBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const topic = btn.getAttribute("data-topic");
      const btnText = btn.textContent.trim(); // Get the clean text

      // 1. Hide options & activate chat layout
      chatOptions.style.display = "none";
      document.getElementById("chatInterface").classList.add("chat-active");

      // 2. Add User Message
      addMessage(btnText, "user");

      // 3. Show "Thinking..." indicator
      const typingIndicator = document.createElement("div");
      typingIndicator.className = "typing-indicator chat-bubble chat-ai";
      typingIndicator.innerHTML =
        '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
      chatHistory.appendChild(typingIndicator);
      scrollToBottom();

      // 4. Wait, then show response
      setTimeout(() => {
        // Remove typing indicator
        typingIndicator.remove();

        // Get random response from the JSON/Data
        const responses = chatData[topic];
        const randomResponse =
          responses[Math.floor(Math.random() * responses.length)];

        // Add AI Message
        addMessage(randomResponse, "ai");

        // Show options again
        chatOptions.style.display = "grid";
        scrollToBottom();

        // Gentle shift of floating tags on interaction
        gsap.to(tags, {
          x: () => "+=" + (Math.random() * 40 - 20),
          duration: 1,
          ease: "power2.out",
        });
      }, 1500); // 1.5 seconds thinking time
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

  // 7. Mobile Fullscreen Immersion Logic
  const phoneMockup = document.getElementById("phoneMockup");
  const exitFullscreenBtn = document.getElementById("exitFullscreen");

  // Click on phone on mobile to enter immersion
  phoneMockup.addEventListener("click", (e) => {
    // Only trigger if we are on mobile (< 768px) and not clicking a chat button
    if (window.innerWidth <= 768 && !e.target.closest(".chat-btn")) {
      if (!document.body.classList.contains("immersion-active")) {
        document.body.classList.add("immersion-active");
      }
    }
  });

  // Click on exit button to leave immersion
  exitFullscreenBtn.addEventListener("click", () => {
    document.body.classList.remove("immersion-active");
  });
});
