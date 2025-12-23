import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { FaKey, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa'

const Settings = () => {
  const { user, changePassword } = useAuth()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChangePassword = (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all fields')
      return
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match')
      return
    }

    try {
      changePassword(currentPassword, newPassword)
      setSuccess(true)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')

      // Show success message for 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err.message || 'Failed to change password')
    }
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Account Settings
          </h1>
          <p className="text-gray-600">
            Manage your account security and preferences
          </p>
        </div>

        {/* User Info Card */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-medical-blue/20 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Information</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Name:</span>
              <span className="font-semibold text-gray-800">{user?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-semibold text-gray-800">{user?.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Role:</span>
              <span className="font-semibold text-gray-800 capitalize">{user?.role}</span>
            </div>
          </div>
        </div>

        {/* Password Change Required Warning */}
        {user?.needsPasswordChange && (
          <div className="bg-yellow-50 border-2 border-yellow-400 rounded-xl p-6 mb-6">
            <div className="flex items-start space-x-3">
              <FaExclamationTriangle className="text-yellow-600 text-2xl mt-1" />
              <div>
                <h3 className="font-semibold text-yellow-800 mb-2">Password Change Required</h3>
                <p className="text-yellow-700 text-sm">
                  You are using a temporary password. Please change your password to continue using the application.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Change Password Card */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-medical-blue/20 p-8">
          <div className="flex items-center space-x-3 mb-6">
            <FaKey className="text-medical-blue text-2xl" />
            <h2 className="text-2xl font-semibold text-gray-800">Change Password</h2>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 bg-green-50 border-2 border-green-400 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <FaCheckCircle className="text-green-600 text-xl" />
                <p className="text-green-800 font-semibold">
                  Password changed successfully! Your password will never be shown again.
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border-2 border-red-400 rounded-xl p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-medical-blue focus:outline-none transition-colors"
                placeholder="Enter current password"
                required
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
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-medical text-white py-3 rounded-xl font-semibold text-lg shadow-medical-glow hover:shadow-medical-glow-strong transition-all duration-300 hover:scale-105"
            >
              Change Password
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <p className="text-sm text-blue-800">
              <strong>Security Notice:</strong> Your password will never be shown again after you set it.
              If you forget your password, contact the administrator for a password reset.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
