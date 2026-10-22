import React from 'react';
import { PROJECTS, VIDEOS } from '../data/portfolioData';

interface SubpageProps {
  onNavigate: (path: string) => void;
  onOpenContact: () => void;
}

export const WorkIndexPage: React.FC<SubpageProps> = ({ onNavigate, onOpenContact }) => {
  return (
    <main id="content" className="editorial-page">
      <div className="editorial-intro">
        <p className="eyebrow">02 / SELECTED WORK & ARCHIVE</p>
        <h1>
          Ideas are a start. <em>This is the work.</em>
        </h1>
        <p>
          Platforms, learning programs, educational series, and engineering explorations built by
          Mithilesh Tayade across EdTech, developer tooling, and client systems.
        </p>
      </div>

      <div className="work-index">
        {PROJECTS.map((proj) => (
          <a
            key={proj.slug}
            href="/#work"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('#work');
            }}
          >
            <p className="eyebrow">
              {proj.index} / {proj.category} · {proj.year}
            </p>
            <h2>
              {proj.title}
              <span aria-hidden="true">↗</span>
            </h2>
            <p>{proj.summary}</p>
          </a>
        ))}
      </div>

      <section className="editorial-section">
        <p className="eyebrow">CLIENT & FREELANCE DELIVERY</p>
        <h2>50+ freelance clients served.</h2>
        <p>
          Alongside long-term product and education work, I’ve partnered with over 50 founders,
          agencies, and businesses to translate product ideas into fast, reliable web applications
          and interactive brand experiences.
        </p>
        <button type="button" className="text-link" onClick={onOpenContact}>
          <span>Discuss a product or project</span>
          <span aria-hidden="true">↗</span>
        </button>
      </section>

      <footer className="editorial-footer">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/');
          }}
        >
          ← Back to Home
        </a>
        <div>
          <a
            href="/#about"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('#about');
            }}
          >
            About
          </a>
          <a
            href="/#expertise"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('#expertise');
            }}
          >
            Skill
          </a>
          <a
            href="/speaking"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/speaking');
            }}
          >
            Speaking
          </a>
        </div>
      </footer>
    </main>
  );
};

export const ContentPage: React.FC<SubpageProps> = ({ onNavigate }) => {
  return (
    <main id="content" className="editorial-page">
      <div className="editorial-intro">
        <p className="eyebrow">04 / CONTENT & CONVERSATIONS</p>
        <h1>
          A voice. <em>With something to say.</em>
        </h1>
        <p>
          Long-form lessons, deep JavaScript breakdowns, React courses, and candid conversations
          about how engineering teams and developer roles actually work.
        </p>
      </div>

      <div className="work-index">
        {VIDEOS.map((video) => (
          <a key={video.id} href={video.url} target="_blank" rel="noreferrer">
            <p className="eyebrow">
              {video.duration} · {video.categoryLabel}
            </p>
            <h2>
              {video.title}
              <span aria-hidden="true">↗</span>
            </h2>
            <p>{video.subtitle}</p>
          </a>
        ))}
      </div>

      <footer className="editorial-footer">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/');
          }}
        >
          ← Back to Home
        </a>
      </footer>
    </main>
  );
};

export const SpeakingPage: React.FC<SubpageProps> = ({ onNavigate, onOpenContact }) => {
  return (
    <main id="content" className="editorial-page">
      <div className="editorial-intro">
        <p className="eyebrow">05 / SPEAKING & STAGE</p>
        <h1>
          Make it clear. <em>Make it count.</em>
        </h1>
        <p>
          Technical talks, university keynotes, developer workshops, and candid conversations on
          engineering careers, AI-era software development, and learning how to build.
        </p>
      </div>

      <div className="editorial-layout">
        <aside>
          <p className="eyebrow">SPEAKING FORMATS</p>
          <nav aria-label="Speaking formats">
            <a href="#keynotes">University Keynotes</a>
            <a href="#workshops">Hands-on Workshops</a>
            <a href="#panels">Developer Conversations</a>
          </nav>
          <button type="button" className="text-link" onClick={onOpenContact}>
            <span>Invite Mithilesh to speak</span>
            <span aria-hidden="true">↗</span>
          </button>
        </aside>
        <div>
          <section id="keynotes" className="editorial-section">
            <p className="eyebrow">STAGE & AUDITORIUMS</p>
            <h2>Sharing what I learn. Opening what comes next.</h2>
            <p>
              From packed auditoriums at institutions like LNCT to Sheryians Coding School community
              stages, my sessions focus on practical clarity—helping students and early-career
              engineers understand how real software teams think, build, and hire.
            </p>
          </section>
        </div>
      </div>

      <footer className="editorial-footer">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('/');
          }}
        >
          ← Back to Home
        </a>
      </footer>
    </main>
  );
};
