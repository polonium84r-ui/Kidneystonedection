/** Detection utilities: drawDetections + extractAnalysisData */

/**
 * Draw boxes/polygons from Roboflow predictions on image.
 * @param {string} imageUrl
 * @param {Array} predictions
 * @returns {Promise<string>}
 */
export const drawDetections = (imageUrl, predictions = []) => new Promise((resolve, reject) => {
  try {
    const img = new Image();
    if (typeof imageUrl === 'string' && (imageUrl.startsWith('http://') || imageUrl.startsWith('https://'))) {
      img.crossOrigin = 'anonymous';
    }
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = img.width; c.height = img.height;
      const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0, img.width, img.height);
      ctx.lineWidth = Math.max(2, Math.min(img.width, img.height) * 0.004);
      ctx.font = `${Math.max(12, Math.min(img.width, img.height) * 0.02)}px sans-serif`;
      predictions.forEach((p, index) => {
        // Handle different prediction formats
        let x, y, w, h;
        
        // Format 1: Center-based (x, y, width, height)
        if (p.x !== undefined && p.y !== undefined && p.width !== undefined && p.height !== undefined) {
          x = Number(p.x);
          y = Number(p.y);
          w = Number(p.width);
          h = Number(p.height);
        }
        // Format 2: Corner-based (x1, y1, x2, y2)
        else if (p.x1 !== undefined && p.y1 !== undefined && p.x2 !== undefined && p.y2 !== undefined) {
          x = (Number(p.x1) + Number(p.x2)) / 2;
          y = (Number(p.y1) + Number(p.y2)) / 2;
          w = Math.abs(Number(p.x2) - Number(p.x1));
          h = Math.abs(Number(p.y2) - Number(p.y1));
        }
        // Format 3: Bounding box object
        else if (p.bbox && typeof p.bbox === 'object') {
          x = Number(p.bbox.x || p.bbox.x_center || 0);
          y = Number(p.bbox.y || p.bbox.y_center || 0);
          w = Number(p.bbox.width || p.bbox.w || 0);
          h = Number(p.bbox.height || p.bbox.h || 0);
        }
        // Format 4: Array format [x, y, width, height]
        else if (Array.isArray(p) && p.length >= 4) {
          x = Number(p[0]);
          y = Number(p[1]);
          w = Number(p[2]);
          h = Number(p[3]);
        }
        
        const label = p.class || p.class_name || p.label || `Detection ${index + 1}`;
        const conf = p.confidence != null ? (Number(p.confidence) * 100).toFixed(1) : 'N/A';
        
        // Draw polygon if points are available
        if (Array.isArray(p.points) && p.points.length >= 3) {
          ctx.strokeStyle = 'rgba(234,88,12,0.8)';
          ctx.lineWidth = Math.max(3, ctx.lineWidth);
          ctx.beginPath();
          p.points.forEach((pt, i) => { 
            if (i === 0) ctx.moveTo(Number(pt.x || pt[0]), Number(pt.y || pt[1])); 
            else ctx.lineTo(Number(pt.x || pt[0]), Number(pt.y || pt[1])); 
          });
          ctx.closePath();
          ctx.stroke();
        }
        
        // Draw bounding box if coordinates are valid
        if (!isNaN(x) && !isNaN(y) && !isNaN(w) && !isNaN(h) && w > 0 && h > 0) {
          const l = x - w/2, t = y - h/2;
          
          // Draw bounding box with medical blue color
          ctx.strokeStyle = 'rgba(59,130,246,0.9)';
          ctx.lineWidth = Math.max(3, Math.min(img.width, img.height) * 0.005);
          ctx.strokeRect(l, t, w, h);
          
          // Draw label background
          const text = `${label} ${conf}%`;
          const pad = 6;
          const tw = ctx.measureText(text).width + pad*2;
          const th = parseInt(ctx.font, 10) + pad*2;
          ctx.fillStyle = 'rgba(59,130,246,0.85)';
          ctx.fillRect(l, Math.max(0, t - th), tw, th);
          
          // Draw label text
          ctx.fillStyle = '#fff';
          ctx.fontWeight = 'bold';
          ctx.fillText(text, l + pad, Math.max(pad + parseInt(ctx.font, 10), t - th + th - pad));
        } else {
          console.warn('Invalid bounding box coordinates for prediction:', p);
        }
      });
      resolve(c.toDataURL('image/png'));
    };
    img.onerror = () => reject(new Error('Failed to load image for drawing'));
    img.src = imageUrl;
  } catch (e) { reject(e); }
});

/**
 * Build analysis summary from Roboflow response.
 * This is kept for backward compatibility but should use extractAnalysisDataFromModel instead
 * @param {Object} res
 * @returns {Object}
 */
export const extractAnalysisData = (res = {}) => {
  const preds = Array.isArray(res.predictions) ? res.predictions : [];
  const confidences = preds.map(p => Number(p.confidence) || 0);
  const maxConf = confidences.length ? Math.max(...confidences) : 0;
  
  // Get unique classes from predictions
  const classes = [...new Set(preds.map(p => (p.class || p.class_name || p.label || '').trim()).filter(Boolean))];
  
  return {
    clotProbability: maxConf,
    blockageLocation: classes.length > 0 ? classes.join(', ') : 'N/A',
    narrowingPercentage: 0, // Don't calculate
    severity: 'low', // Default
    confidence: Number(maxConf) || 0,
    detectionStatus: preds.length > 0 ? `${preds.length} detection(s) found` : 'No detections',
    suggestions: [],
    predictions: preds,
    detectedClasses: classes
  };
};