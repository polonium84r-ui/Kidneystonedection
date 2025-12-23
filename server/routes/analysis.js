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
// @desc    Analyze image using Roboflow Workflow API (Proxy)
// @access  Private
router.post('/detect', auth, upload.single('file'), async (req, res) => {
    console.log('--- Analysis Request Started ---');
    if (!req.file) {
        console.error('No file uploaded');
        return res.status(400).json({ msg: 'No image file uploaded' });
    }

    const filePath = req.file.path;
    console.log('File uploaded to:', filePath);

    try {
        console.log('Processing analysis request for:', req.file.originalname);

        // Read file as buffer for base64 encoding
        const fileBuffer = fs.readFileSync(filePath);
        const base64Image = fileBuffer.toString('base64');
        console.log('File converted to base64. Length:', base64Image.length);

        const ROBOFLOW_API_KEY = process.env.VITE_ROBOFLOW_API_KEY || 'R8FMaPoYSNTZ8c7cw4aa';
        const WORKFLOW_ID = 'rit-radar'; // Updated workflow ID
        const WORKSPACE = 'deva-yc5op';
        const API_URL = `https://serverless.roboflow.com/${WORKSPACE}/workflows/${WORKFLOW_ID}`;

        console.log(`Sending to Roboflow Workflow: ${API_URL}`);
        console.log(`Using API Key: ${ROBOFLOW_API_KEY ? 'Present' : 'Missing'}`);

        // Call Roboflow Workflow API
        const response = await axios.post(API_URL, {
            api_key: ROBOFLOW_API_KEY,
            inputs: {
                "image": {
                    "type": "base64",
                    "value": base64Image
                }
            }
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('Roboflow Success Status:', response.status);

        // Clean up uploaded file
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        console.log('Roboflow response received');

        // Return the API response directly
        res.json(response.data);

    } catch (error) {
        // Clean up file if error occurs
        if (fs.existsSync(filePath)) {
            try {
                fs.unlinkSync(filePath);
            } catch (e) {
                console.error('Error deleting file:', e);
            }
        }

        console.error('AI Analysis Error Name:', error.name);
        console.error('AI Analysis Error Message:', error.message);

        if (error.response) {
            console.error('Roboflow API Response Status:', error.response.status);
            console.error('Roboflow API Response Data:', JSON.stringify(error.response.data, null, 2));
            return res.status(error.response.status).json(error.response.data);
        }

        res.status(500).json({ msg: 'AI Analysis failed', error: error.message });
    } finally {
        console.log('--- Analysis Request Ended ---');
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
