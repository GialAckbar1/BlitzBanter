"use strict";
exports.__esModule = true;
/*
 * GET home page.
 */
var express = require("express");
var router = express.Router();
router.get('/', function (req, res) {
    res.render('index', { title: 'Multiplayer Chess Game' });
});
exports["default"] = router;
