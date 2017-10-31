window.THREE = require('three');

var Parser = require('./parser');

var vs = require('../shaders/pointsVs.glsl');
var fs = require('../shaders/pointsFs.glsl');

var Main = function() {
	this.element = document.getElementById('main');

	this.font = 'df';
	this.scale = 1;
	
	this.spread = 1;
	this.pointSize = 0;

	this.modSize = 10;
	this.time = 0;

	this.maxLetters = 16;
	this.letterSize = 128; // 32, 64, 128, 256, 512

	if( window.location.href.indexOf('localhost') > 0 ) this.socket = new WebSocket('ws://localhost:8080').addEventListener('message', this.onMessage.bind( this ) );

	// Three scene
	this.scene = new THREE.Scene();
	this.camera = new THREE.OrthographicCamera();
	this.renderer = new THREE.WebGLRenderer( { alpha : true, antialias : false } );
	this.element.appendChild( this.renderer.domElement );


	var size = 10000;
	var divisions = 2;
	var gridHelper = new THREE.GridHelper( size, divisions );
	gridHelper.rotation.x = Math.PI / 2;
	this.scene.add( gridHelper );

	// dataTexture
	// var data = [];
	// var tSize = this.letterSize * Math.sqrt( this.maxLetters );
	// var numParticles = tSize * tSize;
	// for( var i = 0 ; i < numParticles ; i++ ) data.push( Math.random(), Math.random(), Math.random(), Math.random() );
	// var dataTexture = new THREE.DataTexture( new Float32Array( data ) , tSize, tSize, THREE.RGBAFormat, THREE.FloatType );
	// dataTexture.needsUpdate = true;

	// debug datatexture
	// var geometry = new THREE.PlaneBufferGeometry( tSize, tSize );
	// var material = new THREE.MeshBasicMaterial( { map : dataTexture } );
	// var plane = new THREE.Mesh( geometry, material );
	// this.scene.add( plane );
	
	

	this.debugImage = new Image();
	this.debugImage.src = 'img/' + this.font + '/font.png';
	this.debugImage.addEventListener('load', this.onImageReady.bind(this) );
	
	document.addEventListener('keydown', this.onKeydown.bind(this));

	this.resize();
	this.step();
}

Main.prototype.onImageReady = function( e ){

	this.canvas = document.createElement('canvas');
	this.canvas.width  = e.target.width;
	this.canvas.height = e.target.height;
	this.canvas.style.width = e.target.width/4 + 'px'
	this.canvas.style.height = e.target.height/4 + 'px'
	document.body.appendChild(this.canvas);
	this.ctx = this.canvas.getContext('2d');
	this.ctx.drawImage( e.target, 0, 0 );

	var tSize = this.letterSize * Math.sqrt( this.maxLetters );
	var numParticles = tSize * tSize;
	// geometry
	var geometry = new THREE.BufferGeometry();
	var position = [];
	var uv = [];
	var lookup = [];
	var offset = [];
	// var dimensions = [];
	for( var i = 0 ; i < numParticles ; i++ ){
		position.push(0, 0, 0 );
		lookup.push( 0, 0, 0, 0 );
		offset.push( 0, 0, 0, 0 );
	}
	geometry.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array( position ), 3 ) );
	geometry.addAttribute( 'lookup', new THREE.BufferAttribute( new Float32Array( lookup ), 4 ) );
	geometry.addAttribute( 'offset', new THREE.BufferAttribute( new Float32Array( offset ), 4 ) );
	
	this.data = new Parser( this, require('./../img/df/font.fnt') );
	this.xHeight = this.data.chars[ 120 ].height; // get xHeight form x, duh!
	console.log(this.data, this.xHeight)

	var fontTexture = new THREE.Texture( this.debugImage )
	fontTexture.needsUpdate = true;

	console.log(this.data.info.padding.split(',')[1])

	var material = new THREE.ShaderMaterial( {
		uniforms : {
			fontTexture : { value : fontTexture },
			dimensions : { value : new THREE.Vector4( this.data.asset.base, this.data.info.padding.split(',')[0], this.data.info.padding.split(',')[1], null ) },
			dataRes : { value : new THREE.Vector2( this.canvas.width, this.canvas.height ) },
			scale : { value : this.scale }
		},
		transparent : true,
		vertexShader: vs,
		fragmentShader: fs,
		// depthTest:  true,
		// depthWrite: false,
		// blending : THREE.NoBlending
	} );

	this.mesh = new THREE.Points( geometry, material );
	// this.mesh.geometry.setDrawRange( 0, 0 );
	this.scene.add(this.mesh);

	

}

Main.prototype.onKeydown = function( e ){
	var charData = this.data.chars[ e.key.charCodeAt(0) ];
	var imgData = this.ctx.getImageData(charData.x, charData.y, charData.width, charData.height);
	console.log(charData)
	for( var i = 0 ; i < this.letterSize * this.letterSize ; i++ ){
		this.mesh.geometry.attributes.lookup.setXYZW( i, charData.x, charData.y, charData.width, charData.height );
		this.mesh.geometry.attributes.offset.setXYZW( i, charData.xadvance, charData.xoffset, charData.yoffset, 0 );
	}
	this.mesh.geometry.attributes.lookup.needsUpdate = true;
	this.mesh.geometry.attributes.offset.needsUpdate = true;
	
	var ps = [];
	var totalParts = Math.round( this.letterSize * this.letterSize * charData.areaRelative );
	var partsPlaced = 0;
	var safeCount = 0;
	while(partsPlaced < totalParts ){
		var px = Math.random();
		var py = Math.random();
		var val = imgData.data[ ( ( Math.floor( py * charData.height ) * ( imgData.width * 4 ) ) + ( Math.floor( px * charData.width ) * 4 ) ) + 3 ];
		if( val > 0 ) {
			ps.push( { x : px, y : py } );
			this.mesh.geometry.attributes.position.setXY( partsPlaced, px, py );
			partsPlaced++;
		} else {
			safeCount++;
		}
		if( safeCount > 100000 ) break;
	}

	this.mesh.geometry.attributes.position.needsUpdate = true;
	this.mesh.geometry.setDrawRange( 0, totalParts );

}

Main.prototype.onMessage = function(e){
	var data = e.data.split(',');
	var program = data[0];
	var channel = data[1];
	var value = data[2];
	console.log(data)
	if( program == 176 ){
		if( channel == 1 ) this.spread = value / 2;
		if( channel == 2 ) this.pointSize = 10 * ( value / 127 );
	}
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
	// this.time += 0.001;
	window.requestAnimationFrame( this.step.bind( this ) );
	// this.mesh.geometry.attributes.position.needsUpdate = true;
	// this.mesh.material.uniforms.time.value = this.time;
	// this.mesh.material.uniforms.spread.value = this.spread;
	// this.mesh.material.uniforms.pointSize.value = this.pointSize;
	
	// this.mesh.geometry.attributes.position.setXYZ( 0, 0, this.time, 0 );
	// this.mesh.geometry.needsUpdate = true;

	this.renderer.render( this.scene, this.camera );
};

new Main();