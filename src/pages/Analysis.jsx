import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

import AnalysisCard from '../components/AnalysisCard'
import SeverityIndicator from '../components/SeverityIndicator'
import AIGeneratedSuggestions from '../components/AIGeneratedSuggestions'
import DoctorsSuggestion from '../components/DoctorsSuggestion'

import { generatePDFReport } from '../services/pdfGenerator'
import { FaChartBar, FaMapMarkerAlt, FaPercentage, FaShieldAlt, FaArrowLeft, FaFilePdf } from 'react-icons/fa'

const Analysis = () => {
  const [analysisData, setAnalysisData] = useState(null)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [pdfError, setPdfError] = useState(null)
  const [aiInsights, setAiInsights] = useState(null)
  const [doctorSuggestion, setDoctorSuggestion] = useState('')
  const [showPatientModal, setShowPatientModal] = useState(false)
  const [patientDetails, setPatientDetails] = useState({
    name: '',
    id: '',
    age: '',
    gender: ''
  })
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    // Retrieve analysis results from sessionStorage
    const stored = sessionStorage.getItem('analysisResult')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setAnalysisData(parsed)
      } catch (err) {
        console.error('Error parsing analysis data:', err)
        navigate('/upload')
      }
    } else {
      // No analysis data, redirect to upload
      navigate('/upload')
    }

    // Retrieve AI insights if available
    const storedInsights = sessionStorage.getItem('aiInsights')
    if (storedInsights) {
      try {
        setAiInsights(JSON.parse(storedInsights))
      } catch (err) {
        console.error('Error parsing AI insights:', err)
      }
    }

    // Retrieve doctor's suggestion if available
    const storedSuggestion = sessionStorage.getItem('doctorSuggestion')
    if (storedSuggestion) {
      setDoctorSuggestion(storedSuggestion)
    }
  }, [navigate])

  // Cleanup function to revoke object URLs on unmount
  useEffect(() => {
    return () => {
      if (analysisData?.originalImage && analysisData.originalImage.startsWith('blob:')) {
        try {
          URL.revokeObjectURL(analysisData.originalImage)
        } catch (e) {
          console.warn('Error revoking object URL:', e)
        }
      }
    }
  }, [analysisData])

  // Handle PDF generation
  // Handle PDF generation
  const handleDownloadPDF = async () => {
    if (!analysisData) {
      setPdfError('No analysis data available to generate PDF')
      return
    }
    // Open modal to get patient details
    setShowPatientModal(true)
  }

  const generatePDF = async () => {
    setShowPatientModal(false)
    setIsGeneratingPDF(true)
    setPdfError(null)

    try {
      await generatePDFReport(
        analysisData,
        aiInsights,
        doctorSuggestion,
        patientDetails,
        user?.name || 'Dr. Unknown'
      )
    } catch (error) {
      setPdfError(error.message || 'Failed to generate PDF')
      console.error('PDF Generation Error:', error)
    } finally {
      setIsGeneratingPDF(false)
      // Reset form
      setPatientDetails({
        name: '',
        id: '',
        age: '',
        gender: ''
      })
    }
  }

  if (!analysisData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading analysis results...</p>
        </div>
      </div>
    )
  }

  // Extract analysis data - only use what model returns
  const analysis = analysisData.analysis || {
    clotProbability: 0,
    blockageLocation: 'N/A',
    narrowingPercentage: 0,
    severity: 'low',
    confidence: 0,
    detectionStatus: 'No analysis data',
    suggestions: [],
    predictions: [],
    detectedClasses: []
  }

  // Only use suggestions if model provides them
  const suggestions = analysis.suggestions || []

  const getSeverity = (percentage) => {
    const num = Number(percentage) || 0
    if (num < 30) return 'low'
    if (num < 60) return 'medium'
    return 'high'
  }

  const severity = getSeverity(analysis.narrowingPercentage)

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate('/upload')}
              className="flex items-center space-x-2 text-medical-blue hover:text-medical-purple transition-colors"
            >
              <FaArrowLeft />
              <span>Upload New Image</span>
            </button>

            {/* Download PDF Button */}
            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="flex items-center space-x-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <FaFilePdf className={isGeneratingPDF ? 'animate-spin' : ''} />
              <span>{isGeneratingPDF ? 'Generating PDF...' : 'Download PDF Report'}</span>
            </button>
          </div>

          {pdfError && (
            <div className="mb-4 bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl">
              <p className="font-medium">{pdfError}</p>
            </div>
          )}

          <h1 className="text-4xl font-bold text-gray-800 mb-2">Analysis Results</h1>
          <p className="text-gray-600">Detailed AI-powered detection and analysis of your angiography image</p>
        </div>

        {/* Image Display - Side by Side */}
        <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg border-2 border-medical-blue/20 overflow-hidden">
            <h3 className="text-center py-3 font-bold text-gray-700 bg-gray-50 border-b border-gray-200">
              Original Image
            </h3>
            <div className="relative aspect-video bg-black flex items-center justify-center">
              <img
                src={analysisData.originalImage}
                alt="Original Angiography"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border-2 border-medical-blue/20 overflow-hidden">
            <h3 className="text-center py-3 font-bold text-gray-700 bg-gray-50 border-b border-gray-200">
              Analysis Detection
            </h3>
            <div className="relative aspect-video bg-black flex items-center justify-center">
              <img
                src={analysisData.processedImage || analysisData.originalImage}
                alt="Analyzed Angiography"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* Analysis Cards Grid - Only show if model provides data */}
        {analysis.predictions && analysis.predictions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {analysis.confidence > 0 && (
              <AnalysisCard
                icon={FaShieldAlt}
                label="Confidence Score"
                value={((Number(analysis.confidence) || 0) * 100).toFixed(1)}
                unit="%"
                color="blue"
              />
            )}
            {analysis.blockageLocation && analysis.blockageLocation !== 'N/A' && (
              <AnalysisCard
                icon={FaMapMarkerAlt}
                label="Detected Classes"
                value={analysis.detectedClasses?.join(', ') || analysis.blockageLocation || 'N/A'}
                color="cyan"
              />
            )}
            {analysis.clotProbability > 0 && (
              <AnalysisCard
                icon={FaChartBar}
                label="Detection Probability"
                value={((Number(analysis.clotProbability) || 0) * 100).toFixed(1)}
                unit="%"
                color="pink"
              />
            )}
            {analysis.narrowingPercentage > 0 && (
              <AnalysisCard
                icon={FaPercentage}
                label="Narrowing"
                value={(Number(analysis.narrowingPercentage) || 0).toFixed(1)}
                unit="%"
                color="purple"
              />
            )}
          </div>
        )}

        {/* Show message if no detections */}
        {(!analysis.predictions || analysis.predictions.length === 0) && (
          <div className="mb-8 bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
            <p className="text-yellow-800 font-medium">
              No detections found
            </p>
          </div>
        )}

        {/* Severity Indicator - Only show if model provides severity */}
        {analysis.severity && analysis.severity !== 'low' && (
          <div className="mb-8">
            <SeverityIndicator severity={severity} />
          </div>
        )}

        {/* Suggestions & Recommendations Section - Only show if model provides suggestions */}
        {suggestions.length > 0 && (
          <div className="mb-12 space-y-8">
            {/* AI-Generated Suggestions Card */}
            <div>
              <AIGeneratedSuggestions
                analysis={analysis}
                suggestions={suggestions}
                severity={severity}
                confidence={analysis.confidence || 0}
              />
            </div>
          </div>
        )}

        {/* Doctor's Suggestion Card - Always available */}
        <div className="mb-12">
          <DoctorsSuggestion
            initialValue={doctorSuggestion}
            maxLength={1000}
            onSave={(suggestion) => {
              console.log('Doctor\'s suggestion saved:', suggestion)
              setDoctorSuggestion(suggestion)
              sessionStorage.setItem('doctorSuggestion', suggestion)
            }}
          />
        </div>



        {/* Additional Info */}
        <div className="bg-white rounded-xl p-6 border-2 border-gray-200 shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Analysis Summary</h3>
          <div className="space-y-2 text-gray-600">
            <p>
              <strong>Detection Status:</strong> {analysis.detectionStatus || 'Blockages detected'}
            </p>
            <p>
              <strong>Analysis Date:</strong> {new Date().toLocaleString()}
            </p>

          </div>
        </div>
      </div>

      {/* Patient Details Modal */}
      {showPatientModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden animate-slideIn">
            <div className="bg-gradient-medical p-6">
              <h3 className="text-xl font-bold text-white">Patient Details</h3>
              <p className="text-white/80 text-sm">Please enter patient information for the report</p>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Patient Name</label>
                  <input
                    type="text"
                    value={patientDetails.name}
                    onChange={(e) => setPatientDetails({ ...patientDetails, name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                    placeholder="Enter name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Patient ID</label>
                  <input
                    type="text"
                    value={patientDetails.id}
                    onChange={(e) => setPatientDetails({ ...patientDetails, id: e.target.value })}
                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                    placeholder="ID-12345"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Age</label>
                  <input
                    type="number"
                    value={patientDetails.age}
                    onChange={(e) => setPatientDetails({ ...patientDetails, age: e.target.value })}
                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-medical-blue focus:border-transparent"
                    placeholder="Years"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Gender</label>
                  <select
                    value={patientDetails.gender}
                    onChange={(e) => setPatientDetails({ ...patientDetails, gender: e.target.value })}
                    className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-medical-blue focus:border-transparent bg-white"
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-100">
                <button
                  onClick={() => setShowPatientModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={generatePDF}
                  className="px-6 py-2 bg-gradient-medical text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                  Generate PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>

  )
}

export default Analysis

