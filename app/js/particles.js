var Data = require('./data');
var ParticleGeometry = require('./particleGeometry');
var ParticleMaterial = require('./particleMaterial');

var Particles = function( parent, settings ){
	this.parent = parent;
	this.settings = settings || {};

	this.time = 0;

	this.settings.letterRes = this.settings.letterRes || 128; // 32, 64, 128, 256, 512
	this.settings.scale = this.settings.scale || 1; // scale of the letters ( size )
	this.settings.weight = this.settings.weight || 0.5; // weight of letters

	this.settings.speed = this.settings.speed || 0.01;
	this.settings.speedDif = this.settings.speedDif || 0.01;

	this.settings.pointSize = this.settings.pointSize || new THREE.Vector4( 0, 0.2, 1, 15 ); // min size, max size, min range, max range
	this.settings.oscillation = this.settings.oscillation || new THREE.Vector4( 0.1, 0.15, 0, 100 ); // oscillation distance
	this.settings.dispersion = this.settings.dispersion || new THREE.Vector4( 0, 0.25, 0, 100 ); // dispersion distance
	this.settings.color = this.settings.color || new THREE.Vector3( 1, 1, 1 ); // color of particles
	this.settings.backgroundColor = this.settings.backgroundColor || new THREE.Vector3( 0, 0, 0 ); // color of particles

	this.data = new Data( this, require('./../img/serif/font.fnt') );
	this.geometry = new ParticleGeometry( this )
	this.material = new ParticleMaterial( this );
	
	this.mesh = new THREE.Points( this.geometry.geometry, this.material.material );

	eventEmitter.on('updateVals', this.updateVals.bind(this) );
}

Particles.prototype.updateVals = function( key, val ) {
	// console.log(key,val)
	this.settings[key] = val;
};

Particles.prototype.addLetter = function( char ) {
	this.geometry.addLetter( char );
	this.mesh.position.x = -this.geometry.letterOffset / 2;
};

Particles.prototype.removeLetter = function( ) {
	this.geometry.removeLetter( );
	this.mesh.position.x = -this.geometry.letterOffset / 2;
}

Particles.prototype.step = function( time ) {
	this.time += this.settings.speed;
	this.material.step( time );
};

module.exports = Particles;