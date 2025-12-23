import mongoose from 'mongoose';

const AnalysisSchema = new mongoose.Schema({
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    doctorName: {
        type: String,
        required: true,
    },
    patientDetails: {
        name: String,
        id: String,
        age: String,
        gender: String,
    },
    originalImage: {
        type: String, // Store as Base64 string for now, or cloud URL
        required: true,
    },
    processedImage: {
        type: String,
    },
    analysisResult: {
        type: Object, // Store the full JSON result from Roboflow
        required: true,
    },
    aiInsights: {
        type: Object,
    },
    doctorSuggestion: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('Analysis', AnalysisSchema);
