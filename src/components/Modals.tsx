import React, { useEffect, useState } from 'react';
import { validateContactMessage } from '../data/portfolioData';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('Internship & Mentorship');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateContactMessage({ name, email, message });
    if (!validation.valid) {
      setError(validation.error || 'Please check your inputs.');
      return;
    }
    setError(null);
    setSubmitted(true);
  };

  return (
    <div
      className="studio-modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="studio-modal">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '18px',
          }}
        >
          <span className="eyebrow" style={{ color: '#ff8c59' }}>
            08 / START A CONVERSATION
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Contact Modal"
            style={{
              background: 'transparent',
              color: '#bdb5aa',
              fontSize: '13px',
              fontFamily: 'var(--font-mono), monospace',
            }}
          >
            [CLOSE ✕]
          </button>
        </div>

        <h2
          id="contact-modal-title"
          style={{ fontSize: '38px', lineHeight: 1.05, marginBottom: '10px' }}
        >
          Something great starts with <em>a hello.</em>
        </h2>
        <p style={{ color: '#b5afa8', fontSize: '13px', marginBottom: '22px' }}>
          Reach out to Mithilesh Tayade directly at{' '}
          <a
            href="mailto:mithileshtayade97@gmail.com"
            style={{ color: '#ff8c59', textDecoration: 'underline' }}
          >
            mithileshtayade97@gmail.com
          </a>{' '}
          or send a note below.
        </p>

        {submitted ? (
          <div
            role="status"
            style={{
              padding: '24px',
              border: '1px solid var(--line)',
              background: '#11100f',
              marginBottom: '16px',
            }}
          >
            <p className="eyebrow" style={{ color: '#ff8c59', marginBottom: '8px' }}>
              MESSAGE RECEIVED
            </p>
            <p style={{ fontSize: '15px', color: '#f1eee8', marginBottom: '12px' }}>
              Thank you, {name}. Your note regarding <strong>{topic}</strong> is ready for Mithilesh
              Tayade.
            </p>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <a
                href={`mailto:mithileshtayade97@gmail.com?subject=${encodeURIComponent(
                  `[${topic}] Hello from ${name}`
                )}&body=${encodeURIComponent(message + `\n\nFrom: ${name} (${email})`)}`}
                className="pill-link"
                style={{ padding: '10px 18px', fontSize: '12px' }}
              >
                <span>Open in Email Client</span>
                <span aria-hidden="true">↗</span>
              </a>
              <button
                type="button"
                className="text-link"
                onClick={() => {
                  setSubmitted(false);
                  setName('');
                  setEmail('');
                  setMessage('');
                }}
              >
                Send another message
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div style={{ marginBottom: '14px' }}>
              <label
                htmlFor="contact-name"
                className="eyebrow"
                style={{ display: 'block', marginBottom: '6px', color: '#b8b0a8' }}
              >
                YOUR NAME
              </label>
              <input
                id="contact-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rohan Verma"
                style={{
                  width: '100%',
                  background: '#060606',
                  border: '1px solid var(--line)',
                  padding: '11px 14px',
                  color: '#f1eee8',
                  fontSize: '14px',
                }}
              />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label
                htmlFor="contact-email"
                className="eyebrow"
                style={{ display: 'block', marginBottom: '6px', color: '#b8b0a8' }}
              >
                YOUR EMAIL
              </label>
              <input
                id="contact-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                style={{
                  width: '100%',
                  background: '#060606',
                  border: '1px solid var(--line)',
                  padding: '11px 14px',
                  color: '#f1eee8',
                  fontSize: '14px',
                }}
              />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label
                htmlFor="contact-topic"
                className="eyebrow"
                style={{ display: 'block', marginBottom: '6px', color: '#b8b0a8' }}
              >
                WHAT ARE WE EXPLORING?
              </label>
              <select
                id="contact-topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                style={{
                  width: '100%',
                  background: '#060606',
                  border: '1px solid var(--line)',
                  padding: '11px 14px',
                  color: '#f1eee8',
                  fontSize: '14px',
                }}
              >
                <option value="Internship & Mentorship">Internship & Mentorship</option>
                <option value="Jobs & Work">Jobs & Work</option>
                <option value="Brand & Partnership">Brand & Partnership</option>
                <option value="Build Project">Build Project</option>
              </select>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label
                htmlFor="contact-message"
                className="eyebrow"
                style={{ display: 'block', marginBottom: '6px', color: '#b8b0a8' }}
              >
                MESSAGE
              </label>
              <textarea
                id="contact-message"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell me about your product, event, or idea..."
                style={{
                  width: '100%',
                  background: '#060606',
                  border: '1px solid var(--line)',
                  padding: '11px 14px',
                  color: '#f1eee8',
                  fontSize: '14px',
                  resize: 'vertical',
                }}
              />
            </div>

            {error && (
              <p
                role="alert"
                style={{
                  color: '#ff8c59',
                  fontSize: '12px',
                  fontFamily: 'var(--font-mono), monospace',
                  marginBottom: '14px',
                }}
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              className="pill-link"
              style={{ width: '100%', justifyContent: 'space-between', cursor: 'pointer' }}
            >
              <span>Send message to Mithilesh</span>
              <span aria-hidden="true">↗</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
