const express = require('express');
const instagramController = require('./instagramFeed.controller');

const router = express.Router();

router.get('/instagramFeed', instagramController.getInstagramFeed);
router.post('/instagramFeed', instagramController.postToInstagram);

module.exports = router;
