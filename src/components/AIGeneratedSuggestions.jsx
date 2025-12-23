import { useEffect, useState } from 'react'
import { FaBrain, FaExclamationTriangle, FaChartLine, FaStethoscope, FaArrowRight } from 'react-icons/fa'

/**
 * AIGeneratedSuggestions component
 * @param {{
 *  analysis?: {narrowingPercentage?: number|string, blockageLocation?: string, confidence?: number},
 *  suggestions?: string[],
 *  severity?: 'low'|'medium'|'high',
 *  confidence?: number,
 *  className?: string
 * }} props
 */
const AIGeneratedSuggestions = ({ 
  analysis = {}, 
  suggestions = [],
  severity = 'medium',
  confidence = 0.92,
  className = '' 
}) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Fade-in animation trigger
    const timer = setTimeout(() => setIsVisible(true), 200)
    return () => clearTimeout(timer)
  }, [])

  // Get severity configuration
  const getSeverityConfig = (sev) => {
    switch (sev) {
      case 'high':
        return {
          label: 'High Risk',
          color: 'text-red-600',
          bgColor: 'bg-red-50/50',
          borderColor: 'border-red-200/50',
          icon: FaExclamationTriangle
        }
      case 'medium':
        return {
          label: 'Moderate Risk',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50/50',
          borderColor: 'border-yellow-200/50',
          icon: FaExclamationTriangle
        }
      default:
        return {
          label: 'Low Risk',
          color: 'text-green-600',
          bgColor: 'bg-green-50/50',
          borderColor: 'border-green-200/50',
          icon: FaStethoscope
        }
    }
  }

  const severityConfig = getSeverityConfig(severity)
  const SeverityIcon = severityConfig.icon

  // Generate AI explanation based on analysis
  const generateAIExplanation = () => {
    const narrowing = Number(analysis.narrowingPercentage) || 0
    const location = analysis.blockageLocation || 'detected vessels'
    
    if (narrowing >= 60) {
      return `Significant arterial narrowing (${narrowing.toFixed(1)}%) has been detected in the ${location}. The AI analysis indicates potential vascular obstruction that requires immediate clinical attention. The detected anomaly suggests possible coronary artery disease progression.`
    } else if (narrowing >= 30) {
      return `Moderate arterial narrowing (${narrowing.toFixed(1)}%) observed in the ${location}. While not immediately critical, this finding warrants further clinical evaluation and monitoring. The AI model suggests potential early-stage vascular changes.`
    } else {
      return `Minimal narrowing (${narrowing.toFixed(1)}%) detected in the ${location}. The analysis shows relatively normal vascular patterns with minor anomalies that fall within acceptable clinical parameters. Continued monitoring recommended.`
    }
  }

  // Recommended clinical steps
  const getClinicalSteps = () => {
    const narrowing = Number(analysis.narrowingPercentage) || 0
    
    if (narrowing >= 60) {
      return [
        'Schedule urgent cardiology consultation within 24-48 hours',
        'Consider stress testing and additional diagnostic imaging',
        'Review patient\'s cardiac risk factors and medical history',
        'Discuss potential interventional procedures if indicated'
      ]
    } else if (narrowing >= 30) {
      return [
        'Schedule follow-up cardiology appointment within 2-4 weeks',
        'Perform additional imaging studies (Echocardiogram, CT angiography)',
        'Assess cardiovascular risk factors and lifestyle modifications',
        'Consider lipid panel and cardiac biomarkers'
      ]
    } else {
      return [
        'Continue routine cardiovascular monitoring',
        'Maintain regular follow-up appointments as scheduled',
        'Encourage heart-healthy lifestyle modifications',
        'Monitor any new or changing symptoms'
      ]
    }
  }

  const clinicalSteps = getClinicalSteps()

  return (
    <div 
      className={`
        relative overflow-hidden
        backdrop-blur-xl bg-white/70
        border-2 border-medical-blue/30
        rounded-2xl shadow-2xl
        transition-all duration-700 ease-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        ${className}
      `}
    >
      {/* Gradient Header */}
      <div className="relative bg-gradient-to-r from-medical-blue via-medical-cyan to-medical-purple p-6 rounded-t-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-medical-blue/80 to-medical-purple/80"></div>
        <div className="relative flex items-center space-x-4">
          <div className="relative">
            <div className="absolute inset-0 bg-white/20 blur-xl rounded-full"></div>
            <FaBrain className="relative text-4xl text-white drop-shadow-lg" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white drop-shadow-md">
              AI-Generated Suggestions
            </h2>
            <p className="text-white/90 text-sm mt-1">
              Advanced machine learning analysis and clinical recommendations
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Panel */}
      <div className="p-6 space-y-6">
        {/* AI Explanation */}
        <div className="relative backdrop-blur-sm bg-gradient-to-br from-blue-50/60 via-cyan-50/60 to-blue-50/60 border-2 border-medical-blue/20 rounded-xl p-6 shadow-inner">
          <div className="flex items-start space-x-3 mb-3">
            <FaBrain className="text-medical-blue text-xl mt-1 flex-shrink-0" />
            <h3 className="text-lg font-semibold text-gray-800">AI Analysis Explanation</h3>
          </div>
          <p className="text-gray-700 leading-relaxed text-base">
            {generateAIExplanation()}
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Severity Level */}
          <div className={`
            relative backdrop-blur-sm 
            ${severityConfig.bgColor} 
            border-2 ${severityConfig.borderColor} 
            rounded-xl p-5 shadow-lg
          `}>
            <div className="flex items-center space-x-3 mb-2">
              <SeverityIcon className={`${severityConfig.color} text-2xl`} />
              <h4 className="font-semibold text-gray-800">Severity Level</h4>
            </div>
            <p className={`text-2xl font-bold ${severityConfig.color}`}>
              {severityConfig.label}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Based on {((Number(analysis.narrowingPercentage) || 0).toFixed(1))}% narrowing
            </p>
          </div>

          {/* Confidence Percentage */}
          <div className="relative backdrop-blur-sm bg-gradient-to-br from-medical-purple/10 via-medical-pink/10 to-medical-purple/10 border-2 border-medical-purple/20 rounded-xl p-5 shadow-lg">
            <div className="flex items-center space-x-3 mb-2">
              <FaChartLine className="text-medical-purple text-2xl" />
              <h4 className="font-semibold text-gray-800">Confidence Score</h4>
            </div>
            <p className="text-3xl font-bold text-medical-purple">
              {((confidence || 0) * 100).toFixed(1)}%
            </p>
            <div className="mt-3 w-full bg-gray-200/50 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-medical-purple to-medical-pink h-full rounded-full transition-all duration-1000"
                style={{ width: `${(confidence || 0) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Recommended Clinical Steps */}
        <div className="relative backdrop-blur-sm bg-gradient-to-br from-medical-teal/10 via-medical-cyan/10 to-medical-blue/10 border-2 border-medical-teal/20 rounded-xl p-6 shadow-lg">
          <div className="flex items-center space-x-3 mb-4">
            <FaStethoscope className="text-medical-teal text-xl" />
            <h3 className="text-lg font-semibold text-gray-800">Recommended Next Clinical Steps</h3>
          </div>
          <ul className="space-y-3">
            {clinicalSteps.map((step, index) => (
              <li 
                key={index}
                className="flex items-start space-x-3 group"
              >
                <div className="flex-shrink-0 mt-1">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-medical-teal to-medical-cyan flex items-center justify-center text-white text-xs font-bold shadow-md group-hover:scale-110 transition-transform">
                    {index + 1}
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed flex-1 group-hover:text-gray-900 transition-colors">
                  {step}
                </p>
                <FaArrowRight className="text-medical-teal/50 group-hover:text-medical-teal group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
              </li>
            ))}
          </ul>
        </div>

        {/* Additional Suggestions List */}
        {suggestions && suggestions.length > 0 && (
          <div className="relative backdrop-blur-sm bg-white/50 border-2 border-medical-blue/15 rounded-xl p-5">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2">
              <FaBrain className="text-medical-blue" />
              <span>Additional AI Insights</span>
            </h4>
            <ul className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start space-x-2 text-sm text-gray-700">
                  <span className="text-medical-cyan mt-1">•</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Disclaimer */}
        <div className="flex items-start space-x-3 p-4 bg-amber-50/50 border border-amber-200/50 rounded-lg backdrop-blur-sm">
          <FaExclamationTriangle className="text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-800 leading-relaxed">
            <strong>Important:</strong> These AI-generated suggestions are for informational purposes only and should not replace professional medical judgment. All recommendations must be reviewed and validated by a qualified healthcare professional before making any clinical decisions.
          </p>
        </div>
      </div>
    </div>
  )
}

export default AIGeneratedSuggestions

