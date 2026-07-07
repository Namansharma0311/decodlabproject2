/**
 * contactRoutes.js
 * Routes: POST /api/contact
 */
const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const { createContact } = require('../controllers/contactController');
const validateRequest = require('../middleware/validateRequest');

router.post(
  '/contact',
  [
    body('name').trim().notEmpty().withMessage('Name is required')
      .isLength({ min: 2, max: 80 }).withMessage('Name must be between 2 and 80 characters'),
    body('email').trim().notEmpty().withMessage('Email is required')
      .isEmail().withMessage('A valid email address is required').normalizeEmail(),
    body('phone').trim().notEmpty().withMessage('Phone number is required')
      .isMobilePhone('any').withMessage('A valid phone number is required'),
    body('message').trim().notEmpty().withMessage('Message is required')
      .isLength({ min: 10, max: 1000 }).withMessage('Message must be between 10 and 1000 characters'),
  ],
  validateRequest,
  createContact
);

module.exports = router;
