var ParticleGeometry = function( parent ){
	this.parent = parent;

	this.letterOffset = 0;
	this.letters = [];

	var tSize = this.parent.settings.letterRes * Math.sqrt( this.parent.parent.maxLetters );
	this.letterParticles = tSize * tSize;
	var geometry = new THREE.BufferGeometry();
	var position = [];
	var lookup = [];
	var transform = [];
	var seeds = [];
	
	for( var i = 0 ; i < this.letterParticles ; i++ ){
		position.push( 0, 0, 0 );
		lookup.push( 0, 0, 0, 0 );
		transform.push( 0, 0, Math.random(), Math.random() );
		seeds.push( Math.random(), Math.random(), Math.random(), Math.random() );
	}
	geometry.addAttribute( 'position', new THREE.BufferAttribute( new Float32Array( position ), 3 ) );
	geometry.addAttribute( 'lookup', new THREE.BufferAttribute( new Float32Array( lookup ), 4 ) );
	geometry.addAttribute( 'transform', new THREE.BufferAttribute( new Float32Array( transform ), 4 ) );
	geometry.addAttribute( 'seeds', new THREE.BufferAttribute( new Float32Array( seeds ), 4 ) );
	geometry.setDrawRange( 0, 0 );

	this.geometry = geometry;
}

ParticleGeometry.prototype.addLetter = function( char ) {
	var charData = this.parent.data.chars[ char ];

	var kerning = 0;
	if( this.letters.length ){
		var prevLetter = this.letters[this.letters.length-1];
		if( this.parent.data.kerning[prevLetter.id] ) kerning = this.parent.data.kerning[prevLetter.id][charData.id] || 0;
	}

	this.letterOffset += parseInt(kerning) +  parseInt( charData.xoffset )

	this.letters.push( charData );

	var totalLetters = this.parent.parent.input.value.length;

	var particles = this.parent.settings.letterRes * this.parent.settings.letterRes;
	var particleOffset = this.parent.settings.letterRes * this.parent.settings.letterRes * ( this.parent.parent.stringLength );

	for( var i = 0 ; i < particles ; i++ ){
		this.geometry.attributes.lookup.setXYZW( particleOffset + i, charData.x, charData.y, charData.width, charData.height );
		this.geometry.attributes.transform.setXY( particleOffset + i, this.letterOffset, charData.yoffset );
	}
	this.geometry.attributes.lookup.needsUpdate = true;
	this.geometry.attributes.transform.needsUpdate = true;
	
	var totalParts = Math.round( particles * charData.areaRelative );
	var partsPlaced = 0;
	var safeCount = 0;
	while(partsPlaced < totalParts ){
		var px = Math.random();
		var py = Math.random();
		var val = charData.imgData.data[ ( ( Math.floor( py * charData.height ) * ( charData.imgData.width * 4 ) ) + ( Math.floor( px * charData.width ) * 4 ) ) + 3 ];
		if( val > 0 ) this.geometry.attributes.position.setXY( particleOffset + (partsPlaced++), px, py );
		else safeCount++;
		if( safeCount > 100000 ) break;
	}
	for( var i = partsPlaced ; i < this.parent.settings.letterRes * this.parent.settings.letterRes ; i++ ){
		this.geometry.attributes.position.setXY( particleOffset + i, 0, 0 );
	}

	this.geometry.attributes.position.needsUpdate = true;
	this.geometry.setDrawRange( 0, this.parent.settings.letterRes * this.parent.settings.letterRes * totalLetters );

	this.letterOffset += parseInt( charData.width );
};

ParticleGeometry.prototype.removeLetter = function( ) {
	var totalLetters = this.parent.parent.input.value.length;
	var charData = this.letters.pop( );
	
	this.letterOffset -= parseInt( charData.xadvance );
	
	this.geometry.setDrawRange( 0, this.parent.settings.letterRes * this.parent.settings.letterRes * totalLetters );
}

module.exports = ParticleGeometry;