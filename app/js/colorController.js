var ColorController = function( parent, element ){
	this.parent = parent;
	this.element = element;

	this.element.classList.add( 'color' );

	for(var index in this.element.dataset) this[index] = this.element.dataset[index];
	
	var c = this.parent.particles.settings[this.slug] || new THREE.Vector3(0,0,0);
	this.color = [ c.x, c.y, c.z ];

	this.selector = document.createElement( 'span' );
	this.selector.classList.add( 'selector' );
	this.element.appendChild( this.selector );

	this.element.append(this.label);
	
	this.selector.addEventListener('mousedown', this.onMouseDown.bind(this));
	document.addEventListener('mouseup', this.onMouseUp.bind(this));
	document.addEventListener('mousemove', this.onMouseMove.bind(this));

	
	this.update();
}

ColorController.prototype.onMouseDown = function( e ) {
	this.element.classList.add('active');
	this.selecting = true;
};

ColorController.prototype.onMouseMove = function( e ) {
	if( !this.selecting ) return;
	var p = e.clientX - this.element.parentElement.offsetLeft;
	var cp = Math.min( 1, Math.max( 0, p / this.selector.offsetWidth ) );

	var color;
	if( cp < 0.9 ) this.color = chroma( 360 * cp / 0.9, 1, 0.5, 'hsl').gl();
	else this.color = chroma( 0, 0, ( cp - 0.9 ) / 0.1, 'hsl').gl();

	this.update();
};

ColorController.prototype.updateColors = function( color ) {
	var hsl = color.hsl();
	if( hsl[1] > 0 ) {
		this.col1 = chroma( hsl[0], 1, 0.4, 'hsl').hex();
		this.col2 = chroma( hsl[0], 1, 0.25, 'hsl').hex();
	} else {
		if( hsl[2] < 0.5 ) {
			this.col1 = '#444444';
			this.col2 = '#666666';
		} else {
			this.col1 = '#bbbbbb';
			this.col2 = '#666666';
		}
	}

	this.element.style.color = this.col2;
	this.selector.style.borderColor = this.col1;
}
ColorController.prototype.onMouseUp = function( e ) {
	this.selecting = false;
	this.element.classList.remove('active');
};

ColorController.prototype.update = function(){
	
	var color = chroma( this.color[0], this.color[1], this.color[2], 'gl' )
	this.selector.style.background = color.hex()
	

	eventEmitter.emit('updateVals', this.slug, new THREE.Vector3( this.color[0], this.color[1], this.color[2] ) );
}



module.exports = ColorController;