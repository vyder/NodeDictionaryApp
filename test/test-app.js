var request = require("supertest");
var express = require("express");
var should = require("should");
var fs = require("fs");

var dictionaryPath = "./test/test_dictionary.json";
var test_dictionary = {
	"banana": "A fruit",
	"Baker": "A goofball",
	"Goliath": "Defeated by David",
	"Water": "Thanks, I'm thirsty now",
	"Coke": "The Elixir of Life"
};
var writeTestDictionary = function(dictionary) {
	dictionary = dictionary || test_dictionary;
	var fileContent = JSON.stringify(dictionary, null, 4);
	fs.writeFileSync(dictionaryPath, fileContent, 'utf8');
};
var removeTestDictionary = function() {
	fs.unlinkSync(dictionaryPath);
};

// Set up the dictionary
writeTestDictionary();

process.env.NODE_ENV = 'test';
var app = require("../app.js");

describe('Test static paths', function() {
	describe('GET /hello', function() {
		it('responds with plain text', function(done) {
			request(app)
				.get('/hello')
				.expect(200, done);
		});
	});
});

describe('Test /lookup', function() {
	for( word in test_dictionary ) {
		describe("Lookup a word that exists: " + word, function() {
			it('responds with correct definition', function(done) {
				request(app)
					.get('/lookup?word=' + word)
					.set('Accept', 'application/json')
					.expect('Content-Type', /application\/json/)
					.expect(200)
					.end(function(error, response) {
						if(error)
							return done(error);

						var data = response.body;
						data.should.have.property('word', word);
						data.should.have.property('definition', test_dictionary[word]);

						done();
					});
			});
		});
	}

	describe("Lookup a word that doesn't exist", function() {
		it('responds with error message', function(done) {
			var word = "asdfasdhf";
			request(app)
				.get('/lookup?word=' + word)
				.set('Accept', 'application/json')
				.expect('Content-Type', /application\/json/)
				.expect(200)
				.end(function(error, response) {
					if(error)
						return done(error);

					var data = response.body;
					data.should.have.property('error');
					data.error.should.have.property('message');

					done();
				});
		});
	});
});

describe('Test /add', function() {
	describe("Add a word that doesn't exist", function() {
		var word = "things";
		var definition = "just stuff";

		it("verify that word doesn't exist", function(done) {
			request(app)
				.get('/lookup?word=' + word)
				.set('Accept', 'application/json')
				.expect('Content-Type', /application\/json/)
				.expect(200)
				.end(function(error, response) {
					if(error)
						return done(error);

					var data = response.body;
					data.should.have.property('error');
					data.error.should.have.property('message');

					done();
				});
		});

		it("responds with success on adding the new word", function(done) {
			request(app)
				.get('/add?word=' + word + '&definition=' + definition)
				.set('Accept', 'application/json')
				.expect('Content-Type', /application\/json/)
				.expect(200)
				.end(function(error, response) {
					if(error)
						return done(error);

					var data = response.body;
					data.should.have.property('success');
					data.success.should.have.property('message');

					done();
				});
		});

		it('responds with correct definition', function(done) {
			request(app)
				.get('/lookup?word=' + word)
				.set('Accept', 'application/json')
				.expect('Content-Type', /application\/json/)
				.expect(200)
				.end(function(error, response) {
					if(error)
						return done(error);

					var data = response.body;
					data.should.have.property('word', word);
					data.should.have.property('definition', definition);

					done();
				});
		});
	});
});

after(function() {
	removeTestDictionary();
});
