import { useEffect, useState } from 'react'
import { FaBrain, FaExclamationTriangle, FaChartLine, FaStethoscope } from 'react-icons/fa'

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
          color: 'text-red-700',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          icon: FaExclamationTriangle
        }
      case 'medium':
        return {
          label: 'Moderate Risk',
          color: 'text-amber-700',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          icon: FaExclamationTriangle
        }
      default:
        return {
          label: 'Low Risk',
          color: 'text-emerald-700',
          bgColor: 'bg-emerald-50',
          borderColor: 'border-emerald-200',
          icon: FaStethoscope
        }
    }
  }

  const severityConfig = getSeverityConfig(severity)
  const SeverityIcon = severityConfig.icon

  // Generate AI explanation based on analysis
  const generateAIExplanation = () => {
    // Use obstructionRisk or fallback to narrowingPercentage for compatibility
    const riskScore = Number(analysis.obstructionRisk) || Number(analysis.narrowingPercentage) || 0
    const location = analysis.stoneLocation || analysis.blockageLocation || 'detected region'

    if (riskScore >= 60) {
      return `Significant renal calculus burden (Risk Score: ${riskScore.toFixed(1)}) has been detected in the ${location}. The AI analysis indicates a high probability of urinary tract obstruction or significant stone size that requires immediate clinical attention to prevent hydronephrosis.`
    } else if (riskScore >= 30) {
      return `Moderate renal calculus (Risk Score: ${riskScore.toFixed(1)}) observed in the ${location}. While immediate intervention may not be critical, this finding warrants urology evaluation for potential medical expulsion therapy or elective procedures.`
    } else {
      return `Minimal or small calculus (Risk Score: ${riskScore.toFixed(1)}) detected in the ${location}. The analysis shows findings likely manageable with conservative measures, subject to clinical correlation.`
    }
  }

  // Recommended clinical steps
  const getClinicalSteps = () => {
    const riskScore = Number(analysis.obstructionRisk) || Number(analysis.narrowingPercentage) || 0

    if (riskScore >= 60) {
      return [
        'Urgent Urology Consultation (within 24-48 hours)',
        'Non-Contrast CT (NCCT) KUB to confirm stone size/position',
        'Assess for signs of infection or obstruction (hydronephrosis)',
        'Evaluate for intervention (Ureteroscopy/ESWL/PCNL)'
      ]
    } else if (riskScore >= 30) {
      return [
        'Schedule Urology Outpatient appointment',
        'Diagnostic Ultrasound or KUB X-ray for baseline',
        'Prescribe hydration and analgesia as indicated',
        'Review metabolic profile and dietary history'
      ]
    } else {
      return [
        'Increase oral fluid intake (>2.5L daily)',
        'Routine surveillance per clinical guidelines',
        'Dietary modification (low salt, moderate protein)',
        'Monitor for flank pain or hematuria'
      ]
    }
  }

  const clinicalSteps = getClinicalSteps()

  return (
    <div
      className={`
        relative overflow-hidden
        backdrop-blur-xl bg-white
        border border-slate-200
        rounded-2xl shadow-xl
        transition-all duration-700 ease-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        ${className}
      `}
    >
      {/* Gradient Header - Made stronger colors for text visibility */}
      <div className="relative bg-gradient-to-r from-blue-700 via-indigo-600 to-violet-700 p-6 rounded-t-2xl">
        <div className="relative flex items-center space-x-4">
          <div className="relative">
            <div className="absolute inset-0 bg-white/20 blur-xl rounded-full"></div>
            <FaBrain className="relative text-3xl text-white drop-shadow-md" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white drop-shadow-sm tracking-tight">
              AI-Generated Suggestions
            </h2>
            <p className="text-blue-100 text-sm mt-1 font-medium">
              Advanced machine learning analysis and clinical recommendations
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Panel */}
      <div className="p-6 space-y-6">
        {/* AI Explanation */}
        <div className="relative bg-slate-50 border border-slate-200 rounded-xl p-6">
          <div className="flex items-start space-x-3 mb-3">
            <FaBrain className="text-indigo-600 text-xl mt-1 flex-shrink-0" />
            <h3 className="text-lg font-bold text-slate-800">AI Analysis Explanation</h3>
          </div>
          <p className="text-slate-700 leading-relaxed text-base font-medium">
            {generateAIExplanation()}
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Severity Level */}
          <div className={`
            relative 
            ${severityConfig.bgColor} 
            border ${severityConfig.borderColor} 
            rounded-xl p-5 shadow-sm
          `}>
            <div className="flex items-center space-x-3 mb-2">
              <SeverityIcon className={`${severityConfig.color} text-2xl`} />
              <h4 className="font-bold text-slate-800">Severity Level</h4>
            </div>
            <p className={`text-2xl font-extrabold ${severityConfig.color}`}>
              {severityConfig.label}
            </p>
            <p className="text-sm text-slate-600 mt-1 font-medium">
              Based on {((Number(analysis.narrowingPercentage) || 0).toFixed(1))}% risk score
            </p>
          </div>

          {/* Confidence Percentage */}
          <div className="relative bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center space-x-3 mb-2">
              <FaChartLine className="text-violet-600 text-2xl" />
              <h4 className="font-bold text-slate-800">Confidence Score</h4>
            </div>
            <p className="text-3xl font-extrabold text-violet-700">
              {((confidence || 0) * 100).toFixed(1)}%
            </p>
            <div className="mt-3 w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-violet-600 to-indigo-600 h-full rounded-full transition-all duration-1000"
                style={{ width: `${(confidence || 0) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Recommended Clinical Steps */}
        <div className="relative bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center space-x-3 mb-5">
            <FaStethoscope className="text-teal-600 text-xl" />
            <h3 className="text-lg font-bold text-slate-800">Recommended Next Clinical Steps</h3>
          </div>
          <ul className="space-y-4">
            {clinicalSteps.map((step, index) => (
              <li
                key={index}
                className="flex items-start space-x-4 group"
              >
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-6 h-6 rounded-full bg-teal-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                    {index + 1}
                  </div>
                </div>
                <p className="text-slate-700 font-medium leading-relaxed flex-1">
                  {step}
                </p>
                {/* Removed Arrow Icon as requested */}
              </li>
            ))}
          </ul>
        </div>

        {/* Additional Suggestions List */}
        {suggestions && suggestions.length > 0 && (
          <div className="relative bg-slate-50 border border-slate-200 rounded-xl p-5">
            <h4 className="font-bold text-slate-800 mb-3 flex items-center space-x-2">
              <FaBrain className="text-indigo-600" />
              <span>Additional AI Insights</span>
            </h4>
            <ul className="space-y-2">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start space-x-2 text-sm text-slate-700 font-medium">
                  <span className="text-indigo-500 mt-1">•</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Disclaimer */}
        <div className="flex items-start space-x-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <FaExclamationTriangle className="text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-amber-800 leading-relaxed font-medium">
            <strong>Important:</strong> These AI-generated suggestions are for informational purposes only and should not replace professional medical judgment. All recommendations must be reviewed and validated by a qualified healthcare professional before making any clinical decisions.
          </p>
        </div>
      </div>
    </div>
  )
}

export default AIGeneratedSuggestions
