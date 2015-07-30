'use strict';

var express = require( 'express' );
var app = express();

// Set up the dictionary
var Dictionary = require( '../lib/dictionary' );
var env = process.env.NODE_ENV || 'production';
var path = {
    'test': '/../test/test_dictionary.json',
    'production': '/../db/dictionary.json'
};
var dictionary = new Dictionary( {
    file: __dirname + path[ env ]
} );

// Routes
app.get( '/', require( './route-index' )( dictionary ) );
app.get( '/index', require( './route-index' )( dictionary ) );
app.get( '/lookup', require( './route-lookup' )( dictionary ) );
app.get( '/add', require( './route-add' )( dictionary ) );
app.get( '/remove', require( './route-remove' )( dictionary ) );

app.get( '/hello', require( './route-hello' ) );

module.exports = app;
