document.addEventListener("DOMContentLoaded", () => {
    const isMobile = window.innerWidth <= 768;

    const mainContainer = document.getElementById("mainContainer");
    const introOverlay = document.getElementById("introOverlay");
    const bgWrapper = document.querySelector(".bg-wrapper");

    // --- Hard Fail-Safe System ---
    function forceRevealPage() {
        if (introOverlay) introOverlay.classList.add("fade-out");
        if (mainContainer) mainContainer.classList.add("visible");
        if (bgWrapper) bgWrapper.style.opacity = "1";
        gsap.to(".hero-content", { opacity: 1, y: 0, duration: 1.5, ease: "power4.out" });
    }

    // --- Safe Lenis Smooth Scroll ---
    let lenis = null;
    if (typeof Lenis !== 'undefined') {
        lenis = new Lenis({
            duration: 1.4,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            smoothWheel: true
        });
        function raf(time) {
            if (lenis) lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
        lenis.stop();
    }

    // --- Safe GSAP Engine Core ---
    if (typeof gsap === 'undefined') {
        console.warn("GSAP missing. Direct fallback execution.");
        forceRevealPage();
        return;
    }

    // --- Canvas Particles Matrix ---
    const particleCanvas = document.getElementById("particleCanvas");
    if (particleCanvas) {
        const pCtx = particleCanvas.getContext("2d");
        let particles = [];
        function resizeCanvas() {
            particleCanvas.width = window.innerWidth;
            particleCanvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * particleCanvas.width;
                this.y = Math.random() * particleCanvas.height + particleCanvas.height;
                this.size = Math.random() * 1.5 + 0.5;
                this.speedY = Math.random() * -0.4 - 0.2;
                this.speedX = Math.random() * 0.3 - 0.15;
                this.opacity = Math.random() * 0.5 + 0.2;
            }
            update() {
                this.y += this.speedY; this.x += this.speedX;
                if (this.y < -10) this.reset();
            }
            draw() {
                pCtx.fillStyle = `rgba(212, 175, 55, ${this.opacity})`;
                pCtx.beginPath(); pCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2); pCtx.fill();
            }
        }
        for (let i = 0; i < 30; i++) particles.push(new Particle());
        function loop() {
            pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            requestAnimationFrame(loop);
        }
        loop();
    }

    // --- Custom Premium Cursor Sparkles ---
    const cursor = document.getElementById("customCursor");
    if (!isMobile && cursor) {
        cursor.style.display = "block";
        document.addEventListener("mousemove", (e) => {
            gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1 });
            if (Math.random() < 0.07) {
                const sp = document.createElement("div");
                sp.className = "sparkle-particle";
                sp.innerHTML = Math.random() > 0.5 ? "✦" : "♥";
                sp.style.left = `${e.clientX}px`; sp.style.top = `${e.clientY}px`;
                document.body.appendChild(sp);
                gsap.to(sp, {
                    x: Math.random() * 40 - 20, y: Math.random() * 40 - 20,
                    opacity: 0, scale: 1.4, duration: 1.2, onComplete: () => sp.remove()
                });
            }
        });
    }

    // --- Safe Cinematic Intro Timeline Orchestrator ---
    const tlIntro = gsap.timeline({
        onComplete: forceRevealPage,
        onInterrupt: forceRevealPage
    });

    if (document.getElementById("introStar") && document.getElementById("introText")) {
        tlIntro.to("#introStar", { opacity: 1, duration: 1.2 })
               .to("#introText", { opacity: 1, duration: 1, onStart: () => { document.getElementById("introText").innerText = "Made with hope."; } }, "+=0.3")
               .to("#introText", { opacity: 0, duration: 0.8 }, "+=1")
               .to("#introText", { opacity: 1, duration: 1, onStart: () => { document.getElementById("introText").innerText = "For someone..."; } }, "+=0.3")
               .to("#introText", { opacity: 0, duration: 0.8 }, "+=1")
               .to("#introText", { opacity: 1, fontStyle: "italic", duration: 1.2, onStart: () => { document.getElementById("introText").innerText = "Pute."; } }, "+=0.3")
               .to("#introText", { opacity: 0, duration: 0.8 }, "+=1")
               .to("#introStar", { scale: 35, opacity: 0, duration: 1.5, ease: "power2.inOut" }, "-=0.2");
    } else {
        forceRevealPage();
    }

    // --- No Escape Button Mechanism ---
    const btnNo = document.getElementById("btnNo");
    const speechBubble = document.getElementById("speechBubble");
    const noPhrases = ["Really?", "Come on...", "Please...", "Just one minute...", "I made this for you...", "Puteeee...", "Fine...", "Hear me out?"];
    let phraseIdx = 0;

    function escapeTarget() {
        const wrap = document.getElementById("escapeContainer");
        if (!wrap) return;
        const factor = isMobile ? 80 : 180;
        const rx = (Math.random() - 0.5) * factor;
        const ry = (Math.random() - 0.5) * factor;
        gsap.to(wrap, { x: rx, y: ry, duration: 0.4, ease: "power2.out" });

        if (speechBubble) {
            speechBubble.innerText = noPhrases[phraseIdx];
            speechBubble.classList.add("visible");
            phraseIdx = (phraseIdx + 1) % noPhrases.length;
            gsap.killTweensOf(hideBubble);
            gsap.delayedCall(1.5, hideBubble);
        }
    }
    function hideBubble() { if (speechBubble) speechBubble.classList.remove("visible"); }

    if (btnNo) {
        if (!isMobile) {
            document.addEventListener("mousemove", (e) => {
                const r = btnNo.getBoundingClientRect();
                if (Math.hypot(e.clientX - (r.left + r.width/2), e.clientY - (r.top + r.height/2)) < 80) escapeTarget();
            });
        } else {
            btnNo.addEventListener("touchstart", (e) => { e.preventDefault(); escapeTarget(); });
        }
    }

    // --- Audio Player Controller ---
    const bgMusic = document.getElementById("bgMusic");
    const audioControl = document.getElementById("audioControl");
    function startMusic() {
        if (!bgMusic || !audioControl) return;
        bgMusic.volume = 0;
        bgMusic.play().then(() => {
            gsap.to(bgMusic, { volume: 0.6, duration: 3 });
            audioControl.classList.add("playing");
        }).catch(() => console.log("Gesture tracking enabled."));
    }

    if (audioControl && bgMusic) {
        audioControl.addEventListener("click", () => {
            if (bgMusic.paused) { bgMusic.play(); audioControl.classList.add("playing"); }
            else { bgMusic.pause(); audioControl.classList.remove("playing"); }
        });
    }

    // --- Yes Button Transition Core ---
    const btnYes = document.getElementById("btnYes");
    if (btnYes) {
        btnYes.addEventListener("click", () => {
            startMusic();
            document.body.classList.add("light-theme");
            gsap.to("#heroSection .hero-content", { opacity: 0, y: -20, duration: 1 });

            const revOverlay = document.getElementById("revealOverlay");
            if (revOverlay) {
                revOverlay.style.display = "flex";
                const tlRev = gsap.timeline({
                    onComplete: () => {
                        revOverlay.remove();
                        if (document.getElementById("heroSection")) document.getElementById("heroSection").remove();
                        const letSec = document.getElementById("letterSection");
                        if (letSec) letSec.style.display = "flex";
                        
                        gsap.to("#audioControl", { autoAlpha: 1, duration: 1 });
                        gsap.to("#envelopeWrapper", { opacity: 1, y: 0, duration: 1.2 });
                        
                        gsap.to(".envelope-flap", {
                            borderTopColor: "#C8BFAF", rotateX: 180, duration: 1, delay: 0.3,
                            onComplete: () => {
                                document.querySelector(".envelope-flap").style.zIndex = 0;
                                gsap.to(".envelope-paper", { y: -120, height: "auto", duration: 1.2 });
                                gsap.to(".btn-continue", { opacity: 1, y: 0, duration: 0.8, delay: 0.5 });
                            }
                        });
                    }
                });
                tlRev.to(revOverlay, { opacity: 1, duration: 0.6 })
                     .to("#rev1", { opacity: 1, duration: 1 })
                     .to("#rev1", { opacity: 0, duration: 0.6 }, "+=0.5")
                     .to("#rev2", { opacity: 1, duration: 1 })
                     .to("#rev2", { opacity: 0, duration: 0.6 }, "+=0.5")
                     .to("#rev3", { opacity: 1, duration: 1 })
                     .to("#rev3", { opacity: 0, duration: 0.8 }, "+=0.8")
                     .to(revOverlay, { opacity: 0, duration: 0.6 });
            }
        });
    }

    // --- Continue Trigger ---
    const btnContinue = document.getElementById("btnContinue");
    if (btnContinue) {
        btnContinue.addEventListener("click", () => {
            gsap.to("#letterSection", {
                opacity: 0, y: -20, duration: 0.8, onComplete: () => {
                    document.getElementById("letterSection").remove();
                    document.getElementById("plannerSection").style.display = "flex";
                    document.getElementById("endingSection").style.display = "flex";
                    if (lenis) lenis.start();

                    gsap.fromTo(".polaroid", { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 1 });
                    gsap.fromTo(".planner-card", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, delay: 0.2 });
                    initConstellation();
                }
            });
        });
    }

    // --- Choice Chips UX ---
    const chips = document.querySelectorAll(".chip");
    chips.forEach(c => c.addEventListener("click", () => {
        chips.forEach(ch => ch.classList.remove("active"));
        c.classList.add("active");
    }));

    // --- Save Button Flow ---
    const btnSave = document.getElementById("btnSave");
    if (btnSave) {
        btnSave.addEventListener("click", () => {
            if (!document.getElementById("planDate").value || !document.getElementById("planTime").value) {
                gsap.fromTo(".planner-card", { x: -6 }, { x: 0, duration: 0.3, clearProps: "x" });
                return;
            }
            btnSave.innerText = "Invitation Stored 💛";
            btnSave.style.background = "#A3801C";
            setTimeout(() => { if (lenis) lenis.scrollTo("#endingSection", { duration: 1.5 }); }, 500);
        });
    }

    // --- Breathing Constellation Map ---
    function initConstellation() {
        const canvas = document.getElementById("constellationCanvas");
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        let pts = [];
        function sz() { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; }
        sz();
        pts = [
            { x: canvas.width * 0.2, y: canvas.height * 0.7, ox: canvas.width * 0.2, oy: canvas.height * 0.7 },
            { x: canvas.width * 0.35, y: canvas.height * 0.3, ox: canvas.width * 0.35, oy: canvas.height * 0.3 },
            { x: canvas.width * 0.5, y: canvas.height * 0.6, ox: canvas.width * 0.5, oy: canvas.height * 0.6 },
            { x: canvas.width * 0.65, y: canvas.height * 0.2, ox: canvas.width * 0.65, oy: canvas.height * 0.2 },
            { x: canvas.width * 0.8, y: canvas.height * 0.5, ox: canvas.width * 0.8, oy: canvas.height * 0.5 }
        ];
        function render() {
            if (!document.getElementById("constellationCanvas")) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = "rgba(212, 175, 55, 0.25)"; ctx.lineWidth = 1; ctx.beginPath();
            for (let i = 0; i < pts.length; i++) {
                pts[i].x = pts[i].ox + Math.sin(Date.now() * 0.001 + i) * 3;
                pts[i].y = pts[i].oy + Math.cos(Date.now() * 0.001 + i) * 3;
                if (i === 0) ctx.moveTo(pts[i].x, pts[i].y); else ctx.lineTo(pts[i].x, pts[i].y);
            }
            ctx.stroke();
            pts.forEach(p => {
                ctx.fillStyle = "rgba(212, 175, 55, 0.8)"; ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI * 2); ctx.fill();
            });
            requestAnimationFrame(render);
        }
        render();
    }
});