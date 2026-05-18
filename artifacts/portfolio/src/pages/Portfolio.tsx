import { useEffect, useRef, useState, useCallback } from "react";

function useTheme() {
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false;
    const stored = localStorage.getItem("portfolio-theme");
    if (stored) return stored === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      dark ? "dark" : "light",
    );
    localStorage.setItem("portfolio-theme", dark ? "dark" : "light");
  }, [dark]);

  const toggle = useCallback(() => setDark((d) => !d), []);
  return { dark, toggle };
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2" x2="12" y2="4" />
      <line x1="12" y1="20" x2="12" y2="22" />
      <line x1="4.93" y1="4.93" x2="6.34" y2="6.34" />
      <line x1="17.66" y1="17.66" x2="19.07" y2="19.07" />
      <line x1="2" y1="12" x2="4" y2="12" />
      <line x1="20" y1="12" x2="22" y2="12" />
      <line x1="4.93" y1="19.07" x2="6.34" y2="17.66" />
      <line x1="17.66" y1="6.34" x2="19.07" y2="4.93" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

const NAV_ITEMS = [
  { id: "about",    label: "About" },
  { id: "research", label: "Research Areas" },
  { id: "skills",   label: "Lab Skills" },
  { id: "projects", label: "Projects" },
  { id: "awards",   label: "Tools" },
  { id: "contact",  label: "Contact" },
];

const PHRASES = [
  "Aspiring Biotechnologist/",
  "Researcher/",
  "DOST Scholar/",
  "Lab-Ready/",
  "Detail-Oriented/",
];

function useTypewriter() {
  const [text, setText] = useState("");
  const state = useRef({ pi: 0, ci: 0, del: false });

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    function tick() {
      const { pi, ci, del } = state.current;
      const cur = PHRASES[pi];
      const next = del ? cur.slice(0, ci - 1) : cur.slice(0, ci + 1);
      setText(next);
      if (del) { state.current.ci = ci - 1; } else { state.current.ci = ci + 1; }
      let wait = del ? 55 : 95;
      const newCi = state.current.ci;
      if (!del && newCi === cur.length) {
        wait = 1900;
        state.current.del = true;
      } else if (del && newCi === 0) {
        state.current.del = false;
        state.current.pi = (pi + 1) % PHRASES.length;
        wait = 280;
      }
      timer = setTimeout(tick, wait);
    }
    tick();
    return () => clearTimeout(timer);
  }, []);

  return text;
}

function useScrollReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }); },
      { threshold: 0.08 },
    );
    document.querySelectorAll(".reveal, .stagger").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

function useCounterAnimation() {
  useEffect(() => {
    const countUp = (el: Element, target: number, dur = 1400) => {
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        (el as HTMLElement).textContent = String(Math.floor(ease * target));
        if (p < 1) requestAnimationFrame(tick);
        else (el as HTMLElement).textContent = String(target);
      };
      requestAnimationFrame(tick);
    };
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.querySelectorAll("[data-target]").forEach((el) => {
              countUp(el, Number((el as HTMLElement).dataset.target));
            });
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.35 },
    );
    const aboutSec = document.getElementById("about");
    if (aboutSec) obs.observe(aboutSec);
    return () => obs.disconnect();
  }, []);
}

function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cvs = canvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;

    const resize = () => { cvs.width = window.innerWidth; cvs.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const pts = Array.from({ length: 50 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.8 + 0.4,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      op: Math.random() * 0.3 + 0.05,
      ring: Math.random() > 0.55,
      pulse: Math.random() * Math.PI * 2,
    }));

    let frame = 0;
    let rafId: number;

    function draw() {
      if (!ctx || !cvs) return;
      ctx.clearRect(0, 0, cvs.width, cvs.height);
      frame++;
      pts.forEach((p) => {
        const pulse = 0.5 + 0.5 * Math.sin(frame * 0.018 + p.pulse);
        const op = p.op * (0.6 + 0.4 * pulse);
        ctx.beginPath();
        if (p.ring) {
          ctx.arc(p.x, p.y, p.r * 2.5, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(46,128,96,${op * 0.55})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        } else {
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(46,128,96,${op})`;
          ctx.fill();
        }
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = cvs.width;
        if (p.x > cvs.width) p.x = 0;
        if (p.y < 0) p.y = cvs.height;
        if (p.y > cvs.height) p.y = 0;
      });
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(46,128,96,${0.06 * (1 - dist / 90)})`;
            ctx.lineWidth = 0.4;
            ctx.stroke();
          }
        }
      }
      rafId = requestAnimationFrame(draw);
    }
    draw();
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(rafId); };
  }, []);

  return <canvas ref={canvasRef} id="particle-canvas" />;
}

function ProfilePhoto({ size = 92 }: { size?: number }) {
  return (
    <div className="profile-wrap" style={{ width: size, height: size }}>
      <div className="profile-photo" style={{ width: size, height: size, fontSize: size * 0.3 }}>
        <img src="/profile.jpg" alt="Jefferson T. Perolino" className="profile-photo-img" />
      </div>
      <div className="profile-ring" />
      <div className="profile-ring-2" />
    </div>
  );
}

function Sidebar({
  activeSection, onNavClick, dark, onToggleTheme,
}: {
  activeSection: string; onNavClick: (id: string) => void; dark: boolean; onToggleTheme: () => void;
}) {
  return (
    <aside className="sidebar">
      <ProfilePhoto size={92} />
      <div className="profile-name">Jefferson<br />T. Perolino</div>
      <div className="profile-role">Aspiring Biotechnologist · Researcher</div>
      <div className="profile-location">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
        </svg>
        Iloilo City, Philippines
      </div>
      <div className="availability-badge">
        <span className="avail-dot" />
        Open to Research Opportunities
      </div>
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <button key={item.id} className={`nav-item${activeSection === item.id ? " active" : ""}`} onClick={() => onNavClick(item.id)}>
            {item.label}
          </button>
        ))}
      </nav>
      <div className="sidebar-spacer" />
      <div className="social-row">
        <a className="social-btn" href="https://linkedin.com/in/jeffersonperolino" title="LinkedIn" target="_blank" rel="noreferrer">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
            <circle cx="4" cy="4" r="2" />
          </svg>
        </a>
        <a className="social-btn" href="mailto:jefferson.perolino@wvsu.edu.ph" title="Email">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-10 7L2 7" />
          </svg>
        </a>
        <a className="social-btn" href="tel:+639816145783" title="Phone">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.07 11.9 19.79 19.79 0 0 1 1 3.22 2 2 0 0 1 2.98 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </a>
        <button className="theme-toggle" onClick={onToggleTheme} title={dark ? "Switch to light mode" : "Switch to dark mode"}>
          {dark ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>
    </aside>
  );
}

function MobileHero({ onNavClick, typewriterText }: { onNavClick: (id: string) => void; typewriterText: string; }) {
  return (
    <div className="mobile-hero" id="mobile-hero">
      <div className="mobile-hero-profile-wrap">
        <div className="mobile-hero-photo">
          <img src="/profile.jpg" alt="Jefferson T. Perolino" className="profile-photo-img" />
        </div>
      </div>
      <div className="mobile-hero-name">Jefferson<br />T. Perolino</div>
      <div className="mobile-hero-role">Biotechnologist · Researcher</div>
      <div className="mobile-hero-avail">
        <span className="avail-dot" />
        Open to Research Opportunities
      </div>
      {typewriterText && (
        <div className="mobile-hero-typewriter">
          {typewriterText}<span className="tw-cursor">|</span>
        </div>
      )}
      <p className="mobile-hero-desc">
        A DOST-SEI Scholar and BS Biology student majoring in Biotechnology at West Visayas State University — grounded in molecular techniques, driven by sustainable science.
      </p>
      <div className="mobile-hero-cta">
        <button className="mh-btn-primary" onClick={() => onNavClick("contact")}>Get in touch</button>
        <button className="mh-btn-secondary" onClick={() => onNavClick("projects")}>View research</button>
      </div>
    </div>
  );
}

function MobileStickyHeader({
  visible, activeSection, onNavClick, dark, onToggleTheme,
}: {
  visible: boolean; activeSection: string; onNavClick: (id: string) => void; dark: boolean; onToggleTheme: () => void;
}) {
  return (
    <div className={`mobile-sticky-header${visible ? " visible" : ""}`}>
      <div className="mobile-sticky-inner">
        <div className="mobile-sticky-left">
          <div className="mobile-sticky-photo">
            <img src="/profile.jpg" alt="Jefferson T. Perolino" className="profile-photo-img" />
          </div>
          <div className="mobile-sticky-name">Jefferson T. Perolino</div>
        </div>
        <nav className="mobile-sticky-nav">
          {NAV_ITEMS.map((item) => (
            <button key={item.id} className={`mobile-sticky-nav-item${activeSection === item.id ? " active" : ""}`} onClick={() => onNavClick(item.id)}>
              {item.label}
            </button>
          ))}
        </nav>
        <button className="mobile-theme-toggle" onClick={onToggleTheme} title={dark ? "Switch to light mode" : "Switch to dark mode"}>
          {dark ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   TOOL ICONS
────────────────────────────────────────────── */

function OverleafIcon() {
  return (
    <svg viewBox="0 0 56 56" width="44" height="44" xmlns="http://www.w3.org/2000/svg">
      <circle cx="28" cy="28" r="28" fill="#47A141"/>
      <g transform="translate(6,5) scale(1.83)">
        <path fill="white" d="M22.3515.7484C19.1109-.5101 7.365-.982 7.3452 6.0266c-3.4272 2.194-5.6967 5.768-5.6967 9.598a8.373 8.373 0 0 0 13.1225 6.898 8.373 8.373 0 0 0-1.7668-14.7194c-.6062-.2339-1.9234-.6481-2.9753-.559-1.5007.9544-3.3308 2.9155-4.1949 4.8693 2.5894-3.082 7.5046-2.425 9.1937 1.2287 1.6892 3.6538-.9944 7.8237-5.0198 7.7998a5.4995 5.4995 0 0 1-4.1949-1.9328c-1.485-1.7483-1.8678-3.6444-1.5615-5.4975 1.057-6.4947 8.759-10.1894 14.486-11.6094-1.8677.989-5.2373 2.6134-7.5948 4.3837C18.015 9.1382 19.1308 3.345 22.3515.7484z"/>
      </g>
    </svg>
  );
}

function VSCodeIcon() {
  return (
    <svg viewBox="0 0 56 56" width="44" height="44" xmlns="http://www.w3.org/2000/svg">
      <rect width="56" height="56" rx="10" fill="#007ACC"/>
      <g transform="translate(6,6) scale(1.833)">
        <path fill="white" d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 19.986V4.014a1.5 1.5 0 0 0-.85-1.427zm-5.146 14.861L10.826 12l7.178-5.448v10.896z"/>
      </g>
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 98 96" width="42" height="42" xmlns="http://www.w3.org/2000/svg">
      <circle cx="49" cy="48" r="50" fill="#1b1f23"/>
      <path fill="white" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"/>
    </svg>
  );
}

function CanvaIcon() {
  return (
    <svg viewBox="0 0 56 56" width="44" height="44" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cv-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#00C4CC"/>
          <stop offset="60%"  stopColor="#5364F5"/>
          <stop offset="100%" stopColor="#7D2AE7"/>
        </linearGradient>
      </defs>
      <circle cx="28" cy="28" r="28" fill="url(#cv-grad)"/>
      <text x="28" y="33" textAnchor="middle" fill="white"
        fontFamily="'Trebuchet MS','Gill Sans',sans-serif"
        fontWeight="700" fontSize="15" letterSpacing="0.5">Canva</text>
    </svg>
  );
}

function WordIcon() {
  return (
    <svg viewBox="0 0 48 48" width="44" height="44" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="wd-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#2B7CD3"/>
          <stop offset="100%" stopColor="#185ABD"/>
        </linearGradient>
      </defs>
      <rect x="20" y="5" width="24" height="37" rx="2" fill="#185ABD"/>
      <rect x="4"  y="9" width="27" height="34" rx="3" fill="url(#wd-grad)"/>
      <path fill="white" d="M9 16 L12 30 L16 20.5 L20 30 L23 16 L20.5 16 L18.8 25 L16 18.5 L13.2 25 L11.5 16Z"/>
    </svg>
  );
}

function ExcelIcon() {
  return (
    <svg viewBox="0 0 48 48" width="44" height="44" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="xl-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#33C481"/>
          <stop offset="100%" stopColor="#107C41"/>
        </linearGradient>
      </defs>
      <rect x="20" y="5" width="24" height="37" rx="2" fill="#107C41"/>
      <rect x="4"  y="9" width="27" height="34" rx="3" fill="url(#xl-grad)"/>
      <path fill="white" d="M8 16 L13.5 25 L8 34 L11.5 34 L17 27 L22.5 34 L26 34 L20.5 25 L26 16 L22.5 16 L17 23 L11.5 16Z"/>
    </svg>
  );
}

function PPTIcon() {
  return (
    <svg viewBox="0 0 48 48" width="44" height="44" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="pp-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#ED6C47"/>
          <stop offset="100%" stopColor="#C43E1C"/>
        </linearGradient>
      </defs>
      <rect x="20" y="5" width="24" height="37" rx="2" fill="#C43E1C"/>
      <rect x="4"  y="9" width="27" height="34" rx="3" fill="url(#pp-grad)"/>
      <path fill="white" d="M9 16 L9 36 L12.5 36 L12.5 28.5 L18 28.5 C21.9 28.5 25 26 25 22.5 C25 19 21.9 16.5 18 16.5 L9 16.5Z M12.5 20 L18 20 C20 20 21.5 21.1 21.5 22.5 C21.5 23.9 20 25 18 25 L12.5 25Z"/>
    </svg>
  );
}

function LaTeXIcon() {
  return (
    <svg viewBox="0 0 88 40" width="58" height="26" xmlns="http://www.w3.org/2000/svg">
      <text x="0"  y="34" fontSize="36" fill="white" fontFamily="Georgia,serif" fontStyle="italic">L</text>
      <text x="22" y="18" fontSize="17" fill="white" fontFamily="Georgia,serif">A</text>
      <text x="34" y="34" fontSize="36" fill="white" fontFamily="Georgia,serif">T</text>
      <text x="53" y="40" fontSize="19" fill="white" fontFamily="Georgia,serif">E</text>
      <text x="65" y="34" fontSize="36" fill="white" fontFamily="Georgia,serif" fontStyle="italic">X</text>
    </svg>
  );
}

function ClaudeIcon() {
  return (
    <svg viewBox="0 0 56 56" width="46" height="46" xmlns="http://www.w3.org/2000/svg">
      <rect width="56" height="56" rx="14" fill="#1a1008"/>
      <g transform="translate(4,4) scale(2.0)">
        <path fill="#D97757" d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z"/>
      </g>
    </svg>
  );
}

function ToolCell({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="tm-cell" title={title}>{children}</div>;
}

const TM_STYLES = `
  @keyframes tm-go-left  { from{transform:translateX(0)} to{transform:translateX(-25%)} }
  @keyframes tm-go-right { from{transform:translateX(-25%)} to{transform:translateX(0)} }
  .tm-lane { position:relative; overflow:hidden; }
  .tm-lane::before,.tm-lane::after {
    content:''; position:absolute; top:0; bottom:0; width:100px; z-index:3; pointer-events:none;
  }
  .tm-lane::before { left:0;  background:linear-gradient(to right,#080f0a 10%,transparent); }
  .tm-lane::after  { right:0; background:linear-gradient(to left, #080f0a 10%,transparent); }
  .tm-track { display:flex; width:max-content; padding:8px 0; will-change:transform; }
  .tm-track-left  { animation:tm-go-left  22s linear infinite; }
  .tm-track-right { animation:tm-go-right 22s linear infinite; }
  .tm-track-left:hover,.tm-track-right:hover { animation-play-state:paused; }
  .tm-cell {
    width:78px; height:78px; margin:0 9px; border-radius:18px;
    border:0.5px solid rgba(255,255,255,0.07);
    background:rgba(255,255,255,0.03);
    display:flex; align-items:center; justify-content:center;
    flex-shrink:0; transition:border-color 0.3s,background 0.3s; cursor:default;
  }
  .tm-cell:hover { border-color:rgba(46,194,122,0.3); background:rgba(46,194,122,0.05); }
`;

const ROW1 = [
  { title: "Overleaf",   icon: <OverleafIcon /> },
  { title: "VS Code",    icon: <VSCodeIcon />   },
  { title: "GitHub",     icon: <GitHubIcon />   },
  { title: "Canva",      icon: <CanvaIcon />    },
];

const ROW2 = [
  { title: "Microsoft Word",    icon: <WordIcon />   },
  { title: "Microsoft Excel",   icon: <ExcelIcon />  },
  { title: "PowerPoint",        icon: <PPTIcon />    },
  { title: "LaTeX",             icon: <LaTeXIcon />  },
  { title: "Claude",            icon: <ClaudeIcon /> },
];

function ToolsMarquee() {
  const row1Reps = Array.from({ length: 4 }).flatMap((_, r) =>
    ROW1.map((t, i) => <ToolCell key={`l-${r}-${i}`} title={t.title}>{t.icon}</ToolCell>)
  );
  const row2Reps = Array.from({ length: 4 }).flatMap((_, r) =>
    ROW2.map((t, i) => <ToolCell key={`r-${r}-${i}`} title={t.title}>{t.icon}</ToolCell>)
  );

  return (
    <section className="section reveal" id="awards">
      <style>{TM_STYLES}</style>
      <div className="sec-head">
        <span className="sec-label">Tools &amp; Technologies</span>
        <div className="sec-line" />
        <span style={{ fontFamily: "Georgia,serif", fontStyle: "italic", fontSize: 12, color: "rgba(255,255,255,0.22)", whiteSpace: "nowrap" }}>
          9 tools
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 8 }}>
        <div className="tm-lane">
          <div className="tm-track tm-track-left">{row1Reps}</div>
        </div>
        <div className="tm-lane">
          <div className="tm-track tm-track-right">{row2Reps}</div>
        </div>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   RESEARCH / LAB / PROJECT ICONS
────────────────────────────────────────────── */

function IconDNA() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 15c6.667-6 13.333 0 20-6" />
      <path d="M2 9c6.667 6 13.333 0 20 6" />
      <line x1="7" y1="10.5" x2="7" y2="13.5" />
      <line x1="12" y1="9" x2="12" y2="15" />
      <line x1="17" y1="10.5" x2="17" y2="13.5" />
    </svg>
  );
}
function IconMicroscope() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 18h8" />
      <path d="M3 22h18" />
      <path d="M14 22a7 7 0 1 0 0-14h-1" />
      <path d="M9 14h2" />
      <path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z" />
      <path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" />
    </svg>
  );
}
function IconLeaf() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  );
}
function IconBeaker() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 3h15" />
      <path d="M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3" />
      <path d="M6 14h12" />
    </svg>
  );
}
function IconDroplets() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z" />
      <path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97" />
    </svg>
  );
}
function IconLayers() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
      <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
      <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
    </svg>
  );
}

/* ──────────────────────────────────────────────
   SKILLS FILTER
────────────────────────────────────────────── */

const SKILL_CATEGORIES = [
  { key: "all",     label: "All" },
  { key: "mol",     label: "Molecular" },
  { key: "micro",   label: "Microbiology" },
  { key: "field",   label: "Field Biology" },
  { key: "general", label: "General Lab" },
  { key: "soft",    label: "Soft Skills" },
];

const SKILL_PILLS = [
  { label: "DNA Extraction",              cat: "mol" },
  { label: "Gel Electrophoresis",         cat: "mol" },
  { label: "Band Analysis",               cat: "mol" },
  { label: "Gel Imaging",                 cat: "mol" },
  { label: "Aseptic Technique",           cat: "micro" },
  { label: "Culture Media Prep",          cat: "micro" },
  { label: "Microbial Isolation",         cat: "micro" },
  { label: "Gram Staining",               cat: "micro" },
  { label: "Serial Dilution",             cat: "micro" },
  { label: "Colony Counting",             cat: "micro" },
  { label: "Ecosystem Assessment",        cat: "field" },
  { label: "Litter Trap Deployment",      cat: "field" },
  { label: "Species Inventory",           cat: "field" },
  { label: "Shannon-Wiener Index",        cat: "field" },
  { label: "Simpson's Index",             cat: "field" },
  { label: "Micropipetting",              cat: "general" },
  { label: "Solution Preparation",        cat: "general" },
  { label: "Lab Safety & Waste Disposal", cat: "general" },
  { label: "Scientific Report Writing",   cat: "general" },
  { label: "Research Leadership",         cat: "soft" },
  { label: "Data Interpretation",         cat: "soft" },
  { label: "Science Communication",       cat: "soft" },
  { label: "Team Coordination",           cat: "soft" },
];

const FORMSPREE_URL = "https://formspree.io/f/mnjwvwry";

function SkillsFilter() {
  const [active, setActive] = useState("all");
  return (
    <>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        {SKILL_CATEGORIES.map(({ key, label }) => (
          <button key={key} className={`skill-filter-btn${active === key ? " active" : ""}`} onClick={() => setActive(key)}>
            {label}
          </button>
        ))}
      </div>
      <div className="skill-pills-wrap">
        {SKILL_PILLS.filter(p => active === "all" || p.cat === active).map(p => (
          <span key={p.label} className="skill-pill">{p.label}</span>
        ))}
      </div>
    </>
  );
}

/* ──────────────────────────────────────────────
   CONTACT
────────────────────────────────────────────── */

function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [copied, setCopied] = useState(false);
  const EMAIL = "jeffersonperolino04@gmail.com";

  const handleCopy = () => {
    navigator.clipboard.writeText(EMAIL).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) { setStatus("sent"); setForm({ name: "", email: "", subject: "", message: "" }); }
      else setStatus("error");
    } catch { setStatus("error"); }
  };

  return (
    <section className="section reveal" id="contact">
      <div className="sec-head">
        <span className="sec-label">Contact</span>
        <div className="sec-line" />
      </div>
      <div className="contact-wrap">
        <div className="contact-info">
          <p className="contact-info-head">Have a project in mind? Let's talk. I respond to all messages within 24 hours.</p>
          <div className="contact-detail">
            <div className="contact-lbl">Email</div>
            <div className="contact-email-row">
              <span className="contact-val">{EMAIL}</span>
              <button className="copy-btn" onClick={handleCopy} title="Copy email">
                {copied ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div className="contact-detail">
            <div className="contact-lbl">Social</div>
            <div className="contact-social-row">
              <a className="contact-social-btn" href="https://linkedin.com/in/jeffersonperolino" target="_blank" rel="noreferrer" title="LinkedIn">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a className="contact-social-btn" href={`mailto:${EMAIL}`} title="Gmail">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-10 7L2 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-grp">
              <label className="form-lbl">Name</label>
              <input className="form-input" type="text" name="name" placeholder="John Doe" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-grp">
              <label className="form-lbl">Email</label>
              <input className="form-input" type="email" name="email" placeholder="john@example.com" value={form.email} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-grp" style={{ flex: 1 }}>
              <label className="form-lbl">Subject</label>
              <input className="form-input" type="text" name="subject" placeholder="Project inquiry" value={form.subject} onChange={handleChange} required />
            </div>
          </div>
          <div className="form-row">
            <div className="form-grp" style={{ flex: 1 }}>
              <label className="form-lbl">Message</label>
              <textarea className="form-ta" name="message" placeholder="Tell me about your project…" value={form.message} onChange={handleChange} required />
            </div>
          </div>
          {status === "sent"  && <p className="form-success">Message sent! I'll get back to you soon.</p>}
          {status === "error" && <p className="form-error">Something went wrong. Please try again.</p>}
          <button className="btn-primary" type="submit" disabled={status === "sending"}>
            {status === "sending" ? "Sending…" : "Send Message"}
          </button>
        </form>
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   MAIN CONTENT
────────────────────────────────────────────── */

function MainContent({
  activeSection, typewriterText, onNavClick,
}: {
  activeSection: string; typewriterText: string; onNavClick: (id: string) => void;
}) {
  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-headline">
          <span>{typewriterText}</span>
          <span className="tw-cursor" />
        </div>
        <p className="hero-sub">
          A DOST-SEI Scholar and BS Biology student majoring in Biotechnology at West Visayas State University — grounded in molecular techniques, driven by sustainable science, and committed to research that matters to Filipino communities.
        </p>
        <div className="hero-ctas">
          <button className="btn-primary" onClick={() => onNavClick("contact")}>Get in touch</button>
          <button className="btn-secondary" onClick={() => onNavClick("projects")}>View research</button>
        </div>
      </section>

      {/* ABOUT */}
      <section className="section reveal" id="about">
        <div className="sec-head">
          <span className="sec-label">About</span>
          <div className="sec-line" />
        </div>
        <div className="about-body">
          <p>
            I'm Jefferson T. Perolino, a third-year BS Biology student majoring in Biotechnology at West Visayas State University, Iloilo City. A DOST-SEI Scholar under RA 7687, I carry this recognition not as a credential alone but as a daily reminder that scientific work here has people counting on it.
          </p>
          <p>
            My laboratory practice spans molecular biology, microbiology, and field ecology — with a growing focus on biosorption and the use of agricultural waste as functional materials. I believe reproducible, careful science is the foundation of everything meaningful; that methodical work in a modest university lab can still speak to a bigger world.
          </p>
        </div>
        <div className="stats-strip">
          {[
            { target: 3, label: "Years at WVSU" },
            { target: 2, label: "Research Projects" },
            { target: 2, label: "Silver Awards" },
            { target: 6, label: "Trainings & Seminars" },
          ].map(({ target, label }) => (
            <div key={label} className="stat">
              <span className="stat-num" data-target={target}>0</span>
              <div className="stat-lbl">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* RESEARCH AREAS */}
      <section className="section reveal" id="research">
        <div className="sec-head">
          <span className="sec-label">Research Areas</span>
          <div className="sec-line" />
        </div>
        <div className="research-grid stagger">
          {[
            { icon: <IconDNA />,        title: "Molecular Biology",             desc: "DNA extraction using commercial kit-based protocols, agarose gel electrophoresis — gel preparation, loading, band imaging, and interpretation." },
            { icon: <IconMicroscope />, title: "Microbiology & Culture",         desc: "Aseptic technique, preparation of nutrient agar and LB broth, microbial isolation and streaking, Gram staining, and colony counting (pour and spread plate methods)." },
            { icon: <IconLeaf />,       title: "Field & Environmental Biology", desc: "Mangrove ecosystem assessment, litter trap deployment, species inventory, soil property analysis, and biodiversity indices — Shannon-Wiener and Simpson's." },
            { icon: <IconBeaker />,     title: "Biosorption & Materials Science", desc: "Investigating rice husk–alginate combinations as low-cost adsorptive agents for Congo Red dye removal — current undergraduate research under faculty supervision." },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="r-card">
              <div className="r-icon">{icon}</div>
              <div className="r-title">{title}</div>
              <div className="r-desc">{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* LAB SKILLS */}
      <section className="section reveal" id="skills">
        <div className="sec-head">
          <span className="sec-label">Laboratory Skills & Tools</span>
          <div className="sec-line" />
        </div>
        <SkillsFilter />
      </section>

      {/* PROJECTS */}
      <section className="section reveal" id="projects">
        <div className="sec-head">
          <span className="sec-label">Research Projects</span>
          <div className="sec-line" />
        </div>
        <div className="projects-grid stagger">
          <div className="proj-card">
            <div className="proj-top"><div className="proj-icon"><IconDroplets /></div></div>
            <div className="proj-body">
              <div className="proj-tag">Biotechnology · 2024–Present · Ongoing</div>
              <div className="proj-title">Rice Husk & Alginate Combination as Adsorptive Agents of Congo Red</div>
              <div className="proj-desc">Investigating biomass-based materials for synthetic dye removal from wastewater — contributing toward sustainable, cost-effective treatment solutions for the Philippines.</div>
              <span className="proj-link">View Details →</span>
            </div>
          </div>
          <div className="proj-card">
            <div className="proj-top"><div className="proj-icon"><IconLayers /></div></div>
            <div className="proj-body">
              <div className="proj-tag">Materials Science · 2023 · Capstone</div>
              <div className="proj-title">Coconut Husk & Mahogany Shell as Raw Materials for Fiberboard Production</div>
              <div className="proj-desc">Led a capstone study evaluating agricultural waste as viable raw materials for eco-friendly fiberboard — overseeing design, data collection, and manuscript preparation as group leader.</div>
              <span className="proj-link">View Details →</span>
            </div>
          </div>
        </div>
      </section>

      {/* TOOLS MARQUEE — replaces Awards/Scholarships */}
      <ToolsMarquee />

      {/* CONTACT */}
      <ContactSection />

      <div className="footer">
        <p>© 2026 Jefferson T. Perolino · All rights reserved.</p>
        <p>Biotechnology · Molecular Research · Environmental Science</p>
      </div>
    </>
  );
}

/* ──────────────────────────────────────────────
   ROOT PAGE
────────────────────────────────────────────── */

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("about");
  const [stickyVisible, setStickyVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 860);
  const typewriterText = useTypewriter();
  const { dark, toggle: toggleTheme } = useTheme();
  useScrollReveal();
  useCounterAnimation();

  const checkMobile = useCallback(() => { setIsMobile(window.innerWidth <= 860); }, []);

  useEffect(() => {
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [checkMobile]);

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (isMobile) {
      const offset = 64;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    } else {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [isMobile]);

  useEffect(() => {
    const handleScroll = () => {
      if (!isMobile) {
        const sectionIds = ["about","research","skills","projects","awards","contact"];
        let active = "about";
        sectionIds.forEach((id) => { const s = document.getElementById(id); if (s && s.getBoundingClientRect().top - 130 <= 0) active = id; });
        setActiveSection(active);
        return;
      }
      const hero = document.getElementById("mobile-hero");
      if (hero) { const heroBottom = hero.getBoundingClientRect().bottom; setStickyVisible(heroBottom <= window.innerHeight * 0.5); }
      const sectionIds = ["about","research","skills","projects","awards","contact"];
      let active = "about";
      sectionIds.forEach((id) => { const s = document.getElementById(id); if (s && s.getBoundingClientRect().top - 130 <= 0) active = id; });
      setActiveSection(active);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

  return (
    <>
      <ParticleCanvas />
      {isMobile && (
        <MobileStickyHeader visible={stickyVisible} activeSection={activeSection} onNavClick={scrollToSection} dark={dark} onToggleTheme={toggleTheme} />
      )}
      <div className="layout">
        {!isMobile && (
          <Sidebar activeSection={activeSection} onNavClick={scrollToSection} dark={dark} onToggleTheme={toggleTheme} />
        )}
        <main className="main">
          {isMobile && <MobileHero onNavClick={scrollToSection} typewriterText={typewriterText} />}
          <div className={isMobile ? "mobile-main-content" : ""}>
            <MainContent activeSection={activeSection} typewriterText={typewriterText} onNavClick={scrollToSection} />
          </div>
        </main>
      </div>
    </>
  );
}