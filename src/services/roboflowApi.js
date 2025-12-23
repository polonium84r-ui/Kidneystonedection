/**
 * Roboflow API Integration
 * 
 * Integration for Heart Angiography Analysis using Roboflow
 * 
 * Environment Variables:
 * - VITE_ROBOFLOW_API_KEY: Your Roboflow API key
 */

import { drawDetections } from './detectionUtils'

// Roboflow Configuration
const ROBOFLOW_API_KEY = import.meta.env.VITE_ROBOFLOW_API_KEY || 'R8FMaPoYSNTZ8c7cw4aa'
const ROBOFLOW_MODEL_ENDPOINT = 'angio-stenosis1/1'
const ROBOFLOW_API_URL = `https://serverless.roboflow.com/${ROBOFLOW_MODEL_ENDPOINT}`

/**
 * Convert File to Base64 string
 * @param {File} file 
 * @returns {Promise<string>}
 */
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      // Remove data URL prefix (e.g. "data:image/jpeg;base64,")
      const base64String = reader.result
      resolve(base64String)
    }
    reader.onerror = (error) => reject(error)
  })
}

/**
 * Analyzes an angiography image using Roboflow API
 * @param {File} imageFile - The image file to analyze
 * @returns {Promise<Object>} Analysis results with processed image and detection data
 */
export const analyzeImage = async (imageFile) => {
  if (!imageFile) {
    throw new Error('No image file provided')
  }

  console.log('Using Roboflow API for analysis')

  try {
    // 1. Convert image to Base64
    const base64Image = await fileToBase64(imageFile)

    // 2. Prepare URL with API Key
    const url = new URL(ROBOFLOW_API_URL)
    url.searchParams.append('api_key', ROBOFLOW_API_KEY)
    
    // 3. Make the request
    // Roboflow expects the body to be the base64 string directly or url-encoded
    // The user's snippet used axios with x-www-form-urlencoded and data=image
    // For fetch, we can send the base64 string as the body with plain/text or x-www-form-urlencoded
    
    console.log('Sending request to Roboflow:', url.toString())

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: base64Image
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Roboflow API request failed: ${response.status} ${response.statusText} - ${errorText}`)
    }

    const result = await response.json()
    console.log('Roboflow API Response:', result)

    // 4. Process predictions
    const predictions = result.predictions || []
    
    // 5. Normalize analysis data
    const analysis = extractAnalysisFromRoboflow(predictions)

    // 6. Draw detections on image
    const originalImageUrl = URL.createObjectURL(imageFile)
    let processedImage = originalImageUrl

    if (predictions.length > 0) {
      try {
        console.log(`Drawing bounding boxes for ${predictions.length} detections`)
        processedImage = await drawDetections(originalImageUrl, predictions)
      } catch (drawError) {
        console.error('Failed to draw detections:', drawError)
      }
    }

    return {
      processedImage: processedImage,
      analysis: analysis,
      rawResponse: result,
      predictions: predictions
    }

  } catch (error) {
    console.error('Roboflow Analysis Error:', error)
    if (error.message.includes('Failed to fetch')) {
        throw new Error('Network error: Could not connect to Roboflow API. Please check your internet connection.')
    }
    throw error
  }
}

/**
 * Extract analysis data from Roboflow predictions
 * @param {Array} predictions 
 */
const extractAnalysisFromRoboflow = (predictions) => {
  // Normalize Roboflow predictions to common format if needed
  // Roboflow format: { x, y, width, height, class, confidence }
  
  const confidences = predictions.map(p => p.confidence)
  const maxConf = confidences.length ? Math.max(...confidences) : 0
  const avgConf = confidences.length ? confidences.reduce((a, b) => a + b, 0) / confidences.length : 0
  
  const classes = [...new Set(predictions.map(p => p.class))]
  
  // Logic for severity and medical suggestions
  let severity = 'low'
  if (predictions.length >= 3 || maxConf > 0.8) {
    severity = 'high'
  } else if (predictions.length >= 1 || maxConf > 0.5) {
    severity = 'medium'
  }

  // Estimate narrowing (heuristic)
  let narrowingPercentage = 0
  if (predictions.length > 0) {
    narrowingPercentage = Math.min(95, (avgConf * 70) + (predictions.length * 5))
  }

  return {
    clotProbability: maxConf,
    blockageLocation: classes.length > 0 ? classes.join(', ') : 'None detected',
    narrowingPercentage: Math.round(narrowingPercentage),
    severity: severity,
    confidence: maxConf,
    detectionStatus: predictions.length > 0 ? `${predictions.length} potential blockage(s) detected` : 'No blockages detected',
    suggestions: generateSuggestions(severity, classes),
    predictions: predictions,
    detectedClasses: classes,
    totalDetections: predictions.length,
    averageConfidence: avgConf
  }
}

const generateSuggestions = (severity, classes) => {
    const suggestions = []
    if (severity === 'high') {
        suggestions.push("Urgent medical consultation recommended due to high confidence detection.")
        suggestions.push("Potential significant stenosis or blockage identified.")
    } else if (severity === 'medium') {
        suggestions.push("Follow-up required. Moderate confidence detection.")
    } else {
        suggestions.push("No significant abnormalities detected.")
    }
    return suggestions
}
