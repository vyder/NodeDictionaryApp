'use strict';

module.exports = function( req, res ) {
    res.header( 'Content-Type', 'text/plain' );
    res.send( 'this will return an index of all dictionary words ' );
};
