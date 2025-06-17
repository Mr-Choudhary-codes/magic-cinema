const AdminUser = require('../models/AdminUser');
const jwt = require('jsonwebtoken');

// @desc    Register a new admin (for initial setup)
// @route   POST /api/admin/register
// @access  Public (should be restricted or removed after setup)
const registerAdmin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Please provide username and password' });
  }

  try {
    const adminExists = await AdminUser.findOne({ username });

    if (adminExists) {
      return res.status(400).json({ message: 'Admin user already exists' });
    }

    const admin = await AdminUser.create({
      username,
      password, // Password will be hashed by the pre-save hook in the model
    });

    if (admin) {
      res.status(201).json({
        _id: admin._id,
        username: admin.username,
        message: 'Admin user registered successfully. You can now login.',
      });
    } else {
      res.status(400).json({ message: 'Invalid admin data' });
    }
  } catch (error) {
    console.error('Admin registration error:', error);
    res.status(500).json({ message: 'Server error during admin registration' });
  }
};

// @desc    Authenticate admin & get token
// @route   POST /api/admin/login
// @access  Public
const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Please provide username and password' });
  }

  try {
    const admin = await AdminUser.findOne({ username });

    if (admin && (await admin.comparePassword(password))) {
      const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // Token expires in 30 days
      });

      res.json({
        _id: admin._id,
        username: admin.username,
        token: token,
      });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error during admin login' });
  }
};

// @desc    Get current admin user details (example of a protected route)
// @route   GET /api/admin/me
// @access  Private
const getMe = async (req, res) => {
  // req.user is set by the authMiddleware
  res.status(200).json(req.user);
};


module.exports = {
  registerAdmin,
  loginAdmin,
  getMe,
};
