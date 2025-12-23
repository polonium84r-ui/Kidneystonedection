import { Link } from 'react-router-dom'
import { FaUpload, FaArrowRight } from 'react-icons/fa'

const Dashboard = () => {


  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden flex flex-col justify-center">
      <div className="absolute inset-0 bg-black/10"></div>

      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
            Heart Angiography & Blood Vessel
            <span className="block mt-2">Blockage Detection System</span>
          </h1>
          <p className="text-xl sm:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
            Advanced AI-powered analysis for detecting arterial blockages and vessel narrowing
            with precision and speed
          </p>
          <Link
            to="/upload"
            className="inline-flex items-center space-x-3 bg-white text-medical-blue px-8 py-4 rounded-xl font-semibold text-lg shadow-2xl hover:scale-105 transition-transform duration-300 hover:shadow-white/50"
          >
            <FaUpload />
            <span>Upload Image Now</span>
            <FaArrowRight />
          </Link>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-medical-pink/20 rounded-full blur-3xl"></div>
    </div>


  )
}

export default Dashboard


