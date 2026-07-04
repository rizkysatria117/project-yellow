document.addEventListener('DOMContentLoaded', () => {
    // 1. Particle System
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.5 + 0.5;
            this.speedY = -(Math.random() * 0.4 + 0.1);
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        update() {
            this.y += this.speedY;
            if (this.y < 0) {
                this.y = canvas.height;
                this.x = Math.random() * canvas.width;
            }
        }
        draw() {
            ctx.fillStyle = `rgba(223, 183, 108, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < 50; i++) { particles.push(new Particle()); }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animate);
    }
    animate();

    // 2. Timings & Elements + Vault Logic
    const introOverlay = document.getElementById('introOverlay');
    const introText = document.getElementById('introText');
    const mainContainer = document.getElementById('mainContainer');
    const audioControl = document.getElementById('audioControl');
    const bgMusic = document.getElementById('bgMusic');
    const errorMsg = document.getElementById('errorMsg');
    const pinBoxes = document.querySelectorAll('.pin-box');

    // Set password di sini (Contoh: '0109' pas hari ulang tahun kamu)
    const SECRET_PIN = "0109"; 

    setTimeout(() => { introText.style.opacity = '1'; }, 500);

    // Auto-focus pindah kotak otomatis saat mengetik
    pinBoxes.forEach((box, idx) => {
        box.addEventListener('input', (e) => {
            if (box.value.length === 1 && idx < pinBoxes.length - 1) {
                pinBoxes[idx + 1].focus();
            }
            checkPin();
        });

        box.addEventListener('keydown', (e) => {
            if (e.key === "Backspace" && box.value.length === 0 && idx > 0) {
                pinBoxes[idx - 1].focus();
            }
        });
    });

    let isPlaying = false;
let attemptCount = 0;
   function checkPin() {
    let typedPin = "";
    pinBoxes.forEach(box => typedPin += box.value);

    if (typedPin.length === 4) {
        if (typedPin === "0109") {
            // PIN BENAR
            attemptCount = 0; // Reset counter
            if (bgMusic) {
                bgMusic.play().then(() => {
                    if(audioControl) audioControl.classList.add('playing');
                    isPlaying = true;
                }).catch(err => console.log("Music blocked:", err));
            }
            
            if(errorMsg) errorMsg.style.opacity = "0";
            introOverlay.style.opacity = '0';
            
            setTimeout(() => {
                introOverlay.style.display = 'none';
                if(mainContainer) mainContainer.classList.add('visible');
                if(audioControl) {
                    audioControl.style.opacity = '1';
                    audioControl.style.visibility = 'visible';
                }
            }, 1000);
        } else {
            // PIN SALAH
            attemptCount++;
            
            // FITUR BOCORAN ROMANTIS
            if (attemptCount >= 2) {
                errorMsg.innerText = "psstt.. tanggal jadian kita";
            } else {
                errorMsg.innerText = "Incorrect key. Try again...";
            }

            if(errorMsg) errorMsg.style.opacity = "1";
            pinBoxes.forEach(box => {
                box.value = "";
                box.style.borderColor = "#ff4d4d";
                setTimeout(() => box.style.borderColor = "rgba(223, 183, 108, 0.2)", 1000);
            });
            pinBoxes[0].focus();
        }
    }
}

    // 3. Audio Control Manual Toggle
    audioControl.addEventListener('click', (e) => {
        e.stopPropagation(); // Biar tidak bentrok
        if (!isPlaying) {
            bgMusic.play().then(() => {
                audioControl.classList.add('playing');
                isPlaying = true;
            });
        } else {
            bgMusic.pause();
            audioControl.classList.remove('playing');
            isPlaying = false;
        }
    });

    // 4. Escape Button "No"
    const btnNo = document.getElementById('btnNo');
    const speechBubble = document.getElementById('speechBubble');
    let count = 0;
    const quotes = ["Really?", "Please hear me out...", "Give me a chance? :("];

    btnNo.addEventListener('mouseover', () => {
        if (window.innerWidth > 768) {
            btnNo.style.transform = `translate(${(Math.random() - 0.5) * 200}px, ${(Math.random() - 0.5) * 100}px)`;
            speechBubble.textContent = quotes[count % quotes.length];
            speechBubble.classList.add('visible');
            count++;
        }
    });

    // 5. Transition to Envelope Letter
    const btnYes = document.getElementById('btnYes');
    const revealOverlay = document.getElementById('revealOverlay');
    const heroSection = document.getElementById('heroSection');
    const letterSection = document.getElementById('letterSection');

    btnYes.addEventListener('click', () => {
        // Backup jika klik pertama gagal memicu musik
        if (!isPlaying && bgMusic) {
            bgMusic.play().then(() => {
                audioControl.classList.add('playing');
                isPlaying = true;
            });
        }

        revealOverlay.style.display = 'flex';
        const tl = gsap.timeline();
        tl.to('#rev1', { opacity: 1, duration: 1, yoyo: true, repeat: 1, repeatDelay: 0.5 })
          .to('#rev2', { opacity: 1, duration: 1, yoyo: true, repeat: 1, repeatDelay: 0.5 })
          .to('#rev3', { opacity: 1, duration: 1, yoyo: true, repeat: 1, repeatDelay: 0.5 })
          .to(revealOverlay, { opacity: 0, duration: 0.8, onComplete: () => {
              revealOverlay.style.display = 'none';
              heroSection.style.display = 'none';
              letterSection.style.display = 'flex';
          }});
    });

    // 6. Envelope Open Trigger
    const envelopeWrapper = document.getElementById('envelopeWrapper');
    const btnContinue = document.getElementById('btnContinue');
    
    envelopeWrapper.addEventListener('click', () => {
        envelopeWrapper.classList.toggle('open');
        if(envelopeWrapper.classList.contains('open')) {
            btnContinue.classList.add('visible');
        } else {
            btnContinue.classList.remove('visible');
        }
    });

    // 7. Transition to Date Planner
    const plannerSection = document.getElementById('plannerSection');
    btnContinue.addEventListener('click', () => {
        letterSection.style.display = 'none';
        plannerSection.style.display = 'flex';
    });

    const chips = document.querySelectorAll('.chip');
    chips.forEach(c => {
        c.addEventListener('click', () => {
            chips.forEach(ch => ch.classList.remove('active'));
            c.classList.add('active');
        });
    });

    // 8. Ending Save Trigger
    const btnSave = document.getElementById('btnSave');
    const endingSection = document.getElementById('endingSection');
    btnSave.addEventListener('click', () => {
        const d = document.getElementById('planDate').value;
        const t = document.getElementById('planTime').value;
        if(!d || !t) { alert("Please pick a beautiful date and time first! :)"); return; }
        
        plannerSection.style.display = 'none';
        endingSection.style.display = 'flex';
    });
});const cursor = document.querySelector(".cursor");

const particles = ["✨","⭐","💛"];

document.addEventListener("mousemove",(e)=>{

    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";

    if(Math.random() < 0.35){

        const s = document.createElement("div");

        s.className = "particle";

        s.innerHTML = particles[Math.floor(Math.random()*particles.length)];

        s.style.left = e.clientX + "px";
        s.style.top = e.clientY + "px";

        document.body.appendChild(s);

        setTimeout(()=>{
            s.remove();
        },800);

    }

});