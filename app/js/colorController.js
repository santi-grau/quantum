var chroma = require('chroma-js');

var ColorController = function( parent, element ){
	this.parent = parent;
	this.element = element;

	this.element.classList.add( 'color' );

	for(var index in this.element.dataset) this[index] = this.element.dataset[index]; 
	this.color = new THREE.Vector3( this.r, this.g, this.b );

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
	this.selecting = true;
};

ColorController.prototype.onMouseMove = function( e ) {
	if( !this.selecting ) return;
	var p = e.clientX - this.element.parentElement.offsetLeft;
	var cp = Math.min( 1, Math.max( 0, p / this.selector.offsetWidth ) );

	var color;
	if( cp < 0.9 ) this.color = chroma( 360 * cp / 0.9, 1, 0.5, 'hsl').gl();
	else this.color = chroma( 0, 1, ( cp - 0.9 ) / 0.1, 'hsl').gl();

	this.update();
};

ColorController.prototype.onMouseUp = function( e ) {
	this.selecting = false;
};

ColorController.prototype.update = function(){
	// eventEmitter.emit('updateVals', this.slug, new THREE.Vector3( this.color[0], this.color[1], this.color[2] ) );
}



module.exports = ColorController;