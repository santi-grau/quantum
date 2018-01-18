var vs = require('../shaders/pointsVs.glsl');
var fs = require('../shaders/pointsFs.glsl');


var ParticleMaterial = function( parent ){
	this.parent = parent;

	var fontTexture = new THREE.Texture( this.parent.parent.dataTexture )
	fontTexture.needsUpdate = true;

	var pointTexture = new THREE.TextureLoader().load('img/points.png');
	pointTexture.magFilter = THREE.NearestFilter;
	pointTexture.minFilter = THREE.NearestFilter;

	var material = new THREE.ShaderMaterial( {
		uniforms : {
			fontTexture : { value : fontTexture },
			pointTexture : { value : pointTexture },
			fontTexRes : { value : new THREE.Vector2( this.parent.parent.dataTexture.width, this.parent.parent.dataTexture.height ) },
			dimensions : { value : new THREE.Vector4( this.parent.data.asset.base, this.parent.data.info.padding.split(',')[0], this.parent.data.info.padding.split(',')[1], this.parent.parent.scale ) },
			oscillation : { value : this.parent.settings.oscillation },
			pointSize : { value : this.parent.settings.pointSize },
			dispersion : { value : this.parent.settings.dispersion },
			color : { value : this.parent.settings.color },
			settings : { value : new THREE.Vector4( this.parent.time, this.parent.settings.scale.x, this.parent.settings.weight.x, 0 ) }
		},
		transparent : true,
		vertexShader: vs,
		fragmentShader: fs,
		depthTest : false,
		depthWrite : false
	} );

	this.material = material;
}

ParticleMaterial.prototype.step = function( time ){
	this.material.uniforms.settings.value = new THREE.Vector4( this.parent.time, this.parent.settings.scale.x, this.parent.settings.weight.x, 0 );
	this.material.uniforms.pointSize.value = this.parent.settings.pointSize;
	this.material.uniforms.oscillation.value = this.parent.settings.oscillation;
	this.material.uniforms.dispersion.value = this.parent.settings.dispersion;
	this.material.uniforms.color.value = this.parent.settings.color;
}

module.exports = ParticleMaterial;