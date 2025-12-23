import express from 'express';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import fs from 'fs';
import FormData from 'form-data';
import axios from 'axios';
import Analysis from '../models/Analysis.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// Middleware to verify token
const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

// @route   POST api/analysis/detect
// @desc    Analyze image using Ultralytics API (Proxy)
// @access  Private
router.post('/detect', auth, upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ msg: 'No image file uploaded' });
    }

    const filePath = req.file.path;

    try {
        // Prepare form data for Ultralytics
        const formData = new FormData();
        formData.append('file', fs.createReadStream(filePath));
        formData.append('model', 'https://hub.ultralytics.com/models/ZuHVlqDhpz75Ec7mIiT5');
        formData.append('imgsz', '640');
        formData.append('conf', '0.25');
        formData.append('iou', '0.45');

        const apiKey = process.env.ULTRALYTICS_API_KEY || process.env.VITE_ULTRALYTICS_API_KEY;

        if (!apiKey) {
            throw new Error('Server configuration error: API key missing');
        }

        // Call Ultralytics API
        const response = await axios.post('https://predict.ultralytics.com', formData, {
            headers: {
                ...formData.getHeaders(),
                'x-api-key': apiKey
            }
        });

        // Clean up uploaded file
        fs.unlinkSync(filePath);

        // Return the API response
        res.json(response.data);

    } catch (error) {
        // Clean up file if error occurs
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        console.error('AI Analysis Error:', error.message);
        
        if (error.response) {
            // Forward specific API errors
            return res.status(error.response.status).json(error.response.data);
        }
        
        res.status(500).json({ msg: 'AI Analysis failed', error: error.message });
    }
});

// @route   POST api/analysis
// @desc    Save a new analysis
// @access  Private
router.post('/', auth, async (req, res) => {
    try {
        const {
            patientDetails,
            originalImage,
            processedImage,
            analysisResult,
            aiInsights,
            doctorSuggestion
        } = req.body;

        const newAnalysis = new Analysis({
            doctorId: req.user.id,
            doctorName: req.body.doctorName, // Should be passed from frontend
            patientDetails,
            originalImage,
            processedImage,
            analysisResult,
            aiInsights,
            doctorSuggestion
        });

        const analysis = await newAnalysis.save();
        res.json(analysis);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/analysis
// @desc    Get all analyses for the current doctor
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        // If admin, maybe show all? For now, let's show only own analyses or all if admin
        // Assuming simple doctor view for now
        const analyses = await Analysis.find({ doctorId: req.user.id }).sort({ createdAt: -1 });
        res.json(analyses);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

export default router;
