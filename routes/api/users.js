const express = require('express');
const router = express.Router();




//@router   Get api/users/test
//@desc     Tests user route
//@access   Public
router.get('/test', (req, res) => res.json({msg : "User Works"}));

module.exports =router;