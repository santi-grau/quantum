var Data = require('./data');
var ParticleGeometry = require('./particleGeometry');
var ParticleMaterial = require('./particleMaterial');

var Particles = function( parent, settings ){
	this.parent = parent;
	this.settings = settings || {};

	this.time = 1;

	this.settings.letterRes = this.settings.letterRes || 64; // 32, 64, 128, 256, 512

	this.settings.scale = this.settings.scale || new THREE.Vector3( 0.33, 0.5, 2 ); // scale of the letters ( size )
	this.settings.weight = this.settings.weight || new THREE.Vector3( 0.5, 0, 1 ); // weight of letters
	this.settings.speed = this.settings.speed || new THREE.Vector3( 0.3, 0, 0.03 );
	this.settings.pointSize = this.settings.pointSize || new THREE.Vector4( 0, 0.2, 1, 15 ); // min size, max size, min range, max range
	this.settings.oscillation = this.settings.oscillation || new THREE.Vector4( 0.1, 0.15, 0, 40 ); // oscillation distance
	this.settings.dispersion = this.settings.dispersion || new THREE.Vector4( 0, 0.1, 0, 200 ); // dispersion distance

	this.settings.color = this.settings.color || new THREE.Vector3( 1, 1, 1 ); // color of particles
	this.settings.backgroundColor = this.settings.backgroundColor || new THREE.Vector3( 0, 0, 0 ); // color of background

	this.data = new Data( this );
	this.geometry = new ParticleGeometry( this )
	this.material = new ParticleMaterial( this );
	
	this.group = new THREE.Object3D();
	this.mesh = new THREE.Points( this.geometry.geometry, this.material.material );
	this.group.add( this.mesh );

	eventEmitter.on('updateVals', this.updateVals.bind(this) );
}

Particles.prototype.updateVals = function( key, val ) {
	this.settings[key] = val;
};

Particles.prototype.addLetter = function( char ) {
	this.geometry.addLetter( char );
};

Particles.prototype.removeLetter = function( ) {
	this.geometry.removeLetter( );
}

Particles.prototype.step = function( time ) {
	this.mesh.position.x = -( this.geometry.letterOffset  * this.settings.scale.x ) / 2;
	this.mesh.position.y = - this.data.asset.base / 4 * this.settings.scale.x;
	this.time += this.settings.speed.x;
	this.material.step( time );
};

module.exports = Particles;