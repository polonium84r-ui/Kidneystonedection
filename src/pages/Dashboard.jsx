import { Link } from 'react-router-dom'
import { FaUpload, FaArrowRight, FaFileMedicalAlt, FaMicroscope, FaUserCheck } from 'react-icons/fa'

const Dashboard = () => {


  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex flex-col relative overflow-hidden">

      {/* Hero Section - Professional Medical Background */}
      <div className="flex-grow flex items-center justify-center relative">
        <div className="absolute inset-0 bg-gradient-soft opacity-50 z-0"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          <div className="text-left animate-slide-up">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold tracking-wide mb-6 uppercase">
              <span className="w-2 h-2 rounded-full bg-sky-500 mr-2"></span>
              AI-Powered Radiology Assistant
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-800 leading-tight mb-6">
              Advanced <span className="text-medical-primary">Kidney Stone</span> <br />
              Detection System
            </h1>

            <p className="text-lg text-slate-600 mb-8 max-w-xl leading-relaxed">
              Empowering medical professionals with rapid, high-precision analysis of CT scans for early detection and diagnosis of renal calculi.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/upload"
                className="inline-flex justify-center items-center space-x-2 bg-medical-primary text-white px-8 py-3.5 rounded-lg font-semibold text-base shadow-clean hover:bg-sky-700 transition-all active:scale-95"
              >
                <FaUpload />
                <span>Upload CT Scan</span>
              </Link>

              <Link
                to="/about"
                className="inline-flex justify-center items-center space-x-2 bg-white text-slate-700 border border-slate-200 px-8 py-3.5 rounded-lg font-semibold text-base hover:bg-slate-50 transition-all active:scale-95"
              >
                <span>Learn More</span>
                <FaArrowRight className="text-xs" />
              </Link>
            </div>
          </div>

          {/* Feature Cards / Illustration Area */}
          <div className="hidden lg:grid grid-cols-2 gap-4 animate-fade-in opacity-90">
            <div className="bg-white p-6 rounded-2xl shadow-clean border border-slate-100 transform translate-y-8">
              <div className="h-10 w-10 bg-indigo-50 rounded-lg flex items-center justify-center mb-4">
                <FaMicroscope className="text-indigo-600 text-xl" />
              </div>
              <h3 className="font-bold text-slate-800 text-lg mb-2">High Precision</h3>
              <p className="text-sm text-slate-500">Deep learning algorithms trained on thousands of confirmed medical datasets.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-clean border border-slate-100">
              <div className="h-10 w-10 bg-emerald-50 rounded-lg flex items-center justify-center mb-4">
                <FaFileMedicalAlt className="text-emerald-600 text-xl" />
              </div>
              <h3 className="font-bold text-slate-800 text-lg mb-2">Instant Reports</h3>
              <p className="text-sm text-slate-500">Generate detailed diagnostic reports in seconds for faster decision making.</p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-clean border border-slate-100 col-span-2 transform -translate-y-4 mx-8">
              <div className="h-10 w-10 bg-sky-50 rounded-lg flex items-center justify-center mb-4">
                <FaUserCheck className="text-sky-600 text-xl" />
              </div>
              <h3 className="font-bold text-slate-800 text-lg mb-2">Clinical Workflow</h3>
              <p className="text-sm text-slate-500">Seamlessly integrates into existing hospital radiology workflows.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard


