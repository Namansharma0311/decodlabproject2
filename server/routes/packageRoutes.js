/**
 * packageRoutes.js
 * Routes: GET /api/packages
 */
const express = require('express');
const router = express.Router();
const { getPackages } = require('../controllers/packageController');

router.get('/packages', getPackages);

module.exports = router;
