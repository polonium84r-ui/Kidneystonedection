import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

/**
 * PDF Generation Service
 * Generates a comprehensive PDF report of the analysis results
 */

/**
 * Convert image URL to base64
 */
const imageToBase64 = (url) => {
  return new Promise((resolve, reject) => {
    // Handle blob URLs and data URLs directly
    if (url.startsWith('data:')) {
      resolve(url)
      return
    }

    const img = new Image()

    // Set crossOrigin only for http/https URLs
    if (url.startsWith('http://') || url.startsWith('https://')) {
      img.crossOrigin = 'anonymous'
    }

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        // Limit image size for PDF (max 200mm width)
        const maxWidth = 1500
        const maxHeight = 1500

        let width = img.width
        let height = img.height

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height)
          width = width * ratio
          height = height * ratio
        }

        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        const base64 = canvas.toDataURL('image/jpeg', 0.8) // Use JPEG with quality
        resolve(base64)
      } catch (error) {
        // If canvas fails, try direct fetch
        fetch(url)
          .then(response => response.blob())
          .then(blob => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result)
            reader.onerror = reject
            reader.readAsDataURL(blob)
          })
          .catch(reject)
      }
    }

    img.onerror = () => {
      // Fallback: try fetch for blob URLs
      if (url.startsWith('blob:')) {
        fetch(url)
          .then(response => response.blob())
          .then(blob => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result)
            reader.onerror = reject
            reader.readAsDataURL(blob)
          })
          .catch(reject)
      } else {
        reject(new Error('Failed to load image'))
      }
    }

    img.src = url
  })
}

/**
 * Generate PDF report from analysis data
 * @param {Object} analysisData - Complete analysis data
 * @param {Object} patientDetails - Patient details (name, id, age, gender)
 * @param {string} doctorName - Name of the doctor who analyzed
 */
export const generatePDFReport = async (analysisData, aiInsights = null, doctorSuggestion = '', patientDetails = {}, doctorName = '') => {
  try {
    // Validate input
    if (!analysisData) {
      throw new Error('Analysis data is required to generate PDF')
    }

    const doc = new jsPDF('p', 'mm', 'a4')
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 15
    let yPos = margin

    // Helper function to add new page if needed
    const checkNewPage = (requiredHeight = 20) => {
      if (yPos + requiredHeight > pageHeight - margin) {
        doc.addPage()
        yPos = margin
        return true
      }
      return false
    }

    // Helper function to add text with word wrap
    const addText = (text, fontSize = 10, isBold = false, color = [0, 0, 0]) => {
      if (!text) return // Skip if text is null/undefined/empty
      const lines = doc.splitTextToSize(String(text), pageWidth - 2 * margin)
      doc.setFontSize(fontSize)
      doc.setTextColor(color[0], color[1], color[2])
      if (isBold) {
        doc.setFont(undefined, 'bold')
      } else {
        doc.setFont(undefined, 'normal')
      }

      checkNewPage(lines.length * (fontSize * 0.35) + 5)
      doc.text(lines, margin, yPos)
      yPos += lines.length * (fontSize * 0.35) + 5
    }

    // Header
    doc.setFillColor(59, 130, 246) // Medical blue
    doc.rect(0, 0, pageWidth, 35, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(20)
    doc.setFont(undefined, 'bold')
    doc.text('Kidney Stone Analysis Report', margin, 20)

    doc.setFontSize(10)
    doc.setFont(undefined, 'normal')
    const dateStr = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
    doc.text(`Generated on: ${dateStr}`, margin, 28)

    yPos = 45
    doc.setTextColor(0, 0, 0)

    // Patient Details Section
    if (patientDetails && (patientDetails.name || patientDetails.id)) {
      addText('PATIENT DETAILS', 14, true, [59, 130, 246])
      doc.setDrawColor(59, 130, 246)
      doc.line(margin, yPos - 2, pageWidth - margin, yPos - 2)
      yPos += 5

      const colWidth = (pageWidth - 2 * margin) / 2

      // Row 1: Name and ID
      doc.setFontSize(11)
      doc.setFont(undefined, 'bold')
      doc.text(`Patient Name:`, margin, yPos)
      doc.setFont(undefined, 'normal')
      doc.text(patientDetails.name || 'N/A', margin + 35, yPos)

      doc.setFont(undefined, 'bold')
      doc.text(`Patient ID:`, margin + colWidth, yPos)
      doc.setFont(undefined, 'normal')
      doc.text(patientDetails.id || 'N/A', margin + colWidth + 25, yPos)
      yPos += 7

      // Row 2: Age and Gender
      doc.setFont(undefined, 'bold')
      doc.text(`Age:`, margin, yPos)
      doc.setFont(undefined, 'normal')
      doc.text(patientDetails.age ? `${patientDetails.age} years` : 'N/A', margin + 35, yPos)

      doc.setFont(undefined, 'bold')
      doc.text(`Gender:`, margin + colWidth, yPos)
      doc.setFont(undefined, 'normal')
      doc.text(patientDetails.gender || 'N/A', margin + colWidth + 25, yPos)
      yPos += 7

      // Row 3: Doctor and Date
      doc.setFont(undefined, 'bold')
      doc.text(`Doctor Name:`, margin, yPos)
      doc.setFont(undefined, 'normal')
      doc.text(doctorName || 'N/A', margin + 35, yPos)

      doc.setFont(undefined, 'bold')
      doc.text(`Report Date:`, margin + colWidth, yPos)
      doc.setFont(undefined, 'normal')
      doc.text(dateStr, margin + colWidth + 25, yPos)
      yPos += 12
    }

    // Analysis Overview Section
    addText('ANALYSIS OVERVIEW', 14, true, [59, 130, 246])
    doc.setDrawColor(59, 130, 246)
    doc.line(margin, yPos - 2, pageWidth - margin, yPos - 2)
    yPos += 5

    const analysis = analysisData.analysis || {}

    // Analysis Cards Data
    const stoneProb = analysis.stoneProbability || analysis.clotProbability || 0
    addText(`Stone Confidence: ${((Number(stoneProb) || 0) * 100).toFixed(1)}%`, 11, true)
    addText(`Stone Location: ${analysis.stoneLocation || analysis.blockageLocation || 'N/A'}`, 11)

    const obstructionRisk = analysis.obstructionRisk || analysis.narrowingPercentage || 0
    addText(`Obstruction Risk Score: ${(Number(obstructionRisk) || 0).toFixed(1)}`, 11)

    const confidence = analysis.confidence || 0
    addText(`Overall Confidence: ${((Number(confidence) || 0) * 100).toFixed(1)}%`, 11)

    const getSeverity = (percentage) => {
      const num = Number(percentage) || 0
      if (num < 30) return 'Low Risk'
      if (num < 60) return 'Moderate Risk'
      return 'High Risk'
    }

    const severity = getSeverity(obstructionRisk)
    addText(`Severity Level: ${severity}`, 11, true, [212, 63, 63])
    yPos += 5

    // Clinical Measurements Section
    if (analysis.clinicalMeasurements && analysis.clinicalMeasurements.length > 0) {
      checkNewPage(40)
      addText('CLINICAL MEASUREMENTS', 14, true, [59, 130, 246])
      doc.setDrawColor(59, 130, 246)
      doc.line(margin, yPos - 2, pageWidth - margin, yPos - 2)
      yPos += 5

      analysis.clinicalMeasurements.forEach((measure, index) => {
        const title = analysis.clinicalMeasurements.length > 1 ? `Target #${index + 1} (${measure.class})` : `Detected Target (${measure.class})`;
        addText(`${title}:`, 11, true)
        addText(`• Size: ${measure.sizeText}`, 10)
        addText(`• Shape: ${measure.shape}`, 10)
        addText(`• Distance to Ureter Ref: ${measure.distanceToUreterMM} mm`, 10)
        yPos += 3
      })
      yPos += 5
    }

    // Images Section
    checkNewPage(60)
    addText('CT SCAN IMAGES', 14, true, [14, 165, 233]) // Sky 500
    doc.setDrawColor(59, 130, 246)
    doc.line(margin, yPos - 2, pageWidth - margin, yPos - 2)
    yPos += 5

    try {
      // Original Image
      if (analysisData.originalImage) {
        checkNewPage(60)
        const originalImgBase64 = await imageToBase64(analysisData.originalImage)
        const imgWidth = 85
        const imgHeight = (imgWidth * 0.75) // Maintain aspect ratio

        doc.addImage(originalImgBase64, 'PNG', margin, yPos, imgWidth, imgHeight)
        doc.setFontSize(9)
        doc.text('Original Image', margin, yPos - 2)

        // Processed Image (if different)
        if (analysisData.processedImage && analysisData.processedImage !== analysisData.originalImage) {
          const processedImgBase64 = await imageToBase64(analysisData.processedImage)
          doc.addImage(processedImgBase64, 'PNG', margin + 90, yPos, imgWidth, imgHeight)
          doc.text('AI Processed Image', margin + 90, yPos - 2)
        }

        yPos += imgHeight + 15
      }
    } catch (error) {
      console.error('Error adding images to PDF:', error)
      addText('Images could not be loaded', 10, false, [150, 150, 150])
    }

    // AI-Generated Suggestions Section
    checkNewPage(30)
    addText('AI-GENERATED SUGGESTIONS', 14, true, [139, 92, 246])
    doc.setDrawColor(139, 92, 246)
    doc.line(margin, yPos - 2, pageWidth - margin, yPos - 2)
    yPos += 5

    // AI Explanation
    const aiExplanation = generateAIExplanation(analysis)
    addText('Analysis Explanation:', 11, true)
    addText(aiExplanation, 10)

    // Clinical Steps
    const clinicalSteps = getClinicalSteps(obstructionRisk)
    addText('Recommended Clinical Steps:', 11, true)
    clinicalSteps.forEach((step, index) => {
      addText(`${index + 1}. ${step}`, 10)
    })

    // Additional Suggestions
    const suggestions = analysis.suggestions || []
    if (suggestions.length > 0) {
      addText('Additional AI Insights:', 11, true)
      suggestions.forEach((suggestion, index) => {
        addText(`• ${suggestion}`, 10)
      })
    }

    yPos += 5

    // Doctor's Suggestion Section
    if (doctorSuggestion && doctorSuggestion.trim()) {
      checkNewPage(30)
      addText("DOCTOR'S RECOMMENDATIONS", 14, true, [16, 185, 129])
      doc.setDrawColor(16, 185, 129)
      doc.line(margin, yPos - 2, pageWidth - margin, yPos - 2)
      yPos += 5
      addText(doctorSuggestion, 10)
      yPos += 5
    }

    // Open Source AI Insights Section
    if (aiInsights) {
      checkNewPage(40)
      addText('OPEN SOURCE AI INSIGHTS', 14, true, [236, 72, 153])
      doc.setDrawColor(236, 72, 153)
      doc.line(margin, yPos - 2, pageWidth - margin, yPos - 2)
      yPos += 5

      if (aiInsights.interpretation) {
        addText('Medical Interpretation:', 11, true)
        addText(aiInsights.interpretation, 10)
      }

      if (aiInsights.clinicalSignificance) {
        addText('Clinical Significance:', 11, true)
        addText(aiInsights.clinicalSignificance, 10)
      }

      if (aiInsights.recommendations) {
        addText('AI Recommendations:', 11, true)
        addText(aiInsights.recommendations, 10)
      }

      if (aiInsights.riskFactors) {
        addText('Risk Factors:', 11, true)
        addText(aiInsights.riskFactors, 10)
      }

      if (aiInsights.source) {
        addText(`Source: ${aiInsights.source}`, 9, false, [100, 100, 100])
      }
      yPos += 5
    }

    // Analysis Summary Section
    checkNewPage(25)
    addText('ANALYSIS SUMMARY', 14, true, [59, 130, 246])
    doc.setDrawColor(59, 130, 246)
    doc.line(margin, yPos - 2, pageWidth - margin, yPos - 2)
    yPos += 5

    addText(`Detection Status: ${analysis.detectionStatus || 'Analysis Complete'}`, 10)
    addText(`Analysis Date: ${new Date().toLocaleString()}`, 10)


    // Footer
    const totalPages = doc.internal.getNumberOfPages()
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i)

      // Medical Disclaimer in PDF Footer
      doc.setFontSize(8)
      doc.setTextColor(150, 150, 150)
      doc.text(
        'Measurements are AI-assisted estimates (±1–2 mm). Final clinical decisions must be made by a qualified physician.',
        pageWidth / 2,
        pageHeight - 15,
        { align: 'center' }
      )

      // Page Number
      doc.text(
        `Page ${i} of ${totalPages} - Kidney Stone Detection System`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      )
    }

    // Generate filename
    const filename = `KidneyStone_Analysis_${new Date().toISOString().split('T')[0]}_${Date.now()}.pdf`

    // Save PDF
    doc.save(filename)

    return { success: true, filename }
  } catch (error) {
    console.error('Error generating PDF:', error)
    throw new Error(`Failed to generate PDF: ${error.message}`)
  }
}

/**
 * Generate AI explanation text
 */
const generateAIExplanation = (analysis) => {
  const riskScore = Number(analysis.obstructionRisk) || Number(analysis.narrowingPercentage) || 0
  const location = analysis.stoneLocation || analysis.blockageLocation || 'detected region'

  if (riskScore >= 60) {
    return `Significant renal calculus burden (Risk Score: ${riskScore.toFixed(1)}) has been detected in the ${location}. The AI analysis indicates a high probability of urinary tract obstruction or significant stone size that requires immediate clinical attention to prevent hydronephrosis.`
  } else if (riskScore >= 30) {
    return `Moderate renal calculus (Risk Score: ${riskScore.toFixed(1)}) observed in the ${location}. While immediate intervention may not be critical, this finding warrants urology evaluation for potential medical expulsion therapy or elective procedures.`
  } else {
    return `Minimal or small calculus (Risk Score: ${riskScore.toFixed(1)}) detected in the ${location}. The analysis shows findings likely manageable with conservative measures, subject to clinical correlation.`
  }
}

/**
 * Get clinical steps based on obstruction risk
 */
const getClinicalSteps = (riskScore) => {
  if (riskScore >= 60) {
    return [
      'Urgent Urology Consultation (within 24-48 hours)',
      'Non-Contrast CT (NCCT) KUB to confirm stone size/position',
      'Assess for signs of infection or obstruction (hydronephrosis)',
      'Evaluate for intervention (Ureteroscopy/ESWL/PCNL)'
    ]
  } else if (riskScore >= 30) {
    return [
      'Schedule Urology Outpatient appointment',
      'Diagnostic Ultrasound or KUB X-ray for baseline',
      'Prescribe hydration and analgesia as indicated',
      'Review metabolic profile and dietary history'
    ]
  } else {
    return [
      'Increase oral fluid intake (>2.5L daily)',
      'Routine surveillance per clinical guidelines',
      'Dietary modification (low salt, moderate protein)',
      'Monitor for flank pain or hematuria'
    ]
  }
}

