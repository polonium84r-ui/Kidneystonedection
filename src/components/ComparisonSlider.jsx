import { useState, useRef, useEffect } from 'react'
import { FaGripLinesVertical } from 'react-icons/fa'

const ComparisonSlider = ({ originalImage, processedImage, className = '' }) => {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    const handleMove = (e) => {
      if (!isDragging || !containerRef.current) return
      
      const rect = containerRef.current.getBoundingClientRect()
      const clientX = e.clientX || (e.touches && e.touches[0]?.clientX) || 0
      const x = clientX - rect.left
      const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
      setSliderPosition(percentage)
    }

    const handleEnd = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMove)
      document.addEventListener('mouseup', handleEnd)
      document.addEventListener('touchmove', handleMove, { passive: false })
      document.addEventListener('touchend', handleEnd)
    }

    return () => {
      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseup', handleEnd)
      document.removeEventListener('touchmove', handleMove)
      document.removeEventListener('touchend', handleEnd)
    }
  }, [isDragging])

  const handleStart = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  if (!originalImage || !processedImage) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-xl h-96 ${className}`}>
        <p className="text-gray-400">No images to compare</p>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-96 rounded-xl overflow-hidden shadow-2xl border-2 border-white ${className}`}
    >
      {/* Original Image (Background) */}
      <div className="absolute inset-0">
        <img
          src={originalImage}
          alt="Original"
          className="w-full h-full object-contain bg-gray-50"
          onError={(e) => {
            console.error('Failed to load original image')
            e.target.style.display = 'none'
          }}
        />
        <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-lg text-sm font-medium">
          Original
        </div>
      </div>

      {/* Processed Image (Foreground with clip) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img
          src={processedImage}
          alt="Processed"
          className="w-full h-full object-contain bg-gray-50"
          onError={(e) => {
            console.error('Failed to load processed image')
            e.target.style.display = 'none'
          }}
        />
        <div className="absolute top-4 right-4 bg-gradient-medical-soft text-white px-3 py-1 rounded-lg text-sm font-medium shadow-lg">
          AI Detection
        </div>
      </div>

      {/* Slider Handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize z-10 touch-none"
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
        onMouseDown={handleStart}
        onTouchStart={handleStart}
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-xl border-2 border-medical-blue">
          <FaGripLinesVertical className="text-medical-blue" />
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg text-sm">
        Drag left/right to compare
      </div>
    </div>
  )
}

export default ComparisonSlider

