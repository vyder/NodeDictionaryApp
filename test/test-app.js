var request = require("supertest");
var express = require("express");
var should = require("should");
var fs = require("fs");

// Set up a test dictionary file with ability to read/write to it
var dictionaryPath = "./test/test_dictionary.json";
var writeTestDictionary = function(dictionary) {
	dictionary = dictionary || {};
	var fileContent = JSON.stringify(dictionary, null, 4);
	fs.writeFileSync(dictionaryPath, fileContent, 'utf8');
};
var removeTestDictionary = function() {
	if( fs.existsSync(dictionaryPath) ) {
		fs.unlinkSync(dictionaryPath);
	} else {
		console.log("hmmm: " + dictionaryPath);
	}
};

var test_dictionary = {
	"banana": "A fruit",
	"Baker": "A goofball",
	"Goliath": "Defeated by David",
	"Water": "Thanks, I'm thirsty now",
	"Coke": "The Elixir of Life"
};
writeTestDictionary(test_dictionary);

// Start app in test environment
process.env.NODE_ENV = 'test';
var app = require("../app/app.js");


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
		describe("Lookup a word that already exists: " + word, function() {
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

	describe("Add a word that doesn't already exist", function() {
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

	describe("Make invalid requests", function() {
		var word = "aasdfasdf";
		var definition = "more gibberish...wait, what?";

		it("request without 'word'", function(done) {
			request(app)
				.get('/add?definition=' + definition)
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

		it("request without 'definition'", function(done) {
			request(app)
				.get('/add?word=' + word)
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

	describe("Can overwrite a word", function() {
		var word = "glitter";
		var definition = "shiny things";

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

		it("responds with error on trying to the same word", function(done) {
			request(app)
				.get('/add?word=' + word + '&definition=' + definition)
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

		it("responds with success on trying to overwrite the same word", function(done) {
			request(app)
				.get('/add?word=' + word + '&definition=' + definition + '&overwrite=' + 1)
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


describe('Test /remove', function() {

	describe("Add, then remove a word that doesn't already exist", function() {
		var word = "apple pie";
		var definition = "delicious";

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

		it('successfully remove the same word', function(done) {
			request(app)
				.get('/remove?word=' + word)
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

		it('responds with an error when you try to remove the same word again', function(done) {
			request(app)
				.get('/remove?word=' + word)
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

	describe("Make invalid requests", function() {
		var word = "aasdfasdf";

		it("request without 'word'", function(done) {
			request(app)
				.get('/remove')
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

after(function() {
	removeTestDictionary();
})
