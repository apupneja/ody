export default function ReportsPage() {
  const dashboards = [
    { name: 'Companies by Country', reports: ['Companies by Country Count', 'New report'], created: 'November 24, 2025', starred: true },
    { name: 'New Dashboard', reports: ['New report'], created: 'November 25, 2025', starred: true },
    { name: 'asdas', reports: [], created: 'November 25, 2025', starred: true },
    { name: 'New Dashboard', reports: [], created: 'November 25, 2025', starred: false },
    { name: 'New Dashboard', reports: [], created: 'November 25, 2025', starred: false },
    { name: 'New Dashboard', reports: [], created: 'November 26, 2025', starred: false },
  ];

  const favorites = [
    { name: 'asdas', type: 'chart' },
    { name: 'New Dashboard', type: 'single', iconColor: 'yellow' },
    { name: 'Companies by Country', type: 'double', icons: ['blue', 'orange'] },
  ];

  return (
    <div className="main-content">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title">
          <span className="title-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M8 16V12M12 16V8M16 16V11" />
            </svg>
          </span>
          Reports
        </div>
        <div className="help-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          Help
        </div>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="toolbar-left">
          <button className="sort-btn">
            <span className="sort-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M3 6h18M6 12h12M9 18h6" />
              </svg>
            </span>
            <span className="sort-label">Sorted by</span>
            <span className="sort-value">Creation date</span>
          </button>
        </div>
        <div className="toolbar-right">
          <button className="toolbar-icon-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4-4" />
            </svg>
          </button>
          <button className="view-settings-btn">
            <span className="settings-icon">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </span>
            View settings
          </button>
          <button className="new-dashboard-btn">
            + New dashboard
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="content-scroll">
        {/* Favorites */}
        <div className="favorites-section">
          <div className="section-label">Favorites</div>
          <div className="favorites-grid">
            {favorites.map((fav, i) => (
              <div key={i} className="favorite-card">
                <div className="favorite-card-preview">
                  {fav.type === 'chart' && (
                    <div className="card-chart-placeholder">
                      <div className="bar" style={{ height: '30px' }} />
                      <div className="bar" style={{ height: '50px' }} />
                      <div className="bar" style={{ height: '40px' }} />
                    </div>
                  )}
                  {fav.type === 'single' && (
                    <div className={`card-report-icon ${fav.iconColor}`}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <path d="M8 16V12M12 16V8M16 16V11" />
                      </svg>
                    </div>
                  )}
                  {fav.type === 'double' && (
                    <>
                      {fav.icons.map((color, j) => (
                        <div key={j} className="card-mini-preview">
                          <div className={`card-report-icon ${color}`}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                              <rect x="3" y="3" width="18" height="18" rx="2" />
                              <path d="M8 16V12M12 16V8M16 16V11" />
                            </svg>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
                <div className="favorite-card-title">{fav.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Dashboard Table */}
        <div className="dashboard-table">
          {/* Table Header */}
          <div className="table-header">
            <div className="col col-dashboard">Dashboard</div>
            <div className="col col-reports">
              <span className="col-icon">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M8 16V12M12 16V8M16 16V11" />
                </svg>
              </span>
              Reports
            </div>
            <div className="col col-created">
              <span className="col-icon">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </span>
              Created at
            </div>
            <div className="col col-star" />
          </div>

          {/* Group Header */}
          <div className="group-header">
            Created last year
            <span className="group-count">6</span>
          </div>

          {/* Rows */}
          {dashboards.map((dash, i) => (
            <div key={i} className="table-row">
              <div className="row-dashboard">
                <span className="row-dashboard-icon">
                  <div className="dashboard-grid-icon">
                    <span className="dot r" />
                    <span className="dot y" />
                    <span className="dot b" />
                    <span className="dot p" />
                  </div>
                </span>
                <span className="row-dashboard-name">{dash.name}</span>
              </div>
              <div className="row-reports">
                {dash.reports.map((report, j) => (
                  <span key={j} className="report-tag">
                    <span className="tag-icon">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <path d="M8 16V12M12 16V8M16 16V11" />
                      </svg>
                    </span>
                    {report}
                  </span>
                ))}
              </div>
              <div className="row-created">{dash.created}</div>
              <div className="row-star">
                <span className={`star-icon${dash.starred ? '' : ' empty'}`}>★</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
