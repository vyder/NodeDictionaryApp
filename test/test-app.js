var request = require("supertest");
var express = require("express");
var should = require("should");

var app = require("../app.js");

describe('GET /hello', function() {
	it('responds with plain text', function(done) {
		request(app)
			.get('/hello')
			.expect(200, done);
	});
});

var test_dictionary = {
	"banana": "A fruit",
	"Baker": "A goofball",
	"Goliath": "Defeated by David",
	"Water": "Thanks, I'm thirsty now",
	"Coke": "The Elixir of Life"
};

// Test /lookup
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
