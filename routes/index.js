var express = require('express');
var router = express.Router();
var path = require('path');

module.exports = function(app) {
	// API Routes
	app.use('/api/student', require(path.resolve(__dirname, './api/v1/Student.js')));

};
