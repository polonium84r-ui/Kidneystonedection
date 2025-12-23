import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { FaKey, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa'

const PasswordChangeRequired = () => {
  const { user, changePassword } = useAuth()
  const navigate = useNavigate()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isChanging, setIsChanging] = useState(false)

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setError('')
    setIsChanging(true)

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all fields')
      setIsChanging(false)
      return
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long')
      setIsChanging(false)
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      setIsChanging(false)
      return
    }

    try {
      await changePassword(currentPassword, newPassword)
      // Force redirect to home/dashboard
      navigate('/')
    } catch (err) {
      setError(err.message || 'Failed to change password')
      setIsChanging(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl border-2 border-medical-blue/20 p-8">
          {/* Warning Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <FaExclamationTriangle className="text-yellow-600 text-2xl" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Password Change Required
            </h1>
            <p className="text-gray-600 text-sm">
              You are using a temporary password. Please set a new password to continue.
            </p>
          </div>

          {/* User Info */}
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-3">
              <FaKey className="text-medical-blue text-xl" />
              <div>
                <p className="font-semibold text-gray-800">{user?.name}</p>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border-2 border-red-400 rounded-xl p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Password Change Form */}
          <form onSubmit={handleChangePassword} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Current (Temporary) Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-medical-blue focus:outline-none transition-colors"
                placeholder="Enter current password"
                required
                disabled={isChanging}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-medical-blue focus:outline-none transition-colors"
                placeholder="Enter new password (min 6 characters)"
                required
                disabled={isChanging}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-medical-blue focus:outline-none transition-colors"
                placeholder="Confirm new password"
                required
                disabled={isChanging}
              />
            </div>

            <button
              type="submit"
              disabled={isChanging}
              className="w-full bg-gradient-medical text-white py-3 rounded-xl font-semibold text-lg shadow-medical-glow hover:shadow-medical-glow-strong transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isChanging ? 'Changing Password...' : 'Set New Password'}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <div className="flex items-start space-x-3">
              <FaCheckCircle className="text-blue-600 text-lg mt-0.5" />
              <div>
                <p className="text-sm text-blue-800">
                  <strong>Security Notice:</strong> Your password will never be shown again after you set it.
                  If you forget it, contact the administrator for a reset.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PasswordChangeRequired