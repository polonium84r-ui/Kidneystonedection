import { useState, useEffect } from 'react'
import { FaRobot, FaBrain, FaStethoscope, FaExclamationTriangle, FaCheckCircle, FaSpinner, FaInfoCircle } from 'react-icons/fa'
import { generateAIInsights } from '../services/openSourceAI'

const OpenSourceAIInsights = ({
  analysisData,
  onInsightsGenerated,
  className = ''
}) => {
  const [insights, setInsights] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Fade-in animation
    const timer = setTimeout(() => setIsVisible(true), 300)
    return () => clearTimeout(timer)
  }, [])

  const handleGenerateInsights = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const aiInsights = await generateAIInsights(analysisData)
      setInsights(aiInsights)

      // Notify parent component
      if (onInsightsGenerated) {
        onInsightsGenerated(aiInsights)
      }
    } catch (err) {
      setError(err.message || 'Failed to generate AI insights')
      console.error('AI Insights Error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-generate on mount if enabled (optional)
  useEffect(() => {
    // Uncomment to auto-generate insights on component mount
    // handleGenerateInsights()
  }, [])

  return (
    <div
      className={`
        relative overflow-hidden
        backdrop-blur-xl bg-white/80
        border-2 border-medical-purple/30
        rounded-2xl shadow-2xl
        transition-all duration-700 ease-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        ${className}
      `}
    >
      {/* Header */}
      <div className="relative bg-gradient-to-r from-medical-purple via-medical-pink to-medical-blue p-6 rounded-t-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-medical-purple/90 to-medical-blue/90"></div>
        <div className="relative flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 blur-xl rounded-full"></div>
              <FaRobot className="relative text-4xl text-white drop-shadow-lg" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white drop-shadow-md">
                Open Source AI Analysis
              </h2>
              <p className="text-white/90 text-sm mt-1">
                Enhanced insights from open source AI models
              </p>
            </div>
          </div>

          {!insights && !isLoading && (
            <button
              onClick={handleGenerateInsights}
              className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-5 py-2.5 rounded-lg font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <FaBrain />
              <span>Generate Insights</span>
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="relative">
              <div className="absolute inset-0 bg-medical-purple/30 rounded-full animate-ping"></div>
              <div className="relative bg-gradient-to-br from-medical-purple to-medical-pink p-6 rounded-full shadow-lg">
                <FaSpinner className="text-4xl text-white animate-spin" />
              </div>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-800 mb-2">
                AI is analyzing your results...
              </p>
              <p className="text-sm text-gray-600">
                Generating comprehensive medical insights
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
            <div className="flex items-start space-x-3">
              <FaExclamationTriangle className="text-red-600 text-xl mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-800 mb-2">Error Generating Insights</h3>
                <p className="text-red-700 text-sm mb-4">{error}</p>
                <button
                  onClick={handleGenerateInsights}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Insights Display */}
        {insights && !isLoading && (
          <div className="space-y-6">
            {/* AI Interpretation */}
            <div className="relative backdrop-blur-sm bg-gradient-to-br from-blue-50/70 via-purple-50/70 to-pink-50/70 border-2 border-medical-blue/25 rounded-xl p-6 shadow-lg">
              <div className="flex items-start space-x-3 mb-4">
                <FaBrain className="text-medical-purple text-xl mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">AI Medical Interpretation</h3>
                  <p className="text-gray-700 leading-relaxed text-base">
                    {insights.interpretation}
                  </p>
                </div>
              </div>
            </div>

            {/* Clinical Significance */}
            <div className="relative backdrop-blur-sm bg-gradient-to-br from-cyan-50/70 via-blue-50/70 to-teal-50/70 border-2 border-medical-cyan/25 rounded-xl p-6 shadow-lg">
              <div className="flex items-start space-x-3 mb-4">
                <FaStethoscope className="text-medical-cyan text-xl mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Clinical Significance</h3>
                  <p className="text-gray-700 leading-relaxed text-base">
                    {insights.clinicalSignificance}
                  </p>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="relative backdrop-blur-sm bg-gradient-to-br from-green-50/70 via-emerald-50/70 to-teal-50/70 border-2 border-green-300/25 rounded-xl p-6 shadow-lg">
              <div className="flex items-start space-x-3 mb-4">
                <FaCheckCircle className="text-green-600 text-xl mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">AI Recommendations</h3>
                  <p className="text-gray-700 leading-relaxed text-base">
                    {insights.recommendations}
                  </p>
                </div>
              </div>
            </div>

            {/* Risk Factors */}
            {insights.riskFactors && (
              <div className="relative backdrop-blur-sm bg-gradient-to-br from-amber-50/70 via-yellow-50/70 to-orange-50/70 border-2 border-amber-300/25 rounded-xl p-6 shadow-lg">
                <div className="flex items-start space-x-3 mb-4">
                  <FaExclamationTriangle className="text-amber-600 text-xl mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Risk Factors to Consider</h3>
                    <p className="text-gray-700 leading-relaxed text-base">
                      {insights.riskFactors}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Source Info */}
            <div className="flex items-center justify-between p-4 bg-gray-50/50 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <FaInfoCircle className="text-medical-blue" />
                <span>
                  <strong>Source:</strong> {insights.source}
                </span>
              </div>
              {insights.note && (
                <p className="text-xs text-gray-500 italic">{insights.note}</p>
              )}
            </div>

            {/* Regenerate Button */}
            <button
              onClick={handleGenerateInsights}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-medical-purple to-medical-blue text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            >
              <FaBrain />
              <span>Regenerate Insights</span>
            </button>
          </div>
        )}

        {/* Initial State - Prompt to Generate */}
        {!insights && !isLoading && !error && (
          <div className="text-center py-12">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-medical-purple/20 blur-2xl rounded-full"></div>
              <FaBrain className="relative text-6xl text-medical-purple" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Get Enhanced AI Insights
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Our open source AI will analyze your scan results and provide comprehensive medical interpretation, clinical significance, and personalized recommendations.
            </p>
            <button
              onClick={handleGenerateInsights}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-medical-purple to-medical-blue text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <FaBrain />
              <span>Generate AI Insights</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default OpenSourceAIInsights

