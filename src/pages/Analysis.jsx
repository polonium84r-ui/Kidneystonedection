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
  const [ageError, setAgeError] = useState('')
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
  const handleDownloadPDF = async () => {
    if (!analysisData) {
      setPdfError('No analysis data available to generate PDF')
      return
    }
    // Open modal to get patient details
    setShowPatientModal(true)
  }

  const generatePDF = async () => {
    // Basic Age Validation
    const ageNum = parseInt(patientDetails.age, 10)
    if (!patientDetails.age || isNaN(ageNum) || ageNum <= 0 || ageNum > 120) {
      setAgeError('Please enter a valid age (1-120)')
      return
    }

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
      setAgeError('')
    }
  }

  if (!analysisData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="text-slate-600 animate-pulse">Loading analysis results...</p>
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
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate('/upload')}
              className="flex items-center space-x-2 text-medical-primary hover:text-sky-700 transition-colors font-medium text-sm rounded-lg px-2 py-1 -ml-2"
            >
              <FaArrowLeft />
              <span>Analyze Another Image</span>
            </button>

            {/* Download PDF Button */}
            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="flex items-center space-x-2 bg-gradient-medical text-white px-5 py-2.5 rounded-lg font-semibold shadow-clean hover:shadow-clean-lg transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaFilePdf className={isGeneratingPDF ? 'animate-spin' : ''} />
              <span>{isGeneratingPDF ? 'Generating Report...' : 'Download Report'}</span>
            </button>
          </div>

          {pdfError && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              <p className="font-medium">{pdfError}</p>
            </div>
          )}

          <h1 className="text-3xl font-bold text-slate-800 mb-2">Detection Results</h1>
          <p className="text-slate-600">AI-powered analysis of renal structures and anomalies.</p>
        </div>

        {/* Image Display - Side by Side */}
        <div className="mb-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-clean border border-slate-200 overflow-hidden">
            <h3 className="text-center py-2.5 font-semibold text-slate-700 bg-slate-50 border-b border-slate-200 text-sm uppercase tracking-wide">
              Original Scan
            </h3>
            <div className="relative aspect-video bg-black flex items-center justify-center">
              <img
                src={analysisData.originalImage}
                alt="Original Scan"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-clean border border-slate-200 overflow-hidden">
            <h3 className="text-center py-2.5 font-semibold text-slate-700 bg-slate-50 border-b border-slate-200 text-sm uppercase tracking-wide">
              AI Detection
            </h3>
            <div className="relative aspect-video bg-black flex items-center justify-center">
              <img
                src={analysisData.processedImage || analysisData.originalImage}
                alt="Analyzed Scan"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* Analysis Cards Grid */}
        {analysis.predictions && analysis.predictions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-fade-in">
            {/* 1. Stone Location */}
            {(analysis.stoneLocation || analysis.blockageLocation) && (analysis.stoneLocation !== 'None detected' && analysis.blockageLocation !== 'N/A') && (
              <AnalysisCard
                icon={FaMapMarkerAlt}
                label="Stone Location"
                value={analysis.detectedClasses?.join(', ') || analysis.stoneLocation || analysis.blockageLocation || 'Unknown'}
                color="cyan"
              />
            )}

            {/* 2. Stone Size (Computed) - Primary */}
            {analysis.clinicalMeasurements && analysis.clinicalMeasurements.length > 0 ? (
              <AnalysisCard
                icon={FaPercentage}
                label="Stone Size"
                value={analysis.clinicalMeasurements[0].sizeText}
                color="purple"
              />
            ) : (analysis.obstructionRisk > 0 || analysis.narrowingPercentage > 0) && (
              <AnalysisCard
                icon={FaPercentage}
                label="Obstruction Risk"
                value={(Number(analysis.obstructionRisk) || Number(analysis.narrowingPercentage) || 0).toFixed(1)}
                unit="Score"
                color="purple"
              />
            )}

            {/* 3. Shape */}
            {analysis.clinicalMeasurements && analysis.clinicalMeasurements.length > 0 && (
              <AnalysisCard
                icon={FaShieldAlt}
                label="Shape"
                value={analysis.clinicalMeasurements[0].shape}
                color="blue"
              />
            )}

            {/* 4. Distance to Ureter */}
            {analysis.clinicalMeasurements && analysis.clinicalMeasurements.length > 0 && (
              <AnalysisCard
                icon={FaChartBar}
                label="Dist. to Ureter"
                value={analysis.clinicalMeasurements[0].distanceToUreterMM}
                unit="mm"
                color="pink"
              />
            )}

            {/* 5. Confidence */}
            {(analysis.confidence > 0) && (
              <AnalysisCard
                icon={FaShieldAlt}
                label="Stone Confidence"
                value={((Number(analysis.confidence) || 0) * 100).toFixed(1)}
                unit="%"
                color="blue"
              />
            )}
          </div>
        )}

        {/* Show message if no detections */}
        {(!analysis.predictions || analysis.predictions.length === 0) && (
          <div className="mb-8 bg-green-50 border border-green-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-full">
                <FaShieldAlt className="text-green-600" />
              </div>
              <div>
                <h3 className="text-green-800 font-semibold">No significant anomalies detected</h3>
                <p className="text-green-700 text-sm">The AI scan did not find any indicators matching trained kidney stone patterns.</p>
              </div>
            </div>
          </div>
        )}

        {/* Severity Indicator */}
        {analysis.severity && analysis.severity !== 'low' && (
          <div className="mb-8">
            <SeverityIndicator severity={severity} />
          </div>
        )}

        {/* Suggestions & Recommendations Section */}
        {suggestions.length > 0 && (
          <div className="mb-12 space-y-8">
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

        {/* Doctor's Suggestion Card */}
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
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wide">Analysis Metadata</h3>
          <div className="space-y-2 text-sm text-slate-600">
            <p className="flex justify-between border-b border-slate-50 pb-2">
              <span className="font-medium">Detection Status:</span>
              <span>{analysis.detectionStatus || 'Scan Complete'}</span>
            </p>
            <p className="flex justify-between pt-2">
              <span className="font-medium">Timestamp:</span>
              <span>{new Date().toLocaleString()}</span>
            </p>
          </div>
        </div>

        {/* Medical Disclaimer Footer - UI */}
        <div className="mt-8 text-center border-t border-slate-200 pt-6">
          <p className="text-xs text-slate-400 font-medium">
            Measurements are AI-assisted estimates (±1–2 mm). Final clinical decisions must be made by a qualified physician.
          </p>
        </div>

      </div>

      {/* Patient Details Modal */}
      {showPatientModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden animate-slide-up border border-slate-100">
            <div className="bg-slate-50 p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-800">Patient Details</h3>
              <p className="text-slate-500 text-sm">Enter patient information for the medical report</p>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Patient Name</label>
                  <input
                    type="text"
                    value={patientDetails.name}
                    onChange={(e) => setPatientDetails({ ...patientDetails, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-medical-primary/20 focus:border-medical-primary outline-none transition-all text-sm"
                    placeholder="Full Name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Record ID</label>
                  <input
                    type="text"
                    value={patientDetails.id}
                    onChange={(e) => setPatientDetails({ ...patientDetails, id: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-medical-primary/20 focus:border-medical-primary outline-none transition-all text-sm"
                    placeholder="MRN-XXXX"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Age</label>
                  <input
                    type="number"
                    value={patientDetails.age}
                    onChange={(e) => {
                      setPatientDetails({ ...patientDetails, age: e.target.value })
                      if (ageError) setAgeError('')
                    }}
                    className={`w-full px-4 py-2.5 border ${ageError ? 'border-red-500 bg-red-50' : 'border-slate-300'} rounded-lg focus:ring-2 focus:ring-medical-primary/20 focus:border-medical-primary outline-none transition-all text-sm`}
                    placeholder="Years"
                  />
                  {ageError && <p className="text-xs text-red-500 mt-1 font-medium">{ageError}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Gender</label>
                  <select
                    value={patientDetails.gender}
                    onChange={(e) => setPatientDetails({ ...patientDetails, gender: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-medical-primary/20 focus:border-medical-primary outline-none transition-all text-sm bg-white"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-8 pt-4 border-t border-slate-100">
                <button
                  onClick={() => setShowPatientModal(false)}
                  className="px-5 py-2.5 text-slate-600 hover:text-slate-800 font-medium transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={generatePDF}
                  className="px-6 py-2.5 bg-medical-primary text-white rounded-lg font-semibold shadow-clean hover:bg-sky-700 transition-all text-sm"
                >
                  Generate Report
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
