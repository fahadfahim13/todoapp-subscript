const express = require('express');
const router = express.Router();
const { verifyAccessToken } = require('./user-routes.js');

router.get('/protected-route', verifyAccessToken, (req, res) => {
  res.send('This is a protected route');
});

module.exports = router;
