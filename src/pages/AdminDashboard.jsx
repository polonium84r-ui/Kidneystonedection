import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { FaUserMd, FaPlus, FaKey, FaUserCheck, FaUserTimes, FaEye, FaEyeSlash, FaChartLine } from 'react-icons/fa'

const AdminDashboard = () => {
  const {
    user,
    getAllDoctors,
    createDoctorAccount,
    resetDoctorPassword,
    deactivateDoctor,
    activateDoctor
  } = useAuth()

  const [doctors, setDoctors] = useState([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showResetForm, setShowResetForm] = useState(null)
  const [newDoctor, setNewDoctor] = useState({ name: '', email: '', password: '' })
  const [resetPassword, setResetPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPasswords, setShowPasswords] = useState({})

  useEffect(() => {
    loadDoctors()
  }, [])

  const loadDoctors = async () => {
    const doctorsList = await getAllDoctors()
    setDoctors(doctorsList)
  }

  const handleCreateDoctor = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      if (!newDoctor.name || !newDoctor.email || !newDoctor.password) {
        throw new Error('Please fill in all fields')
      }

      if (newDoctor.password.length < 6) {
        throw new Error('Password must be at least 6 characters long')
      }

      await createDoctorAccount(newDoctor)
      setSuccess(`Doctor account created successfully for ${newDoctor.name}`)
      setNewDoctor({ name: '', email: '', password: '' })
      setShowCreateForm(false)
      await loadDoctors()

      setTimeout(() => setSuccess(''), 5000)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleResetPassword = async (doctorId) => {
    setError('')
    setSuccess('')

    try {
      if (!resetPassword || resetPassword.length < 6) {
        throw new Error('Temporary password must be at least 6 characters long')
      }

      await resetDoctorPassword(doctorId, resetPassword)
      setSuccess(`Temporary password set. Doctor must change it on next login.`)
      setResetPassword('')
      setShowResetForm(null)
      await loadDoctors()

      setTimeout(() => setSuccess(''), 5000)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleToggleActive = async (doctorEmail, isActive) => {
    try {
      if (isActive) {
        await deactivateDoctor(doctorEmail)
        setSuccess(`Doctor account deactivated: ${doctorEmail}`)
      } else {
        await activateDoctor(doctorEmail)
        setSuccess(`Doctor account activated: ${doctorEmail}`)
      }
      await loadDoctors()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message)
    }
  }

  const togglePasswordVisibility = (doctorId) => {
    setShowPasswords(prev => ({
      ...prev,
      [doctorId]: !prev[doctorId]
    }))
  }

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'
    let password = ''
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return password
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">Only administrators can access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage doctor accounts and system settings
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 bg-green-50 border-2 border-green-400 rounded-xl p-4">
            <p className="text-green-800 font-semibold">{success}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border-2 border-red-400 rounded-xl p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg border-2 border-blue-100 p-6">
            <div className="flex items-center space-x-4">
              <FaUserMd className="text-blue-600 text-3xl" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Total Doctors</h3>
                <p className="text-2xl font-bold text-blue-600">{doctors.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border-2 border-green-100 p-6">
            <div className="flex items-center space-x-4">
              <FaUserCheck className="text-green-600 text-3xl" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Active Doctors</h3>
                <p className="text-2xl font-bold text-green-600">
                  {doctors.filter(d => d.isActive).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border-2 border-yellow-100 p-6">
            <div className="flex items-center space-x-4">
              <FaKey className="text-yellow-600 text-3xl" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Need Password Change</h3>
                <p className="text-2xl font-bold text-yellow-600">
                  {doctors.filter(d => d.needsPasswordChange).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border-2 border-purple-100 p-6">
            <div className="flex items-center space-x-4">
              <FaChartLine className="text-purple-600 text-3xl" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Total System Analyses</h3>
                <p className="text-2xl font-bold text-purple-600">
                  {doctors.reduce((sum, doc) => sum + (doc.analysisCount || 0), 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Create Doctor Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:bg-blue-700 transition-all duration-300 hover:scale-105 flex items-center space-x-2"
          >
            <FaPlus />
            <span>Create New Doctor Account</span>
          </button>
        </div>

        {/* Create Doctor Form */}
        {showCreateForm && (
          <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-100 p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Create New Doctor Account</h2>
            <form onSubmit={handleCreateDoctor} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Doctor Name</label>
                  <input
                    type="text"
                    value={newDoctor.name}
                    onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                    placeholder="Dr. John Smith"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Gmail ID</label>
                  <input
                    type="email"
                    value={newDoctor.email}
                    onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                    placeholder="doctor@hospital.com"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Initial Password</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newDoctor.password}
                    onChange={(e) => setNewDoctor({ ...newDoctor, password: e.target.value })}
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
                    placeholder="Enter password (min 6 characters)"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setNewDoctor({ ...newDoctor, password: generateRandomPassword() })}
                    className="px-4 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
                  >
                    Generate
                  </button>
                </div>
              </div>
              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-md"
                >
                  Create Account
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="bg-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Doctors List */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-blue-100 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-800">Doctor Accounts</h2>
          </div>

          {doctors.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No doctor accounts created yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Analyses</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Password Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {doctors.map((doctor) => (
                    <tr key={doctor._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-800">{doctor.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{doctor.email}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${doctor.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                          }`}>
                          {doctor.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-gray-800 bg-gray-100 px-3 py-1 rounded-full">
                          {doctor.analysisCount || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${doctor.needsPasswordChange
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                          }`}>
                          {doctor.needsPasswordChange ? 'Needs Change' : 'Set'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setShowResetForm(showResetForm === doctor._id ? null : doctor._id)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
                            title="Reset Password"
                          >
                            <FaKey />
                          </button>
                          <button
                            onClick={() => handleToggleActive(doctor.email, doctor.isActive)}
                            className={`text-sm font-semibold ${doctor.isActive
                              ? 'text-red-600 hover:text-red-800'
                              : 'text-green-600 hover:text-green-800'
                              }`}
                            title={doctor.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {doctor.isActive ? <FaUserTimes /> : <FaUserCheck />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Reset Password Form */}
        {showResetForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Reset Password for {doctors.find(d => d._id === showResetForm)?.name}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Temporary Password
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={resetPassword}
                      onChange={(e) => setResetPassword(e.target.value)}
                      className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-medical-blue focus:outline-none"
                      placeholder="Enter temporary password"
                    />
                    <button
                      type="button"
                      onClick={() => setResetPassword(generateRandomPassword())}
                      className="px-4 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
                    >
                      Generate
                    </button>
                  </div>
                </div>
                <div className="bg-yellow-50 border border-yellow-400 rounded-lg p-3">
                  <p className="text-sm text-yellow-800">
                    The doctor will be required to change this password on their next login.
                  </p>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleResetPassword(showResetForm)}
                    className="flex-1 bg-medical-blue text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Reset Password
                  </button>
                  <button
                    onClick={() => {
                      setShowResetForm(null)
                      setResetPassword('')
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard