import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import {
  PERSPECTIVES,
  THINKING_DISCIPLINES,
  decodeSignalText,
  getDisciplineById,
  getPerspectiveById,
} from './data/portfolioData';
import {
  HeroPortraitScene,
  SignalExplorerCanvas,
  SignalPortrait,
} from './components/SignalPortrait';
import {
  ContentPage,
  SpeakingPage,
  WorkIndexPage,
} from './components/Subpages';
import { ContactModal } from './components/Modals';

const ABOUT_LENS_META: Record<
  'build' | 'teach' | 'connect',
  { shapeClass: string; centerLabel: string }
> = {
  build: { shapeClass: 'shape-structure', centerLabel: 'STRUCTURE' },
  teach: { shapeClass: 'shape-clarity', centerLabel: 'CLARITY' },
  connect: { shapeClass: 'shape-reach', centerLabel: 'REACH' },
};

// Helper to handle GitHub Pages subfolder (e.g., '/portfolio97') cleanly
const BASE_PATH = import.meta.env.BASE_URL.replace(/\/$/, '');

function getCleanRoute(pathname: string): string {
  const raw = pathname || '/';
  if (BASE_PATH && raw.startsWith(BASE_PATH)) {
    return raw.slice(BASE_PATH.length) || '/';
  }
  return raw;
}

function SignalTextSpan({ text }: { text: string }) {
  return (
    <span className="signal-text">
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="signal-text-size">
        {text}
      </span>
      <span aria-hidden="true" className="signal-text-live" data-hero-scramble={text}>
        {text}
      </span>
    </span>
  );
}

export default function App() {
  const [route, setRoute] = useState<string>(() => {
    const path = getCleanRoute(window.location.pathname);
    if (path === '/work' || path === '/content' || path === '/speaking') {
      return path;
    }
    if (path !== '/') {
      window.history.replaceState({}, '', `${BASE_PATH}/` + window.location.hash);
    }
    return '/';
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [motionOn, setMotionOn] = useState(true);
  const [sceneLive, setSceneLive] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const heroSectionRef = useRef<HTMLElement | null>(null);

  // Interactive states matching reference components
  const [aboutLens, setAboutLens] = useState<'build' | 'teach' | 'connect'>('build');
  const [activeDisciplineId, setActiveDisciplineId] = useState<string>('engineering');

  // Modals
  const [contactModalOpen, setContactModalOpen] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.removeItem('mithilesh_custom_portrait');
      window.localStorage.removeItem('mithilesh_custom_portrait_v1');
      window.localStorage.removeItem('customPortraitUrl');
    } catch {
      // Ignore storage access errors
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.motion = motionOn ? 'on' : 'off';
  }, [motionOn]);

  useEffect(() => {
    const heroEl = heroSectionRef.current;
    if (!heroEl || route !== '/') return;

    const scrambleNodes = Array.from(
      heroEl.querySelectorAll<HTMLElement>('[data-hero-scramble]')
    );

    if (!motionOn || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      scrambleNodes.forEach((node) => {
        const target = node.getAttribute('data-hero-scramble');
        if (target !== null) node.textContent = target;
      });
      return;
    }

    const cleanupListeners: Array<() => void> = [];
    const activeTweens = new WeakMap<HTMLElement, gsap.core.Tween>();

    const ctx = gsap.context(() => {
      scrambleNodes.forEach((node, idx) => {
        const target = node.getAttribute('data-hero-scramble') ?? node.textContent ?? '';
        const state = { progress: 0 };

        const tween = gsap.to(state, {
          progress: 1,
          duration: Math.min(1.35, 0.75 + target.length * 0.012),
          delay: 0.06 + idx * 0.05,
          ease: 'power2.out',
          onStart: () => {
            node.textContent = decodeSignalText(target, 0.04);
          },
          onUpdate: () => {
            node.textContent = decodeSignalText(target, state.progress);
          },
          onComplete: () => {
            node.textContent = target;
          },
        });
        activeTweens.set(node, tween);
      });

      const hoverTargets = Array.from(
        heroEl.querySelectorAll<HTMLElement>(
          '.hero-kicker, h1, .hero-description > p, .hero-actions a, .hero-topline > span, .hero-bottom > a'
        )
      );

      hoverTargets.forEach((triggerEl) => {
        const targets = triggerEl.hasAttribute('data-hero-scramble')
          ? [triggerEl]
          : Array.from(triggerEl.querySelectorAll<HTMLElement>('[data-hero-scramble]'));

        if (targets.length === 0) return;

        const onMouseEnter = () => {
          targets.forEach((node) => {
            const target = node.getAttribute('data-hero-scramble') ?? node.textContent ?? '';
            activeTweens.get(node)?.kill();
            const state = { progress: 0.15 };
            const tween = gsap.to(state, {
              progress: 1,
              duration: Math.min(0.75, 0.42 + target.length * 0.006),
              ease: 'power2.out',
              onUpdate: () => {
                node.textContent = decodeSignalText(target, state.progress);
              },
              onComplete: () => {
                node.textContent = target;
              },
            });
            activeTweens.set(node, tween);
          });
        };

        triggerEl.addEventListener('mouseenter', onMouseEnter);
        cleanupListeners.push(() => triggerEl.removeEventListener('mouseenter', onMouseEnter));
      });
    }, heroEl);

    return () => {
      cleanupListeners.forEach((fn) => fn());
      ctx.revert();
      scrambleNodes.forEach((node) => {
        const target = node.getAttribute('data-hero-scramble');
        if (target !== null) node.textContent = target;
      });
    };
  }, [route, motionOn]);

  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        setScrollProgress(Math.min(1, Math.max(0, window.scrollY / docHeight)));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const onPopState = () => {
      setRoute(getCleanRoute(window.location.pathname));
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.slice(1);
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: motionOn ? 'smooth' : 'auto' }), 60);
      }
    }
  }, [route, motionOn]);

  const navigate = (targetPath: string) => {
    setMobileMenuOpen(false);
    if (targetPath.startsWith('#')) {
      if (route !== '/') {
        window.history.pushState({}, '', `${BASE_PATH}/` + targetPath);
        setRoute('/');
        setTimeout(() => {
          const el = document.getElementById(targetPath.slice(1));
          el?.scrollIntoView({ behavior: motionOn ? 'smooth' : 'auto' });
        }, 50);
      } else {
        window.history.pushState({}, '', targetPath);
        const el = document.getElementById(targetPath.slice(1));
        el?.scrollIntoView({ behavior: motionOn ? 'smooth' : 'auto' });
      }
      return;
    }

    const [pathOnly, hashPart] = targetPath.split('#');
    const cleanTarget = targetPath === '/' ? `${BASE_PATH}/` : `${BASE_PATH}${targetPath}`;
    window.history.pushState({}, '', cleanTarget);
    setRoute(pathOnly || '/');
    if (hashPart) {
      setTimeout(() => {
        const el = document.getElementById(hashPart);
        el?.scrollIntoView({ behavior: motionOn ? 'smooth' : 'auto' });
      }, 60);
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  };

  const currentAboutPerspective = getPerspectiveById(aboutLens);
  const currentDiscipline = getDisciplineById(activeDisciplineId);

  const renderMainContent = () => {
    if (route === '/work') {
      return (
        <WorkIndexPage
          onNavigate={navigate}
          onOpenContact={() => setContactModalOpen(true)}
        />
      );
    }
    if (route === '/content') {
      return (
        <ContentPage
          onNavigate={navigate}
          onOpenContact={() => setContactModalOpen(true)}
        />
      );
    }
    if (route === '/speaking') {
      return (
        <SpeakingPage
          onNavigate={navigate}
          onOpenContact={() => setContactModalOpen(true)}
        />
      );
    }

    return (
      <main id="main">
        {/* HERO SECTION */}
        <section className="hero" id="top" ref={heroSectionRef}>
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-topline">
            <span>
              <i className="live-dot" />{' '}
              <span data-hero-scramble="ENGINEER. STUDENT. DEVOPS.">
                ENGINEER. STUDENT. DEVOPS.
              </span>
            </span>
            <span data-hero-scramble="BASED IN INDIA · THINKING BEYOND">
              BASED IN INDIA · THINKING BEYOND
            </span>
          </div>

          <div className="hero-content">
            <span className="hero-kicker">
              <SignalTextSpan text="A HUMAN PERSPECTIVE ON TECHNOLOGY" />
            </span>
            <h1>
              <span className="line-mask">
                <span className="reveal-line">
                  <span data-hero-scramble="Mithilesh">Mithilesh</span>{' '}
                  <em data-hero-scramble="Tayade">Tayade</em>
                </span>
              </span>
            </h1>
            <div className="hero-description">
              <p>
                <span data-hero-scramble="I build with code, explore cloud technologies,">
                  I build with code, explore cloud technologies,
                </span>
                <br className="desktop-break" />{' '}
                <span data-hero-scramble="and work towards becoming a Cloud DevOps Engineer">
                  and work towards becoming a Cloud DevOps Engineer
                </span>
              </p>
              <div className="hero-actions">
                <a
                  className="pill-link"
                  href="#work"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('#work');
                  }}
                >
                  <SignalTextSpan text="Explore my work" />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 5v14" />
                    <path d="m19 12-7 7-7-7" />
                  </svg>
                </a>
                <a
                  className="text-link"
                  href="#contact"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('#contact');
                  }}
                >
                  <SignalTextSpan text="Start a conversation" />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M7 7h10v10" />
                    <path d="M7 17 17 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="hero-side-note">
            <span data-hero-scramble="01 / PRESENCE">01 / PRESENCE</span>
            <span>
              <span data-hero-scramble="ENGINEERING">ENGINEERING</span>
              <br />
              <span data-hero-scramble="EDUCATION">EDUCATION</span>
              <br />
              <span data-hero-scramble="HUMAN CONNECTION">HUMAN CONNECTION</span>
            </span>
          </div>

          <div className="hero-bottom">
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                navigate('#about');
              }}
            >
              <span className="scroll-line" />{' '}
              <span data-hero-scramble="SCROLL TO DISCOVER">SCROLL TO DISCOVER</span>{' '}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 5v14" />
                <path d="m19 12-7 7-7-7" />
              </svg>
            </a>
            <span data-hero-scramble="CURIOUS BY NATURE. BUILDER BY CHOICE.">
              CURIOUS BY NATURE. BUILDER BY CHOICE.
            </span>
            <span className="hero-edition" data-hero-scramble="AN ONGOING EXPLORATION ↗">
              AN ONGOING EXPLORATION ↗
            </span>
          </div>
        </section>

        {/* PROOF STRIP */}
        <section className="proof-strip" aria-label="Career highlights">
          <div>
            <strong>3rd Year</strong>
            <p>BE Information Technology</p>
          </div>
          <div>
            <strong>DevOps</strong>
            <p>Curated Career Focus</p>
          </div>
          <div>
            <strong>Student</strong>
            <p>Building skills beyond the classroom.</p>
          </div>
          <a
            href="#work"
            onClick={(e) => {
              e.preventDefault();
              navigate('#work');
            }}
          >
            THE WORK.
            <br />
            THE REAL-WORLD IMPACT.
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 7h10v10" />
              <path d="M7 17 17 7" />
            </svg>
          </a>
        </section>

        {/* 01 / THE PERSON BEHIND THE WORK */}
        <section id="about" className="about chapter solid-section">
          <div className="section-label">
            <span>01 / THE PERSON BEHIND THE WORK</span>
            <span>A CONNECTED PERSPECTIVE</span>
          </div>

          <div className="about-grid">
            <div className="about-copy" data-reveal="true">
              <h2>
                Technology is
                <br />
                the starting point.
                <br />
                <em>Building solutions is the goal</em>
              </h2>
              <p className="lead">
                I explore cloud technologies, automate with code, and build projects that turn ideas
                into reality.
              </p>
              <p>Turning curiosity into code and knowledge into practical solutions.</p>
              <div className="identity-notes">
                <span>ENGINEER&apos;S MINDSET.</span>
                <span>AUTOMATE WITH INTENT.</span>
                <span>BUILDER&apos;S AMBITION.</span>
              </div>
            </div>

            <div className="signal-explorer signal-about">
              <div className="signal-topline">
                <span className="eyebrow">THREE DISCIPLINES. ONE PERSPECTIVE.</span>
                <span aria-hidden="true">{currentAboutPerspective.index}</span>
              </div>
              <div
                className="signal-visual"
                aria-hidden="true"
                data-live={motionOn ? 'true' : undefined}
              >
                <SignalExplorerCanvas lens={aboutLens} motionOn={motionOn} />
                <div className={`signal-fallback ${ABOUT_LENS_META[aboutLens].shapeClass}`}>
                  <i />
                  <i />
                  <i />
                  <i />
                  <i />
                </div>
                <span className="signal-center-label">
                  <SignalTextSpan text={ABOUT_LENS_META[aboutLens].centerLabel} />
                </span>
              </div>
              <div className="signal-options" role="group" aria-label="Explore my disciplines">
                {PERSPECTIVES.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={aboutLens === item.id}
                    onClick={() => setAboutLens(item.id)}
                  >
                    {item.label}
                    <span aria-hidden="true">↗</span>
                  </button>
                ))}
              </div>
              <div className="signal-story" aria-live="polite">
                <h3>{currentAboutPerspective.heroTitle}</h3>
                <p>{currentAboutPerspective.heroBody}</p>
              </div>
              <p className="signal-hint">{currentAboutPerspective.heroHint}</p>
            </div>
          </div>
        </section>

        {/* 02 / SELECTED WORK */}
        <section id="work" className="selected-work chapter solid-section">
          <div className="section-label">
            <span>
              <SignalTextSpan text="02 / SELECTED WORK" />
            </span>
            <span>BUILT. TAUGHT. PUT INTO THE WORLD.</span>
          </div>

          <div className="selected-heading" data-editorial-reveal="true">
            <h2>
              Every idea starts somewhere.
              <br />
              <em>Here’s what I’ve built.</em>
            </h2>
            <p>
              From software projects to hands-on tech experiments.
              <br />A collection of ideas turned into practical experience.
            </p>
          </div>

          <div className="work-gallery">
            {/* 01 SHERYIANS LMS */}
            <article className="work-piece work-piece-lms" data-editorial-reveal="true">
              <div className="work-caption">
                <span className="work-number">01</span>
                <div>
                  <span className="eyebrow">Linux &amp; Network Engineering</span>
                  <h3>
                    <a
                      href="#work"
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                    >
                      Linux-Based VPN Setup
                    </a>
                  </h3>
                  <p>
                    Exploring secure connectivity through Linux and OpenVPN. Configuring a personal
                    VPN to understand network privacy, tunnelling, and secure remote access.
                  </p>
                </div>
              </div>
            </article>

            {/* 02 KODR */}
            <article className="work-piece work-piece-kodr" data-editorial-reveal="true">
              <div className="work-caption">
                <span className="work-number">02</span>
                <div>
                  <span className="eyebrow">Healthcare Technology &amp; Social Impact</span>
                  <h3>
                    <a
                      href="#work"
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                    >
                      Medibridge
                    </a>
                  </h3>
                  <p>
                    Bridging the healthcare gap in underserved communities. A platform concept
                    designed to connect rural populations with accessible consultations, digital
                    health records, and reliable health information
                  </p>
                </div>
              </div>
            </article>

            {/* 03 JAVASCRIPT: GOD MODE */}
            <article className="work-piece work-piece-javascript" data-editorial-reveal="true">
              <div className="work-caption">
                <span className="work-number">03</span>
                <div>
                  <span className="eyebrow">Tech Stack &amp; Architecture</span>
                  <h3>
                    <a
                      href="#work"
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                    >
                      Tomato — Food Delivery
                    </a>
                  </h3>
                  <p>
                    Developed a food delivery project using Python and SQL, exploring application
                    logic, database design, and data management for a food ordering workflow.
                  </p>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* 03 / HOW I THINK & WORK */}
        <section className="expertise chapter solid-section" id="expertise">
          <div className="section-label">
            <span>03 / HOW I THINK &amp; WORK</span>
            <span>DEPTH MEETS PERSPECTIVE</span>
          </div>

          <div className="expertise-grid expertise-studio">
            <div className="expertise-intro">
              <h2>
                What I work with.
                <br />
                <em>From code to cloud.</em>
              </h2>
              <p className="muted">
                Explore the disciplines shaping how I approach technical problems
              </p>

              <div className="thinking-path" aria-live="polite">
                <span className="eyebrow">
                  <SignalTextSpan text={currentDiscipline.leftTitle} />
                </span>
                <ol>
                  {currentDiscipline.steps.map((s, idx) => (
                    <li key={s.num} style={{ animationDelay: `${idx * 70}ms` }}>
                      <span>{s.num}</span>
                      {s.label}
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="expertise-list">
              {THINKING_DISCIPLINES.map((disc, idx) => {
                const isOpen = activeDisciplineId === disc.id;
                return (
                  <article
                    key={disc.id}
                    className={`expertise-item ${isOpen ? 'expanded' : ''}`}
                  >
                    <h3>
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={`expertise-${idx}`}
                        onClick={() => setActiveDisciplineId(disc.id)}
                      >
                        <span>
                          <small className="eyebrow">
                            <SignalTextSpan text={disc.eyebrow} />
                          </small>
                          {disc.title}
                        </span>
                        {isOpen ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-minus"
                          >
                            <path d="M5 12h14" />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-plus"
                          >
                            <path d="M5 12h14" />
                            <path d="M12 5v14" />
                          </svg>
                        )}
                      </button>
                    </h3>
                    <div id={`expertise-${idx}`} className="expertise-body" hidden={!isOpen}>
                      {disc.summary && <p>{disc.summary}</p>}
                      <p className="strengths">{disc.tags.join(' · ')}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* INTERLUDE / STILL BECOMING */}
        <section id="journey" className="journey chapter solid-section">
          <div className="section-label">
            <span>INTERLUDE / STILL BECOMING</span>
            <span>A JOURNEY IN MOTION</span>
          </div>

          <div className="journey-grid">
            <h2 data-reveal="true">
              Started with code.
              <br />
              <em>Kept asking why.</em>
            </h2>
            <div className="timeline">
              <article data-reveal="true">
                <span>2024</span>
                <h3>Where it all started.</h3>
                <p>
                  Started college in October to pursue my engineering degree, taking the first steps
                  toward turning my interest in technology into practical skills.
                </p>
              </article>
              <article data-reveal="true">
                <span>2026</span>
                <h3>Exploring tech. Finding my direction.</h3>
                <p>
                  Started my engineering journey with a curiosity to explore beyond the classroom. As
                  I discovered different areas of technology, cloud computing and DevOps became the
                  direction I wanted to pursue.
                </p>
              </article>
              <article data-reveal="true">
                <span>TODAY</span>
                <h3>Turning curiosity into direction.</h3>
                <p>
                  Exploring technology through hands-on projects, strengthening my foundation and
                  building toward a future in Cloud &amp; DevOps.
                </p>
              </article>
              <article data-reveal="true">
                <span>NEXT</span>
                <h3>More useful things. Greater reach.</h3>
                <p>
                  Working with ambitious people to build ,Deepening my cloud and automation skills,
                  creating practical projects, and working toward building reliable, scalable
                  infrastructure that solves real-world problems.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* 06 / THE NEXT CHAPTER (#contact) */}
        <section id="contact" className="contact chapter">
          <div className="section-label">
            <span>06 / THE NEXT CHAPTER</span>
            <span>LET’S MAKE IT MATTER</span>
          </div>

          <div className="contact-inner" data-reveal="true">
            <span className="availability">
              <i /> OPEN TO MEANINGFUL CONVERSATIONS
            </span>
            <h2>
              Something great
              <br />
              starts with <em>a hello.</em>
            </h2>
            <a
              className="contact-cta"
              href="mailto:mithileshtayade97@gmail.com"
              onClick={(e) => {
                e.preventDefault();
                setContactModalOpen(true);
              }}
            >
              Let’s connect{' '}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 7h10v10" />
                <path d="M7 17 17 7" />
              </svg>
            </a>
            <p>
              I build with code, explore cloud technologies.
              <br />
              If our worlds overlap, I’d love to hear from you.
            </p>
          </div>

          <footer>
            <a
              className="footer-name"
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: motionOn ? 'smooth' : 'auto' });
              }}
            >
              Mithilesh Tayade<span>.</span>
            </a>
            <div className="socials">
              <a
                href="https://www.linkedin.com/in/mithilesh-tayade-6ab805299/"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 7h10v10" />
                  <path d="M7 17 17 7" />
                </svg>
              </a>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                Instagram
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 7h10v10" />
                  <path d="M7 17 17 7" />
                </svg>
              </a>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                YouTube
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 7h10v10" />
                  <path d="M7 17 17 7" />
                </svg>
              </a>
              <a
                href="https://github.com/mithileshtayade97"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 7h10v10" />
                  <path d="M7 17 17 7" />
                </svg>
              </a>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                }}
              >
                X
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 7h10v10" />
                  <path d="M7 17 17 7" />
                </svg>
              </a>
            </div>
            <a
              href="#top"
              className="back-top"
              aria-label="Back to top"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: motionOn ? 'smooth' : 'auto' });
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="19"
                height="19"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m5 12 7-7 7 7" />
                <path d="M12 19V5" />
              </svg>
            </a>
            <div className="footer-bottom">
              <span>© 2026 MITHILESH TAYADE</span>
              <span>BUILT WITH INTENT. ALWAYS EVOLVING.</span>
              <span>BHOPAL, INDIA ↗ THE WORLD</span>
            </div>
          </footer>
        </section>
      </main>
    );
  };

  return (
    <>
      <div
        className="scroll-progress"
        style={{ transform: `scaleX(${scrollProgress})` }}
        aria-hidden="true"
      />

      {route === '/' && (
        <div
          className="scene-backdrop"
          aria-hidden="true"
          data-live={motionOn && sceneLive ? 'true' : undefined}
        >
          <div className={`artifact-fallback ${motionOn && sceneLive ? 'webgl-active' : ''}`}>
            <SignalPortrait
              alt="Mithilesh Tayade signal portrait"
            />
          </div>
          <HeroPortraitScene
            motionOn={motionOn}
            onReadyChange={setSceneLive}
          />
        </div>
      )}

      <button
        type="button"
        className="motion-toggle"
        aria-label={motionOn ? 'Motion on — pause animations' : 'Motion off — enable animations'}
        aria-pressed={motionOn}
        onClick={() => setMotionOn((prev) => !prev)}
      >
        {motionOn ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="4" height="16" x="6" y="4" />
            <rect width="4" height="16" x="14" y="4" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="6 3 20 12 6 21 6 3" />
          </svg>
        )}
        <span>MOTION {motionOn ? 'ON' : 'OFF'}</span>
      </button>

      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className="navigation refined-navigation glass-navigation" data-hidden="false">
        <a
          className="wordmark"
          href="#top"
          aria-label="Mithilesh Tayade"
          onClick={(e) => {
            e.preventDefault();
            navigate('/');
          }}
        >
          <span className="nav-identity">
            <span>Mithilesh Tayade</span>
          </span>
        </a>

        <nav
          className={`nav-links ${mobileMenuOpen ? 'is-open' : ''}`}
          aria-label="Main navigation"
          id="main-nav"
        >
          <a
            className="nav-destination"
            href="#work"
            onClick={(e) => {
              e.preventDefault();
              navigate('#work');
            }}
          >
            <SignalTextSpan text="Projects" />
            <span className="nav-mobile-arrow" aria-hidden="true">
              ↗
            </span>
          </a>
          <a
            className="nav-destination"
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              navigate('#about');
            }}
          >
            <SignalTextSpan text="About" />
            <span className="nav-mobile-arrow" aria-hidden="true">
              ↗
            </span>
          </a>
          <a
            className="nav-destination"
            href="#expertise"
            onClick={(e) => {
              e.preventDefault();
              navigate('#expertise');
            }}
          >
            <SignalTextSpan text="Skill" />
            <span className="nav-mobile-arrow" aria-hidden="true">
              ↗
            </span>
          </a>
          <a
            className="nav-contact"
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              navigate('#contact');
            }}
          >
            <SignalTextSpan text="Let’s talk" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 7h10v10" />
              <path d="M7 17 17 7" />
            </svg>
          </a>
        </nav>

        <button
          type="button"
          className="menu-toggle"
          aria-expanded={mobileMenuOpen}
          aria-controls="main-nav"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMobileMenuOpen((prev) => !prev)}
        >
          <span>Menu</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </button>
      </header>

      {renderMainContent()}

      <ContactModal isOpen={contactModalOpen} onClose={() => setContactModalOpen(false)} />
    </>
  );
}
