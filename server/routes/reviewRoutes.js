/**
 * reviewRoutes.js
 * Routes: POST /api/review, GET /api/reviews
 */
const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const { createReview, getReviews } = require('../controllers/reviewController');
const validateRequest = require('../middleware/validateRequest');

router.post(
  '/review',
  [
    body('rating').notEmpty().withMessage('Rating is required')
      .isFloat({ min: 1, max: 5 }).withMessage('Rating must be a number between 1 and 5'),
    body('review').trim().notEmpty().withMessage('Review text is required')
      .isLength({ min: 5, max: 500 }).withMessage('Review must be between 5 and 500 characters'),
    body('name').trim().notEmpty().withMessage('Name is required')
      .isLength({ min: 2, max: 80 }).withMessage('Name must be between 2 and 80 characters'),
  ],
  validateRequest,
  createReview
);

router.get('/reviews', getReviews);

module.exports = router;
