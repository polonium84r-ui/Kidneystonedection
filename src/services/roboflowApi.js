/**
 * Roboflow API Integration
 * 
 * Integration for Heart Angiography Analysis using Roboflow
 * 
 * Environment Variables:
 * - VITE_ROBOFLOW_API_KEY: Your Roboflow API key
 */

import { drawDetections } from './detectionUtils'

// Roboflow Configuration (Backend Proxy)
const API_ENDPOINT = '/api/analysis/detect';

/**
 * Analyzes an angiography image using the Backend API (which proxies to Roboflow)
 * @param {File} imageFile - The image file to analyze
 * @returns {Promise<Object>} Analysis results with processed image and detection data
 */
export const analyzeImage = async (imageFile) => {
  if (!imageFile) {
    throw new Error('No image file provided')
  }

  console.log('Sending image to backend for analysis...')

  try {
    // 1. Prepare FormData
    const formData = new FormData();
    formData.append('file', imageFile);

    // 2. Get Auth Token
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Authentication required based on backend configuration. Please login.');
    }

    // 3. Make the request to Backend
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        'x-auth-token': token
        // Content-Type is set automatically for FormData
      },
      body: formData
    })

    if (!response.ok) {
      const errorText = await response.text()
      try {
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.msg || errorJson.message || `Backend request failed: ${response.status}`);
      } catch (e) {
        throw new Error(`Backend request failed: ${response.status} - ${errorText}`);
      }
    }

    const result = await response.json()
    console.log('Backend Response:', result)

    // 4. Process predictions
    // Workflow response structure observed: { outputs: [ { predictions: { predictions: [...] } } ] }
    let predictions = [];

    // Helper to safely access nested properties
    const getPredictions = (obj) => {
      if (!obj) return null;
      if (Array.isArray(obj)) return obj;
      if (obj.predictions) return getPredictions(obj.predictions);
      return null; // Stop if no predictions found in this branch
    };

    if (result.predictions && Array.isArray(result.predictions)) {
      predictions = result.predictions;
    } else if (result.outputs && result.outputs.length > 0) {
      // Try the first output block
      const firstOutput = result.outputs[0];

      // Check for specific deep nesting seen in "rit-radar" workflow
      // Structure: outputs[0].predictions.predictions (Array)
      if (firstOutput.predictions && firstOutput.predictions.predictions && Array.isArray(firstOutput.predictions.predictions)) {
        predictions = firstOutput.predictions.predictions;
      }
      // Check for direct predictions array in output
      else if (firstOutput.predictions && Array.isArray(firstOutput.predictions)) {
        predictions = firstOutput.predictions;
      }
      // Check if output itself is the array
      else if (Array.isArray(firstOutput)) {
        predictions = firstOutput;
      }
      // Fallback: Check all outputs
      else {
        for (const key in result.outputs) {
          const extracted = getPredictions(result.outputs[key]);
          if (extracted && extracted.length > 0) {
            predictions = extracted;
            break;
          }
        }
      }
    }

    console.log(`Extracted ${predictions.length} predictions from workflow response`);

    // 5. Get Image Dimensions for calculations
    const imgBitmap = await createImageBitmap(imageFile);
    const imgWidth = imgBitmap.width;
    const imgHeight = imgBitmap.height;

    // 6. Normalize analysis data with clinical measurements
    const analysis = extractAnalysisFromRoboflow(predictions, imgWidth, imgHeight)

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
    console.error('Analysis Error:', error)
    throw error
  }
}

/**
 * Extract analysis data from Roboflow predictions
 * @param {Array} predictions 
 */
/**
 * Extract analysis data from Roboflow predictions
 * @param {Array} predictions 
 * @param {number} imgWidth
 * @param {number} imgHeight
 */
const extractAnalysisFromRoboflow = (predictions, imgWidth, imgHeight) => {
  // Normalize Roboflow predictions to common format if needed
  // Roboflow format: { x, y, width, height, class, confidence }

  const PIXEL_TO_MM_SCALE = 0.264; // Standard 96 DPI assumption

  let measurements = [];

  if (predictions && predictions.length > 0) {
    measurements = predictions.map((p, index) => {
      // 1. Size Calculation (mm)
      const widthMM = (p.width || 0) * PIXEL_TO_MM_SCALE;
      const heightMM = (p.height || 0) * PIXEL_TO_MM_SCALE;
      const sizeText = `${widthMM.toFixed(1)}mm x ${heightMM.toFixed(1)}mm`;

      // 2. Shape Classification
      const ratio = (p.width && p.height) ? (p.width / p.height) : 1;
      let shape = 'Round';
      if (ratio > 1.5 || ratio < 0.66) {
        shape = 'Elongated';
      } else if (ratio > 1.2 || ratio < 0.83) {
        shape = 'Oval';
      }

      // 3. Distance to Ureter (Reference: Bottom Center of Image)
      // Defaulting to simple Euclidean distance to bottom-center
      const refX = imgWidth ? (imgWidth / 2) : 0;
      const refY = imgHeight ? imgHeight : 0;
      const stoneX = p.x || 0;
      const stoneY = p.y || 0;

      const distPixels = Math.sqrt(Math.pow(stoneX - refX, 2) + Math.pow(stoneY - refY, 2));
      const distURA = distPixels * PIXEL_TO_MM_SCALE;

      return {
        id: index + 1,
        class: p.class,
        confidence: p.confidence,
        widthMM: widthMM.toFixed(1),
        heightMM: heightMM.toFixed(1),
        sizeText: sizeText,
        shape: shape,
        distanceToUreterMM: distURA.toFixed(1)
      };
    });
  }

  const confidences = predictions.map(p => p.confidence)
  const maxConf = confidences.length ? Math.max(...confidences) : 0
  const avgConf = confidences.length ? confidences.reduce((a, b) => a + b, 0) / confidences.length : 0

  const classes = [...new Set(predictions.map(p => p.class))]

  // Logic for severity and medical suggestions
  let severity = 'low'
  if (predictions.length >= 2 || maxConf > 0.8) { // Adjusted logic slightly for stones
    severity = 'high'
  } else if (predictions.length >= 1 || maxConf > 0.5) {
    severity = 'medium'
  }

  // Estimate obstruction risk (heuristic for stones)
  let obstructionRisk = 0
  if (predictions.length > 0) {
    obstructionRisk = Math.min(95, (avgConf * 60) + (predictions.length * 10))
  }

  return {
    stoneProbability: maxConf, // Renamed from clotProbability
    stoneLocation: classes.length > 0 ? classes.join(', ') : 'None detected', // Renamed from blockageLocation
    obstructionRisk: Math.round(obstructionRisk), // Renamed from narrowingPercentage
    severity: severity,
    confidence: maxConf,
    detectionStatus: predictions.length > 0 ? `${predictions.length} kidney stone(s) detected` : 'No kidney stones detected',
    suggestions: generateSuggestions(severity, classes),
    predictions: predictions,
    detectedClasses: classes,
    totalDetections: predictions.length,
    averageConfidence: avgConf,
    clinicalMeasurements: measurements,
    // Backward compatibility for existing components if needed (though we plan to refactor them too)
    clotProbability: maxConf,
    blockageLocation: classes.length > 0 ? classes.join(', ') : 'None detected',
    narrowingPercentage: Math.round(obstructionRisk)
  }
}

const generateSuggestions = (severity, classes) => {
  const suggestions = []
  if (severity === 'high') {
    suggestions.push("Urgent urology consultation recommended due to large/multiple stones.")
    suggestions.push("Potential significant urinary tract obstruction identified.")
  } else if (severity === 'medium') {
    suggestions.push("Clinical follow-up required. Monitor for symptoms (renal colic).")
  } else {
    suggestions.push("No significant calculus detected.")
  }
  return suggestions
}
