const Show = require('../models/showModel');

const getShows = async (req, res) => {
  console.log('Query Parameters:', req.query);

  // Extract query parameters with default values
  let { page = 1, limit = 15, search = '', type = '', age = 18 } = req.query;

  // Convert page and limit to numbers (in case they are passed as strings)
  page = parseInt(page, 10);  // Convert to integer
  limit = parseInt(limit, 10);  // Convert to integer

  // Validate page and limit
  if (page < 1) page = 1;  // Ensure the page is at least 1
  if (limit < 1) limit = 15;  // Ensure limit is at least 1

  // Construct the query for filtering based on search text, type, and age
  const query = { title: { $regex: search, $options: 'i' } }; // Search for title case-insensitive

  if (type) {
    query.type = type;  // Filter by type (Movie or TV Show)
  }

  if (age < 18) {
    query.rating = { $ne: 'R' };  // Exclude R-rated shows for users under 18
  }

  try {
    // Fetch shows with pagination
    const shows = await Show.find(query)
      .skip((page - 1) * limit)  // Skip records based on the page number
      .limit(limit);  // Limit the number of results per page

    // Count the total number of matching documents (for pagination)
    const totalShows = await Show.countDocuments(query);

    // Send the response back with the shows and pagination details
    res.json({
      shows,
      totalShows,
      totalPages: Math.ceil(totalShows / limit),  // Calculate the total pages
      currentPage: page,
    });
  } catch (err) {
    console.error('Error fetching shows:', err);
    res.status(500).json({ message: 'Error fetching shows' });
  }
};

const getShowDetails = async (req, res) => {
  const { show_id } = req.params;

  const show = await Show.findOne({ show_id });
  if (!show) {
    return res.status(404).json({ message: 'Show not found' });
  }

  res.json(show);
};

module.exports = { getShows, getShowDetails };
