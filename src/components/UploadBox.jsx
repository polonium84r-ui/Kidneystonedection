import { useState, useRef, useEffect } from 'react'
import { FaCloudUploadAlt, FaImage, FaTimes } from 'react-icons/fa'

const UploadBox = ({ onFileSelect, selectedFile }) => {
  const [isDragging, setIsDragging] = useState(false)
  const [previewUrl, setPreviewUrl] = useState(null)
  const fileInputRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && (file.type.startsWith('image/') || file.name.toLowerCase().endsWith('.dcm'))) {
      onFileSelect(file)
    }
  }

  const handleFileInput = (e) => {
    const file = e.target.files[0]
    if (file) {
      onFileSelect(file)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemove = (e) => {
    e.stopPropagation()
    onFileSelect(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Handle preview URL creation and cleanup
  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile)
      setPreviewUrl(url)

      // Cleanup function to revoke the URL when component unmounts or file changes
      return () => {
        URL.revokeObjectURL(url)
      }
    } else {
      setPreviewUrl(null)
    }
  }, [selectedFile])

  return (
    <div
      className={`
        relative w-full max-w-4xl mx-auto
        border-2 border-dashed rounded-2xl p-8
        transition-all duration-300 cursor-pointer
        ${isDragging
          ? 'border-medical-cyan bg-cyan-50/50 shadow-cyan-glow scale-105'
          : selectedFile
            ? 'border-medical-purple bg-purple-50/30 shadow-purple-glow'
            : 'border-medical-blue/50 bg-white/50 hover:border-medical-blue hover:bg-blue-50/50 hover:shadow-medical-glow'
        }
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.dcm"
        onChange={handleFileInput}
        className="hidden"
      />

      {selectedFile && previewUrl ? (
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <img
              src={previewUrl}
              alt="Preview"
              className="max-h-64 rounded-xl shadow-lg border-2 border-white"
              onError={(e) => {
                console.error('Failed to load image preview')
                e.target.style.display = 'none'
              }}
            />
            <button
              onClick={handleRemove}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 shadow-lg hover:bg-red-600 transition-colors"
            >
              <FaTimes />
            </button>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700">{selectedFile.name}</p>
            <p className="text-xs text-gray-500">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <FaCloudUploadAlt className="text-6xl text-medical-blue" />
            <div className="absolute inset-0 bg-medical-blue/20 blur-2xl rounded-full"></div>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Drag & Drop Your Angiography Image
            </h3>
            <p className="text-gray-600 mb-4">or click to browse</p>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <FaImage className="text-medical-cyan" />
              <span>Supports: JPG, PNG, DICOM</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UploadBox


