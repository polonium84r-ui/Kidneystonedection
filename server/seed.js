import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import Analysis from './models/Analysis.js';

dotenv.config();

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/heart_angio_db');
        console.log('✅ MongoDB Connected');

        // Clear existing users to ensure clean state for demo
        await User.deleteMany({});
        await Analysis.deleteMany({});
        console.log('🧹 Cleared existing users and analysis data');

        const salt = await bcrypt.genSalt(10);

        // 1. Create Admin
        const adminHash = await bcrypt.hash('Radar@2028', salt);
        const admin = new User({
            name: 'Radar Admin',
            email: 'radarprojects.com',
            password: adminHash,
            role: 'admin',
            isFirstLogin: false
        });
        await admin.save();
        console.log('✅ Created Admin: radarprojects.com / Radar@2028');

        console.log('✨ Database reset! Only Admin account exists.');
        process.exit();

    } catch (err) {
        console.error('❌ Seed Error:', err);
        process.exit(1);
    }
};

seedDB();
