const express = require('express');
const router = express.Router();

// Example route for users
router.get('/', (req, res) => {
  res.json([
    {
      "firstName": "David",
      "lastName": "Okello",
      "email": "david.okello@example.com",
      "favoriteColor": "Green",
      "birthday": "1990-07-22"
    },
    {
      "firstName": "Maria",
      "lastName": "Gonzalez",
      "email": "maria.gonzalez@example.com",
      "favoriteColor": "Purple",
      "birthday": "1988-11-05"
    },
    {
      "firstName": "Sarah",
      "lastName": "Nakamura",
      "email": "sarah.nakamura@example.com",
      "favoriteColor": "Blue",
      "birthday": "1995-03-14"
    }
  ]
  );
});

module.exports = router;
