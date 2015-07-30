'use strict';

module.exports = function( dictionary ) {
    return function( req, res ) {
        req.header( 'Content-Type', 'application/json' );
        var response = {};

        var word = req.query.word;
        var definition = dictionary.lookup( word );

        if ( definition ) {
            response = {
                word: word,
                definition: definition
            };
        }
        else {
            response = {
                error: {
                    message: 'Oops. We don\'t have that word yet'
                }
            };
        }

        res.send( response );
    };
};
