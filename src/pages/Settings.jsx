import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { FaUserMd, FaLock } from 'react-icons/fa'

const Settings = () => {
  const { user, updateProfile, changePassword } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  // Profile State
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || 'doctor',
    department: 'Cardiology', // Placeholder
    specialization: 'Interventionist' // Placeholder
  })

  // Password State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })



  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      await updateProfile(profileData)
      setMessage({ type: 'success', text: 'Profile updated successfully' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile' })
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' })
      return
    }

    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword)
      setMessage({ type: 'success', text: 'Password changed successfully' })
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to change password' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Account Settings</h1>
        <p className="text-slate-600 mb-8">Manage your profile, security, and application preferences.</p>

        <div className="bg-white rounded-2xl shadow-clean border border-slate-200 overflow-hidden min-h-[600px] flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-slate-50 border-r border-slate-200 p-6 space-y-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'profile'
                ? 'bg-medical-primary text-white shadow-clean'
                : 'text-slate-600 hover:bg-slate-200'
                }`}
            >
              <FaUserMd className="text-lg" />
              <span className="font-medium">Profile</span>
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${activeTab === 'security'
                ? 'bg-medical-primary text-white shadow-clean'
                : 'text-slate-600 hover:bg-slate-200'
                }`}
            >
              <FaLock className="text-lg" />
              <span className="font-medium">Security</span>
            </button>

          </div>

          {/* Content Area */}
          <div className="flex-1 p-8">
            {message.text && (
              <div className={`mb-6 p-4 rounded-lg flex items-center ${message.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                <div className={`w-2 h-2 rounded-full mr-2 ${message.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
                  }`}></div>
                {message.text}
              </div>
            )}

            {activeTab === 'profile' && (
              <form onSubmit={handleProfileUpdate} className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-4">Profile Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Full Name</label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-medical-primary/20 focus:border-medical-primary outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Email Address</label>
                    <input
                      type="email"
                      value={profileData.email}
                      disabled
                      className="w-full px-4 py-2.5 border border-slate-200 bg-slate-50 text-slate-500 rounded-lg cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Department</label>
                    <select
                      value={profileData.department}
                      onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-medical-primary/20 focus:border-medical-primary outline-none transition-all bg-white"
                    >
                      <option>Urology</option>
                      <option>Nephrology</option>
                      <option>Radiology</option>

                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Role</label>
                    <input
                      type="text"
                      value={profileData.role}
                      disabled
                      className="w-full px-4 py-2.5 border border-slate-200 bg-slate-50 text-slate-500 rounded-lg capitalize cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-medical-primary text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-sky-700 transition-colors shadow-sm disabled:opacity-50"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            )}

            {activeTab === 'security' && (
              <form onSubmit={handlePasswordChange} className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-4">Change Password</h2>

                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Current Password</label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-medical-primary/20 focus:border-medical-primary outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">New Password</label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-medical-primary/20 focus:border-medical-primary outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Confirm New Password</label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-medical-primary/20 focus:border-medical-primary outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-medical-primary text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-sky-700 transition-colors shadow-sm disabled:opacity-50"
                  >
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            )}


          </div>
        </div>
      </div>
    </div >
  )
}

export default Settings
