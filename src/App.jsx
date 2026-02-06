import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';
import useStore from './store/useStore.js';
import { streamGeneration } from './api/generate.js';

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
    slug: 'pearl-harbor',
    image: 'https://images.unsplash.com/photo-1580086319619-3ed498161c77?q=80&w=600&auto=format&fit=crop',
    title: 'Pearl Harbor — The Decision Room',
    subtitle: 'December 7, 1941',
    startNode: 4,
    nodes: [
      'Japanese fleet crosses the Pacific undetected',
      'First wave strikes Battleship Row at 07:48',
      'USS Arizona explodes, 1,177 crew lost',
      'FDR convenes emergency war cabinet',
      '"A date which will live in infamy" speech drafted',
      'Congress declares war — one dissenting vote',
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
  const { loading, error, initScenario, config, setConfig, setUserPrompt } = useStore();
  const handleScenarioClick = (scenario) => {
    setUserPrompt(scenario.title); // generate with Claude for this scenario
    navigate('/generating');
  };

  const handleSubmit = () => {
    setUserPrompt(query.trim()); // custom prompt or empty = seed
    navigate('/generating');
  };

  return (
    <div className="w-full min-h-screen bg-black overflow-y-auto">
      {loading && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center">
          <div className="flex flex-col items-center gap-6">
            <Spinner className="w-10 h-10" />
            <div className="text-center">
              <h3 className="text-lg text-white/80 mb-2">Generating Scenario</h3>
              <p className="text-sm text-white/40">Building world state and timeline events...</p>
              <p className="text-xs text-white/20 mt-2">This typically takes 15-30 seconds</p>
            </div>
          </div>
        </div>
      )}
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
            <button
              key={opt.id}
              className={`w-full text-left p-3 rounded-xl transition-all text-xs leading-snug flex justify-between items-start gap-3 ${selectedBranch === opt.id ? 'bg-black/20 ring-1 ring-black/20' : 'bg-black/[0.06] hover:bg-black/12'}`}
              onClick={() => { setSelectedBranch(selectedBranch === opt.id ? null : opt.id); setCustomInput(''); }}
            >
              <div className="flex items-start gap-2.5 flex-1 min-w-0">
                <div className={`w-3.5 h-3.5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${selectedBranch === opt.id ? 'border-black bg-black' : 'border-black/30'}`}>
                  {selectedBranch === opt.id && <div className="w-1.5 h-1.5 rounded-full bg-[#E8E55E]" />}
                </div>
                <span className="opacity-80">{opt.label}</span>
              </div>
              <span className="text-[9px] font-mono opacity-40 flex-shrink-0 mt-0.5">{opt.probability}</span>
            </button>
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
  const { timeline, selectedNodeId, selectedNode, selectNode, narrationText, narrationLoading, loadNarration, loading } = useStore();
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

  const bgImage = selectedNode?.renderPack?.anchorImageUrl || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop';

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

  const deltas = selectedNode?.deltas || null;

  const entityEntries = Object.entries(entities);
  const causalVarEntries = Object.entries(causalVars);
  const factEntries = Object.entries(facts);

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
                <span className="block text-[10px] text-white/25 uppercase tracking-wider">Entities</span>
                <span className="text-xl font-mono text-white/80">{entityEntries.length}</span>
              </div>
              <div className="w-[1px] h-10 bg-white/[0.06]" />
              <div className="text-right">
                <span className="block text-[10px] text-white/25 uppercase tracking-wider">Causal Vars</span>
                <span className="text-xl font-mono text-white/80">{causalVarEntries.length}</span>
              </div>
              <div className="w-[1px] h-10 bg-white/[0.06]" />
              <div className="text-right">
                <span className="block text-[10px] text-white/25 uppercase tracking-wider">Facts</span>
                <span className="text-xl font-mono text-[#E8E55E]">{factEntries.length}</span>
              </div>
            </div>
          </div>

          {/* Deltas */}
          {deltas && (
            <div className="mb-6">
              <Card className="p-6">
                <h3 className="text-sm font-medium mb-4 text-white/80">Deltas <span className="text-white/25 font-normal">— changes at this event</span></h3>
                <div className="grid grid-cols-3 gap-6">
                  {deltas.entityChanges && deltas.entityChanges.length > 0 && (
                    <div>
                      <h4 className="text-[10px] uppercase tracking-wider text-white/25 mb-3">Entity Changes</h4>
                      <div className="space-y-2">
                        {deltas.entityChanges.map((change, i) => (
                          <div key={i} className="p-2.5 rounded bg-white/[0.02] border border-white/[0.06]">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[11px] font-medium text-white/60">{change.entityId}</span>
                              <span className="text-[10px] text-white/20 font-mono">.{change.field}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px]">
                              <span className="text-red-400/60">{String(change.oldValue ?? 'null')}</span>
                              <span className="text-white/15">→</span>
                              <span className="text-emerald-400/60">{String(change.newValue ?? 'null')}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {deltas.factChanges && deltas.factChanges.length > 0 && (
                    <div>
                      <h4 className="text-[10px] uppercase tracking-wider text-white/25 mb-3">Fact Changes</h4>
                      <div className="space-y-2">
                        {deltas.factChanges.map((change, i) => (
                          <div key={i} className="p-2.5 rounded bg-white/[0.02] border border-white/[0.06]">
                            <span className="text-[11px] font-medium text-white/60 block mb-1">{change.factId}</span>
                            {change.oldValue === null ? (
                              <div className="text-[10px] text-emerald-400/60">+ {typeof change.newValue === 'object' ? change.newValue.statement : String(change.newValue)}</div>
                            ) : change.newValue === null ? (
                              <div className="text-[10px] text-red-400/60">- {typeof change.oldValue === 'object' ? change.oldValue.statement : String(change.oldValue)}</div>
                            ) : (
                              <div className="space-y-1 text-[10px]">
                                <div className="text-red-400/60">- {typeof change.oldValue === 'object' ? change.oldValue.statement : String(change.oldValue)}</div>
                                <div className="text-emerald-400/60">+ {typeof change.newValue === 'object' ? change.newValue.statement : String(change.newValue)}</div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {deltas.causalVarChanges && deltas.causalVarChanges.length > 0 && (
                    <div>
                      <h4 className="text-[10px] uppercase tracking-wider text-white/25 mb-3">Causal Var Changes</h4>
                      <div className="space-y-2">
                        {deltas.causalVarChanges.map((change, i) => (
                          <div key={i} className="p-2.5 rounded bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
                            <span className="text-[11px] font-mono text-white/60">{change.varName}</span>
                            <span className={`text-sm font-mono ${change.delta > 0 ? 'text-emerald-400/70' : 'text-red-400/70'}`}>
                              {change.delta > 0 ? '+' : ''}{change.delta}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}

          <div className="grid grid-cols-12 gap-6 pb-10">
            {/* Entities */}
            <div className="col-span-5 flex flex-col gap-6">
              <Card className="p-6">
                <h3 className="text-sm font-medium mb-4 text-white/80">Entities</h3>
                <div className="space-y-4">
                  {entityEntries.map(([id, entity]) => (
                    <div key={id} className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.06]">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-white/70">{entity.name || id}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/[0.06] text-white/30">{entity.type}</span>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full border border-white/10 text-white/40">{entity.status}</span>
                      </div>
                      {entity.properties && Object.keys(entity.properties).length > 0 && (
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                          {Object.entries(entity.properties).map(([key, val]) => (
                            <span key={key} className="text-[10px] text-white/25">
                              <span className="text-white/15">{key}:</span> {String(val)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Causal Variables */}
            <div className="col-span-4 flex flex-col gap-6">
              <Card className="p-6">
                <h3 className="text-sm font-medium mb-4 text-white/80">Causal Variables</h3>
                <div className="space-y-6">
                  {causalVarEntries.map(([key, value]) => (
                    <div key={key}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-white/40 font-mono">{key}</span>
                        <span className={value >= 70 ? 'text-[#E8E55E]' : value <= 30 ? 'text-red-400' : 'text-white/50'}>{value}</span>
                      </div>
                      <div className="w-full h-[3px] bg-white/[0.04] rounded-full overflow-hidden">
                        <div className={`h-full transition-all duration-700 ${value >= 70 ? 'bg-[#E8E55E]' : value <= 30 ? 'bg-red-400' : 'bg-white/60'}`} style={{ width: `${value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Facts */}
            <div className="col-span-3 flex flex-col gap-6">
              <Card className="p-6">
                <h3 className="text-sm font-medium mb-4 text-white/80">Facts</h3>
                <div className="space-y-3">
                  {factEntries.map(([id, fact]) => (
                    <div key={id} className="p-2.5 rounded bg-white/[0.02] border border-white/[0.06]">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[9px] uppercase tracking-wider ${fact.type === 'hard' ? 'text-[#E8E55E]' : 'text-white/30'}`}>{fact.type}</span>
                        <span className="text-[9px] text-white/20">{fact.confidence}%</span>
                      </div>
                      <p className="text-[11px] text-white/50 leading-relaxed">{fact.statement}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

          </div>
        </div>
      </div>
    </SimLayout>
  );
};

/* ─── Generating View (dramatic seed data reveal) ─── */

const GEN_FACTIONS = [
  { code: 'GER', name: 'Nazi Germany', status: 'aggressive', leader: 'Hitler' },
  { code: 'UK', name: 'United Kingdom', status: 'at-war', leader: 'Churchill' },
  { code: 'FRA', name: 'France', status: 'at-war', leader: 'Daladier' },
  { code: 'USSR', name: 'Soviet Union', status: 'neutral', leader: 'Stalin' },
  { code: 'USA', name: 'United States', status: 'neutral', leader: 'Roosevelt' },
  { code: 'JPN', name: 'Empire of Japan', status: 'aggressive', leader: 'Hirohito' },
  { code: 'POL', name: 'Poland', status: 'invaded', leader: null },
  { code: 'ITA', name: 'Fascist Italy', status: 'aggressive', leader: 'Mussolini' },
];

const GEN_PERSONS = [
  { name: 'Adolf Hitler', role: 'Führer', nation: 'Germany' },
  { name: 'Winston Churchill', role: 'Prime Minister', nation: 'United Kingdom' },
  { name: 'Franklin D. Roosevelt', role: 'President', nation: 'United States' },
  { name: 'Joseph Stalin', role: 'General Secretary', nation: 'Soviet Union' },
  { name: 'Benito Mussolini', role: 'Il Duce', nation: 'Italy' },
];

const GEN_FACTS = [
  { id: 'war-europe', text: 'Germany has invaded Poland, starting World War II', type: 'hard' },
  { id: 'uk-fra-alliance', text: 'UK and France are allied against Germany', type: 'hard' },
  { id: 'molotov-pact', text: 'Germany and USSR have a non-aggression pact', type: 'hard' },
  { id: 'us-neutral', text: 'The United States maintains official neutrality', type: 'hard' },
  { id: 'axis-forming', text: 'Germany, Italy, and Japan forming Axis alliance', type: 'soft' },
  { id: 'blitzkrieg', text: 'Germany employs blitzkrieg rapid-assault tactics', type: 'hard' },
  { id: 'atlantic', text: 'Atlantic trade routes vital for Allied supply', type: 'soft' },
  { id: 'japan-china', text: 'Japan engaged in war with China since 1937', type: 'hard' },
];

const GEN_CAUSAL_VARS = [
  { key: 'escalation', label: 'Escalation', value: 60 },
  { key: 'logistics', label: 'Logistics', value: 50 },
  { key: 'intelligence', label: 'Intelligence', value: 40 },
  { key: 'morale', label: 'Morale', value: 65 },
  { key: 'techLevel', label: 'Tech Level', value: 45 },
];

const GEN_EVENTS = [
  { date: '1939.09.01', title: 'Invasion of Poland', cat: 'military' },
  { date: '1940.06.22', title: 'Fall of France', cat: 'military' },
  { date: '1940.09.15', title: 'Battle of Britain', cat: 'military' },
  { date: '1941.06.22', title: 'Operation Barbarossa', cat: 'military' },
  { date: '1941.12.07', title: 'Attack on Pearl Harbor', cat: 'military' },
  { date: '1942.06.04', title: 'Battle of Midway', cat: 'military' },
  { date: '1943.02.02', title: 'Battle of Stalingrad', cat: 'military' },
  { date: '1944.06.06', title: 'D-Day Invasion', cat: 'military' },
  { date: '1945.04.30', title: 'Fall of Berlin', cat: 'military' },
  { date: '1945.08.15', title: 'V-J Day', cat: 'military' },
];

const GeneratingView = () => {
  const navigate = useNavigate();
  const { initScenario, hydrateSession, timeline, sessionId, userPrompt } = useStore();
  const [phase, setPhase] = useState(0);
  const [factions, setFactions] = useState([]);
  const [persons, setPersons] = useState([]);
  const [facts, setFacts] = useState([]);
  const [causalVars, setCausalVars] = useState([]);
  const [varsRevealed, setVarsRevealed] = useState(false);
  const [events, setEvents] = useState([]);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [flash, setFlash] = useState(false);
  const [genError, setGenError] = useState(null);
  const [totalCounts, setTotalCounts] = useState({ factions: 0, persons: 0, facts: 0, events: 0 });
  const abortRef = useRef(null);

  const isCustom = !!userPrompt;

  // --- SEED DATA MODE: hardcoded animation ---
  useEffect(() => {
    if (isCustom) return;
    initScenario();
  }, [isCustom]);

  useEffect(() => {
    if (isCustom) return;

    setTotalCounts({ factions: GEN_FACTIONS.length, persons: GEN_PERSONS.length, facts: GEN_FACTS.length, events: GEN_EVENTS.length });

    const t = [];
    const tick = (ms, fn) => t.push(setTimeout(fn, ms));

    tick(400, () => { setPhase(1); setProgress(5); });
    tick(1200, () => { setPhase(2); setProgress(10); });
    GEN_FACTIONS.forEach((f, i) => {
      tick(1500 + i * 220, () => {
        setFactions(prev => [...prev, f]);
        setProgress(10 + ((i + 1) / GEN_FACTIONS.length) * 20);
      });
    });
    tick(3600, () => setPhase(3));
    GEN_PERSONS.forEach((p, i) => {
      tick(3800 + i * 180, () => {
        setPersons(prev => [...prev, p]);
        setProgress(30 + ((i + 1) / GEN_PERSONS.length) * 10);
      });
    });
    tick(4900, () => { setPhase(4); setProgress(42); });
    GEN_FACTS.forEach((f, i) => {
      tick(5100 + i * 220, () => {
        setFacts(prev => [...prev, f]);
        setProgress(42 + ((i + 1) / GEN_FACTS.length) * 18);
      });
    });
    tick(7100, () => { setPhase(5); setVarsRevealed(true); setCausalVars(GEN_CAUSAL_VARS); setProgress(65); });
    tick(8100, () => setProgress(75));
    tick(8400, () => { setPhase(6); setProgress(76); });
    GEN_EVENTS.forEach((e, i) => {
      tick(8600 + i * 180, () => {
        setEvents(prev => [...prev, e]);
        setProgress(76 + ((i + 1) / GEN_EVENTS.length) * 20);
      });
    });
    tick(10800, () => { setProgress(100); setPhase(7); });
    tick(11200, () => setFlash(true));
    tick(11400, () => setFlash(false));
    tick(11800, () => setReady(true));

    return () => t.forEach(clearTimeout);
  }, [isCustom]);

  // --- CUSTOM MODE: Claude SSE streaming ---
  useEffect(() => {
    if (!isCustom) return;

    setPhase(1);
    setProgress(5);

    const abort = streamGeneration(userPrompt, {
      phase: (data) => {
        setPhase(data.phase);
        // Map phases to rough progress
        const phaseProgress = { 1: 5, 2: 10, 3: 30, 4: 42, 5: 65, 6: 76, 7: 100 };
        if (phaseProgress[data.phase]) setProgress(phaseProgress[data.phase]);
        if (data.phase === 5) setVarsRevealed(true);
      },
      faction: (data) => {
        setFactions(prev => {
          const next = [...prev, data];
          setTotalCounts(c => ({ ...c, factions: next.length }));
          setProgress(p => Math.max(p, 10 + (next.length / 10) * 20));
          return next;
        });
      },
      person: (data) => {
        setPersons(prev => {
          const next = [...prev, data];
          setTotalCounts(c => ({ ...c, persons: next.length }));
          setProgress(p => Math.max(p, 30 + (next.length / 7) * 10));
          return next;
        });
      },
      fact: (data) => {
        setFacts(prev => {
          const next = [...prev, data];
          setTotalCounts(c => ({ ...c, facts: next.length }));
          setProgress(p => Math.max(p, 42 + (next.length / 10) * 18));
          return next;
        });
      },
      causalVar: (data) => {
        setCausalVars(prev => [...prev, data]);
      },
      event: (data) => {
        setEvents(prev => {
          const next = [...prev, data];
          setTotalCounts(c => ({ ...c, events: next.length }));
          setProgress(p => Math.max(p, 76 + (next.length / 12) * 20));
          return next;
        });
      },
      complete: (data) => {
        setProgress(100);
        setPhase(7);
        hydrateSession(data);
        setTimeout(() => setFlash(true), 400);
        setTimeout(() => setFlash(false), 600);
        setTimeout(() => setReady(true), 1000);
      },
      error: (err) => {
        setGenError(err.message);
      },
    });
    abortRef.current = abort;

    return () => { if (abortRef.current) abortRef.current(); };
  }, [isCustom, userPrompt]);

  // Navigate once ready + data loaded
  useEffect(() => {
    if (ready && sessionId && timeline.length > 0) {
      navigate('/simulation', { replace: true });
    }
  }, [ready, sessionId, timeline]);

  // For seed mode, use hardcoded totals; for custom mode, totals update dynamically
  const displayCausalVars = causalVars.length > 0 ? causalVars : (isCustom ? [] : GEN_CAUSAL_VARS);
  const factionTotal = isCustom ? totalCounts.factions : GEN_FACTIONS.length;
  const personTotal = isCustom ? totalCounts.persons : GEN_PERSONS.length;
  const factTotal = isCustom ? totalCounts.facts : GEN_FACTS.length;
  const eventTotal = isCustom ? totalCounts.events : GEN_EVENTS.length;

  const phaseLabels = [
    '',
    isCustom ? 'Generating world model with Claude' : 'Initializing world model',
    'Instantiating factions',
    'Identifying key figures',
    'Building intelligence network',
    'Calibrating causal system',
    'Constructing timeline',
    'Simulation ready',
  ];

  const statusColor = (s) => {
    if (s === 'aggressive') return 'text-red-400';
    if (s === 'at-war' || s === 'invaded') return 'text-orange-400';
    if (s === 'neutral') return 'text-white/50';
    return 'text-white/40';
  };

  return (
    <div className="fixed inset-0 bg-black z-[100] overflow-hidden">
      {/* Scan line effect */}
      {phase >= 1 && phase < 7 && (
        <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden opacity-[0.03]">
          <div className="w-full h-[2px] bg-[#E8E55E]" style={{ animation: 'gen-scan-line 3s linear infinite' }} />
        </div>
      )}

      {/* Flash overlay */}
      {flash && <div className="absolute inset-0 bg-[#E8E55E]/10 z-50 pointer-events-none" />}

      {/* Grid background */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
      }} />

      <div className="relative z-10 w-full h-full flex flex-col">
        {/* Header */}
        <div className="flex-none px-10 pt-8 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`transition-all duration-700 ${phase >= 1 ? 'opacity-100' : 'opacity-0'}`}>
                <svg className={`w-8 h-8 ${phase < 7 ? 'gen-glow' : ''}`} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="0" y="0" width="100" height="100" rx="22" fill="#0B0B0F" />
                  <rect x="7" y="7" width="86" height="86" rx="20" fill="none" stroke="#3A3A45" strokeWidth="2" />
                  <circle cx="50" cy="50" r="18" fill="none" stroke="#E8E55E" strokeWidth="8" />
                </svg>
              </div>
              <div className={`transition-all duration-500 ${phase >= 1 ? 'opacity-100' : 'opacity-0'}`}>
                <span className="text-sm font-semibold tracking-wide text-white/90 font-display">Ripple</span>
                <span className="text-[10px] text-white/20 uppercase tracking-[0.2em] ml-3 font-mono">World Model v1</span>
              </div>
            </div>
            {phase >= 1 && (
              <div className="flex items-center gap-3 gen-item-enter">
                <div className={`w-2 h-2 rounded-full ${phase < 7 ? 'bg-[#E8E55E] gen-pulse' : 'bg-emerald-400'}`} />
                <span className="text-xs font-mono text-white/40">{phaseLabels[phase]}</span>
              </div>
            )}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-grow overflow-y-auto px-10 pb-4">
          <div className="max-w-[1200px] mx-auto">
            {/* Three-column grid */}
            <div className="grid grid-cols-12 gap-5 mt-4">

              {/* LEFT COLUMN — Factions + Figures */}
              <div className="col-span-4 space-y-4">
                {/* Factions */}
                {phase >= 2 && (
                  <div className="gen-item-enter">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#E8E55E]/60">Factions</span>
                      <div className="flex-grow h-[1px] bg-white/[0.06]" />
                      <span className="text-[9px] font-mono text-white/20">{factions.length}/{factionTotal}</span>
                    </div>
                    <div className="space-y-[6px]">
                      {factions.map((f, i) => (
                        <div key={f.code} className="gen-item-enter flex items-center gap-3 bg-white/[0.02] border border-white/[0.05] rounded-lg px-3 py-2 group hover:border-white/[0.1] transition-colors" style={{ animationDelay: `${i * 30}ms` }}>
                          <div className="w-8 h-8 rounded bg-white/[0.04] flex items-center justify-center text-[10px] font-mono text-white/30 flex-shrink-0 border border-white/[0.06]">
                            {f.code}
                          </div>
                          <div className="flex-grow min-w-0">
                            <div className="text-[13px] text-white/70 truncate">{f.name}</div>
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] font-mono ${statusColor(f.status)}`}>{f.status.toUpperCase()}</span>
                              {f.leader && <span className="text-[10px] text-white/15">{f.leader}</span>}
                            </div>
                          </div>
                          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${f.status === 'aggressive' ? 'bg-red-400' : f.status === 'neutral' ? 'bg-white/20' : 'bg-orange-400'}`} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Key Figures */}
                {phase >= 3 && (
                  <div className="gen-item-enter">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#E8E55E]/60">Key Figures</span>
                      <div className="flex-grow h-[1px] bg-white/[0.06]" />
                      <span className="text-[9px] font-mono text-white/20">{persons.length}/{personTotal}</span>
                    </div>
                    <div className="space-y-[6px]">
                      {persons.map((p, i) => (
                        <div key={p.name} className="gen-item-enter flex items-center gap-3 bg-white/[0.02] border border-white/[0.05] rounded-lg px-3 py-2" style={{ animationDelay: `${i * 30}ms` }}>
                          <div className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-[10px] font-mono text-white/30 flex-shrink-0">
                            {p.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                          </div>
                          <div className="flex-grow min-w-0">
                            <div className="text-[13px] text-white/70">{p.name}</div>
                            <div className="text-[10px] text-white/25">{p.role} — {p.nation}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* CENTER COLUMN — Timeline */}
              <div className="col-span-4">
                {phase >= 6 && (
                  <div className="gen-item-enter">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#E8E55E]/60">Timeline</span>
                      <div className="flex-grow h-[1px] bg-white/[0.06]" />
                      <span className="text-[9px] font-mono text-white/20">{events.length}/{eventTotal}</span>
                    </div>
                    <div className="relative">
                      {/* Vertical line */}
                      <div className="absolute left-[7px] top-3 bottom-0 w-[1px] bg-white/[0.06]" />
                      <div className="space-y-[2px]">
                        {events.map((e, i) => (
                          <div key={e.date} className="gen-item-enter flex items-start gap-3 pl-0 py-1.5 relative" style={{ animationDelay: `${i * 30}ms` }}>
                            <div className={`w-[15px] h-[15px] rounded-full flex-shrink-0 z-10 flex items-center justify-center mt-0.5 ${i === events.length - 1 ? 'bg-[#E8E55E]' : 'bg-white/10 border border-white/[0.1]'}`} style={i === events.length - 1 ? { boxShadow: '0 0 10px rgba(232,229,94,0.4)' } : {}}>
                              {i === events.length - 1 && <div className="w-[5px] h-[5px] rounded-full bg-black" />}
                            </div>
                            <div className="flex-grow min-w-0 bg-white/[0.02] border border-white/[0.05] rounded-lg px-3 py-2">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="text-[10px] font-mono text-[#E8E55E]/50">{e.date}</span>
                                <span className="text-[9px] font-mono text-white/15 uppercase">{e.cat}</span>
                              </div>
                              <div className="text-[13px] text-white/70">{e.title}</div>
                            </div>
                          </div>
                        ))}
                        {phase === 6 && (isCustom || events.length < GEN_EVENTS.length) && events.length < eventTotal && (
                          <div className="flex items-center gap-3 pl-0 py-1.5">
                            <div className="w-[15px] h-[15px] rounded-full bg-white/[0.04] border border-white/[0.08] flex-shrink-0 z-10 flex items-center justify-center">
                              <div className="w-[5px] h-[5px] rounded-full bg-[#E8E55E] gen-pulse" />
                            </div>
                            <span className="text-[11px] text-white/20 font-mono">constructing<span className="gen-cursor">_</span></span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Centered status for early phases */}
                {phase >= 1 && phase < 6 && !genError && (
                  <div className="h-full flex flex-col items-center justify-center">
                    <div className="gen-item-enter flex flex-col items-center">
                      <svg className="w-20 h-20 mb-6 gen-glow rounded-2xl" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0" y="0" width="100" height="100" rx="22" fill="#0B0B0F" />
                        <rect x="7" y="7" width="86" height="86" rx="20" fill="none" stroke="#3A3A45" strokeWidth="2" />
                        <circle cx="50" cy="50" r="18" fill="none" stroke="#E8E55E" strokeWidth="8" strokeDasharray="113.097" strokeDashoffset={113.097 * (1 - progress / 100)} className="transition-all duration-500" />
                      </svg>
                      <div className="text-center">
                        <div className="text-3xl font-light text-white/90 mb-2 font-display">{Math.round(progress)}%</div>
                        <div className="text-xs text-white/30 font-mono uppercase tracking-[0.15em]">{phaseLabels[phase]}<span className="gen-cursor">_</span></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error state */}
                {genError && (
                  <div className="h-full flex flex-col items-center justify-center">
                    <div className="gen-item-enter flex flex-col items-center max-w-sm text-center">
                      <div className="w-16 h-16 rounded-full border-2 border-red-400/50 flex items-center justify-center mb-4">
                        <svg className="w-7 h-7 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
                      </div>
                      <span className="text-sm text-red-400/80 mb-2">Generation failed</span>
                      <p className="text-xs text-white/30 mb-4">{genError}</p>
                      <button onClick={() => navigate('/')} className="px-4 py-2 border border-white/10 rounded-full text-xs text-white/50 hover:text-white/80 hover:border-white/30 transition-all">
                        Back to scenarios
                      </button>
                    </div>
                  </div>
                )}

                {/* Ready state overlay */}
                {phase === 7 && (
                  <div className="mt-8 gen-item-enter flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full border-2 border-emerald-400/50 flex items-center justify-center mb-4" style={{ boxShadow: '0 0 30px rgba(52,211,153,0.2)' }}>
                      <svg className="w-7 h-7 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                    </div>
                    <span className="text-sm font-mono text-emerald-400/70 uppercase tracking-[0.2em]">Entering simulation</span>
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN — Causal Vars + Facts */}
              <div className="col-span-4 space-y-4">
                {/* Causal Variables */}
                {phase >= 5 && (
                  <div className="gen-item-enter">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#E8E55E]/60">Causal Variables</span>
                      <div className="flex-grow h-[1px] bg-white/[0.06]" />
                    </div>
                    <div className="bg-white/[0.02] border border-white/[0.05] rounded-lg p-4 space-y-4">
                      {displayCausalVars.map((v, i) => (
                        <div key={v.key} className="gen-item-enter" style={{ animationDelay: `${i * 100}ms` }}>
                          <div className="flex justify-between text-[11px] mb-1.5">
                            <span className="text-white/40 font-mono uppercase tracking-wider">{v.label}</span>
                            <span className={`font-mono ${v.value >= 60 ? 'text-[#E8E55E]' : v.value <= 40 ? 'text-red-400/70' : 'text-white/50'}`}>
                              {varsRevealed ? v.value : '—'}
                            </span>
                          </div>
                          <div className="w-full h-[4px] bg-white/[0.04] rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full gen-gauge-fill ${v.value >= 60 ? 'bg-[#E8E55E]/80' : v.value <= 40 ? 'bg-red-400/60' : 'bg-white/40'}`}
                              style={{ width: varsRevealed ? `${v.value}%` : '0%', animationDelay: `${i * 150}ms`, animationDuration: '1s' }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Intelligence Briefing / Facts */}
                {phase >= 4 && (
                  <div className="gen-item-enter">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-[#E8E55E]/60">Intelligence Briefing</span>
                      <div className="flex-grow h-[1px] bg-white/[0.06]" />
                      <span className="text-[9px] font-mono text-white/20">{facts.length}/{factTotal}</span>
                    </div>
                    <div className="bg-white/[0.02] border border-white/[0.05] rounded-lg overflow-hidden">
                      <div className="p-3 space-y-[4px] font-mono text-[11px] max-h-[280px] overflow-y-auto">
                        {facts.map((f, i) => (
                          <div key={f.id} className="gen-item-enter flex gap-2 leading-relaxed" style={{ animationDelay: `${i * 20}ms` }}>
                            <span className="text-[#E8E55E]/40 flex-shrink-0">&gt;</span>
                            <span className="text-white/50">{f.text}</span>
                            <span className={`flex-shrink-0 text-[9px] px-1 py-0 rounded ${f.type === 'hard' ? 'text-[#E8E55E]/40 bg-[#E8E55E]/[0.06]' : 'text-white/20 bg-white/[0.03]'}`}>
                              {f.type}
                            </span>
                          </div>
                        ))}
                        {phase === 4 && facts.length < factTotal && (
                          <div className="flex gap-2">
                            <span className="text-[#E8E55E]/40">&gt;</span>
                            <span className="text-white/20 gen-cursor">_</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom progress bar */}
        <div className="flex-none px-10 pb-6 pt-2">
          <div className="max-w-[1200px] mx-auto">
            <div className="flex items-center gap-4">
              <div className="flex-grow h-[2px] bg-white/[0.04] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#E8E55E]/60 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-white/25 w-10 text-right">{Math.round(progress)}%</span>
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-[9px] font-mono text-white/15 uppercase tracking-[0.15em]">
                {phase >= 7 ? 'World model complete' : isCustom ? 'Claude is building world model' : 'Building world model'}
              </span>
              <div className="flex gap-4 text-[9px] font-mono text-white/15">
                <span>{factions.length} factions</span>
                <span>{persons.length} figures</span>
                <span>{facts.length} facts</span>
                <span>{events.length} events</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
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
      if (!sessionId && scenario) {
        const ww2Slugs = ['pearl-harbor', 'hiroshima'];
        if (ww2Slugs.includes(scenario.slug)) {
          await initScenario({ scenarioType: 'ww2' });
        } else {
          await initScenario({
            scenarioType: 'generated',
            title: scenario.title,
            subtitle: scenario.subtitle,
            nodes: scenario.nodes,
          });
        }
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
        <Route path="/generating" element={<GeneratingView />} />
        <Route path="/scenario/:slug" element={<ScenarioView />} />
        <Route path="/simulation" element={<TimelineView />} />
        <Route path="/detail" element={<DetailView />} />
        <Route path="/inspector" element={<InspectorView />} />
      </Routes>
    </Router>
  );
};

export default App;
