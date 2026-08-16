// Initialize GSAP and ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Hero Entrance Animation
    const heroTl = gsap.timeline();
    
    // Animate the big background text
    heroTl.fromTo(".background-text", 
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.5, ease: "power3.out" }
    )
    // Animate the main text content
    .fromTo(".text h2", 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
        "-=1.0"
    )
    .fromTo(".text p", 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
        "-=0.6"
    )
    .fromTo(".text button", 
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "back.out(1.7)" },
        "-=0.4"
    )
    // Animate the profile image
    .fromTo(".photo-wrapper img", 
        { y: 50, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "power3.out" },
        "-=1.2"
    );

    // 2. Parallax Effect on Background Text
    gsap.to(".background-text", {
        y: 200, // Move down as user scrolls down
        ease: "none",
        scrollTrigger: {
            trigger: ".Home",
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });

    // 3. Infinite Horizontal Scroll for Skills Carousel
    const track = document.querySelector(".skills-track");
    
    // Dynamically clone the contents to ensure it's wide enough for any screen
    // We clone the existing sequence multiple times. 
    // Since we move by -50%, having an even number of identical sequences ensures a seamless loop.
    const originalHTML = track.innerHTML;
    for(let i = 0; i < 6; i++) {
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
        gsap.fromTo(sec, 
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: sec,
                    start: "top 80%", // Trigger when top of section hits 80% of viewport
                    toggleActions: "play none none reverse" // Play forward on enter, reverse on leave back
                }
            }
        );
    });

    // 5. Smooth Nav Link Scrolling (Fallback if CSS scroll-behavior isn't enough, but CSS is good)
    // The CSS scroll-behavior: smooth handles most of it now.
});
