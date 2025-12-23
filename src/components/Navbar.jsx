import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { FaHeartbeat, FaHome, FaUpload, FaChartLine, FaSignOutAlt, FaUserShield, FaCog, FaInfoCircle } from 'react-icons/fa'

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
      { path: '/upload', icon: FaUpload, label: 'Upload' },
      { path: '/analysis', icon: FaChartLine, label: 'Analysis' }
    ] : []),
    { path: '/settings', icon: FaCog, label: 'Settings' },
    ...(isAdmin ? [
      { path: '/admin', icon: FaUserShield, label: 'Admin' }
    ] : [])
  ]

  return (
    <nav className="bg-white/90 backdrop-blur-xl shadow-lg border-b-2 border-medical-blue/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-medical-pink/20 blur-lg rounded-full group-hover:bg-medical-purple/30 transition-colors"></div>
              <div className="relative bg-gradient-medical p-2 rounded-full shadow-medical-glow group-hover:shadow-medical-glow-strong transition-all duration-300">
                <FaHeartbeat className="text-white text-xl" />
              </div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-medical-blue to-medical-purple bg-clip-text text-transparent">
                Heart Angiography
              </h1>
              <p className="text-xs text-gray-600 -mt-1">Detection System</p>
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
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${isActive(item.path)
                    ? 'bg-gradient-medical text-white shadow-medical-glow'
                    : 'text-gray-700 hover:bg-medical-blue/10 hover:text-medical-blue'
                    }`}
                >
                  <Icon className="text-lg" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>

          {/* User Info & Logout */}
          <div className="flex items-center space-x-4">
            {/* User Info */}
            <div className="hidden sm:block text-right">
              <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
              <div className="flex items-center justify-end space-x-2">
                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${user?.role === 'admin'
                  ? 'bg-purple-100 text-purple-800'
                  : 'bg-blue-100 text-blue-800'
                  }`}>
                  {user?.role === 'admin' ? 'Administrator' : 'Doctor'}
                </span>
                {user?.needsPasswordChange && (
                  <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 font-semibold">
                    Password Change Required
                  </span>
                )}
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-all duration-300 hover:scale-105 shadow-lg"
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
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${isActive(item.path)
                    ? 'bg-gradient-medical text-white shadow-medical-glow'
                    : 'text-gray-700 hover:bg-medical-blue/10 hover:text-medical-blue'
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