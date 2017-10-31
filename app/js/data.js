var Xml2json = require('xml2js');


var Data = function( parent, font ){
	this.parent = parent;
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

	var minArea = 1000000000;
	var maxArea = -1000000000;

	for( var i = 0 ; i < data.chars.length ; i++ ){
		var char = data.chars[ i ];
		if( !char || !parseInt(char.width) || !parseInt(char.height) ) continue;
		var imgData = this.parent.ctx.getImageData( char.x, char.y, char.width, char.height );
		var particleCount = 0;

		for( var y = 0 ; y < imgData.height ; y++ ){
			for( var x = 0 ; x < imgData.width ; x++ ){
				var val = imgData.data[ ( ( y * ( imgData.width * 4 ) ) + ( x * 4 ) ) + 3 ];
				if( val > 0 ) particleCount++;
			}
		}

		if( particleCount < minArea ) minArea = particleCount;
		if( particleCount > maxArea ) maxArea = particleCount;

		char.area = particleCount;
	}

	for( var i = 0 ; i < data.chars.length ; i++ ){
		var char = data.chars[ i ];
		if( !char || !parseInt(char.width) || !parseInt(char.height) ) continue;
		char.areaRelative = char.area / maxArea;
	}

	return data;
}

module.exports = Data;