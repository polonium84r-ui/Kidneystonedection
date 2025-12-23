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

  return `As a medical AI assistant, analyze this heart angiography report:

Key Findings:
- Clot Probability: ${(clotProbability * 100).toFixed(1)}%
- Blockage Location: ${blockageLocation}
- Narrowing Percentage: ${narrowingPercentage.toFixed(1)}%
- Severity Level: ${severity.toUpperCase()}
- Confidence Score: ${(confidence * 100).toFixed(1)}%

Please provide:
1. A concise medical interpretation of these findings
2. Clinical significance assessment
3. Recommended next steps for the patient
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

  if (severity === 'high' || narrowingPercentage >= 60) {
    interpretation = `The angiography reveals significant arterial narrowing (${narrowingPercentage.toFixed(1)}%) in the ${blockageLocation}, indicating substantial coronary artery disease. The high clot probability (${(clotProbability * 100).toFixed(1)}%) suggests active thrombotic processes that require immediate attention.`
    
    significance = `This represents a high-risk cardiovascular condition that may lead to acute coronary events if left untreated. The blockage significantly compromises blood flow to cardiac muscle tissue.`
    
    recommendations = `Urgent cardiology consultation within 24-48 hours is recommended. Consider immediate stress testing, additional imaging (CT angiography), and evaluation for interventional procedures such as angioplasty or stenting. Review all cardiac risk factors and medication compliance.`
    
    riskFactors = `Key risk factors include: advanced age, family history of CAD, smoking history, hypertension, dyslipidemia, diabetes mellitus, and sedentary lifestyle. Immediate lifestyle modifications and optimal medical therapy are crucial.`
  } else if (severity === 'medium' || narrowingPercentage >= 30) {
    interpretation = `Moderate arterial narrowing (${narrowingPercentage.toFixed(1)}%) detected in the ${blockageLocation} suggests developing coronary artery disease. The clot probability of ${(clotProbability * 100).toFixed(1)}% indicates some thrombotic risk that warrants monitoring.`
    
    significance = `This finding represents an intermediate risk for cardiovascular events. While not immediately critical, it indicates progressive disease that requires proactive management and monitoring.`
    
    recommendations = `Schedule cardiology follow-up within 2-4 weeks. Consider additional diagnostic testing including echocardiogram, stress testing, and lipid panel. Implement aggressive cardiovascular risk factor modification including diet, exercise, and medication optimization.`
    
    riskFactors = `Monitor traditional risk factors: lipid profile, blood pressure control, glycemic status if diabetic, and smoking cessation. Consider assessment for metabolic syndrome and inflammatory markers.`
  } else {
    interpretation = `Minimal arterial narrowing (${narrowingPercentage.toFixed(1)}%) observed in the ${blockageLocation} indicates relatively preserved coronary anatomy. The low clot probability (${(clotProbability * 100).toFixed(1)}%) is reassuring for short-term cardiovascular risk.`
    
    significance = `These findings suggest low immediate cardiovascular risk. However, continued monitoring is important as early-stage disease can progress.`
    
    recommendations = `Continue routine cardiovascular monitoring with annual follow-up. Maintain heart-healthy lifestyle including regular exercise, Mediterranean diet, and optimal control of all modifiable risk factors. Consider preventive cardiology assessment.`
    
    riskFactors = `Focus on primary prevention: maintain healthy weight, regular physical activity, balanced nutrition, blood pressure management, and avoid tobacco use. Regular monitoring of cholesterol and other biomarkers is recommended.`
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

