var RangeController = function( parent, element ){
	this.parent = parent;
	this.element = element;

	this.element.classList.add( 'range' );
	
	for(var index in this.element.dataset) this[index] = this.element.dataset[index]; 

	this.selector = document.createElement( 'span' );
	this.selector.classList.add( 'selector' );
	this.element.appendChild( this.selector );

	this.hBar = document.createElement( 'span' );
	this.hBar.classList.add('hBar');
	this.element.appendChild( this.hBar );

	this.element.append(this.label);
	
	this.bars = [];
	var barsTotal = this.selector.offsetWidth / 5;
	for( var i = 0 ; i < barsTotal ; i++ ){
		this.bars[i] = document.createElement( 'span' );
		this.selector.append(this.bars[i]);
	}

	var range = this.max - this.min;
	
	this.minBar = Math.round( ( this.valuemin - this.min ) / range * barsTotal );
	this.maxBar = Math.round( ( this.valuemax - this.min ) / range * barsTotal );
	this.moveBar = null;

	this.bars[this.minBar].classList.add('active');
	this.bars[this.maxBar].classList.add('active');

	this.selector.addEventListener('mousedown', this.onMouseDown.bind(this));
	document.addEventListener('mouseup', this.onMouseUp.bind(this));
	document.addEventListener('mousemove', this.onMouseMove.bind(this));

	this.update();
}

RangeController.prototype.onMouseDown = function( e ) {
	var children = e.target.parentNode.children;
	for ( i = children.length - 1; i >= 0; i--) if (e.target == children[i]) break;
	this.startMovePosition = e.clientX;
	
	if( i < this.minBar + 2 || i > this.maxBar - 2 ) this.startMoveValue = i;
	if( i < this.minBar + 2 ) this.moveBar = 'minBar'; // move min value
	if( i > this.maxBar - 2 ) this.moveBar = 'maxBar'; // move max value
};

RangeController.prototype.onMouseMove = function( e ) {
	if( !this.moveBar ) return;
	var children = e.target.parentNode.children;
	for ( i = children.length - 1; i >= 0; i--) if (e.target == children[i]) break;

	var inc = e.clientX - this.startMovePosition;
	var moveValue = Math.min( this.bars.length - 1, Math.max( 0, this.startMoveValue + Math.round(inc / 5) ) );
	
	if( ( this.moveBar == 'minBar' && moveValue >= this.maxBar ) || ( this.moveBar == 'maxBar' && moveValue < this.minBar + 1 ) ) return;
	
	this.bars[this[this.moveBar]].classList.remove('active');
	this.bars[moveValue].classList.add('active');
	this[this.moveBar] = moveValue;

	if( this.oldMinBar !== this.minBar || this.oldMaxBar !== this.maxBar ) this.update();
	this.oldMinBar = this.minBar;
	this.oldMaxBar = this.maxBar;
};

RangeController.prototype.update = function(){

	var minValue = this.minBar / (this.bars.length - 1 );
	var maxValue = this.maxBar / (this.bars.length - 1 );

	eventEmitter.emit('updateVals', this.slug, new THREE.Vector4( minValue, maxValue, this.min, this.max ) );

	this.hBar.style.width = ( this.maxBar - this.minBar ) * 5 + 'px';
	this.hBar.style.left = ( this.minBar ) * 5 + 'px';
}

RangeController.prototype.onMouseUp = function( e ) {
	this.moveBar = null;
};

module.exports = RangeController;