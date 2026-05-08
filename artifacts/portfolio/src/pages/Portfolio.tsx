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
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
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
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

const NAV_ITEMS = [
  { id: "about", label: "About" },
  { id: "research", label: "Research Areas" },
  { id: "skills", label: "Lab Skills" },
  { id: "projects", label: "Projects" },
  { id: "awards", label: "Awards" },
  { id: "contact", label: "Contact" },
];

const PHRASES = [
  "Biotechnologist/",
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
      if (del) {
        state.current.ci = ci - 1;
      } else {
        state.current.ci = ci + 1;
      }
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
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.08 },
    );
    document
      .querySelectorAll(".reveal, .stagger")
      .forEach((el) => obs.observe(el));
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

    const resize = () => {
      cvs.width = window.innerWidth;
      cvs.height = window.innerHeight;
    };
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
        p.x += p.vx;
        p.y += p.vy;
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
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return <canvas ref={canvasRef} id="particle-canvas" />;
}

function ProfilePhoto({ size = 92 }: { size?: number }) {
  return (
    <div className="profile-wrap" style={{ width: size, height: size }}>
      <div
        className="profile-photo"
        style={{ width: size, height: size, fontSize: size * 0.3 }}
      >
        <img
          src="/profile.jpg"
          alt="Jefferson T. Perolino"
          className="profile-photo-img"
        />
      </div>
      <div className="profile-ring" />
      <div className="profile-ring-2" />
    </div>
  );
}

function Sidebar({
  activeSection,
  onNavClick,
  dark,
  onToggleTheme,
}: {
  activeSection: string;
  onNavClick: (id: string) => void;
  dark: boolean;
  onToggleTheme: () => void;
}) {
  return (
    <aside className="sidebar">
      <ProfilePhoto size={92} />
      <div className="profile-name">
        Jefferson
        <br />
        T. Perolino
      </div>
      <div className="profile-role">Biotechnologist · Researcher</div>
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
          <button
            key={item.id}
            className={`nav-item${activeSection === item.id ? " active" : ""}`}
            onClick={() => onNavClick(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <div className="sidebar-spacer" />
      <div className="social-row">
        <a
          className="social-btn"
          href="https://linkedin.com/in/jeffersonperolino"
          title="LinkedIn"
          target="_blank"
          rel="noreferrer"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
            <circle cx="4" cy="4" r="2" />
          </svg>
        </a>
        <a
          className="social-btn"
          href="mailto:jefferson.perolino@wvsu.edu.ph"
          title="Email"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-10 7L2 7" />
          </svg>
        </a>
        <a className="social-btn" href="tel:+639816145783" title="Phone">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.07 11.9 19.79 19.79 0 0 1 1 3.22 2 2 0 0 1 2.98 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
        </a>
        <button
          className="theme-toggle"
          onClick={onToggleTheme}
          title={dark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {dark ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>
    </aside>
  );
}

function MobileHero({
  onNavClick,
  typewriterText,
}: {
  onNavClick: (id: string) => void;
  typewriterText: string;
}) {
  return (
    <div className="mobile-hero" id="mobile-hero">
      <div className="mobile-hero-profile-wrap">
        <div className="mobile-hero-photo">
          <img
            src="/profile.jpg"
            alt="Jefferson T. Perolino"
            className="profile-photo-img"
          />
        </div>
      </div>

      <div className="mobile-hero-name">
        Jefferson
        <br />
        T. Perolino
      </div>
      <div className="mobile-hero-role">Biotechnologist · Researcher</div>

      <div className="mobile-hero-avail">
        <span className="avail-dot" />
        Open to Research Opportunities
      </div>

      {typewriterText && (
        <div className="mobile-hero-typewriter">
          {typewriterText}
          <span className="tw-cursor">|</span>
        </div>
      )}

      <p className="mobile-hero-desc">
        A DOST-SEI Scholar and BS Biology student majoring in Biotechnology at
        West Visayas State University — grounded in molecular techniques, driven
        by sustainable science.
      </p>

      <div className="mobile-hero-cta">
        <button
          className="mh-btn-primary"
          onClick={() => onNavClick("contact")}
        >
          Get in touch
        </button>
        <button
          className="mh-btn-secondary"
          onClick={() => onNavClick("projects")}
        >
          View research
        </button>
      </div>
    </div>
  );
}

function MobileStickyHeader({
  visible,
  activeSection,
  onNavClick,
  dark,
  onToggleTheme,
}: {
  visible: boolean;
  activeSection: string;
  onNavClick: (id: string) => void;
  dark: boolean;
  onToggleTheme: () => void;
}) {
  return (
    <div className={`mobile-sticky-header${visible ? " visible" : ""}`}>
      <div className="mobile-sticky-inner">
        <div className="mobile-sticky-left">
          <div className="mobile-sticky-photo">
            <img
              src="/profile.jpg"
              alt="Jefferson T. Perolino"
              className="profile-photo-img"
            />
          </div>
          <div className="mobile-sticky-name">Jefferson T. Perolino</div>
        </div>
        <nav className="mobile-sticky-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`mobile-sticky-nav-item${activeSection === item.id ? " active" : ""}`}
              onClick={() => onNavClick(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <button
          className="mobile-theme-toggle"
          onClick={onToggleTheme}
          title={dark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {dark ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>
    </div>
  );
}

function IconLandmark() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="3" y1="22" x2="21" y2="22" />
      <line x1="6" y1="18" x2="6" y2="11" />
      <line x1="10" y1="18" x2="10" y2="11" />
      <line x1="14" y1="18" x2="14" y2="11" />
      <line x1="18" y1="18" x2="18" y2="11" />
      <polygon points="12 2 20 7 4 7" />
    </svg>
  );
}
function IconMic() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="2" width="6" height="11" rx="3" />
      <path d="M19 10a7 7 0 0 1-14 0" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="8" y1="22" x2="16" y2="22" />
    </svg>
  );
}
function IconTent() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3.5 21 12 3l8.5 18" />
      <path d="M12 3 7 14h10L12 3z" />
      <line x1="3.5" y1="21" x2="20.5" y2="21" />
    </svg>
  );
}
function IconAward() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="8" r="6" />
      <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
    </svg>
  );
}
function IconStar() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
function IconGradCap() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
    </svg>
  );
}

type AwardItem = {
  year: string;
  title: string;
  org: string;
  icon: React.ReactNode;
};

const ROW1_AWARDS: AwardItem[] = [
  {
    year: "2023 – Present",
    title: "DOST-SEI Undergraduate Scholarship (RA 7687)",
    org: "Dept. of Science and Technology, Philippines",
    icon: <IconLandmark />,
  },
  {
    year: "2025",
    title: "Resource Speaker — DOST-SEI Scholarship Orientation & Review",
    org: "Guimaras State University, Mosqueda Conference Hall",
    icon: <IconMic />,
  },
  {
    year: "2025",
    title: "Science Leadership Camp Delegate",
    org: "DOST-SEI Filipino Patriot Scholars Program",
    icon: <IconTent />,
  },
  {
    year: "AY 2024–2025",
    title: "Parangal Silver Award — 2nd Year",
    org: "West Visayas State University",
    icon: <IconAward />,
  },
  {
    year: "AY 2023–2024",
    title: "Parangal Silver Award — 1st Year",
    org: "West Visayas State University",
    icon: <IconAward />,
  },
  {
    year: "AY 2022–2023",
    title: "With Highest Honors — 2nd Quarter",
    org: "Hinigaran National High School",
    icon: <IconStar />,
  },
  {
    year: "AY 2020–2021",
    title: "With Highest Honors — Batch Salutatorian",
    org: "NONASHII, Hinigaran, Negros Occidental",
    icon: <IconGradCap />,
  },
];

const ROW2_AWARDS: AwardItem[] = [
  {
    year: "AY 2020–2021",
    title: "With Highest Honors — Batch Salutatorian",
    org: "NONASHII, Hinigaran, Negros Occidental",
    icon: <IconGradCap />,
  },
  {
    year: "AY 2023–2024",
    title: "Parangal Silver Award — 1st Year",
    org: "West Visayas State University",
    icon: <IconAward />,
  },
  {
    year: "2023 – Present",
    title: "DOST-SEI Undergraduate Scholarship (RA 7687)",
    org: "Dept. of Science and Technology, Philippines",
    icon: <IconLandmark />,
  },
  {
    year: "AY 2022–2023",
    title: "With Highest Honors — 2nd Quarter",
    org: "Hinigaran National High School",
    icon: <IconStar />,
  },
  {
    year: "2025",
    title: "Science Leadership Camp Delegate",
    org: "DOST-SEI Filipino Patriot Scholars Program",
    icon: <IconTent />,
  },
  {
    year: "AY 2024–2025",
    title: "Parangal Silver Award — 2nd Year",
    org: "West Visayas State University",
    icon: <IconAward />,
  },
  {
    year: "2025",
    title: "Resource Speaker — DOST-SEI Scholarship Orientation & Review",
    org: "Guimaras State University, Mosqueda Conference Hall",
    icon: <IconMic />,
  },
];

function AwardCard({ item }: { item: AwardItem }) {
  return (
    <div className="award-card">
      <div className="award-card-icon">{item.icon}</div>
      <div className="award-card-text">
        <div className="award-card-year">{item.year}</div>
        <div className="award-card-title">{item.title}</div>
        <div className="award-card-org">{item.org}</div>
      </div>
    </div>
  );
}

function AwardsMarquee() {
  return (
    <section className="section reveal" id="awards">
      <div className="sec-head">
        <span className="sec-label">Scholarships & Recognition</span>
        <div className="sec-line" />
      </div>
      <div className="marquee-outer">
        <div className="marquee-track">
          {[...ROW1_AWARDS, ...ROW1_AWARDS].map((item, i) => (
            <AwardCard key={i} item={item} />
          ))}
        </div>
      </div>
      <div className="marquee-outer" style={{ marginTop: 14 }}>
        <div className="marquee-track reverse">
          {[...ROW2_AWARDS, ...ROW2_AWARDS].map((item, i) => (
            <AwardCard key={i} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

const FORMSPREE_URL = "https://formspree.io/f/mnjwvwry";

function ContactSection() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [copied, setCopied] = useState(false);

  const EMAIL = "jeffersonperolino04@gmail.com";

  const handleCopy = () => {
    navigator.clipboard.writeText(EMAIL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("sent");
        setForm({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="section reveal" id="contact">
      <div className="sec-head">
        <span className="sec-label">Contact</span>
        <div className="sec-line" />
      </div>
      <div className="contact-wrap">
        {/* LEFT */}
        <div className="contact-info">
          <p className="contact-info-head">
            Have a project in mind? Let's talk. I respond to all messages within
            24 hours.
          </p>

          <div className="contact-detail">
            <div className="contact-lbl">Email</div>
            <div className="contact-email-row">
              <span className="contact-val">{EMAIL}</span>
              <button
                className="copy-btn"
                onClick={handleCopy}
                title="Copy email"
              >
                {copied ? (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
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
              <a
                className="contact-social-btn"
                href="https://linkedin.com/in/jeffersonperolino"
                target="_blank"
                rel="noreferrer"
                title="LinkedIn"
              >
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a
                className="contact-social-btn"
                href={`mailto:${EMAIL}`}
                title="Gmail"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2" />
                  <path d="m22 7-10 7L2 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* RIGHT — FORM */}
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-grp">
              <label className="form-lbl">Name</label>
              <input
                className="form-input"
                type="text"
                name="name"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-grp">
              <label className="form-lbl">Email</label>
              <input
                className="form-input"
                type="email"
                name="email"
                placeholder="john@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-grp" style={{ flex: 1 }}>
              <label className="form-lbl">Subject</label>
              <input
                className="form-input"
                type="text"
                name="subject"
                placeholder="Project inquiry"
                value={form.subject}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-grp" style={{ flex: 1 }}>
              <label className="form-lbl">Message</label>
              <textarea
                className="form-ta"
                name="message"
                placeholder="Tell me about your project…"
                value={form.message}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {status === "sent" && (
            <p className="form-success">
              Message sent! I'll get back to you soon.
            </p>
          )}
          {status === "error" && (
            <p className="form-error">
              Something went wrong. Please try again.
            </p>
          )}

          <button
            className="btn-primary"
            type="submit"
            disabled={status === "sending"}
          >
            {status === "sending" ? "Sending…" : "Send Message"}
          </button>
        </form>
      </div>
    </section>
  );
}

function MainContent({
  activeSection,
  typewriterText,
  onNavClick,
}: {
  activeSection: string;
  typewriterText: string;
  onNavClick: (id: string) => void;
}) {
  return (
    <>
      {/* HERO */}
      <section className="hero">
        <svg
          className="hero-deco"
          viewBox="0 0 240 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="120" cy="100" r="70" stroke="#2e8060" strokeWidth="1.5" />
          <circle cx="120" cy="100" r="50" stroke="#2e8060" strokeWidth="1" />
          <circle cx="120" cy="100" r="30" stroke="#2e8060" strokeWidth="0.7" />
          <circle cx="120" cy="30" r="6" fill="#2e8060" />
          <circle cx="185" cy="65" r="4" fill="#2e8060" />
          <circle cx="185" cy="135" r="4" fill="#2e8060" />
          <circle cx="120" cy="170" r="6" fill="#2e8060" />
          <circle cx="55" cy="135" r="4" fill="#2e8060" />
          <circle cx="55" cy="65" r="4" fill="#2e8060" />
          <line
            x1="120"
            y1="30"
            x2="185"
            y2="65"
            stroke="#2e8060"
            strokeWidth="0.8"
          />
          <line
            x1="185"
            y1="65"
            x2="185"
            y2="135"
            stroke="#2e8060"
            strokeWidth="0.8"
          />
          <line
            x1="185"
            y1="135"
            x2="120"
            y2="170"
            stroke="#2e8060"
            strokeWidth="0.8"
          />
          <line
            x1="120"
            y1="170"
            x2="55"
            y2="135"
            stroke="#2e8060"
            strokeWidth="0.8"
          />
          <line
            x1="55"
            y1="135"
            x2="55"
            y2="65"
            stroke="#2e8060"
            strokeWidth="0.8"
          />
          <line
            x1="55"
            y1="65"
            x2="120"
            y2="30"
            stroke="#2e8060"
            strokeWidth="0.8"
          />
        </svg>
        <div className="hero-headline">
          <span>{typewriterText}</span>
          <span className="tw-cursor" />
        </div>
        <p className="hero-sub">
          A DOST-SEI Scholar and BS Biology student majoring in Biotechnology at
          West Visayas State University — grounded in molecular techniques,
          driven by sustainable science, and committed to research that matters
          to Filipino communities.
        </p>
        <div className="hero-ctas">
          <button className="btn-primary" onClick={() => onNavClick("contact")}>
            Get in touch
          </button>
          <button
            className="btn-secondary"
            onClick={() => onNavClick("projects")}
          >
            View research
          </button>
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
            I'm Jefferson T. Perolino, a third-year BS Biology student majoring
            in Biotechnology at West Visayas State University, Iloilo City. A
            DOST-SEI Scholar under RA 7687, I carry this recognition not as a
            credential alone but as a daily reminder that scientific work here
            has people counting on it.
          </p>
          <p>
            My laboratory practice spans molecular biology, microbiology, and
            field ecology — with a growing focus on biosorption and the use of
            agricultural waste as functional materials. I believe reproducible,
            careful science is the foundation of everything meaningful; that
            methodical work in a modest university lab can still speak to a
            bigger world.
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
              <span className="stat-num" data-target={target}>
                0
              </span>
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
            {
              icon: "🧬",
              title: "Molecular Biology",
              desc: "DNA extraction using commercial kit-based protocols, agarose gel electrophoresis — gel preparation, loading, band imaging, and interpretation.",
            },
            {
              icon: "🔬",
              title: "Microbiology & Culture",
              desc: "Aseptic technique, preparation of nutrient agar and LB broth, microbial isolation and streaking, Gram staining, and colony counting (pour and spread plate methods).",
            },
            {
              icon: "🌿",
              title: "Field & Environmental Biology",
              desc: "Mangrove ecosystem assessment, litter trap deployment, species inventory, soil property analysis, and biodiversity indices — Shannon-Wiener and Simpson's.",
            },
            {
              icon: "⚗️",
              title: "Biosorption & Materials Science",
              desc: "Investigating rice husk–alginate combinations as low-cost adsorptive agents for Congo Red dye removal — current undergraduate research under faculty supervision.",
            },
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
        <div className="skills-wrap">
          {[
            {
              cat: "Molecular",
              pills: [
                "DNA Extraction",
                "Gel Electrophoresis",
                "Band Analysis",
                "Gel Imaging",
              ],
            },
            {
              cat: "Microbiology",
              pills: [
                "Aseptic Technique",
                "Culture Media Prep",
                "Microbial Isolation",
                "Gram Staining",
                "Serial Dilution",
                "Colony Counting",
              ],
            },
            {
              cat: "Field Biology",
              pills: [
                "Ecosystem Assessment",
                "Litter Trap Deployment",
                "Species Inventory",
                "Shannon-Wiener Index",
                "Simpson's Index",
              ],
            },
            {
              cat: "General Lab",
              pills: [
                "Micropipetting",
                "Solution Preparation",
                "Lab Safety & Waste Disposal",
                "Scientific Report Writing",
              ],
            },
            {
              cat: "Soft Skills",
              pills: [
                "Research Leadership",
                "Data Interpretation",
                "Science Communication",
                "Team Coordination",
              ],
            },
          ].map(({ cat, pills }) => (
            <div key={cat} className="skill-row">
              <div className="skill-cat">{cat}</div>
              <div className="pills">
                {pills.map((p) => (
                  <span key={p} className="pill">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PROJECTS */}
      <section className="section reveal" id="projects">
        <div className="sec-head">
          <span className="sec-label">Research Projects</span>
          <div className="sec-line" />
        </div>
        <div className="projects-grid stagger">
          <div className="proj-card">
            <div className="proj-top">
              <span>🧪</span>
            </div>
            <div className="proj-body">
              <div className="proj-tag">
                Biotechnology · 2024–Present · Ongoing
              </div>
              <div className="proj-title">
                Rice Husk & Alginate Combination as Adsorptive Agents of Congo
                Red
              </div>
              <div className="proj-desc">
                Investigating biomass-based materials for synthetic dye removal
                from wastewater — contributing toward sustainable,
                cost-effective treatment solutions for the Philippines.
              </div>
              <span className="proj-link">View Details →</span>
            </div>
          </div>
          <div className="proj-card">
            <div className="proj-top">
              <span>🌴</span>
            </div>
            <div className="proj-body">
              <div className="proj-tag">
                Materials Science · 2023 · Capstone
              </div>
              <div className="proj-title">
                Coconut Husk & Mahogany Shell as Raw Materials for Fiberboard
                Production
              </div>
              <div className="proj-desc">
                Led a capstone study evaluating agricultural waste as viable raw
                materials for eco-friendly fiberboard — overseeing design, data
                collection, and manuscript preparation as group leader.
              </div>
              <span className="proj-link">View Details →</span>
            </div>
          </div>
        </div>
      </section>

      {/* AWARDS */}
      <AwardsMarquee />

      {/* CONTACT */}
      <ContactSection />

      <div className="footer">
        <p>© 2026 Jefferson T. Perolino · All rights reserved.</p>
        <p>Biotechnology · Molecular Research · Environmental Science</p>
      </div>
    </>
  );
}

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("about");
  const [stickyVisible, setStickyVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 860);
  const typewriterText = useTypewriter();
  const { dark, toggle: toggleTheme } = useTheme();
  useScrollReveal();
  useCounterAnimation();

  const checkMobile = useCallback(() => {
    setIsMobile(window.innerWidth <= 860);
  }, []);

  useEffect(() => {
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [checkMobile]);

  const scrollToSection = useCallback(
    (id: string) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (isMobile) {
        const offset = 64;
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
      } else {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    [isMobile],
  );

  useEffect(() => {
    const handleScroll = () => {
      if (!isMobile) {
        const sectionIds = [
          "about",
          "research",
          "skills",
          "projects",
          "awards",
          "contact",
        ];
        let active = "about";
        sectionIds.forEach((id) => {
          const s = document.getElementById(id);
          if (s && s.getBoundingClientRect().top - 130 <= 0) active = id;
        });
        setActiveSection(active);
        return;
      }

      const hero = document.getElementById("mobile-hero");
      if (hero) {
        const heroBottom = hero.getBoundingClientRect().bottom;
        setStickyVisible(heroBottom <= 0);
      }

      const sectionIds = [
        "about",
        "research",
        "skills",
        "projects",
        "awards",
        "contact",
      ];
      let active = "about";
      sectionIds.forEach((id) => {
        const s = document.getElementById(id);
        if (s && s.getBoundingClientRect().top - 130 <= 0) active = id;
      });
      setActiveSection(active);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

  return (
    <>
      <ParticleCanvas />

      {isMobile && (
        <MobileStickyHeader
          visible={stickyVisible}
          activeSection={activeSection}
          onNavClick={scrollToSection}
          dark={dark}
          onToggleTheme={toggleTheme}
        />
      )}

      <div className="layout">
        {!isMobile && (
          <Sidebar
            activeSection={activeSection}
            onNavClick={scrollToSection}
            dark={dark}
            onToggleTheme={toggleTheme}
          />
        )}

        <main className="main">
          {isMobile && (
            <MobileHero
              onNavClick={scrollToSection}
              typewriterText={typewriterText}
            />
          )}
          <div className={isMobile ? "mobile-main-content" : ""}>
            <MainContent
              activeSection={activeSection}
              typewriterText={typewriterText}
              onNavClick={scrollToSection}
            />
          </div>
        </main>
      </div>
    </>
  );
}
