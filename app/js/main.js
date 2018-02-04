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
	this.intro = document.getElementById('intro');

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

	setTimeout( function(){
		this.intro.classList.remove('active')
	}, 4000)
	// initialize
	this.resize();
	this.step();
}

Main.prototype.downloadFile = function(){
	var geoWorker = webWorker( require( './download' ) );
	geoWorker.onmessage = this.downloadReady.bind(this);
	geoWorker.postMessage( JSON.stringify( { attributes : this.particles.geometry.geometry.attributes, settings : this.particles.settings, time : this.particles.time, letters : this.particles.geometry.letters } ) );
}

Main.prototype.downloadReady = function( message ){
	var csvUrl = URL.createObjectURL(message.data);
	var element = document.createElement('a');
	element.setAttribute('href', csvUrl);

	// window.location.href = csvUrl;
	
	element.setAttribute('download', 'Quantum_Letters');
	element.style.display = 'none';
	document.body.appendChild(element);
	element.click();
	document.body.removeChild(element);

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