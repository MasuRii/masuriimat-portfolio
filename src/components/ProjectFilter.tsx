import { useState, useMemo, useEffect, useRef } from 'react';

// Types must match the data layer
type Tier = 'flagship' | 'notable' | 'extension';
type Cluster = 'ai-infra' | 'dev-tooling' | 'full-stack' | 'systems' | 'templates' | 'userscripts' | 'transport';

interface ProjectData {
  id: string;
  title: string;
  tagline: string;
  language: string;
  stars: number;
  tier: Tier;
  cluster: Cluster;
  topics: string[];
  demo?: string;
}

interface ProjectFilterProps {
  projects: ProjectData[];
  clusters: { id: Cluster; label: string; tuiHeader: string; description: string }[];
  tierLabels: Record<Tier, string>;
  tierDescriptions: Record<Tier, string>;
  tierTuiPrefix: Record<Tier, string>;
}

type SortOption = 'tier' | 'stars' | 'recent' | 'name';

export function ProjectFilter({
  projects,
  clusters,
  tierLabels,
  tierDescriptions,
  tierTuiPrefix,
}: ProjectFilterProps) {
  const [query, setQuery] = useState('');
  const [activeTier, setActiveTier] = useState<Tier | 'all'>('all');
  const [activeCluster, setActiveCluster] = useState<Cluster | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('tier');
  const inputRef = useRef<HTMLInputElement>(null);

  // Fuzzy search helper — simple includes-based with scored relevance
  const filtered = useMemo(() => {
    let result = [...projects];

    // Filter by tier
    if (activeTier !== 'all') {
      result = result.filter(p => p.tier === activeTier);
    }

    // Filter by cluster
    if (activeCluster !== 'all') {
      result = result.filter(p => p.cluster === activeCluster);
    }

    // Filter by query
    if (query.trim()) {
      const q = query.toLowerCase().trim();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.language.toLowerCase().includes(q) ||
        p.topics.some(t => t.toLowerCase().includes(q))
      );
    }

    // Sort
    const tierOrder: Record<Tier, number> = { flagship: 0, notable: 1, extension: 2 };
    switch (sortBy) {
      case 'tier':
        result.sort((a, b) => tierOrder[a.tier] - tierOrder[b.tier]);
        break;
      case 'stars':
        result.sort((a, b) => b.stars - a.stars);
        break;
      case 'name':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return result;
  }, [projects, activeTier, activeCluster, query, sortBy]);

  // Keyboard shortcut: focus search on /
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === '/' && !e.metaKey && !e.ctrlKey) {
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const clearFilters = () => {
    setQuery('');
    setActiveTier('all');
    setActiveCluster('all');
  };

  const hasActiveFilters = activeTier !== 'all' || activeCluster !== 'all' || query.trim() !== '';

  return (
    <div className="project-filter">
      {/* Search input */}
      <div className="relative mb-4">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
          style={{ color: 'var(--color-text-dim)' }}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search projects by name, tech, or topic…"
          className="search-input"
          aria-label="Search projects"
        />
        <kbd
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] px-1.5 py-0.5 bg-surface border border-border rounded pointer-events-none hidden sm:inline-flex"
          style={{ color: 'var(--color-text-dim)', fontFamily: 'var(--font-mono)', background: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          /
        </kbd>
      </div>

      {/* Filter buttons */}
      <div className="flex flex-col gap-3 mb-6">
        {/* Tier filters */}
        <div>
          <p className="text-xs font-mono mb-2" style={{ color: 'var(--color-text-dim)' }}>
            <span style={{ color: 'var(--color-accent)' }}>$</span> filter --tier
          </p>
          <div className="filter-bar" role="group" aria-label="Filter by project tier">
            <button
              className={`filter-btn ${activeTier === 'all' ? 'filter-btn--active' : ''}`}
              onClick={() => setActiveTier('all')}
              aria-pressed={activeTier === 'all'}
            >
              all
            </button>
            {(['flagship', 'notable', 'extension'] as Tier[]).map(tier => (
              <button
                key={tier}
                className={`filter-btn ${activeTier === tier ? 'filter-btn--active' : ''}`}
                onClick={() => setActiveTier(tier)}
                aria-pressed={activeTier === tier}
                title={tierDescriptions[tier]}
              >
                <span className="mr-1" aria-hidden="true">{tierTuiPrefix[tier]}</span>
                {tierLabels[tier]}
              </button>
            ))}
          </div>
        </div>

        {/* Cluster filters */}
        <div>
          <p className="text-xs font-mono mb-2" style={{ color: 'var(--color-text-dim)' }}>
            <span style={{ color: 'var(--color-accent)' }}>$</span> filter --cluster
          </p>
          <div className="filter-bar" role="group" aria-label="Filter by project cluster">
            <button
              className={`filter-btn ${activeCluster === 'all' ? 'filter-btn--active' : ''}`}
              onClick={() => setActiveCluster('all')}
              aria-pressed={activeCluster === 'all'}
            >
              all
            </button>
            {clusters.map(cluster => (
              <button
                key={cluster.id}
                className={`filter-btn ${activeCluster === cluster.id ? 'filter-btn--active' : ''}`}
                onClick={() => setActiveCluster(cluster.id)}
                aria-pressed={activeCluster === cluster.id}
              >
                {cluster.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sort and clear */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono" style={{ color: 'var(--color-text-dim)' }}>
              sort:
            </span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as SortOption)}
              className="filter-btn appearance-none pr-6"
              style={{ backgroundPosition: 'right 6px center', backgroundRepeat: 'no-repeat' }}
              aria-label="Sort projects by"
            >
              <option value="tier">tier</option>
              <option value="stars">stars</option>
              <option value="name">name</option>
            </select>
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs font-mono hover:underline"
              style={{ color: 'var(--color-accent)' }}
            >
              ✕ clear filters
            </button>
          )}
          <span className="text-xs font-mono ml-auto" style={{ color: 'var(--color-text-dim)' }}>
            {filtered.length} result{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Tier descriptions */}
      <div className="mb-8 text-xs font-mono space-y-1" style={{ color: 'var(--color-text-dim)' }}>
        {(['flagship', 'notable', 'extension'] as Tier[]).map(t => (
          <div key={t} className="flex gap-2">
            <span style={{ color: t === 'flagship' ? 'var(--color-accent)' : t === 'notable' ? 'var(--color-blue)' : 'var(--color-text-muted)' }}>
              {tierTuiPrefix[t]}
            </span>
            <span><strong>{tierLabels[t]}</strong>: {tierDescriptions[t]}</span>
          </div>
        ))}
      </div>

      {/* Filtered results — rendered as IDs for Astro to pick up */}
      <div id="project-filter-results" data-count={filtered.length}>
        {filtered.map(project => (
          <div
            key={project.id}
            data-project-id={project.id}
            data-tier={project.tier}
            data-cluster={project.cluster}
            className="filtered-project"
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-12 text-center">
          <p className="font-mono text-sm" style={{ color: 'var(--color-text-dim)' }}>
            <span style={{ color: 'var(--color-red)' }}>error:</span> no matching projects found
          </p>
          <button
            onClick={clearFilters}
            className="mt-4 text-sm font-mono hover:underline"
            style={{ color: 'var(--color-accent)' }}
          >
            $ clear filters
          </button>
        </div>
      )}
    </div>
  );
}