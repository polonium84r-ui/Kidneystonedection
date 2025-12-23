import { FaImage } from 'react-icons/fa'

const ImagePreview = ({ src, alt = 'Preview', className = '' }) => {
  if (!src) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 rounded-xl ${className}`}>
        <FaImage className="text-4xl text-gray-400" />
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden rounded-xl shadow-lg border-2 border-white ${className}`}>
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-contain"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
    </div>
  )
}

export default ImagePreview


