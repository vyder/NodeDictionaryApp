module.exports = (function() {

	var default_dictionary = {
		"banana": "A fruit",
		"Baker": "A goofball",
		"Goliath": "Defeated by David",
		"Water": "Thanks, I'm thirsty now",
		"Coke": "The Elixir of Life"
	};

	var dictionary = default_dictionary;

	var fs = require("fs");
	var file = __dirname + '/dictionary.json';

	fs.readFile(file, 'utf8', function (err, data) {
		if (err) {
			console.log("Dictionary file does not exist.");
			writeDictionaryToFile();
			return;
		}

		dictionary = JSON.parse(data);
		console.log("Successfully read dictionary from file: " + file);
	});

	var writeDictionaryToFile = function() {
		// Write the dictionary to prettily formatted string
		var fileContent = JSON.stringify(dictionary, null, 4);

		fs.writeFile(file, fileContent, 'utf8', function (error) {
			if (error) {
				console.log('Error: ' + error);
				return;
			}
			console.log("Successfully wrote dictionary to file: " + file);
		});
	};

	return {
		lookup: function( word ) {
			var definition = dictionary[word];
			return (definition) ? definition : null;
		},
		add: function( word, definition, overwrite ) {
			if( !word || typeof word !== 'string' || !definition || typeof definition !== 'string' ) {
				return false;
			}

			if( dictionary[word] && !overwrite ) {
				return false;
			}

			dictionary[word] = definition;
			writeDictionaryToFile();

			return true;
		}
	};
})();
