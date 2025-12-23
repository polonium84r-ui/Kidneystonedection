import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import UploadBox from '../components/UploadBox'
import LoaderAnimation from '../components/LoaderAnimation'
import { analyzeImage } from '../services/roboflowApi' // Updated to use Roboflow
import DicomViewer from '../components/DicomViewer'
import { FaFlask } from 'react-icons/fa'

const Upload = () => {
  const { incrementAnalysisCount } = useAuth()
  const [selectedFile, setSelectedFile] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState(null)
  const originalImageUrlRef = useRef(null)
  const navigate = useNavigate()

  const handleFileSelect = (file) => {
    setSelectedFile(file)
    setError(null)
  }

  // Helper to convert file to base64
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })
  }

  // State to hold the converted DICOM image (PNG data URL)
  const [dicomDataUrl, setDicomDataUrl] = useState(null)

  const isDicom = selectedFile?.name.toLowerCase().endsWith('.dcm')

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Please select an image first')
      return
    }

    setIsAnalyzing(true)
    setError(null)

    try {
      let base64Image
      let fileToAnalyze

      if (isDicom) {
        if (!dicomDataUrl) {
          throw new Error('Please wait for the DICOM image to render completely.')
        }
        base64Image = dicomDataUrl

        // Convert base64 to Blob for API upload
        const res = await fetch(base64Image)
        const blob = await res.blob()
        fileToAnalyze = new File([blob], "dicom_converted.png", { type: "image/png" })
      } else {
        base64Image = await fileToBase64(selectedFile)
        fileToAnalyze = selectedFile
      }

      // 2. Analyze
      const result = await analyzeImage(fileToAnalyze)

      // 3. Store results using the persistent Base64 string for the original image
      // valid across page navigations and refreshes
      sessionStorage.setItem('analysisResult', JSON.stringify({
        originalImage: base64Image,
        processedImage: result.processedImage, // This is likely already a Data URL from canvas
        analysis: result.analysis,
      }))

      // Increment analysis count for the current doctor
      incrementAnalysisCount()

      navigate('/analysis')
    } catch (err) {
      // Show detailed error message with helpful guidance
      let errorMessage = err.message || 'Analysis failed. Please try again.'

      // Add helpful context for common errors
      if (err.message && err.message.includes('Authentication')) {
        errorMessage += '\n\n💡 Solution: Check your API key configuration in the .env file.'
      } else if (err.message && err.message.includes('Payment')) {
        errorMessage += '\n\n💡 Solution: Check your Ultralytics account billing and upgrade if needed.'
      } else if (err.message && err.message.includes('Rate Limit')) {
        errorMessage += '\n\n💡 Solution: Wait a few minutes before trying again.'
      } else if (err.message && err.message.includes('Network')) {
        errorMessage += '\n\n💡 Solution: Check your internet connection and try again.'
      } else if (err.message && err.message.includes('Bad Request')) {
        errorMessage += '\n\n💡 Solution: Try a different image format (JPG/PNG) or smaller file size.'
      } else if (err.message && err.message.includes('DICOM')) {
        errorMessage += '\n\n💡 Solution: Ensure the DICOM file is valid and fully rendered.'
      }

      setError(errorMessage)
      console.error('Analysis error:', err)
      console.error('Full error details:', {
        message: err.message,
        stack: err.stack,
        name: err.name
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Upload Angiography Image
          </h1>
          <p className="text-gray-600 text-lg">
            Select or drag and drop your angiography or blood vessel image to begin analysis
          </p>
        </div>

        {/* Upload Box */}
        <div className="mb-8">
          {isDicom && selectedFile ? (
            <div className="max-w-4xl mx-auto bg-black rounded-2xl overflow-hidden shadow-xl aspect-video relative">
              <DicomViewer
                file={selectedFile}
                onImageRendered={(dataUrl) => setDicomDataUrl(dataUrl)}
              />
              <button
                onClick={() => {
                  setSelectedFile(null)
                  setDicomDataUrl(null)
                }}
                className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm hover:bg-red-700 transition"
              >
                Change File
              </button>
            </div>
          ) : (
            <UploadBox onFileSelect={handleFileSelect} selectedFile={selectedFile} />
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-1">
                <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-red-800 mb-2">Analysis Failed</h3>
                <div className="text-sm whitespace-pre-line">{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* Analyze Button */}
        {selectedFile && !isAnalyzing && (
          <div className="flex justify-center">
            <button
              onClick={handleAnalyze}
              className="group relative overflow-hidden bg-gradient-medical text-white px-12 py-4 rounded-xl font-semibold text-lg shadow-medical-glow-strong hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <span className="relative z-10 flex items-center space-x-3">
                <FaFlask />
                <span>Start AI Analysis</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-medical-pink to-medical-purple opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        )}

        {/* Loading State */}
        {isAnalyzing && (
          <div className="bg-white rounded-2xl shadow-xl border-2 border-medical-blue/20 p-8">
            <LoaderAnimation message="Processing your angiography image with AI..." />
          </div>
        )}

        {/* Info Section */}
        {!isAnalyzing && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/80 rounded-xl p-6 border-2 border-medical-blue/20 shadow-md">
              <h3 className="font-semibold text-gray-800 mb-2">Supported Formats</h3>
              <p className="text-sm text-gray-600">JPG, PNG, DICOM, and other common medical image formats</p>
            </div>
            <div className="bg-white/80 rounded-xl p-6 border-2 border-medical-cyan/20 shadow-md">
              <h3 className="font-semibold text-gray-800 mb-2">AI Processing</h3>
              <p className="text-sm text-gray-600">Advanced deep learning models for accurate detection</p>
            </div>
            <div className="bg-white/80 rounded-xl p-6 border-2 border-medical-purple/20 shadow-md">
              <h3 className="font-semibold text-gray-800 mb-2">Privacy & Security</h3>
              <p className="text-sm text-gray-600">Your images are processed securely and not stored permanently</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Upload

