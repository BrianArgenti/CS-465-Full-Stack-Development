const express = require('express'); //Express app
const router = express.Router();    //Router logic

// This is where we import the controllers we will route
const tripsController = require('../controllers/trips');

// Define our trips endpoints
router
    .route('/trips')
    .get(tripsController.tripsList); // GET method routes tripsList

    // GET method routes tripsFindByCode - requires paramater
router
    .route('/trips/:tripCode')
    .get(tripsController.tripsFindByCode);

module.exports = router;

