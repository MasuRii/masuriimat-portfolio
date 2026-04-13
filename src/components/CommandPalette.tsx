import { useEffect, useState, useCallback, useRef } from 'react';
import { projects, clusters, socialLinks } from '@/data/projects';

interface Command {
  id: string;
  label: string;
  section: string;
  action: () => void;
}

const navigateCommands: Command[] = [
  { id: 'home', label: 'Go to Home', section: 'Navigate', action: () => { window.location.href = '/'; } },
  { id: 'projects', label: 'Go to Projects', section: 'Navigate', action: () => { window.location.href = '/projects'; } },
  { id: 'about', label: 'Go to About', section: 'Navigate', action: () => { window.location.href = '/#about'; } },
  { id: 'contact', label: 'Go to Contact', section: 'Navigate', action: () => { window.location.href = '/#contact'; } },
];

const projectCommands: Command[] = projects.map(p => ({
  id: `proj-${p.id}`,
  label: p.title,
  section: 'Projects',
  action: () => { window.location.href = `/projects/${p.id}`; },
}));

const clusterCommands: Command[] = [
  { id: 'cluster-ai', label: 'AI Infrastructure cluster', section: 'Navigate', action: () => { window.location.href = '/projects#ai-infra'; } },
  { id: 'cluster-dev', label: 'Dev Tooling cluster', section: 'Navigate', action: () => { window.location.href = '/projects#dev-tooling'; } },
  { id: 'cluster-products', label: 'Full-Stack Products cluster', section: 'Navigate', action: () => { window.location.href = '/projects#products'; } },
  { id: 'cluster-systems', label: 'Systems & Crates cluster', section: 'Navigate', action: () => { window.location.href = '/projects#systems'; } },
];

const socialCommands: Command[] = socialLinks.map(s => ({
  id: `social-${s.id}`,
  label: s.label,
  section: 'Contact',
  action: () => { window.open(s.url, '_blank', 'noopener,noreferrer'); },
}));

const actionCommands: Command[] = [
  { id: 'github', label: 'Open GitHub', section: 'External', action: () => { window.open('https://github.com/MasuRii', '_blank', 'noopener,noreferrer'); } },
  { id: 'theme-toggle', label: 'Toggle Theme', section: 'Actions', action: () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  }},
];

const commands: Command[] = [
  ...navigateCommands,
  ...clusterCommands,
  ...projectCommands,
  ...socialCommands,
  ...actionCommands,
];

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(query.toLowerCase()) ||
    cmd.section.toLowerCase().includes(query.toLowerCase())
  );

  // Reset active index when filtered results change
  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const open = useCallback(() => {
    setIsOpen(true);
    setQuery('');
    setActiveIndex(0);
    setIsAnimatingOut(false);
  }, []);

  const close = useCallback(() => {
    setIsAnimatingOut(true);
    setTimeout(() => {
      setIsOpen(false);
      setQuery('');
      setIsAnimatingOut(false);
    }, 120);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          close();
        } else {
          open();
        }
      }
      if (e.key === 'Escape' && isOpen && !isAnimatingOut) {
        close();
      }
    };

    // Also open on click of the ⌘K trigger area in the header
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Open on click of the kbd hint span, its children, or any [data-command-palette-trigger]
      if (
        target.closest('[data-command-palette-trigger]') ||
        target.closest('kbd')
      ) {
        e.preventDefault();
        if (!isOpen) {
          open();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleClick);
    };
  }, [isOpen, isAnimatingOut, open, close]);

  useEffect(() => {
    if (isOpen && !isAnimatingOut && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen, isAnimatingOut]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && filtered[activeIndex]) {
      filtered[activeIndex].action();
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.querySelector('[data-active="true"]');
      activeEl?.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  if (!isOpen) return null;

  return (
    <div
      className="command-palette-backdrop"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9998,
        background: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '15vh',
      }}
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
      role="dialog"
      aria-modal="true"
      aria-label="Command palette"
    >
      <div
        style={{
          width: '100%',
          maxWidth: '560px',
          maxHeight: '60vh',
          background: 'var(--color-surface-raised)',
          border: '1px solid var(--color-border)',
          borderRadius: '8px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          opacity: isAnimatingOut ? 0 : 1,
          transform: isAnimatingOut ? 'scale(0.96)' : 'scale(1)',
          transition: 'opacity 120ms ease, transform 120ms ease',
          boxShadow: '0 16px 64px rgba(0,0,0,0.5)',
        }}
      >
        {/* Search input */}
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: 'var(--color-text-dim)', flexShrink: 0 }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search commands, projects, contacts…"
            aria-label="Search commands"
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--color-text)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.875rem',
            }}
          />
          <kbd style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            padding: '2px 6px',
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: '3px',
            color: 'var(--color-text-dim)',
          }}>
            ESC
          </kbd>
        </div>

        {/* Results list */}
        <div
          ref={listRef}
          style={{
            overflowY: 'auto',
            flex: 1,
            padding: '8px 0',
          }}
          role="listbox"
          aria-label="Command results"
        >
          {filtered.length === 0 && (
            <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--color-text-dim)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--color-red)' }}>error:</span> no matching commands
            </div>
          )}

          {/* Group by section */}
          {(() => {
            const sections = new Map<string, Command[]>();
            filtered.forEach(cmd => {
              const existing = sections.get(cmd.section) || [];
              existing.push(cmd);
              sections.set(cmd.section, existing);
            });

            let globalIndex = 0;
            const elements: React.ReactNode[] = [];

            sections.forEach((cmds, section) => {
              elements.push(
                <div key={`section-${section}`} style={{
                  padding: '6px 16px 2px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.65rem',
                  color: 'var(--color-text-dim)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}>
                  {section}
                </div>
              );

              cmds.forEach(cmd => {
                const idx = globalIndex;
                elements.push(
                  <button
                    key={cmd.id}
                    data-active={activeIndex === idx}
                    role="option"
                    aria-selected={activeIndex === idx}
                    onClick={() => cmd.action()}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '8px 16px',
                      border: 'none',
                      background: activeIndex === idx ? 'var(--color-accent-muted)' : 'transparent',
                      color: activeIndex === idx ? 'var(--color-accent)' : 'var(--color-text)',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.8rem',
                      textAlign: 'left',
                      transition: 'background 100ms ease',
                    }}
                    onMouseEnter={() => setActiveIndex(idx)}
                  >
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{cmd.label}</span>
                    <span style={{
                      fontSize: '0.65rem',
                      color: 'var(--color-text-dim)',
                      marginLeft: '8px',
                      flexShrink: 0,
                    }}>
                      {cmd.section}
                    </span>
                  </button>
                );
                globalIndex++;
              });
            });

            return elements;
          })()}
        </div>

        {/* Footer */}
        <div style={{
          padding: '8px 16px',
          borderTop: '1px solid var(--color-border)',
          display: 'flex',
          gap: '12px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          color: 'var(--color-text-dim)',
        }}>
          <span>↑↓ navigate</span>
          <span>↵ select</span>
          <span>esc close</span>
        </div>
      </div>
    </div>
  );
}