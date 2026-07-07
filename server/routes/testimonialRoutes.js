/**
 * testimonialRoutes.js
 * Routes: GET /api/testimonials
 */
const express = require('express');
const router = express.Router();
const { getTestimonials } = require('../controllers/testimonialController');

router.get('/testimonials', getTestimonials);

module.exports = router;
