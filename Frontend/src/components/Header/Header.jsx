import { useState } from 'react'
import { useAuth } from '../../context/AuthContext.jsx'
import { Link, useNavigate } from 'react-router-dom'

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { to: '/', label: 'News' },
    { to: '/videos', label: 'Interviews' },
    { to: '/archives', label: 'Archives' },
    { to: '/live-scores', label: 'Live Scores' },
    { to: '/contact', label: 'Contact' },
  ];

  function handleSignIn() {
    setMenuOpen(false);
    navigate('/login');
  }

  function handleSignOut() {
    setMenuOpen(false);
    logout();
    navigate('/');
  }

  function handleNavClick() {
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl">
      <div className="page-container py-4">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3" onClick={handleNavClick}>
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-blue-700 text-lg font-black text-white shadow-lg shadow-blue-950/30">
              KTV
            </span>
            <span>
              <span className="block text-xl font-semibold text-white">KhelKhoodTV</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2 py-2 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-full px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            {!user ? (
              <button onClick={handleSignIn} className="secondary-button">
                Log In
              </button>
            ) : (
              <button onClick={handleSignOut} className="secondary-button">
                Logout
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white transition hover:bg-white/10 lg:hidden"
            aria-expanded={menuOpen}
            aria-label="Toggle navigation menu"
          >
            <span className="flex flex-col gap-1.5">
              <span className="h-0.5 w-5 rounded-full bg-current" />
              <span className="h-0.5 w-5 rounded-full bg-current" />
              <span className="h-0.5 w-5 rounded-full bg-current" />
            </span>
          </button>
        </div>

        {menuOpen ? (
          <div className="mt-4 rounded-3xl border border-white/10 bg-slate-950/95 p-4 shadow-2xl lg:hidden">
            <nav className="grid gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={handleNavClick}
                  className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              {!user ? (
                <button onClick={handleSignIn} className="primary-button w-full sm:w-auto">
                  Log In
                </button>
              ) : (
                <button onClick={handleSignOut} className="primary-button w-full sm:w-auto">
                  Logout
                </button>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}