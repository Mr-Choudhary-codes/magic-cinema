const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin, getMe } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/admin/register - For initial admin setup
// Consider removing or securing this endpoint after initial admin creation
router.post('/register', registerAdmin);

// POST /api/admin/login - Login to admin panel
router.post('/login', loginAdmin);

// GET /api/admin/me - Example of a protected route to get current admin details
router.get('/me', protect, getMe);

module.exports = router;
