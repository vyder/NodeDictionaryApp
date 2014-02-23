var express = require("express");
var Dictionary = require("./dictionary.js");
var app = express();

// Config
var PORT = 3000;

app.get('/hello', function(req, res) {
	req.header('Content-Type', 'text/plain');
	res.send("Hello.");
});

app.get('/lookup', function(req, res) {
	req.header('Content-Type', 'application/json');
	var response = {};

	var word = req.query.word;
	var definition = Dictionary.lookup(word);

	if( definition ) {
		response = {
			word: word,
			definition: definition
		};
	} else {
		response = {
			error: {
				message: "Oops. We don't have that word yet"
			}
		};
	}

	res.send(response);
});

app.get('/add', function(req, res) {
	req.header('Content-Type', 'application/json');
	var response = {};

	var respondWith = function(error, message) {
		if( error ) {
			response = {
				error: {
					message: message
				}
			};
		} else {
			response = {
				success: {
					message: message
				}
			};
		}
		res.send(response);
	};

	var word = req.query.word;
	var definition = req.query.definition;
	var overwrite = req.query.overwrite;

	if( !word ) {
		respondWith(true, "'word' is a required parameter");
	}
	if( !definition ) {
		respondWith(true, "'definition' is a required parameter");
	}

	var result = Dictionary.add(
		req.query.word,
		req.query.definition,
		req.query.overwrite
	);

	if( result ) {
		respondWith(false, "Successfully added '" + word + "'.");
	} else {
		respondWith(true, "'" + word + "' already exists in the dictionary. Specify parameter 'overwrite' to true.");
	}
});

app.listen(PORT);
console.log("Check out http://127.0.0.1:" + PORT);
