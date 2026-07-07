/**
 * reviewController.js
 * Handles submission and retrieval of user reviews.
 */
const Review = require('../models/Review');
const { success } = require('../utils/apiResponse');

/**
 * POST /api/review
 */
async function createReview(req, res, next) {
  try {
    const { rating, review, name } = req.body;
    const entry = await Review.create({ rating, review, name });
    return success(res, 201, 'Thank you for your review!', entry);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/reviews
 */
async function getReviews(req, res, next) {
  try {
    const reviews = await Review.findAll();
    return success(res, 200, 'Reviews fetched successfully', reviews, { count: reviews.length });
  } catch (err) {
    next(err);
  }
}

module.exports = { createReview, getReviews };
