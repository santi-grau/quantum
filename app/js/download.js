var PDFDocument = require('pdfkit');
var blobStream  = require('blob-stream');

module.exports = function( self ){
	self.addEventListener('message',function (msg){
		var data = JSON.parse( msg.data );
		function SimplexNoise2D() {
			this.perm = new Int32Array([0, 35, 138, 20, 259, 277, 74, 228, 161, 162, 231, 79, 284, 268, 31, 151, 50, 17, 52, 155, 37, 276, 5, 91, 245, 178, 179, 248, 96, 12, 285, 48, 168, 67, 34, 69, 172, 54, 4, 22, 108, 262, 195, 196, 265, 113, 29, 13, 65, 185, 84, 51, 86, 189, 71, 21, 39, 125, 279, 212, 213, 282, 130, 46, 30, 82, 202, 101, 68, 103, 206, 88, 38, 56, 142, 7, 229, 230, 10, 147, 63, 47, 99, 219, 118, 85, 120, 223, 105, 55, 73, 159, 24, 246, 247, 27, 164, 80, 64, 116, 236, 135, 102, 137, 240, 122, 72, 90, 176, 41, 263, 264, 44, 181, 97, 81, 133, 253, 152, 119, 154, 257, 139, 89, 107, 193, 58, 280, 281, 61, 198, 114, 98, 150, 270, 169, 136, 171, 274, 156, 106, 124, 210, 75, 8, 9, 78, 215, 131, 115, 167, 287, 186, 153, 188, 2, 173, 123, 141, 227, 92, 25, 26, 95, 232, 148, 132, 184, 15, 203, 170, 205, 19, 190, 140, 158, 244, 109, 42, 43, 112, 249, 165, 149, 201, 32, 220, 187, 222, 36, 207, 157, 175, 261, 126, 59, 60, 129, 266, 182, 166, 218, 49, 237, 204, 239, 53, 224, 174, 192, 278, 143, 76, 77, 146, 283, 199, 183, 235, 66, 254, 221, 256, 70, 241, 191, 209, 6, 160, 93, 94, 163, 11, 216, 200, 252, 83, 271, 238, 273, 87, 258, 208, 226, 23, 177, 110, 111, 180, 28, 233, 217, 269, 100, 288, 255, 1, 104, 275, 225, 243, 40, 194, 127, 128, 197, 45, 250, 234, 286, 117, 16, 272, 18, 121, 3, 242, 260, 57, 211, 144, 145, 214, 62, 267, 251, 14, 134, 33, 0, 35, 138, 20, 259, 277, 74, 228, 161, 162, 231, 79, 284, 268, 31, 151, 50, 17, 52, 155, 37, 276, 5, 91, 245, 178, 179, 248, 96, 12, 285, 48, 168, 67, 34, 69, 172, 54, 4, 22, 108, 262, 195, 196, 265, 113, 29, 13, 65, 185, 84, 51, 86, 189, 71, 21, 39, 125, 279, 212, 213, 282, 130, 46, 30, 82, 202, 101, 68, 103, 206, 88, 38, 56, 142, 7, 229, 230, 10, 147, 63, 47, 99, 219, 118, 85, 120, 223, 105, 55, 73, 159, 24, 246, 247, 27, 164, 80, 64, 116, 236, 135, 102, 137, 240, 122, 72, 90, 176, 41, 263, 264, 44, 181, 97, 81, 133, 253, 152, 119, 154, 257, 139, 89, 107, 193, 58, 280, 281, 61, 198, 114, 98, 150, 270, 169, 136, 171, 274, 156, 106, 124, 210, 75, 8, 9, 78, 215, 131, 115, 167, 287, 186, 153, 188, 2, 173, 123, 141, 227, 92, 25, 26, 95, 232, 148, 132, 184, 15, 203, 170, 205, 19, 190, 140, 158, 244, 109, 42, 43, 112, 249, 165, 149, 201, 32, 220, 187, 222, 36, 207, 157, 175, 261, 126, 59, 60, 129, 266, 182, 166, 218, 49, 237, 204, 239, 53, 224, 174, 192, 278, 143, 76, 77, 146, 283, 199, 183, 235, 66, 254, 221, 256]);
			this.mod289_temp0 = 0.0034602077212184668;
		}

		SimplexNoise2D.prototype.snoise = function(inX, inY) {
			var perm = this.perm, mod289_temp0 = this.mod289_temp0;
			var i_0 = Math.floor(inX + (inX + inY) * 0.366025403784439);
			var i_1 = Math.floor(inY + (inX + inY) * 0.366025403784439);
			var x0_0 = inX - i_0 + (i_0 + i_1) * 0.211324865405187;
			var x0_1 = inY - i_1 + (i_0 + i_1) * 0.211324865405187;
			var i1_0 = (x0_0 > x0_1) ? 1.0 : 0.0;
			var i1_1 = (x0_0 > x0_1) ? 0.0 : 1.0;
			var x12_0 = x0_0 + 0.211324865405187 - i1_0;
			var x12_1 = x0_1 + 0.211324865405187 - i1_1;
			var x12_2 = x0_0 -0.577350269189626;
			var x12_3 = x0_1 -0.577350269189626;
			i_0 = i_0 - Math.floor(i_0 * mod289_temp0) * 289.0;
			i_1 = i_1 - Math.floor(i_1 * mod289_temp0) * 289.0;
			var p_0 = perm[ (perm[i_1 + 0.0   ] + i_0 + 0.0  ) & 511 ] * 0.024390243902439;
			var p_1 = perm[ (perm[i_1 + i1_1  ] + i_0 + i1_0 ) & 511 ] * 0.024390243902439;
			var p_2 = perm[ (perm[i_1 + 1.0   ] + i_0 + 1.0  ) & 511 ] * 0.024390243902439;
			var x_0 = 2.0 * (p_0 - Math.floor(p_0)) - 1.0;
			var x_1 = 2.0 * (p_1 - Math.floor(p_1)) - 1.0;
			var x_2 = 2.0 * (p_2 - Math.floor(p_2)) - 1.0;
			var h_0 = Math.abs(x_0) - 0.5;
			var h_1 = Math.abs(x_1) - 0.5;
			var h_2 = Math.abs(x_2) - 0.5;
			var a0_0 = x_0 - Math.floor(x_0 + 0.5);
			var a0_1 = x_1 - Math.floor(x_1 + 0.5);
			var a0_2 = x_2 - Math.floor(x_2 + 0.5);
			var m_0 = Math.max(0.5 - (x0_0 * x0_0 + x0_1 * x0_1), 0.0);
			var m_1 = Math.max(0.5 - (x12_0 * x12_0 + x12_1 * x12_1), 0.0);
			var m_2 = Math.max(0.5 - (x12_2 * x12_2 + x12_3 * x12_3), 0.0);
			m_0 = m_0 * m_0 * m_0 * m_0 * ( 1.79284291400159 - 0.85373472095314 * ( a0_0 * a0_0 + h_0 * h_0 ) );
			m_1 = m_1 * m_1 * m_1 * m_1 * ( 1.79284291400159 - 0.85373472095314 * ( a0_1 * a0_1 + h_1 * h_1 ) );
			m_2 = m_2 * m_2 * m_2 * m_2 * ( 1.79284291400159 - 0.85373472095314 * ( a0_2 * a0_2 + h_2 * h_2 ) );
			var g_0 = a0_0  * x0_0  + h_0 * x0_1;
			var g_1 = a0_1  * x12_0 + h_1 * x12_1;
			var g_2 = a0_2  * x12_2 + h_2 * x12_3;
			return 130.0 * (m_0 * g_0 + m_1 * g_1 + m_2 * g_2);//vec3.dot(m, g);
		}
		var noise = new SimplexNoise2D();

		function map( v, m ){
			var minV = v.x;
			var maxV = v.y;
			var minR = v.z;
			var maxR = v.w;
			var range = maxR - minR;
			return minR + ( minV * range ) + ( ( maxV * range ) - ( minV * range ) ) * m;
		}

		var particles = data.attributes.position.array;
		var transform = data.attributes.transform.array;
		var lookup = data.attributes.lookup.array;
		var seeds = data.attributes.seeds.array;
		var weight = data.settings.pointSize;
		var dispersion = data.settings.dispersion;
		var oscillation = data.settings.oscillation;
		var scale = data.settings.scale;
		var time = data.time;
		var letters = data.letters;


		var positions = [];
		var originalPositions = [];

		var pLength = letters.length * ( data.settings.letterRes * data.settings.letterRes ) * 3;
		for( var i = 0 ; i < pLength; i+=3 ){
			var tCounter = ( i / 3 ) * 4;
			var letterIndex = Math.floor( i / ( pLength / letters.length ) );
			var charData = letters[ letterIndex ];
			var val = charData.imgData.data[ ( ( Math.floor( particles[ i + 1 ] * charData.height ) * ( charData.width * 4 ) ) + ( Math.floor( particles[ i ] * charData.width ) * 4 ) ) + 3 ] / 255;
			if( val > data.settings.weight.x ){
				var px = ( particles[ i ] * lookup[ tCounter + 2 ] + transform[ tCounter ] );
				var py = ( particles[ i + 1 ] * lookup[ tCounter + 3 ] + transform[ tCounter + 1 ] );

				// dispersion
				var dNoise = noise.snoise( seeds[ tCounter ], seeds[ tCounter + 1 ] ) ;
				var dVal = map( dispersion, dNoise );
				var dx = Math.cos( Math.PI * 2 * -transform[ tCounter + 2 ] ) * dVal;
				var dy = Math.sin( Math.PI * 2 * -transform[ tCounter + 2 ] ) * dVal;
				px += dx;
				py += dy;

				// oscillation
				var oNoise = noise.snoise( seeds[ tCounter + 2 ], seeds[ tCounter + 3 ] ) ;
				var ox = map( oscillation, oNoise ) * noise.snoise( particles[ i ] * 100.0, time );
				var oy = map( oscillation, oNoise ) * noise.snoise( particles[ i + 1 ] * 100.0, time );
				px += ox;
				py += oy;

				px *= scale.x;
				py *= scale.x;

				var pNoise = ( noise.snoise( particles[ i ] / 0.01, particles[ i + 1 ] / 0.01 ) + 1.0 ) / 2.0;
				var size = Math.floor( map( weight, pNoise ) );

				positions.push( [ px, py, size ] );
			}
		}


		var doc = new PDFDocument({
			size : 'A1',
			info: {
				Title: 'Quantum Letters',
				Author: 'Santi Grau'
			}
		});

		var minx = 100000000;
		var miny = 100000000;
		var maxx = -100000000;
		var maxy = -100000000;

		doc.fillColor('black');
		
		for( var i = 0 ; i < positions.length ; i++ ){
			var p0 = positions[i][0];
			var p1 = positions[i][1];
			var minx = Math.min( minx, p0 );
			var maxx = Math.max( maxx, p0 );
			var miny = Math.min( miny, p1 );
			var maxy = Math.max( maxy, p1 );
		}


		console.log(minx, maxx, miny, maxy)

		var scale = doc.page.width / ( maxx - minx ) * 0.8;
		console.log(scale)
		var w = ( maxx - minx ) * scale;
		var h = ( maxy - miny ) * scale;
		var tx = ( doc.page.width - w ) / 2;
		var ty = ( doc.page.height - h ) / 2;

		var path = '';
		for( var i = 0 ; i < positions.length ; i++ ){
			var vertices = 8 + Math.random() * 16;
			var startRadius = Math.PI * 2;
			
			var p0 = ( positions[i][0] - minx ) * scale + tx;
			var p1 = ( positions[i][1] - miny) * scale + ty;
			var ln = positions[i][2] * scale / 2;

			var pp = [ ( p0 + Math.cos( startRadius ) ), ( p1 + Math.sin( startRadius ) ) ];
			var l = ln * 0.5 + ( noise.snoise( pp[0], pp[1] ) + 1 ) / 2 * ( ln * 0.5 );

			path += 'M ' + ( p0 + Math.cos( startRadius ) * l ) +','+ ( p1 + Math.sin( startRadius ) * l ) +' ';
			for( var j = 1 ; j < vertices + 1 ; j++ ){
				var r = startRadius + ( Math.PI * 2 * j / vertices )
				var pp = [ ( p0 + Math.cos( r ) ), ( p1 + Math.sin( r ) ) ];
				var l = ln * 0.6 + ( noise.snoise( pp[0], pp[1] ) + 1 ) / 2 * ( ln * 0.4 );
				path += 'L ' + ( p0 + Math.cos( r ) * l ) +','+ ( p1 + Math.sin( r ) * l ) +' ';
			}
			path += 'z ';
		}


		doc.path(path).fill('non-zero');
		

		var stream = doc.pipe( blobStream( ) );

		doc.fillColor('black').font('Helvetica').fontSize(8).text('------------------------------------------------',0,doc.page.height - doc.page.margins.bottom * 2 - 26, { width : doc.page.width, height : 50, align: 'center', lineBreak : true });
		doc.fillColor('black').font('Helvetica').fontSize(8).text('Quantum Letters ',0,doc.page.height - doc.page.margins.bottom * 2 - 15, { width : doc.page.width, height : 50, align: 'center', lineBreak : true });
		doc.fillColor('black').font('Helvetica').fontSize(8).text('------------------------------------------------',0,doc.page.height - doc.page.margins.bottom * 2 - 6, { width : doc.page.width, height : 50, align: 'center', lineBreak : true });
		doc.fillColor('black').font('Helvetica').fontSize(8).text('Pn : ' + positions.length + ' | Ot : ' + oscillation.x.toFixed(3) + ' ~ ' + oscillation.y.toFixed(3) + ' | dt : ' + dispersion.x.toFixed(3) + ' ~ ' + dispersion.y.toFixed(3) ,0,doc.page.height - doc.page.margins.bottom * 2 + 8, { width : doc.page.width, height : 50, align: 'center', lineBreak : true });

		doc.end();

		stream.on('finish', function(){
			self.postMessage( stream.toBlob('application/pdf') );
		})
		
	});
}