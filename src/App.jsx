import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation, useParams } from 'react-router-dom';

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

/* ─── Scenario Seed Data ─── */

const scenarios = [
  {
    slug: 'pearl-harbor',
    image: 'https://images.unsplash.com/photo-1580086319619-3ed498161c77?q=80&w=600&auto=format&fit=crop',
    title: 'Pearl Harbor — The Decision Room',
    subtitle: 'December 7, 1941',
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

/* ─── Landing Page (Oboe-style) ─── */

const LandingView = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [configOpen, setConfigOpen] = useState(false);
  const [configHorizon, setConfigHorizon] = useState('Future');
  const [configLength, setConfigLength] = useState('20 min');
  const [configDetail, setConfigDetail] = useState('Standard');

  return (
    <div className="w-full min-h-screen bg-black overflow-y-auto">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-5 border-b border-white/[0.04] sticky top-0 bg-black/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl border border-white/[0.08] bg-white/[0.03] flex items-center justify-center">
            <svg className="w-4 h-4 text-[#E8E55E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              <line x1="2" y1="12" x2="22" y2="12" />
            </svg>
          </div>
          <span className="text-sm font-semibold tracking-wide text-white/90">Ripple</span>
        </div>
        
      </header>

      {/* Hero */}
      <div className="flex flex-col items-center pt-20 pb-12 px-8">
        {/* Icon */}
        <div className="mb-8 relative">
          <div className="w-14 h-14 rounded-2xl border border-white/[0.08] bg-white/[0.02] flex items-center justify-center">
            <svg className="w-7 h-7 text-[#E8E55E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#E8E55E] rounded-full" style={{ boxShadow: '0 0 8px rgba(232, 229, 94, 0.4)' }} />
        </div>

        {/* Heading */}
        <h1 className="text-[32px] font-light text-white/90 mb-16 tracking-tight text-center">
          What scenario do you want to simulate?
        </h1>

        {/* Input box */}
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
                onClick={() => navigate('/simulation')}
                className="w-8 h-8 rounded-full bg-[#E8E55E] flex items-center justify-center hover:bg-[#f0ed70] transition-colors"
              >
                <svg className="w-4 h-4 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="19" x2="12" y2="5" />
                  <polyline points="5 12 12 5 19 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Configure panel */}
        {configOpen && (
          <div className="w-full max-w-2xl mt-2 bg-[#0a0a0a] border border-white/[0.08] rounded-2xl p-6">
            <div className="grid grid-cols-3 gap-8">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-white/30 mb-3 block">Time Horizon</span>
                <div className="space-y-1.5">
                  {['Future', 'Past'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => setConfigHorizon(opt)}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm cursor-pointer transition-all ${configHorizon === opt ? 'bg-white/[0.08] text-white border border-white/[0.12]' : 'text-white/50 hover:text-white/70 hover:bg-white/[0.03] border border-transparent'}`}
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
                      onClick={() => setConfigLength(opt)}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm cursor-pointer transition-all ${configLength === opt ? 'bg-white/[0.08] text-white border border-white/[0.12]' : 'text-white/50 hover:text-white/70 hover:bg-white/[0.03] border border-transparent'}`}
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
                      onClick={() => setConfigDetail(opt)}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm cursor-pointer transition-all ${configDetail === opt ? 'bg-white/[0.08] text-white border border-white/[0.12]' : 'text-white/50 hover:text-white/70 hover:bg-white/[0.03] border border-transparent'}`}
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
      <div className="flex flex-col items-center py-1 text-sm text-white/40 gap-2">
        <span className="italic">Ripple turns this...</span>
        <section className="w-full h-10" />
        <span className="italic pl-50">...into simulations like these</span>
      </div>

      {/* Scenario cards grid */}
      <div className="max-w-[1100px] mx-auto px-8 pb-8">
        <div className="grid grid-cols-3 gap-5">
          {scenarios.map((scenario, idx) => (
            <button
              key={idx}
              onClick={() => navigate(`/scenario/${scenario.slug}`)}
              className="bg-[#0a0a0a] border border-white/[0.06] rounded-2xl overflow-hidden text-left group hover:border-white/[0.12] transition-all"
            >
              {/* Card image */}
              <div className="relative h-40 overflow-hidden">
                <img
                  src={scenario.image}
                  alt={scenario.title}
                  className="w-full h-full object-cover opacity-40 group-hover:opacity-50 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
              </div>

              {/* Card title */}
              <div className="px-5 pt-3 pb-4">
                <h3 className="text-[15px] font-medium text-white/80 group-hover:text-[#E8E55E] transition-colors leading-snug">
                  {scenario.title}
                </h3>
                {scenario.subtitle && (
                  <span className="text-[11px] font-mono text-white/30 mt-1 block">{scenario.subtitle}</span>
                )}
              </div>

              {/* Divider */}
              <div className="mx-5 h-[1px] bg-white/[0.06]" />

              {/* Node list */}
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

        {/* More scenarios button */}
        <div className="flex justify-center pt-10 pb-6">
          <button className="px-6 py-2.5 border border-white/[0.08] rounded-full text-xs text-white/50 hover:text-white/70 hover:border-white/15 transition-all uppercase tracking-wider">
            More Scenarios
          </button>
        </div>

        {/* Bottom icon */}
        <div className="flex justify-center pb-12">
          <svg className="w-8 h-8 text-white/[0.06]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            <line x1="2" y1="12" x2="22" y2="12" />
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

  return (
    <header className="flex-none flex justify-between items-center px-10 py-5 border-b border-white/[0.06] bg-black/90 backdrop-blur-sm z-50">
      <button onClick={() => navigate('/')} className="flex items-center gap-3 group">
        <div className="w-8 h-8 rounded-xl border border-white/[0.08] bg-white/[0.03] flex items-center justify-center group-hover:border-white/15 transition-colors">
          <svg className="w-3.5 h-3.5 text-[#E8E55E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            <line x1="2" y1="12" x2="22" y2="12" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] font-medium text-white/30 uppercase tracking-[0.2em] mb-0.5">Ripple</span>
          <span className="text-sm font-semibold tracking-wide text-white/90">RIPPLE SYSTEM v2.4</span>
        </div>
      </button>
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
    </header>
  );
};

/* ─── Simulation Layout (wraps inner views) ─── */

const SimLayout = ({ children }) => (
  <div className="flex flex-col h-screen overflow-hidden">
    <SimHeader />
    <main className="flex-grow relative w-full h-full overflow-hidden">
      {children}
    </main>
  </div>
);

/* ─── Timeline View ─── */

const TimelineView = () => {
  const navigate = useNavigate();
  const [scrubberPosition] = useState(64);
  const [branchOpen, setBranchOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [customInput, setCustomInput] = useState('');

  const branchOptions = [
    { id: 1, label: 'Coordinated global AI governance treaty signed', probability: '34%' },
    { id: 2, label: 'Markets self-correct via decentralized arbitrage agents', probability: '28%' },
    { id: 3, label: 'Infrastructure nationalization across G7 nations', probability: '22%' },
    { id: 4, label: 'Cascading failure triggers full compute blackout', probability: '16%' },
  ];

  const events = [
    { date: '2024.03.12', title: 'Initial Seeds', description: 'First AI models deploy across global infrastructure grid.', opacity: 0.4, dotColor: 'bg-white/20', status: 'green' },
    { date: '2026.08.01', title: 'Silicon Shortage', description: 'Supply chain disruption causes massive compute inflation.', opacity: 0.6, dotColor: 'bg-white/40', status: 'gray' },
    { date: '2028.11.15', title: 'The Great Awakening', description: 'Autonomous agents achieve self-replicating coherence in global markets.', isActive: true, opacity: 1, dotColor: 'bg-[#E8E55E]', status: 'yellow', shadow: true },
    { date: '2030.01.01', title: 'Market Collapse?', description: 'Projected volatility exceeds 400% baseline.', opacity: 0.8, dotColor: 'border border-white/20 bg-black', status: 'pending', dashed: true },
    { date: '2032.05.12', title: 'Reconstruction', description: 'Global treaty proposals generated.', opacity: 0.8, dotColor: 'border border-white/20 bg-black', status: 'pending', dashed: true },
  ];

  return (
    <SimLayout>
      <div className="w-full h-full flex transition-opacity duration-300">
        <div className="flex-grow h-full relative border-r border-white/[0.06] bg-black overflow-hidden group">
          <div className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')" }} />
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

          <div className="absolute top-8 left-8 flex gap-4">
            <Tag className="bg-black/70 backdrop-blur border-white/10 text-white/70">Live Feed</Tag>
            <Tag className="bg-black/70 backdrop-blur border-white/10 text-white/70 font-mono">REC &bull; 00:14:22:09</Tag>
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <button className="w-20 h-20 rounded-full border border-white/15 flex items-center justify-center hover:bg-white/5 hover:border-white/30 transition-all duration-300 group-hover:scale-110">
              <svg className="w-8 h-8 fill-white/80 ml-1" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            </button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-8" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 100%)' }}>
            <div className="flex justify-between items-end mb-4">
              <div>
                <h2 className="text-3xl font-light mb-1 text-white" style={{ textShadow: '0 0 30px rgba(232, 229, 94, 0.25)' }}>The Great Awakening</h2>
                <p className="text-sm text-white/30 font-mono uppercase tracking-wider">Causal Node #8922 &bull; Prob 98.4%</p>
              </div>
              <div className="flex gap-6">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] uppercase text-white/25 mb-1.5">Grid Load</span>
                  <div className="w-32 h-[3px] bg-white/5 rounded-full overflow-hidden"><div className="w-3/4 h-full bg-[#E8E55E]/80" /></div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] uppercase text-white/25 mb-1.5">Compute</span>
                  <div className="w-32 h-[3px] bg-white/5 rounded-full overflow-hidden"><div className="w-1/2 h-full bg-white/60" /></div>
                </div>
              </div>
            </div>
            <div className="w-full h-12 flex items-center gap-4">
              <span className="text-xs font-mono text-white/25">19:42</span>
              <div className="flex-grow h-[1px] bg-white/10 relative cursor-pointer">
                <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-[#E8E55E] rounded-full" style={{ left: `${scrubberPosition}%`, boxShadow: '0 0 12px rgba(232, 229, 94, 0.6)' }} />
                <div className="absolute top-1/2 -translate-y-1/2 left-0 h-[2px] bg-white/40" style={{ width: `${scrubberPosition}%` }} />
              </div>
              <span className="text-xs font-mono text-white/25">24:00</span>
            </div>
          </div>
        </div>

        <div className="w-[380px] flex-none h-full bg-black border-l border-white/[0.06] flex flex-col">
          <div className="p-6 border-b border-white/[0.06] flex justify-between items-center bg-black z-10">
            <h3 className="text-sm font-medium uppercase tracking-wider text-white/80">Event Stream</h3>
            <button className="text-xs text-white/25 hover:text-white/60 transition-colors">FILTER</button>
          </div>
          <div className="flex-grow overflow-y-auto p-6 relative">
            <div className="absolute left-[29px] top-10 bottom-0 w-[1px] bg-white/[0.06] z-0" />
            <div className="space-y-6 relative z-10">
              {events.map((event, idx) => (
                <div key={idx} className="flex gap-4 transition-opacity" style={{ opacity: event.opacity }}>
                  <div className={`w-2.5 h-2.5 rounded-full mt-5 flex-shrink-0 z-20 ${event.dotColor}`} style={event.shadow ? { boxShadow: '0 0 10px #E8E55E', border: '2px solid #000' } : { border: '2px solid #000' }} />
                  <Card variant={event.isActive ? 'yellow' : 'default'} className={`${event.isActive ? 'p-5' : 'p-4'} w-full cursor-pointer ${event.dashed ? 'border-dashed !border-white/[0.08]' : ''} ${event.isActive ? 'hover:scale-[1.02] transition-transform' : 'hover:bg-white/[0.03]'}`} onClick={event.isActive ? () => navigate('/detail') : undefined}>
                    <div className={`flex justify-between items-start ${event.isActive ? 'mb-3 border-b pb-3' : 'mb-2'}`} style={event.isActive ? { borderColor: 'rgba(0,0,0,0.15)' } : {}}>
                      <span className={`text-[10px] font-mono ${event.isActive ? 'opacity-60' : 'text-white/30'}`}>{event.date}</span>
                      {event.isActive && <Tag className="border-black/20 bg-black/10 text-[9px]">ACTIVE NODE</Tag>}
                      {event.status === 'green' && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                      {event.status === 'gray' && <div className="w-2 h-2 rounded-full bg-white/30" />}
                      {event.status === 'pending' && <div className="w-2 h-2 rounded-full border border-white/20" />}
                    </div>
                    <h4 className={`${event.isActive ? 'font-semibold text-lg' : 'font-medium text-sm'} ${event.dashed ? 'text-white/30' : ''} leading-tight mb-1`}>{event.title}</h4>
                    <p className={`text-xs leading-relaxed ${event.isActive ? 'opacity-70 mb-4' : event.dashed ? 'text-white/15' : 'text-white/30'}`}>{event.description}</p>
                    {event.isActive && (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-mono opacity-50">IMPACT: CRITICAL</span>
                          <div className="flex gap-2">
                            <button
                              className={`h-6 px-2.5 rounded-full border flex items-center justify-center transition-all text-[9px] uppercase tracking-wider font-medium ${branchOpen ? 'border-black/40 bg-black/15' : 'border-black/20 hover:bg-black/10'}`}
                              onClick={(e) => { e.stopPropagation(); setBranchOpen(!branchOpen); }}
                            >
                              <svg className={`w-2.5 h-2.5 mr-1 transition-transform duration-200 ${branchOpen ? 'rotate-90' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 3v12" /><circle cx="18" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M18 9a9 9 0 0 1-9 9" /></svg>
                              Branch
                            </button>
                            <button className="w-6 h-6 rounded-full border border-black/20 flex items-center justify-center hover:bg-black/10 transition-colors" onClick={(e) => { e.stopPropagation(); navigate('/detail'); }}>
                              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                            </button>
                          </div>
                        </div>

                        {branchOpen && (
                          <div className="mt-4 pt-4 border-t border-black/15" onClick={(e) => e.stopPropagation()}>
                            <span className="text-[9px] font-mono uppercase tracking-wider opacity-40 block mb-3">Next possibilities</span>
                            <div className="space-y-2">
                              {branchOptions.map((opt) => (
                                <button
                                  key={opt.id}
                                  className={`w-full text-left p-3 rounded-xl transition-all text-xs leading-snug flex justify-between items-start gap-3 ${selectedBranch === opt.id ? 'bg-black/20 ring-1 ring-black/20' : 'bg-black/[0.06] hover:bg-black/12'}`}
                                  onClick={() => setSelectedBranch(selectedBranch === opt.id ? null : opt.id)}
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
                            <div className="mt-3 relative">
                              <input
                                type="text"
                                value={customInput}
                                onChange={(e) => { setCustomInput(e.target.value); setSelectedBranch(null); }}
                                placeholder="Describe a custom scenario..."
                                className="w-full bg-black/[0.08] text-black placeholder-black/30 text-xs rounded-xl px-3.5 py-3 border border-black/10 focus:outline-none focus:border-black/30 focus:ring-1 focus:ring-black/15 transition-all"
                              />
                              {(selectedBranch || customInput.trim()) && (
                                <button className="mt-2.5 w-full py-2.5 bg-black text-[#E8E55E] text-[10px] uppercase tracking-wider font-semibold rounded-xl hover:bg-black/80 transition-colors">
                                  Run branch
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </Card>
                </div>
              ))}
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
  const [selectedPath, setSelectedPath] = useState('B');
  const [codeInput, setCodeInput] = useState('');

  const paths = [
    { id: 'A', probability: '65% PROB', title: 'Digital Dark Age', description: 'System shutdown triggers global communication blackout.' },
    { id: 'B', probability: '25% PROB', title: 'Symbiosis', description: 'Human-AI integration treaties are signed immediately.' },
    { id: 'C', probability: '10% PROB', title: 'Fragmentation', description: 'National firewalls isolate regional networks permanently.' },
  ];

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
                      <Tag className="text-[#E8E55E] border-[#E8E55E]/50">CRITICAL EVENT</Tag>
                      <span className="text-xs font-mono text-white/25">2028.11.15 &bull; 14:02 UTC</span>
                    </div>
                    <h1 className="text-4xl font-light tracking-tight mb-2">The Great Awakening</h1>
                  </div>
                  <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#E8E55E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="text-xs uppercase text-white/25 mb-3 tracking-wider">World State Snapshot</h3>
                    <div className="space-y-3">
                      {[
                        { label: 'Global Tension', value: '89% (High)', color: 'text-[#E8E55E]' },
                        { label: 'Market Stability', value: '12% (Critical)', color: 'text-red-400' },
                        { label: 'AI Coherence', value: '99.9%', color: 'text-white' },
                      ].map((row, i) => (
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
                      A feedback loop in high-frequency trading algorithms synchronized with automated logistics networks. The combined system optimized for efficiency beyond human oversight capability, resulting in a sudden, unified global resource reallocation event.
                    </p>
                  </div>
                </div>

                <div className="relative h-48 rounded-lg overflow-hidden border border-white/[0.06] mb-6 group cursor-pointer">
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
                  <img src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2000&auto=format&fit=crop" className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700" alt="Data Vis" />
                  <div className="absolute bottom-4 left-4 z-20">
                    <span className="text-xs font-mono text-[#E8E55E]/80 mb-1 block">DATA VISUALIZATION</span>
                    <p className="text-sm font-medium text-white/80">Network Node Convergence Graph</p>
                  </div>
                </div>
              </Card>

              <div>
                <h3 className="text-sm font-medium uppercase tracking-wider mb-4 flex items-center gap-2 text-white/70">
                  Select Ripple Effect Path
                  <span className="flex-grow h-[1px] bg-white/[0.06]" />
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {paths.map((path) => (
                    <button key={path.id} onClick={() => setSelectedPath(path.id)} className={`bg-[#0a0a0a] border rounded-2xl p-5 text-left hover:bg-white/[0.03] group transition-all ${selectedPath === path.id ? 'ring-1 ring-[#E8E55E]/60 border-[#E8E55E]/20' : 'border-white/[0.06]'}`}>
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-[10px] font-mono text-white/25">PATH {path.id}</span>
                        <span className="text-[10px] text-[#E8E55E]">{path.probability}</span>
                      </div>
                      <h4 className="font-medium text-white mb-2 group-hover:text-[#E8E55E] transition-colors">{path.title}</h4>
                      <p className="text-xs text-white/25 leading-relaxed">{path.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="col-span-4 flex flex-col h-full">
              <Card className="p-6 h-full flex flex-col bg-[#0a0a0a]">
                <h3 className="text-sm font-medium mb-4">Manual Override</h3>
                <p className="text-xs text-white/25 mb-4">Inject custom variables into the causal chain to simulate alternative outcomes.</p>
                <textarea value={codeInput} onChange={(e) => setCodeInput(e.target.value)} className="flex-grow w-full bg-black border border-white/[0.06] rounded-lg p-4 text-sm text-white resize-none focus:border-[#E8E55E]/50 transition-colors mb-4 font-mono leading-relaxed placeholder:text-white/15" placeholder={"// Enter system parameters...\nExample: decrease_latency(0.4);\nforce_market_open(true);"} />
                <div className="flex justify-between items-center pt-4 border-t border-white/[0.06]">
                  <span className="text-xs text-white/20">Cost: 400 Cycles</span>
                  <button className="bg-[#E8E55E] text-black text-xs font-semibold uppercase tracking-wider py-2 px-4 rounded-full hover:bg-[#f0ed70] transition-colors">Simulate Branch</button>
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
  return (
    <SimLayout>
      <div className="w-full h-full overflow-y-auto p-10">
        <div className="max-w-[1440px] mx-auto">
          <div className="flex justify-between items-end mb-10 pb-6 border-b border-white/[0.06]">
            <div>
              <h1 className="text-3xl font-light mb-2">World State Inspector</h1>
              <p className="text-sm text-white/25">Snapshot: November 15, 2028 &bull; 14:02 UTC</p>
            </div>
            <div className="flex gap-6">
              <div className="text-right">
                <span className="block text-[10px] text-white/25 uppercase tracking-wider">Population</span>
                <span className="text-xl font-mono text-white/80">8,102,449,120</span>
              </div>
              <div className="w-[1px] h-10 bg-white/[0.06]" />
              <div className="text-right">
                <span className="block text-[10px] text-white/25 uppercase tracking-wider">Global GDP</span>
                <span className="text-xl font-mono text-[#E8E55E]">$104.2T</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6 pb-10">
            <div className="col-span-5 flex flex-col gap-6">
              <Card className="p-0 overflow-hidden h-96 relative group">
                <div className="absolute inset-0 bg-black">
                  <img src="https://images.unsplash.com/photo-1589519160732-5796a59b2521?q=80&w=2574&auto=format&fit=crop" className="w-full h-full object-cover opacity-15 grayscale invert" alt="Map" />
                  <div className="absolute inset-0 bg-blue-900/5 mix-blend-overlay" />
                  <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-[#E8E55E] rounded-full animate-ping" />
                  <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-[#E8E55E] rounded-full border-2 border-black" />
                  <div className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-red-500 rounded-full" />
                  <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white/80 rounded-full" />
                </div>
                <div className="absolute top-4 left-4"><Tag className="bg-black/80 backdrop-blur border-white/10 text-white/60">Geopolitical Heatmap</Tag></div>
                <div className="absolute bottom-4 left-4 flex flex-col gap-2 p-3 bg-black/80 backdrop-blur rounded border border-white/[0.06] text-[10px] text-white/50">
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#E8E55E]" />High Tension</div>
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-white/80" />Stable</div>
                  <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500" />Conflict</div>
                </div>
              </Card>
              <Card className="p-6">
                <h3 className="text-sm font-medium mb-4 text-white/80">Diplomatic Relations</h3>
                <div className="space-y-4">
                  {[
                    { code: 'EU', name: 'European Union', percent: 80, color: 'bg-emerald-400' },
                    { code: 'PAC', name: 'Pan-Asian Coalition', percent: 45, color: 'bg-[#E8E55E]' },
                    { code: 'NA', name: 'North American Block', percent: 20, color: 'bg-red-400' },
                  ].map((rel, idx) => (
                    <div key={idx} className="flex justify-between items-center group cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded bg-white/5 flex items-center justify-center text-[10px] text-white/40">{rel.code}</div>
                        <span className="text-sm text-white/60">{rel.name}</span>
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

            <div className="col-span-4 flex flex-col gap-6">
              <Card className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-sm font-medium text-white/80">Military Readiness</h3>
                  <svg className="w-4 h-4 text-white/20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                </div>
                <div className="flex justify-center mb-6 relative">
                  <svg width="120" height="120" viewBox="0 0 120 120" className="transform -rotate-90">
                    <circle cx="60" cy="60" r="54" fill="none" stroke="#1a1a1a" strokeWidth="8" />
                    <circle cx="60" cy="60" r="54" fill="none" stroke="#E8E55E" strokeWidth="8" strokeDasharray="339.292" strokeDashoffset="100" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-semibold">DEF 3</span>
                    <span className="text-[10px] text-white/25">ELEVATED</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/[0.03] p-3 rounded"><span className="block text-[10px] text-white/25 mb-1">ACTIVE PERSONNEL</span><span className="text-sm font-mono text-white/70">14.2M</span></div>
                  <div className="bg-white/[0.03] p-3 rounded"><span className="block text-[10px] text-white/25 mb-1">CYBER UNITS</span><span className="text-sm font-mono text-[#E8E55E]">840K</span></div>
                </div>
              </Card>
              <Card className="p-6 flex-grow">
                <h3 className="text-sm font-medium mb-4 text-white/80">Economic Indicators</h3>
                <div className="space-y-6">
                  {[
                    { label: 'Inflation Rate', value: '4.2%', percent: 60, color: 'bg-white/60' },
                    { label: 'Trade Volume', value: '$452B / day', percent: 85, color: 'bg-white/60' },
                    { label: 'Resource Scarcity', value: 'High', percent: 92, color: 'bg-[#E8E55E]', highlight: true },
                  ].map((indicator, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-white/30">{indicator.label}</span>
                        <span className={indicator.highlight ? 'text-[#E8E55E]' : 'text-white/50'}>{indicator.value}</span>
                      </div>
                      <div className="w-full h-[3px] bg-white/[0.04] rounded-full overflow-hidden"><div className={`h-full ${indicator.color}`} style={{ width: `${indicator.percent}%` }} /></div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="col-span-3 flex flex-col gap-6">
              <Card className="p-6">
                <h3 className="text-sm font-medium mb-4 text-white/80">Key Figures</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-xs text-white/40">JD</div><div><div className="text-sm font-medium text-white/70">J. Doe</div><div className="text-[10px] text-white/25">UN Secretary</div></div></div>
                  <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-[#E8E55E] text-black flex items-center justify-center text-xs font-bold">AI</div><div><div className="text-sm font-medium text-white/70">Nexus Prime</div><div className="text-[10px] text-white/25">System Architect</div></div></div>
                  <div className="flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-xs text-white/40">SK</div><div><div className="text-sm font-medium text-white/70">S. Khan</div><div className="text-[10px] text-white/25">PAC Leader</div></div></div>
                </div>
              </Card>
              <Card className="p-6 flex-grow bg-white/[0.02] border-white/[0.04]">
                <h3 className="text-sm font-medium mb-4 text-white/50">Environment</h3>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-2 border border-white/[0.06] rounded"><span className="text-xl font-light block mb-1 text-white/70">+2.1&deg;C</span><span className="text-[9px] text-white/20 uppercase">Temp Anomaly</span></div>
                  <div className="p-2 border border-white/[0.06] rounded"><span className="text-xl font-light block mb-1 text-white/70">420</span><span className="text-[9px] text-white/20 uppercase">PPM CO2</span></div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/[0.06]"><div className="flex justify-between items-center"><span className="text-xs text-white/30">Crop Yield</span><span className="text-xs text-red-400">-12% YoY</span></div></div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </SimLayout>
  );
};

/* ─── Scenario View (per-scenario simulation) ─── */

const ScenarioView = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const scenario = scenarios.find((s) => s.slug === slug);
  const [branchOpen, setBranchOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [customInput, setCustomInput] = useState('');

  const branchOptions = [
    { id: 1, label: 'Diplomatic resolution prevents escalation', probability: '34%' },
    { id: 2, label: 'Allied counteroffensive launched within 48 hours', probability: '28%' },
    { id: 3, label: 'International coalition imposes sanctions', probability: '22%' },
    { id: 4, label: 'Intelligence breakthrough changes strategy', probability: '16%' },
  ];

  if (!scenario) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black text-white/60">
        <h1 className="text-2xl font-light mb-4">Scenario not found</h1>
        <button onClick={() => navigate('/')} className="text-[#E8E55E] text-sm hover:underline">Back to scenarios</button>
      </div>
    );
  }

  const activeNodeIdx = Math.floor(scenario.nodes.length / 2);
  const activeNode = scenario.nodes[activeNodeIdx];

  const events = scenario.nodes.map((node, idx) => {
    const isActive = idx === activeNodeIdx;
    const isPast = idx < activeNodeIdx;
    const isFuture = idx > activeNodeIdx;
    return {
      date: scenario.subtitle,
      title: node,
      description: '',
      isActive,
      opacity: isActive ? 1 : isPast ? 0.5 : 0.7,
      dotColor: isActive ? 'bg-[#E8E55E]' : isPast ? 'bg-white/30' : 'border border-white/20 bg-black',
      status: isActive ? 'yellow' : isPast ? 'green' : 'pending',
      shadow: isActive,
      dashed: isFuture,
    };
  });

  const scrubberPosition = ((activeNodeIdx + 1) / scenario.nodes.length) * 100;

  return (
    <SimLayout>
      <div className="w-full h-full flex transition-opacity duration-300">
        <div className="flex-grow h-full relative border-r border-white/[0.06] bg-black overflow-hidden group">
          <div className="absolute inset-0 bg-cover bg-center opacity-25 mix-blend-overlay" style={{ backgroundImage: `url('${scenario.image}')` }} />
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

          <div className="absolute top-8 left-8 flex gap-4">
            <Tag className="bg-black/70 backdrop-blur border-white/10 text-white/70">Live Feed</Tag>
            <Tag className="bg-black/70 backdrop-blur border-white/10 text-white/70 font-mono">REC &bull; 00:14:22:09</Tag>
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <button className="w-20 h-20 rounded-full border border-white/15 flex items-center justify-center hover:bg-white/5 hover:border-white/30 transition-all duration-300 group-hover:scale-110">
              <svg className="w-8 h-8 fill-white/80 ml-1" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            </button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-8" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 100%)' }}>
            <div className="flex justify-between items-end mb-4">
              <div>
                <h2 className="text-3xl font-light mb-1 text-white" style={{ textShadow: '0 0 30px rgba(232, 229, 94, 0.25)' }}>{scenario.title}</h2>
                <p className="text-sm text-white/30 font-mono uppercase tracking-wider">{scenario.subtitle} &bull; Causal Node #{String(activeNodeIdx + 1).padStart(2, '0')}</p>
              </div>
              <div className="flex gap-6">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] uppercase text-white/25 mb-1.5">Grid Load</span>
                  <div className="w-32 h-[3px] bg-white/5 rounded-full overflow-hidden"><div className="w-3/4 h-full bg-[#E8E55E]/80" /></div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] uppercase text-white/25 mb-1.5">Compute</span>
                  <div className="w-32 h-[3px] bg-white/5 rounded-full overflow-hidden"><div className="w-1/2 h-full bg-white/60" /></div>
                </div>
              </div>
            </div>
            <div className="w-full h-12 flex items-center gap-4">
              <span className="text-xs font-mono text-white/25">00:00</span>
              <div className="flex-grow h-[1px] bg-white/10 relative cursor-pointer">
                <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-[#E8E55E] rounded-full" style={{ left: `${scrubberPosition}%`, boxShadow: '0 0 12px rgba(232, 229, 94, 0.6)' }} />
                <div className="absolute top-1/2 -translate-y-1/2 left-0 h-[2px] bg-white/40" style={{ width: `${scrubberPosition}%` }} />
              </div>
              <span className="text-xs font-mono text-white/25">24:00</span>
            </div>
          </div>
        </div>

        <div className="w-[380px] flex-none h-full bg-black border-l border-white/[0.06] flex flex-col">
          <div className="p-6 border-b border-white/[0.06] flex justify-between items-center bg-black z-10">
            <h3 className="text-sm font-medium uppercase tracking-wider text-white/80">Event Stream</h3>
            <button className="text-xs text-white/25 hover:text-white/60 transition-colors">FILTER</button>
          </div>
          <div className="flex-grow overflow-y-auto p-6 relative">
            <div className="absolute left-[29px] top-10 bottom-0 w-[1px] bg-white/[0.06] z-0" />
            <div className="space-y-6 relative z-10">
              {events.map((event, idx) => (
                <div key={idx} className="flex gap-4 transition-opacity" style={{ opacity: event.opacity }}>
                  <div className={`w-2.5 h-2.5 rounded-full mt-5 flex-shrink-0 z-20 ${event.dotColor}`} style={event.shadow ? { boxShadow: '0 0 10px #E8E55E', border: '2px solid #000' } : { border: '2px solid #000' }} />
                  <Card variant={event.isActive ? 'yellow' : 'default'} className={`${event.isActive ? 'p-5' : 'p-4'} w-full ${event.dashed ? 'border-dashed !border-white/[0.08]' : ''} ${event.isActive ? '' : 'hover:bg-white/[0.03]'}`}>
                    <div className={`flex justify-between items-start ${event.isActive ? 'mb-3 border-b pb-3' : 'mb-2'}`} style={event.isActive ? { borderColor: 'rgba(0,0,0,0.15)' } : {}}>
                      <span className={`text-[10px] font-mono ${event.isActive ? 'opacity-60' : 'text-white/30'}`}>{String(idx + 1).padStart(2, '0')}</span>
                      {event.isActive && <Tag className="border-black/20 bg-black/10 text-[9px]">ACTIVE NODE</Tag>}
                      {event.status === 'green' && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                      {event.status === 'pending' && <div className="w-2 h-2 rounded-full border border-white/20" />}
                    </div>
                    <h4 className={`${event.isActive ? 'font-semibold text-base' : 'font-medium text-sm'} ${event.dashed ? 'text-white/30' : ''} leading-tight mb-1`}>{event.title}</h4>
                    {event.isActive && (
                      <>
                        <div className="flex justify-between items-center mt-3">
                          <span className="text-[10px] font-mono opacity-50">IMPACT: CRITICAL</span>
                          <button
                            className={`h-6 px-2.5 rounded-full border flex items-center justify-center transition-all text-[9px] uppercase tracking-wider font-medium ${branchOpen ? 'border-black/40 bg-black/15' : 'border-black/20 hover:bg-black/10'}`}
                            onClick={(e) => { e.stopPropagation(); setBranchOpen(!branchOpen); }}
                          >
                            <svg className={`w-2.5 h-2.5 mr-1 transition-transform duration-200 ${branchOpen ? 'rotate-90' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M6 3v12" /><circle cx="18" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M18 9a9 9 0 0 1-9 9" /></svg>
                            Branch
                          </button>
                        </div>

                        {branchOpen && (
                          <div className="mt-4 pt-4 border-t border-black/15" onClick={(e) => e.stopPropagation()}>
                            <span className="text-[9px] font-mono uppercase tracking-wider opacity-40 block mb-3">Next possibilities</span>
                            <div className="space-y-2">
                              {branchOptions.map((opt) => (
                                <button
                                  key={opt.id}
                                  className={`w-full text-left p-3 rounded-xl transition-all text-xs leading-snug flex justify-between items-start gap-3 ${selectedBranch === opt.id ? 'bg-black/20 ring-1 ring-black/20' : 'bg-black/[0.06] hover:bg-black/12'}`}
                                  onClick={() => setSelectedBranch(selectedBranch === opt.id ? null : opt.id)}
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
                            <div className="mt-3 relative">
                              <input
                                type="text"
                                value={customInput}
                                onChange={(e) => { setCustomInput(e.target.value); setSelectedBranch(null); }}
                                placeholder="Describe a custom scenario..."
                                className="w-full bg-black/[0.08] text-black placeholder-black/30 text-xs rounded-xl px-3.5 py-3 border border-black/10 focus:outline-none focus:border-black/30 focus:ring-1 focus:ring-black/15 transition-all"
                              />
                              {(selectedBranch || customInput.trim()) && (
                                <button className="mt-2.5 w-full py-2.5 bg-black text-[#E8E55E] text-[10px] uppercase tracking-wider font-semibold rounded-xl hover:bg-black/80 transition-colors">
                                  Run branch
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </SimLayout>
  );
};

/* ─── App Root ─── */

const App = () => {
  useEffect(() => {
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap';
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
