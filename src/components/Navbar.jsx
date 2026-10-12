import { isStaff } from '../store.js';

const LINKS = [
  { nav: 'dashboard', label: 'Dashboard' },
  { nav: 'books', label: 'Manage Books', role: 'staff' },
  { nav: 'transactions', label: 'Transactions', role: 'loggedin' },
  { nav: 'users', label: 'Members', role: 'staff' }
];

export default function Navbar({ view, user, onNavigate, onLogout }) {
  const visible = link => {
    if (link.role === 'staff') return isStaff(user);
    if (link.role === 'loggedin') return !!user;
    return true;
  };

  return (
    <header className="navbar">
      <div className="nav-inner">
        <div className="nav-brand" onClick={() => onNavigate('dashboard')}>
          <span className="brand-mark">WA</span>
          <span className="brand-name">Wisdom Archives</span>
        </div>

        <nav className="nav-links">
          {LINKS.filter(visible).map(link => (
            <button
              key={link.nav}
              className={'nav-link' + (view === link.nav ? ' active' : '')}
              onClick={() => onNavigate(link.nav)}
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="nav-access">
          {!user ? (
            <>
              <span className="guest-pill">Browsing as guest</span>
              <button className="btn-login" onClick={() => onNavigate('login')}>Log In</button>
            </>
          ) : (
            <div className="account-chip">
              <span
                className="who"
                style={{ cursor: 'pointer' }}
                title="View my account"
                onClick={() => onNavigate('account')}
              >
                <b>{user.name}</b>
                <span className="role-badge">{user.role}</span>
              </span>
              <button className="btn-logout" onClick={onLogout}>Log Out</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
