import { FaChartBar, FaMapMarkerAlt, FaPercentage, FaCheckCircle } from 'react-icons/fa'

const AnalysisCard = ({ icon: Icon, label, value, unit = '', color = 'blue', className = '' }) => {
  const colorClasses = {
    blue: 'bg-medical-blue/10 text-medical-blue border-medical-blue/20',
    cyan: 'bg-medical-cyan/10 text-medical-cyan border-medical-cyan/20',
    purple: 'bg-medical-purple/10 text-medical-purple border-medical-purple/20',
    pink: 'bg-medical-pink/10 text-medical-pink border-medical-pink/20',
    teal: 'bg-medical-teal/10 text-medical-teal border-medical-teal/20',
  }

  return (
    <div className={`bg-white rounded-xl p-6 border-2 ${colorClasses[color]} shadow-lg hover:shadow-xl transition-all duration-300 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {Icon && <Icon className="text-2xl" />}
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
        <p className="text-2xl font-bold text-gray-800">
          {value}
          {unit && <span className="text-lg text-gray-500 ml-1">{unit}</span>}
        </p>
      </div>
    </div>
  )
}

export default AnalysisCard


