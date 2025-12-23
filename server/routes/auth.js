import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// SECRET for JWT (Should be in .env)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// @route   POST api/auth/register
// @desc    Register a new user (Admin only in production, or seeded)
// @access  Public (for now)
router.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            name,
            email,
            password,
            role: role || 'doctor',
        });

        // Encrypt password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        // Return JWT
        const payload = {
            user: {
                id: user.id,
                role: user.role,
            },
        };

        jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, isFirstLogin: user.isFirstLogin } });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = {
            user: {
                id: user.id,
                role: user.role,
            },
        };

        jwt.sign(
            payload,
            JWT_SECRET,
            { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, isFirstLogin: user.isFirstLogin } });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route   GET api/auth/users
// @desc    Get all users (Admin only)
// @access  Private/Admin
router.get('/users', auth, async (req, res) => {
    console.log('GET /users route hit');
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Access denied: Admin only' });
        }
        const users = await User.find({ role: 'doctor' }).select('-password');
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route   PUT api/auth/users/:id/status
// @desc    Activate/Deactivate user
// @access  Private/Admin
router.put('/users/:id/status', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Access denied: Admin only' });
        }

        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        user.isActive = req.body.isActive; // Expect boolean
        await user.save();

        res.json({ msg: 'User status updated', user });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route   PUT api/auth/users/:id/password
// @desc    Reset user password (Admin only)
// @access  Private/Admin
router.put('/users/:id/password', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Access denied: Admin only' });
        }

        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
        user.isFirstLogin = true; // Force them to change it again? Or maybe false since admin set it. Let's say true to force change.
        // Actually normally if admin resets, it's a temp password, so isFirstLogin=true makes sense.
        // But the previous implementation set it to false. Let's stick to logic: if admin resets, it's temporary => isFirstLogin = true.
        user.isFirstLogin = true;

        await user.save();

        res.json({ msg: 'Password reset successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// @route   POST api/auth/change-password
// @desc    Change own password
// @access  Private
router.post('/change-password', auth, async (req, res) => {
    const { userId, newPassword } = req.body;
    try {
        // Security check: Only allow changing own password
        if (req.user.id !== userId) {
            return res.status(403).json({ msg: 'Not authorized' });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.isFirstLogin = false;
        await user.save();

        res.json({ msg: 'Password updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

export default router;
