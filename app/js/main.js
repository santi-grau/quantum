window.THREE = require('three');
var ee = require('event-emitter');
window.eventEmitter = new ee();
window.chroma = require('chroma-js');

var Particles = require('./particles');
var RangeController = require('./rangeController');
var ColorController = require('./colorController');

var Main = function() {
	// elements
	this.element = document.getElementById('main');
	this.input = document.getElementById('input');

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
	this.dataTexture.src = 'img/serif/font.png';
	this.dataTexture.addEventListener('load', this.onImageReady.bind(this) );
	
	// listen for keyboard input
	this.input.addEventListener('input', this.inputChange.bind(this) );

	eventEmitter.on('updateVals', this.updateVals.bind(this) );

	// initialize
	this.resize();
	this.step();
}

Main.prototype.updateVals = function( key, val ) {
	if(key == 'backgroundColor'){
		var color = chroma( val.x, val.y, val.z, 'gl' );
		document.body.style.backgroundColor = color.hex();
		for( var i = 0 ; i < this.controllers.length ; i++ ) this.controllers[i].updateColors( color );
	}
};

Main.prototype.onImageReady = function( e ){
	this.particles = new Particles( this );
	this.scene.add(this.particles.mesh);

	var value = this.input.value.split('');
	for( var i = 0 ; i < value.length ; i++ ){
		this.particles.addLetter(  value[i].charCodeAt(0) )
		this.stringLength++;
	}

	var controllers = document.getElementsByClassName( 'controller' );
	for( var i = 0 ; i < controllers.length; i++ ) {
		if( controllers[i].dataset.type == 'range' ) this.controllers.push( new RangeController( this, controllers[i] ) );
		else if( controllers[i].dataset.type == 'color' ) this.controllers.push( new ColorController( this, controllers[i] ) );
	}
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