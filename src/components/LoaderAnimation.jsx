import { FaHeartbeat } from 'react-icons/fa'

const LoaderAnimation = ({ message = 'Analyzing with AI...' }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-12">
      {/* Pulsing Heartbeat Icon */}
      <div className="relative">
        <div className="absolute inset-0 bg-medical-pink/30 rounded-full animate-ping"></div>
        <div className="absolute inset-0 bg-medical-pink/20 rounded-full animate-pulse"></div>
        <div className="relative bg-gradient-medical-soft p-6 rounded-full shadow-medical-glow-strong">
          <FaHeartbeat className="text-4xl text-white animate-heartbeat" />
        </div>
      </div>

      {/* Rotating Gradient Ring */}
      <div className="relative w-32 h-32">
        <div className="absolute inset-0 border-4 border-transparent border-t-medical-blue border-r-medical-cyan rounded-full animate-spin"></div>
        <div className="absolute inset-2 border-4 border-transparent border-b-medical-purple border-l-medical-pink rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        <div className="absolute inset-4 border-4 border-transparent border-t-medical-teal rounded-full animate-spin" style={{ animationDuration: '2s' }}></div>
      </div>

      {/* Loading Text */}
      <div className="text-center">
        <p className="text-lg font-semibold text-gray-800 mb-2">{message}</p>
        <div className="flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-medical-blue rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 bg-medical-cyan rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-medical-purple rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  )
}

export default LoaderAnimation


