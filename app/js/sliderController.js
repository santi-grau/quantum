var SliderController = function( parent, element ){
	this.parent = parent;
	this.element = element;

	this.element.classList.add( 'slider' );
	
	for(var index in this.element.dataset) this[index] = this.element.dataset[index]; 

	var value = this.parent.particles.settings[this.slug].x
	this.min = this.parent.particles.settings[this.slug].y;
	this.max = this.parent.particles.settings[this.slug].z;

	this.selector = document.createElement( 'span' );
	this.selector.classList.add( 'selector' );
	this.element.appendChild( this.selector );

	this.element.append(this.label);
	
	this.bars = [];
	var barsTotal = this.selector.offsetWidth / 5;
	for( var i = 0 ; i < barsTotal ; i++ ){
		this.bars[i] = document.createElement( 'span' );
		this.selector.append(this.bars[i]);
	}

	var range = this.max - this.min;
	this.bar = this.oldBar = Math.round( value * barsTotal );

	this.moveBar = false;

	this.bars[this.bar].classList.add('active');

	this.selector.addEventListener('mousedown', this.onMouseDown.bind(this));
	document.addEventListener('mouseup', this.onMouseUp.bind(this));
	document.addEventListener('mousemove', this.onMouseMove.bind(this));

	this.update();
}

SliderController.prototype.onMouseDown = function( e ) {
	var children = e.target.parentNode.children;
	for ( i = children.length - 1; i >= 0; i--) if (e.target == children[i]) break;
	this.startMovePosition = e.clientX;
	
	this.bar = i;
	this.bars[this.oldBar].classList.remove('active');
	this.bars[this.bar].classList.add('active');
	this.bars[this.oldBar].style.borderLeftColor = this.col1;
	this.bars[this.bar].style.borderLeftColor = this.col2;
	
	this.startMoveValue = i;
	this.oldBar = this.bar;
	this.moveBar = true;
};

SliderController.prototype.onMouseMove = function( e ) {
	if( !this.moveBar ) return;
	var children = e.target.parentNode.children;
	for ( i = children.length - 1; i >= 0; i--) if (e.target == children[i]) break;

	var inc = e.clientX - this.startMovePosition;
	var moveValue = Math.min( this.bars.length - 1, Math.max( 0, this.startMoveValue + Math.round(inc / 5) ) );
	
	this.bar = moveValue;

	this.bars[this.oldBar].classList.remove('active');
	this.bars[this.bar].classList.add('active');
	this.bars[this.oldBar].style.borderLeftColor = this.col1;
	this.bars[this.bar].style.borderLeftColor = this.col2;

	if( this.oldBar !== this.bar ) this.update();
	this.oldBar = this.bar;
};

SliderController.prototype.onMouseUp = function( e ) {
	this.moveBar = false;
};

SliderController.prototype.updateColors = function( color ) {
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
	for( var i = 0 ; i < this.bars.length ; i++ ){
		if( this.bars[i].classList.contains('active')) this.bars[i].style.borderLeftColor = this.col2;
		else this.bars[i].style.borderLeftColor = this.col1;
	}
}

SliderController.prototype.update = function(){
	var value = this.bar / (this.bars.length - 1 );
	eventEmitter.emit('updateVals', this.slug, new THREE.Vector4( value, this.min, this.max ) );
}



module.exports = SliderController;