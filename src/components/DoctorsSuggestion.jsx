import { useState } from 'react'
import { FaUserMd, FaEdit, FaCheckCircle } from 'react-icons/fa'

const DoctorsSuggestion = ({ 
  initialValue = '',
  maxLength = 1000,
  onSave,
  className = '' 
}) => {
  const [suggestion, setSuggestion] = useState(initialValue)
  const [isFocused, setIsFocused] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  const handleChange = (e) => {
    const value = e.target.value
    if (value.length <= maxLength) {
      setSuggestion(value)
      setIsSaved(false)
    }
  }

  const handleSave = () => {
    if (onSave) {
      onSave(suggestion)
    }
    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2000)
  }

  const remainingChars = maxLength - suggestion.length
  const isNearLimit = remainingChars < 100

  return (
    <div 
      className={`
        relative overflow-hidden
        bg-white
        border-2 border-green-300/50
        rounded-2xl shadow-xl
        transition-all duration-300
        hover:shadow-2xl hover:border-green-400/60
        ${className}
      `}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-green-500/10 border-b border-green-200/30 p-5 rounded-t-2xl">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="absolute inset-0 bg-green-500/20 blur-lg rounded-full"></div>
            <FaUserMd className="relative text-2xl text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Doctor's Suggestion
            </h2>
            <p className="text-gray-600 text-sm mt-0.5">
              Professional medical recommendation and notes
            </p>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6">
        {/* Textarea Container */}
        <div className="relative">
          <div className={`
            relative rounded-xl
            transition-all duration-300
            ${isFocused 
              ? 'ring-2 ring-green-400/50 shadow-lg shadow-green-200/20' 
              : 'ring-1 ring-green-200/30 shadow-sm'
            }
            ${isFocused ? 'bg-white' : 'bg-gray-50/50'}
          `}>
            <textarea
              value={suggestion}
              onChange={handleChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Type doctor's recommendation..."
              className={`
                w-full min-h-[200px] md:min-h-[240px]
                px-5 py-4
                text-gray-800
                bg-transparent
                border-none
                outline-none
                resize-none
                placeholder:text-gray-400
                placeholder:italic
                text-base
                leading-relaxed
                font-normal
                transition-colors duration-200
                focus:placeholder:text-gray-300
              `}
              rows={10}
            />
          </div>

          {/* Character Counter & Save Button */}
          <div className="flex items-center justify-between mt-4 px-2">
            {/* Character Counter */}
            <div className="flex items-center space-x-2">
              <span className={`
                text-sm font-medium
                transition-colors duration-200
                ${isNearLimit 
                  ? 'text-amber-600' 
                  : 'text-gray-500'
                }
              `}>
                <span className={remainingChars < 0 ? 'text-red-600 font-bold' : ''}>
                  {remainingChars}
                </span>
                {' '}characters remaining
              </span>
              {isNearLimit && (
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
              )}
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={suggestion.length === 0}
              className={`
                flex items-center space-x-2
                px-5 py-2.5
                rounded-lg
                font-semibold text-sm
                transition-all duration-300
                ${
                  suggestion.length === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : isSaved
                    ? 'bg-green-500 text-white shadow-lg scale-105'
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95'
                }
              `}
            >
              {isSaved ? (
                <>
                  <FaCheckCircle className="text-lg" />
                  <span>Saved</span>
                </>
              ) : (
                <>
                  <FaEdit className="text-lg" />
                  <span>Save Note</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Helper Text */}
        <div className="mt-4 p-3 bg-green-50/50 border border-green-200/30 rounded-lg">
          <p className="text-xs text-gray-600 leading-relaxed">
            <strong className="text-green-700">Tip:</strong> Include specific clinical observations, treatment recommendations, follow-up instructions, or any additional context that would be valuable for patient care.
          </p>
        </div>
      </div>
    </div>
  )
}

export default DoctorsSuggestion

