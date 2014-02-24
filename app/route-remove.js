module.exports = function(dictionary) {
	return function(req, res) {
		req.header('Content-Type', 'application/json');
		var response = {};

		var word = req.query.word;
		if( !word ) {
			response.error = { message: "'word' is a required parameter" };
			res.send(response);
		}

		var result = dictionary.remove( word );

		if( result ) {
			response.success = { message: "Successfully removed '" + word + "'." };
		} else {
			response.error = { message: "'" + word + "' doesn't exists in the dictionary." };
		}
		res.send(response);
	};
};
