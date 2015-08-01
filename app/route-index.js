'use strict';

module.exports = function( dictionary ) {
    return function( req, res ) {
        req.header( 'Content-Type', 'application/json' );
        var response = {};
        var entries = dictionary.all();

        if ( entries ) {
            response = dictionary._dictionary;
        }
        else {
            response = {
                error: {
                    mesage: 'Oops. There appears to be no dictionary!'
                }
            };
        }

        res.send( response );
    };
};
