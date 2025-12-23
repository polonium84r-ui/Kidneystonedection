import { FaStethoscope, FaLightbulb, FaInfoCircle } from 'react-icons/fa'

const SuggestionBox = ({ suggestions = [], className = '' }) => {
  if (!suggestions || suggestions.length === 0) {
    return null
  }

  return (
    <div className={`bg-gradient-to-br from-medical-blue/10 via-medical-cyan/10 to-medical-purple/10 rounded-xl p-6 border-2 border-medical-blue/20 shadow-lg ${className}`}>
      <div className="flex items-center space-x-2 mb-4">
        <FaStethoscope className="text-2xl text-medical-blue" />
        <h3 className="text-xl font-bold text-gray-800">AI Medical Insights</h3>
      </div>
      
      <div className="space-y-3">
        {suggestions.map((suggestion, index) => (
          <div
            key={index}
            className="flex items-start space-x-3 bg-white/70 rounded-lg p-4 border border-medical-cyan/20 hover:shadow-md transition-shadow"
          >
            <FaLightbulb className="text-medical-cyan mt-1 flex-shrink-0" />
            <p className="text-gray-700 leading-relaxed">{suggestion}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center space-x-2 text-sm text-gray-600 bg-white/50 rounded-lg p-3">
        <FaInfoCircle className="text-medical-purple" />
        <p>These insights are AI-generated and should be reviewed by a medical professional.</p>
      </div>
    </div>
  )
}

export default SuggestionBox


