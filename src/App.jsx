import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';
import useStore from './store/useStore.js';

/* ─── Shared Components ─── */

const Button = ({ children, onClick, active, ...props }) => {
  const base = "inline-flex items-center px-5 py-2 border rounded-full text-[11px] uppercase tracking-wide cursor-pointer transition-all duration-200";
  const cls = active
    ? `${base} border-[#E8E55E] bg-[#E8E55E] text-black`
    : `${base} border-white/20 text-white/70 hover:border-white/40 hover:text-white`;
  return (
    <button className={cls} onClick={onClick} {...props}>
      {children}
    </button>
  );
};

const Card = ({ children, variant, className = '', ...props }) => {
  const base = variant === 'yellow'
    ? 'bg-[#E8E55E] text-black rounded-2xl relative transition-all'
    : 'bg-[#0a0a0a] border border-white/[0.06] rounded-2xl relative transition-all hover:border-white/[0.12]';
  return (
    <div className={`${base} ${className}`} {...props}>
      {children}
    </div>
  );
};

const Tag = ({ children, className = '', ...props }) => (
  <span className={`border border-current px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider ${className}`} {...props}>
    {children}
  </span>
);

const Spinner = ({ className = '' }) => (
  <div className={`w-5 h-5 border-2 border-white/20 border-t-[#E8E55E] rounded-full animate-spin ${className}`} />
);

/* ─── Scenario Seed Data (visual chrome for landing page) ─── */

const scenarios = [
  {
    slug: 'ww2',
    image: 'https://images.unsplash.com/photo-1580086319619-3ed498161c77?q=80&w=600&auto=format&fit=crop',
    title: 'World War II — Five Turning Points',
    subtitle: '1939–1945',
    startNode: 0,
    nodes: [
      'Germany launches blitzkrieg invasion of Poland',
      'France falls — Axis dominance across Western Europe',
      'Pearl Harbor brings America into the war',
      'D-Day — Allied forces storm the beaches of Normandy',
      'Atomic bombs end the war — V-J Day',
    ],
  },
  {
    slug: 'cuban-missile-crisis',
    image: 'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?q=80&w=600&auto=format&fit=crop',
    title: 'Cuban Missile Crisis — 13 Days',
    subtitle: 'October 16–28, 1962',
    startNode: 0,
    nodes: [
      'U-2 spy plane photographs Soviet missile sites in Cuba',
      'ExComm formed — hawks push for immediate airstrike',
      'Naval quarantine encircles Cuba, Soviet ships approach',
      'USS Randolph depth-charges Soviet sub B-59',
      'Vasili Arkhipov refuses to authorize nuclear torpedo',
      'Khrushchev blinks — missiles withdrawn for Turkey deal',
    ],
  },
  {
    slug: '2008-financial-collapse',
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=600&auto=format&fit=crop',
    title: '2008 Financial Collapse',
    subtitle: 'September 15, 2008',
    startNode: 0,
    nodes: [
      'Lehman Brothers files Chapter 11 — $639B in assets',
      'Overnight lending freezes, interbank trust collapses',
      'AIG hours from failure — $85B emergency lifeline',
      'Dow plunges 778 points in single session',
      'Hank Paulson presents 3-page $700B bailout demand',
      'Global contagion — Iceland\'s banking system implodes',
    ],
  },
  {
    slug: 'hiroshima',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop',
    title: 'Hiroshima — The Manhattan Decision',
    subtitle: 'August 6, 1945',
    startNode: 9,
    nodes: [
      'Trinity test proves the bomb works in New Mexico',
      'Target Committee selects Hiroshima for maximum impact',
      'Enola Gay departs Tinian Island at 02:45',
      '"Little Boy" detonates at 1,900 feet — 80,000 killed instantly',
      'Firestorm engulfs 4.7 square miles of the city',
      'Japan surrenders — the atomic age begins',
    ],
  },
  {
    slug: '9-11',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop',
    title: '9/11 — The Longest Morning',
    subtitle: 'September 11, 2001',
    startNode: 0,
    nodes: [
      'Flight 11 strikes North Tower at 08:46 — confusion reigns',
      'Flight 175 hits South Tower on live television',
      'Pentagon struck — national command authority scrambles',
      'FAA grounds all 4,500 flights over U.S. airspace',
      'South Tower collapses — 56 minutes after impact',
      'Flight 93 crashes in Shanksville after passenger revolt',
    ],
  },
  {
    slug: 'berlin-wall',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=600&auto=format&fit=crop',
    title: 'Fall of the Berlin Wall',
    subtitle: 'November 9, 1989',
    startNode: 8,
    nodes: [
      'Günter Schabowski fumbles press conference — "immediately"',
      'Thousands rush to Bornholmer Straße checkpoint',
      'Border guards overwhelmed, open the gates',
      'Families separated 28 years reunite in tears',
      'Sledgehammers tear through concrete — souvenirs taken',
      'Soviet bloc collapses — Cold War era ends',
    ],
  },
];

/* ─── Helpers ─── */

function formatTimestamp(ts) {
  if (!ts) return '';
  return ts.replace(/-/g, '.');
}

function getCausalVarLabel(key) {
  const labels = { escalation: 'Escalation', logistics: 'Logistics', intelligence: 'Intelligence', morale: 'Morale', techLevel: 'Tech Level' };
  return labels[key] || key;
}

function getCausalVarColor(key, value) {
  if (value >= 70) return 'text-[#E8E55E]';
  if (value <= 30) return 'text-red-400';
  return 'text-white';
}

function statusToPercent(status) {
  const map = { 'at-war': 20, 'allied': 80, 'neutral': 50, 'invaded': 10, 'occupied': 15, 'surrendered': 5, 'active': 60, 'retreating': 30 };
  return map[status] || 50;
}

function statusBarColor(percent) {
  if (percent >= 60) return 'bg-emerald-400';
  if (percent >= 40) return 'bg-[#E8E55E]';
  return 'bg-red-400';
}

/* ─── Landing Page ─── */

const LandingView = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [configOpen, setConfigOpen] = useState(false);
  const { loading, error, initScenario, config, setConfig } = useStore();
  const handleScenarioClick = async () => {
    await initScenario();
    navigate('/simulation');
  };

  const handleSubmit = async () => {
    await initScenario();
    navigate('/simulation');
  };

  return (
    <div className="w-full min-h-screen bg-black overflow-y-auto">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-5 border-b border-white/[0.04] sticky top-0 bg-black/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-3">
          <svg className="w-8 h-8" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="100" height="100" rx="22" fill="#0B0B0F" />
            <rect x="7" y="7" width="86" height="86" rx="20" fill="none" stroke="#3A3A45" strokeWidth="2" />
            <circle cx="50" cy="50" r="18" fill="none" stroke="#FFFFFF" strokeWidth="8" />
          </svg>
          <span className="text-sm font-semibold tracking-wide text-white/90 font-display">Ripple</span>
        </div>
      </header>

      {/* Hero */}
      <div className="flex flex-col items-center pt-20 pb-0 px-8">
        <div className="mb-8">
          <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="100" height="100" rx="22" fill="#0B0B0F" />
            <rect x="7" y="7" width="86" height="86" rx="20" fill="none" stroke="#3A3A45" strokeWidth="2" />
            <circle cx="50" cy="50" r="18" fill="none" stroke="#FFFFFF" strokeWidth="8" />
          </svg>
        </div>

        <h1 className="text-[32px] font-light text-white/90 mb-16 tracking-tight text-center">
          What scenario do you want to simulate?
        </h1>

        {error && (
          <div className="w-full max-w-2xl mb-4 bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="w-full max-w-2xl bg-[#0a0a0a] border border-white/[0.08] rounded-2xl p-1 transition-all focus-within:border-white/[0.15]">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Describe a world event, crisis, or systemic shift..."
            rows={2}
            className="w-full bg-transparent text-sm text-white/80 placeholder:text-white/40 resize-none px-5 pt-4 pb-2 focus:outline-none leading-relaxed"
          />
          <div className="flex justify-between items-center px-4 pb-3">
            <button className="w-7 h-7 rounded-lg border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-white/60 hover:border-white/15 transition-colors">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setConfigOpen(!configOpen)}
                className={`flex items-center gap-1.5 text-xs cursor-pointer transition-colors ${configOpen ? 'text-[#E8E55E]' : 'text-white/45 hover:text-white/60'}`}
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="4" y1="21" x2="4" y2="14" />
                  <line x1="4" y1="10" x2="4" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12" y2="3" />
                  <line x1="20" y1="21" x2="20" y2="16" />
                  <line x1="20" y1="12" x2="20" y2="3" />
                  <line x1="1" y1="14" x2="7" y2="14" />
                  <line x1="9" y1="8" x2="15" y2="8" />
                  <line x1="17" y1="16" x2="23" y2="16" />
                </svg>
                Configure
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-8 h-8 rounded-full bg-[#E8E55E] flex items-center justify-center hover:bg-[#f0ed70] transition-colors disabled:opacity-50"
              >
                {loading ? <Spinner className="w-4 h-4 border-black/30 border-t-black" /> : (
                  <svg className="w-4 h-4 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="19" x2="12" y2="5" />
                    <polyline points="5 12 12 5 19 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {configOpen && (
          <div className="w-full max-w-2xl mt-2 bg-[#0a0a0a] border border-white/[0.08] rounded-2xl p-6">
            <div className="grid grid-cols-3 gap-8">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-white/30 mb-3 block">Time Horizon</span>
                <div className="space-y-1.5">
                  {['Future', 'Past'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setConfig('timeHorizon', opt)}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm cursor-pointer transition-all ${config.timeHorizon === opt ? 'bg-white/[0.08] text-white border border-white/[0.12]' : 'text-white/50 hover:text-white/70 hover:bg-white/[0.03] border border-transparent'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-white/30 mb-3 block">Length</span>
                <div className="space-y-1.5">
                  {['10 min', '20 min', '30 min'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setConfig('length', opt)}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm cursor-pointer transition-all ${config.length === opt ? 'bg-white/[0.08] text-white border border-white/[0.12]' : 'text-white/50 hover:text-white/70 hover:bg-white/[0.03] border border-transparent'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-white/30 mb-3 block">Detail</span>
                <div className="space-y-1.5">
                  {['Minimal', 'Standard', 'Deep Dive'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setConfig('detail', opt)}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm cursor-pointer transition-all ${config.detail === opt ? 'bg-white/[0.08] text-white border border-white/[0.12]' : 'text-white/50 hover:text-white/70 hover:bg-white/[0.03] border border-transparent'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Flow text */}
      <div className="flex justify-between max-w-[25rem] py-2 mx-auto">
        <div className="w-fit flex flex-col items-center">
          <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="12" height="38" fill="none" viewBox="0 0 12 38">
            <path fill="rgba(255,255,255,0.3)" d="M7.9 27.74a41 41 0 0 0 3.2 7.61c.58 1.07-.37 2.67-.96 1.6a44 44 0 0 1-3.2-7.47q.46-.88.96-1.74M4.7.4c1.59-1.42 2.4 1.27 3.04 3.25.88 2.77 1.45 5.74 2.1 8.68.29 1.37-1.01 1.93-1.3.58-.5-2.25-.93-4.53-1.54-6.7a55 55 0 0 0-1.09-3.38A59 59 0 0 0 7.9 27.74q-.5.86-.96 1.74A62 62 0 0 1 4.4 4.11c-1.58 3.67-2.47 8.3-3.08 12.64-.2 1.43-1.5.85-1.3-.57a67 67 0 0 1 1.87-9.14C2.52 4.84 3.35 1.62 4.7.4" />
          </svg>
          <span className="font-display text-white/100 pb-[38px]">Ripple turns this...</span>
        </div>
        <div className="w-fit flex flex-col items-center">
          <span className="font-display text-white/100 pt-[38px]">...into simulations like these</span>
          <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="12" height="38" fill="none" viewBox="0 0 12 38" className="rotate-180">
            <path fill="rgba(255,255,255,0.3)" d="M7.9 27.74a41 41 0 0 0 3.2 7.61c.58 1.07-.37 2.67-.96 1.6a44 44 0 0 1-3.2-7.47q.46-.88.96-1.74M4.7.4c1.59-1.42 2.4 1.27 3.04 3.25.88 2.77 1.45 5.74 2.1 8.68.29 1.37-1.01 1.93-1.3.58-.5-2.25-.93-4.53-1.54-6.7a55 55 0 0 0-1.09-3.38A59 59 0 0 0 7.9 27.74q-.5.86-.96 1.74A62 62 0 0 1 4.4 4.11c-1.58 3.67-2.47 8.3-3.08 12.64-.2 1.43-1.5.85-1.3-.57a67 67 0 0 1 1.87-9.14C2.52 4.84 3.35 1.62 4.7.4" />
          </svg>
        </div>
      </div>

      {/* Scenario cards grid */}
      <div className="max-w-[1100px] mx-auto px-8 pb-8">
        <div className="grid grid-cols-3 gap-5">
          {scenarios.map((scenario, idx) => (
            <button
              key={idx}
              onClick={() => handleScenarioClick(scenario)}
              disabled={loading}
              className="bg-[#0a0a0a] border border-white/[0.06] rounded-2xl overflow-hidden text-left group hover:border-white/[0.12] transition-all disabled:opacity-50"
            >
              <div className="relative h-40 overflow-hidden">
                <img
                  src={scenario.image}
                  alt={scenario.title}
                  className="w-full h-full object-cover opacity-40 group-hover:opacity-50 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
              </div>
              <div className="px-5 pt-3 pb-4">
                <h3 className="text-[15px] font-medium text-white/80 group-hover:text-[#E8E55E] transition-colors leading-snug">
                  {scenario.title}
                </h3>
                {scenario.subtitle && (
                  <span className="text-[11px] font-mono text-white/30 mt-1 block">{scenario.subtitle}</span>
                )}
              </div>
              <div className="mx-5 h-[1px] bg-white/[0.06]" />
              <div className="px-5 py-4 space-y-3">
                {scenario.nodes.map((node, nIdx) => (
                  <div key={nIdx} className="flex gap-2 text-[13px] text-white/50 leading-tight">
                    <span className="text-white/20 font-mono flex-shrink-0">{String(nIdx + 1).padStart(2, '0')}</span>
                    <span className="truncate">{node}</span>
                  </div>
                ))}
              </div>
            </button>
          ))}
        </div>
        <div className="flex justify-center pt-10 pb-6">
          <button className="px-6 py-2.5 border border-white/[0.08] rounded-full text-xs text-white/50 hover:text-white/70 hover:border-white/15 transition-all uppercase tracking-wider">
            More Scenarios
          </button>
        </div>
        <div className="flex justify-center pb-12">
          <svg className="w-8 h-8 opacity-[0.06]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="100" height="100" rx="22" fill="#0B0B0F" />
            <rect x="7" y="7" width="86" height="86" rx="20" fill="none" stroke="#3A3A45" strokeWidth="2" />
            <circle cx="50" cy="50" r="18" fill="none" stroke="#FFFFFF" strokeWidth="8" />
          </svg>
        </div>
      </div>
    </div>
  );
};

/* ─── Simulation Header ─── */

const SimHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { branches, activeBranchId, switchBranch } = useStore();
  const [branchDropdown, setBranchDropdown] = useState(false);

  return (
    <header className="flex-none flex justify-between items-center px-10 py-5 border-b border-white/[0.06] bg-black/90 backdrop-blur-sm z-50">
      <button onClick={() => navigate('/')} className="flex items-center gap-3 group">
        <svg className="w-7 h-7 group-hover:opacity-90 transition-opacity" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="0" width="100" height="100" rx="22" fill="#0B0B0F" />
          <rect x="7" y="7" width="86" height="86" rx="20" fill="none" stroke="#3A3A45" strokeWidth="2" />
          <circle cx="50" cy="50" r="18" fill="none" stroke="#FFFFFF" strokeWidth="8" />
        </svg>
        <div className="flex flex-col">
          <span className="text-sm font-semibold tracking-wide text-white/90 font-display">Ripple</span>
        </div>
      </button>
      <div className="flex items-center gap-3">
        {/* Branch selector */}
        {branches.length > 1 && (
          <div className="relative">
            <button
              onClick={() => setBranchDropdown(!branchDropdown)}
              className="inline-flex items-center gap-2 px-4 py-2 border border-white/10 rounded-full text-[11px] uppercase tracking-wide text-white/70 hover:border-white/30 transition-all"
            >
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 3v12" /><circle cx="18" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M18 9a9 9 0 0 1-9 9" /></svg>
              {activeBranchId === 'main' ? 'Mainline' : activeBranchId.slice(0, 14)}
              <svg className={`w-3 h-3 transition-transform ${branchDropdown ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
            </button>
            {branchDropdown && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden z-50 shadow-xl">
                {branches.map((b) => (
                  <button
                    key={b.branchId || b}
                    onClick={() => { switchBranch(b.branchId || b); setBranchDropdown(false); }}
                    className={`w-full text-left px-4 py-3 text-xs transition-colors ${(b.branchId || b) === activeBranchId ? 'bg-[#E8E55E]/10 text-[#E8E55E]' : 'text-white/60 hover:bg-white/5'}`}
                  >
                    {(b.branchId || b) === 'main' ? 'Mainline' : (b.name || b.branchId || b)}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        <nav className="flex gap-3">
          <Button onClick={() => navigate('/simulation')} active={location.pathname === '/simulation'}>
            Simulation
          </Button>
          <Button onClick={() => navigate('/detail')} active={location.pathname === '/detail'}>
            Event Detail
          </Button>
          <Button onClick={() => navigate('/inspector')} active={location.pathname === '/inspector'}>
            Inspector
          </Button>
        </nav>
      </div>
    </header>
  );
};

/* ─── Simulation Layout ─── */

const SimLayout = ({ children }) => (
  <div className="flex flex-col h-screen overflow-hidden">
    <SimHeader />
    <main className="flex-grow relative w-full h-full overflow-hidden">
      {children}
    </main>
  </div>
);

/* ─── Branch Panel (shared between Timeline and Scenario views) ─── */

const BranchPanel = ({ nodeId }) => {
  const { suggestions, suggestionsLoading, loadSuggestions, executeFork, forkLoading } = useStore();
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [customInput, setCustomInput] = useState('');
  const [expandedInfo, setExpandedInfo] = useState(null);

  useEffect(() => {
    if (nodeId) loadSuggestions(nodeId);
  }, [nodeId]);

  const handleRunBranch = () => {
    if (!nodeId) return;
    const selected = suggestions.find((s) => s.id === selectedBranch);
    const description = selected ? selected.forkDescription : customInput.trim();
    if (description) executeFork(nodeId, description);
  };

  const branchOptions = suggestions.length > 0 ? suggestions : [];

  return (
    <div className="mt-4 pt-4 border-t border-black/15" onClick={(e) => e.stopPropagation()}>
      <span className="text-[9px] font-mono uppercase tracking-wider opacity-40 block mb-3">Next possibilities</span>
      {suggestionsLoading ? (
        <div className="flex items-center justify-center py-6"><Spinner /></div>
      ) : (
        <div className="space-y-2">
          {branchOptions.map((opt) => (
            <div key={opt.id}>
              <button
                className={`w-full text-left p-3 rounded-xl transition-all text-xs leading-snug flex justify-between items-start gap-3 ${selectedBranch === opt.id ? 'bg-black/20 ring-1 ring-black/20' : 'bg-black/[0.06] hover:bg-black/12'}`}
                onClick={() => { setSelectedBranch(selectedBranch === opt.id ? null : opt.id); setCustomInput(''); }}
              >
                <div className="flex items-start gap-2.5 flex-1 min-w-0">
                  <div className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${selectedBranch === opt.id ? 'border-black bg-black' : 'border-black/30'}`}>
                    {selectedBranch === opt.id && <div className="w-1.5 h-1.5 rounded-full bg-[#E8E55E]" />}
                  </div>
                  <span className="opacity-80">{opt.label}</span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
                  <span className="text-[9px] font-mono opacity-40">{opt.probability}</span>
                  {opt.explanation && (
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors cursor-pointer ${expandedInfo === opt.id ? 'bg-black/20' : 'hover:bg-black/10'}`}
                      onClick={(e) => { e.stopPropagation(); setExpandedInfo(expandedInfo === opt.id ? null : opt.id); }}
                    >
                      <svg className="w-3 h-3 opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                    </span>
                  )}
                </div>
              </button>
              {expandedInfo === opt.id && opt.explanation && (
                <div className="mx-3 mt-1 mb-1 px-3 py-2.5 bg-black/[0.08] rounded-lg border border-black/[0.08]">
                  <p className="text-[11px] leading-relaxed opacity-50 italic">{opt.explanation}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <div className="mt-3 relative">
        <input
          type="text"
          value={customInput}
          onChange={(e) => { setCustomInput(e.target.value); setSelectedBranch(null); }}
          placeholder="Describe a custom scenario..."
          className="w-full bg-black/[0.08] text-black placeholder-black/30 text-xs rounded-xl px-3.5 py-3 border border-black/10 focus:outline-none focus:border-black/30 focus:ring-1 focus:ring-black/15 transition-all"
        />
        {(selectedBranch !== null || customInput.trim()) && (
          <button
            onClick={handleRunBranch}
            disabled={forkLoading}
            className="mt-2.5 w-full py-2.5 bg-black text-[#E8E55E] text-[10px] uppercase tracking-wider font-semibold rounded-xl hover:bg-black/80 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {forkLoading ? <><Spinner className="w-3 h-3 border-[#E8E55E]/30 border-t-[#E8E55E]" /> Generating...</> : 'Run branch'}
          </button>
        )}
      </div>
    </div>
  );
};

/* ─── Timeline View ─── */

const TimelineView = () => {
  const navigate = useNavigate();
  const { timeline, selectedNodeId, selectedNode, renderPack, selectNode, narrationText, narrationLoading, loadNarration, loading } = useStore();
  const [branchOpenNodeId, setBranchOpenNodeId] = useState(null);

  useEffect(() => {
    // Auto-select first node if none selected
    if (!selectedNodeId && timeline.length > 0) {
      selectNode(timeline[0].id);
    }
  }, [timeline]);

  if (loading || timeline.length === 0) {
    return (
      <SimLayout>
        <div className="w-full h-full flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Spinner className="w-8 h-8" />
            <span className="text-sm text-white/40">Initializing simulation...</span>
          </div>
        </div>
      </SimLayout>
    );
  }

  const selectedIdx = timeline.findIndex((n) => n.id === selectedNodeId);
  const scrubberPosition = timeline.length > 1 ? ((selectedIdx >= 0 ? selectedIdx : 0) / (timeline.length - 1)) * 100 : 50;

  const activeTitle = selectedNode?.eventSpec?.title || timeline[selectedIdx]?.title || 'Select an event';
  const causalVars = selectedNode?.worldState?.causalVars || {};

  const bgImage = renderPack?.anchorImageUrl || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop';

  return (
    <SimLayout>
      <div className="w-full h-full flex transition-opacity duration-300">
        {/* Left panel - clip viewer */}
        <div className="flex-grow h-full relative border-r border-white/[0.06] bg-black overflow-hidden group">
          <div className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay" style={{ backgroundImage: `url('${bgImage}')` }} />
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

          <div className="absolute top-8 left-8 flex gap-4">
            <Tag className="bg-black/70 backdrop-blur border-white/10 text-white/70">Live Feed</Tag>
            <Tag className="bg-black/70 backdrop-blur border-white/10 text-white/70 font-mono">NODE {String(selectedIdx + 1).padStart(2, '0')} / {String(timeline.length).padStart(2, '0')}</Tag>
          </div>

          {/* Narrate button */}
          <div className="absolute top-8 right-8">
            <button
              onClick={() => selectedNodeId && loadNarration(selectedNodeId)}
              disabled={narrationLoading}
              className="px-4 py-2 border border-white/10 rounded-full text-[10px] uppercase tracking-wider text-white/50 hover:text-white/80 hover:border-white/30 transition-all flex items-center gap-2"
            >
              {narrationLoading ? <Spinner className="w-3 h-3" /> : (
                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /></svg>
              )}
              Narrate
            </button>
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <button className="w-20 h-20 rounded-full border border-white/15 flex items-center justify-center hover:bg-white/5 hover:border-white/30 transition-all duration-300 group-hover:scale-110">
              <svg className="w-8 h-8 fill-white/80 ml-1" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            </button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-8" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 100%)' }}>
            {/* Narration overlay */}
            {narrationText && (
              <div className="mb-6 bg-black/70 backdrop-blur-md rounded-xl p-4 border border-white/[0.06]">
                <p className="text-sm text-white/70 italic leading-relaxed">{narrationText}</p>
              </div>
            )}
            <div className="flex justify-between items-end mb-4">
              <div>
                <h2 className="text-3xl font-light mb-1 text-white" style={{ textShadow: '0 0 30px rgba(232, 229, 94, 0.25)' }}>{activeTitle}</h2>
                <p className="text-sm text-white/30 font-mono uppercase tracking-wider">
                  {selectedNode?.timestamp ? formatTimestamp(selectedNode.timestamp) : ''} &bull; Node #{String(selectedIdx + 1).padStart(2, '0')}
                </p>
              </div>
              <div className="flex gap-6">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] uppercase text-white/25 mb-1.5">Logistics</span>
                  <div className="w-32 h-[3px] bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-[#E8E55E]/80 transition-all" style={{ width: `${causalVars.logistics || 50}%` }} /></div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] uppercase text-white/25 mb-1.5">Tech</span>
                  <div className="w-32 h-[3px] bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-white/60 transition-all" style={{ width: `${causalVars.techLevel || 50}%` }} /></div>
                </div>
              </div>
            </div>
            <div className="w-full h-12 flex items-center gap-4">
              <span className="text-xs font-mono text-white/25">{formatTimestamp(timeline[0]?.timestamp)}</span>
              <div className="flex-grow h-[1px] bg-white/10 relative cursor-pointer">
                <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-[#E8E55E] rounded-full transition-all" style={{ left: `${scrubberPosition}%`, boxShadow: '0 0 12px rgba(232, 229, 94, 0.6)' }} />
                <div className="absolute top-1/2 -translate-y-1/2 left-0 h-[2px] bg-white/40 transition-all" style={{ width: `${scrubberPosition}%` }} />
              </div>
              <span className="text-xs font-mono text-white/25">{formatTimestamp(timeline[timeline.length - 1]?.timestamp)}</span>
            </div>
          </div>
        </div>

        {/* Right panel - event stream */}
        <div className="w-[380px] flex-none h-full bg-black border-l border-white/[0.06] flex flex-col">
          <div className="p-6 border-b border-white/[0.06] flex justify-between items-center bg-black z-10">
            <h3 className="text-sm font-medium uppercase tracking-wider text-white/80">Event Stream</h3>
            <span className="text-xs text-white/25">{timeline.length} events</span>
          </div>
          <div className="flex-grow overflow-y-auto p-6 relative">
            <div className="absolute left-[29px] top-10 bottom-0 w-[1px] bg-white/[0.06] z-0" />
            <div className="space-y-6 relative z-10">
              {timeline.map((node, idx) => {
                const isActive = node.id === selectedNodeId;
                const isPast = idx < selectedIdx;
                const isFuture = idx > selectedIdx;
                const opacity = isActive ? 1 : isPast ? 0.5 : 0.7;
                const dotColor = isActive ? 'bg-[#E8E55E]' : isPast ? 'bg-white/30' : 'border border-white/20 bg-black';
                const isBranchOpen = branchOpenNodeId === node.id;

                return (
                  <div key={node.id} className="flex gap-4 transition-opacity" style={{ opacity }}>
                    <div className={`w-2.5 h-2.5 rounded-full mt-5 flex-shrink-0 z-20 ${dotColor}`} style={isActive ? { boxShadow: '0 0 10px #E8E55E', border: '2px solid #000' } : { border: '2px solid #000' }} />
                    <Card
                      variant={isActive ? 'yellow' : 'default'}
                      className={`${isActive ? 'p-5' : 'p-4'} w-full cursor-pointer ${isFuture ? 'border-dashed !border-white/[0.08]' : ''} ${isActive ? 'hover:scale-[1.02] transition-transform' : 'hover:bg-white/[0.03]'}`}
                      onClick={() => isActive ? navigate('/detail') : selectNode(node.id)}
                    >
                      <div className={`flex justify-between items-start ${isActive ? 'mb-3 border-b pb-3' : 'mb-2'}`} style={isActive ? { borderColor: 'rgba(0,0,0,0.15)' } : {}}>
                        <span className={`text-[10px] font-mono ${isActive ? 'opacity-60' : 'text-white/30'}`}>{formatTimestamp(node.timestamp)}</span>
                        {isActive && <Tag className="border-black/20 bg-black/10 text-[9px]">ACTIVE NODE</Tag>}
                        {!isActive && isPast && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                        {!isActive && isFuture && <div className="w-2 h-2 rounded-full border border-white/20" />}
                      </div>
                      <h4 className={`${isActive ? 'font-semibold text-lg' : 'font-medium text-sm'} ${isFuture ? 'text-white/30' : ''} leading-tight mb-1`}>{node.title || node.eventSpec?.title}</h4>
                      <p className={`text-xs leading-relaxed ${isActive ? 'opacity-70 mb-4' : isFuture ? 'text-white/15' : 'text-white/30'}`}>{node.description || node.eventSpec?.description || ''}</p>
                      {isActive && (
                        <>
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-mono opacity-50">{node.isUserFork ? 'USER FORK' : `NODE ${String(idx + 1).padStart(2, '0')}`}</span>
                            <div className="flex gap-2">
                              <button
                                className={`h-6 px-2.5 rounded-full border flex items-center justify-center transition-all text-[9px] uppercase tracking-wider font-medium ${isBranchOpen ? 'border-black/40 bg-black/15' : 'border-black/20 hover:bg-black/10'}`}
                                onClick={(e) => { e.stopPropagation(); setBranchOpenNodeId(isBranchOpen ? null : node.id); }}
                              >
                                <svg className={`w-2.5 h-2.5 mr-1 transition-transform duration-200 ${isBranchOpen ? 'rotate-90' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 3v12" /><circle cx="18" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M18 9a9 9 0 0 1-9 9" /></svg>
                                Branch
                              </button>
                              <button className="w-6 h-6 rounded-full border border-black/20 flex items-center justify-center hover:bg-black/10 transition-colors" onClick={(e) => { e.stopPropagation(); navigate('/detail'); }}>
                                <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                              </button>
                            </div>
                          </div>
                          {isBranchOpen && <BranchPanel nodeId={node.id} />}
                        </>
                      )}
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </SimLayout>
  );
};

/* ─── Detail View ─── */

const DetailView = () => {
  const navigate = useNavigate();
  const { selectedNode, selectedNodeForks, suggestions, loadSuggestions, selectedNodeId, executeFork, forkLoading, switchBranch } = useStore();
  const [selectedPath, setSelectedPath] = useState(0);
  const [codeInput, setCodeInput] = useState('');

  useEffect(() => {
    if (selectedNodeId && suggestions.length === 0) {
      loadSuggestions(selectedNodeId);
    }
  }, [selectedNodeId]);

  const node = selectedNode;
  const causalVars = node?.worldState?.causalVars || {};
  const eventSpec = node?.eventSpec || {};

  // Build paths from existing forks or suggestions
  const pathLabels = ['A', 'B', 'C'];
  const paths = (suggestions.length > 0 ? suggestions : selectedNodeForks || []).slice(0, 3).map((item, i) => ({
    id: pathLabels[i],
    probability: item.probability || `${item.branchPriors?.plausibility || 50}%`,
    title: item.label || item.forkEventSpec?.title || item.name || `Branch ${i + 1}`,
    description: item.description || item.forkDescription || '',
    forkDescription: item.forkDescription || item.description || '',
    branchId: item.branchId,
  }));

  const handleSimulateBranch = () => {
    if (codeInput.trim() && selectedNodeId) {
      executeFork(selectedNodeId, codeInput.trim());
    }
  };

  const handlePathClick = (path, idx) => {
    setSelectedPath(idx);
    if (path.branchId) {
      switchBranch(path.branchId);
      navigate('/simulation');
    }
  };

  const causalVarRows = Object.entries(causalVars).map(([key, value]) => ({
    label: getCausalVarLabel(key),
    value: `${value}%`,
    color: getCausalVarColor(key, value),
  }));

  return (
    <SimLayout>
      <div className="absolute inset-0 z-40 flex items-center justify-center p-8 overflow-y-auto bg-black/95 backdrop-blur-lg">
        <div className="w-full max-w-5xl">
          <button onClick={() => navigate('/simulation')} className="mb-6 flex items-center gap-2 text-xs text-white/30 hover:text-white transition-colors uppercase tracking-[0.15em]">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
            Back to Timeline
          </button>

          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-8 space-y-6">
              <Card className="p-8 bg-[#0a0a0a] border-white/[0.08]">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Tag className="text-[#E8E55E] border-[#E8E55E]/50">{(eventSpec.category || 'EVENT').toUpperCase()}</Tag>
                      <span className="text-xs font-mono text-white/25">{formatTimestamp(node?.timestamp)}</span>
                    </div>
                    <h1 className="text-4xl font-light tracking-tight mb-2">{eventSpec.title || 'Event Detail'}</h1>
                  </div>
                  <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#E8E55E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-xs uppercase text-white/25 mb-3 tracking-wider">World State Snapshot</h3>
                    <div className="space-y-3">
                      {causalVarRows.map((row, i) => (
                        <div key={i} className="flex justify-between items-center text-sm border-b border-white/[0.05] pb-2">
                          <span className="text-white/30">{row.label}</span>
                          <span className={row.color}>{row.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs uppercase text-white/25 mb-3 tracking-wider">Causal Explanation</h3>
                    <p className="text-sm text-white/40 leading-relaxed">
                      {eventSpec.description || 'No description available.'}
                    </p>
                  </div>
                </div>

                <div className="relative h-48 rounded-lg overflow-hidden border border-white/[0.06] mb-6 group cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
                  <img src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2000&auto=format&fit=crop" className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700" alt="Data Vis" />
                  <div className="absolute bottom-4 left-4 z-20">
                    <span className="text-xs font-mono text-[#E8E55E]/80 mb-1 block">WORLD STATE</span>
                    <p className="text-sm font-medium text-white/80">Causal Variable Analysis</p>
                  </div>
                </div>
              </Card>

              {paths.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium uppercase tracking-wider mb-4 flex items-center gap-2 text-white/70">
                    Select Ripple Effect Path
                    <span className="flex-grow h-[1px] bg-white/[0.06]" />
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    {paths.map((path, idx) => (
                      <button key={path.id} onClick={() => handlePathClick(path, idx)} className={`bg-[#0a0a0a] border rounded-2xl p-5 text-left hover:bg-white/[0.03] group transition-all ${selectedPath === idx ? 'ring-1 ring-[#E8E55E]/60 border-[#E8E55E]/20' : 'border-white/[0.06]'}`}>
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-[10px] font-mono text-white/25">PATH {path.id}</span>
                          <span className="text-[10px] text-[#E8E55E]">{path.probability}</span>
                        </div>
                        <h4 className="font-medium text-white mb-2 group-hover:text-[#E8E55E] transition-colors">{path.title}</h4>
                        <p className="text-xs text-white/25 leading-relaxed line-clamp-2">{path.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="col-span-4 flex flex-col h-full">
              <Card className="p-6 h-full flex flex-col bg-[#0a0a0a]">
                <h3 className="text-sm font-medium mb-4">Manual Override</h3>
                <p className="text-xs text-white/25 mb-4">Describe an alternate scenario to fork from this event.</p>
                <textarea
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value)}
                  className="flex-grow w-full bg-black border border-white/[0.06] rounded-lg p-4 text-sm text-white resize-none focus:border-[#E8E55E]/50 transition-colors mb-4 font-mono leading-relaxed placeholder:text-white/15"
                  placeholder={'// Describe your changes...\nExample: "Germany surrenders in 1943"\n         "Churchill is assassinated"\n         "Japan never attacks Pearl Harbor"'}
                />
                <div className="flex justify-between items-center pt-4 border-t border-white/[0.06]">
                  <span className="text-xs text-white/20">{node?.branchId === 'main' ? 'Mainline' : 'Branch'}</span>
                  <button
                    onClick={handleSimulateBranch}
                    disabled={forkLoading || !codeInput.trim()}
                    className="bg-[#E8E55E] text-black text-xs font-semibold uppercase tracking-wider py-2 px-4 rounded-full hover:bg-[#f0ed70] transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {forkLoading ? <><Spinner className="w-3 h-3 border-black/30 border-t-black" /> Simulating...</> : 'Simulate Branch'}
                  </button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </SimLayout>
  );
};

/* ─── Inspector View ─── */

const InspectorView = () => {
  const { selectedNode } = useStore();
  const entities = selectedNode?.worldState?.entities || {};
  const causalVars = selectedNode?.worldState?.causalVars || {};
  const facts = selectedNode?.worldState?.facts || {};

  const factions = Object.entries(entities).filter(([, e]) => e.type === 'faction').map(([id, e]) => ({
    code: id.slice(0, 3).toUpperCase(),
    name: e.name,
    status: e.status,
    percent: statusToPercent(e.status),
    color: statusBarColor(statusToPercent(e.status)),
  }));

  const persons = Object.entries(entities).filter(([, e]) => e.type === 'person').map(([id, e]) => ({
    id,
    name: e.name,
    role: e.properties?.role || e.status || 'Unknown',
    initials: e.name ? e.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : id.slice(0, 2).toUpperCase(),
    status: e.status,
  }));

  const escalation = causalVars.escalation || 50;
  const escalationLevel = escalation >= 80 ? 'CRITICAL' : escalation >= 60 ? 'ELEVATED' : escalation >= 40 ? 'GUARDED' : 'LOW';
  const defconLevel = escalation >= 80 ? 1 : escalation >= 60 ? 2 : escalation >= 40 ? 3 : 4;
  const gaugeOffset = 339.292 * (1 - escalation / 100);

  return (
    <SimLayout>
      <div className="w-full h-full overflow-y-auto p-10">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex justify-between items-end mb-10 pb-6 border-b border-white/[0.06]">
            <div>
              <h1 className="text-3xl font-light mb-2">World State Inspector</h1>
              <p className="text-sm text-white/25">
                Snapshot: {selectedNode?.timestamp || 'N/A'} &bull; {selectedNode?.eventSpec?.title || 'No event selected'}
              </p>
            </div>
            <div className="flex gap-6">
              <div className="text-right">
                <span className="block text-[10px] text-white/25 uppercase tracking-wider">Factions</span>
                <span className="text-xl font-mono text-white/80">{factions.length}</span>
              </div>
              <div className="w-[1px] h-10 bg-white/[0.06]" />
              <div className="text-right">
                <span className="block text-[10px] text-white/25 uppercase tracking-wider">Active Facts</span>
                <span className="text-xl font-mono text-[#E8E55E]">{Object.keys(facts).length}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6 pb-10">
            {/* Left column */}
            <div className="col-span-5 flex flex-col gap-6">
              <Card className="p-0 overflow-hidden h-96 relative group">
                <div className="absolute inset-0 bg-black">
                  <img src="https://images.unsplash.com/photo-1589519160732-5796a59b2521?q=80&w=2574&auto=format&fit=crop" className="w-full h-full object-cover opacity-15 grayscale invert" alt="Map" />
                  <div className="absolute inset-0 bg-blue-900/5 mix-blend-overlay" />
                  {factions.slice(0, 4).map((f, i) => {
                    const positions = [{ top: '25%', left: '25%' }, { bottom: '33%', right: '33%' }, { top: '50%', left: '50%' }, { top: '35%', right: '25%' }];
                    const pos = positions[i];
                    const color = f.percent <= 20 ? 'bg-red-500' : f.percent >= 60 ? 'bg-[#E8E55E]' : 'bg-white/80';
                    return (
                      <React.Fragment key={f.code}>
                        {f.percent <= 20 && <div className={`absolute w-3 h-3 ${color} rounded-full animate-ping`} style={pos} />}
                        <div className={`absolute w-3 h-3 ${color} rounded-full border-2 border-black`} style={pos} />
                      </React.Fragment>
                    );
                  })}
                </div>
                <div className="absolute top-4 left-4"><Tag className="bg-black/80 backdrop-blur border-white/10 text-white/60">Geopolitical Heatmap</Tag></div>
                <div className="absolute bottom-4 left-4 flex flex-col gap-2 p-3 bg-black/80 backdrop-blur rounded border border-white/[0.06] text-[10px] text-white/50">
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#E8E55E]" />High Tension</div>
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-white/80" />Stable</div>
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500" />Conflict</div>
                </div>
              </Card>
              <Card className="p-6">
                <h3 className="text-sm font-medium mb-4 text-white/80">Faction Status</h3>
                <div className="space-y-4">
                  {factions.map((rel, idx) => (
                    <div key={idx} className="flex justify-between items-center group cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded bg-white/5 flex items-center justify-center text-[10px] text-white/40">{rel.code}</div>
                        <div>
                          <span className="text-sm text-white/60 block">{rel.name}</span>
                          <span className="text-[10px] text-white/25">{rel.status}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-[3px] bg-white/5 rounded-full overflow-hidden"><div className={`h-full ${rel.color}`} style={{ width: `${rel.percent}%` }} /></div>
                        <span className="text-xs font-mono w-8 text-right text-white/40">{rel.percent}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Middle column */}
            <div className="col-span-4 flex flex-col gap-6">
              <Card className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-sm font-medium text-white/80">Escalation Level</h3>
                  <svg className="w-4 h-4 text-white/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                </div>
                <div className="flex justify-center mb-6 relative">
                  <svg width="120" height="120" viewBox="0 0 120 120" className="transform -rotate-90">
                    <circle cx="60" cy="60" r="54" fill="none" stroke="#1a1a1a" strokeWidth="8" />
                    <circle cx="60" cy="60" r="54" fill="none" stroke="#E8E55E" strokeWidth="8" strokeDasharray="339.292" strokeDashoffset={gaugeOffset} className="transition-all duration-700" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-semibold">DEF {defconLevel}</span>
                    <span className="text-[10px] text-white/25">{escalationLevel}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/[0.03] p-3 rounded"><span className="block text-[10px] text-white/25 mb-1">ESCALATION</span><span className="text-sm font-mono text-white/70">{escalation}</span></div>
                  <div className="bg-white/[0.03] p-3 rounded"><span className="block text-[10px] text-white/25 mb-1">MORALE</span><span className="text-sm font-mono text-[#E8E55E]">{causalVars.morale || 50}</span></div>
                </div>
              </Card>
              <Card className="p-6 flex-grow">
                <h3 className="text-sm font-medium mb-4 text-white/80">Causal Variables</h3>
                <div className="space-y-6">
                  {Object.entries(causalVars).map(([key, value]) => (
                    <div key={key}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-white/30">{getCausalVarLabel(key)}</span>
                        <span className={value >= 70 ? 'text-[#E8E55E]' : value <= 30 ? 'text-red-400' : 'text-white/50'}>{value}</span>
                      </div>
                      <div className="w-full h-[3px] bg-white/[0.04] rounded-full overflow-hidden"><div className={`h-full transition-all duration-700 ${value >= 70 ? 'bg-[#E8E55E]' : 'bg-white/60'}`} style={{ width: `${value}%` }} /></div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Right column */}
            <div className="col-span-3 flex flex-col gap-6">
              <Card className="p-6">
                <h3 className="text-sm font-medium mb-4 text-white/80">Key Figures</h3>
                <div className="space-y-4">
                  {persons.map((person) => (
                    <div key={person.id} className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs ${person.status === 'dead' ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-white/40'}`}>{person.initials}</div>
                      <div>
                        <div className="text-sm font-medium text-white/70">{person.name}</div>
                        <div className="text-[10px] text-white/25">{person.role} &bull; {person.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
              <Card className="p-6 flex-grow bg-white/[0.02] border-white/[0.04]">
                <h3 className="text-sm font-medium mb-4 text-white/50">Intelligence</h3>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-2 border border-white/[0.06] rounded">
                    <span className="text-xl font-light block mb-1 text-white/70">{causalVars.intelligence || 50}</span>
                    <span className="text-[9px] text-white/20 uppercase">Intel Score</span>
                  </div>
                  <div className="p-2 border border-white/[0.06] rounded">
                    <span className="text-xl font-light block mb-1 text-white/70">{causalVars.techLevel || 50}</span>
                    <span className="text-[9px] text-white/20 uppercase">Tech Level</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/[0.06]">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-white/30">Logistics</span>
                    <span className={`text-xs ${(causalVars.logistics || 50) <= 40 ? 'text-red-400' : 'text-white/50'}`}>{causalVars.logistics || 50}%</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </SimLayout>
  );
};

/* ─── Scenario View (initializes session then redirects) ─── */

const ScenarioView = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { sessionId, initScenario, selectNode, timeline } = useStore();
  const scenario = scenarios.find((s) => s.slug === slug);

  useEffect(() => {
    const init = async () => {
      if (!sessionId) {
        await initScenario();
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (sessionId && timeline.length > 0 && scenario) {
      // Select the node matching the scenario's startNode index
      const targetIdx = Math.min(scenario.startNode || 0, timeline.length - 1);
      const targetNode = timeline[targetIdx];
      if (targetNode) selectNode(targetNode.id);
      navigate('/simulation', { replace: true });
    }
  }, [sessionId, timeline.length]);

  if (!scenario) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-white/60">
        <h1 className="text-2xl font-light mb-4">Scenario not found</h1>
        <button onClick={() => navigate('/')} className="text-[#E8E55E] text-sm hover:underline">Back to scenarios</button>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-4">
        <Spinner className="w-8 h-8" />
        <span className="text-sm text-white/40">Loading {scenario.title}...</span>
      </div>
    </div>
  );
};

/* ─── App Root ─── */

const App = () => {
  useEffect(() => {
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Public+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);
    return () => document.head.removeChild(fontLink);
  }, []);

  return (
    <Router basename="/">
      <Routes>
        <Route path="/" element={<LandingView />} />
        <Route path="/scenario/:slug" element={<ScenarioView />} />
        <Route path="/simulation" element={<TimelineView />} />
        <Route path="/detail" element={<DetailView />} />
        <Route path="/inspector" element={<InspectorView />} />
      </Routes>
    </Router>
  );
};

export default App;
