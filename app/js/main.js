window.THREE = require('three');

var vs = require('../shaders/pointsVs.glsl');
var fs = require('../shaders/pointsFs.glsl');

var Xml2json = require('xml2js');
var xml = require('./../img/font_64/font.fnt'); // http://kvazars.com/littera/



var Main = function() {
	this.element = document.getElementById('main');

	this.data = this.parseData();

	if( window.location.href.indexOf('localhost') > 0 ){
		this.socket = new WebSocket('ws://localhost:8080');
		this.socket.addEventListener('message', this.message.bind( this ) );
	}

	// Three scene
	this.renderer = new THREE.WebGLRenderer( { alpha : true, antialias : false } );

	this.element.appendChild( this.renderer.domElement );

	this.scene = new THREE.Scene();
	this.camera = new THREE.OrthographicCamera();

	document.addEventListener('keydown', function(event) {
		console.log( this.data.chars[ event.key.charCodeAt(0) ] );
	}.bind(this));

	this.time = 0;
	console.log(this.data)
	var charData = this.data.chars[97];

	
	var img = new Image();
	img.src = 'img/font_64/font.png';
	img.addEventListener('load', function( e ) {
		this.canvas = document.createElement('canvas');
		this.canvas.width  = e.target.width;
		this.canvas.height = e.target.height;
		document.body.appendChild(this.canvas);

		var ctx = this.canvas.getContext('2d');

		var img = e.target;
		ctx.drawImage( img, 0, 0 );

		var imgData = ctx.getImageData(charData.x, charData.y, charData.width, charData.height);
		
		console.log(imgData)
		var p = 0;
		var alpha = [];
		for( var i = 3 ; i < imgData.data.length ; i+=4 ){
			alpha.push( imgData.data[i] );
			p += imgData.data[i];
		}

		/// bg
		var geometry = new THREE.BufferGeometry();

		var numParticles = 2048 * 2048;

		var radiusx = this.element.offsetWidth/2;
		var radiusy = this.element.offsetHeight/2;

		var positions = [];
		for( var i = 0 ; i < numParticles ; i++ ) positions.push(  -10000, -10000, Math.random() * 100 );
		geometry.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array( positions ), 3 ) );

		var modSize = 5;

		var material = new THREE.ShaderMaterial( {
			uniforms : {
				res : { value : new THREE.Vector2( this.element.offsetWidth, this.element.offsetWidth ) },
				modSize : { value : modSize },
				time : { value : 0 }
			},
			transparent : true,
			vertexShader: vs,
			fragmentShader: fs,
			depthTest:  true,
			depthWrite: false,
			// blending : THREE.NoBlending
		} );

		this.mesh = new THREE.Points( geometry, material );
		this.scene.add(this.mesh)

		var particleCount = 0;

		for( var y = 0 ; y < imgData.height ; y++ ){
			for( var x = 0 ; x < imgData.width ; x++ ){
				var geometry = new THREE.PlaneBufferGeometry( modSize, modSize );

				var val = imgData.data[((y * (imgData.width * 4)) + (x * 4)) + 3];

				for( var z = 0 ; z < val ; z++ ){
					this.mesh.geometry.attributes.position.setXY( particleCount, modSize * x - modSize * 2, -modSize * y + modSize * 2 );
					particleCount++;
				}
			}
		}

	
	}.bind(this), false);




	this.resize();
	this.step();
}

Main.prototype.parseData = function(){
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

Main.prototype.message = function(e){
	var data = e.data.split(',');
	var program = data[0];
	var channel = data[1];
	var value = data[2];
	if( program >= 192 && program <= 195 ) this.selected = channel;
	if( program == 176 ){
		// if( channel == 1 ) this.parent.persona.rings[this.selected].osc = value/127;
		// if( channel == 2 ) this.parent.persona.rings[this.selected].intensity = value/127 * 3;
		// if( channel == 3 ) this.parent.persona.rings[this.selected].frequency = value/127;
		// if( channel == 4 ) this.parent.persona.rings[this.selected].mesh.scale.set( value/127 * 2, value/127 * 2, 1 );
		// if( channel == 5 ) this.parent.persona.rings[this.selected].gaussIt = value/127;
		// if( channel == 6 ) this.parent.persona.rings[this.selected].weightIn = value/127;
		// if( channel == 7 ) this.parent.persona.rings[this.selected].theta = value/127;
		// if( channel == 8 ) this.parent.persona.rings[this.selected].opacity = value/127;
	}
}

Main.prototype.resize = function( e ) {
	var width = this.element.offsetWidth, height = this.element.offsetHeight;
	this.renderer.setSize( width * 2, height * 2 );
	this.renderer.domElement.setAttribute( 'style', 'width:' + width + 'px; height:' + height + 'px;' );
	var camView = { left :  width / -2, right : width / 2, top : height / 2, bottom : height / -2 };
	for ( var prop in camView) this.camera[ prop ] = camView[ prop ];
	this.camera.position.z = 1000;
	this.camera.updateProjectionMatrix( );
}

Main.prototype.step = function( time ) {
	this.time += 0.0001;
	window.requestAnimationFrame( this.step.bind( this ) );
	if( this.mesh ) this.mesh.material.uniforms.time.value = this.time;
	this.renderer.render( this.scene, this.camera );
};

new Main();