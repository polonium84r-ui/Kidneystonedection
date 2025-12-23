import { useEffect, useRef, useState } from 'react'
import cornerstone from '../utils/dicomImageLoader'
import cornerstoneWADOImageLoader from 'cornerstone-wado-image-loader'

const DicomViewer = ({ file, onImageRendered }) => {
    const elementRef = useRef(null)
    const [imageId, setImageId] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!file || !elementRef.current) return

        // Enable the element
        cornerstone.enable(elementRef.current)

        // Add file to the loader
        const imageId = cornerstoneWADOImageLoader.wadouri.fileManager.add(file)
        setImageId(imageId)

        // Load and display the image
        cornerstone.loadImage(imageId).then(
            (image) => {
                cornerstone.displayImage(elementRef.current, image)

                // Notify parent that image is rendered and pass the data URL (PNG)
                if (onImageRendered) {
                    // Wait a brief moment for the render to complete
                    setTimeout(() => {
                        try {
                            // Convert the canvas to a data URL (PNG)
                            const canvas = elementRef.current.querySelector('canvas')
                            if (canvas) {
                                const dataUrl = canvas.toDataURL('image/png')
                                onImageRendered(dataUrl)
                            }
                        } catch (err) {
                            console.error('Error capturing DICOM canvas:', err)
                        }
                    }, 100)
                }
            },
            (err) => {
                console.error('Error loading DICOM image:', err)
                setError('Failed to load DICOM image. Please ensure it is a valid .dcm file.')
            }
        )

        // Cleanup
        return () => {
            // We carefully disable only if the ref is still valid
            if (elementRef.current) {
                try {
                    cornerstone.disable(elementRef.current)
                } catch (e) {
                    console.warn("Cornerstone disable error", e)
                }
            }
        }
    }, [file, onImageRendered])

    return (
        <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden rounded-lg">
            {error ? (
                <div className="text-red-500 p-4 text-center">{error}</div>
            ) : (
                <div
                    ref={elementRef}
                    className="w-full h-full"
                    style={{ minHeight: '400px', width: '100%', height: '100%' }}
                />
            )}
            <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                DICOM Viewer
            </div>
        </div>
    )
}

export default DicomViewer
