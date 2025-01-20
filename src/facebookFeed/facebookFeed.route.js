const express = require('express');
const { getFacebookFeed,postToFacebook } = require('./facebookFeed.controller');

const router = express.Router();


router.get('/facebookFeed', getFacebookFeed);
router.post('/postToFacebook', postToFacebook);


module.exports = router;
