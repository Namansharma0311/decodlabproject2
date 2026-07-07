/**
 * destinationRoutes.js
 * Routes: GET /api/destinations, GET /api/destination/:id
 */
const express = require('express');
const { param } = require('express-validator');
const router = express.Router();

const { getDestinations, getDestinationById } = require('../controllers/destinationController');
const validateRequest = require('../middleware/validateRequest');

router.get('/destinations', getDestinations);

router.get(
  '/destination/:id',
  [param('id').trim().notEmpty().withMessage('Destination id is required')],
  validateRequest,
  getDestinationById
);

module.exports = router;
