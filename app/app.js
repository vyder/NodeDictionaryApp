var express = require("express");
var app = express();

// Set up the dictionary
var dictionary;
var Dictionary = require("../lib/dictionary");

app.configure('production', function() {
	dictionary = new Dictionary({
		file: __dirname + '/../db/dictionary.json'
	});
});

app.configure('test', function() {
	dictionary = new Dictionary({
		file: __dirname + '/../test/test_dictionary.json'
	});
});

// Routes
app.get('/hello', require("./route-hello"));
app.get('/lookup', require("./route-lookup")(dictionary));
app.get('/add', require("./route-add")(dictionary));
app.get('/remove', require("./route-remove")(dictionary));

module.exports = app;
