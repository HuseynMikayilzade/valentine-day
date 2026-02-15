
/* -----------------------------------------------------------
Premium Valentine One-Page (Pure HTML/CSS/JS + GSAP)
- Opening: roses bloom + particles + optional music
- CTA fades in after ~3.5s
- Modal: blur background + glass entrance + floating hearts
- Parallax: subtle mouse movement
----------------------------------------------------------- */

// --------- Particles (hearts + soft dust) ---------
const canvas = document.getElementById("particlesCanvas");
const ctx = canvas.getContext("2d");
let W, H, DPR;

const particles = [];
const MAX = 90; // mobile-friendly; scales with screen size

function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.width = Math.floor(innerWidth * DPR);
    H = canvas.height = Math.floor(innerHeight * DPR);
    canvas.style.width = innerWidth + "px";
    canvas.style.height = innerHeight + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    seed();
}

function seed() {
    particles.length = 0;
    const count = Math.min(MAX + Math.floor(innerWidth / 18), 160);
    for (let i = 0; i < count; i++) {
        particles.push(makeParticle(true));
    }
}

function makeParticle(randomY = false) {
    const heartChance = Math.random() < 0.18;
    return {
        x: Math.random() * innerWidth,
        y: randomY ? Math.random() * innerHeight : innerHeight + Math.random() * 120,
        r: heartChance < 0.35 ? (2 + Math.random() * 3) : (1 + Math.random() * 2.2),
        type: heartChance < 0.35 ? "heart" : "dust",
        vx: (Math.random() - .5) * 0.18,
        vy: -(0.18 + Math.random() * 0.55),
        a: 0.10 + Math.random() * 0.35,
        drift: (Math.random() - .5) * 0.7,
        tw: Math.random() * Math.PI * 2,
        hue: 330 + Math.random() * 30
    };
}

function drawHeart(x, y, s, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.PI / 4);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, s * 6);
    g.addColorStop(0, `rgba(255, 209, 223, ${alpha})`);
    g.addColorStop(1, `rgba(255, 122, 168, ${alpha * 0.35})`);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.roundRect(-s * 1.2, -s * 1.2, s * 2.4, s * 2.4, s * 0.55);
    ctx.fill();
    // two circles (heart lobes)
    ctx.beginPath();
    ctx.arc(-s * 1.2, 0, s * 1.2, 0, Math.PI * 2);
    ctx.arc(0, -s * 1.2, s * 1.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

function tick() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);

    for (const p of particles) {
        p.tw += 0.02;
        const sway = Math.sin(p.tw) * p.drift;

        p.x += p.vx + sway * 0.03;
        p.y += p.vy;

        if (p.type === "dust") {
            ctx.fillStyle = `rgba(255,255,255,${p.a * 0.35})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
        } else {
            drawHeart(p.x, p.y, p.r, p.a);
        }

        if (p.y < -40 || p.x < -60 || p.x > innerWidth + 60) {
            Object.assign(p, makeParticle(false));
        }
    }

    requestAnimationFrame(tick);
}

// --------- Parallax ---------
const parallaxBg = document.getElementById("parallaxBg");
let px = 0, py = 0;

window.addEventListener("mousemove", (e) => {
    const nx = (e.clientX / innerWidth - 0.5);
    const ny = (e.clientY / innerHeight - 0.5);
    px = nx; py = ny;
    parallaxBg.style.transform = `translate3d(${nx * 10}px, ${ny * 10}px, 0)`;
}, { passive: true });

// --------- Roses bloom sequence ---------
const roseLeft = document.getElementById("roseLeft");
const roseRight = document.getElementById("roseRight");
const roseBottom = document.getElementById("roseBottom");
const ctaWrap = document.getElementById("ctaWrap");
const openBtn = document.getElementById("openBtn");

function bloomRoses() {
    // GSAP entrance motion + CSS petal bloom
    const roses = [roseLeft, roseRight, roseBottom];

    // start petals bloom (CSS)
    roses.forEach((r, i) => setTimeout(() => r.classList.add("bloom"), i * 180));

    // soften motion
    gsap.fromTo(roseLeft,
        { opacity: 0, scale: .9 },
        { opacity: .6, scale: 1, duration: 1.8, ease: "power2.out" }
    ); gsap.to(roseRight, { duration: 1.6, opacity: 1, y: 0, ease: "power3.out", delay: .12 });
    gsap.to(roseBottom, { duration: 1.8, opacity: 1, y: 0, ease: "power3.out", delay: .20 });

    // CTA fade-in after 3.4s
    gsap.to(ctaWrap, {
        delay: 3.4,
        duration: 1.1,
        opacity: 1,
        y: 0,
        ease: "power3.out",
        onStart: () => {
            ctaWrap.style.pointerEvents = "auto";
            ctaWrap.style.transform = "translateY(0)";
        }
    });
}

// --------- Modal logic ---------
const overlay = document.getElementById("overlay");
const modal = document.getElementById("modal");
const closeBtn = document.getElementById("closeBtn");
const modalHearts = document.getElementById("modalHearts");

function openModal() {
    overlay.classList.add("show");
    overlay.setAttribute("aria-hidden", "false");
    modal.classList.add("show");
    document.body.style.overflow = "hidden";
    spawnModalHearts();
}

function closeModal() {
    modal.classList.remove("show");
    overlay.classList.remove("show");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    modalHearts.innerHTML = "";
}

openBtn.addEventListener("click", openModal);
closeBtn.addEventListener("click", closeModal);
overlay.addEventListener("click", (e) => { if (e.target === overlay) closeModal(); });
window.addEventListener("keydown", (e) => { if (e.key === "Escape" && overlay.classList.contains("show")) closeModal(); });

function spawnModalHearts() {
    modalHearts.innerHTML = "";
    const count = Math.min(14, Math.max(8, Math.floor(innerWidth / 90)));
    for (let i = 0; i < count; i++) {
        const el = document.createElement("div");
        el.className = "mheart";
        el.style.left = (8 + Math.random() * 84) + "%";
        el.style.bottom = (-10 + Math.random() * 20) + "px";
        el.style.animationDelay = (Math.random() * 1.6) + "s";
        el.style.setProperty("--drift", ((Math.random() - .5) * 60).toFixed(0) + "px");
        el.style.opacity = "0";
        el.style.transform = "rotate(45deg) scale(" + (0.75 + Math.random() * 0.55).toFixed(2) + ")";
        modalHearts.appendChild(el);
    }
}

// --------- Init ---------
resize();
window.addEventListener("resize", resize, { passive: true });
tick();

// Opening bloom + attempt music after a tiny delay for cinematic feel
window.addEventListener("load", () => {
    bloomRoses();
    setTimeout(tryAutoplay, 500);
});