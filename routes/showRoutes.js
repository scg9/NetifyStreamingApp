const express = require('express');
const { getShows ,getShowDetails} = require('../controllers/showController');  // Correct import

const router = express.Router();

// Define route to get shows with pagination, search, and filter
router.get('/', getShows);  // Ensure `getShows` is passed here as a callback
router.get('/:show_id', getShowDetails); 
module.exports = router;
