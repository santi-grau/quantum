window.THREE = require('three');

var Particles = require('./particles');

var Main = function() {
	// elements
	this.element = document.getElementById('main');
	this.input = document.getElementById('input');

	// properties
	this.maxLetters = this.input.getAttribute('maxlength');
	this.stringLength = 0;
	
	// Three scene
	this.scene = new THREE.Scene();
	this.camera = new THREE.OrthographicCamera();
	this.renderer = new THREE.WebGLRenderer( { alpha : true, antialias : false } );
	this.element.appendChild( this.renderer.domElement );

	// Load data image
	this.debugImage = new Image();
	this.debugImage.src = 'img/df/font.png';
	this.debugImage.addEventListener('load', this.onImageReady.bind(this) );
	
	// listen for keyboard input
	this.input.addEventListener('input', this.inputChange.bind(this) );

	// initialize
	this.resize();
	this.step();
}

Main.prototype.onImageReady = function( e ){
	this.particles = new Particles( this );
	this.scene.add(this.particles.mesh);
}

Main.prototype.inputChange = function( e ){
	if( e.currentTarget.value.length > this.stringLength ) this.particles.addLetter(  e.data.charCodeAt(0) );
	else this.particles.removeLetter();
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
	this.renderer.render( this.scene, this.camera );
};

var root = new Main();