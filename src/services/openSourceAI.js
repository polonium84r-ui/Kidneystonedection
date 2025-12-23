/**
 * Open Source AI Integration
 * 
 * This service integrates with open source AI models to provide additional insights
 * after image analysis. Supports multiple providers:
 * - Hugging Face Inference API (recommended - free tier available)
 * - Local models via Ollama (optional)
 * - Other open source AI services
 * 
 * Configuration:
 * Set HUGGINGFACE_API_KEY in your environment or leave empty for demo mode
 * For Hugging Face: Get free API key from https://huggingface.co/settings/tokens
 */

// Hugging Face API Configuration
const HUGGINGFACE_API_KEY = import.meta.env.VITE_HUGGINGFACE_API_KEY || ''
const HUGGINGFACE_MODEL = 'mistralai/Mistral-7B-Instruct-v0.2' // Open source model

// Alternative: Use smaller model if API key is not available (may have rate limits)
const FALLBACK_MODEL = 'microsoft/DialoGPT-medium'

/**
 * Generate AI insights based on analysis results using open source AI
 * @param {Object} analysisData - The analysis results from image processing
 * @returns {Promise<Object>} AI-generated insights and recommendations
 */
export const generateAIInsights = async (analysisData) => {
  try {
    // Prepare prompt for AI
    const prompt = createMedicalPrompt(analysisData)

    // Try Hugging Face API first
    if (HUGGINGFACE_API_KEY) {
      return await callHuggingFaceAPI(prompt)
    } else {
      // Demo mode - return enhanced mock insights
      return await generateMockInsights(analysisData)
    }
  } catch (error) {
    console.error('Open Source AI Error:', error)
    // Fallback to mock insights on error
    return await generateMockInsights(analysisData)
  }
}

/**
 * Create a medical prompt for AI analysis
 */
const createMedicalPrompt = (analysisData) => {
  const {
    clotProbability = 0,
    blockageLocation = 'Unknown',
    narrowingPercentage = 0,
    severity = 'low',
    confidence = 0,
  } = analysisData.analysis || analysisData

  return `As a medical AI assistant, analyze this kidney stone detection report from a CT scan:

Key Findings:
- Stone Probability: ${(clotProbability * 100).toFixed(1)}%
- Stone Location: ${blockageLocation}
- Stone Size Estimate: ${narrowingPercentage.toFixed(1)}mm
- Severity Level: ${severity.toUpperCase()}
- Confidence Score: ${(confidence * 100).toFixed(1)}%

Please provide:
1. A concise medical interpretation of these findings
2. Clinical significance assessment
3. Recommended next steps for the patient (urology consult, fluids, etc.)
4. Potential risk factors to consider

Keep the response professional, concise, and medically appropriate.`
}

/**
 * Call Hugging Face Inference API
 */
const callHuggingFaceAPI = async (prompt) => {
  try {
    const response = await fetch(
      `https://api-inference.huggingface.co/models/${HUGGINGFACE_MODEL}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 300,
            temperature: 0.7,
            return_full_text: false,
          },
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.status}`)
    }

    const data = await response.json()

    // Parse response (format varies by model)
    let aiText = ''
    if (Array.isArray(data) && data[0]?.generated_text) {
      aiText = data[0].generated_text
    } else if (data.generated_text) {
      aiText = data.generated_text
    } else if (typeof data === 'string') {
      aiText = data
    } else {
      aiText = JSON.stringify(data)
    }

    return parseAIResponse(aiText)
  } catch (error) {
    console.error('Hugging Face API call failed:', error)
    throw error
  }
}

/**
 * Parse AI response into structured format
 */
const parseAIResponse = (aiText) => {
  // Simple parsing - can be enhanced based on actual model output
  const lines = aiText.split('\n').filter(line => line.trim())

  return {
    interpretation: extractSection(lines, ['interpretation', 'finding', 'analysis']) ||
      lines.slice(0, 2).join(' '),
    clinicalSignificance: extractSection(lines, ['significance', 'clinical', 'importance']) ||
      lines.slice(2, 4).join(' '),
    recommendations: extractSection(lines, ['recommend', 'next step', 'action']) ||
      lines.slice(4, 6).join(' '),
    riskFactors: extractSection(lines, ['risk', 'factor', 'consider']) ||
      lines.slice(6, 8).join(' '),
    rawResponse: aiText,
    source: 'Hugging Face (Open Source)',
  }
}

/**
 * Extract section from AI response
 */
const extractSection = (lines, keywords) => {
  const relevantLines = lines.filter(line =>
    keywords.some(keyword =>
      line.toLowerCase().includes(keyword)
    )
  )
  return relevantLines.length > 0 ? relevantLines.join(' ') : null
}

/**
 * Generate enhanced mock insights (demo mode)
 */
const generateMockInsights = async (analysisData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500))

  const {
    clotProbability = 0.75,
    blockageLocation = 'Left Anterior Descending (LAD)',
    narrowingPercentage = 45,
    severity = 'medium',
    confidence = 0.92,
  } = analysisData.analysis || analysisData

  // Generate contextual insights based on severity
  let interpretation, significance, recommendations, riskFactors

  if (severity === 'high' || narrowingPercentage >= 10) {
    interpretation = `The CT scan reveals a significant renal calculus (approx. ${narrowingPercentage.toFixed(1)}mm) in the ${blockageLocation}, indicating potential high-grade obstruction. The high probability (${(clotProbability * 100).toFixed(1)}%) suggests a dense stone burden requiring immediate evaluation.`

    significance = `This represents a high-risk condition for hydronephrosis and potential renal damage if left untreated. Large stones in this location rarely pass spontaneously.`

    recommendations = `Urgent urology consultation is recommended. Consider surgical intervention (Shock Wave Lithotripsy or Ureteroscopy). Increase fluid intake immediately unless contraindicated. Pain management and alpha-blockers may be required.`

    riskFactors = `Key risk factors include: dehydration, high sodium/protein intake, family history of stones, and metabolic abnormalities (hypercalciuria, hyperuricosuria).`
  } else if (severity === 'medium' || narrowingPercentage >= 5) {
    interpretation = `Moderate sized calculus (${narrowingPercentage.toFixed(1)}mm) detected in the ${blockageLocation}. The probability of ${(clotProbability * 100).toFixed(1)}% confirms the presence of a stone that may cause intermittent obstruction.`

    significance = `This finding suggests a symptomatic stone that may require medical expulsion therapy. Spontaneous passage is possible but not guaranteed.`

    recommendations = `Schedule urology follow-up. Initiate medical expulsion therapy (Tamsulosin) and hydration protocol (>2.5L/day). Monitor for fever or intractable pain. Repeat imaging (KUB/Ultrasound) in 2-4 weeks.`

    riskFactors = `Monitor hydration status and urinary pH. Dietary modification (low salt, moderate oxalate) is advisable to prevent growth.`
  } else {
    interpretation = `Small non-obstructing calculus or microlithiasis (${narrowingPercentage.toFixed(1)}mm) observed in the ${blockageLocation}. The low probability (${(clotProbability * 100).toFixed(1)}%) suggests this may be a phlebolith or very small stone.`

    significance = `These findings suggest low immediate risk. Small stones often pass spontaneously with adequate hydration.`

    recommendations = `Continue conservative management with high fluid intake. Manage symptomatically. Routine follow-up if symptoms persist or worsen.`

    riskFactors = `Focus on prevention: maintain high urine output (>2.5L/day), balanced diet, and regular physical activity.`
  }

  return {
    interpretation,
    clinicalSignificance: significance,
    recommendations,
    riskFactors,
    rawResponse: `${interpretation}\n\n${significance}\n\n${recommendations}\n\n${riskFactors}`,
    source: 'Open Source AI (Demo Mode)',
    note: 'To enable real AI insights, configure HUGGINGFACE_API_KEY in your environment variables.',
  }
}

/**
 * Alternative: Local AI using Ollama (if installed)
 * Uncomment and configure if you have Ollama running locally
 */
export const generateLocalAIInsights = async (analysisData) => {
  try {
    const prompt = createMedicalPrompt(analysisData)

    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama2', // or 'mistral', 'codellama', etc.
        prompt: prompt,
        stream: false,
      }),
    })

    if (!response.ok) {
      throw new Error('Ollama not available')
    }

    const data = await response.json()
    return parseAIResponse(data.response)
  } catch (error) {
    console.log('Ollama not available, falling back to demo mode')
    return await generateMockInsights(analysisData)
  }
}

