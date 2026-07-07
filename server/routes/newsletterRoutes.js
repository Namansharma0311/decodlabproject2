/**
 * newsletterRoutes.js
 * Routes: POST /api/newsletter
 */
const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const { subscribeNewsletter } = require('../controllers/newsletterController');
const validateRequest = require('../middleware/validateRequest');

router.post(
  '/newsletter',
  [
    body('email').trim().notEmpty().withMessage('Email is required')
      .isEmail().withMessage('A valid email address is required').normalizeEmail(),
  ],
  validateRequest,
  subscribeNewsletter
);

module.exports = router;
