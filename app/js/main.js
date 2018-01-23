window.THREE = require('three');
var webWorker = require('webworkify');
var ee = require('event-emitter');
window.eventEmitter = new ee();
window.chroma = require('chroma-js');


var Particles = require('./particles');
var RangeController = require('./rangeController');
var ColorController = require('./colorController');
var SliderController = require('./sliderController');

var Main = function() {
	// elements
	this.element = document.getElementById('main');
	this.input = document.getElementById('input');
	this.download = document.getElementById('download');

	// properties
	this.controllers = [];
	this.maxLetters = this.input.getAttribute('maxlength');
	this.stringLength = 0;
	
	// Three scene
	this.scene = new THREE.Scene();
	this.camera = new THREE.OrthographicCamera();
	this.renderer = new THREE.WebGLRenderer( { alpha : true, antialias : false } );
	this.element.appendChild( this.renderer.domElement );

	// Load data image
	this.dataTexture = new Image();
	this.dataTexture.src = 'img/df/font.png';
	this.dataTexture.addEventListener('load', this.onImageReady.bind(this) );
	
	// listen for keyboard input
	this.input.addEventListener('input', this.inputChange.bind(this) );

	// listen for download request
	this.download.addEventListener('mousedown', this.downloadFile.bind(this) );
	eventEmitter.on('updateVals', this.updateVals.bind(this) );
	// initialize
	this.resize();
	this.step();
}

Main.prototype.downloadFile = function(){

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


	var svg = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' );
	svg.setAttribute( 'width', this.element.offsetWidth )
	svg.setAttribute( 'height', this.element.offsetHeight )
	document.body.appendChild(svg);

	var particles = this.particles.geometry.geometry.attributes.position.array;
	var transform = this.particles.geometry.geometry.attributes.transform.array;
	var lookup = this.particles.geometry.geometry.attributes.lookup.array;
	var seeds = this.particles.geometry.geometry.attributes.seeds.array;
	var weight = this.particles.settings.pointSize;
	var dispersion = this.particles.settings.dispersion;
	var oscillation = this.particles.settings.oscillation;
	var time = this.particles.time;
	var scale = this.particles.settings.scale;

	var positions = [];
	var originalPositions = [];

	var letters = this.particles.geometry.letters;
	var pLength = letters.length * ( this.particles.settings.letterRes * this.particles.settings.letterRes ) * 3;
	for( var i = 0 ; i < pLength; i+=3 ){
		var tCounter = ( i / 3 ) * 4;
		var letterIndex = Math.floor( i / ( pLength / letters.length ) );
		var charData = letters[ letterIndex ];
		var val = charData.imgData.data[ ( ( Math.floor( particles[ i + 1 ] * charData.height ) * ( charData.imgData.width * 4 ) ) + ( Math.floor( particles[ i ] * charData.width ) * 4 ) ) + 3 ] / 255;
		if( val > this.particles.settings.weight.x ){
			var px = ( particles[ i ] * lookup[ tCounter + 2 ] + transform[ tCounter ] );
			var py = ( particles[ i + 1 ] * lookup[ tCounter + 3 ] + transform[ tCounter + 1 ] );

			// dispersion
			var dNoise = noise.snoise( seeds[ tCounter ], seeds[ tCounter + 1 ] ) ;
			var dVal = map( dispersion, dNoise );
			var dx = Math.cos( Math.PI * 2 * -transform[ tCounter + 2 ] ) * dVal;
			var dy = Math.sin( Math.PI * 2 * -transform[ tCounter + 2 ] ) * dVal;
			px += dx;
			py += dy;

			// origin variation
			var ovNoise = noise.snoise( seeds[ tCounter + 3 ], seeds[ tCounter + 2 ] );
			var ovx = map( oscillation, ovNoise ) * noise.snoise( particles[ i ] * 100, time );
			var ovy = map( oscillation, ovNoise ) * noise.snoise( particles[ i + 1 ] * 100, time );
			px += ovx * 2;
			py += ovy * 2;

			// oscillation
			var oNoise = noise.snoise( seeds[ tCounter + 2 ], seeds[ tCounter + 3 ] ) ;
			var ox = map( oscillation, oNoise ) * noise.snoise( particles[ i ] * 100.0, time );
			var oy = map( oscillation, oNoise ) * noise.snoise( particles[ i + 1 ] * 100.0, time );
			px += ox;
			py += oy;

			px *= scale.x;
			py *= scale.x;

			positions.push( [ px, py ] );
			originalPositions.push( [ particles[ i ], particles[ i + 1 ] ] );
		}
	}


	for( var i = 0 ; i < positions.length ; i++ ){
		var myCircle = document.createElementNS( 'http://www.w3.org/2000/svg','circle');
		myCircle.setAttributeNS( null, 'cx',positions[i][0] );
		myCircle.setAttributeNS( null, 'cy',positions[i][1] );
		
		var pNoise = ( noise.snoise( originalPositions[i][0] / 0.01, originalPositions[i][1] / 0.01 ) + 1.0 ) / 2.0;
		var size = Math.floor( map( weight, pNoise ) );
		
		myCircle.setAttributeNS( null, 'r', size / 2 );

		myCircle.setAttributeNS( null, 'fill','white');
		myCircle.setAttributeNS( null, 'stroke','none');
		svg.appendChild(myCircle);
	}


	// var geoWorker = webWorker( require( './download' ) );
	// geoWorker.onmessage = this.downloadReady.bind(this);
	// geoWorker.postMessage( JSON.stringify( { particles : "datain" } ) );
}

Main.prototype.downloadReady = function( data ){
	console.log(data)
}

Main.prototype.updateVals = function( key, val ) {
	if(key == 'backgroundColor'){
		var color = chroma( val.x, val.y, val.z, 'gl' );
		document.body.style.backgroundColor = color.hex();
		for( var i = 0 ; i < this.controllers.length ; i++ ) this.controllers[i].updateColors( color );

		var hsl = color.hsl();
		if( hsl[1] > 0 ) {
			this.download.style.color = chroma( hsl[0], 1, 0.4, 'hsl').hex();
		} else {
			if( hsl[2] < 0.5 ) {
				this.download.style.color = '#444444';
			} else {
				this.download.style.color = '#bbbbbb';
			}
		}
	}
};

Main.prototype.focus = function(){
	this.input.focus();
	var val = this.input.value;
	this.input.value = '';
	this.input.value = val;
}

Main.prototype.onImageReady = function( e ){
	var settings = {};
	var params = window.location.hash.substr( 1 ).split('&');
	for( var i = 0 ; i < params.length ; i++ ){
		var keyval = params[i].split('=');
		settings[keyval[0]] = keyval[1];
	}
	
	this.particles = new Particles( this, settings );
	this.scene.add(this.particles.group);

	var value = this.input.value.split('');
	for( var i = 0 ; i < value.length ; i++ ){
		this.particles.addLetter(  value[i].charCodeAt(0) )
		this.stringLength++;
	}

	// this.input.focus();

	this.inputInterval = setInterval( this.focus.bind(this), 1000 );

	var controllers = document.getElementsByClassName( 'controller' );
	for( var i = 0 ; i < controllers.length; i++ ) {
		if( controllers[i].dataset.type == 'range' ) this.controllers.push( new RangeController( this, controllers[i] ) );
		else if( controllers[i].dataset.type == 'color' ) this.controllers.push( new ColorController( this, controllers[i] ) );
		else if( controllers[i].dataset.type == 'slider' ) this.controllers.push( new SliderController( this, controllers[i] ) );
	}

	var color = this.particles.settings.backgroundColor;
	for( var i = 0 ; i < this.controllers.length ; i++ ) this.controllers[i].updateColors( chroma( color.x, color.y, color.z, 'gl' ) );

	// this.downloadFile();
}

Main.prototype.inputChange = function( e ){
	if( e.currentTarget.value.length > this.stringLength ) this.particles.addLetter(  e.data.charCodeAt(0) );
	else this.particles.removeLetter( );
	this.stringLength = this.input.value.length;
}

Main.prototype.resize = function( e ) {
	var width = this.element.offsetWidth, height = this.element.offsetHeight;
	this.renderer.setSize( width * 2, height * 2 );
	this.renderer.domElement.setAttribute( 'style', 'width:' + width + 'px; height:' + height + 'px;' );
	var camView = { left :  width / -2, right : width / 2, top : height / 2, bottom : height / -2 };
	for ( var prop in camView) this.camera[ prop ] = camView[ prop ];
	this.camera.position.z = 100;
	this.camera.updateProjectionMatrix( );
}

Main.prototype.step = function( time ) {
	window.requestAnimationFrame( this.step.bind( this ) );
	if( this.particles ) this.particles.step( time );
	this.renderer.render( this.scene, this.camera );
};

new Main();