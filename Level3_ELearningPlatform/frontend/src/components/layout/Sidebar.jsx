import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '◧' },
  { to: '/courses', label: 'Browse Courses', icon: '◫' },
  { to: '/my-courses', label: 'My Courses', icon: '◩' },
  { to: '/certificates', label: 'Certificates', icon: '◪' },
  { to: '/profile', label: 'Profile', icon: '◨' },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <button
          className="fixed inset-0 bg-ink/40 z-30 lg:hidden"
          onClick={onClose}
          aria-label="Close menu"
        />
      )}

      <aside
        className={`fixed lg:static top-0 left-0 h-full lg:h-auto w-64 bg-ink text-paper flex flex-col z-40 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="px-6 py-6 border-b border-white/10">
          <p className="font-display text-2xl tracking-tight">
            Ledger<span className="text-amber">.</span>
          </p>
          <p className="text-xs text-paper/50 mt-1">Learn with intent</p>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-chip text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-amber text-ink'
                    : 'text-paper/70 hover:bg-white/10 hover:text-paper'
                }`
              }
            >
              <span className="text-base leading-none">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-6 py-5 border-t border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-amber text-ink font-semibold text-sm flex items-center justify-center">
              {user?.avatarInitials || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{user?.name || 'Student'}</p>
              <p className="text-xs text-paper/50 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full text-left text-xs font-medium text-paper/60 hover:text-clay transition-colors"
          >
            Sign out →
          </button>
        </div>
      </aside>
    </>
  );
}
