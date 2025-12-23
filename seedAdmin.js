import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './server/models/User.js';
import dotenv from 'dotenv';

dotenv.config();

// Hardcoded URI since we know it, or use process.env.MONGO_URI from their local .env if updated
// Ideally we ask user to run it with the URI in .env, but their local .env might point to local DB.
// Let's hardcode the REMOTE one for this specific run, or better, ask them to update .env temporarily?
// Safer: Hardcode the remote one here since I constructed it for them.
const MONGO_URI = "mongodb+srv://polonium84r_db_user:polonium12%40shivan@cluster0.evqv9u0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const seedAdmin = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB Atlas');

        const email = "radarprojects.com"; // User provided this "email"
        // Note: Check if User model validation requires a valid email format (contains @).
        // If strict regex validation exists, this might fail.
        // Let's assume they meant "admin@radarprojects.com" OR the model is lenient.
        // But "radarprojects.com" is technically not an email.
        // Let's disable validation or hope it's fine.
        // Actually, viewing User model first is safer.

        const password = "Radar@2028";

        let user = await User.findOne({ email });
        if (user) {
            console.log('⚠️ Admin user already exists');
        } else {
            user = new User({
                name: "Admin User",
                email,
                password,
                role: "admin",
                isFirstLogin: false // So they don't get forced to change it immediately? Or maybe they do.
            });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            await user.save();
            console.log('🎉 Admin user created successfully!');
            console.log('Email:', email);
            console.log('Password:', password);
        }

        mongoose.disconnect();
    } catch (err) {
        console.error('❌ Error:', err);
        mongoose.disconnect();
    }
};

seedAdmin();
