/**
 * bookingRoutes.js
 * Routes: POST /api/booking
 */
const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const { createBooking } = require('../controllers/bookingController');
const validateRequest = require('../middleware/validateRequest');

router.post(
  '/booking',
  [
    body('destination').trim().notEmpty().withMessage('Destination is required'),
    body('email').trim().notEmpty().withMessage('Email is required')
      .isEmail().withMessage('A valid email address is required').normalizeEmail(),
    body('checkIn').notEmpty().withMessage('Check-in date is required')
      .isISO8601().withMessage('Check-in must be a valid date (YYYY-MM-DD)'),
    body('checkOut').notEmpty().withMessage('Check-out date is required')
      .isISO8601().withMessage('Check-out must be a valid date (YYYY-MM-DD)'),
    body('persons').notEmpty().withMessage('Number of persons is required')
      .isInt({ min: 1, max: 20 }).withMessage('Persons must be a whole number between 1 and 20'),
    body('budget').notEmpty().withMessage('Budget is required')
      .isFloat({ min: 100 }).withMessage('Budget must be a number of at least 100'),
  ],
  validateRequest,
  createBooking
);

module.exports = router;
