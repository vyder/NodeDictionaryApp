'use strict';

module.exports = function( dictionary ) {
    return function( req, res ) {
        req.header( 'Content-Type', 'application/json' );
        var response = {};

        var word = req.query.word;
        var definition = req.query.definition;
        var overwrite = req.query.overwrite;

        if ( !word ) {
            response.error = {
                message: '"word" is a required parameter'
            };
            res.send( response );
        }
        if ( !definition ) {
            response.error = {
                message: '"definition" is a required parameter'
            };
            res.send( response );
        }

        var result = dictionary.add( word, definition, overwrite );

        if ( result ) {
            response.success = {
                message: 'Successfully added "' + word + '".'
            };
        }
        else {
            response.error = {
                message:  '"' + word + '" already exists in the dictionary. Specify parameter "overwrite" to true.'
            };
        }
        res.send( response );
    };
};
