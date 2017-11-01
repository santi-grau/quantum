var Data = require('./data');

var vs = require('../shaders/pointsVs.glsl');
var fs = require('../shaders/pointsFs.glsl');

var Particles = function( parent, settings ){
	this.parent = parent;
	this.settings = settings || {};

	this.scale = this.settings.scale || 1;
	this.letterRes = this.settings.letterRes || 128; // 32, 64, 128, 256, 512

	var image = this.parent.debugImage;
	var canvas = document.createElement('canvas');
	canvas.width = image.width;
	canvas.height = image.height;
	this.ctx = canvas.getContext('2d');
	this.ctx.drawImage( image, 0, 0 );

	this.data = new Data( this, require('./../img/df/font.fnt') );

	var tSize = this.letterRes * Math.sqrt( this.parent.maxLetters );
	this.letterParticles = tSize * tSize;
	var geometry = new THREE.BufferGeometry();
	var position = [];
	var lookup = [];
	var offset = [];
	for( var i = 0 ; i < this.letterParticles ; i++ ){
		position.push(0, 0, 0 );
		lookup.push( 0, 0, 0, 0 );
		offset.push( 0, 0 );
	}
	geometry.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array( position ), 3 ) );
	geometry.addAttribute( 'lookup', new THREE.BufferAttribute( new Float32Array( lookup ), 4 ) );
	geometry.addAttribute( 'offset', new THREE.BufferAttribute( new Float32Array( offset ), 2 ) );
	
	var fontTexture = new THREE.Texture( this.parent.debugImage )
	fontTexture.needsUpdate = true;

	var material = new THREE.ShaderMaterial( {
		uniforms : {
			fontTexture : { value : fontTexture },
			fontTexRes : { value : new THREE.Vector2( canvas.width, canvas.height ) },
			dimensions : { value : new THREE.Vector4( this.data.asset.base, this.data.info.padding.split(',')[0], this.data.info.padding.split(',')[1], this.parent.scale ) }
		},
		transparent : true,
		vertexShader: vs,
		fragmentShader: fs
	} );

	this.mesh = new THREE.Points( geometry, material );
	this.mesh.geometry.setDrawRange( 0, 0 );
}

Particles.prototype.addLetter = function( char ) {
	var charData = this.data.chars[ char ];
	var imgData = this.ctx.getImageData(charData.x, charData.y, charData.width, charData.height);
	console.log(charData)


	var particles = this.letterRes * this.letterRes;
	var particleOffset = this.letterRes * this.letterRes * ( this.parent.stringLength );

	for( var i = 0 ; i < particles ; i++ ){
		this.mesh.geometry.attributes.lookup.setXYZW( particleOffset + i, charData.x, charData.y, charData.width, charData.height );
		this.mesh.geometry.attributes.offset.setXY( particleOffset + i, 100 * this.parent.stringLength, charData.yoffset );
	}
	this.mesh.geometry.attributes.lookup.needsUpdate = true;
	this.mesh.geometry.attributes.offset.needsUpdate = true;
	
	var totalParts = Math.round( particles * charData.areaRelative );
	var partsPlaced = 0;
	var safeCount = 0;
	while(partsPlaced < totalParts ){
		var px = Math.random();
		var py = Math.random();
		var val = imgData.data[ ( ( Math.floor( py * charData.height ) * ( imgData.width * 4 ) ) + ( Math.floor( px * charData.width ) * 4 ) ) + 3 ];
		if( val > 0 ) {
			this.mesh.geometry.attributes.position.setXY( particleOffset + partsPlaced, px, py );
			partsPlaced++;
		} else {
			safeCount++;
		}
		if( safeCount > 100000 ) break;
	}
	for( var i = partsPlaced ; i < this.letterRes * this.letterRes ; i++ ){
		this.mesh.geometry.attributes.position.setXY( particleOffset + i, 0, 0 );
	}

	console.log( this.parent.stringLength )
	this.mesh.geometry.attributes.position.needsUpdate = true;
	this.mesh.geometry.setDrawRange( 0, this.letterRes * this.letterRes * (this.parent.stringLength + 1) );
};

Particles.prototype.removeLetter = function( ) {
	this.mesh.geometry.setDrawRange( 0, 0 );
}

module.exports = Particles;