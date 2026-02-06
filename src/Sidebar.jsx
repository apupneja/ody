export default function Sidebar() {
  return (
    <aside className="sidebar">
      {/* Header */}
      <div className="sidebar-header">
        <div className="workspace-selector">
          <span className="logo-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5z" fill="rgb(36,37,41)" />
              <path d="M2 17l10 5 10-5" stroke="rgb(36,37,41)" strokeWidth="2" fill="none" />
              <path d="M2 12l10 5 10-5" stroke="rgb(36,37,41)" strokeWidth="2" fill="none" />
            </svg>
          </span>
          Redapto
          <span className="chevron">
            <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
            </svg>
          </span>
        </div>
        <div className="sidebar-header-actions">
          <button className="sidebar-header-btn" title="Sidebar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="9" y1="3" x2="9" y2="21" />
            </svg>
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-bar">
        <button className="quick-actions-btn">
          <span className="icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <path d="M8 12h8M12 8v8" />
            </svg>
          </span>
          Quick actions
          <span className="shortcut">⌘K</span>
        </button>
        <button className="search-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4-4" />
          </svg>
        </button>
        <button className="search-btn">
          <span className="shortcut">/</span>
        </button>
      </div>

      {/* Main Nav */}
      <nav className="sidebar-nav">
        <NavItem icon={<BellIcon />} label="Notifications" />
        <NavItem icon={<CheckIcon />} label="Tasks" badge="1" />
        <NavItem icon={<NoteIcon />} label="Notes" />
        <NavItem icon={<MailIcon />} label="Emails" />
        <NavItem icon={<PhoneIcon />} label="Calls" />
        <NavItem icon={<ChartIcon />} label="Reports" active />
        <NavItem icon={<PlayIcon />} label="Automations" chevron />
        <div className="sub-nav">
          <NavItem icon={<SendIcon />} label="Sequences" />
          <NavItem icon={<WorkflowIcon />} label="Workflows" />
        </div>
      </nav>

      {/* Favorites */}
      <div className="sidebar-section">
        <div className="sidebar-section-title">Favorites</div>
        <NavItem icon={<DashGridIcon />} label="asdas" />
        <NavItem icon={<DashGridIcon />} label="New Dashboard" />
        <NavItem icon={<DashGridIcon />} label="Companies by Country" />
      </div>

      {/* Records */}
      <div className="sidebar-section">
        <div className="sidebar-section-title">Records</div>
        <NavItem icon={<RecordIcon color="rgb(38, 109, 240)" />} label="Companies" />
        <NavItem icon={<RecordIcon color="rgb(234, 179, 8)" />} label="People" />
        <NavItem icon={<RecordIcon color="rgb(239, 68, 68)" />} label="Deals" />
        <NavItem icon={<RecordIcon color="rgb(34, 197, 94)" />} label="dsdfa" />
      </div>

      {/* Lists */}
      <div className="sidebar-section">
        <div className="sidebar-section-title">Lists</div>
        <NavItem icon={<ListIcon color="rgb(34, 197, 94)" />} label="Outsourcing" />
        <NavItem icon={<ListIcon color="rgb(239, 68, 68)" />} label="Custom" />
      </div>

      {/* Bottom */}
      <div className="sidebar-bottom">
        <div className="getting-started">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgb(80,81,84)" strokeWidth="2">
            <path d="M12 20V10M6 20V16M18 20V4" strokeLinecap="round" />
          </svg>
          Getting started 86%
        </div>
        <NavItem icon={<UserPlusIcon />} label="Invite team members" />
      </div>
    </aside>
  );
}

function NavItem({ icon, label, active, badge, chevron }) {
  return (
    <div className={`nav-item${active ? ' active' : ''}`}>
      <span className="nav-icon">{icon}</span>
      {label}
      {badge && <span className="badge">{badge}</span>}
      {chevron && (
        <span className="chevron">
          <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor">
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
          </svg>
        </span>
      )}
    </div>
  );
}

// Icon components
function BellIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function NoteIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <path d="M14 2v6h6" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 7l-10 7L2 7" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="5" y="2" width="14" height="20" rx="3" />
      <line x1="12" y1="18" x2="12" y2="18" />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M8 16V12M12 16V8M16 16V11" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polygon points="6,3 20,12 6,21" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  );
}

function WorkflowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="5" cy="6" r="3" />
      <circle cx="19" cy="6" r="3" />
      <circle cx="12" cy="18" r="3" />
      <path d="M5 9v3a3 3 0 003 3h8a3 3 0 003-3V9" />
      <path d="M12 15v-3" />
    </svg>
  );
}

function DashGridIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <rect x="1" y="1" width="5" height="5" rx="1.5" fill="rgb(239, 68, 68)" />
      <rect x="8" y="1" width="5" height="5" rx="1.5" fill="rgb(234, 179, 8)" />
      <rect x="1" y="8" width="5" height="5" rx="1.5" fill="rgb(38, 109, 240)" />
      <rect x="8" y="8" width="5" height="5" rx="1.5" fill="rgb(168, 85, 247)" />
    </svg>
  );
}

function RecordIcon({ color }) {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="2" width="12" height="12" rx="3" fill={color} />
      <text x="8" y="11" textAnchor="middle" fill="white" fontSize="8" fontWeight="600" fontFamily="Inter">
        {color === 'rgb(38, 109, 240)' ? 'C' : color === 'rgb(234, 179, 8)' ? 'P' : color === 'rgb(239, 68, 68)' ? 'D' : 'G'}
      </text>
    </svg>
  );
}

function ListIcon({ color }) {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" fill={color} />
      <path d="M5 8l2 2 4-4" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function UserPlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <line x1="20" y1="8" x2="20" y2="14" />
      <line x1="23" y1="11" x2="17" y2="11" />
    </svg>
  );
}
