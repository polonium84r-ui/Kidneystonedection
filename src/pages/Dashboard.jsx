import { Link } from 'react-router-dom'
import { FaUpload, FaArrowRight } from 'react-icons/fa'

const Dashboard = () => {


  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 flex flex-col relative overflow-hidden">

      {/* Hero Section - Professional Medical Background */}
      <div className="flex-grow flex items-center justify-center relative">
        <div className="absolute inset-0 bg-gradient-soft opacity-50 z-0"></div>

        {/* Center Content for better focus after removing cards */}
        <div className="w-full max-w-3xl mx-auto text-center animate-slide-up">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-semibold tracking-wide mb-6 uppercase">
            <span className="w-2 h-2 rounded-full bg-sky-500 mr-2"></span>
            AI-Powered Radiology Assistant
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-800 leading-tight mb-6">
            Advanced <span className="text-medical-primary">Kidney Stone</span> <br />
            Detection System
          </h1>

          <p className="text-lg text-slate-600 mb-8 leading-relaxed mx-auto max-w-2xl">
            Empowering medical professionals with rapid, high-precision analysis of CT scans for early detection and diagnosis of renal calculi.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
      </div>
    </div>
  )
}

export default Dashboard


