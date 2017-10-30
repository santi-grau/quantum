window.THREE = require('three');

var Parser = require('./parser');

var vs = require('../shaders/pointsVs.glsl');
var fs = require('../shaders/pointsFs.glsl');

var Font = function( parent ){
	this.parent = parent;
}

var Main = function() {
	this.element = document.getElementById('main');
	this.canvas = document.createElement('canvas');
	this.debugImage = new Image();

	this.font = 'font_64';
	this.data = new Parser( require('./../img/font_64/font.fnt') );
	this.xHeight = this.data.chars[ 120 ].height; // get xHeight form x, duh!
	
	this.spread = 1;
	this.pointSize = 0;

	this.modSize = 10;
	this.time = 0;

	if( window.location.href.indexOf('localhost') > 0 ) this.socket = new WebSocket('ws://localhost:8080').addEventListener('message', this.onMessage.bind( this ) );

	// Three scene
	this.scene = new THREE.Scene();
	this.camera = new THREE.OrthographicCamera();
	this.renderer = new THREE.WebGLRenderer( { alpha : true, antialias : false } );
	this.element.appendChild( this.renderer.domElement );

	document.addEventListener('keydown', this.onKeydown.bind(this));
	
	/// bg
	var geometry = new THREE.BufferGeometry();

	var numParticles = 512 * 512;

	var position = [];
	for( var i = 0 ; i < numParticles ; i++ ) position.push( 0, 0, Math.random() * 100 );
	geometry.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array( position ), 3 ) );

	
	var material = new THREE.ShaderMaterial( {
		uniforms : {
			res : { value : new THREE.Vector2( this.element.offsetWidth, this.element.offsetWidth ) },
			modSize : { value : this.modSize },
			time : { value : 0 },
			spread : { value : this.spread },
			pointSize : { value : this.pointSize }
		},
		transparent : true,
		vertexShader: vs,
		fragmentShader: fs,
		depthTest:  true,
		depthWrite: false,
		// blending : THREE.NoBlending
	} );

	var size = 1000;
	var divisions = size / this.modSize;

	var gridHelper = new THREE.GridHelper( size, divisions );
	gridHelper.rotation.x = Math.PI / 2;
	
	this.scene.add( gridHelper );


	this.mesh = new THREE.Points( geometry, material );
	this.mesh.geometry.setDrawRange( 0, 0 );
	this.scene.add(this.mesh);	
	
	
	this.debugImage.src = 'img/' + this.font + '/font.png';
	
	this.debugImage.addEventListener('load', this.onImageReady.bind(this) );
	
	this.resize();
	this.step();
}

Main.prototype.onImageReady = function( e ){
	console.log('ready')
	this.canvas.width  = e.target.width;
	this.canvas.height = e.target.height;
	this.canvas.style.width = e.target.width/2 + 'px'
	this.canvas.style.height = e.target.height/2 + 'px'
	// document.body.appendChild(this.canvas);
	this.ctx = this.canvas.getContext('2d');

	this.ctx.drawImage( e.target, 0, 0 );
}

Main.prototype.onKeydown = function( e ){
	var charData = this.data.chars[ e.key.charCodeAt(0) ];
	var imgData = this.ctx.getImageData(charData.x, charData.y, charData.width, charData.height);
	
	// console.log(this.data.info)
	console.log(charData)
	var p = 0;
	var alpha = [];
	for( var i = 3 ; i < imgData.data.length ; i+=4 ){
		alpha.push( imgData.data[i] );
		p += imgData.data[i];
	}

	var particleCount = 0;

	for( var y = 0 ; y < imgData.height ; y++ ){
		for( var x = 0 ; x < imgData.width ; x++ ){
			this.mesh.geometry.attributes.position.setXY( particleCount, x, y );
			var val = imgData.data[ ( ( y * ( imgData.width * 4 ) ) + ( x * 4 ) ) + 3 ];
			for( var z = 0 ; z < val ; z++ ){
				this.mesh.geometry.attributes.position.setXY( particleCount, this.modSize * x + this.modSize / 2, -this.modSize * y - this.modSize / 2 );
				particleCount++;
			}
		}
	}
	
	console.log( particleCount )
	this.mesh.position.x = -parseInt( charData.width ) * this.modSize * 0.5
	this.mesh.position.y = ( charData.height - this.xHeight / 2 ) * this.modSize
	this.mesh.geometry.setDrawRange( 0, particleCount );

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
	this.time += 0.001;
	window.requestAnimationFrame( this.step.bind( this ) );
	this.mesh.geometry.attributes.position.needsUpdate = true;
	this.mesh.material.uniforms.time.value = this.time;
	this.mesh.material.uniforms.spread.value = this.spread;
	this.mesh.material.uniforms.pointSize.value = this.pointSize;
	
	// this.mesh.geometry.attributes.position.setXYZ( 0, 0, this.time, 0 );
	// this.mesh.geometry.needsUpdate = true;

	this.renderer.render( this.scene, this.camera );
};

new Main();