

const express = require("express");
const router = express.Router();

const {healthCheck} = require('../controllers/healthController.js');

router.get('/',healthCheck);

module.exports = router;