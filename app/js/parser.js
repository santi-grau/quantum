var Xml2json = require('xml2js');


var Parse = function( font ){

	var xml = font; // http://kvazars.com/littera/

	var data = { asset : {}, info : {}, chars : [], kerning : [] };

	Xml2json.parseString(xml, function (err, result) {
	    data.asset = result.font.common[ 0 ].$;
	    data.info = result.font.info[ 0 ].$;
	    var chars = result.font.chars[ 0 ].char;
		for( var i = 0 ; i < chars.length ; i++ ) data.chars[ chars[ i ].$.id ] = chars[ i ].$;
		for( var i = 0 ; i < data.chars.length ; i++ ) if( !data.chars[ i ] ) data.chars[ i ] = null;
		
		var kerning = result.font.kernings[ 0 ].kerning;
		
		for( var i = 0 ; i < kerning.length ; i++ ){
			var pair = kerning[ i ].$
			if( !data.kerning[ pair.first ] ) data.kerning[ pair.first ] = [ ];
			data.kerning[ pair.first ][ pair.second ] = pair.amount;
		}

		for( var i = 0 ; i < data.kerning.length ; i++ ){
			if( !data.kerning[ i ] ) data.kerning[ i ] = null;
			else for( var j = 0 ; j < data.kerning[ i ].length ; j++ ) if( !data.kerning[ i ][ j ] ) data.kerning[ i ][ j ] = null;
		}
	});

	return data;
}

module.exports = Parse;