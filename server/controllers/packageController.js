/**
 * packageController.js
 * Handles business logic for travel package endpoints.
 */
const Package = require('../models/Package');
const { success } = require('../utils/apiResponse');

/**
 * GET /api/packages
 * Supports ?sort=price|popular
 */
async function getPackages(req, res, next) {
  try {
    let packages = await Package.findAll();
    const { sort } = req.query;

    if (sort === 'price') {
      packages = [...packages].sort((a, b) => a.price - b.price);
    } else if (sort === 'popular') {
      packages = [...packages].sort((a, b) => Number(b.popular) - Number(a.popular));
    }

    return success(res, 200, 'Packages fetched successfully', packages, {
      count: packages.length,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getPackages };
