import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { FaUserMd, FaHome, FaUpload, FaChartLine, FaSignOutAlt, FaUserShield, FaCog, FaInfoCircle, FaFileMedical } from 'react-icons/fa'

const Navbar = () => {
  const { user, logout, isAdmin, canUseApp } = useAuth()
  const location = useLocation()

  const handleLogout = () => {
    logout()
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  const navItems = [
    { path: '/', icon: FaHome, label: 'Dashboard' },
    { path: '/about', icon: FaInfoCircle, label: 'About' },
    ...(canUseApp ? [
      { path: '/upload', icon: FaUpload, label: 'Upload Scan' },
      { path: '/analysis', icon: FaChartLine, label: 'Analysis' }
    ] : []),
    { path: '/settings', icon: FaCog, label: 'Settings' },
    ...(isAdmin ? [
      { path: '/admin', icon: FaUserShield, label: 'Admin' }
    ] : [])
  ]

  return (
    <nav className="bg-white shadow-clean border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative flex items-center justify-center h-10 w-10 bg-medical-primary/10 rounded-lg">
              <FaFileMedical className="text-medical-primary text-xl" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-slate-800 tracking-tight leading-tight">
                Kidney Stone
              </h1>
              <p className="text-xs text-slate-500 font-medium tracking-wide">DETECTION SYSTEM</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(item.path)
                    ? 'bg-medical-primary/10 text-medical-primary'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-medical-primary'
                    }`}
                >
                  <Icon className={`text-lg ${isActive(item.path) ? 'text-medical-primary' : 'text-slate-400 group-hover:text-medical-primary'}`} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* User Info & Logout */}
          <div className="flex items-center space-x-4">
            {/* User Info */}
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
              <div className="flex items-center justify-end space-x-2">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${user?.role === 'admin'
                  ? 'bg-purple-50 text-purple-700 border-purple-100'
                  : 'bg-sky-50 text-sky-700 border-sky-100'
                  }`}>
                  {user?.role === 'admin' ? 'Administrator' : 'Medical Doctor'}
                </span>
                {user?.needsPasswordChange && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-700 border border-yellow-100 font-medium">
                    Update Password
                  </span>
                )}
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 py-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 text-sm font-medium"
              title="Sign Out"
            >
              <FaSignOutAlt />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-4">
          <div className="flex flex-wrap gap-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(item.path)
                    ? 'bg-medical-primary/10 text-medical-primary'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-medical-primary'
                    }`}
                >
                  <Icon />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar