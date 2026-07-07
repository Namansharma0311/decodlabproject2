/**
 * destinationController.js
 * Handles all business logic for destination-related endpoints.
 */
const Destination = require('../models/Destination');
const { success, error } = require('../utils/apiResponse');

/**
 * GET /api/destinations
 * Supports optional query filters: ?search=, ?maxBudget=, ?sort=price|rating
 */
async function getDestinations(req, res, next) {
  try {
    let destinations = await Destination.findAll();
    const { search, maxBudget, sort } = req.query;

    if (search) {
      const term = search.toLowerCase();
      destinations = destinations.filter(
        (d) =>
          d.name.toLowerCase().includes(term) ||
          d.country.toLowerCase().includes(term) ||
          d.tags.some((t) => t.toLowerCase().includes(term))
      );
    }

    if (maxBudget) {
      const budget = Number(maxBudget);
      if (!Number.isNaN(budget)) {
        destinations = destinations.filter((d) => d.price <= budget);
      }
    }

    if (sort === 'price') {
      destinations = [...destinations].sort((a, b) => a.price - b.price);
    } else if (sort === 'rating') {
      destinations = [...destinations].sort((a, b) => b.rating - a.rating);
    }

    return success(res, 200, 'Destinations fetched successfully', destinations, {
      count: destinations.length,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/destination/:id
 */
async function getDestinationById(req, res, next) {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      return error(res, 404, `Destination with id "${req.params.id}" was not found`);
    }
    return success(res, 200, 'Destination fetched successfully', destination);
  } catch (err) {
    next(err);
  }
}

module.exports = { getDestinations, getDestinationById };
