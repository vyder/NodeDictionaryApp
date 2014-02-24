var Dictionary = function() {
	this.initialize.apply(this, arguments);
};

Dictionary.prototype.initialize = function(options) {
	this._file = options.file;
	this._dictionary = {};
	this._importFromFile();
};

Dictionary.prototype.lookup = function( word ) {
	var definition = this._dictionary[word];
	return (definition) ? definition : null;
};

Dictionary.prototype.add = function( word, definition, overwrite ) {
	if( !word || typeof word !== 'string' || !definition || typeof definition !== 'string' ) {
		return false;
	}

	if( this._dictionary[word] && !overwrite ) {
		return false;
	}

	this._dictionary[word] = definition;
	this._writeToFile();

	return true;
};

Dictionary.prototype._importFromFile = function() {
	var fs = require("fs");

	var data = fs.readFileSync(this._file, 'utf8');
	this._dictionary = JSON.parse(data);
};

Dictionary.prototype._writeToFile = function() {
	var fs = require("fs");

	// Write the dictionary to prettily formatted string
	var fileContent = JSON.stringify(this._dictionary, null, 4);

	fs.writeFile(this._file, fileContent, 'utf8');
};

module.exports = Dictionary;
